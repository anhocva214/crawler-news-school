import { parse } from 'node-html-parser';
import { HandleSpaceTime, GetHtml, GetTimeString , SendNewsToMail} from './functions';
import {News} from '@entities/news';
import NewsController from '@database/news/controller';

const Other = async ()=>{

    const data = await GetHtml("https://www.hcmus.edu.vn/sinh-vien");
    const root = parse(data);
    // let title = root.querySelector('.category-module').querySelector('ul').querySelectorAll('li')[0].querySelector('.mod-articles-category-title').innerText.trim();
    // let time = root.querySelector('.category-module').querySelector('ul').querySelectorAll('li')[0].querySelector('.mod-articles-category-date').innerText.trim().replace('/-/gm',"/");

    let posts = root.querySelectorAll('.category-module')[2].querySelectorAll('li');

    posts.forEach(async (post)=>{

        let time = post.querySelector(".mod-articles-category-date").innerText.trim();
        time = HandleSpaceTime(time);
        let news : News = {
            subject: "Thông báo khác",
            title : post.querySelector(".mod-articles-category-title").innerText.trim(),
            time,
            url: "https://www.hcmus.edu.vn"+post.querySelector(".mod-articles-category-title").attributes["href"].trim()
        }

        // console.log(news)
        let time_now = GetTimeString();
        if (news.time == time_now){
            let news_exist = await NewsController.GetOne(news.title);
            // console.log(news_exist);
            if (!news_exist) {
                await NewsController.AddOne(news);
                await SendNewsToMail(news.subject, news.title, news.url, "other")
                // console.log(news)
            }
        }
    })

}

export default Other