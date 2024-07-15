"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import * as React from 'react';

export interface IHeaderProps {
}

export function Header(props: IHeaderProps) {



    return (
        <header className=' border-b py-4 bg-gray-50'>
            <div className=' container  mx-auto  flex items-center justify-between'>
                <span className=" relative ">
                    <Image
                        src={"/images/opengraph-image.png"}
                        width={80}
                        height={80}
                        alt={"logo"}
                    />
                </span>

                <div className=' flex gap-2'>
                    <OrganizationSwitcher />
                    <UserButton />
                    <SignedOut>
                        <SignInButton mode="modal" >
                            <Button>Sign-In</Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </header>
    );
}
