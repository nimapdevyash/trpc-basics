import { eq } from "drizzle-orm";
import { Context } from "../../configs/context";
import { NewUser, User, users } from "../schema";
import { UpdateUserAccount } from "../validations/user";

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
  if (existingUserRecord)
    throw new Error("User With This Email Already Exists");

  const createdUserRecord = await ctx.db.insert(users).values(input);

  console.log("Resposne of Created Account: ", createdUserRecord);

  return "User Account Created Successfully";
};

export const updateUserAccount = async ({
  input,
  ctx,
}: {
  input: UpdateUserAccount;
  ctx: Context;
}) => {
  const existingUserRecord = await ctx.db
    .select()
    .from(users)
    .where(eq(users.id, input.id));
  if (!existingUserRecord) throw new Error("Invlid userId");

  const updatedUserRecord = await ctx.db
    .update(users)
    .set({
      ...(input.name && { name: input.name }),
      ...(input.email && { email: input.email }),
    })
    .where(eq(users.id, input.id));

  console.log("Response Of Updated User: ", updatedUserRecord);

  return "User Updated Successfully";
};

export const deleteUserAccount = async ({
  input,
  ctx,
}: {
  input: Pick<User, "id">;
  ctx: Context;
}) => {
  const existingUserRecord = await ctx.db
    .select()
    .from(users)
    .where(eq(users.id, input.id));
  if (!existingUserRecord) throw new Error("Invlid UserId");

  const deletedUserRecord = await ctx.db
    .delete(users)
    .where(eq(users.id, input.id));

  console.log("Response Of Deleted User: ", deletedUserRecord);

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
