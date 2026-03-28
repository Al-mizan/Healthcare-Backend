import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payload: Specialty): Promise<Specialty> => {
    
    const speciality = await prisma.specialty.create({
        data: payload,
    });

    return speciality;
}

const getAllSpecialities = async (): Promise<Specialty[]> => {
    const specialities = await prisma.specialty.findMany();
    return specialities;
}

const deleteSpeciality = async (id: string): Promise<Specialty> => {
    const speciality = await prisma.specialty.delete({
        where: { id },
    });
    return speciality;
}

const updateSpeciality = async (id: string, payload: Partial<Specialty>): Promise<Specialty> => {
    const speciality = await prisma.specialty.update({
        where: { id },
        data: payload,
    });
    return speciality;
}

export const SpecialityService = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality,
}