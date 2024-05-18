import styles from "./login.module.css";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";
import BounceLoader from "react-spinners/BounceLoader";
import { FaLocationArrow } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import leetcodelogo from "../../assets/leetcode.svg";

const Login = () => {
  // usestates
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    csrf: "",
    LEETCODE_SESSION: "",
  });
  const nav = useNavigate();

  const notify = (msg) => {
    toast.error(`${msg} !`, {
      position: "top-center",
    });
  };

  const mutation = useMutation({
    mutationFn: async (e) => {
      e.preventDefault();
      if (loginDetails.csrf !== "" && loginDetails.LEETCODE_SESSION !== "") {
        return await login(loginDetails);
      }
    },
    onError: (error) => {
      console.log(error);
      const msg = error?.response?.data || "Something went wrong!";
      notify(msg);
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.userStatus?.username !== undefined) {
        if (data.data.userStatus.username !== "") {
          console.log(data);
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              username: `${data.data.userStatus.username}`,
              realname: `${data.data.userStatus.realName}`,
              avatar: `${data.data.userStatus.avatar}`,
            })
          );
          nav("/feed");
        } else {
          localStorage.removeItem("userInfo");
          mutation.reset();
        }
      }
    },
  });

  const handleInput = (e) => {
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* 

    {mutation.isError ? <div>error...</div> : null}
    {mutation.isSuccess ? <div>success...</div> : null}
    {mutation.isIdle ? <div>idle...</div> : null} */}
      <>
        <div className={styles.homePage_wrapper}>
          <div className={styles.homePage_container}>
            <ToastContainer />
            <div className={styles.formContainer}>
              {isModalOpen ? (
                <pre className={styles.info}>
                  <span
                    className={styles.closeModal}
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    X
                  </span>
                  How to login manually ? {"\n \n"} 1. Login to your{" "}
                  <a
                    style={{ color: "orange" }}
                    href="https://leetcode.com"
                    target="_blank"
                  >
                    Leetcode account.
                  </a>{" "}
                  {"\n"}
                  2. Inspect element by right clicking on the page or press
                  control+shift+j {"\n"}
                  3. Go to application tab {"\n"}
                  4. Find cookies in the left panel {"\n"}
                  5. Copy csrf token and LEETCODE_SESSION
                </pre>
              ) : (
                <form
                  className={styles.form}
                  action=""
                  onSubmit={(e) => mutation.mutate(e)}
                >
                  <div className={styles.loginwithleetcode}>
                    <a href="https://leetcode.com/authorize-login/http/?path=codecapture.vercel.app/authorize-login">
                      <span>Continue with Leetcode</span>
                      <img
                        src={leetcodelogo}
                        alt="leetcode"
                        height={50}
                        width={50}
                      />
                    </a>
                  </div>

                  <span className={styles.orText}>-- Or Login Manually --</span>
                  <span
                    className={styles.info_desk}
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    ?
                  </span>
                  <input
                    type="text"
                    className={styles.input1}
                    name="csrf"
                    placeholder="csrf"
                    onChange={(e) => handleInput(e)}
                  />
                  <input
                    type="text"
                    className={styles.input2}
                    name="LEETCODE_SESSION"
                    placeholder="LEETCODE_SESSION"
                    onChange={(e) => handleInput(e)}
                  />
                  {mutation.isPending ? (
                    <div className={styles.loader}>
                      <BounceLoader color="#FE7954" />
                    </div>
                  ) : (
                    <button className={styles.submitbtn} type="sumbit">
                      <FaLocationArrow />
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Login;
