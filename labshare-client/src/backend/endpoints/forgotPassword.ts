import express from "express";
import HttpStatus from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import { Validator as v } from "../../lib/validation";
import { getUserForMail, ResetToken } from '../database/database';
import utils from '../utils';

interface IBody {
    email?: string
}

export async function forgotPassword(req: express.Request, res: express.Response, next: express.NextFunction) {
    let body: IBody = req.body;


    let validationResult = v.validEmail(body.email);
    if (!validationResult.valid || !body.email) {
        return utils.handleError(res, validationResult.err);
    }


    let user = await getUserForMail(body.email);
    if (!user) {
        return utils.badRequest(res);
    }

    ResetToken.deleteMany({ objectId: user._id }).exec();

    let token = uuid();
    let token_doc = new ResetToken({ token: token, objectId: user._id });
    
    token_doc.save().then(() => {
        // TODO: Send mail
        return utils.successResponse(res);
    }).catch(() => {
        return utils.internalError(res);
    });
}
