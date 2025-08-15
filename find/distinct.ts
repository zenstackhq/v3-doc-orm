import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

// find distinct rows demo
async function main() {
  const db = await createClient();

  // create some test posts
  await createUsersAndPosts(db);

  console.log('Distinct with fields');
  console.log(
    await db.post.findMany({
      distinct: ['authorId']
    })
  );
}

main();
