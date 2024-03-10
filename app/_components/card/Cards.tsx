"use client"
import Image from 'next/image'
import styles from "./Card.module.css"
import ConnectOnlineButton from './ConnectOnlineButton'
import React, { useState, useEffect } from 'react'
import Header from '../Header/Header'

interface ElectricityData {
    id: Number;
    provider_id: Number;
    expected_annually_bill_amount: Number;
    expected_monthly_bill_amount: Number;
    plan_name: string;
    show_annually_desc: string;
    view_benefit: string | null;
    view_bonus: string | null;
    view_contract: string | null;
    view_discount: string | null;
    view_exit_fee: string | null;
}

interface ProviderData {
    user_id: Number;
    logo: string;
}

const Cards = () => {    
    const [electricityPLans, setElectricityPlans] = useState<ElectricityData[]>([])
    const [providersData, setProviders] = useState<ProviderData[]>([])
    const [isLoading, setLoading] = useState(true)
    const [mainData, setMainData] = useState<Record<string,any>>({})

    // request body for calling plans API
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

    // useEffect(() => {
    //     // storing token and expire time in localStorage that comes through server side token api 
    //     // if (tokenData) {
    //     //     storeTokenLocalStorage(tokenData)            
    //     // }
    // }, [tokenData])

    useEffect(() => {
        callPlanApi()
    }, [])

    useEffect(()=>{
        // extracting only the necessary data that is required to show in the UI
        // Assumption made here is for electricity and providers data
        if(Object.keys(mainData)?.length){
            let eArr = []
            let pArr = []
            for(const key in mainData?.All_plans?.electricity){
                eArr.push({id: mainData?.All_plans?.electricity[key]?.id,
                provider_id: mainData?.All_plans?.electricity[key]?.provider_id,
                expected_annually_bill_amount: mainData?.All_plans?.electricity[key]?.expected_annually_bill_amount,
                expected_monthly_bill_amount: mainData?.All_plans?.electricity[key]?.expected_monthly_bill_amount,
                plan_name: mainData?.All_plans?.electricity[key]?.plan_name,
                show_annually_desc: mainData?.All_plans?.electricity[key]?.show_annually_desc,
                view_benefit: mainData?.All_plans?.electricity[key]?.view_benefit,
                view_bonus: mainData?.All_plans?.electricity[key]?.view_bonus,
                view_contract: mainData?.All_plans?.electricity[key]?.view_contract,
                view_discount: mainData?.All_plans?.electricity[key]?.view_discount,
                view_exit_fee: mainData?.All_plans?.electricity[key]?.view_exit_fee
                })
            }
            for(const key in mainData?.providers){
                pArr.push({user_id: mainData?.providers[key]?.user_id,
                logo: mainData?.providers[key]?.logo
                })
            }                        
            setElectricityPlans(eArr)                        
            setProviders(pArr)            
        }
    },[mainData])  
    
    const storeTokenLocalStorage = (data : {token_expire_time : string, token: string})=>{
        const expireTime = new Date(data?.token_expire_time)
        const millis = expireTime.getTime().toString()
        window.localStorage.setItem("token", data?.token)
        window.localStorage.setItem("expireMillis", millis)
    }

    // function to call when token expires or no token was found in localStorage
    const callTokenApi = async()=>{
        try{
            const tokenRes = await fetch("/api/getToken", {
                method: "POST"
            })
            const tokenJson = await tokenRes.json()
            // function to store token data in localStorage
            storeTokenLocalStorage(tokenJson?.data)           
            await fetch('/api/getPlans', {
                method: "POST",
                headers: {
                    "Auth-Token": tokenJson?.data?.token as string,
                    "Content-Type": "application/json",
                    "CountryId": "1",
                    "ServiceId": "1",
                },
                body: JSON.stringify(body)
            }).then((res) => res.json()).then((resp) => {
                if(resp?.data){
                    setMainData(resp?.data)
                }                    
                setLoading(false)                        
            })
        }
        catch(err){                
            setLoading(false)                
        }        
    }
    
    const callPlanApi = async () => {   
        // if token is set to localStorage go to if case to directly call plans Api     
        if(localStorage.getItem("token")){
            try{
                await fetch('/api/getPlans', {
                    method: "POST",
                    headers: {
                        "Auth-token": localStorage.getItem("token") as string,
                        "CountryId": "1",
                        "ServiceId": "1",
                    },
                    body: JSON.stringify(body)
                }).then((res) => res.json()).then(async(resp) => {
                    // token expire case (code === 2006)
                    if(resp?.code === 2006){
                        await callTokenApi()
                    }
                    else{
                        if(resp?.data){
                            setMainData(resp?.data)
                        }                       
                        setLoading(false)
                    }                    
                })
            }
            catch(err){
                setLoading(false)                
            }
        }
        else{
            await callTokenApi()
        }
    }    

    return (
        <>
        {isLoading ? <div className={styles.shimmer}>Loading....</div> : <Header totalLength={electricityPLans.length} />}                
         {electricityPLans?.length && providersData?.length > 0 ? electricityPLans.map((item)=>{
            // extracting logo for the items based on respective providers
            const imageLogo: string | undefined = providersData?.find((ele)=> ele?.user_id === item?.provider_id)?.logo
            // removing p tag from below strings
            const viewBenefit = item.view_benefit?.replace(/<\/?p>/g, '')
            const viewBonus = item.view_bonus?.replace(/<\/?p>/g, '')
            const viewContract = item.view_contract?.replace(/<\/?p>/g, '')
            const viewDiscount = item.view_discount?.replace(/<\/?p>/g, '')
            const viewExitFee = item.view_exit_fee?.replace(/<\/?p>/g, '')         
            
            return (<div key={item?.id.toString()} className={styles.cardContainer}>
                <div className={styles.rowContainerOne}>
    
                    <div className={styles.sectionOne}>
    
                        <span className={styles.electricityLegend}>
                            <Image src='/lightbulb-solid.svg' alt='electricity' width={15} height={25} style={{ marginRight: "10px" }} />
                            Electricity
                        </span>
                        <span className={styles.solarLegend}>
                            <Image src='/solar-panel-solid.svg' alt='solar' width={20} height={25} style={{ marginRight: "10px" }}/>
                            Solar
                        </span>
                        <div style={{ padding: "5px" }}>
                            <Image src={imageLogo ? imageLogo : ""} width={130} height={60} alt='company-icon' style={{borderRadius: "100%"}} />
                        </div>
                        <div className={styles.viewDetails}>
                            View Details
                        </div>
                        <div className={styles.viewBasicDetail}>
                            Basic Plan Information Document
                        </div>    
                    </div>
    
                    <div className={styles.sectionTwo}>
                        <div className={styles.refPrice}>
                            <span style={{display: "block", padding: "3px"}}>29 % less than</span>
                            <span style={{display: "block", padding: "3px"}}>the current reference price</span>
                        </div>
                        <div style={{ padding: "2px" }}>
                            <ul className={styles.planContainer}>
                                {[viewBenefit,viewBonus,viewContract,viewDiscount,viewExitFee].map((ele,ind)=>{
                                    return (<React.Fragment key={ind}>
                                    {ele?.length ? <li className={styles.textWrapper}><Image src='/check-solid.svg' alt='check' width={20} height={14} />{ele}</li> : null }
                                    </React.Fragment>)
                                })}

                                {/* Below text is static */}                                
                                <li className={styles.textWrapper}><span style={{ backgroundColor: "#cbf2f2", padding: "3px" }}><Image src='/wallet-solid.svg' alt='wallet' width={20} height={14} /> Standard Feed in Tariff: 5c</span></li>
                            </ul>
                        </div>
                    </div>
    
                    <div className={styles.sectionThree} >
                        <div className={styles.estimatedCostContainer}>
                            <div className={styles.estimatedCostTitle}>
                                <span style={{ paddingRight: "10px" }}>Estimated Cost</span>
                                <span className={styles.estimatedCostIcon} >i</span>
                            </div>
                            <div className={styles.perYear}>
                                ${item?.expected_annually_bill_amount.toString()}^<span className={styles.smallText}>/yr</span>
                            </div>
                            <div className={styles.perMonth}>
                                ${item?.expected_monthly_bill_amount.toString()}<span className={styles.smallText}>/mo</span>
                            </div>
                        </div>    
                    </div>
    
                </div>    
    
                <div className={styles.rowContainerTwo}>
                    {item.show_annually_desc}
                </div>   
    
                <div className={styles.rowContainerThree} >
                    <div className={styles.footerLeftSection}>
                        <div style={{ paddingBottom: "5px" }}>
                            <span><Image src='/check-solid.svg' alt='check' width={20} height={14} />10 business days cooling off period</span>
                            <span><Image src='/check-solid.svg' alt='check' width={20} height={14} />Secure signup in 5 mins</span>
                            <span><Image src='/check-solid.svg' alt='check' width={20} height={14} />Save time and effort</span>
                        </div>
                        <div>
                            ^The estimated cost includes any applicable welcome credits, bonuses, and conditional discounts (if applicable) which apply within the first 12 months of the plan.
                        </div>
                    </div>
                    <div className={styles.footerRightSection}>
                        <ConnectOnlineButton />
                    </div>    
                </div>
            </div>)
         })
         : null}
    </>
    )
}

export default Cards