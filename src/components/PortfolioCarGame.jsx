import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Sun, Moon, Star, Award, User, Code, Briefcase, Mail, GraduationCap,
    ClipboardList, Target, Zap, Diamond, Gift, PlayCircle, AlertTriangle,
    BadgeCheck, // Added for Certifications
    Database, // Added for Skills
    Cloud, // Added for Skills
    Construction, // Added for Skills
    BookOpen, // Added for Education detail
    Github, // Added for Contact
    Linkedin, // Added for Contact
    Phone, // Added for Contact
    Image as ImageIcon, // Added for About Me Photo Placeholder
    Download // <-- ADDED FOR RESUME
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid'; // Make sure uuid is installed: npm install uuid

// Import the supporting components (adjust paths if needed)
// Assuming these components exist in the same directory or a subdirectory
import SequentialItemDisplay from './SequentialItemDisplay'; // Assuming this exists
import SectionTitleBanner from './SectionTitleBanner'; // Assuming this exists

// Helper function to get RGB from Tailwind color names (remains the same)
function getRgbFromColor(colorName, shade) {
    // ... (keep the existing getRgbFromColor function)
    const colors = { red: [239, 68, 68], orange: [249, 115, 22], amber: [245, 158, 11], yellow: [234, 179, 8], lime: [132, 204, 22], green: [34, 197, 94], emerald: [16, 185, 129], teal: [20, 184, 166], cyan: [6, 182, 212], sky: [14, 165, 233], blue: [59, 130, 246], indigo: [99, 102, 241], violet: [139, 92, 246], purple: [168, 85, 247], fuchsia: [217, 70, 239], pink: [236, 72, 153], rose: [244, 63, 94], gray: [107, 114, 128] };
    let baseColor = colors[colorName] || [200, 200, 200]; const shadeNum = parseInt(shade); if (shadeNum && shadeNum >= 500) { baseColor = baseColor.map(c => Math.max(0, c - 30)); } else if (shadeNum && shadeNum < 500) { baseColor = baseColor.map(c => Math.min(255, c + 30)); } return baseColor;
}


