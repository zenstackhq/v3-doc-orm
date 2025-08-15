import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

// sort demo
async function main() {
  const db = await createClient();

  // create some test posts
  await createUsersAndPosts(db);

  // sort by a simple field and direction
  console.log('Posts sorted by viewCount asc');
  console.log(
    await db.post.findMany({ 
      orderBy: { viewCount: 'asc' },
      select: { title: true, viewCount: true } 
    })
  );

  // sort by multiple fields
  console.log('Posts sorted by publised asc, viewCount desc');
  console.log(
    await db.post.findMany({
      orderBy: { published: 'asc', viewCount: 'desc' },
      select: { title: true, published: true, viewCount: true } 
    })
  );

  // sort by a relation field
  console.log('Posts osrted by author email desc');
  console.log(await db.post.findMany({
    orderBy: { author: { email: 'desc' } },
    select: { title: true, author: { select: { email: true } } }
  }));

  // sort by the count of a to-many relation
  console.log('Users sorted by post count desc');
  console.log(await db.user.findMany({
    orderBy: { posts: { _count: 'desc'}},
    select: { email: true, _count: true }
  }));

  // sort and specify treatment of NULL values
  console.log('Posts sorted by authorId nulls first')
  console.log(await db.post.findMany({
    orderBy: { authorId: { sort: 'asc', nulls: 'first' } },
    select: { title: true, authorId: true }
  }));
}

main();
