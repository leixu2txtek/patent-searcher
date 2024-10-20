import Router from 'koa-router';
import { Context } from 'koa';
import { DI } from '../app';
import { Account } from '../entities/account';
import { randomUUID } from 'crypto';
import { QueryBuilder } from '@mikro-orm/better-sqlite';
import { LoginAccountDto, RegisterAccountDto } from '../dto/account-query-dto';
import { deserialize } from 'class-transformer';
import { SignJWT } from 'jose';
import { JWT_SECRET } from '../config';

const router = new Router();
const secret = new TextEncoder().encode(JWT_SECRET);

router.prefix('/v1/pb/auth');
router.post('/login', async (ctx: Context) => {

    const query = deserialize(LoginAccountDto, JSON.stringify(ctx.request.body));
    if (!query.username || !query.password) {

        ctx.status = 400;
        ctx.body = { message: '用户名或密码不能为空' };
        return;
    }

    if (!query.code) {

        ctx.status = 400;
        ctx.body = { message: '验证码不能为空' };
        return;
    }

    const account = await DI.em.findOne(Account, {
        $or: [
            { mobile: query.username },
            { email: query.username }
        ],
        password: query.password
    });

    if (!account) {

        ctx.status = 401;
        ctx.body = { message: '用户名或密码错误' };
        return;
    }

    const token = await new SignJWT({ id: account.id, mobile: account.mobile, email: account.email, name: account.name })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('http://localhost')
        .setAudience('http://localhost')
        .setExpirationTime('2h')
        .sign(secret);

    ctx.status = 200;
    ctx.body = {
        message: '登录成功',
        token,
        name: account.name
    };
});

router.post('/register', async (ctx: Context) => {

    const query = deserialize(RegisterAccountDto, JSON.stringify(ctx.request.body));
    if (!query.name) {

        ctx.status = 400;
        ctx.body = { message: '用户名不能为空' };
        return;
    }

    if (!query.mobile || !query.email || !query.password) {

        ctx.status = 400;
        ctx.body = { message: '手机号或邮箱或密码不能为空' };
        return;
    }

    const result = await DI.em.findOne(Account, { $or: [{ mobile: query.mobile }, { email: query.email }] });
    if (result) {

        ctx.status = 400;
        ctx.body = { message: '手机号/邮箱已存在' };
        return;
    }

    const account = new Account(query.name, query.mobile, query.password);
    account.id = randomUUID();
    account.email = query.email;
    account.creatorId = 'admin';

    await DI.em.persist(account).flush();

    ctx.status = 200;
    ctx.body = { message: '注册成功' };
});

router.post('/password/modify', async (ctx: Context) => {

});

export { router };
