import { createClient } from './db';
import { createUsersAndPosts } from './utils';

async function main() {
  const db = await createClient();
  await createUsersAndPosts(db);

  console.log('Post grouped by "published"');
  console.log(
    await db.post.groupBy({
      by: ['published'],
      _count: { content: true },
      _avg: { viewCount: true }
    })
  );

  console.log('Post grouped by "published" and filtered for average viewCount');
  console.log(
    await db.post.groupBy({
      by: ['published'],
      _count: { content: true },
      _avg: { viewCount: true },
      having: {
        viewCount: {
          _avg: { gt: 1 }
        }
      }
    })
  );
}

main();
