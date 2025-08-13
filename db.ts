import { SqlJsDialect } from '@zenstackhq/kysely-sql-js';
import { ZenStackClient } from '@zenstackhq/runtime';
import initSqlJs from 'sql.js';
import { schema } from './zenstack/schema';

export async function createClient() {
  // initialize sql.js engine
  const SQL = await initSqlJs();

  // create database client with sql.js dialect
  const db = new ZenStackClient(schema, {
    // database dialect
    dialect: new SqlJsDialect({ sqlJs: new SQL.Database() }),

    // computed field definitions
    computedFields: {
      User: {
        postCount: (eb) => 
          eb.selectFrom('Post')
            .whereRef('Post.authorId', '=', 'User.id')
            .select(({fn}) => fn.countAll<number>().as('count'))
      }
    }
  });

  // push schema to the database
  // the `$pushSchema` API is for testing purposes only
  await db.$pushSchema();

  return db;
}
