"use client"

import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";

export default function Home() {

  // get the current user
  const user = useUser();
  // this gives information about the current organization.
  const organization = useOrganization();
  let orgId: string | undefined = organization.organization?.id ?? user.user?.id;
  // if (organization.isLoaded && user.isLoaded) {
  //   orgId = organization.organization?.id ?? user.user?.id;
  // }


  //pull out the convex function in the client side 
  const createFile = useMutation(api.files.createFile);
  const getFiles = useQuery(api.files.getFiles, orgId ? { organizationId: orgId } : "skip");

  /** this is basically an example for text functionality */

  return (
    <main className="flex h-100vh flex-col items-center justify-between p-24">
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
      <Button onClick={() => {
        if (!orgId) return
        createFile({
          name: "team account",
          organizationId: orgId,
        })
      }}>click-me</Button>
    </main>
  );
}
