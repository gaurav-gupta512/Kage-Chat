"use client"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/messages.json'
import Autoplay from "embla-carousel-autoplay"

const Home = () => {
    return (
        <main className="min-h-screen flex-grow flex flex-col items-center justify-center px-4 md:px-24 bg-gray-800 text-white">

            <section className="text-center mb-8 md:mb-12">
                <h1 className="text-2xl md:text-3xl font-bold">
                    Dive into the World of Anonymous Feedback
                </h1>
                <p className="mt-3 md:mt-4 text-base md:text-lg">
                    True Feedback - Where your identity remains a secret.
                </p>
            </section>
            <Carousel
                plugins={[Autoplay({ delay: 1500 })]}
                className="w-full max-w-xs"
            >
                <CarouselContent>
                    {
                        messages.map((message, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card className="">
                                        <CardHeader>{message.title}</CardHeader>
                                        <CardContent className="flex items-center justify-center p-5">
                                            <span className="text-2xl font-semibold">{message.content}</span>
                                        </CardContent>
                                        <CardFooter>{message.received}</CardFooter>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </main>

    )
}

export default Home

