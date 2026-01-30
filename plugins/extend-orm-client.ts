import { definePlugin } from '@zenstackhq/orm';
import { createClient } from '../db';
import z from 'zod';

async function main() {
  const db = await createClient();

  const cacheDb = db.$use(
    definePlugin({
      id: 'cache',

      // add a $cache property to contain custom methods and properties
      client: {
        $cache: {
          get stats() {
            return { hits: 10, misses: 5 };
          },
          async invalidate() {
            console.log('Cache invalidated');
          }
        }
      },

      queryArgs: {
        // use "$read" to extend query args of all read operations
        $read: z.object({
          cache: z
            .strictObject({
              ttl: z.number().positive().optional()
            })
            .optional()
        })
      },

      onQuery: ({ args, proceed }) => {
        console.log('Intercepted cache args:', (args as any).cache);
        return proceed(args);
      }
    })
  );

  await cacheDb.user.findMany({
    where: { email: { contains: 'zenstack' } },
    cache: { ttl: 60 }
  });

  console.log('Cache stats:', cacheDb.$cache.stats);
  await cacheDb.$cache.invalidate();
}

main();
