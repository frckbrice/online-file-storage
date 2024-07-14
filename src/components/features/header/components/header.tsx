import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import * as React from 'react';

export interface IHeaderProps {
}

export function Header(props: IHeaderProps) {
    return (
        <header className=' border-b py-4 bg-gray-50'>
            <div className=' container  mx-auto  flex items-center justify-between'>
                HELLO LOGO
                <div className=' flex gap-2'>
                    <OrganizationSwitcher />
                    <UserButton />

                </div>
            </div>
        </header>
    );
}
