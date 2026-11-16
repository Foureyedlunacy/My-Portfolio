import Eg from "@/components/Eg";
import Link from "next/link";
import Hero from "@/components/Hero";

export default function Home() {
    
 
   
  return (
   <>
  <Hero/>
  <Eg/>
 <div className="h-fit w-full p-10 flex justify-center md:items-center flex-col gap-10">
  <div className="grid grid-cols-1 md:grid-cols-2 w-fit gap-10 h-fit">
    <Link
      href="/gamedesign"
      className="border-emerald-500 w-fit rounded-4xl border-4 bg-white text-emerald-500 hover:text-white hover:bg-emerald-500 p-10 shadow-lg text-4xl font-bold"
    >
      Game Design
    </Link>

    <Link
      href="/films"
      className="border-emerald-500 w-fit rounded-4xl border-4 bg-white text-emerald-500 hover:text-white hover:bg-emerald-500 p-10 shadow-lg text-4xl font-bold"
    >
      Films
    </Link>
  </div>

  <Link
    href="/gallery"
    className="border-emerald-500 w-fit rounded-4xl border-4 bg-white text-emerald-500 hover:text-white hover:bg-emerald-500 p-10 shadow-lg text-4xl font-bold"
  >
    Gallery
  </Link>
</div>
  </>


  );
}
