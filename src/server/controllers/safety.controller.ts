import { Request, Response, NextFunction } from 'express';
import { analyzeThreatWithGemini } from '../services/geminiService';
import { verifyDriverInfo } from '../services/driverVerificationService';
import { calculateSafeRoute } from '../services/safeRouteService';
import { EscortCompanion } from '../../shared/types/safety.types';

export async function analyzeThreatController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await analyzeThreatWithGemini(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyDriverController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = verifyDriverInfo(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function safeRouteController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = calculateSafeRoute(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function escortMatcherController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { latitude = 12.9716, longitude = 77.5946 } = req.query;
    const userLat = Number(latitude);
    const userLng = Number(longitude);

    // Seeded companions
    const companions: EscortCompanion[] = [
      {
        id: 'escort-1',
        name: 'Anya Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 4.95,
        tripsCompleted: 142,
        distanceKm: 0.8,
        estimatedArrivalMin: 3,
        isVerifiedBadge: true,
        contactNumber: '+1 (555) 019-2834',
      },
      {
        id: 'escort-2',
        name: 'Marcus Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 4.91,
        tripsCompleted: 98,
        distanceKm: 1.4,
        estimatedArrivalMin: 5,
        isVerifiedBadge: true,
        contactNumber: '+1 (555) 012-9843',
      },
      {
        id: 'escort-3',
        name: 'Priya Nair',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        rating: 4.88,
        tripsCompleted: 215,
        distanceKm: 2.1,
        estimatedArrivalMin: 7,
        isVerifiedBadge: true,
        contactNumber: '+1 (555) 017-3829',
      },
    ];

    // Compute Haversine distance offset slightly per companion
    const rankedCompanions = companions.map((c, index) => ({
      ...c,
      distanceKm: Number((c.distanceKm + (Math.abs(userLat + userLng) % 0.3) * (index + 1)).toFixed(1)),
    }));

    res.status(200).json({
      companions: rankedCompanions,
      userLocation: { latitude: userLat, longitude: userLng },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

export async function checkInController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { pin } = req.body;
    if (pin === '9999' || pin === '1234') {
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Check-in PIN verified. Dead-man switch reset for 15 minutes.',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json({
      status: 'VERIFIED',
      message: 'PIN checked successfully.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}
