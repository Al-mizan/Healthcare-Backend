import { Router } from "express";
import { SpecialtyController } from "./speciality.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequist";
import { SpecialtyValidation } from "./speciality.validation";

const router = Router();

router.post('/', 
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    multerUpload.single("file"), 
    validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
    SpecialtyController.createSpecialty);
    
router.get('/', SpecialtyController.getAllSpecialties);
router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty);
router.patch('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.updateSpecialty);

export const SpecialtyRoutes: Router = router;