import argon2 from "argon2";

export const hashData = (data: string) => {
  return argon2.hash(data);
};

export const compareData = (hash: string, input: string): Promise<boolean> => {
  return argon2.verify(hash, input);
};
