import type { NextRequest } from 'next/server'
import { headers } from 'next/headers'
export async function POST(request: NextRequest) {
    const headersList = headers()
    const authToken = headersList.get('Auth-token')
    const serviceId = headersList.get('ServiceId')
    const countryId = headersList.get('CountryId')
    const reqBody = await streamToString(request.body)

    const res = await fetch('https://27tbkfjjri.execute-api.ap-southeast-2.amazonaws.com/staging/energy/plan/list', {
    method: "POST", 
    body: reqBody,   
    headers: {
      "Content-Type": "application/json",  
      "Api-Key": process.env.API_KEY as string,
      "ServiceId": serviceId as string ,  
      "CountryId": countryId as string,
      "Auth-token": authToken as string, 
      
    }
  })   
    const data = await res.json()
   
    return Response.json(data)
  }

  async function streamToString(stream: any) {
    const chunks = [];
    for await (const chunk of stream) {
    chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
    }