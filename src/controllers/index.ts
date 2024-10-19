import Router from 'koa-router';
import { Context } from 'koa';
import xlsx from 'node-xlsx';
import type { Files, File } from 'formidable';
import DataTable from '../common/data-table';
import { DI } from '../app';
import { Patent, PatentStatus, PatentStatusText, PatentType, PatentTypeText } from '../entities/patent';
import { randomUUID } from 'crypto';
import { QueryBuilder } from '@mikro-orm/better-sqlite';
import { PatentQueryDto } from '../dto/patent-query-dto';
import { deserialize } from 'class-transformer';

const router = new Router();
const FileField: string = 'file';
const TASKS: Array<{ id: string, total: number, current: number, status: number, message: string }> = [];

router.prefix('/v1/pt/patent');

router.get('/list', async (ctx: Context) => {

    const query = deserialize(PatentQueryDto, JSON.stringify(ctx.query));

    let builder: QueryBuilder<Patent> = DI.em.createQueryBuilder(Patent);
    builder.select('*').where("1 = 1");

    if (query.keyword) {

        builder.where({
            $or: [
                { number: { $like: `%${query.keyword}%` } },
                { name: { $like: `%${query.keyword}%` } },
                { domain: { $like: `%${query.keyword}%` } },
                { remark: { $like: `%${query.keyword}%` } }
            ]
        });
    }

    if (query.name) builder.andWhere({ name: { $like: `%${query.name}%` } });
    if (query.number) builder.andWhere({ number: query.number });
    if (query.price) builder.andWhere({ price: { $gte: query.getPriceOfMin(), $lt: query.getPriceOfMax() } });

    // 获取总数
    const total = await builder.clone().count();
    if (total > 0) query.page = Math.min(query.page, Math.ceil(total / query.size));

    builder.orderBy({ createdAt: 'DESC' }).limit(query.size).offset((query.page - 1) * query.size);
    const result = await builder.getResult();
    const patents: Array<any> = [];

    patents.push(...result.map(x => ({
        id: x.id,
        name: x.name,
        number: x.number,
        type: PatentTypeText[x.type].name,
        status: PatentStatusText[x.status].name,
        price: x.price,
        deadline: x.deadline,
        reported: x.reported,
        domain: x.domain,
        remark: x.remark,
        createdAt: x.createdAt
    })));

    ctx.status = 200;
    ctx.body = {
        pagination: {
            total,
            page: query.page,
            size: query.size
        },
        data: patents
    };
});

router.post('/import', async (ctx: Context) => {

    const body: Files | undefined = ctx.request.files;

    if (!body || !body.hasOwnProperty(FileField)) {

        ctx.body = '要解析的EXCEL文件不能为空';
        ctx.status = 400;
        return;
    }

    const id = randomUUID();
    new Promise(async (resolve, reject) => {

        const task = {
            id,
            status: 0,
            message: '',
            total: 0,
            current: 0
        };

        TASKS.push(task);
        const file: File = body[FileField] as File;
        const result = xlsx.parse(file.filepath, { cellDates: true });

        // 默认只获取第一个sheet 页的数据
        const sheet = result[0];
        if (sheet.data.length <= 1) {

            task.message = '文件解析失败，第一个SHEET数据为空';
            return;
        }

        task.status = 1;

        const header: any = sheet.data[0];
        const data: any = sheet.data.slice(1);  // 去掉第一行
        task.total = data.length;

        const datatable: DataTable = new DataTable(header, data);
        const patents: Array<Patent> = new Array<Patent>();

        try {

            data.forEach((x: any, i: number) => {

                task.current = i;
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

            await DI.em.persist(patents).flush();
            task.status = 2;
        } catch (error: any) {

            console.error(error);
            task.message = error.message;
            task.status = 3;
        }
    });

    ctx.body = id;
    ctx.status = 200;
});

router.get('/status/:id', async (ctx: Context) => {

    const { id } = ctx.params;
    const task = TASKS.find((task: any) => task.id === id);
    if (!task) return ctx.status = 400;

    if (task.total === task.current) {

        TASKS.splice(TASKS.indexOf(task), 1);
    }

    ctx.body = task;
    ctx.status = 200;
});

export { router };
