import React from 'react';
import Image from 'next/image';
import { myBanglaFont } from '@/app/layout';

const Banner = () => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex-1 space-y-5">

                <h2 className={`text-5xl font-bold ${myBanglaFont.className}`}>
                    আপনার শিশুকে একটি <span className="text-primary">
                        সুন্দর ভবিষ্যৎ </span> দিন
                </h2>
                <p>buy evey toy at 15% of discount </p>
                <button className="btn btn-primary btn-outline">Explore products </button>
            </div>

            <div className="flex-1">
                <Image alt="banner-image"
                    src={"/assets/hero.png"}
                    width={500}
                    height={500}
                >

                </Image>
            </div>

        </div>
    );
};

export default Banner;