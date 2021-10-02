import { Schema, model } from 'mongoose';
import { Account } from '@entities/account';

const schema = new Schema<Account>({
    email: String,
    password: String,
    token: String,
    channels: Array
});

export const AccountModel = model<Account>('Account', schema);
