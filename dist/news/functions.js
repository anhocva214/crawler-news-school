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
exports.HandleSpaceTime = exports.SendNewsToMail = exports.GetTimeString = exports.GetHtml = exports.HandleItem = void 0;
const axios_1 = __importDefault(require("axios"));
const functions_1 = require("@shared/functions");
const controller_1 = require("@database/account/controller");
const HandleItem = (item) => {
    let s = item.indexOf('(');
    let e = item.indexOf(')');
    return {
        title: item.slice(0, s).trim(),
        time: item.slice(s + 1, e).trim()
    };
};
exports.HandleItem = HandleItem;
const GetHtml = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.get(url).then(({ data }) => data);
});
exports.GetHtml = GetHtml;
const GetTimeString = () => {
    let d = new Date();
    // config time 
    d.setHours(d.getHours() - 7);
    let date = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    if (date < 10)
        date = "0" + date;
    if (month < 10)
        month = "0" + month;
    let result = date + "/" + month + "/" + year;
    // console.log(d.getTime());
    return result;
};
exports.GetTimeString = GetTimeString;
const SendNewsToMail = (subject, title, url, channel) => __awaiter(void 0, void 0, void 0, function* () {
    let accounts = yield controller_1.GetList();
    // console.log(accounts);
    // let emails = [];
    // if (accounts.length > 0 && accounts.length > 1){
    //     emails = accounts.reduce((a: any, b: any) => a.email + "," + b.email)
    // }
    // else if (accounts.length > 0){
    //     emails = accounts[0].email
    // }
    let temp = accounts.map((item) => {
        if (item.channels.indexOf(channel) > -1)
            return item.email;
        else
            return "";
    });
    let emails = temp.reduce((a, b) => a + "," + b);
    console.log(emails);
    let html_message = `<a href="${url}" target="_blank">${title}</a>`;
    yield functions_1.SendMail(emails, subject, html_message);
});
exports.SendNewsToMail = SendNewsToMail;
const HandleSpaceTime = (text) => {
    while (1 == 1) {
        // console.log(text)
        if (text.indexOf('\n') > -1 ||
            text.indexOf(' ') > -1 ||
            text.indexOf('\t') > -1 ||
            text.indexOf('-') > -1 ||
            text.indexOf('(') > -1 ||
            text.indexOf(')') > -1) {
            text = text.replace('\n', '');
            text = text.replace(' ', '');
            text = text.replace('\t', '');
            text = text.replace('-', '/');
            text = text.replace('(', '');
            text = text.replace(')', '');
        }
        else {
            break;
        }
    }
    return text;
};
exports.HandleSpaceTime = HandleSpaceTime;
