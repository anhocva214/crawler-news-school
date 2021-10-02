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
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
const GetOne = (title) => __awaiter(void 0, void 0, void 0, function* () {
    const news = yield model_1.NewsModel.findOne({ title }).exec();
    return news;
});
const AddOne = (news) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = new model_1.NewsModel(news);
    try {
        yield doc.save();
        return true;
    }
    catch (e) {
        console.log("Cach error add one news: ", e);
        return false;
    }
});
const NewsController = {
    GetOne,
    AddOne
};
exports.default = NewsController;
