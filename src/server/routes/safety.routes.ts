import { Router } from 'express';
import {
  analyzeThreatController,
  verifyDriverController,
  safeRouteController,
  escortMatcherController,
  checkInController,
} from '../controllers/safety.controller';
import { validateRequest } from '../middleware/validateRequest';
import {
  ThreatAnalysisSchema,
  DriverVerificationSchema,
  SafeRouteSchema,
  CheckInSchema,
} from '../schemas/safety.schemas';

const router = Router();

router.post('/analyze-threat', validateRequest(ThreatAnalysisSchema), analyzeThreatController);
router.post('/verify-driver', validateRequest(DriverVerificationSchema), verifyDriverController);
router.post('/safe-route', validateRequest(SafeRouteSchema), safeRouteController);
router.get('/escort-matcher', escortMatcherController);
router.post('/check-in', validateRequest(CheckInSchema), checkInController);

export default router;
