import { createClient } from './db';
import { createUsersAndPosts } from './utils';

async function main() {
  const db = await createClient();

  await createUsersAndPosts(db);

  console.log('Computed fields are returned with query results');
  console.log(
    await db.user.findFirst()
  );

  console.log('You can select them explicitly too');
  console.log(
    await db.user.findFirst({ select: { email: true, postCount: true }})
  );

  console.log('You can also use them for filtering and sorting');
  console.log(
    await db.user.findFirst({
      where: { postCount: { gt: 1 } },
      orderBy: { postCount: 'desc' } 
    })
  );

  console.log('You can also aggregate over them');
  console.log(
    await db.user.aggregate({
      _avg: { postCount: true }
    })
  );
}

main();
