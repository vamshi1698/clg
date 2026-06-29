'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export function ImmersiveIdCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  
  // Mouse tracking for 3D tilt effect
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isInView, controls]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -15;
    const rotateYValue = ((x - centerX) / centerX) * 15;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen min-h-[600px] flex justify-center items-center overflow-hidden bg-academic-950 perspective-[1000px]"
    >
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center w-full px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-lg"
        >
          Welcome to the Family
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-gold-400 text-lg md:text-xl font-medium"
        >
          Your potential student ID awaits.
        </motion.p>
      </div>

      {/* The Lanyard String */}
      <motion.div 
        className="absolute top-0 w-1 bg-gradient-to-b from-academic-800 to-academic-600 rounded-b-full shadow-xl"
        initial={{ height: 0 }}
        animate={isInView ? { height: '35%' } : { height: 0 }}
        transition={{ duration: 1.5, type: 'spring', bounce: 0.4 }}
        style={{ left: '50%', transform: 'translateX(-50%)', transformOrigin: 'top' }}
      />

      {/* The ID Card */}
      <motion.div
        variants={{
          hidden: { y: -500, opacity: 0, rotateZ: -20, rotateY: 90 },
          visible: { 
            y: 0, 
            opacity: 1, 
            rotateZ: 0,
            rotateY: 0,
            transition: { 
              type: 'spring', 
              damping: 12, 
              stiffness: 40,
              delay: 0.3,
              duration: 2.5
            }
          }
        }}
        initial="hidden"
        animate={controls}
        style={{
          marginTop: '15vh',
          transformStyle: 'preserve-3d'
        }}
        className="relative z-20 cursor-pointer"
      >
        {/* Metal Clip */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-gray-300 to-gray-500 rounded-sm z-30 shadow-md">
          <div className="w-2 h-2 bg-gray-800 rounded-full mx-auto mt-1 opacity-50"></div>
        </div>

        {/* Card Body */}
        <motion.div
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-72 h-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white flex flex-col relative"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0,0,0,0.05)'
          }}
        >
          {/* Header */}
          <div className="bg-academic-900 w-full p-4 flex flex-col items-center justify-center">
            <h3 className="text-white font-display font-bold text-lg tracking-wider">NATIONAL COLLEGE</h3>
            <div className="w-full h-1 bg-gold-500 mt-2"></div>
          </div>

          {/* Photo Placeholder */}
          <div className="w-32 h-32 rounded-lg border-4 border-slate-100 bg-slate-200 mx-auto mt-8 shadow-inner overflow-hidden relative flex items-center justify-center">
             <div className="w-16 h-16 rounded-full bg-slate-300 absolute top-4"></div>
             <div className="w-24 h-16 rounded-t-full bg-slate-300 absolute bottom-0"></div>
          </div>

          {/* Info */}
          <div className="flex-1 px-6 pt-6 flex flex-col items-center text-center">
            <h4 className="text-2xl font-bold text-slate-800 font-display">Future Student</h4>
            <p className="text-gold-600 font-medium text-sm mt-1 uppercase tracking-widest">Class of 2028</p>
            
            <div className="w-full mt-auto mb-6 flex justify-between items-end border-t border-slate-100 pt-4">
               <div className="text-left">
                 <p className="text-[10px] text-slate-400 font-bold uppercase">ID Number</p>
                 <p className="text-sm font-mono text-slate-700">NC-8042-XXXX</p>
               </div>
               {/* Barcode Mock */}
               <div className="flex gap-[2px] h-8 opacity-70">
                 {[...Array(16)].map((_, i) => (
                   <div key={i} className={`bg-slate-800 ${i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-[3px]' : 'w-[2px]'}`}></div>
                 ))}
               </div>
            </div>
          </div>

          {/* Glare effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ transform: 'translateZ(10px)' }}></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
