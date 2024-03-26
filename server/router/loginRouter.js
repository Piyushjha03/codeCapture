import express from 'express';
import axios from 'axios';
import { globaldata } from '../query.js';
import { getGlobalData } from '../api.js';

const loginRouter = express.Router();

loginRouter.post('/', async(req,res) => {
  // Handle login logic here
    const loginDetails=req.body;
    const response=await getGlobalData(loginDetails).catch(err=>{
       return res.status(400).send(err)
    })
      console.log(response.data.userStatus.username.length); 
      if(response.data.userStatus.username.length===0){
        res.cookie('csrftokenfromserver',`${loginDetails.csrf}`,{ 
          sameSite: 'None',
          secure:false,
          maxAge:1,
        });  
        res.cookie('LEETCODE_SESSION_fromserver',`${loginDetails.LEETCODE_SESSION}`,{
          sameSite: 'None',
          secure:false,
          maxAge:1,
        }); 
        return res.status(400).send('Invalid Credentials')
         
      }
      res.cookie('csrftokenfromserver',`${loginDetails.csrf}`,{ 
        sameSite: 'None',
        secure:false,
      });  
      res.cookie('LEETCODE_SESSION_fromserver',`${loginDetails.LEETCODE_SESSION}`,{
        sameSite: 'None',
        secure:false,
      });  
      return res.status(200).send(response.data);
});

export default loginRouter;
