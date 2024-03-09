"use client"
import Image from 'next/image'
import styles from "./Card.module.css"
import ConnectOnlineButton from './ConnectOnlineButton'
import React, { useState, useEffect } from 'react'
import Header from '../Header/Header'

interface EleData {
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

const Cards = ({ tokenData }: {tokenData: {token: string, token_expire_time: string} }) => {
    const [electricityPLans, setElectricityPlans] = useState<EleData[]>([])
    const [providersData, setProviders] = useState<ProviderData[]>([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        if (tokenData) {
            const expireTime = new Date(tokenData?.token_expire_time)
            const millis = expireTime.getTime().toString()
            window.localStorage.setItem("token", tokenData?.token)
            window.localStorage.setItem("expireMillis", millis)
        }
    }, [tokenData])

    useEffect(() => {
        callPlanApi()
    }, [])

    const callPlanApi = async () => {
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
        if (Number(localStorage.getItem("expireMillis")) - Date.now() < 0) {
            try{
                const tokenRes = await fetch("/api/getToken", {
                    method: "POST"
                })
                const tokenJson = await tokenRes.json()                
                
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
                    let eArr = []
                    let pArr = []
                    for(const key in resp?.data?.All_plans?.electricity){
                        eArr.push({id: resp?.data?.All_plans?.electricity[key]?.id,
                            provider_id: resp?.data?.All_plans?.electricity[key]?.provider_id,
                            expected_annually_bill_amount: resp?.data?.All_plans?.electricity[key]?.expected_annually_bill_amount,
                            expected_monthly_bill_amount: resp?.data?.All_plans?.electricity[key]?.expected_monthly_bill_amount,
                            plan_name: resp?.data?.All_plans?.electricity[key]?.plan_name,
                            show_annually_desc: resp?.data?.All_plans?.electricity[key]?.show_annually_desc,
                            view_benefit: resp?.data?.All_plans?.electricity[key]?.view_benefit,
                            view_bonus: resp?.data?.All_plans?.electricity[key]?.view_bonus,
                            view_contract: resp?.data?.All_plans?.electricity[key]?.view_contract,
                            view_discount: resp?.data?.All_plans?.electricity[key]?.view_discount,
                            view_exit_fee: resp?.data?.All_plans?.electricity[key]?.view_exit_fee
                        })
                    }
                    for(const key in resp?.data?.providers){
                        pArr.push({user_id: resp?.data?.providers[key]?.user_id,
                            logo: resp?.data?.providers[key]?.logo
                        })
                    }
                    
                    setElectricityPlans(eArr)
                    
                    setProviders(pArr)
                    setLoading(false)
                        
                })
            }
            catch(err){                
                setLoading(false)                
            }

        }
        else {
            
            try{
                await fetch('/api/getPlans', {
                    method: "POST",
                    headers: {
                        "Auth-token": localStorage.getItem("token") as string,
                        "CountryId": "1",
                        "ServiceId": "1",
                    },
                    body: JSON.stringify(body)
                }).then((res) => res.json()).then((resp) => {
                        let eArr = []
                        let pArr = []
                        for(const key in resp?.data?.All_plans?.electricity){
                            eArr.push({id: resp?.data?.All_plans?.electricity[key]?.id,
                                provider_id: resp?.data?.All_plans?.electricity[key]?.provider_id,
                                expected_annually_bill_amount: resp?.data?.All_plans?.electricity[key]?.expected_annually_bill_amount,
                                expected_monthly_bill_amount: resp?.data?.All_plans?.electricity[key]?.expected_monthly_bill_amount,
                                plan_name: resp?.data?.All_plans?.electricity[key]?.plan_name,
                                show_annually_desc: resp?.data?.All_plans?.electricity[key]?.show_annually_desc,
                                view_benefit: resp?.data?.All_plans?.electricity[key]?.view_benefit,
                                view_bonus: resp?.data?.All_plans?.electricity[key]?.view_bonus,
                                view_contract: resp?.data?.All_plans?.electricity[key]?.view_contract,
                                view_discount: resp?.data?.All_plans?.electricity[key]?.view_discount,
                                view_exit_fee: resp?.data?.All_plans?.electricity[key]?.view_exit_fee
                            })
                        }
                        for(const key in resp?.data?.providers){
                            pArr.push({user_id: resp?.data?.providers[key]?.user_id,
                                logo: resp?.data?.providers[key]?.logo
                            })
                        }
                        
                        setElectricityPlans(eArr)
                        
                        setProviders(pArr)
                        setLoading(false)
                })
            }
            catch(err){
                setLoading(false)                
            }
        }
    }    

    return (
        <>
        {isLoading ? <div className={styles.shimmer}>Loading...</div> : <Header totalLength={electricityPLans.length} />}                
         {electricityPLans?.length && providersData?.length > 0 ? electricityPLans.map((item,ind)=>{
            const imageLogo: string | undefined = providersData?.find((ele)=> ele?.user_id === item?.provider_id)?.logo
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
                                {/* {viewBenefit?.length ? <li className={styles.textWrapper}><Image src='/check-solid.svg' alt='check' width={20} height={14} />{viewBenefit}</li>: null}
                                {viewBonus?.length ? <li className={styles.textWrapper}><Image src='/check-solid.svg' alt='check' width={20} height={14} />{viewBonus}</li>: null}
                                {viewContract?.length ? <li className={styles.textWrapper}><Image src='/check-solid.svg' alt='check' width={20} height={14} />{viewContract}</li>: null}
                                {viewDiscount?.length ? <li className={styles.textWrapper}><Image src='/check-solid.svg' alt='check' width={20} height={14} />{viewDiscount}</li>: null}
                                {viewExitFee?.length ? <li className={styles.textWrapper}><Image src='/check-solid.svg' alt='check' width={20} height={14} />{viewExitFee}</li>: null} */}
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
                                ${item?.expected_annually_bill_amount.toString()}^<sub style={{color:"grey"}}>/yr</sub>
                            </div>
                            <div className={styles.perMonth}>
                                ${item?.expected_monthly_bill_amount.toString()}<span style={{color:"grey", fontSize:"12px"}}>/mo</span>
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