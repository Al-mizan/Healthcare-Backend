import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerPatient = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const data = await AuthService.registerPatient(payload);

        const { accessToken, refreshToken, token, ...rest } = data;
        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string); // better-auth.session_token, better-auth automatically pushes this cookie to the response when using better-auth, but we need to set it manually when using custom login/reg logic 


        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Patient registered successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,
            },
        });
    } 
);

const loginUser = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const data = await AuthService.loginUser(payload);

        const { accessToken, refreshToken, token, ...rest } = data;
        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token); // better-auth.session_token, better-auth automatically pushes this cookie to the response when using better-auth, but we need to set it manually when using custom login logic 

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,
            },
        });
    } 
);

export const AuthController = {
    registerPatient,
    loginUser,
}