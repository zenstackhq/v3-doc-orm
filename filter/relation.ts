import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

async function main() {
  const db = await createClient();
  await createUsersAndPosts(db);

  // filter by a one-to-one relation
  console.log('Post owned by u1');
  console.log(await db.post.findFirst({
    where: { author: { email: 'u1@test.com' } }
  }));

  // for optional relation, you can use null check to filter on if the relation 
  // is connected
  console.log('Post not owned by anyone');
  console.log(await db.post.findFirst({
    where: { author: null }
  }));

  // filter by a one-to-many relation using "some", "every", or "none" operator
  console.log('User with at least one published post');
  console.log(await db.user.findFirst({
    where: { posts: { some: { published: true } } }
  }));
}

main();
