'use client'
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
   useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);
  return (
    <div className="dark:bg-gray-900 dark:text-white grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
    </div>
  );
}
