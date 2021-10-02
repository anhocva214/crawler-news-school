import { Schema, model } from 'mongoose';
import { News } from '@entities/news';

const schema = new Schema<News>({
    subject: String,
    title: String,
    time: String,
    url: String
});

export const NewsModel = model<News>('News', schema);
