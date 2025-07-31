"use client";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

type LoadingTextProps = {
  text?: string;
};

export default function LoadingText({ text = "Loading..." }: Readonly<LoadingTextProps>) {
  return (
    <div className="flex justify-center items-center min-h-screen text-white text-xl">
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${uuidv4()}`}
          className="mx-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}
