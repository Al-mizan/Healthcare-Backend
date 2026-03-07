import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { DoctorController } from "./doctor.controller";
import { validateRequestBody } from "../../middleware/validateRequist";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    DoctorController.getAllDoctors);

router.get("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    DoctorController.getDoctorById);

router.patch("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequestBody(updateDoctorZodSchema), DoctorController.updateDoctor);

router.delete("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    DoctorController.deleteDoctor);


export const DoctorRoutes = router;