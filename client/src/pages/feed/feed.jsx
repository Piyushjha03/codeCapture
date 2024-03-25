import {  useQuery } from "@tanstack/react-query";
import { ProblemCard } from "../../components/problemCard/problemCard";
import styles from "./feed.module.css";
import { BiSearchAlt } from "react-icons/bi";
import { getallproblems, login } from "../../api";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { FadeLoader, RingLoader } from "react-spinners";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const tags = {
  array: "Array",
  string: "String",
  "hash-table": "Hash Table",
  "dynamic-programming": "Dynamic Programming",
  math: "Math",
  sorting: "Sorting",
  greedy: "Greedy",
  "depth-first-search": "Depth-First Search",
  database: "Database",
  "binary-search": "Binary Search",
  "breadth-first-search": "Breadth-First Search",
  tree: "Tree",
  matrix: "Matrix",
  "bit-manipulation": "Bit Manipulation",
  "two-pointers": "Two Pointers",
  "binary-tree": "Binary Tree",
  "heap-priority-queue": "Heap (Priority Queue)",
  "prefix-sum": "Prefix Sum",
  stack: "Stack",
  simulation: "Simulation",
  graph: "Graph",
  design: "Design",
  counting: "Counting",
  "sliding-window": "Sliding Window",
  backtracking: "Backtracking",
  "union-find": "Union Find",
  "linked-list": "Linked List",
  enumeration: "Enumeration",
  "ordered-set": "Ordered Set",
  "monotonic-stack": "Monotonic Stack",
  trie: "Trie",
  "number-theory": "Number Theory",
  "divide-and-conquer": "Divide and Conquer",
  recursion: "Recursion",
  bitmask: "Bitmask",
  queue: "Queue",
  "binary-search-tree": "Binary Search Tree",
  "segment-tree": "Segment Tree",
  memoization: "Memoization",
  geometry: "Geometry",
  "hash-function": "Hash Function",
  "binary-indexed-tree": "Binary Indexed Tree",
  "topological-sort": "Topological Sort",
  "string-matching": "String Matching",
  combinatorics: "Combinatorics",
  "rolling-hash": "Rolling Hash",
  "shortest-path": "Shortest Path",
  "game-theory": "Game Theory",
  interactive: "Interactive",
  "data-stream": "Data Stream",
  brainteaser: "Brainteaser",
  "monotonic-queue": "Monotonic Queue",
  randomized: "Randomized",
  "merge-sort": "Merge Sort",
  iterator: "Iterator",
  concurrency: "Concurrency",
  "doubly-linked-list": "Doubly-Linked List",
  "probability-and-statistics": "Probability and Statistics",
  quickselect: "Quickselect",
  "bucket-sort": "Bucket Sort",
  "suffix-array": "Suffix Array",
  "minimum-spanning-tree": "Minimum Spanning Tree",
  "counting-sort": "Counting Sort",
  shell: "Shell",
  "line-sweep": "Line Sweep",
  "reservoir-sampling": "Reservoir Sampling",
  "strongly-connected-component": "Strongly Connected Component",
  "eulerian-circuit": "Eulerian Circuit",
  "radix-sort": "Radix Sort",
  "rejection-sampling": "Rejection Sampling",
  "biconnected-component": "Biconnected Component",
};

