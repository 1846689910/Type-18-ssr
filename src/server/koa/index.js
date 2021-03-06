import Path from "path";
import Koa from "koa";
import serve from "koa-static";
import Router from "koa-router";
import Status from "http-status";
// import koaBody from "koa-body";
import { middleware as ssrMiddleware } from "../express/ssr-middleware";
import { graphqlMiddlewareKoa2 } from "./graphql-middleware-koa";

import c2k from "koa-connect";
import chalk from "chalk";

const PORT = process.env.PORT || 3000;
const touch = process.env.touch;
const app = new Koa();
const router = new Router(); // eslint-disable-line

router.get("/alive", async (ctx) => {
  ctx.status = Status.OK;
});

app.use(graphqlMiddlewareKoa2);

app.use(serve(Path.resolve("dist"), { maxAge: "30d", index: false }));

app.use(router.routes());

app.use(c2k(ssrMiddleware));

const running = app.listen(PORT, () => {
  console.log(
    chalk.bold.blue(`Koa server is running at http://localhost:${PORT}`),
  );
  if (touch && running.close) {
    running.close();
    process.exit(0);
  }
});
