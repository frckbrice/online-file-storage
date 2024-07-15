"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignedIn, SignedOut, useOrganization, useUser, OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import * as React from 'react';

export interface IHeaderProps {
}

export function Header(props: IHeaderProps) {

    const user = useUser();

    return (
        <header className=' border-b py-4 bg-gray-50'>
            <div className=' container  mx-auto  flex items-center justify-between'>
                <span>HELLO LOGO</span>

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
