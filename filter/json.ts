import { createClient } from '../db';

async function main() {
  const db = await createClient();

  const profile = {
    gender: 'male',
    professions: ['engineer', 'consultant'],
    bio: 'typescript developer'
  };

  await db.user.create({
    data: {
      email: 'u1@test.com',
      profile
    }
  });

  console.log('Filter by toplevel JSON data');
  console.log(await db.user.findFirst({ where: { profile: { equals: profile } } }));

  console.log('Filter with JSON path selection');
  console.log(
    await db.user.findFirst({
      where: {
        profile: {
          path: '$.professions[0]',
          string_starts_with: 'eng'
        }
      }
    })
  );
}

main();
