import * as z from "zod";

export type Role = {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
};
