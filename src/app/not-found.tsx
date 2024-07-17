"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { Button } from '@/components/ui/button'

export default async function NotFound() {
  const router = useRouter();
  return (
    <div className=" flex justify-center items-center h-screen flex-col gap-4 ">
      <div className="absolute select-none opacity-[30%] filter transition duration-200 ">
        <h1 style={{ fontSize: "28rem" }}>404</h1>
      </div>
      <div className="flex flex-col items-center justify-center space-y-6 transition opacity-100">
        <div className="flex w-[380px] flex-col items-center justify-center space-y-3 text-center">
          <h3 className="text-xl ">Looking for something? 🔍</h3>
          <p className="text-muted-foreground">
            We couldn't find the page that you're looking for!
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            data-size="small"
            type="button"
            className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-green-800 text-sm leading-4 px-3 py-2 h-[34px]"
            onClick={() => router.back()}
          >
            <span className="truncate text-white">Head back</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
