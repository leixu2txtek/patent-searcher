import Router from 'koa-router';
import { Context } from 'koa';
import xlsx from 'node-xlsx';
import type { Files, File } from 'formidable';
import DataTable from '../common/data-table';
import { DI } from '../app';
import { Patent, PatentStatus, PatentType } from '../entities/patent';
import { randomUUID } from 'crypto';
import { QueryBuilder } from '@mikro-orm/better-sqlite';
import { PatentQueryDto } from '../dto/patent-query-dto';
import { deserialize } from 'class-transformer';

const router = new Router();
const FileField: string = 'file';

router.get('/', async (ctx: Context) => {

    const query = deserialize(PatentQueryDto, JSON.stringify(ctx.query));

    const builder: QueryBuilder<Patent> = DI.em.createQueryBuilder(Patent);
    builder.select('*').where("1 = 1");

    if (query.name) builder.andWhere({ name: { $like: `%${query.name}%` } });
    if (query.number) builder.andWhere({ number: query.number });
    if (query.price) builder.andWhere({ price: { $gte: query.getPriceOfMin(), $lt: query.getPriceOfMax() } });

    builder.orderBy({ createdAt: 'DESC' }).limit(query.size).offset((query.page - 1) * query.size);

    const result = await builder.getResultList();

    ctx.status = 200;
    ctx.body = result;
});

router.post('/import', async (ctx: Context) => {

    const body: Files | undefined = ctx.request.files;

    if (!body || !body.hasOwnProperty(FileField)) {

        ctx.body = '要解析的EXCEL文件不能为空';
        ctx.status = 400;
        return;
    }

    const file: File = body[FileField] as File;
    const result = xlsx.parse(file.filepath, { cellDates: true });

    // 默认只获取第一个sheet 页的数据
    const sheet = result[0];
    if (sheet.data.length <= 1) {

        ctx.body = '文件解析失败，第一个SHEET数据为空';
        ctx.status = 400;
        return;
    }

    const header: any = sheet.data[0];
    const data: any = sheet.data.slice(1);  // 去掉第一行

    const datatable: DataTable = new DataTable(header, data);

    const patents: Array<Patent> = new Array<Patent>();
    data.forEach((x: any, i: number) => {

        const patent = new Patent(datatable.getColumnValueWithKeyAndRowIndex('专利名称', i));
        patent.id = randomUUID();
        patent.number = datatable.getColumnValueWithKeyAndRowIndex('专利号', i);

        patent.type = datatable.getColumnValueWithKeyAndRowIndex('专利类型', i) === '发明专利' ? PatentType.PATENT : PatentType.MODEL;
        patent.status = datatable.getColumnValueWithKeyAndRowIndex('专利状态', i) === '未下证' ? PatentStatus.NOT_ISSUED : PatentStatus.ISSUED;
        patent.price = datatable.getColumnValueWithKeyAndRowIndex('指导价', i);
        patent.deadline = datatable.getColumnValueWithKeyAndRowIndex('缴费截止日期', i);

        patent.reported = datatable.getColumnValueWithKeyAndRowIndex('是否报过项目', i) === '是';
        patent.domain = datatable.getColumnValueWithKeyAndRowIndex('领域', i);
        patent.remark = datatable.getColumnValueWithKeyAndRowIndex('备注', i);

        patent.creatorId = randomUUID();
        patent.updatorId = randomUUID();

        patents.push(patent);
    });

    try {

        await DI.em.persist(patents).flush();
    } catch (error: any) {

        console.error(error);
        if (error.code === 'SQLITE_CONSTRAINT') {

        }

        ctx.body = '导入失败';
        ctx.status = 500;
        return;
    }

    ctx.status = 200;
    ctx.body = { message: '导入成功' };
});

export { router };
