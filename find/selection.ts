import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

// field selection demo
async function main() {
  const db = await createClient();

  // create some test posts
  await createUsersAndPosts(db);

  // selecting fields
  console.log('Selecting fields, scalar and relation');
  console.log(
    await db.post.findFirst({ 
      select: { id: true, title: true, author: true } 
    })
  );

  // omitting scalar fields
  console.log('Omitting scalar fields');
  console.log(
    await db.post.findFirst({ 
      omit: { viewCount: true, createdAt: true }
    })
  )

  // including relations (which selects all scalar fields as well)
  console.log('Including a relation')
  console.log(
    await db.post.findFirst({ 
      include: { author: true } 
    })
  );

  // combining `include` and `omit`
  console.log('Combining include and omit');
  console.log(
    await db.post.findFirst({ 
      include: { author: true },
      omit: { viewCount: true, createdAt: true }
    })
  );

  // `select` and `include` are mutually exclusive
  // @ts-expect-error
  db.post.findFirst({ select: { id: true }, include: { author: true }});

  // `select` and `omit` are mutually exclusive
  // @ts-expect-error
  db.post.findFirst({ select: { id: true }, omit: { title: true }});

  // deep nested select
  console.log('Deep nested select');
  console.log(
    await db.user.findFirst({
      select: {
        email: true,
        posts: { select: { title: true }}
      }
    })
  );

  // selecting relation with filtering and sorting
  console.log('Selecting relation with filtering and sorting');
  console.log(
    await db.user.findFirst({
      select: {
        email: true,
        posts: { 
          where: { published: true },
          orderBy: { viewCount: 'desc' }
        }
      }
    })
  );

  // if a model has to-many relations, you can select their counts
  console.log('Selecting relation counts');
  console.log(
    await db.user.findFirst({
      select: {
        email: true,
        _count: true
      }
    })
  );

  // you can also select a specific relation's count
  console.log('Selecting a specific relation\'s count');
  console.log(
    await db.user.findFirst({
      select: {
        email: true,
        _count: { select: { posts: true } }
      }
    })
  );
}

main();
