import type { Idatabase } from "../Idatabase.js";
import mongoose from "mongoose";


export class MongoDB implements Idatabase{
    private uri:string;
    constructor( uri:string){
        this.uri=uri;
    }

    async connect()
    {
      await mongoose.connect(this.uri)
      console.log("mongodb connected..")
    }

    async disconnect()
    {
        await mongoose.disconnect()
        console.log("mongodb disconnected..")
    }
   
}