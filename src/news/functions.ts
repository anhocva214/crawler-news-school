import axios from 'axios';
import { SendMail } from '@shared/functions';
import { GetList } from '@database/account/controller';
import { Account } from '@entities/account';
import { ifError } from 'assert';


export const HandleItem = (item: string) => {
    let s = item.indexOf('(');
    let e = item.indexOf(')');

    return {
        title: item.slice(0, s).trim(),
        time: item.slice(s + 1, e).trim()
    }
}

export const GetHtml = async (url: string) => {
    return await axios.get(url).then(({ data }) => data);
}

export const GetTimeString = () => {
    let d = new Date();
    // config time 
    // d.setHours(d.getHours())

    let date: any = d.getDate();
    let month: any = d.getMonth() + 1;
    let year = d.getFullYear();

    if (date < 10) date = "0" + date;
    if (month < 10) month = "0" + month;

    let result = date + "/" + month + "/" + year;
    // console.log(d.getTime());
    return result;
}

export const SendNewsToMail = async (subject: string, title: string, url: string, channel: string) => {
    let accounts: any = await GetList();
    // console.log(accounts);
    // let emails = [];
    // if (accounts.length > 0 && accounts.length > 1){
    //     emails = accounts.reduce((a: any, b: any) => a.email + "," + b.email)
    // }
    // else if (accounts.length > 0){
    //     emails = accounts[0].email
    // }

    let temp = accounts.map((item: any) => {
        if (item.channels.indexOf(channel) > -1)
            return item.email
        else return ""
    })
    let emails: any = temp.reduce((a: any, b: any) => a + "," + b,'');

    console.log(emails);

    let html_message = `<a href="${url}" target="_blank">${title}</a>`

    await SendMail(emails, subject, html_message)

}

export const HandleSpaceTime = (text: string) => {
    while (1 == 1) {
        // console.log(text)
        if(
            text.indexOf('\n') > -1 ||
            text.indexOf(' ') > -1 ||
            text.indexOf('\t') > -1 ||
            text.indexOf('-') > -1 ||
            text.indexOf('(') > -1 ||
            text.indexOf(')') > -1

        ) {
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
}