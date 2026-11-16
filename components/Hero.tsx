"use client"
import Image from "next/image";

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SplitText from "gsap/SplitText"
gsap.registerPlugin(useGSAP,ScrollTrigger, SplitText)

const list = ["Character Design", "3d Modeling ","3d texturing","Animations","Blender", "Resprite", "Aseprite","2d Art","3d Art","Texturing","Rigging","Lighting","Rendering","VFX","pixel art"]
  
const Hero = () => {
  return (
    <>
     <section className="grid md:grid-cols-2 grid-cols-1 items-center-safe justify-center gap-10 md:h-[90vh] h-fit md:mb-0 mb-10 w-full ">
    <div className="w-full md:w-[65%] md:ml-30 lg:aspect-square flex justify-center">
      <img className="h-full" src="/a.jpg" alt="my"/>

    </div>
    <div className="flex flex-col w-full md:w-[65%] lg:aspect-square justify-center  text-emerald-700 md:p-5 p-8 ">
       <h1 className="name text-5xl md:text-8xl font-bold mb-10">Gyanshu Kushwaha</h1>
        
          <h2 className="subhead md:text-5xl">Artist 2D + 3D</h2> 
        
        <h2 className="font-bold subhead">Proficiencies :</h2>
        <ul className="flex flex-row w-full flex-wrap gap-2">
         { list.map((item,index)=>{
            return <li key={index} className="list whitespace-nowrap">
              {item}
            </li>
          })}
          </ul>
          <h2 className="font-bold subhead">Education: </h2>
          <ul className="flex flex-col gap-2" >

            <li className="list">present - BCA (2025-28) </li>
            <li className="list">Graduated - 12th PCM + fineArts (2025):88%</li>
            <li className="list">Graduated - 10th (2023):81%</li>
          </ul>
        <h2 className="font-bold subhead">Available: </h2><h3 className="list">12am to 12pm | India</h3>
        <h2 className="font-bold subhead">Contact :</h2>
        <ul className="flex flex-row gap-2">
        
        
          <li className="list"><a href="mailto:gyanshu300@gmail.com">Gmail</a></li>
          <li className="list"><a href="https://www.instagram.com/foureyedlunacy?srtk=MThzbjYyOHp2eHQycQ==">Instagram</a></li>
          <li className="list"><a href="https://in.linkedin.com/in/gyanshu-kushwaha-997996381" target="_blank" rel="noopener noreferrer">Linkedin</a></li>
          </ul>

    </div>

    </section>
    </>
  )
}

export default Hero
