import { z } from "zod";

export const coordinatesSchema = z.object({
	lat: z.number().gte(-90).lte(90),
	lng: z.number().gte(-180).lte(180),
});

export const rideTypeSchema = z.enum(["standard", "premium", "xl"]);

export const rideRequestSchema = z.object({
	pickup: coordinatesSchema,
	dropoff: coordinatesSchema,
	rideType: rideTypeSchema.default("standard"),
	comment: z.string().max(200).optional(),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;
export type RideType = z.infer<typeof rideTypeSchema>;
export type RideRequest = z.infer<typeof rideRequestSchema>;

