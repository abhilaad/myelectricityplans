import Cards from "./_components/card/Cards";
import styles from "./page.module.css";

// calling token api on server side
// Api-key is fetched from .env.local file
async function getData() {
  const res = await fetch('https://27tbkfjjri.execute-api.ap-southeast-2.amazonaws.com/staging/generate-token', {
    method: "POST",
    headers: {
      "Api-key": process.env.API_KEY as string
    }
  })  
  return res.json()
}

export default async function Home() {
  const res = await getData()  
  return (
<>
<div className={styles.mainContainer}>
  {/* Fetching plans on client side and displaying in cards */}
<Cards tokenData={res?.data} />
</div>
</>
  );
}
