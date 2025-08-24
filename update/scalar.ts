import { createClient } from '../db';
import { createUsersAndPosts } from '../utils';

async function main() {
  const db = await createClient();
  await createUsersAndPosts(db);

  // update a unique post
  console.log('Update post #1');
  console.log(
    await db.post.update({
      where: { id: 1 },
      data: { title: 'New Post' }
    })
  );

  // update many posts matching a condition
  console.log('Update all published posts');
  console.log(
    await db.post.updateMany({
      where: { published: true },
      data: { published: false }
    })
  );

  // you can limit the number of records to update
  console.log('Update at most 2 records');
  console.log(
    await db.post.updateMany({
      data: { published: true },
      limit: 2
    })
  );

  // numeric fields support incremental update
  console.log('Increment viewCount');
  console.log(
    await db.post.updateManyAndReturn({
      data: { viewCount: { increment: 1 } },
      select: { title: true, viewCount: true }
    })
  );

  // upsert
  console.log('Upsert updates when the record exists');
  console.log(
    await db.post.upsert({
      where: { id: 1 },
      update: { title: 'Wonderful Post' },
      create: { id: 1, title: 'One More Post' }
    })
  );

  // upsert
  console.log('Upsert creates when the record is not found');
  console.log(
    await db.post.upsert({
      where: { id: 5 },
      update: { title: 'Wonderful Post' },
      create: { id: 5, title: 'One More Post' }
    })
  );
}

main();