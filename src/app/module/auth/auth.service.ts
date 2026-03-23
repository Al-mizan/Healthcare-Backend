import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ILoginUserPayload, IRegisterPatientPayload } from "./auth.interface";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interface/requestUser.interface";
import { envVars } from "../../config/env";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";


const registerPatient = async (payload: IRegisterPatientPayload) => {
    const { email, password, name } = payload;

    const data = await auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
        }
    })
    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, 'Registration failed');
    }
    try {
        const patient = await prisma.$transaction(async (tx) => {
            const patientTx = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: payload.name,
                    email: payload.email,
                }
            })
            return patientTx;
        });

        const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        return {
            ...data,
            accessToken,
            refreshToken,
            patient,
        };
    } catch (error) {
        console.log("Transaction Error: ", error);
        await prisma.user.delete({
            where: {
                id: data.user.id,
            }
        })
        throw error;
    }
};

const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    });
    if (data.user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, 'User is blocked');
    }
    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, 'User is deleted');
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    return {
        ...data,
        accessToken,
        refreshToken,
    };
};

const getMe = async (user: IRequestUser) => {
    const userData = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        include: {
            patient: {
                include: {
                    appointments: true,
                    reviews: true,
                    prescriptions: true,
                    medicalReports: true,
                    patientHealthData: true,
                }
            },
            doctor: {
                include: {
                    specialties: true,
                    appointments: true,
                    reviews: true,
                    prescriptions: true,
                }
            },
            admin: true,
        },
    });

    if (!userData) {
        throw new AppError(status.NOT_FOUND, 'User not found');
    }

    return userData;
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
    const isSessionTokenExist = await prisma.session.findUnique({
        where: {
            token: sessionToken,
        },
        include: {
            user: true,
        }
    });

    if (!isSessionTokenExist) {
        throw new AppError(status.UNAUTHORIZED, 'Invalid session token');
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);

    if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
        throw new AppError(status.UNAUTHORIZED, 'Invalid refresh token');
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const { token } = await prisma.session.update({
        where: {
            token: sessionToken,
        },
        data: {
            token: sessionToken,
            // refreshToken: newRefreshToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // session should have the same expiration as the refresh token, but since better-auth.session_token is automatically refreshed by better-auth when the user is active, we can set a long expiration here and rely on better-auth to handle the actual expiration and refreshing of the token based on user activity
            updatedAt: new Date(),
        }
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionToken: token,
    }
}

export const AuthService = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
}