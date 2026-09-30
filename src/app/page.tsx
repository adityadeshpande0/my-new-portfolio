"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });

export default function Home() {
  return (
    <main className="relative grid min-h-screen flex-1 items-center overflow-hidden bg-zinc-950 text-zinc-50 md:grid-cols-2">
      <section className="z-10 px-6 py-24 md:px-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-mono text-sm tracking-widest text-violet-400 uppercase"
        >
          Portfolio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl font-semibold tracking-tight md:text-6xl"
        >
          Hi, I&apos;m Aditya.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-md text-lg text-zinc-400"
        >
          Built with Next.js, Tailwind CSS, Framer Motion and Three.js.
        </motion.p>
        <motion.a
          href="#"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 inline-block rounded-full bg-violet-600 px-6 py-3 font-medium hover:bg-violet-500"
        >
          View my work
        </motion.a>
      </section>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="h-[50vh] w-full md:h-screen"
      >
        <HeroScene />
      </motion.div>
    </main>
  );
}
