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
const node_html_parser_1 = require("node-html-parser");
const functions_1 = require("./functions");
const controller_1 = __importDefault(require("@database/news/controller"));
const CTSV = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield functions_1.GetHtml("https://www.hcmus.edu.vn/sinh-vien");
    const root = node_html_parser_1.parse(data);
    let posts = root.querySelectorAll('.category-module')[1].querySelectorAll('li');
    posts.forEach((post) => __awaiter(void 0, void 0, void 0, function* () {
        let time = post.querySelector(".mod-articles-category-date").innerText.trim();
        time = functions_1.HandleSpaceTime(time);
        let news = {
            subject: "Công tác sinh viên",
            title: post.querySelector(".mod-articles-category-title").innerText.trim(),
            time,
            url: "https://www.hcmus.edu.vn" + post.querySelector(".mod-articles-category-title").attributes["href"].trim()
        };
        // console.log(news)
        let time_now = functions_1.GetTimeString();
        if (news.time == time_now) {
            let news_exist = yield controller_1.default.GetOne(news.title);
            // console.log(news_exist);
            if (!news_exist) {
                yield controller_1.default.AddOne(news);
                yield functions_1.SendNewsToMail(news.subject, news.title, news.url, "ctsv");
                // console.log(news)
            }
        }
    }));
});
exports.default = CTSV;
