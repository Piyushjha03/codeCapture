
import { useNavigate } from "react-router-dom";
import styles from "./problemCard.module.css";
import PropTypes from "prop-types";
export const ProblemCard = (props) => {
  const difficulty = {
    Easy: "#09B09C",
    Medium: "#F0B721",
    Hard: "#FF375F",
  };

  const nav=useNavigate()
  return (
    <>
      <div
        className={styles.problemCard}
        style={{ background: difficulty[props.difficulty] }}
        onClick={() => {
         nav(`/problem/${props.title.replace(/[()]/g, '').split(' ').join('-')}`)
        }}
      >
        <div className={styles.problemCardTitle}>{props.title}</div>
        <div className={styles.acceptanceRate}>
          Acceptance:{props.acRate.toPrecision(3)}%
        </div>
        <div className={styles.problemTags}>
          {props.topicTags.map((tag) => {
            return (
                <div key={tag.id} className={styles.tag}>{tag.name}</div>
            );
          })}
        </div>
      </div>
    </>
  );
};

ProblemCard.propTypes = {
  title: PropTypes.string.isRequired,
  acRate: PropTypes.number,
  difficulty: PropTypes.string.isRequired,
  topicTags: PropTypes.array,
};
