import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: hover ? { y: -5, transition: { duration: 0.2 } } : {},
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={`
        bg-background-component border border-border text-text
        rounded-xl p-6
        shadow-lg hover:shadow-xl
        transition-shadow duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
