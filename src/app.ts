import 'reflect-metadata';

import Koa from 'koa';
import { koaBody as BodyParser } from 'koa-body';
import { join } from 'path';
import { readdirSync } from 'fs';
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/better-sqlite';

const app = new Koa();
const PORT = process.env.PORT || 8080;

const staticPath = join(__dirname, './');
const uploadDir = join(staticPath, 'uploads');

app.use(BodyParser({ multipart: true, formidable: { uploadDir, maxFileSize: 1024 * 1024 * 1024 } }));

// 加载路由
{
  const routes = readdirSync(join(__dirname, 'controllers')).filter(file => file.endsWith('.ts'));
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
  DI.orm = await MikroORM.init(); // CLI config will be used automatically
  DI.em = DI.orm.em;

  await DI.orm.schema.updateSchema();

  app.listen(PORT, () => {

    console.log(`Server listening on port: ${PORT}`);
  });
})();
