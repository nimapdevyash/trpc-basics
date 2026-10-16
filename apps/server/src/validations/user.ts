import * as z from "zod";

export const createUserAccountValidation = z.object({
  name: z.string().trim().nonempty(),
  email: z.string().trim().nonempty(),
  password: z.string().trim().nonempty(),
});

export const updateUserAccountValidation = z.object({
  id: z.number().positive(),
  name: z.string().trim().nonempty().optional(),
  email: z.string().trim().nonempty().optional(),
});

