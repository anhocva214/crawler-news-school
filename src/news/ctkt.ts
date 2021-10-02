import { parse } from "node-html-parser";
import {
  HandleItem,
  GetHtml,
  GetTimeString,
  SendNewsToMail,
} from "./functions";
import { News } from "@entities/news";
import NewsController from "@database/news/controller";
import { sendDiscordHook } from "@shared/discordHook";

const CTKT = async () => {
  const data = await GetHtml("http://ktdbcl.hcmus.edu.vn");

  const root = parse(data);

  let post_list = root.querySelectorAll(".dd-post");
  // let post_data : any = [];
  let time_now = GetTimeString();

  post_list.forEach((post, index) => {
    if (index >= 2 && index <= 5) {
      let subject = post
        .querySelector(".dd-postmetadataheader")
        .innerText.trim();
      let items = post.querySelectorAll("li");

      items.forEach(async (item) => {
        let url =
          "http://ktdbcl.hcmus.edu.vn" +
          item.querySelector("a").attributes["href"];
        // let data = HandleItem(item.innerText.trim())
        let title = item
          .querySelector(".mod-articles-category-title")
          .innerText.trim();
        let time = item
          .querySelector(".mod-articles-category-date")
          .innerText.trim()
          .replace("(", "")
          .replace(")", "");
        // console.log(time)
        if (time == time_now) {
          let news: News = {
            subject,
            title,
            time,
            url,
          };

          // console.log(news)

          let news_exist = await NewsController.GetOne(news.title);
          // console.log(news_exist);
          if (!news_exist) {
            await NewsController.AddOne(news);
            await sendDiscordHook({ ...news, channelCode: "ctkt" });
            await SendNewsToMail(news.subject, news.title, news.url, "ctkt");
            // console.log(news);
          }
        }
      });
    }
  });
};

export default CTKT;
