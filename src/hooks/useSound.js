// src/hooks/useSound.js
import { useState, useCallback, useRef, useEffect } from 'react';

const useSound = (url, { volume = 1, loop = false }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Preload audio
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio(url);
            audioRef.current.volume = volume;
            audioRef.current.loop = loop;
            audioRef.current.load(); // Start loading

            const handleEnded = () => setIsPlaying(false);
            audioRef.current.addEventListener('ended', handleEnded);

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener('ended', handleEnded);
                    audioRef.current.pause(); // Stop playback on unmount
                    audioRef.current = null;
                }
            };
        }
    }, [url, volume, loop]);

    const play = useCallback(() => {
        if (audioRef.current && audioRef.current.readyState >= 3) { // HAVE_FUTURE_DATA or more
            audioRef.current.currentTime = 0; // Rewind
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                // Autoplay might be blocked
                console.warn(`Sound play failed for ${url}:`, error);
                setIsPlaying(false);
            });
        } else {
            // Optional: Queue playback if not ready? For now, just log.
             console.warn(`Sound not ready to play: ${url}`);
        }
    }, [url]);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    }, []);

     const setVolume = useCallback((newVolume) => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
        }
    }, []);


    return [play, stop, isPlaying, setVolume];
};

export default useSound;