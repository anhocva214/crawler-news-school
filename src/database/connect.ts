import { connect } from 'mongoose';

const DB = ``;
 
export async function ConnectDB(): Promise<void> {
    console.log("Not config database")
    // Connect to MongoDB
    // await connect(DB, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // });

}

