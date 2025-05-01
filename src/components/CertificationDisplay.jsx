import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react'; // Removed AwardIcon as CheckCircle is used

const panelVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: {
      type: 'spring', stiffness: 100, damping: 15, duration: 0.5,
      when: 'beforeChildren', staggerChildren: 0.15,
    },
  },
  exit: { opacity: 0, y: 30, scale: 0.98, transition: { duration: 0.2 } },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120 } },
  exit: { opacity: 0, x: 20 },
};

export default function CertificationDisplay({ items = [], title, icon }) {
    // Ensure items is an array before mapping
    const validItems = Array.isArray(items) ? items : [];

    return (
        <motion.div
            key="certification-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-gradient-to-b from-gray-900/90 via-black/90 to-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl p-6 z-55 border border-cyan-400/30 overflow-hidden"
        >
            <div className="flex items-center gap-3 mb-4 border-b border-cyan-400/20 pb-3">
                {icon && React.cloneElement(icon, { size: 28, className: `${icon.props?.className || ''} flex-shrink-0` })}
                <h3 className="text-2xl font-bold text-white tracking-wide text-shadow">
                {title || 'Certifications'}
                </h3>
            </div>

            <motion.ul className="space-y-3">
                {/* Removed inner AnimatePresence as container stagger handles it */}
                {validItems.map((item) => (
                    <motion.li
                        key={item.id} // Ensure item.id is unique
                        variants={listItemVariants}
                        className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-cyan-400/10 transition-colors duration-200 border-l-4 border-cyan-500"
                    >
                        <CheckCircle size={24} className="text-cyan-400 flex-shrink-0" />
                        <div>
                            <p className="text-base md:text-lg font-semibold text-gray-100">{item.title || 'N/A'}</p>
                            <p className="text-xs md:text-sm text-gray-400">{item.issuer || 'N/A'}</p>
                        </div>
                    </motion.li>
                ))}
            </motion.ul>

            {validItems.length === 0 && (
                <p className="text-gray-400 text-center py-4">No certifications listed yet.</p>
            )}
        </motion.div>
  );
}