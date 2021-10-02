import JWT from 'jsonwebtoken';
import {SecretJWT, SecretCrypto} from './constants';
import {NextFunction, Request, Response} from 'express'
import StatusCodes from 'http-status-codes';
const { UNAUTHORIZED} = StatusCodes;
import {GetOne} from '@database/account/controller'
import CryptoJs from 'crypto-js';


// Hash md5
export const HashMD5 = (text: string)=>{
    return CryptoJs.MD5(text).toString();
}


// Generate short code
export const GenerateShortCode = function () {
    var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var ID_LENGTH = 8;
    var rtn = '';
    for (var i = 0; i < ID_LENGTH; i++) {
        rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
}


// Encode data
export const EncodeData = (data: object) =>{
    let code = CryptoJs.AES.encrypt(JSON.stringify(data), SecretCrypto).toString();
    return code;
}


// Decode data
export const DecodeData = (data: string) =>{
    // console.log(data)
    var bytes  = CryptoJs.AES.decrypt(data, SecretCrypto);
    // console.log(bytes)
    var decryptedData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
    return decryptedData;
}


// Generate token to authenticate users
export const GenerateToken = (data: object)=>{
    let token : string = JWT.sign({data}, SecretJWT, { expiresIn: '4h' });
    return token;
}


// Decode token from request of users
export const DecodeToken = (token: string) => {
    try{
        let data = JWT.verify(token,  SecretJWT);
        return data;
    }
    catch(e){
        return false;
    }
}

export const Middleware = async (req: Request, res: Response, next: NextFunction)=>{
    // console.log(req.headers)
    let token : any = req.headers.token;
    let dataToken : any = DecodeToken(token);
    console.log("dataToken: ", dataToken)
    if (!!dataToken){
        let email : string = dataToken.data.email;
        let account : any = await GetOne(email);
        
        if (!account){
            return res.status(UNAUTHORIZED).send({message: "Invalid token"})
        }
        else if (account.token != token){
            return res.status(UNAUTHORIZED).send({message: "Invalid token"})
        }
        else{
            next();
        }
    }
    else{
        return res.status(UNAUTHORIZED).send({message: "Invalid token"})
    }
    
}