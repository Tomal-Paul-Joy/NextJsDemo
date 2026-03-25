import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, children }) => {
    const path = usePathname();
    console.log(path);



    return (
        <Link href={href} className={`${path.startsWith(href) && "text-primary"} font-medium`}>
            {children}
        </Link>


    );
};

export default NavLink;