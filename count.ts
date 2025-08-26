import { createClient } from './db';
import { createUsersAndPosts } from './utils';

async function main() {
  const db = await createClient();
  await createUsersAndPosts(db);

  console.log('Count all posts');
  console.log(await db.post.count());

  console.log('Count published posts');
  console.log(await db.post.count({ where: { published: true }}));

  console.log('Count post fields fields');
  console.log(
    await db.post.count({ 
      select: {
        _all: true, // count all records
        content: true // count non-null values
      }})
  );
}

main();