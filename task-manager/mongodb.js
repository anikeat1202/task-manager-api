// CRUD create read update delete
const mongodb =require("mongodb")
const MongoClient= mongodb.MongoClient
const ObjectID = mongodb.ObjectID
// W can also write above code as:
//  const {MongoClient,ObjectID}=require("mongodb")
const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"

const id =new ObjectID()


console.log(id.toHexString())

console.log(id.getTimestamp())

MongoClient.connect(connectionURL,{useNewUrlParser :true,useUnifiedTopology: true 
},(error,client)=>{


    if(error)
{
   return console.log("Unable To Connect To Database")
}
const db= client.db(databaseName)

db.collection("users").deleteMany({
    name:"Anikeat"  
}).then((result)=>{
console.log(result.deletedCount)
}).catch((error)=>{

console.log(error)

})

})



