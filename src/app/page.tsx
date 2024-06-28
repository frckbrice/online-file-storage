"use client"

import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";

export default function Home() {

  //pull out the convex function in the client side 
  const createFile = useMutation(api.files.createFile);
  const getFiles = useQuery(api.files.getFiles);



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton >
          <Button>Sign-Out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" >
          <Button>Sign-In</Button>
        </SignInButton>
      </SignedOut>
      {getFiles?.map((file) => (
        <div key={file?._id}>
          <p>{file.name}</p>
        </div>
      ))}
      <Button onClick={() => createFile({
        name: "avom brice"
      })}>click-me</Button>
    </main>
  );
}
