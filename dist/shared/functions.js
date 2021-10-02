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
exports.SendMail = exports.EpochToHuman = exports.getRandomInt = exports.pErr = void 0;
const Logger_1 = __importDefault(require("./Logger"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const constants_1 = require("@shared/constants");
const pErr = (err) => {
    if (err) {
        Logger_1.default.err(err);
    }
};
exports.pErr = pErr;
const getRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
};
exports.getRandomInt = getRandomInt;
const EpochToHuman = (epoch) => {
    let d = new Date(epoch);
    let text_full = d.getDate() + "/" + (d.getMonth() + 1).toString() + "/" + d.getFullYear();
    return {
        text_full,
        date: d.getDate(),
        month: d.getMonth() + 1,
        year: d.getFullYear()
    };
};
exports.EpochToHuman = EpochToHuman;
const SendMail = (email, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer_1.default.createTransport({
        service: 'Gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: constants_1.AccountEmail.email,
            pass: constants_1.AccountEmail.password, // generated ethereal password
        },
    });
    // send mail with defined transport object
    let info = yield transporter.sendMail({
        from: '<tackecon1551@gmail.com>',
        to: email,
        subject: subject,
        // text: message, // plain text body
        html: `<h2>${message}</h2>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
});
exports.SendMail = SendMail;
