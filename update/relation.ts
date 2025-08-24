import { createClient } from '../db';

async function main() {
  const db = await createClient();
  
  const user = await db.user.create({
    data: { email: 'u1@test.com' }
  });

  // create a related entity
  console.log('Update user and create a new post');
  console.log(
    await db.user.update({
      where: { id: user.id },
      data: { posts: { create: { id: 1, title: 'Post1' } } },
      include: { posts: { select: { id: true, title: true }} }
    })
  );

  console.log('Update user and connect an existing post');
  // create an detached post
  const post2 = await db.post.create({ data: { title: 'Post2' }});
  // connect to the user
  console.log(
    await db.user.update({
      where: { id: user.id },
      data: { posts: { connect: { id: post2.id } } },
      include: { posts: { select: { id: true, title: true }} }
    })
  );

  // disconnect a connected entity
  console.log('Update user and disconnect a post');
  console.log(
    await db.user.update({
      where: { id: user.id },
      data: { posts: { disconnect: { id: post2.id } } },
      include: { posts: { select: { id: true, title: true }} }
    })
  );

  // update relation's fields
  console.log('Update user and change fields of a related post');
  console.log(
    await db.user.update({
      where: { id: user.id },
      data: { 
        posts: { 
          update: {
            where: { id: 1 }, 
            data: { title: 'Updated Post' } 
          } 
        } 
      },
      include: { posts: { select: { id: true, title: true }} }
    })
  );

  // delete a related entity
  console.log('Update user and delete a related post');
  console.log(
    await db.user.update({
      where: { id: user.id },
      data: { posts: { delete: { id: 1 } } },
      include: { posts: { select: { id: true, title: true }} }
    })
  );

  // upsert a relation
  console.log('Update user and upsert a post');
  console.log(
    await db.user.update({
      where: { id: user.id },
      data: { 
        posts: {
          upsert: { 
            where: { id: 1 }, 
            create: { id: 1, title: 'Post1'},
            update: { title: 'Nother Post' }
          } 
        }
      },
      include: { posts: { select: { id: true, title: true }} }
    })
  );
}

main();