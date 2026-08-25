"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type LogoProps = {
  variant?: "navbar" | "login";
  className?: string;
};

const variants = {
  navbar: {
    wrapper: "h-10 w-[170px]",
    image: { width: 160, height: 44 },
    glow: "blur-xl opacity-30",
  },
  login: {
    wrapper: "h-16 w-[260px] sm:h-20 sm:w-[330px]",
    image: { width: 200, height: 60 },
    glow: "blur-2xl opacity-40",
  },
};

export function Logo({ variant = "navbar", className = "" }: LogoProps) {
  const styles = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative flex shrink-0 items-center ${styles.wrapper} ${className}`}
    >
      {/* GLOW ANIMADO */}
      <motion.div
        animate={{
          opacity: [0.25, 0.45, 0.25],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 via-cyan-400/20 to-violet-500/30 ${styles.glow}`}
      />

      {/* LOGO */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative h-full w-full"
      >
        <Image
          src="/engenia-logo.png"
          alt="EngenIA"
          width={styles.image.width}
          height={styles.image.height}
          className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]"
          unoptimized
          priority
        />
      </motion.div>
    </motion.div>
  );
}
