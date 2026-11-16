"use client"
import { useGSAP } from "@gsap/react"
import gsap, { Elastic } from "gsap"
export default function Nav() {
    
    useGSAP(()=>{
       gsap.from(".stag",{
        y:-20,
        x:0,
        opacity:0,
        delay:0.5
       })
         gsap.from(".navbar",{
        y:-100,
        x:0,
        opacity:1,
        
       })
        
        
    },[])
  return (
    <div className="flex navbar text-xl  md:w-screen flex:row bg-G justify-center font-bold items-center p-5 text-gray-50">
        <h1 className="stag flex-5  items-center p-1"><a href="/"> Profile</a></h1>
        <ul id="navlinks" className="flex flex:row flex-1 gap-5">
            <li className="stag"><a href="/gamedesign">Game Design</a></li>
            <li className="stag"><a href="/gallery">Gallery</a></li>
            <li className="stag"><a href="/films">Films</a></li>
        </ul>
      
    </div>
  )
}
