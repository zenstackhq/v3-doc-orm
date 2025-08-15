import { QueryError } from '@zenstackhq/runtime';
import { createClient } from '../db';
import { createPosts } from '../utils';

// basic find demo
async function main() {
  const db = await createClient();

  // create some test posts
  await createPosts(db);

  // `findMany` reads a list of entities
  console.log('Posts with viewCount > 0')
  console.log(
    await db.post.findMany({ where: { viewCount: { gt: 0 } } })
  );

  // `findUnique` takes unique criteria as input
  // e.g., you can use id field
  console.log('Unique post with id #1')
  console.log(
    await db.post.findUnique({ where: { id: 1 }})
  );

  // or any unique field
  console.log('Unique post with slug "post1"')
  console.log(
    await db.post.findUnique({ where: { slug: 'post1' }})
  )

  // `findFirst` accepts arbitrary filter conditions that don't have
  // to be unique
  console.log('A published post')
  console.log(
    await db.post.findFirst({ where: { published: true } })
  );

  // `findUniqueOrThrow` and `findFirstOrThrow` throws an error if
  // no entity is found
  try {
    await db.post.findUniqueOrThrow({ where: { id: 3 } });
  } catch (err) {
    console.log('Got an expected error:', (err as QueryError).message);
  }
}

main();
