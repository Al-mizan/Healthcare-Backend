import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.routes";
import { authRoute } from "../module/auth/auth.route";

const router = Router();

router.use('/auth', authRoute);
router.use('/specialities', SpecialityRoutes);

export const IndexRoutes: Router = router;