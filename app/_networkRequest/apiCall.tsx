export const getTokenData = async()=>{
return await fetch("/api/getToken", {
    method: "POST"
}).then((res) => res.json())
}

export const getProductsData = async(token: string)=>{
    const body = {
        "post_code": "2000,Barangaroo,NSW",
        "visit_id": "K3FKRThMV2RXVVVwRlpwVXBNOXBDUT09",
        "property_type": 1,
        "life_support": 0,
        "movin_type": 0,
        "life_support_value": "",
        "solar_panel": 1,
        "energy_type": 3,
        "electricity_bill": 0,
        "gas_bill": 0,
    }
    return await fetch('/api/getPlans', {
        method: "POST",
        headers: {
            "Auth-Token": token,
            "Content-Type": "application/json",
            "CountryId": "1",
            "ServiceId": "1",
        },
        body: JSON.stringify(body)
    }).then((res) => res.json())
}