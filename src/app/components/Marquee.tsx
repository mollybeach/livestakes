"use client";

import React from "react";
import { motion } from "framer-motion";
import { mockMarqueeMessage } from "../data/marquee";

const Marquee = () => {
  return (
    <motion.div
      className="bg-pink-500 text-yellow-50 border-4 border-black py-1 mb-4 whitespace-nowrap overflow-hidden text-xs sm:text-sm"
      initial={{ x: 0 }}
      animate={{ x: "-100%" }}
      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      dangerouslySetInnerHTML={{ __html: mockMarqueeMessage.text }}
    />
  );
};

export default Marquee; 