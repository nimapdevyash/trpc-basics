import { eq } from "drizzle-orm";
import { Context } from "../../configs/context";
import { NewUser, User, users } from "../schema";

/*************************** Mutation ***************************/
export const createUserAccount = async ({
  input,
  ctx,
}: {
  input: NewUser;
  ctx: Context;
}) => {
  const existingUserRecord = await ctx.db
    .select()
    .from(users)
    .where(eq(users.email, input.email));

  if (existingUserRecord.length > 0)
    throw new Error("User With This Email Already Exists");

  await ctx.db.insert(users).values(input);

  return "User Account Created Successfully";
};

export const updateUserAccount = async ({
  userId,
  input,
}: {
  input: { name?: string; email?: string };
  userId: number;
}) => {
  await ctx.db
    .update(users)
    .set({
      ...(input.name && { name: input.name }),
      ...(input.email && { email: input.email }),
    })
    .where(eq(users.id, userId));

  return "User Updated Successfully";
};

export const deleteUserAccount = async ({ ctx }: { ctx: Context }) => {
  if (!ctx.user) throw new Error("this is a protected route");

  await ctx.db.delete(users).where(eq(users.id, ctx.user.id));

  return "User Account Deleted Successfully";
};

/*************************** Query ***************************/
export const getMyUserAccount = async ({ ctx }: { ctx: Context }) => {
  if (ctx.user)
    return await ctx.db.select().from(users).where(eq(users.id, ctx.user?.id));
  throw new Error("You Are Not Logged In");
};

/*************************** Admin ***************************/

export const getUserAccountById = async ({
  input,
  ctx,
}: {
  input: {
    id: number;
  };
  ctx: Context;
}) => {
  return await ctx.db.select().from(users).where(eq(users.id, input.id));
};

export const getAllUserAccounts = ({
  input,
  ctx,
}: {
  input: any;
  ctx: Context;
}) => {
  return ctx.db.select().from(users);
};
