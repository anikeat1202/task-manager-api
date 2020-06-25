const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_DB_CONNECT,{
     useNewUrlParser:true, 
     useUnifiedTopology:true,
     useFindAndModify:false,
     useCreateIndex :true
})


