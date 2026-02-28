import { createClient } from '../db';
import { createPosts } from '../utils';

// basic find demo
async function main() {
  const db = await createClient();

  // create some test posts
  await createPosts(db);

  const slicedDb = db.$setOptions({
    ...db.$options,
    slicing: {
      // exclude the Comment model entirely
      excludedModels: ['Comment'],
      models: {
        post: {
          // exclude `deleteMany` operation for 'Post' model
          excludedOperations: ['deleteMany'],
          fields: {
            title: {
              // only allow equality filter for "Post.title" field
              includedFilterKinds: ['Equality']
            }
          }
        }
      }
    }
  });

  // @ts-expect-error: Comment model is excluded
  console.log("Sliced client's Comment model:", slicedDb.comment);

  // @ts-expect-error: deleteMany is excluded for post model
  console.log("Sliced client's Post model deleteMany operation:", slicedDb.post.deleteMany);

  try {
    // @ts-expect-error: only equality filter is allowed for title field
    await slicedDb.post.findMany({ where: { title: { contains: 'test' } } });
  } catch (err: any) {
    console.log('Got an expected error:', err.message);
  }
}

main();
