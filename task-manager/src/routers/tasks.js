const Task = require("../models/task.js")
const express= require("express")
const auth = require("../middleware/auth.js")
const router = new express.Router()

//GET /tasks?completed=true||false
//GET /tasks?limit=10&skip=0
// GET tasks?sortBy=createdAt:asc 
// asc for ascending  (1)
// desc for descending  (-1)

router.get("/tasks", auth, async (req,res)=>{

const match = {}
const sort = {}
if(req.query.completed){

  match.completed =req.query.completed =="true"

}

if(req.query.sortBy){

const parts = req.query.sortBy.split(':')

sort[parts[0]] = parts[1] == "desc" ?-1:1

}



    try {
    
      //   const tasks =await Task.find({owner:req.user._id})
 await req.user.populate({
    
     path : "tasks",
     match ,
    
     options : {

    limit : parseInt(req.query.limit),
    skip : parseInt(req.query.skip) ,
    sort
  


     }

 }).execPopulate()

       res.send(req.user.tasks)
    
    
     } catch(e) {
    
       res.status(404).send()
    
     }
    
    
    
    
    })
    
    // get task by id
    
    
    router.get("/task/:id",auth, async (req,res)=>{
    
      const _id= req.params.id
    
    try {
    
      const task = await Task.findOne({_id , owner : req.user._id })
         
   if(!task){

    res.status(404).send()
    
   }

      res.send(task)

      
       } catch(e) {
      
         res.status(404).send()
      
       }
      
    
    })
    
    
    
    
    
    router.post("/task",auth ,async (req,res)=>{
    
    // const task = new Task(req.body)
  
    const task = new Task({
        ...req.body,
        owner : req.user._id



    })

    try {
    
        await task.save()
        res.send(task)
        
        } catch(e){
        
        res.status(400).send(e)
        
        }
    
    
    
    
    })
    
    
    // Updating a task
    
router.patch("/task/:id",auth, async (req,res)=>{
    
    const updatesrequested = Object.keys(req.body)   
    const allowedUpdates= ["description","completed"]
    
    const isValidUpdation = updatesrequested.every((update)=>{
    
    return allowedUpdates.includes(update)
    
    
    })
    
    if(!isValidUpdation){
    
    return res.status(400).send("Not A Valid Updation")
    


    }
    
    try {
    
    
const task = await Task.findOne({_id:req.params.id, owner: req.user._id})


if(!task){

return res.status(404).send()

}



updatesrequested.forEach((update)=>{

task[update]= req.body[update]
})

await task.save()
 res.send(task)
    
    
    
    } catch(e){
    
     res.status(400).send(e)

     }
 
    
    })
    
    // deleting a task
    
router.delete("/task/:id",auth, async (req,res)=>{
        try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        
        if(!task){
        
            return res.status(404).send()
        }
        
        res.status(200).send(task)
        
        
        } catch(e){
        
        res.status(400).send(e)
        
        
        }
        
        
        
        })
        
    
module.exports = router