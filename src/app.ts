import 'reflect-metadata';

import Koa from 'koa';
import { koaBody as BodyParser } from 'koa-body';
import { join } from 'path';
import { readdirSync } from 'fs';
import { EntityManager, MikroORM } from '@mikro-orm/better-sqlite';
import jwt from 'koa-jwt';
import dotenv from 'dotenv';

// Init config
dotenv.config({ path: join(__dirname, 'config', `.env.${process.env.NODE_ENV || 'development'}`) });

console.log(join(__dirname, 'config', `.env.${process.env.NODE_ENV || 'development'}`));

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is required.');

const app = new Koa();
const PORT = process.env.PORT || 8080;

const staticPath = join(__dirname, './');
const uploadDir = join(staticPath, 'uploads');

app.use(BodyParser({ multipart: true, formidable: { uploadDir, maxFileSize: 1024 * 1024 * 1024 } }));
app.use(jwt({ secret: JWT_SECRET }).unless({ path: /^\/v\d+\/pb/ }));

// 加载路由
{
  const routes = readdirSync(join(__dirname, 'controllers')).filter(file => file.endsWith('.js'));
  routes.forEach(async (file) => {
    try {

      const { router } = require(join(__dirname, 'controllers', file));
      app.use(router.routes());
    } catch (error) {

      console.error(`Failed to load route ${file}:`, error);
    }
  });
}

export const DI = {} as {
  orm: MikroORM,
  em: EntityManager
};

(async () => {

  // CLI config will be used automatically
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;

  await DI.orm.schema.updateSchema();

  app.listen(PORT, () => {

    console.log(`Server listening on port: ${PORT}`);
  });
})();
