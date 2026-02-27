import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequistBody } from "../../middleware/validateRequist";
import { createDoctorZodSchema } from "./user.validation";


const router = Router();


router.post("/create-doctor", validateRequistBody(createDoctorZodSchema), userController.createDoctor);


export const UserRoutes: Router = router;