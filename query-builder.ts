import { createClient } from './db';

async function main() {
  const db = await createClient();

  console.log('Create a user');
  const user = await db.$qb
    .insertInto('User')
    .values({
      email: 'u1@test.com'
    })
    .returningAll()
    .executeTakeFirstOrThrow();
  console.log(user);

  console.log('Create two posts for the user');
  console.log(
    await db.$qb
      .insertInto('Post')
      .values([
        { title: 'Post1', authorId: user.id, updatedAt: new Date().toISOString() },
        { title: 'Post2', authorId: user.id, updatedAt: new Date().toISOString() }
      ])
      .returningAll()
      .execute()
  );

  console.log('Find a user with at least two posts');
  // build a query equivalent to the following SQL:
  //   SELECT User.*, postCount FROM User LEFT JOIN 
  //     (SELECT authorId, COUNT(*) AS postCount FROM Post GROUP BY authorId) AS UserPosts
  //   ON
  //     UserPosts.authorId = User.id
  //   WHERE
  //     postCount > 1
  const result = await db.$qb
    .selectFrom('User')
    .leftJoin(
      // express builder is type-safe
      eb => eb
        .selectFrom('Post')
        .select('authorId')
        .select(({fn}) => fn.countAll().as('postCount'))
        .groupBy('authorId')
        .as('UserPosts'),
      join => join.onRef('UserPosts.authorId', '=', 'User.id')
    )
    .selectAll('User')
    .select('postCount')
    .where('postCount', '>', 1)
    .executeTakeFirstOrThrow();
  // query result is type-safe
  console.log(`User ${result.email} has ${result.postCount} posts`);

  console.log('Use query builder inside filter');
  console.log(
    await db.user.findMany({
      where: {
        $expr: (eb) => 
          eb
            .selectFrom('Post')
            .select(eb => eb(eb.fn.countAll(), '>', 1).as('postCountFilter'))
            .whereRef('Post.authorId', '=', 'User.id')
      }
    })
  );
}

main();
