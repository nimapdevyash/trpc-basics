import { and, eq } from "drizzle-orm";
import { Context } from "../../configs/context";
import { users } from "../schema";
import * as jwt from "../../utils/jwt";

export const userLogin = async ({
  input,
  ctx,
}: {
  input: {
    email: string;
    password: string;
  };
  ctx: Context;
}) => {
  const existingUserRecord = await ctx.db
    .select()
    .from(users)
    .where(
      and(eq(users.email, input.email), eq(users.password, input.password)),
    );
  if (!existingUserRecord) throw new Error("Invalid Email Or Password");

  return jwt.createToken({
    id: existingUserRecord[0].id,
    name: existingUserRecord[0].name,
  });
};
