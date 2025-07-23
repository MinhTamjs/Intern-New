import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimationWrapper: Bọc children bằng hiệu ứng chuyển động chuyên nghiệp.
 * Props:
 * - delay: thời gian delay (s)
 * - duration: thời gian hiệu ứng (s)
 * - staggerChildren: nếu true, các phần tử con sẽ xuất hiện lần lượt
 * - style: style bổ sung
 */
const AnimationWrapper = ({
  children,
  delay = 0,
  duration = 0.8,
  staggerChildren = false,
  style = {},
}) => {
  const variants = {
    initial: { opacity: 0, y: 40, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 1.01 },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
        ...(staggerChildren ? { staggerChildren: 0.12 } : {}),
      }}
      style={{ width: '100%', ...style }}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper; 