"use client";

import { useState, useEffect } from "react";

function CountdownTimer({ isOffer = false }: { isOffer?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 41,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { hours, minutes, seconds } = prevTime;

        // Decrease seconds
        if (seconds > 0) {
          seconds--;
        } else {
          // When seconds reach 0, decrease minutes
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            // When minutes reach 0, decrease hours
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            } else {
              // Timer finished
              clearInterval(timer);
              return { hours: 0, minutes: 0, seconds: 0 };
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {isOffer ? (
        <div className="flex justify-center gap-1 ml-10">
          <div className="md:bg-[#0173E1] bg-[#FFD232] rounded-full md:rounded min-w-[40px] py-3 md:p-1.5 md:text-white text-center">
            <p className="text-xs font-medium leading-none md:leading-none md:mb-1 md:text-lg">
              {timeLeft.hours.toString().padStart(2, "0")}
            </p>
            <p className="text-[6px] leading-none md:leading-none md:text-[8px]">
              HOURS
            </p>
          </div>
          <div className="md:bg-[#0173E1] bg-[#FFD232] rounded-full md:rounded min-w-[40px] py-3 md:p-1.5 md:text-white text-center">
            <p className="text-xs font-medium leading-none md:leading-none md:mb-1 md:text-lg">
              {timeLeft.minutes.toString().padStart(2, "0")}
            </p>
            <p className="text-[6px] leading-none md:leading-none md:text-[8px]">
              MINUTES
            </p>
          </div>
          <div className="bg-[#FFD232] md:bg-[#0173E1] rounded-full md:rounded min-w-[40px] py-3 md:p-1.5 md:text-white text-center">
            <p className="text-xs font-medium leading-none md:leading-none md:mb-1 md:text-lg">
              {timeLeft.seconds.toString().padStart(2, "0")}
            </p>
            <p className="text-[6px] leading-none md:leading-none md:text-[8px]">
              SECONDS
            </p>
          </div>
          <div className="hidden text-xs font-medium md:flex justify-center items-center md:text-[#0173E1] rounded min-w-[40px] py-3 md:p-1.5 border md:border-[#0173E1] italic">
            <p>Left</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-1 text-base items-center justify-cente">
          <span className="px-2 py-1 rounded-sm bg-primary text-primary-foreground">
            {timeLeft.hours.toString().padStart(2, "0")}
          </span>
          <span className="px-2 py-1 rounded-sm bg-primary text-primary-foreground">
            {timeLeft.minutes.toString().padStart(2, "0")}
          </span>
          <span className="px-2 py-1 rounded-sm bg-primary text-primary-foreground">
            {timeLeft.seconds.toString().padStart(2, "0")}
          </span>
        </div>
      )}
    </>
  );
}

export default CountdownTimer;
