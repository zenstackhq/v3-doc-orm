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
        { title: 'Post1', published: true, authorId: user.id, updatedAt: new Date().toISOString() },
        { title: 'Post2', published: false, authorId: user.id, updatedAt: new Date().toISOString() }
      ])
      .returningAll()
      .execute()
  );
}

main();
