import * as z from "zod";

export const createLocationSchema = z.object({
  body: z.object({
    name: z.string(),
    address: z.string(),
    locationType: z.enum(["Factory", "Warehouse"]),
  }),
});

export const updateLocationSchema = z.object({
  params: z.object({
    locationId: z.string(),
  }),
  body: z
    .object({
      name: z.string(),
      address: z.string(),
      locationType: z.enum(["Factory", "Warehouse"]),
    })
    .strip()
    .partial(),
});

export type CreateLocationReq = z.infer<typeof createLocationSchema>;
export type UpdateLocationReq = z.infer<typeof updateLocationSchema>;

export type CreateLocation = CreateLocationReq["body"];
export type UpdateLocation = UpdateLocationReq["body"];

export type Location = CreateLocationReq["body"] & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
