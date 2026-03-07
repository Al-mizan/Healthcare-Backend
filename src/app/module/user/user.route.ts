import { Router } from "express";
import { createDoctorZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { UserController } from "./user.controller";
import { validateRequestBody } from "../../middleware/validateRequist";


const router = Router();


router.post("/create-doctor", 
    validateRequestBody(createDoctorZodSchema), 
    UserController.createDoctor);

router.post("/create-admin",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    UserController.createAdmin);

export const UserRoutes: Router = router;