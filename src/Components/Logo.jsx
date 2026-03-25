import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
    return (
        <div>
            <Link className="flex items-center gap-1" href={"/"}>

                <Image alt="logo-hero-kidz"
                    src={"/assets/logo.png"}
                    width={50}
                    height={40}
                >

                </Image>
                <h2 className="text-xl font-bold"> Hero Kidz </h2>



            </Link>
        </div>
    );
};

export default Logo;