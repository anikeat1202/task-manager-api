
const sgMail=require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{


sgMail.send({
to:email,
from:"anikeat1202@gmail.com",
subject:"Thanks For Joining In",
text:`Welcome to the app, ${name}..Let Me Know How You Get Along With The App`,

})
}



const sendCancelEmail=(email,name)=>{

    sgMail.send({
        to:email,
        from: "anikeat1202@gmail.com",
        subject:"Goodbiee",
        text:`Good Bye ${name},Is There Anything Which We Could Have Done to Prevent You From Dooing This`
        
    
    
    })

}


module.exports= {

sendWelcomeEmail,
sendCancelEmail



}


