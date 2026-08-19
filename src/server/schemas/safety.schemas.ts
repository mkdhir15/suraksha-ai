import { z } from 'zod';

export const ThreatAnalysisSchema = z.object({
  textSnippet: z.string().optional(),
  audioFeatures: z
    .object({
      decibels: z.number(),
      pitchHz: z.number(),
      stressProbability: z.number().min(0).max(1),
    })
    .optional(),
  motionFeatures: z
    .object({
      accelerationMagnitude: z.number(),
      isRapidMovement: z.boolean(),
      freefallDetected: z.boolean(),
    })
    .optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

export const DriverVerificationSchema = z.object({
  licensePlate: z.string().min(1, 'License plate is required'),
  driverName: z.string().optional(),
  cabCompany: z.string().optional(),
});

export const SafeRouteSchema = z.object({
  origin: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
  destination: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
  travelMode: z.enum(['walking', 'driving', 'transit']).optional(),
});

export const CheckInSchema = z.object({
  pin: z.string().length(4, 'PIN must be exactly 4 digits'),
  switchId: z.string().optional(),
});
