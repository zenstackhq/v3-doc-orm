import { createClient } from './db';
import { createUsersAndPosts } from './utils';

async function main() {
  const db = await createClient();
  await createUsersAndPosts(db);

  console.log(
    await db.post.aggregate({
      where: { published: false },
      // you can also use `count: true` to simply count all rows
      _count: { _all: true, content: true },
      _avg: { viewCount: true },
      _max: { viewCount: true },
    })
  );
}

main();
