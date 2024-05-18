import express from "express";
import {
  getOcr,
  getProblemDetails,
  getQuestionEditorData,
  getTestCaseData,
  runCode,
  runCodeStatus,
  submitCode,
  submitCodeStatus,
} from "../api.js";
import { promises } from "stream";

const problemRouter = express.Router();

problemRouter.post("/content", async (req, res) => {
  const problemDetails = req.body;

  const response = await getProblemDetails(problemDetails).catch((err) => {
    return res.status(400).send(err);
  });
  return res.status(200).send(response.data);
});

problemRouter.post("/ocr", async (req, res) => {
  const imageDetails = req.body;
  const response = await getOcr(imageDetails).catch((err) => {
    return res.status(400).send(err);
  });
  return res.status(200).send(response.data);
});

problemRouter.post("/run", async (req, res) => {
  const codeDetails = req.body;
  const cookies = req.cookies;
  console.log("====================================");
  console.log("cookies", cookies);
  console.log("====================================");
  const response = await runCode(codeDetails, cookies).catch((err) => {
    return res.status(400).send(err);
  });
  return res.status(200).send(response.data);
});
problemRouter.post("/runStatus", async (req, res) => {
  const codeDetails = req.body;
  const cookies = req.cookies;
  const response = await runCodeStatus(codeDetails, cookies).catch((err) => {
    return res.status(400).send(err);
  });
  return res.status(200).send(response.data);
});

// submit solution
problemRouter.post("/submit", async (req, res) => {
  const submitDetails = req.body;
  const cookies = req.cookies;
  const response = await submitCode(submitDetails, cookies).catch((err) => {
    return res.status(400).send(err);
  });
  return res.status(200).send(response.data);
});

// get submit status
problemRouter.post("/submitStatus", async (req, res) => {
  const submitDetails = req.body;
  const cookies = req.cookies;
  const response = await submitCodeStatus(submitDetails, cookies).catch(
    (err) => {
      return res.status(400).send(err);
    }
  );
  return res.status(200).send(response.data);
});

// get question editor data
problemRouter.post("/editor", async (req, res) => {
  const editorDetails = req.body;
  const cookies = req.cookies;
  const response = await getQuestionEditorData(editorDetails, cookies).catch(
    (err) => {
      return res.status(400).send(err);
    }
  );
  console.log(response);
  return res.status(200).send(response.data.data);
});

// get test cases
problemRouter.post("/testcase", async (req, res) => {
  const problemDetails = req.body;
  const cookies = req.cookies;
  const response = await getTestCaseData(problemDetails, cookies).catch(
    (err) => {
      return res.status(400).send(err);
    }
  );
  return res.status(200).send(response.data);
});

export default problemRouter;
