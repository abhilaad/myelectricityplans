import Image from 'next/image'
import styles from "./Header.module.css"

const Header = ({totalLength}: {totalLength : Number}) => {
  return (
    <>
    <div className={styles.headerContainer}>
        <div className={styles.rowOne}>
            <div className={styles.leftSection}>
                <span className={styles.leftSectionTitle} >Electricity</span>
                <span className={styles.leftSectionCount}>{totalLength.toString()}</span>
            </div>
            <div className={styles.rightSection}>
                <div className={styles.location}>
                <Image src='/location-dot-solid.svg' alt='location' width={10} height={14} /> 2000, NSW
                </div>
                <div className={styles.filterButton} >
                <Image src='/filter.png' alt='filter' width={15} height={12} style={{color: "white"}} /> Filter
                </div>
            </div>

        </div>

        <div className={styles.rowTwo}>
        <span className={styles.notificationIcon}>i</span>
        <span className={styles.headerSummary}>
            Initial recommendations are based on average medium usage as determined by relevant energy regulators, please view the information hover next to the estimated cost box for more information. For a more accurate comparison relevant to your circumstances, please use the Bill Details tab on the results page to enter your most recent energy bill details.
        </span>

        </div>

    </div>
    </>
  )
}

export default Header