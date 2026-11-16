"use client"
import Image from "next/image";

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP,ScrollTrigger)


export default function Eg(){
     
    useGSAP(()=>{
        const ismobile=window.innerWidth<768
        const tl=gsap.timeline({
            scrollTrigger:{
                trigger:".oval",
               start: ismobile ? "top 60%" : "top 80%",
                end:   ismobile ? "bottom -50%" : "bottom -60%",
                scrub:true,
                

            
            }})
            tl.from("#O1",{scale:0})
            tl.from("#O2",{scale:0})
            tl.from("#O3",{scale:0})
            tl.to("#O1",{scale:0})
            tl.to("#O2",{scale:0})
            tl.to("#O3",{scale:0})
         
    },[])
    return <>
    <div className="w-full h-18 rounded-t-[10%_100%] bg-emerald-500"></div>
    <div className="grid grid-col-1 h-fit py-5 w-full  bg-emerald-500">
        <div className="grid h-fit grid-cols-1 gap-5 md:grid-cols-2 p-5  justify-center items-center">
            <div className="h-fit w-full flex justify-center items-center">
                <div id="O1" className="bg-olive-800 oval md:w-[60%] p-10 inset-shadow-[0_6px_16px_rgba(0,0,0,1)] w-[80%] aspect-square rounded-full" >
                <img className="oval w-full h-full" src="/Walk-2.gif" alt="walk"/>
                </div>
            </div>
            
            <div className="h-fit w-full flex justify-center items-center">
                <div  id="O2" className="bg-white flex justify-center items-center oval inset-shadow-[0_0px_16px_rgba(0,0,0,1)] md:inset-shadow-[0_6px_16px_rgba(0,0,0,1)]  md:w-[80%] w-[80%] aspect-square rounded-full">
                    <img id="O2" className="oval rounded-full w-[90%] aspect-square" src="/robo.jpg" alt="walk"/>
             
                </div>
            </div>
            
        
        </div>
        <div className="h-fit w-full flex justify-center items-center">
                <video id="O3" loop className="oval bg-orange-200 oval inset-shadow-[0_-6px_16px_rgba(0,0,0,1)] md:w-[40%] w-[80%] aspect-square rounded-full" src="/duck.mp4" muted playsInline autoPlay preload="auto"/>
            </div>

    </div>
    <div className="w-full h-18 rounded-b-[10%_100%] bg-emerald-500"></div>
    
    </>
}
