import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { globalRouter } from "./router";

export type serverType = typeof globalRouter;

createHTTPServer({
  router: globalRouter,
  middleware: cors({
    origin: "http://localhost:3000",
  }),
}).listen(process.env.PORT || 4040);
