// src/components/Obstacle.jsx
import React from 'react';
import { motion } from 'framer-motion';

const obstacleVariants = {
    initial: { opacity: 0, y: 10, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 180, damping: 12 } },
    // No exit animation needed as they don't get 'collected' in the same way
};

// Simple crate obstacle
const CrateObstacle = React.memo(({ obstacle, screenX, screenY }) => {
    return (
        <motion.div
            key={obstacle.id}
            variants={obstacleVariants}
            initial="initial"
            animate="animate"
            className="absolute z-42 pointer-events-none" // Between road and items
            style={{
                left: screenX,
                bottom: `calc(100vh - ${screenY}px)`, // Position bottom edge relative to ground
                width: `${obstacle.width}px`,
                height: `${obstacle.height}px`,
            }}
        >
            {/* Simple crate styling */}
            <div className="w-full h-full bg-gradient-to-b from-yellow-700 via-yellow-800 to-yellow-900 rounded-sm shadow-md border-2 border-yellow-950/50 flex items-center justify-center">
                 <div className="w-3/4 h-1 bg-yellow-950/50 mb-2"></div> {/* Top plank */}
                 <div className="w-3/4 h-1 bg-yellow-950/50"></div> {/* Bottom plank */}
            </div>
        </motion.div>
    );
});

export default CrateObstacle; // Exporting the specific type for now