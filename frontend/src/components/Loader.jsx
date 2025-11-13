import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-br from-primary-900 via-secondary-900 to-dark-50 backdrop-blur-sm z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="relative flex flex-col items-center gap-4">
        {/* Logo animada */}
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/50">
            <img 
              src="/logo-mentaliQ.svg" 
              alt="MentaliQ" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </motion.div>

        {/* Círculos orbitantes */}
        <motion.div
          className="absolute inset-0"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            className="absolute top-0 left-1/2 w-2 h-2 -ml-1 rounded-full bg-primary-400 shadow-lg shadow-primary-400/50"
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* Segundo círculo orbitante */}
        <motion.div
          className="absolute inset-0"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <motion.div
            className="absolute bottom-0 right-1/2 w-2 h-2 -mr-1 rounded-full bg-secondary-400 shadow-lg shadow-secondary-400/50"
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: 0.4,
            }}
          />
        </motion.div>

        {/* Texto de loading */}
        <motion.p
          className="text-white/80 text-sm font-medium tracking-wide mt-32"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          Carregando...
        </motion.p>
      </div>
    </div>
  );
};

export default Loader;
