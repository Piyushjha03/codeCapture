import styles from "./button.module.css";
import PropTypes from "prop-types";
export const Button = (props) => {
  return (
    <>
      <a className={styles.button} href="#">
        <span className={styles.button__icon_wrapper}>
          <svg
            width="10"
            className={styles.button__icon_svg}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 15"
          >
            <path
              fill="currentColor"
              d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
            ></path>
          </svg>

          <svg
            className={`${styles.button__icon_svg}  ${styles.button__icon_svg__copy}`}
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            fill="none"
            viewBox="0 0 14 15"
          >
            <path
              fill="currentColor"
              d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
            ></path>
          </svg>
        </span>
        {props.name}
      </a>
    </>
  );
};
Button.propTypes = {
    name:PropTypes.string.isRequired
  };