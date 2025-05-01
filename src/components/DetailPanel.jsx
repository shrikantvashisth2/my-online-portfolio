// src/components/DetailPanel.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react'; // Import X icon for close button

// Animation variants for the panel container
const panelVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.98,
    transition: { duration: 0.2 }
  },
};

// Animation variants for each list item
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120 } },
};

export default function DetailPanel({ title, icon, items, isVisible, onClose }) { // Added onClose prop
  // Ensure items is always an array
  const displayItems = Array.isArray(items) ? items : [];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={title || 'detail-panel'} // Use title or a default key
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          // Slightly adjusted position, more prominent gradient and border
          className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl p-6 z-60 border-2 border-white/20 overflow-hidden" // Increased z-index
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4 border-b border-gray-600/60 pb-3">
            <div className="flex items-center">
              {icon && React.cloneElement(icon, { size: 24, className: `${icon.props.className} mr-3 flex-shrink-0` })}
              <h3 className="text-xl font-bold text-white tracking-wide text-shadow">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close details"
            >
              <X size={20} />
            </button>
          </div>

          {/* List of Items */}
          {displayItems.length > 0 ? (
            <motion.ul className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar"> {/* Adjusted max-h slightly */}
              {displayItems.map((item, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  // Enhanced list item style
                  className="flex items-start p-3 bg-white/5 rounded-lg hover:bg-white/15 transition-colors duration-200 border border-transparent hover:border-white/10"
                >
                  <span className={`mr-3 mt-1 text-lg ${icon ? icon.props.className : 'text-teal-400'} flex-shrink-0`}>✧</span> {/* Changed bullet */}
                  <span className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <p className="text-gray-400 text-center py-4">Details coming soon for this item!</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}