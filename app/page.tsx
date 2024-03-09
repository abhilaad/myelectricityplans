import Cards from "./_components/card/Cards";

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
<div style={{width:"100%", padding: "5px"}}>
<Cards tokenData={res?.data} />
</div>
</>
  );
}