export default function PortfolioCarGame() {
    // --- Constants --- (Adjusted for Dinosaur)
    const VIEWPORT_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 700;
    const GROUND_Y_POSITION = VIEWPORT_HEIGHT - 80;
    // Adjust SPRITE dimensions based on your dinosaur image
    const SPRITE_VISUAL_HEIGHT = 100; // Increased height for dinosaur
    const SPRITE_WIDTH = 150; // Increased width for dinosaur
    // Logical Y remains the same (where the 'feet' touch the ground)
    const SPRITE_LOGICAL_Y = GROUND_Y_POSITION;
    const ACCELERATION = 2000;
    const MAX_SPEED = 3000;
    const DECELERATION_FACTOR = 0.94;
    const GRAVITY = 900;
    const JUMP_VELOCITY = -520; // Slightly stronger jump maybe?
    const SCROLL_THRESHOLD = 200;
    const LEFT_BOUNDARY = 30;
    const SECTION_WIDTH = 1000; // Width of each content section
    const ITEM_REVEAL_BUFFER = 150; // Space before items start revealing
    const PROJECT_SLIDESHOW_INTERVAL = 3000; // 3 seconds per project image
    const SECTION_WARNING_THRESHOLD = 250; // Pixels before section boundary to show warning

    // --- Game State --- (remain the same)
    const [position, setPosition] = useState({ x: 50, y: SPRITE_LOGICAL_Y }); // Use SPRITE_LOGICAL_Y
    const [speed, setSpeed] = useState({ x: 0, y: 0 });
    const [backgroundPosition, setBackgroundPosition] = useState(0);
    const [isDayTime, setIsDayTime] = useState(true);
    const [currentSectionKey, setCurrentSectionKey] = useState('intro');
    const [particles, setParticles] = useState([]);
    const [showControls, setShowControls] = useState(true);
    const [isOnGround, setIsOnGround] = useState(true);
    const [coinCount, setCoinCount] = useState(0);
    const [visibleItemCount, setVisibleItemCount] = useState(0);
    const [projectImageIndex, setProjectImageIndex] = useState(0);
    const [showProjectSlideshow, setShowProjectSlideshow] = useState(false);
    const [approachingSectionKey, setApproachingSectionKey] = useState(null);
    const [showSectionWarning, setShowSectionWarning] = useState(false);

    // --- Refs --- (remain the same)
    const positionRef = useRef(position);
    const speedRef = useRef(speed);
    const backgroundPositionRef = useRef(backgroundPosition);
    const keysPressedRef = useRef({});
    const requestRef = useRef();
    const lastTimeRef = useRef(performance.now());
    const maxVisibleIndexPerSectionRef = useRef({});
    const currentSectionKeyRef = useRef(currentSectionKey);
    const projectSlideshowIntervalRef = useRef(null);

    // --- Portfolio Data (UPDATED with Resume & Contact) ---
    const sections = {
        'intro': {
            title: 'Welcome!', icon: <PlayCircle size={20} className="text-teal-300" />,
            contentTitle: "Sunny Anand", contentSubtitle: "Interactive Portfolio", contentAction: "Run → to Explore", // Changed 'Drive' to 'Run'
        },
        'about': {
            title: 'About Me', icon: <User size={20} className="text-sky-300" />,
            // ** ADD YOUR PROFILE PICTURE PATH HERE **
            profilePictureUrl: '/profile.jpeg', // <-- IMPORTANT: Replace with your image path (e.g., /profile.jpg in public folder)
            content: `Full-Stack Developer with a strong focus on AI integration, Machine Learning, and Deep Learning using PyTorch and TensorFlow. Proficient in the MERN stack and Python, I build scalable, intelligent applications across web and backend systems. I also specialize in game development using Unity/C#, blending technical expertise with creativity to craft immersive experiences. Passionate about innovation, AI ethics, and user-centric design, I aim to create impactful tech solutions that solve real-world problems.. Let's build something amazing together!`,
        },
        'skills': {
            title: 'Skills', icon: <Code size={20} className="text-green-300" />, type: 'list',
            items: [
                // Frontend
                { id: 'sk1', label: 'React / Next.js', description: 'Proficient (UI/UX, State Mgmt)', icon: <Zap size={18} className="text-sky-400"/> },
                { id: 'sk7', label: 'Tailwind CSS / CSS3', description: 'Proficient (Responsive Design)', icon: <Zap size={18} className="text-teal-400"/> },
                { id: 'sk4', label: 'JavaScript / TypeScript', description: 'Proficient (ES6+, Async)', icon: <Zap size={18} className="text-yellow-400"/> },
                { id: 'sk11', label: 'HTML5', description: 'Proficient (Semantic Markup)', icon: <Code size={18} className="text-orange-400"/> },
                // Backend
                { id: 'sk2', label: 'Node.js / Express.js', description: 'Proficient (APIs, Middleware)', icon: <Zap size={18} className="text-green-400"/> },
                { id: 'sk3', label: 'MongoDB / Mongoose', description: 'Proficient (NoSQL DB Design)', icon: <Database size={18} className="text-lime-400"/> },
                { id: 'sk12', label: 'REST APIs / GraphQL', description: 'Experienced (API Design)', icon: <Zap size={18} className="text-violet-400"/> },
                // AI/ML
                { id: 'sk5', label: 'Python', description: 'Proficient (Scripting, Data)', icon: <Zap size={18} className="text-blue-400"/> },
                { id: 'sk6', label: 'Generative AI', description: 'Experienced (LLMs, LangChain)', icon: <Zap size={18} className="text-purple-400"/> },
                { id: 'sk13', label: 'PyTorch', description: 'Familiar (Deep Learning Models)', icon: <Zap size={18} className="text-red-400"/> },
                // Game Dev
                { id: 'sk9', label: 'Unity / C#', description: 'Experienced (Mobile Games)', icon: <Zap size={18} className="text-gray-400"/> },
                 // DevOps / Cloud / Tools
                { id: 'sk8', label: 'AWS Basics', description: 'Familiar (EC2, S3, Lambda)', icon: <Cloud size={18} className="text-orange-500"/> },
                { id: 'sk10', label: 'Git / GitHub', description: 'Proficient (Version Control)', icon: <Gift size={18} className="text-red-500"/> }, // Changed icon slightly
                { id: 'sk14', label: 'Docker Basics', description: 'Familiar (Containerization)', icon: <Construction size={18} className="text-cyan-400"/> }, // New Tool
                { id: 'sk15', label: 'Figma', description: 'Familiar (UI Design/Prototyping)', icon: <Zap size={18} className="text-pink-400"/> }, // New Design Tool
            ]
        },
        
        'projects': {
            title: 'Projects', icon: <Briefcase size={20} className="text-amber-300" />, type: 'list',
            // NOTE: Image URLs assume images are DIRECTLY in your /public/ folder
            items: [
                { id: 'p1', label: 'SanskritAI', description: 'AI Tutor for Sanskrit (5k+ Users, Next.js, OpenAI)', icon: <Target size={18} className="text-amber-400"/>, imageUrl: '/sanskritai.jpeg' },
                { id: 'p2', label: 'DivineWall', description: 'AI Wallpaper Generator (8k+ Users, React Native, GenAI)', icon: <Target size={18} className="text-orange-400"/>, imageUrl: '/divinewall.jpeg' },
                { id: 'p3', label: 'MyResearchPaper', description: 'AI Research Paper Generator (MERN, AI Integration)', icon: <Target size={18} className="text-yellow-400"/>, imageUrl: '/myresearchpaper.jpeg' },
                { id: 'p4', label: 'Zombie Alien Game', description: 'Mobile Hypercasual Game (25k+ Players, Unity, C#)', icon: <Target size={18} className="text-lime-400"/>, imageUrl: '/zombiegame.jpg' },
                { id: 'p5', label: 'Auto Express Game', description: 'Mobile Game (Unity, C#)', icon: <Target size={18} className="text-green-400"/>, imageUrl: '/autoexpress.jpg' }
            ]
         },
       
        'certifications': {
            title: 'Certifications', icon: <BadgeCheck size={20} className="text-cyan-300" />, type: 'list',
            items: [
                { id: 'ce1', label: 'Full-Stack Web Dev', description: 'Udemy (MERN Focus, 2023)', icon: <BadgeCheck size={18} className="text-cyan-400"/> },
                { id: 'ce2', label: 'Python', description: 'Udemy (Specialization, 2022)', icon: <BadgeCheck size={18} className="text-sky-400"/> },
                { id: 'ce3', label: 'Data Structure and Algorithm', description: 'Udemy (Abdul Bari)', icon: <BadgeCheck size={18} className="text-blue-400"/> },
            ]
        },
        'education': {
            title: 'Education', icon: <GraduationCap size={20} className="text-rose-300" />, type: 'list',
            items: [
                { id: 'ed1', label: 'B.Tech CSE', description: 'Lovely Professional University (2022-2026). Focus on AI & Software Engg.', icon: <BookOpen size={18} className="text-rose-400"/> },
                { id: 'ed2', label: 'Intermediate', description: 'SKP Vidya Vihar ', icon: <BookOpen size={18} className="text-rose-400"/> },
                { id: 'ed2', label: 'Matriculation', description: 'Holy Family School', icon: <BookOpen size={18} className="text-rose-400"/> }


            ]
        },
        // ----- NEW RESUME SECTION -----
        'resume': {
            title: 'Download Resume',
            icon: <Download size={20} className="text-green-300" />,
            type: 'resumeDownload', // Custom type for specific rendering
            // --- IMPORTANT ---
            // 1. Place your resume file (e.g., "Aadarsh-Raj-Resume.pdf") in the `public` folder.
            // 2. Update the path below if your filename is different.
            resumeUrl: '/Resume.pdf', // Path relative to the public folder
            linkText: 'Download Resume',
        },
        // ----- END NEW RESUME SECTION -----
        'contact': {
            title: 'Get In Touch',
            icon: <Mail size={20} className="text-purple-300" />,
            type: 'contact', // Added a type for easier rendering logic
            // ** ADD YOUR ACTUAL DETAILS HERE **
            details: [
                { id: 'email', label: 'asunny583@gmail.com', href: 'mailto:asunny583@gmail.com', icon: <Mail size={18} className="text-purple-400"/> },
                { id: 'linkedin', label: 'Sunny Anand', href: 'https://www.linkedin.com/in/sunny-anand-/', icon: <Linkedin size={18} className="text-blue-400"/> },
                { id: 'github', label: 'ANANDSUNNY0899', href: 'https://github.com/ANANDSUNNY0899', icon: <Github size={18} className="text-gray-400"/> },
                { id: 'phone', label: '+91-6207297112', icon: <Phone size={18} className="text-green-400"/> }, // Replace X's with your number
            ]
        },
    };

    const sectionKeys = Object.keys(sections);
    const numSections = sectionKeys.length;
    const sectionsToWarnAbout = ['skills', 'projects', , 'certifications', 'education', 'resume', 'contact']; // Added 'resume'

    // --- Sync State to Refs --- (remain the same)
    useEffect(() => { positionRef.current = position; }, [position]);
    useEffect(() => { speedRef.current = speed; }, [speed]);
    useEffect(() => { backgroundPositionRef.current = backgroundPosition; }, [backgroundPosition]);
    useEffect(() => { currentSectionKeyRef.current = currentSectionKey; }, [currentSectionKey]);

    // --- Keyboard Input Handling --- (remain the same)
    useEffect(() => {
        // ... (keep existing key handling)
        const handleKeyDown = (e) => { if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); } const key = e.key.toLowerCase(); keysPressedRef.current[key] = true; if (key === 'c') { setShowControls(prev => !prev); } };
        const handleKeyUp = (e) => { const key = e.key.toLowerCase(); keysPressedRef.current[key] = false; };
        window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
        return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); keysPressedRef.current = {}; };
    }, []);

    // --- Particle System Logic --- (remain the same)
    const createParticles = useCallback((count, type, options = {}) => {
        // ... (keep existing particle creation logic)
         const newParticles = []; const currentPos = options.pos || positionRef.current; const baseColor = options.color || [180, 180, 180]; const lifeMultiplier = options.life || 1; const speedMultiplier = options.speed || 1; const sizeMultiplier = options.size || 1;
        for (let i = 0; i < count; i++) {
             if (type === 'exhaust') { newParticles.push({ id: uuidv4(), x: currentPos.x - 5, y: currentPos.y - 5, size: (Math.random() * 4 + 2) * sizeMultiplier, color: `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${Math.random() * 0.4 + 0.1})`, vx: (-Math.random() * 30 - speedRef.current.x * 0.5 - 20) * speedMultiplier, vy: (Math.random() * 10 - 5) * speedMultiplier, life: (Math.random() * 0.5 + 0.2) * lifeMultiplier, type: 'exhaust' }); }
             else if (type === 'itemAppear') { newParticles.push({ id: uuidv4(), x: currentPos.x, y: currentPos.y, size: (Math.random() * 8 + 5) * sizeMultiplier, color: `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${Math.random() * 0.5 + 0.3})`, vx: (Math.random() - 0.5) * 60 * speedMultiplier, vy: (Math.random() - 0.5) * 60 * speedMultiplier, life: (Math.random() * 0.6 + 0.4) * lifeMultiplier, type: 'appear' }); }
             else if (type === 'coin') { newParticles.push({ id: uuidv4(), x: currentPos.x, y: currentPos.y, size: (Math.random() * 3 + 2) * sizeMultiplier, color: `rgba(255, 223, 0, ${Math.random() * 0.6 + 0.4})`, vx: speedRef.current.x * 0.1 + (Math.random() - 0.5) * 20, vy: -Math.random() * 20 - 5, life: (Math.random() * 0.8 + 0.5) * lifeMultiplier, type: 'coinTrail' }); }
             else if (type === 'night') { newParticles.push({ id: uuidv4(), x: Math.random() * window.innerWidth, y: Math.random() * 250, size: Math.random() * 2 + 0.5, color: 'rgba(255, 255, 255, 0)', targetColor: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`, vx: 0, vy: 0, life: Math.random() * 4 + 2, type: 'star', fadeSpeed: 0.5 }); }
             else if (type === 'day') { newParticles.push({ id: uuidv4(), x: Math.random() * window.innerWidth, y: Math.random() * 150 + 30, size: Math.random() * 20 + 10, color: 'rgba(255, 230, 150, 0)', targetColor: `rgba(255, 230, 150, ${Math.random() * 0.05 + 0.02})`, vx: -Math.random() * 5 - 1, vy: 0, life: Math.random() * 3 + 2, type: 'sunray', fadeSpeed: 0.3 }); }
        }
        setParticles(prev => [...prev.slice(-200), ...newParticles]);
    }, []);

    const updateParticles = useCallback((deltaTime) => {
        // ... (keep existing particle update logic)
        setParticles(prev => prev.map(p => { let nextP = { ...p }; if ((p.type === 'star' || p.type === 'sunray') && p.targetColor) { const cM = p.color.match(/[\d.]+/g); const tM = p.targetColor.match(/[\d.]+/g); if (cM?.length === 4 && tM?.length === 4) { const cA = parseFloat(cM[3]); const tA = parseFloat(tM[3]); const nA = cA + (tA - cA) * (p.fadeSpeed || 0.5) * deltaTime; nextP.color = `rgba(${cM[0]}, ${cM[1]}, ${cM[2]}, ${nA})`; } } const fOT = 0.5; let oM = 1; if (p.life < fOT) { oM = Math.max(0, p.life / fOT); } nextP.vy += (p.type === 'coinTrail' ? GRAVITY * 0.3 * deltaTime : 0);
                 return { ...nextP, x: p.x + p.vx * deltaTime, y: p.y + p.vy * deltaTime, size: Math.max(0, p.size * (1 - 1.5 * deltaTime)), life: p.life - deltaTime, currentOpacity: Math.max(0, (p.life < 0.5 ? p.life / 0.5 : 1)) }; }).filter(p => p.life > 0 && p.size > 0.1) );
    }, []);

     // --- Day/Night Cycle --- (remain the same)
    useEffect(() => {
        // ... (keep existing day/night logic)
        const interval = setInterval(() => { setIsDayTime(prev => !prev); createParticles(15, !isDayTime ? 'night' : 'day'); }, 5000); return () => clearInterval(interval);
    }, [isDayTime, createParticles]);

    // --- Main Game Loop --- (Adjusted ground collision check)
    const gameLoop = useCallback((timestamp) => {
        const now = timestamp || performance.now(); const deltaTime = (now - lastTimeRef.current) / 1000; lastTimeRef.current = now; const dt = Math.min(deltaTime, 0.05);
        let currentSpeed = { ...speedRef.current }; let currentPosition = { ...positionRef.current }; let currentBackgroundPos = backgroundPositionRef.current; const keys = keysPressedRef.current;

        // --- Movement Physics --- (remain the same)
        const isMovingRight = keys['arrowright'] || keys['d']; const isMovingLeft = keys['arrowleft'] || keys['a'];
        if (isMovingRight) { currentSpeed.x = Math.min(currentSpeed.x + ACCELERATION, MAX_SPEED); } else if (isMovingLeft) { currentSpeed.x = Math.max(currentSpeed.x - ACCELERATION, -MAX_SPEED); } else { currentSpeed.x *= DECELERATION_FACTOR; if (Math.abs(currentSpeed.x) < 1) currentSpeed.x = 0; }
        const currentlyOnGround = currentPosition.y >= SPRITE_LOGICAL_Y; // Use SPRITE_LOGICAL_Y
        setIsOnGround(currentlyOnGround); const isTryingToJump = keys['arrowup'] || keys[' '];
        if (!currentlyOnGround || currentSpeed.y < 0) { currentSpeed.y += GRAVITY * dt; } if (isTryingToJump && currentlyOnGround) { currentSpeed.y = JUMP_VELOCITY; }

        // --- Calculate Next Position --- (remain the same)
        let nextX = currentPosition.x + currentSpeed.x * dt; let nextY = currentPosition.y + currentSpeed.y * dt;

        // --- Ground Collision --- (Adjusted for SPRITE_LOGICAL_Y)
        if (nextY > SPRITE_LOGICAL_Y) {
             nextY = SPRITE_LOGICAL_Y;
             currentSpeed.y = 0;
        }

         // --- Simple Coin Generation --- (remain the same)
        if (Math.abs(currentSpeed.x) > 10 && Math.random() < 0.01) { setCoinCount(prev => prev + 1); createParticles(2, 'coin', { pos: { x: positionRef.current.x + SPRITE_WIDTH / 2, y: positionRef.current.y - 10 } }); } // Adjust coin origin slightly

        // --- Screen Boundaries & Background Scrolling --- (remain the same)
        if (nextX < LEFT_BOUNDARY) { nextX = LEFT_BOUNDARY; currentSpeed.x = 0; }
        else if (nextX > SCROLL_THRESHOLD && currentSpeed.x > 0) { const scrollAmount = currentSpeed.x * dt; currentBackgroundPos -= scrollAmount; nextX = SCROLL_THRESHOLD; }
        else if (nextX < SCROLL_THRESHOLD && currentSpeed.x < 0 && currentBackgroundPos < 0) { const scrollAmount = currentSpeed.x * dt; currentBackgroundPos = Math.min(0, currentBackgroundPos - scrollAmount); }

        // --- Final State Updates --- (remain the same)
        setPosition({ x: nextX, y: nextY });
        setSpeed(currentSpeed);
        setBackgroundPosition(currentBackgroundPos);

        // --- Section Detection & Logic --- (remain the same logic flow)
        const totalTrackWidth = SECTION_WIDTH * numSections;
        const absoluteScroll = Math.abs(currentBackgroundPos);
        const currentSectionIndex = Math.floor(absoluteScroll / SECTION_WIDTH);
        const newSectionKey = sectionKeys[currentSectionIndex % numSections];
        const progressInSection = absoluteScroll % SECTION_WIDTH;

        // --- Section Warning Logic --- (remain the same logic)
        let nextApproachingKey = null;
        let nextShowWarning = false;
        const nextSectionIndex = currentSectionIndex + 1;
        if (progressInSection > (SECTION_WIDTH - SECTION_WARNING_THRESHOLD) && nextSectionIndex < sectionKeys.length) {
            const potentialNextKey = sectionKeys[nextSectionIndex % numSections];
            // Updated to use the `sectionsToWarnAbout` array
            if (sectionsToWarnAbout.includes(potentialNextKey)) {
                 nextApproachingKey = potentialNextKey;
                 nextShowWarning = true;
            }
        }
        if (nextShowWarning !== showSectionWarning || nextApproachingKey !== approachingSectionKey) {
            setApproachingSectionKey(nextApproachingKey);
            setShowSectionWarning(nextShowWarning);
        }

        // --- Sequential Item Logic --- (remain the same logic flow)
        let newVisibleCount = 0;
        const sectionData = sections[newSectionKey];
        if (sectionData?.type === 'list' && sectionData.items) {
            const itemProgress = progressInSection - ITEM_REVEAL_BUFFER;
            const itemsInSection = sectionData.items.length;
            if (itemsInSection > 0 && itemProgress > 0) {
                const zoneWidth = (SECTION_WIDTH - ITEM_REVEAL_BUFFER * 1.5) / itemsInSection;
                const calculatedIndex = Math.floor(itemProgress / zoneWidth) + 1;
                newVisibleCount = Math.min(itemsInSection, Math.max(0, calculatedIndex));
                const maxReached = maxVisibleIndexPerSectionRef.current[newSectionKey] || 0;
                newVisibleCount = Math.max(maxReached, newVisibleCount);
                maxVisibleIndexPerSectionRef.current[newSectionKey] = newVisibleCount;
                if (newVisibleCount > maxReached && newVisibleCount > 0) {
                     const newItem = sectionData.items[newVisibleCount - 1]; const iconColor = newItem.icon?.props?.className?.match(/text-([a-z]+)-(\d+)/); const colorRgb = iconColor ? getRgbFromColor(iconColor[1], iconColor[2]) : [200, 200, 200];
                     const itemAppearX = positionRef.current.x + 250 + Math.random()*100; const itemAppearY = VIEWPORT_HEIGHT * 0.7;
                     createParticles(10, 'itemAppear', { pos: { x: itemAppearX, y: itemAppearY }, color: colorRgb });
                }
            }
        } else {
            if (maxVisibleIndexPerSectionRef.current[currentSectionKeyRef.current] !== undefined) {
                maxVisibleIndexPerSectionRef.current[currentSectionKeyRef.current] = 0;
            }
             newVisibleCount = 0;
        }
        setVisibleItemCount(newVisibleCount);

        // Update current section key state *after* calculations
        if (newSectionKey !== currentSectionKeyRef.current) {
             setCurrentSectionKey(newSectionKey);
             currentSectionKeyRef.current = newSectionKey;
             if (!sections[newSectionKey]?.items) { maxVisibleIndexPerSectionRef.current[newSectionKey] = 0; }
        }

        // --- Update Particles --- (remain the same)
        updateParticles(dt); if (Math.random() < 0.1 && Math.abs(currentSpeed.x) > 50) { createParticles(1, 'exhaust'); }

        requestRef.current = requestAnimationFrame(gameLoop);

    }, [
        updateParticles, createParticles, numSections, sectionsToWarnAbout, // Constants/Callbacks
        showSectionWarning, approachingSectionKey // State used in calculation
        // Use SPRITE_LOGICAL_Y and other constants implicitly
    ]);

    // --- Effect to Start/Stop the Game Loop --- (remain the same)
    useEffect(() => {
        // ... (keep existing loop start/stop)
        lastTimeRef.current = performance.now(); requestRef.current = requestAnimationFrame(gameLoop); return () => { if (requestRef.current) { cancelAnimationFrame(requestRef.current); } };
    }, [gameLoop]);

    // --- Effect for Project Slideshow --- (remain the same)
    useEffect(() => {
        // ... (keep existing slideshow logic)
        const isProjectsSection = currentSectionKey === 'projects';
        const projectItems = sections.projects?.items; // Added safe navigation
        setShowProjectSlideshow(isProjectsSection);
        if (isProjectsSection && projectItems?.length > 0) {
            setProjectImageIndex(0);
            if (projectSlideshowIntervalRef.current) { clearInterval(projectSlideshowIntervalRef.current); }
            projectSlideshowIntervalRef.current = setInterval(() => {
                setProjectImageIndex(prevIndex => (prevIndex + 1) % projectItems.length);
            }, PROJECT_SLIDESHOW_INTERVAL);
        } else {
            if (projectSlideshowIntervalRef.current) {
                clearInterval(projectSlideshowIntervalRef.current);
                projectSlideshowIntervalRef.current = null;
            }
        }
        return () => { if (projectSlideshowIntervalRef.current) { clearInterval(projectSlideshowIntervalRef.current); } };
    }, [currentSectionKey]); // Removed sections.projects.items from deps as it's constant

    // --- Styles & Render Prep --- (remain the same)
    const getSkyColor = () => { return isDayTime ? 'bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100' : 'bg-gradient-to-b from-slate-900 via-indigo-900 to-purple-900'; };
    const getGroundColor = () => { return isDayTime ? 'bg-gradient-to-b from-lime-600 to-green-800' : 'bg-gradient-to-b from-emerald-900 to-green-950'; };
    const showIdleAnimation = isOnGround && Math.abs(speed.x) < 5; // Keep for potential future use, but removed from dinosaur for now
    const currentSectionData = sections[currentSectionKey];

    // --- Animation Variants --- (remain the same)
    const aboutOverlayVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } }, exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" } } }; // Added stagger
    const aboutImageVariants = { hidden: { opacity: 0, y: -20, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 10 } } }; // Image specific animation
    const aboutTextVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }, exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } } }; // Delay removed, handled by staggerChildren
    const welcomeOverlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.2, delayChildren: 0.1 } }, exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } } };
    const welcomeTextVariants = { hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }, exit: { opacity: 0, y: -15, scale: 0.98 } };
    const welcomeActionVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { delay: 0.5, type: "spring", stiffness: 80 } }, exit: { opacity: 0 } };
    const projectImageVariants = { hidden: { opacity: 0, scale: 1.05, transition: { duration: 0.5, ease: 'easeOut' } }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeIn' } }, exit: { opacity: 0, scale: 0.98, transition: { duration: 0.5, ease: 'easeOut' } } };
    const warningVariants = { hidden: { opacity: 0, scale: 0.5, y: 50, rotate: -5 }, visible: { opacity: 1, scale: 1, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 150, damping: 15, duration: 0.4 } }, exit: { opacity: 0, scale: 0.8, y: -30, transition: { duration: 0.2, ease: 'easeIn' } } };
    const contactItemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }; // For contact items
    const sectionBoxVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } } }; // Simple fade-in for contact/resume boxes

    // --- Render ---
    return (
        <div className="w-full h-screen overflow-hidden relative bg-black focus:outline-none select-none" tabIndex={0}>

            {/* --- Background Layers (Z: 0-30) --- (No changes here) */}
             <div className={`absolute inset-0 transition-colors duration-[7000ms] ease-in-out z-0 ${getSkyColor()}`}> {/* Sky */}
                {/* Sun/Moon */}
                <div className={`absolute w-16 h-16 rounded-full transition-all duration-[7000ms] ease-in-out ${isDayTime ? 'bg-yellow-300 shadow-xl shadow-yellow-400/60' : 'bg-slate-300 shadow-xl shadow-slate-200/40'}`} style={{ left: '80%', top: isDayTime ? '15%' : '10%', transform: isDayTime ? 'translateY(0)' : 'translateY(10px)' }}/>
                {/* Stars */}
                {!isDayTime && <div className="absolute inset-0 pointer-events-none">{Array(40).fill(0).map((_, i) => ( <div key={`star-${i}`} className="absolute w-px h-px bg-white rounded-full animate-twinkle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 50}%`, '--twinkle-duration': `${Math.random() * 6 + 4}s`, '--star-min-opacity': `${Math.random() * 0.2 + 0.1}`, '--star-max-opacity': `${Math.random() * 0.5 + 0.4}` }} /> ))}</div>}
             </div>
             {/* Clouds */}
             <div className="absolute inset-x-0 top-[10%] h-20 pointer-events-none z-10 opacity-30" style={{ transform: `translateX(${backgroundPosition * 0.1}px)` }}>
                 <div className="absolute left-[10%] w-48 h-16 bg-white/70 rounded-full blur-md"></div> <div className="absolute left-[50%] top-4 w-64 h-20 bg-white/60 rounded-full blur-lg"></div> <div className="absolute left-[80%] w-40 h-12 bg-white/70 rounded-full blur-md"></div> <div className="absolute left-[120%] top-2 w-56 h-16 bg-white/60 rounded-full blur-lg"></div> <div className="absolute left-[150%] w-44 h-14 bg-white/70 rounded-full blur-md"></div>
             </div>
              {/* Particles */}
             <div className="absolute inset-0 z-15 pointer-events-none"> {particles.map((p) => (<div key={`particle-${p.id ?? Math.random()}`} className="absolute rounded-full" style={{ left: p.x, top: p.y, width: Math.max(0, p.size), height: Math.max(0, p.size), backgroundColor: p.color, opacity: p.currentOpacity }} />))} </div>
             {/* Project Slideshow Background */}
             <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden">
                <AnimatePresence initial={false}>
                    {showProjectSlideshow && sections.projects.items[projectImageIndex]?.imageUrl && (
                        <motion.div key={sections.projects.items[projectImageIndex].imageUrl} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${sections.projects.items[projectImageIndex].imageUrl})`}} variants={projectImageVariants} initial="hidden" animate="visible" exit="exit">
                           <div className="absolute inset-0 bg-black/40"></div> {/* Overlay */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
             {/* Hills */}
            <div className="absolute left-0 bottom-0 w-[6000px] h-1/3 pointer-events-none z-20" style={{ transform: `translateX(${backgroundPosition * 0.5}px)` }}>
                 <div className="absolute bottom-0 left-[150px] w-[450px] h-28 bg-green-700/80 rounded-t-[100%/60px]" /> <div className="absolute bottom-0 left-[700px] w-[600px] h-40 bg-green-800/80 rounded-t-[100%/70px]" /> <div className="absolute bottom-0 left-[1400px] w-[500px] h-32 bg-green-600/70 rounded-t-[100%/50px]" /> <div className="absolute bottom-0 left-[2000px] w-[400px] h-24 bg-green-700/80 rounded-t-[100%/55px]" /> <div className="absolute bottom-0 left-[2500px] w-[700px] h-44 bg-green-800/80 rounded-t-[100%/75px]" /> <div className="absolute bottom-0 left-[3300px] w-[550px] h-36 bg-green-600/70 rounded-t-[100%/50px]" />
             </div>
             {/* Ground */}
             <div className={`absolute bottom-0 w-full h-20 ${getGroundColor()} z-30 border-t-4 border-black/20`} />

            {/* --- Foreground Elements (Z: 35-50) --- (Dinosaur replaces Car) */}
             {/* Ramps/Scenery */}
             <div className="absolute left-0 bottom-0 w-[10000px] z-35 pointer-events-none" style={{ transform: `translateX(${backgroundPosition}px)` }}>
                 {/* Add ramps or scenery here if needed */}
             </div>
             {/* Road */}
             <div className="absolute bottom-0 w-full h-12 bg-gray-800 z-40 border-t-2 border-gray-900 shadow-inner"> {Array(20).fill(0).map((_, i) => { const lineSpacing = 150; const trackLength = 20 * lineSpacing; const linePos = (((i * lineSpacing) + backgroundPosition) % trackLength + trackLength) % trackLength; return (<div key={`roadline-${i}`} className="absolute h-1.5 w-12 bg-yellow-500 rounded-sm" style={{ left: `${linePos}px`, bottom: '8px' }} />); })} </div>

             {/* --- Player Sprite (Dinosaur) --- (Z: 50) */}
            <div
                className="absolute z-50 transition-transform duration-75 ease-out"
                style={{
                    left: position.x,
                    // Calculate top position so the *bottom* of the sprite is at SPRITE_LOGICAL_Y
                    top: position.y - SPRITE_VISUAL_HEIGHT,
                    width: `${SPRITE_WIDTH}px`,
                    height: `${SPRITE_VISUAL_HEIGHT}px`,
                    // Keep the tilt effect based on vertical speed
                    transform: `rotate(${Math.max(-15, Math.min(15, speed.y / 25))}deg)`,
                    // Optional: Flip sprite based on horizontal direction
                    transformScaleX: speed.x < -1 ? -1 : 1, // Flips horizontally when moving left
                }}
            >
                {/*
                    ** IMPORTANT **
                    Replace ' /running.gif ' with the actual path to your dinosaur image.
                    Make sure the image is in your 'public' folder or served correctly.
                    Use an animated GIF for running animation.
                */}
                <img
                    src="/running.gif" // <-- REPLACE THIS PATH if needed
                    alt="Player Dinosaur"
                    className="w-full h-full object-contain pointer-events-none" // `object-contain` prevents stretching
                    style={{ transform: speed.x < -1 ? 'scaleX(-1)' : 'scaleX(1)' }} // Alternative flip method if needed
                />
            </div>


            {/* --- Special Overlays (Z: 55) --- (About Me overlay updated) */}
            <AnimatePresence>
                {currentSectionKey === 'intro' && (
                    <motion.div key="welcome-overlay" variants={welcomeOverlayVariants} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 z-55 flex flex-col items-center justify-center text-center pointer-events-none p-4">
                         <div className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent blur-3xl opacity-50"></div>
                        <motion.h1 variants={welcomeTextVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-2 sm:mb-3 text-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-cyan-300 to-sky-400">{currentSectionData?.contentTitle || "Welcome!"}</motion.h1>
                        <motion.h2 variants={welcomeTextVariants} className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-200 mb-4 sm:mb-6 text-shadow">{currentSectionData?.contentSubtitle || "Interactive Portfolio"}</motion.h2>
                        {/* Changed action text */}
                        <motion.p variants={welcomeActionVariants} className="text-lg sm:text-xl text-yellow-400 font-medium animate-pulse">{currentSectionData?.contentAction || "Run → to Explore"}</motion.p>
                    </motion.div>
                )}
                {currentSectionKey === 'about' && currentSectionData && ( // Check currentSectionData exists
                    <motion.div key="about-me-overlay" variants={aboutOverlayVariants} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 z-55 flex items-center justify-center pointer-events-none">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div> {/* Slightly darker backdrop */}
                        {/* Container for About Content */}
                        <motion.div className="relative max-w-3xl w-full mx-auto p-6 md:p-8 text-center flex flex-col items-center">
                             {/* Profile Picture */}
                             <motion.div variants={aboutImageVariants} className="mb-5 md:mb-6">
                                {currentSectionData.profilePictureUrl ? (
                                    <img
                                        src={currentSectionData.profilePictureUrl} // Use the URL from section data
                                        alt="Aadarsh Raj"
                                        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-sky-300 shadow-xl"
                                    />
                                ) : (
                                    // Placeholder if image is missing
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-700 border-4 border-sky-300 shadow-xl flex items-center justify-center">
                                        <ImageIcon size={48} className="text-gray-400" />
                                    </div>
                                )}
                            </motion.div>

                             {/* Title */}
                             <motion.h3 variants={aboutTextVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-shadow-md">{currentSectionData.title || "About Me"}</motion.h3>
                             {/* Content Text */}
                             <motion.p variants={aboutTextVariants} className="text-md md:text-lg lg:text-xl text-gray-200 leading-relaxed text-shadow-sm whitespace-pre-wrap">{currentSectionData.content}</motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

             {/* --- Section Approaching Warning (Z: 58) --- (No changes here) */}
            <div className="absolute inset-0 z-58 pointer-events-none flex items-center justify-center">
                 <AnimatePresence>
                    {showSectionWarning && approachingSectionKey && sections[approachingSectionKey] && (
                        <motion.div
                            key={`warning-${approachingSectionKey}`}
                            variants={warningVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-black/75 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-2xl border-2 border-yellow-500/80 text-center"
                        >
                            <div className="flex items-center justify-center gap-3 md:gap-4 mb-2">
                                <AlertTriangle size={32} className="text-yellow-400 animate-pulse flex-shrink-0" />
                                <h3 className="text-2xl md:text-4xl font-bold text-white text-shadow-md whitespace-nowrap">
                                    Approaching:
                                </h3>
                            </div>
                            <p className="text-xl md:text-3xl font-semibold text-gray-200 text-shadow">
                                {sections[approachingSectionKey]?.title || 'Next Area'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- UI Layer (z-60) --- (Section Title, Items, Contact, Resume) */}
             {/* Section Title Banner (Conditionally Rendered) */}
             {currentSectionKey !== 'intro' &&
              currentSectionKey !== 'about' &&
              currentSectionKey !== 'projects' &&
              currentSectionData?.type !== 'contact' &&
              currentSectionData?.type !== 'resumeDownload' && // <-- Exclude resume download section
              (
                 <SectionTitleBanner key={currentSectionKey} title={currentSectionData?.title} icon={currentSectionData?.icon} isVisible={!!currentSectionData} />
             )}

            {/* Sequential Item Display (For 'list' type sections) */}
            {currentSectionData?.type === 'list' && (
                 <SequentialItemDisplay key={currentSectionKey + "-items"} items={currentSectionData.items} visibleCount={visibleItemCount} onItemClick={() => {}} />
             )}

             {/* Top Right UI (Coins, Controls) */}
            <div className="absolute top-5 right-5 flex flex-col items-end gap-2 z-60">
                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm p-2 px-4 rounded-lg text-white shadow-xl border border-white/10"> <Diamond size={18} className="text-yellow-400 filter drop-shadow animate-pulse" /> <span className="text-lg font-bold text-shadow-sm">{coinCount}</span> </div>
                <AnimatePresence> {showControls && ( <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="bg-black/70 backdrop-blur-sm p-3 rounded-lg text-white text-xs shadow-xl border border-white/10 leading-relaxed w-max"> <h3 className="font-bold mb-1 uppercase text-shadow-sm text-center">Controls</h3> <p>← → / A D: Move</p> <p>↑ / Space: Jump</p> <p>C: Toggle</p> </motion.div> )} </AnimatePresence>
            </div>

             {/* Resume Download Section Display */}
             {currentSectionData?.type === 'resumeDownload' && (
                 <motion.div
                    key="resume-download-section"
                    variants={sectionBoxVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute bottom-5 left-5 max-w-xs w-full bg-gradient-to-br from-gray-900/80 via-black/70 to-gray-800/80 backdrop-blur-md p-4 rounded-xl shadow-2xl z-60 border border-green-400/30 text-white" // Changed border color
                 >
                     <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-shadow-sm">
                         {currentSectionData.icon || <Download size={20}/>}
                         {currentSectionData.title || "Download Resume"}
                     </h3>
                     <div className="text-center"> {/* Center the link/button */}
                         <a
                             href={currentSectionData.resumeUrl || '#'} // Use the URL from data
                             download="Resume.pdf" // Suggest a filename (change if needed)
                             target="_blank" // Open in new tab is good practice, though download attribute handles it
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold transition-colors duration-200 shadow-md"
                         >
                             <Download size={16} /> {/* Optional icon on button */}
                             {currentSectionData.linkText || "Download Now"}
                         </a>
                         {/* Show a reminder if the default path is still present */}
                         {(!currentSectionData.resumeUrl || currentSectionData.resumeUrl === '/Aadarsh-Raj-Resume.pdf') && (
                            <p className="text-xs text-yellow-400 mt-3">Note: Ensure the resume file exists in the public folder and the path is correct in the code.</p>
                         )}
                     </div>
                 </motion.div>
             )}

            {/* Contact Section Display */}
            {currentSectionData?.type === 'contact' && (
                 <motion.div
                    key="contact-details"
                    variants={sectionBoxVariants} // Use simple fade-in variant
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.07, delayChildren: 0.1 }} // Add stagger
                    className="absolute bottom-5 left-5 max-w-xs w-full bg-gradient-to-br from-gray-900/80 via-black/70 to-gray-800/80 backdrop-blur-md p-4 rounded-xl shadow-2xl z-60 border border-purple-400/30 text-white"
                 >
                     <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-shadow-sm">
                         {currentSectionData.icon || <Mail size={20}/>}
                         {currentSectionData.title || "Get In Touch"}
                     </h3>
                     <motion.ul className="space-y-3">
                         {currentSectionData.details?.map((item) => (
                            <motion.li key={item.id} variants={contactItemVariants} className="flex items-center gap-3 group">
                                <span className="flex-shrink-0 w-5 h-5 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </span>
                                <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-200 hover:text-purple-300 transition-colors duration-200 truncate group-hover:underline"
                                    title={item.label} // Use label for tooltip, href might be too technical
                                >
                                    {item.label}
                                </a>
                            </motion.li>
                         ))}
                     </motion.ul>
                 </motion.div>
            )}

        </div> // End of main container
    );
}