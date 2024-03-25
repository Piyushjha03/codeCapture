import styles from './bracketLoader.module.css'

export const BracketLoader = () => {
  return (
    <>
    <div className={styles.jelly}></div>
    <svg width="0" height="0" className={styles.jelly_maker}>
    <defs>
    <filter id="uib-jelly-ooze">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6.25" result="blur"></feGaussianBlur>
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="ooze"></feColorMatrix>
      <feBlend in="SourceGraphic" in2="ooze"></feBlend>
    </filter>
    </defs>
    </svg>
    </>
  )
}

