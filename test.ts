import axios from 'axios';
import { parse } from 'node-html-parser';


const HandleItem = (item:string)=>{
    let s = item.indexOf('(');
    let e = item.indexOf(')');

    return {
        title: item.slice(0, s).trim(),
        time: item.slice(s+1, e).trim()
    }
}

const HandleSpace = (text:string)=>{
    while(1==1){
        // console.log(text)
        if (text.indexOf('\n') > -1 || text.indexOf(' ') > -1 || text.indexOf('\t') > -1){
            text = text.replace('\n', '');
            text = text.replace(' ', '');
            text = text.replace('\t', '')
        }
        else{
            break;
        }
    }
    return text;
}

const GetHtml = async (url : string) =>{
    // console.log(url)
    let data = await axios.get(url).then(({data})=>data);
    const root = parse(data);
    
    // console.log(root.querySelectorAll('.category-module')[0].querySelectorAll('li')[0].querySelector('.mod-articles-category-title').innerText)

    // console.log(root.querySelectorAll('.dd-post')[2].querySelectorAll('li')[0].innerText.trim())

    let title = root.querySelectorAll('.category-module')[0].querySelectorAll('li')[0].querySelector('.mod-articles-category-title').innerText.trim();
    let time = root.querySelectorAll('.category-module')[0].querySelectorAll('li')[0].querySelector('.mod-articles-category-date').innerText.trim()


    console.log(title)
    console.log(HandleSpace(time))
    // console.log(HandleItem(item))
    



    // console.log(data)

}

GetHtml("https://www.hcmus.edu.vn/sinh-vien")