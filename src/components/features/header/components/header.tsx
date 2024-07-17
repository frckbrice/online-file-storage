"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import * as React from 'react';

export interface IHeaderProps {
}

export function Header(props: IHeaderProps) {

    return (
        <header className=' border-b py-2 bg-gray-50'>
            <div className=' container  mx-auto  flex items-center justify-between'>
                <div className=" relative " onClick={() => {
                    window.location.href = "/";
                }}>
                    <Link href="/" className=" relative ">
                        <Image
                            src={"/images/app-logo.png"}
                            width={80}
                            height={80}
                            className=" object-contain w-28 h-24"
                            alt={"logo"}
                            priority
                        />
                    </Link>

                </div>

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
