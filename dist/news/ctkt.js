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
const CTKT = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield functions_1.GetHtml("http://ktdbcl.hcmus.edu.vn");
    const root = node_html_parser_1.parse(data);
    let post_list = root.querySelectorAll('.dd-post');
    // let post_data : any = [];
    let time_now = functions_1.GetTimeString();
    post_list.forEach((post, index) => {
        if (index >= 2 && index <= 5) {
            let subject = post.querySelector('.dd-postmetadataheader').innerText.trim();
            let items = post.querySelectorAll('li');
            items.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                let url = 'http://ktdbcl.hcmus.edu.vn' + item.querySelector('a').attributes["href"];
                // let data = HandleItem(item.innerText.trim())
                let title = item.querySelector(".mod-articles-category-title").innerText.trim();
                let time = item.querySelector(".mod-articles-category-date").innerText.trim().replace("(", "").replace(")", "");
                // console.log(time)
                if (time == time_now) {
                    let news = {
                        subject,
                        title,
                        time,
                        url
                    };
                    // console.log(news)
                    let news_exist = yield controller_1.default.GetOne(news.title);
                    // console.log(news_exist);
                    if (!news_exist) {
                        yield controller_1.default.AddOne(news);
                        yield functions_1.SendNewsToMail(news.subject, news.title, news.url, "ctkt");
                        // console.log(news)
                    }
                }
            }));
        }
    });
});
exports.default = CTKT;
