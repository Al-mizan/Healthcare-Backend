import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";


const createSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const speciality = await SpecialityService.createSpeciality(payload);
        sendResponse(res, {
            httpStatusCode: 201,
            success: true,
            message: "Speciality created successfully",
            data: speciality,
        });
    }
);

const getAllSpecialities = catchAsync(
    async (req: Request, res: Response) => {
        const specialities = await SpecialityService.getAllSpecialities();
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Specialities fetched successfully",
            data: specialities,
        });
    }
);

const deleteSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new Error("Speciality ID is required");
        }
        await SpecialityService.deleteSpeciality(id as string);
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Speciality deleted successfully",
        });
    }
);

const updateSpeciality = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const payload = req.body;
        if (!id) {
            throw new Error("Speciality ID is required");
        }
        const speciality = await SpecialityService.updateSpeciality(id as string, payload);
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Speciality updated successfully",
            data: speciality,
        });
    }
);

export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality,
}