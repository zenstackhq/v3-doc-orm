import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

async function main() {
  const db = await createClient();

  // intercept all mutations, without loading entities
  const db1 = db.$use({
    id: 'plugin1',
    onEntityMutation: {
      beforeEntityMutation: ({model, action}) => {
        console.log('[plugin1] Before mutation:', model, action);
      },
      
      afterEntityMutation: ({ model, action}) => {
        console.log('[plugin1] After mutation:', model, action);
      }
    }
  });

  await createUsersAndPosts(db1);

  // only intercept Post's update mutation, loading before and after entities
  const db2 = db.$use({
    id: 'plugin2',
    onEntityMutation: {
      async beforeEntityMutation({model, action, loadBeforeMutationEntities}) {
        if (model === 'Post' && action === 'update') {
          const entities = await loadBeforeMutationEntities();
          console.log('[plugin2] Before mutation:', model, action, entities);
        }
      },

      async afterEntityMutation({ model, action, loadAfterMutationEntities}) {
        if (model === 'Post' && action === 'update') {
          const postMutationEntities = await loadAfterMutationEntities();
          console.log('[plugin2] After mutation:',
            model,
            action,
            postMutationEntities);
        }
      }
    }
  });

  const post = await db2.post.create({ data: { title: 'New Post' } });
  await db2.post.update({ where: { id: post.id }, data: { viewCount: 1 }});
}

main();
