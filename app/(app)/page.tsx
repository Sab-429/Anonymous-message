'use client'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted px-6 py-16">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Anonymous Conversations
        </h2>
        <div className="mt-8">
            <a
              href="/sign-up"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              Get Started
            </a>
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-24 max-w-6xl mx-auto"
      >

        <Carousel className="max-w-md mx-auto">
          <CarouselContent>
            {['100% Anonymous', 'Secure & Private', 'Instant Messages'].map(
              (text, i) => (
                <CarouselItem key={i} className="basis-1/2">
                  <Card className="rounded-2xl shadow-md">
                    <CardContent className="aspect-square flex items-center justify-center text-lg font-medium">
                      {text}
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </motion.section>

    </main>
  )
}
