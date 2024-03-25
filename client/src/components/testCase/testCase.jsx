
import styles from "./testCase.module.css";


export const TestCase = (prop) => {
  const color = prop.state.compare_result[prop.idx];
  return (
    <>
       <div className={styles.testCase_wrapper}
       style={{
         backgroundColor: color==='1'  ? "#2B372A" : "#372A2B",
          color: color==='1' ? "#5CF761" : "#F7615C",
          fontFamily:"Monospace",
          fontWeight:700
       }}
       >
        output:{prop.state.code_answer[prop.idx]}
        <br/>
        expected:{prop.state.expected_code_answer[prop.idx]}
       </div>
    </>
  )
}

