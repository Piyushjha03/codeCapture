import express from 'express';
import { getProblemSetQuestionList } from '../api.js';


const feedRouter = express.Router();

feedRouter.post('/', async(req,res) => {
  // Handle login logic here
  const postDetails=req.body;
  console.log(postDetails);
    const cookieDetails=req.cookies;
    const response=await getProblemSetQuestionList(postDetails,cookieDetails).catch(err=>{
       return res.status(400).send(err)
    }) 
      return res.status(200).send(response.data);
});

export default feedRouter;
