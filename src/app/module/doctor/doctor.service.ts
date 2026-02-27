import { prisma } from "../../lib/prisma"

const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true,
                }
            }
        }
    });

    return doctors;
}

const getDoctorById = async (id: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            },
            // appointments: {
            //     include: {
            //         patient: true,
            //         schedule: true,
            //         prescription: true,
            //     }
            // },
            // doctorSchedules: {
            //     include: {
            //         schedule: true,
            //     }
            // },
            // reviews: true
        }
    })
    return doctor;
}

// const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {

//     await prisma.doctor.findUniqueOrThrow({
//         where: {
//             id,
//         },
//     })

//     const specialties: Specialty[] = [];
//     if (payload.specialties) {
//         for (const specialtyId of payload.specialties) {
//             const specialty = await prisma.specialty.findUnique({
//                 where: {
//                     id: specialtyId
//                 }
//             });
//             if (!specialty) {
//                 throw new Error(`Specialty with id ${specialtyId} not found`);
//             }
//             specialties.push(specialty);
//         }
//     }

//     try {
//         const result = await prisma.$transaction(async (tx) => {
//             const doctorData = await tx.doctor.update({
//                 where: {
//                     id,
//                 },
//                 data: {
//                     ...payload.doctor,
//                 },
//             });
//             if (specialties.length > 0) {
//                 const doctorSpecialtyData = specialties.map((specialty) => ({
//                     doctorId: id,
//                     specialtyId: specialty.id,
//                 }));
//                 await tx.doctorSpecialty.updateMany({
//                     where: {
//                         doctorId: id,
//                     },
//                     data: doctorSpecialtyData,
//                 });
//             }

//             const doctor = await tx.doctor.findUnique({
//                 where: {
//                     id: doctorData.id,
//                 },
//                 select: {
//                     id: true,
//                     userId: true,
//                     name: true,
//                     email: true,
//                     profilePhoto: true,
//                     contactNumber: true,
//                     address: true,
//                     registrationNumber: true,
//                     experience: true,
//                     gender: true,
//                     appointmentFee: true,
//                     qualification: true,
//                     currentWorkingPlace: true,
//                     designation: true,
//                     createdAt: true,
//                     updatedAt: true,
//                     user: {
//                         select: {
//                             id: true,
//                             email: true,
//                             name: true,
//                             role: true,
//                             status: true,
//                             emailVerified: true,
//                             image: true,
//                             isDeleted: true,
//                             deletedAt: true,
//                             createdAt: true,
//                             updatedAt: true,
//                         }
//                     },
//                     specialties: {
//                         select: {
//                             specialty: {
//                                 select: {
//                                     id: true,
//                                     title: true,
//                                 }
//                             }
//                         }
//                     }
//                 },
//             });
//             return doctor;
//         });
//         return result;

//     } catch (error) {
//         console.log("Transaction error: ", error);
//         throw error;
//     }
// }

// soft delete doctor by setting isActive to false
// const deleteDoctor = async (id: number) => {
//     const doctor = await prisma.doctor.delete({
//         where: {
//             id,
//         },
//     });

//     return doctor;
// }

export const doctorService = {
    getAllDoctors,
    getDoctorById,
    // updateDoctor,
    // deleteDoctor
}