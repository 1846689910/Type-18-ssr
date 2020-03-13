import { schema, root } from "../utils/graphql";
import { graphql } from "graphql";

const graphqlMiddlewareKoa = async ctx => {
  const { query } = ctx.request.body;
  ctx.body = await graphql(schema, query, root);
};

module.exports = { graphqlMiddlewareKoa };