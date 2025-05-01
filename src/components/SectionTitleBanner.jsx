import React from 'react'; // Import React
import { motion, AnimatePresence } from 'framer-motion';

const bannerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.2 } }
};

// Wrap with React.memo as title/icon likely only change when section changes
const SectionTitleBanner = React.memo(function SectionTitleBanner({ title, icon, isVisible }) {
    return (
        <AnimatePresence>
            {isVisible && title && (
                <motion.div
                    key={title} // Key ensures animation restarts on title change
                    variants={bannerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    // Positioned top-center, styled with gradient, blur, rounded corners, shadow, border
                    className="absolute top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-black/60 via-gray-800/85 to-black/60 backdrop-blur-md p-3 px-6 rounded-full text-white shadow-xl z-50 border border-white/15 flex items-center gap-3"
                >
                    {/* Render icon if provided, clone to add size/style */}
                    {icon && React.cloneElement(icon, { size: 24, className: `${icon.props?.className || ''} flex-shrink-0` })} {/* Added fallback for className */}
                    <h2 className="text-xl md:text-2xl font-bold tracking-wider text-shadow">
                        {title}
                    </h2>
                </motion.div>
            )}
        </AnimatePresence>
    );
}); // End of React.memo wrapper

export default SectionTitleBanner;