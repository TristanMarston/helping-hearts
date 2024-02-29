'use client';

import * as React from 'react';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const images = [{ src: '/helping-hearts-hero2.png' }, { src: '/helping-hearts-hero1.png' }, { src: '/helping-hearts-hero3.png' }];

export function CarouselDemo() {
    return (
        <Carousel
            className='w-full'
            orientation='horizontal'
            plugins={[
                Autoplay({
                    delay: 5000,
                }),
            ]}
        >
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index} className='flex items-center'>
                        <div className='p-1'>
                            <img
                                src={image.src}
                                alt={`carousel${index}`}
                                className='w-full h-full rounded-xl shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] ring-opacity-20'
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
