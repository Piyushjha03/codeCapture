import { response } from "express";
import {
  globaldata,
  problemsetQuestionList,
  getProblemContent,
  questionEditorData,
  getTestCaseDataQuery,
} from "./query.js";
import axios from "axios";
// get global data api
export async function getGlobalData(loginDetails) {
  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: globaldata,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Csrftoken": `${loginDetails.csrf}`,
          Referer: "https://leetcode.com/",
          Cookie: `csrftoken=${loginDetails.csrf};LEETCODE_SESSION=${loginDetails.LEETCODE_SESSION}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// problemSetQuestionList
export async function getProblemSetQuestionList(problemDetails, cookieDetails) {
  const { categorySlug, limit, skip, filters } = problemDetails;
  const { csrftoken, LEETCODE_SESSION } = cookieDetails;
  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query: problemsetQuestionList,
        variables: { categorySlug, limit, skip, filters },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Csrftoken": `${csrftoken}`,
          Referer: "https://leetcode.com/",
          Cookie: `csrftoken=${csrftoken};LEETCODE_SESSION=${LEETCODE_SESSION}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// get problem details
export async function getProblemDetails(problemDetails) {
  const { title } = problemDetails;
  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query: getProblemContent,
      variables: { titleSlug: title },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getOcr(imageDetails) {
  try {
    const url = `https://serpapi.com/search?engine=google_lens&url=${imageDetails.url}&api_key=97639d8046f5f4b68c3962c5bac419f0e6180d6e78816ed8c0de28c3feb7eeb2`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    throw error;
  }
}
const axiosinstance = axios.create();

// run code
export async function runCode(codeDetails, cookies) {
  try {
    const getRunId = await axiosinstance.post(
      "https://leetcode.com/problems/two-sum/interpret_solution/",
      codeDetails,
      {
        headers: {
          "content-type": "application/json",
          cookie: `csrftoken=${cookies.csrftoken};LEETCODE_SESSION=${cookies.LEETCODE_SESSION}`,
          "x-csrftoken": `${cookies.csrftoken}`,
          Origin: "https://leetcode.com",
          Referer: `https://leetcode.com/problems/${codeDetails.title}/interpret_solution/`,
        },
      }
    );
    return getRunId;
  } catch (error) {
    throw error;
  }
}
export async function runCodeStatus(codeDetails, cookies) {
  try {
    const interpret_id = codeDetails.interpret_id;
    const getRunStatus = await axiosinstance.get(
      `https://leetcode.com/submissions/detail/${interpret_id}/check/`,
      {
        headers: {
          "content-type": "application/json",
          cookie: `csrftoken=${cookies.csrftoken};LEETCODE_SESSION=${cookies.LEETCODE_SESSION}`,
          "x-csrftoken": `${cookies.csrftoken}`,
          Origin: "https://leetcode.com",
          Referer: `https://leetcode.com/problems/${codeDetails.title}/interpret_solution/`,
        },
      }
    );
    return getRunStatus;
  } catch (error) {
    throw error;
  }
}

export async function submitCode(submitDetails, cookies) {
  try {
    const submission_id = await axiosinstance.post(
      `https://leetcode.com/problems/two-sum/submit/`,
      submitDetails,
      {
        headers: {
          "content-type": "application/json",
          cookie: `csrftoken=${cookies.csrftoken};LEETCODE_SESSION=${cookies.LEETCODE_SESSION}`,
          "x-csrftoken": `${cookies.csrftoken}`,
          Origin: "https://leetcode.com",
          Referer: `https://leetcode.com/problems/${submitDetails.title}/interpret_solution/`,
        },
      }
    );
    return submission_id;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

export async function submitCodeStatus(submitDetails, cookies) {
  try {
    const submission_id = submitDetails.submission_id;
    const titleSlug = submitDetails.title;
    const getSubmissionStatus = await axiosinstance.get(
      `https://leetcode.com/submissions/detail/${submission_id}/check/`,
      {
        headers: {
          "content-type": "application/json",
          cookie: `csrftoken=${cookies.csrftoken};LEETCODE_SESSION=${cookies.LEETCODE_SESSION}`,
          "x-csrftoken": `${cookies.csrftoken}`,
          Origin: "https://leetcode.com",
          Referer: `https://leetcode.com/problems/${titleSlug}/interpret_solution`,
        },
      }
    );
    return getSubmissionStatus;
  } catch (error) {
    throw error;
  }
}
export async function getQuestionEditorData(problemDetails, cookies) {
  try {
    const titleSlug = problemDetails.title;
    const editorData = await axios.post("https://leetcode.com/graphql", {
      query: questionEditorData,
      variables: { titleSlug: titleSlug },
      headers: {
        "content-type": "application/json",
        cookie: `csrftoken=${cookies.csrftoken};LEETCODE_SESSION=${cookies.LEETCODE_SESSION}`,
        "x-csrftoken": `${cookies.csrftoken}`,
        Origin: "https://leetcode.com",
        Referer: `https://leetcode.com/problems/${titleSlug}/interpret_solution/`,
      },
    });
    return editorData;
  } catch (error) {
    throw error;
  }
}
export async function getTestCaseData(problemDetails, cookies) {
  try {
    const titleSlug = problemDetails.title;
    const testCase = await axios.post("https://leetcode.com/graphql", {
      query: getTestCaseDataQuery,
      variables: { titleSlug: titleSlug },
      headers: {
        "content-type": "application/json",
        cookie: `csrftoken=${cookies.csrftoken};LEETCODE_SESSION=${cookies.LEETCODE_SESSION}`,
        "x-csrftoken": `${cookies.csrftoken}`,
        Origin: "https://leetcode.com",
        Referer: `https://leetcode.com/problems/${titleSlug}/interpret_solution/`,
      },
    });
    return testCase;
  } catch (error) {
    throw error;
  }
}
