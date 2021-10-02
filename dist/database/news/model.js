"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    subject: String,
    title: String,
    time: String,
    url: String
});
exports.NewsModel = mongoose_1.model('News', schema);
