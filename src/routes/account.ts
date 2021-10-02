import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
const { FORBIDDEN, CREATED, OK, BAD_GATEWAY } = StatusCodes;
import { Account } from '@entities/account';
import {
    AddOne,
    GetList,
    GetOne,
    UpdateOne
} from '@database/account/controller';
import { NotPermission, ErrorSystem, ChannelsCode } from '@shared/constants';
import {
    GenerateToken,
    DecodeToken,
    EncodeData,
    DecodeData,
    GenerateShortCode,
    HashMD5,
} from '@shared/auth';
import { SendMail } from '@shared/functions'



/**
 * Add one account.
 * @param {password, data_encoded}
 */

export const AddOneAccount = async (req: Request, res: Response) => {

    if (!req.body.password || !req.body.data_encoded || !req.body.code) {
        return res.status(BAD_GATEWAY).send({ message: "Info invalid" })
    }

    let data_decoded = DecodeData(req.body.data_encoded)
    const { code, email } = data_decoded;

    // check code verify email
    if (code != req.body.code) {
        return res.status(FORBIDDEN).send({ message: "Code is wrong" })
    }

    let account: Account = {
        email: email,
        password: HashMD5(req.body.password),
        token: "",
        channels: []
    };

    // console.log(account);

    let account_existed = await GetOne(account.email);

    if (!!account_existed) {
        return res.status(FORBIDDEN).send({ message: "Email is existed" })
    }
    else {
        if (await AddOne(account)) {
            return res.status(CREATED).send({ message: "Register account success" })
        }
        else {
            return res.status(BAD_GATEWAY).send({ message: ErrorSystem })
        }
    }

}


/**
 * Update new password
 * @param {new_password, data_encoded, code}
 */

export const UpdateNewPassword = async (req: Request, res: Response) => {
    if (!req.body.new_password || !req.body.data_encoded || !req.body.code){
        return res.status(BAD_GATEWAY).send({ message: "Invalid info"})
    }

    let data_decoded = DecodeData(req.body.data_encoded)
    const { code, email } = data_decoded;

    // check code verify email
    if (code != req.body.code) {
        return res.status(FORBIDDEN).send({ message: "Code is wrong" })
    }

    let new_account = {
        password: HashMD5(req.body.new_password)
    }
    
    await UpdateOne(email, new_account);

    return res.status(OK).send({message: "Update new password success"})

}


/**
 * Send code to mail
 * @param {email, method}
 */

export const VerifyEmail = async (req: Request, res: Response) => {
    if (!req.body.email) {
        return res.status(BAD_GATEWAY).send({ message: "Email invalid" })
    }

    let methods = ["register", "update_password"]
    if (methods.indexOf(req.body.method) < 0) return res.status(BAD_GATEWAY).send({message: "Method is requied"})

    let emailIsExist = await GetOne(req.body.email);
    if (!!emailIsExist && req.body.method=="register") return res.status(FORBIDDEN).send({ message: "Email is existed" })
    if (!emailIsExist && req.body.method=="update_password") return res.status(FORBIDDEN).send({ message: "Email is't registered" })


    let code = GenerateShortCode();
    // send mail
    await SendMail(req.body.email, "Xác thực email", `Đây là mã xác thực của bạn: ${code}`);
    // decode data
    let data = { code, email: req.body.email }
    let data_encoded = EncodeData(data);

    // response to client
    return res.status(OK).send({ data: { data_encoded } })
}



/**
 * Get all accounts
 */

export const GetListAccount = async (req: Request, res: Response) => {
    let list: any = await GetList();
    // console.log(list);
    let emails = list.map((item: any) => {
        let arr_email = item.email.split("@");
        let arr_ext = arr_email[1].split(".");
        let emai = arr_email[0].slice(0, 4) + "*****" + "@" + "*****" + arr_email[1].split(".")[1];
        return emai
    })

    let d = new Date()
    //   console.log(emails)
    return res.status(OK).send({ message: "Get list success", data: emails, time: d.getTime() })
}


/**
 * Login width account
 * @param {email, password}
 */

export const Login = async (req: Request, res: Response) => {

    if (!req.body.email) {
        return res.status(BAD_GATEWAY).send({ message: "Email invalid" });
    }

    let account = await GetOne(req.body.email);
    // console.log(account)

    if (!account) {
        return res.status(BAD_GATEWAY).send({ message: "Account not exists" })
    }
    else if (account.password !== HashMD5(req.body.password)) {
        return res.status(BAD_GATEWAY).send({ message: "Invalid email/password" })
    }
    else {
        // success
        let acc: any = await GetOne(req.body.email)
        let info = {
            email: acc.email,
            channels: acc.channels
        }

        let token = GenerateToken(info);
        UpdateOne(info.email, { token: token })

        return res.status(OK).send({ message: "Login success", data: info, token })
    }
}


/**
 * Logout width account
 * @param {headers.token}
 */

export const Logout = async (req: Request, res: Response) => {
    let token: any = req.headers.token;
    let dataToken: any = await DecodeToken(token);
    // console.log(data)
    await UpdateOne(dataToken.data.email, { token: "" })
    return res.status(OK).send({ message: "Logout success" })
}


/**
 * Check token from user request
 * @param {headers.token}
 */

export const CheckTokenUser = async (req: Request, res: Response) => {
    let token: any = req.headers.token;
    let dataToken: any = await DecodeToken(token);
    let email = dataToken.data.email;

    let acc: any = await GetOne(email)
    let info = {
        email: acc.email,
        channels: acc.channels
    }


    return res.status(OK).send({ message: "Token avaliable", data: info })
}


/**
 * Update channel for account
 * @param {header.token, channel_code, channel_title}
 */

export const UpdateChannelAccount = async (req: Request, res: Response) => {
    let token: any = req.headers.token;
    let dataToken: any = await DecodeToken(token);
    let email = dataToken.data.email;

    let channel_code: any = req.body.channel_code;
    let channel_title: any = req.body.channel_title;
    let keys_chanels = Object.keys(ChannelsCode[channel_title]);

    if (!channel_code) {
        return res.status(BAD_GATEWAY).send({ message: "Channel invalid" })
    }
    else if (keys_chanels.indexOf(channel_code) < 0) {
        return res.status(BAD_GATEWAY).send({ message: "Channel not existed" })
    }
    else {
        let account: any = await GetOne(email);
        let channels_of_account = account.channels;

        if (channels_of_account.indexOf(channel_code) > -1) {
            return res.status(BAD_GATEWAY).send({ message: "Bạn đã theo dõi" })
        }

        channels_of_account.push(channel_code);
        await UpdateOne(email, { channels: channels_of_account })

        return res.status(OK).send({ message: "Update channel success" })
    }

}

export const GetAllChanel = (req: Request, res: Response) => {
    return res.status(OK).send({ data: ChannelsCode })
}