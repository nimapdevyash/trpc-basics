import jwt from "jsonwebtoken";

type Payload = { id: number; name: string };

export const createToken = (payload: Payload) =>
  jwt.sign(payload, process.env.JWT_SECRETE || "asdfg");

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRETE! || "asdfg") as Payload;
