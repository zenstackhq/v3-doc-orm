import { definePlugin } from '@zenstackhq/orm';
import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

async function main() {
  const db = await createClient();

  // intercept all models and all operations
  const db1 = db.$use(
    definePlugin({
      id: 'cost-logger',
      onQuery: async ({ model, operation, args, proceed }) => {
        const start = Date.now();
        const result = await proceed(args);
        console.log(`[cost] ${model} ${operation} took ${Date.now() - start}ms`);
        return result;
      }
    })
  );

  await createUsersAndPosts(db1);

  // modify query args
  const db2 = db.$use(
    definePlugin({
      id: 'viewCount-incrementer',
      onQuery: async ({ args, proceed }) => {
        const argsObj = args as any;
        const updatedArgs = {
          ...argsObj,
          data: {
            ...argsObj.data,
            viewCount: 10
          }
        };
        return proceed(updatedArgs);
      }
    })
  );
  console.log('Post created with incremented viewCount');
  console.log(await db2.post.create({ data: { title: 'New Post' } }));
}

main();
