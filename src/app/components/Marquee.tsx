"use client";

import React from "react";
import { motion } from "framer-motion";

const Marquee = () => {
  return (
    <motion.div
      className="bg-pink-500 text-yellow-50 border-4 border-black py-1 mb-4 whitespace-nowrap overflow-hidden font-pixel"
      initial={{ x: 0 }}
      animate={{ x: "-100%" }}
      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
    >
      🚀 New bet placed on <strong>Fire Island DEX</strong> | 🎉 0xB3F... won 32.5 FLOW | 🔔 Odds updated on <strong>Green Room AI</strong>
    </motion.div>
  );
};

export default Marquee; 