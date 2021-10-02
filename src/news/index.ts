// import CTKT from './ctkt';
import CTKT from './ctkt'
import PDT from './pdt'
import CTSV from './ctsv'

const News = async ()=>{
    await CTKT();
    await PDT();
    await CTSV();
}


export default News;
