import { createClient } from '../db';
import {
  SelectQueryNode,
  WhereNode,
  AndNode,
  BinaryOperationNode,
  ColumnNode,
  OperatorNode,
  ValueNode,
  TableNode
} from 'kysely';

async function main() {
  const db = await createClient();

  // inject a filter "viewCount > 0" when selecting from "Post" table
  const db1 = db.$use({
    id: 'viewCount-filter',
    onKyselyQuery: ({query, proceed}) => {
      if (SelectQueryNode.is(query)) {
        // first make sure the query is selecting from "Post" table
        const from = query.from?.froms[0];
        if (from && TableNode.is(from) && from.table.identifier.name === 'Post') {
          // filter to inject: "viewCount > 0"
          const viewCountFilter = BinaryOperationNode.create(
            ColumnNode.create('viewCount'),
            OperatorNode.create('>'),
            ValueNode.create(0)
          );

          let updatedWhere: WhereNode;

          if (query.where) {
            // if the query already has a `where`, merge it with an AND
            updatedWhere = WhereNode.create(
              AndNode.create(
                query.where.where, 
                viewCountFilter
              )
            );
          } else {
            // otherwise just create a new `where`
            updatedWhere = WhereNode.create(viewCountFilter);
          }
          // reconstruct the query node with `where` replaced
          query = { ...query, where: updatedWhere }
        }
      }
      // execute the query
      return proceed(query);
    }
  });

  // creat two posts
  await db1.post.create({ data: { title: 'Post1', viewCount: 0 } });
  await db1.post.create({ data: { title: 'Post1', viewCount: 1 } });

  // only posts with viewCount > 0 are returned
  console.log('Find posts with injected filter')
  console.log(await db1.post.findMany());
}

main();
