import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { globalRouter } from "./routers";
import { createContext } from "./configs/context";

export type serverType = typeof globalRouter;

createHTTPServer({
  router: globalRouter,
  createContext,
  middleware: cors({
    origin: "http://localhost:3000",
  }),
}).listen(process.env.PORT || 4040);
