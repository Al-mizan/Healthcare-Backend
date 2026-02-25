import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";

interface IRegisterPatientPayload {
    email: string;
    password: string;
    name: string;
}

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
        throw new Error('Registration failed');
    }
    // const patient = await prisma.$transaction(async (tx) => {

    // });

    return data;
};

interface ILoginUserPayload {
    email: string;
    password: string;
}

const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    });
    if(data.user.status === UserStatus.BLOCKED) {
        throw new Error('User is blocked');
    }
    if(data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new Error('User is deleted');
    }
    return data;
};

export const AuthService = {
    registerPatient,
    loginUser,
}