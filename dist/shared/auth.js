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
exports.Middleware = exports.DecodeToken = exports.GenerateToken = exports.DecodeData = exports.EncodeData = exports.GenerateShortCode = exports.HashMD5 = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const { UNAUTHORIZED } = http_status_codes_1.default;
const controller_1 = require("@database/account/controller");
const crypto_js_1 = __importDefault(require("crypto-js"));
// Hash md5
const HashMD5 = (text) => {
    return crypto_js_1.default.MD5(text).toString();
};
exports.HashMD5 = HashMD5;
// Generate short code
const GenerateShortCode = function () {
    var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var ID_LENGTH = 8;
    var rtn = '';
    for (var i = 0; i < ID_LENGTH; i++) {
        rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
};
exports.GenerateShortCode = GenerateShortCode;
// Encode data
const EncodeData = (data) => {
    let code = crypto_js_1.default.AES.encrypt(JSON.stringify(data), constants_1.SecretCrypto).toString();
    return code;
};
exports.EncodeData = EncodeData;
// Decode data
const DecodeData = (data) => {
    // console.log(data)
    var bytes = crypto_js_1.default.AES.decrypt(data, constants_1.SecretCrypto);
    // console.log(bytes)
    var decryptedData = JSON.parse(bytes.toString(crypto_js_1.default.enc.Utf8));
    return decryptedData;
};
exports.DecodeData = DecodeData;
// Generate token to authenticate users
const GenerateToken = (data) => {
    let token = jsonwebtoken_1.default.sign({ data }, constants_1.SecretJWT, { expiresIn: '4h' });
    return token;
};
exports.GenerateToken = GenerateToken;
// Decode token from request of users
const DecodeToken = (token) => {
    try {
        let data = jsonwebtoken_1.default.verify(token, constants_1.SecretJWT);
        return data;
    }
    catch (e) {
        return false;
    }
};
exports.DecodeToken = DecodeToken;
const Middleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.headers)
    let token = req.headers.token;
    let dataToken = exports.DecodeToken(token);
    console.log("dataToken: ", dataToken);
    if (!!dataToken) {
        let email = dataToken.data.email;
        let account = yield controller_1.GetOne(email);
        if (!account) {
            return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
        }
        else if (account.token != token) {
            return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
        }
        else {
            next();
        }
    }
    else {
        return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
    }
});
exports.Middleware = Middleware;
