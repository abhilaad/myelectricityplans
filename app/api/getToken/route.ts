export async function POST() {
    const res = await fetch('https://27tbkfjjri.execute-api.ap-southeast-2.amazonaws.com/staging/generate-token', {
    method: "POST",
    headers: {
    "Api-key": process.env.API_KEY as string // reading API-key from env
    }
  })   
    const data = await res.json()   
    return Response.json(data)
  }