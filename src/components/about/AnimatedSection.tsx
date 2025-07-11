
'use client';

import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99] // A nice ease-out curve
    }
  },
};

export function AnimatedSection({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of the element is in view
      variants={sectionVariants}
    >
      {children}
    </motion.div>
  );
}
