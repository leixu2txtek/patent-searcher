import Router from 'koa-router';
import { Context } from 'koa';
import { DI } from '../app';
import { Account } from '../entities/account';
import { RegisterAccountDto } from '../dto/account-query-dto';
import { deserialize } from 'class-transformer';

const router = new Router();

router.prefix('/v1/pt/account');
router.post('/create', async (ctx: Context) => {

    const query = deserialize<RegisterAccountDto>(RegisterAccountDto, JSON.stringify(ctx.request.body));
    if (!query.name || !query.mobile || !query.password) {

        ctx.status = 400;
        ctx.body = { message: '用户名、手机号、密码不能为空' };
        return;
    }

    const account = await DI.em.findOneOrFail(Account, { mobile: query.mobile, password: query.password });
    if (!account) {

        const account = new Account(query.name, query.mobile, query.password);
        DI.em.persist(account);
    }

    ctx.status = 200;
    ctx.body = { message: '注册成功' };
});

export { router };
