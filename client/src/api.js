import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEN_AI_API);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const base_url = "https://codecaptureapi.vercel.app";
const axiosinstance = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

async function login(loginDetails) {
  const res = await axiosinstance.post(
    "/login",
    loginDetails
  );
  return res;
}

// getallproblems

async function getallproblems(problemDetails) {
  const res = await axiosinstance.post(
    "/feed",
    problemDetails
  );
  return res;
}

// get problem details

async function getProblemDetails(problemDetails) {
  const res = await axiosinstance.post(
    "/problem/content",
    problemDetails
  );
  return res;
}

// sern api ocr
//

async function getOcr(imageDetails) {
  const url = `https://api.imgbb.com/1/upload`;
  const key = import.meta.env.VITE_IMAGE_API;
  const expiration = 600;
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      expiration,
      key: key,
    },
  };
  const res = await axios.post(url, imageDetails, config).catch((err) => {
    return err;
  });
  const ocrRes = await axiosinstance
    .post("/problem/ocr", {
      url: res.data.data.display_url,
    })
    .catch((err) => {
      return err;
    });
  console.log(ocrRes);

  return ocrRes;
}
async function genaiApi(inputQuery) {
  try {
    const prompt = `You are a code instructor. The following code is an output of an OCR tool. This ocr tool is convering handwritten codes to text. The output contains many error. your job is to treat the following string as a code written in C++ and correct the error like spelling mistakes and induntaions . you do not have to change the logic of the code . just correct the possible mistakes by an ocr.
    The code is :${inputQuery}`;
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
  } catch (error) {
    return error;
  }
}

async function runCode(codeDetails) {
  const res = await axiosinstance
    .post("/problem/run", codeDetails)
    .catch((err) => {
      return err;
    });
  return res;
}

async function runCodeStatus(codeDetails) {
  const res = axiosinstance
    .post("/problem/runStatus", codeDetails)
    .catch((err) => {
      return err;
    });
  return res;
}

async function submitCodeApi(submitCodeDetails) {
  console.log(submitCodeDetails);
  const res = await axiosinstance
    .post("/problem/submit", submitCodeDetails)
    .catch((err) => {
      return err;
    });
  return res;
}

async function submitCodeStatusApi(submitCodeDetails) {
  const res = await axiosinstance
    .post("/problem/submitStatus", submitCodeDetails)
    .catch((err) => {
      return err;
    });
  return res;
}

async function getEditorData(problemDetails) {
  const res = await axiosinstance.post("/problem/editor", problemDetails)
    .catch((err) => {
      console.log(err);
      return err;
    });
  return res.data;
}
async function getTestCaseData(problemDetails) {
  const res = await axiosinstance.post("/problem/testcase", problemDetails)
    .catch((err) => {
      console.log(err);
      return err;
    });
   
  return res?.data?.data?.question?.exampleTestcaseList;
}

export {
  login,
  getallproblems,
  getProblemDetails,
  getOcr,
  genaiApi,
  runCode,
  runCodeStatus,
  submitCodeApi,
  getEditorData,
  getTestCaseData,
  submitCodeStatusApi
};