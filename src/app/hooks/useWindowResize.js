import { useState, useEffect } from 'react';

export const useWindowResize = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 925) {
                setIsSmallScreen(true);
                setIsCollapsed(true);
            } else {
                setIsSmallScreen(false);
                setIsCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Trigger on mount

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { isCollapsed, isSmallScreen, setIsCollapsed };
};
