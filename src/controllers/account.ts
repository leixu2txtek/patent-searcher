import Router from 'koa-router';
import { Context } from 'koa';
import { DI } from '../app';
import { Account } from '../entities/account';
import { randomUUID } from 'crypto';
import { QueryBuilder } from '@mikro-orm/better-sqlite';
import { AccountLoginDto } from '../dto/account-query-dto';
import { deserialize } from 'class-transformer';
import { SignJWT } from 'jose';

const router = new Router();
const secret = new TextEncoder().encode('cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2');

router.prefix('/v1/pt/account');
router.post('/create', async (ctx: Context) => {

    const query = deserialize(AccountLoginDto, JSON.stringify(ctx.request.body));
    if (!query.name || !query.number || !query.password) {

        ctx.status = 400;
        ctx.body = { message: '用户名、手机号、密码不能为空' };
        return;
    }

    const account = await DI.em.findOneOrFail(Account, { number: query.number, password: query.password });
    if (!account) {

        const account = new Account(query.name, query.number, query.password);
        DI.em.persist(account);
    }

    ctx.status = 200;
    ctx.body = { message: '注册成功' };
});

export { router };
