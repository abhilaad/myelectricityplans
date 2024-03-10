import Cards from "./_components/card/Cards";
import styles from "./page.module.css";

export default async function Home() {   
  return (
<>
<div className={styles.mainContainer}>
  {/* Fetching plans on client side and displaying in cards */}
<Cards />
</div>
</>
  );
}
