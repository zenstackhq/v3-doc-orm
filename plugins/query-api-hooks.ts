import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

async function main() {
  const db = await createClient();

  // intercept all models and all operations
  const db1 = db.$use({
    id: 'cost-logger',
    onQuery: {
      $allModels: {
        $allOperations: async ({ model, operation, args, query }) => {
          const start = Date.now();
          const result = await query(args);
          console.log(`[cost] ${model} ${operation} took ${Date.now() - start}ms`);
          return result;
        },
      },
    }
  });

  await createUsersAndPosts(db1);

  // intercept specific model and operation
  const db2 = db.$use({
    id: 'cost-logger',
    onQuery: {
      post: {
        create: async ({ model, operation, args, query }) => {
          // modify query args
          const updatedArgs = { 
            ...args, 
            data: {
                ...args.data,
                viewCount: 10
            }
          }
          return query(updatedArgs);
        },
      },
    }
  });
  console.log('Post created with incremented viewCount');
  console.log(
    await db2.post.create({ data: { title: 'New Post' } })
  );
}

main();
