import React, { useState, useEffect } from 'react'
import offer1 from '/images/offer1.png'
import offer2 from '/images/offer2.png'
import offer3 from '/images/offer3.png'

const groceryImg = [
  {
    img_url: offer1,
    alt: "offer1"
  },
  {
    img_url: offer2,
    alt: "offer2"
  },
  {
    img_url: offer3,
    alt: "offer3"
  },
]

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  //sliding animation
  const handleSlide = (direction) => {
    if (direction === "left") {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? groceryImg.length - 1 : prevIndex - 1
      );
    } else if (direction === "right") {
      setCurrentIndex((prevIndex) =>
        prevIndex === groceryImg.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

   // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSlide("right");
    }, 4000);

    return () => clearInterval(interval); // cleanup
  }, [groceryImg.length]);

  return (
    <>
      <div className="px-4 py-2">
        <h1 className="text-2xl font-bold text-[#414141]">Deals of the Day 🏷️</h1>
        <div className="mt-1 w-[60%] h-[2px] bg-[#f68402] rounded-full"></div>
      </div>

      <div className='overflow-hidden md:w-[60vw] relative rounded-2xl'>
        <div
          className='h-auto flex transition-transform duration-700 ease-in-out z-0'
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {groceryImg.map((groceryImg, index) => (
            <img src={groceryImg.img_url} alt={groceryImg.alt} key={index} className='min-w-full object-fill' />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className='absolute left-0 flex justify-between items-center w-full top-[40%] max-sm:top-1/3 z-10 px-2'>
          <button
            onClick={() => handleSlide("left")}
            className='text-6xl p-3 bg-[#ffe8cf5d] opacity-80 text-black rounded-md cursor-pointer hover:bg-[#f68402] hover:opacity-100 transition-all duration-300 shadow-md max-sm:text-xl'
          >&lt;</button>
          <button
            onClick={() => handleSlide("right")}
            className='text-6xl p-3 bg-[#ffe8cf5d] opacity-80 text-black rounded-md cursor-pointer hover:bg-[#f68402] hover:opacity-100 transition-all duration-300 shadow-md max-sm:text-xl'
          >&gt;</button>
        </div>
      </div>
    </>

  )
}

export default Banner
