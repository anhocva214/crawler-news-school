import { News } from '@entities/news';
import { NewsModel } from './model';

const GetOne = async (title: string) => {
    const news = await NewsModel.findOne({ title }).exec();
    return news;
}

const AddOne = async (news: News) => {
    const doc = new NewsModel(news);
    try {
        await doc.save();
        return true;
    }
    catch (e) {
        console.log("Cach error add one news: ", e);
        return false;
    }
}

const NewsController = {
    GetOne,
    AddOne
}

export default NewsController;