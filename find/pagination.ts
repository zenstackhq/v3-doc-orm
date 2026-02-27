import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

// pagination demo
async function main() {
  const db = await createClient();

  // create some test posts
  await createUsersAndPosts(db);

  // use `skip` and `take` to fetch a page
  console.log('The 2nd and 3nd most viewed posts');
  console.log(
    await db.post.findMany({
      orderBy: { viewCount: 'desc' },
      skip: 1,
      take: 2
    })
  );

  // you can use negative `take` to fetch backward
  console.log('The top 2 most viewed posts');
  console.log(
    await db.post.findMany({
      orderBy: { viewCount: 'asc' },
      take: -2
    })
  );

  // use a cursor to locate a page, note the cursor item is included
  console.log('Find with cursor id=2, inclusive');
  console.log(
    await db.post.findMany({
      orderBy: { id: 'asc' },
      cursor: { id: 2 }
    })
  );

  // exclude the cursor with `skip`
  console.log('Find with cursor id=2, exclusive');
  console.log(
    await db.post.findMany({
      orderBy: { id: 'asc' },
      cursor: { id: 2 },
      skip: 1
    })
  );

  // cursor can contain multiple filters
  console.log('Find with cursor id=2 && slug="post2"');
  console.log(
    await db.post.findMany({
      orderBy: { id: 'asc' },
      cursor: { id: 2, slug: 'post2' },
      skip: 1
    })
  );
}

main();