export const Feed = () => {
  const [skip, setSkip] = useState(0);
  const [isprev, setIsprev] = useState(false);
  const [isnext, setIsnext] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tagsState, setTagsState] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const dropdownRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const loginDetails = {
    csrf: document?.cookie?.split("csrftokenfromserver=")[1]?.split(";")[0],
    LEETCODE_SESSION: document.cookie?.split("LEETCODE_SESSION_fromserver=")[1]?.split(";")[0],
  }
  const nav=useNavigate()
  const Auth = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      if(loginDetails.csrf !== '' && loginDetails.LEETCODE_SESSION !== ''){
        return await login(loginDetails);
      }
    },
    refetchOnWindowFocus: true,
    retry:false,
  });
  useEffect(()=>{
    if(Auth.isFetched && Auth.data) {
      if(Auth.data?.data?.userStatus?.username !== userInfo?.username){
        localStorage.removeItem("userInfo");
        nav("/login");
      }
    }
    if(Auth.isError){
      localStorage.removeItem("userInfo");
      nav("/login");
    }
  },[Auth.data ,userInfo,Auth.isError])

  const feedData = useQuery({
    queryKey: ["feed"],
    queryFn: () =>
      getallproblems({
        categorySlug: "",
        limit: 10,
        skip: skip,
        filters: {
          ...(searchValue && { searchKeywords: searchValue }),
        ...(tagsState.length > 0 && { tags: tagsState }),
        },
      }),
    staleTime: Infinity,
  });

  useEffect(() => {
    feedData.refetch();
  }, [skip]);

  

  useEffect(() => {
    if (!feedData.isFetching) {
      setIsprev(false);
      setIsnext(false);
    }
  }, [feedData.isFetching]);

  const handleNextClick = () => {
    setIsnext(true);
    setSkip(() =>
      Math.min(skip + 10, feedData.data.data.problemsetQuestionList.total - 10)
    );
  };
  const handlePrevClick = () => {
    setIsprev(true);
    setSkip(() => {
      Math.max(skip - 10, 0);
    });
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    if (searchValue === "") {
      feedData.refetch();
    } else {
      setSearchValue(searchValue);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropDown(false);
    }
  };
  return (
    <>
      {feedData.isLoading ? (
        <div className={styles.initialLoader}><RingLoader color="#FD7954" size={200} /></div>
      ) : feedData.isError ? (
        <div>Error...</div>
      ) : (
        <div className={styles.feedPage_wrapper}>
          <div className={styles.feedPage_container}>
            <div className={styles.header}>
              <div className={styles.logo}>codeCapture</div>
              <div className={styles.accountInfo}>
                <div className={styles.avatar}>
                  <img
                    src={
                      userInfo?.avatar ||
                      `https://thumbs.dreamstime.com/b/profile-placeholder-image-gray-silhouette-no-photo-profile-placeholder-image-gray-silhouette-no-photo-person-avatar-123478438.jpg?w=992}`
                    }
                  />
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.realName}>
                    Hi, {userInfo?.realname}
                  </div>
                  <div className={styles.username}>{userInfo?.username}</div>
                </div>
              </div>
            </div>
            <div className={styles.seachbarWrapper} ref={dropdownRef}>
              <div className={styles.seachbar}>
                <input
                  className={styles.problemSearch}
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => {
                    handleSearch(e);
                  }}
                  onFocus={() => {
                    setDropDown(true);
                  }}
                />
                <div
                  className={styles.searchIcon}
                  onClick={() => {
                    setDropDown(false);
                    feedData.refetch();
                  }}
                >
                  <BiSearchAlt />
                </div>
              </div>
              {dropDown && (
                <div className={styles.autocomplete}>
                  <ul className={styles.tagList}>
                    {Object.keys(tags).map(
                      (tag) =>
                        !tagsState.includes(tag) && (
                          <>
                            <li
                              key={tag}
                              className={styles.tagItem}
                              onClick={() => {
                                setTagsState([...tagsState, tag]);
                                setDropDown(false);
                              }}
                            >
                              {tags[tag]}
                            </li>
                          </>
                        )
                    )}
                  </ul>
                </div>
              )}
              {tagsState.length > 0 && (
                <>
                  <div className={styles.selectedTags}>
                    {tagsState.map((tag) => {
                      return (
                        <div
                          className={styles.selectedTag}
                          key={tag}
                          onClick={() => {
                            const updatedList = tagsState.filter(
                              (item) => item !== tag
                            );
                            setTagsState(updatedList);
                          }}
                        >
                          <span>
                            {tag} {"\u00A0"} <RiDeleteBin6Fill />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className={styles.problemFeedWrapper}>
              <div className={styles.problemFeed}>
                {feedData?.data?.data?.problemsetQuestionList?.questions.map(
                  (eachQuestion) => {
                    return (
                      <ProblemCard
                        key={eachQuestion.frontendQuestionId}
                        title={eachQuestion.title}
                        acRate={eachQuestion.acRate}
                        difficulty={eachQuestion.difficulty}
                        topicTags={eachQuestion.topicTags}
                      />
                    );
                  }
                )}
              </div>
              <div className={styles.changePage}>
                <div
                  className={styles.prevPage}
                  onClick={() => {
                    handlePrevClick();
                  }}
                >
                  {feedData.isFetching && isprev ? (
                    <>
                      <FadeLoader color="coral" />
                    </>
                  ) : (
                    <>
                      <MdOutlineNavigateBefore /> Prev
                    </>
                  )}
                </div>
                <div
                  className={styles.nextPage}
                  onClick={() => {
                    handleNextClick();
                  }}
                >
                  {feedData.isFetching && isnext ? (
                    <>
                      <FadeLoader color="coral" />
                    </>
                  ) : (
                    <>
                      Next
                      <MdOutlineNavigateNext />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
