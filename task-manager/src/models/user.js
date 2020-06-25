const validator = require("validator")
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const Task = require("./task")
const jwt = require("jsonwebtoken")

const userSchema= new mongoose.Schema({
  name:{
    type: String,
    required :true,
    default:"Anonymous",

    trim:true,

  },
   email:{
  type:String,
  required:true,
  unique :true,
  validate(value){
   if(!validator.isEmail(value))
   {

  throw new Error("Invalid Email") 
   }   



  },
  trim:true,
  lowercase:true,
  default:"anikeat@gmail.com"

  },
  age :{

  type: Number,
  required:true,
  validate(value){
    if(value<0){
        throw new Error("Age must be a positive number")
    }

  },
  default:0
  },
  password: {

   type: String,
   required:true,
   trim:true,
   minlength:7,

  validate(value){
 
if(value.toLowerCase().includes("password"))

throw new Error("It Cannot Include Password")
  }

},
avatar:{


type : Buffer 

},

tokens :[{

token :{
type :String,
required :true
}



}]
},{

 timestamps :true

})

userSchema.virtual("tasks",{
  ref:"Task",
  localField:"_id",
  foreignField:"owner",



})


userSchema.methods.generateAuthToken = async function (){

const user = this
const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

user.tokens = user.tokens.concat({token})

await user.save()


return token



}

userSchema.statics.findByCredentials = async (email,password)=>{

const user = await User.findOne({email})

if(!user){
  throw new Error("Unable To Login")
}

const isMatch = await bcrypt.compare(password,user.password)

if(!isMatch){
throw new Error("Unable To Login")

}

return user

}

userSchema.methods.toJSON = function (){

  const user = this
 const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar


 return userObject

}






// hashing a plain text pass before saving
userSchema.pre("save" ,async function(next){

const user = this

if(user.isModified("password")) {

user.password = await bcrypt.hash(user.password ,8)

}


next()
})



//Deleting user task When User is removed

userSchema.pre("remove", async function (next){

const user= this
await Task.deleteMany({owner:user._id})


next()
})









const User= mongoose.model("User",userSchema)





module.exports = User