import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

async function main() {
  const db = await createClient();
  await createUsersAndPosts(db);

  // value filters
  console.log('Post title is "Post1"');
  console.log(await db.post.findFirst({ where: { title: 'Post1' } }));

  // equality filters (equivalent to a value filter)
  console.log('Post title equals "Post1"');
  console.log(await db.post.findFirst({ where: { title: { equals: 'Post1' } } }));

  // string operators
  console.log('Post content starts with "Another"');
  console.log(await db.post.findFirst({ where: { content: { startsWith: 'Another' } } }));

  // numeric operators
  console.log('Post with viewCount > 1');
  console.log(await db.post.findFirst({ where: { viewCount: { gt: 1 } } }));

  // use "not" to negate a filter
  console.log('Post with not(viewCount > 1)');
  console.log(
    await db.post.findFirst({
      where: { viewCount: { not: { gt: 1 } } }
    })
  );

  // multile fields in a filter object has AND semantic
  console.log('Post with viewCount > 1 && title = "Post1"');
  console.log(await db.post.findFirst({ where: { viewCount: { gt: 1 }, title: 'Post1' } }));

  // use "in"/"notIn" to check if a field matches any item in a list
  console.log('Post with title in ["Post1, "Post2"]');
  console.log(await db.post.findFirst({ where: { title: { in: ['Post1', 'Post2'] } } }));

  // use AND/OR/NOT to build composite filters
  console.log('Post with: viewCount > 1 || (content startsWith "Another" && title != "Post1")');
  console.log(
    await db.post.findFirst({
      where: {
        OR: [
          { viewCount: { gt: 1 } },
          {
            AND: [{ content: { startsWith: 'Another' } }, { NOT: { title: 'Post1' } }]
          }
        ]
      }
    })
  );
}

main();
