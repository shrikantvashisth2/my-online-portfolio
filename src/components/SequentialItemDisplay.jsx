// src/components/SequentialItemDisplay.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = { /* ... */ };
const itemVariants = { /* ... */ };

const SequentialItemDisplay = React.memo(function SequentialItemDisplay({ items = [], visibleCount, onItemClick = () => {} }) {
    const itemsToDisplay = items.slice(0, visibleCount);

    return (
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 pointer-events-none">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-wrap justify-center gap-4 md:gap-5">
                <AnimatePresence>
                    {itemsToDisplay.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={itemVariants}
                            exit="exit"
                            layout
                            onClick={() => onItemClick(item)}
                            className="group bg-gradient-to-br from-gray-700/85 via-black/85 to-gray-800/85 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/20 w-32 h-40 md:w-36 md:h-44 flex flex-col items-center justify-start text-center transform hover:scale-[1.03] hover:shadow-lg hover:shadow-cyan-400/50 hover:border-cyan-300/80 transition-all duration-250 ease-out cursor-pointer pointer-events-auto origin-bottom"
                        >
                            {item.icon && React.cloneElement(item.icon, { size: 36, className: `${item.icon?.props?.className} mb-2 opacity-95 transition-transform duration-200 group-hover:scale-110` })}
                            <p className="text-white text-xs md:text-sm font-semibold leading-tight mb-1">{item.label}</p>
                            {item.description && ( <p className="text-gray-300 text-[10px] md:text-xs leading-tight opacity-80 mb-1.5">{item.description}</p> )}
                            {item.details && ( <p className="text-cyan-300 text-[9px] md:text-[10px] leading-tight opacity-70 mt-auto pt-1">{item.details}</p> )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
});

export default SequentialItemDisplay;