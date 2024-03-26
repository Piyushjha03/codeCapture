import styles from "./problem.module.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  genaiApi,
  getEditorData,
  getOcr,
  getProblemDetails,
  getTestCaseData,
  runCode,
  runCodeStatus,
  submitCodeApi,
  submitCodeStatusApi,
} from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { FaCamera } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { IoIosCloseCircle } from "react-icons/io";
import { Loader } from "../../components/loader/loader";
import { Button } from "../../components/button/button";
import { BracketLoader } from "../../components/loader/bracketLoader";
import { TestCase } from "../../components/testCase/testCase";
import { CodeEditor } from "../../components/codeEditor/codeEditor";
import { LuClock4 } from "react-icons/lu";
import { BsFillAwardFill } from "react-icons/bs";
import { MdOutlineMemory } from "react-icons/md";
import { CgFeed } from "react-icons/cg";

export const Problem = () => {
  // usestates
  const [isOpenProblem, setIsOpenProblem] = useState(false);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [ocrCode, setOcrCode] = useState("");
  const [testCase, setTestCase] = useState(null);
  const [runCodeStatusState, setRunCodeStatusState] = useState(null);
  const [isCompileError, setIsCompileError] = useState(false);
  const [originalTestCase, setOriginalTestCase] = useState(null);
  const [continuousLoader, setContinuousLoader] = useState(false);
  const [continuousLoaderSubmit, setContinuousLoaderSubmit] = useState(false);
  const [submission_id, setSubmission_id] = useState(null);
  const [isCompileErrorBySubmit, setIsCompileErrorBySubmit] = useState(false);
  const [submitOutput, setSubmitOutput] = useState(null);

  const currLoc = useLocation();
  const problemTitle = currLoc.pathname.split("/")[2];

  const problemData = useQuery({
    queryKey: ["problemDetails", problemTitle],
    queryFn: () =>
      getProblemDetails({
        title: problemTitle,
      }),
    staleTime: Infinity,
  });

  const editorData = useQuery({
    queryKey: ["editorData", problemTitle],
    queryFn: () => getEditorData({ title: problemTitle }),
    staleTime: Infinity,
  });
  useEffect(() => {
    const code = editorData?.data?.question?.codeSnippets?.find(
      (code) => code.lang === "C++" || code.langSlug === "cpp"
    )?.code;
    setOcrCode(code);
  }, [editorData.isFetched]);

  const testCaseData = useQuery({
    queryKey: ["testCaseData", problemTitle],
    queryFn: () => getTestCaseData({ title: problemTitle }),
    staleTime: Infinity,
  });
  useEffect(() => {
    setOriginalTestCase(testCaseData?.data);
  }, [testCaseData.isFetched]);

  const handletakePhoto = () => {
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.click();
  };
  const setImageToUpload = (e) => {
    setPhoto(e.target.files[0]);
  };
  const handleUploadPhoto = async () => {
    const formData = new FormData();
    formData.append("image", photo);
    try {
      const ocrData = await getOcr(formData);
      const data = ocrData.data.text_results;
      var result = "";
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          result += data[key].text + " ";
          const finalCode = await genaiApi(result);
          setOcrCode(ocrCode + finalCode);
          setPhoto(null);
          return;
        }
      }
    } catch (error) {
      return error;
    }
  };

  const mutation = useMutation({
    mutationFn: handleUploadPhoto,
    mutationKey: ["uploadPhoto"],
  });

  async function handleRun() {
    const res = await runCode({
      lang: "cpp",
      question_id: String(editorData?.data?.question?.questionFrontendId),
      typed_code: ocrCode,
      data_input: String(originalTestCase.join("\n")),
      title: problemTitle,
    });

    return res;
  }

  const runCodeMutation = useMutation({
    mutationFn: handleRun,
    mutationKey: ["runCode"],
    onSuccess: (data) => {
      setTestCase(data.data);
      runCodeStatusMutation.mutate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function handleRunStatus() {
    const testCaseNew = { ...testCase, title: problemTitle };
    const res = await runCodeStatus(testCaseNew);
    return res;
  }
  const runCodeStatusMutation = useMutation({
    mutationFn: handleRunStatus,
    mutationKey: ["runCodeStatus"],
    onSuccess: (data) => {
      setContinuousLoader(true);
      if (data.data.state !== "SUCCESS") {
        setTimeout(() => {
          runCodeStatusMutation.mutate();
        }, 1000);
      } else if (data.data.state === "SUCCESS") {
        if (data.data.status_code === 10) {
          setIsCompileError(false);
          setRunCodeStatusState(data.data);
          setContinuousLoader(false);
        } else if (data.data.status_code === 20) {
          setIsCompileError(true);
          setContinuousLoader(false);
          setRunCodeStatusState(data.data);
        }
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function submitCode() {
    const res = await submitCodeApi({
      lang: "cpp",
      question_id: editorData?.data?.question?.questionFrontendId,
      typed_code: ocrCode,
      title: problemTitle,
    });

    return res;
  }

  const submitCodeMutation = useMutation({
    mutationFn: submitCode,
    mutationKey: ["submitCode"],
    onSuccess: (data) => {
      setContinuousLoaderSubmit(true);
      if (data?.data?.submission_id) {
        setSubmission_id(data.data.submission_id);
        submitCodeStatusMutation.mutate();
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function submitCodeStatus() {
    const res = await submitCodeStatusApi({
      submission_id: submission_id,
      title: problemTitle,
    });

    return res;
  }
  const submitCodeStatusMutation = useMutation({
    mutationFn: submitCodeStatus,
    mutationKey: ["submitCodeStatus", submission_id],
    onSuccess: (data) => {
      console.log(data);
      if (data.data.state !== "SUCCESS") {
        setTimeout(() => {
          submitCodeStatusMutation.mutate();
        }, 2000);
      } else if (data.data.state === "SUCCESS") {
        setContinuousLoaderSubmit(false);
        if (data.data.status_code === 11 || data.data.status_code === 10) {
          console.log(data.data);
          setContinuousLoaderSubmit(false);
          setSubmitOutput(data.data);
        } else if (data.data.status_code === 20) {
          setIsCompileErrorBySubmit(true);
          setContinuousLoaderSubmit(false);
          setSubmitOutput(data.data);
        }
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const nav = useNavigate();
  return (
    <>
      <div className={styles.problemPage_wrapper}>
        <div
          className={styles.backtohome}
          onClick={() => {
            nav("/feed");
          }}
        >
          <CgFeed />
        </div>
        <div className={styles.problemTitle}>{problemTitle}</div>

        {/* problem content */}
        {isOpenProblem ? (
          <>
            <div className={styles.problemContentOpen}>
              <div
                className={styles.problemContentOpenIcon}
                onClick={() => {
                  setIsOpenProblem(!isOpenProblem);
                }}
              >
                <IoIosArrowDropupCircle />
              </div>
              <div
                className={styles.problemContent}
                dangerouslySetInnerHTML={{
                  __html: problemData?.data?.data?.question?.content,
                }}
              ></div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.problemContentClosed}>
              <div
                className={styles.problemContentClosedIcon}
                onClick={() => {
                  setIsOpenProblem(!isOpenProblem);
                }}
              >
                <IoIosArrowDropdownCircle />
              </div>

              <div
                className={styles.problemContent}
                dangerouslySetInnerHTML={{
                  __html: problemData?.data?.data?.question?.content,
                }}
              ></div>
            </div>
          </>
        )}

        {/* code editor */}
        <div className={styles.codeEditor}>
          {isCodeEditorOpen ? (
            <>
              <div className={styles.codeEditorOpen}>
                <div
                  className={styles.codeEditorOpenIcon}
                  onClick={() => {
                    setIsCodeEditorOpen(!isCodeEditorOpen);
                  }}
                  style={{
                    zIndex: "2",
                    position: "absolute",
                    top: "30px",
                    right: "30px",
                  }}
                >
                  <IoIosArrowDropupCircle />
                </div>
                <div className={styles.codearea}>
                  <CodeEditor
                    height={"650px"}
                    value={ocrCode}
                    setOcrCode={setOcrCode}
                  />
                  {mutation.isPending ? (
                    <>
                      <div className={styles.loader_pos}>
                        <Loader />
                      </div>
                    </>
                  ) : (
                    <>
                      {photo ? (
                        <div className={styles.photoPreview}>
                          <img
                            src={URL.createObjectURL(photo)}
                            alt="uploaded"
                          />
                          <div className={styles.photoOptions}>
                            <div
                              className={styles.removePhoto}
                              onClick={() => setPhoto(null)}
                            >
                              <IoIosCloseCircle />
                            </div>
                            <div
                              className={styles.uploadPhoto}
                              onClick={() => {
                                mutation.mutateAsync();
                              }}
                            >
                              <LuUpload />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={styles.takePhoto}
                          onClick={handletakePhoto}
                        >
                          <FaCamera />
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => setImageToUpload(e)}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.codeEditorClosed}>
                <CodeEditor
                  height="200px"
                  value={ocrCode}
                  setOcrCode={setOcrCode}
                />
                <IoIosArrowDropdownCircle
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: "2",
                    fontSize: "36px",
                  }}
                  onClick={() => {
                    setIsCodeEditorOpen(!isCodeEditorOpen);
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* original test cases */}
        {originalTestCase && (
          <div className={styles.testCaseCorousel}>
            {originalTestCase?.map((item, idx) => {
              const innercontent = item.split("\n");
              return (
                <div key={idx} className={styles.EachTestCase}>
                  {innercontent.map((cont, id) => {
                    return (
                      <div key={id} className={styles.input}>
                        {id % 2 === 0 ? "Input :\n" : "Output :\n"}
                        <pre>{cont}</pre>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
        {/* test cases output */}
        {runCodeStatusState ? (
          <div className={styles.testCaseCorousel}>
            {runCodeStatusState?.expected_code_answer?.map((item, idx) => {
              return (
                <>
                  <TestCase state={runCodeStatusState} idx={idx} />
                  {/* expected={item}
                real={runCodeStatusState.code_answer[idx]} */}
                </>
              );
            })}
          </div>
        ) : (
          (runCodeStatusMutation.isPending || continuousLoader) && (
            <div className={styles.loaderSkelton}>
              <Skeleton
                count={1}
                baseColor="#222"
                highlightColor="#444"
                height={20}
              />
              <Skeleton
                count={1}
                baseColor="#222"
                highlightColor="#444"
                height={20}
              />
              <Skeleton
                count={1}
                baseColor="#222"
                highlightColor="#555"
                height={20}
              />
            </div>
          )
        )}
        {/* compilation */}
        {isCompileError && (
          <>
            <div className={styles.compileError}>
              Skill Issues (compilation Error) :
              <pre>
                {" "}
                {runCodeStatusMutation?.data?.data?.full_compile_error}
              </pre>
            </div>
          </>
        )}
        {/* compilation error by submit */}
        {isCompileErrorBySubmit && (
          <>
            <div className={styles.compileError}>
              Skill Issues (compilation Error) :
              <pre>
                {" "}
                {submitCodeStatusMutation?.data?.data?.full_compile_error}
              </pre>
            </div>
          </>
        )}

        {/* submit output */}
        {submitOutput ? (
          <>
            <div className={styles.submissionResult_wrapper}>
              <div className={styles.submissionResult}>
                <div className={styles.submission_msg}>
                  {submitOutput.status_msg}
                </div>

                <div
                  className={styles.submission_testCasePassed}
                  style={{
                    background:
                      submitOutput.total_correct ===
                      submitOutput.total_testcases
                        ? "#5CF761"
                        : "#F7615C",
                  }}
                >
                  {submitOutput.total_correct} / {submitOutput.total_testcases}{" "}
                  testcases passed
                </div>
                {submitOutput.status_code !== 10 && (
                  <div className={styles.submission_lastTestCase}>
                    <div className={styles.submission_lastTestCase_input}>
                      Input : <pre>{submitOutput.input}</pre>
                    </div>
                    <div className={styles.submission_lastTestCase_output}>
                      Output : <pre>{submitOutput.code_output}</pre>
                    </div>
                    <div
                      className={styles.submission_lastTestCase_expectedOutput}
                    >
                      Expected Output :{" "}
                      <pre>{submitOutput.expected_output}</pre>
                    </div>
                  </div>
                )}
                {submitOutput.status_code === 10 && (
                  <div className={styles.CorrectOutput}>
                    <div className={styles.runtime}>
                      <span>
                        <LuClock4 /> Runtime :{" "}
                      </span>{" "}
                      <pre>{submitOutput.status_runtime}</pre>
                      <span>
                        <BsFillAwardFill /> Percentile :
                      </span>{" "}
                      <pre>{submitOutput.runtime_percentile.toFixed(2)}</pre>
                    </div>
                    <div className={styles.memory}>
                      <span>
                        <MdOutlineMemory /> Memory :{" "}
                      </span>{" "}
                      <pre>{submitOutput.status_memory}</pre>
                      <span>
                        <BsFillAwardFill /> Percentile :{" "}
                      </span>{" "}
                      <pre>{submitOutput.memory_percentile.toFixed(2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          (submitCodeStatusMutation.isPending || continuousLoaderSubmit) && (
            <>
              <div className={styles.loaderSkelton}>
                <Skeleton
                  count={1}
                  baseColor="#222"
                  highlightColor="#444"
                  height={20}
                />
                <Skeleton
                  count={1}
                  baseColor="#222"
                  highlightColor="#444"
                  height={20}
                />
                <Skeleton
                  count={1}
                  baseColor="#222"
                  highlightColor="#555"
                  height={20}
                />
              </div>
            </>
          )
        )}

        {/* run and submit button */}
        <div className={styles.buttonOptions}>
          <div
            className={styles.runBttn}
            onClick={() => {
              setIsCompileError(false);
              setIsCompileErrorBySubmit(false);
              setRunCodeStatusState(null);
              setSubmitOutput(null);
              setSubmission_id(null);
              setTestCase(null);
              runCodeMutation.mutate();
            }}
          >
            {runCodeMutation.isPending ? (
              <BracketLoader />
            ) : (
              <Button name="Run" />
            )}
          </div>
          <div
            className={styles.submitBttn}
            onClick={() => {
              setIsCompileErrorBySubmit(false);
              setIsCompileError(false);
              setSubmitOutput(null);
              setRunCodeStatusState(null);
              setSubmission_id(null);
              setTestCase(null);
              submitCodeMutation.mutate();
            }}
          >
            {submitCodeMutation.isPending ? (
              <BracketLoader />
            ) : (
              <Button name="Submit" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

//
