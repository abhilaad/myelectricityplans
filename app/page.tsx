import Cards from "./_components/card/Cards";

async function getData() {
  const res = await fetch('http://localhost:3000/api/getToken', {
    method: "POST",    
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
