import * as z from "zod";

export const loginValidation = z.object({
  email: z.email().trim().nonempty(),
  password: z.string().trim().nonempty(),
});

export type LoginCredentials = z.infer<typeof loginValidation>;
