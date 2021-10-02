import { Account } from '@entities/account';
import { AccountModel } from './model';

export const AddOne = async (account: Account) => {
    const doc = new AccountModel(account);
    try {
        await doc.save();
        return true;
    }
    catch (e) {
        console.log("Cach error add one account: ", e);
        return false;
    }
}

export const GetList = async () => {
    return await AccountModel.find({})
}


export const GetOne = async (email: string) => {
    const account = await AccountModel.findOne({ email: email }).exec();
    return account;
}

export const UpdateOne = async (email: string, dataUpdate: object) => {
    await AccountModel.updateOne({email: email}, dataUpdate)
}
