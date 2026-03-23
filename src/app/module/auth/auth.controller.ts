import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";

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

const getMe = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const data = await AuthService.getMe(user);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User profile fetched successfully",
            data,
        });
    } 
);

const getNewToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken = req.cookies["better-auth.session_token"]; // better-auth.session_token is the session token that better-auth uses to manage the session, we can use this token to identify the session and refresh the tokens accordingly

        if (!betterAuthSessionToken || !refreshToken) {
            throw new AppError(status.UNAUTHORIZED, 'Session token and refresh token are required');
        }

        const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);

        const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, sessionToken); // better-auth.session_token should be refreshed along with the access and refresh tokens to ensure that the session remains valid and active for the user

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "New access token generated successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken,
            },
        });
    } 
);


export const AuthController = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
}