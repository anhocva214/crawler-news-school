import logger from './Logger';
import nodemailer from 'nodemailer';
import {AccountEmail} from '@shared/constants'

export const pErr = (err: Error) => {
    if (err) {
        logger.err(err);
    }
};

export const getRandomInt = () => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};

export const EpochToHuman = (epoch: number) => {
    let d = new Date(epoch);

    let text_full = d.getDate() + "/" + (d.getMonth() + 1).toString() + "/" + d.getFullYear();

    return {
        text_full,
        date: d.getDate(),
        month: d.getMonth() + 1,
        year: d.getFullYear()
    }
}



export const SendMail = async (email: string, subject: string, message: string) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: "smtp.gmail.com",
        port: 587,
        ignoreTLS: false,
        secure: false,
        auth: {
            user: AccountEmail.email, // generated ethereal user
            pass: AccountEmail.password, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '<tackecon1551@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        // text: message, // plain text body
        html: `<h2>${message}</h2>`, // html body
    });

    console.log("Message sent: %s", info.messageId);

}