"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllChanel = exports.UpdateChannelAccount = exports.CheckTokenUser = exports.Logout = exports.Login = exports.GetListAccount = exports.VerifyEmail = exports.UpdateNewPassword = exports.AddOneAccount = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const { FORBIDDEN, CREATED, OK, BAD_GATEWAY } = http_status_codes_1.default;
const controller_1 = require("@database/account/controller");
const constants_1 = require("@shared/constants");
const auth_1 = require("@shared/auth");
const functions_1 = require("@shared/functions");
/**
 * Add one account.
 * @param {password, data_encoded}
 */
const AddOneAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.password || !req.body.data_encoded || !req.body.code) {
        return res.status(BAD_GATEWAY).send({ message: "Info invalid" });
    }
    let data_decoded = auth_1.DecodeData(req.body.data_encoded);
    const { code, email } = data_decoded;
    // check code verify email
    if (code != req.body.code) {
        return res.status(FORBIDDEN).send({ message: "Code is wrong" });
    }
    let account = {
        email: email,
        password: auth_1.HashMD5(req.body.password),
        token: "",
        channels: []
    };
    // console.log(account);
    let account_existed = yield controller_1.GetOne(account.email);
    if (!!account_existed) {
        return res.status(FORBIDDEN).send({ message: "Email is existed" });
    }
    else {
        if (yield controller_1.AddOne(account)) {
            return res.status(CREATED).send({ message: "Register account success" });
        }
        else {
            return res.status(BAD_GATEWAY).send({ message: constants_1.ErrorSystem });
        }
    }
});
exports.AddOneAccount = AddOneAccount;
/**
 * Update new password
 * @param {new_password, data_encoded, code}
 */
const UpdateNewPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.new_password || !req.body.data_encoded || !req.body.code) {
        return res.status(BAD_GATEWAY).send({ message: "Invalid info" });
    }
    let data_decoded = auth_1.DecodeData(req.body.data_encoded);
    const { code, email } = data_decoded;
    // check code verify email
    if (code != req.body.code) {
        return res.status(FORBIDDEN).send({ message: "Code is wrong" });
    }
    let new_account = {
        password: auth_1.HashMD5(req.body.new_password)
    };
    yield controller_1.UpdateOne(email, new_account);
    return res.status(OK).send({ message: "Update new password success" });
});
exports.UpdateNewPassword = UpdateNewPassword;
/**
 * Send code to mail
 * @param {email, method}
 */
const VerifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email) {
        return res.status(BAD_GATEWAY).send({ message: "Email invalid" });
    }
    let methods = ["register", "update_password"];
    if (methods.indexOf(req.body.method) < 0)
        return res.status(BAD_GATEWAY).send({ message: "Method is requied" });
    let emailIsExist = yield controller_1.GetOne(req.body.email);
    if (!!emailIsExist && req.body.method == "register")
        return res.status(FORBIDDEN).send({ message: "Email is existed" });
    if (!emailIsExist && req.body.method == "update_password")
        return res.status(FORBIDDEN).send({ message: "Email is't registered" });
    let code = auth_1.GenerateShortCode();
    // send mail
    yield functions_1.SendMail(req.body.email, "Xác thực email", `Đây là mã xác thực của bạn: ${code}`);
    // decode data
    let data = { code, email: req.body.email };
    let data_encoded = auth_1.EncodeData(data);
    // response to client
    return res.status(OK).send({ data: { data_encoded } });
});
exports.VerifyEmail = VerifyEmail;
/**
 * Get all accounts
 */
const GetListAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let list = yield controller_1.GetList();
    // console.log(list);
    let emails = list.map((item) => {
        let arr_email = item.email.split("@");
        let arr_ext = arr_email[1].split(".");
        let emai = arr_email[0].slice(0, 4) + "*****" + "@" + "*****" + arr_email[1].split(".")[1];
        return emai;
    });
    let d = new Date();
    //   console.log(emails)
    return res.status(OK).send({ message: "Get list success", data: emails, time: d.getTime() });
});
exports.GetListAccount = GetListAccount;
/**
 * Login width account
 * @param {email, password}
 */
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email) {
        return res.status(BAD_GATEWAY).send({ message: "Email invalid" });
    }
    let account = yield controller_1.GetOne(req.body.email);
    // console.log(account)
    if (!account) {
        return res.status(BAD_GATEWAY).send({ message: "Account not exists" });
    }
    else if (account.password !== auth_1.HashMD5(req.body.password)) {
        return res.status(BAD_GATEWAY).send({ message: "Invalid email/password" });
    }
    else {
        // success
        let acc = yield controller_1.GetOne(req.body.email);
        let info = {
            email: acc.email,
            channels: acc.channels
        };
        let token = auth_1.GenerateToken(info);
        controller_1.UpdateOne(info.email, { token: token });
        return res.status(OK).send({ message: "Login success", data: info, token });
    }
});
exports.Login = Login;
/**
 * Logout width account
 * @param {headers.token}
 */
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.token;
    let dataToken = yield auth_1.DecodeToken(token);
    // console.log(data)
    yield controller_1.UpdateOne(dataToken.data.email, { token: "" });
    return res.status(OK).send({ message: "Logout success" });
});
exports.Logout = Logout;
/**
 * Check token from user request
 * @param {headers.token}
 */
const CheckTokenUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.token;
    let dataToken = yield auth_1.DecodeToken(token);
    let email = dataToken.data.email;
    let acc = yield controller_1.GetOne(email);
    let info = {
        email: acc.email,
        channels: acc.channels
    };
    return res.status(OK).send({ message: "Token avaliable", data: info });
});
exports.CheckTokenUser = CheckTokenUser;
/**
 * Update channel for account
 * @param {header.token, channel_code, channel_title}
 */
const UpdateChannelAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.token;
    let dataToken = yield auth_1.DecodeToken(token);
    let email = dataToken.data.email;
    let channel_code = req.body.channel_code;
    let channel_title = req.body.channel_title;
    let keys_chanels = Object.keys(constants_1.ChannelsCode[channel_title]);
    if (!channel_code) {
        return res.status(BAD_GATEWAY).send({ message: "Channel invalid" });
    }
    else if (keys_chanels.indexOf(channel_code) < 0) {
        return res.status(BAD_GATEWAY).send({ message: "Channel not existed" });
    }
    else {
        let account = yield controller_1.GetOne(email);
        let channels_of_account = account.channels;
        if (channels_of_account.indexOf(channel_code) > -1) {
            return res.status(BAD_GATEWAY).send({ message: "Bạn đã theo dõi" });
        }
        channels_of_account.push(channel_code);
        yield controller_1.UpdateOne(email, { channels: channels_of_account });
        return res.status(OK).send({ message: "Update channel success" });
    }
});
exports.UpdateChannelAccount = UpdateChannelAccount;
const GetAllChanel = (req, res) => {
    return res.status(OK).send({ data: constants_1.ChannelsCode });
};
exports.GetAllChanel = GetAllChanel;
