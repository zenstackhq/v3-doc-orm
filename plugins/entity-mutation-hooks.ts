import { definePlugin } from '@zenstackhq/orm';
import { createClient } from '../db';
import { schema } from '../zenstack/schema';
import { createUsersAndPosts } from '../utils';

async function main() {
  const db = await createClient();

  // intercept all mutations, without loading entities
  const db1 = db.$use(
    definePlugin({
      id: 'plugin1',
      onEntityMutation: {
        $all: {
          beforeEntityMutation: ({ model, action }) => {
            console.log('[plugin1] Before mutation:', model, action);
          },

          afterEntityMutation: ({ model, action }) => {
            console.log('[plugin1] After mutation:', model, action);
          }
        }
      }
    })
  );

  await createUsersAndPosts(db1);

  // only intercept Post's update mutation, loading before and after entities
  // (passing the schema to `definePlugin` makes the loaded entities typed)
  const plugin2 = definePlugin(schema, {
    id: 'plugin2',
    onEntityMutation: {
      Post: {
        async beforeEntityMutation({ action, loadBeforeMutationEntities }) {
          if (action === 'update') {
            // entities are typed as `Post` rows
            const entities = await loadBeforeMutationEntities();
            console.log('[plugin2] Before mutation:', action, entities);
          }
        },

        async afterEntityMutation({ action, loadAfterMutationEntities }) {
          if (action === 'update') {
            const entities = await loadAfterMutationEntities();
            console.log('[plugin2] After mutation:', action, entities);
          }
        }
      }
    }
  });
  const db2 = db.$use(plugin2);

  const post = await db2.post.create({ data: { title: 'New Post' } });
  await db2.post.update({ where: { id: post.id }, data: { viewCount: 1 } });
}

main();
