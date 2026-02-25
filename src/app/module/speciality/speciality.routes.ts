import { Router } from "express";
import { SpecialityController } from "./speciality.controller";

const router = Router();

router.post('/', SpecialityController.createSpeciality);
router.get('/', SpecialityController.getAllSpecialities);
router.delete('/:id', SpecialityController.deleteSpeciality);
router.patch('/:id', SpecialityController.updateSpeciality);

export const SpecialityRoutes: Router = router;