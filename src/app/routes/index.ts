import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.routes";
import { AuthRoute } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";
import { AdminRoutes } from "../module/admin/admin.route";

const router = Router();

router.use('/auth', AuthRoute);
router.use('/specialities', SpecialityRoutes);
router.use('/users', UserRoutes);
router.use('/doctors', DoctorRoutes);
router.use("/admins", AdminRoutes);

export const IndexRoutes: Router = router;