import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

async function main() {
  const db = await createClient();
  await createUsersAndPosts(db);

  console.log('Find users with at least two posts');
  console.log(
    await db.user.findMany({
      where: {
        $expr: (eb) =>
          // SELECT (COUNT(*) >= 2) FROM "Post" WHERE "Post"."id" = "User"."id"
          eb
            .selectFrom('Post')
            .whereRef('Post.authorId', '=', 'User.id')
            .select(({ fn }) => eb(fn.countAll(), '>=', 2).as('hasMorePosts'))
      }
    })
  );
}

main();
