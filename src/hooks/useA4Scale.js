import { useState, useEffect, useLayoutEffect } from 'react';

/**
 * Calculates the scale factor to fit an A4 paper (210mm x 297mm) into a container.
 * @param {React.RefObject} containerRef - The container element to fit into.
 * @param {number} padding - Padding around the paper in pixels (default 40).
 * @returns {number} scale - The calculated scale factor (0 to 1).
 */
export const useA4Scale = (containerRef, padding = 40) => {
    const [scale, setScale] = useState(1);

    // A4 Size in Pixels (96 DPI approximation, but we use logic to fit)
    // We treat 210mm width as roughly 794px and 297mm height as 1123px at 96 DPI.
    // However, it's safer to use a base width for the paper component and scale it.
    // Standard web A4 width is often treated as 210mm or approx 794px.
    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;

    useLayoutEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return;

            const { clientWidth, clientHeight } = containerRef.current;

            // Available space
            const availableWidth = clientWidth - padding;
            const availableHeight = clientHeight - padding;

            // Ratios
            const widthRatio = availableWidth / A4_WIDTH_PX;
            const heightRatio = availableHeight / A4_HEIGHT_PX;

            // Fit: Use the smaller ratio to ensure it fits both dimensions
            const newScale = Math.min(widthRatio, heightRatio, 1); // Never scale up beyond 1 if using raster images logic, but for vector text it's fine. 
            // Actually, allow scaling up? Usually previews are fit-to-screen. 
            // Let's cap at 1.5 for readability if screen is huge, but 'contain' usually means <= container.

            setScale(newScale > 0 ? newScale : 0.1);
        };

        // Initial Calculation
        updateScale();

        // Resize Observer
        const observer = new ResizeObserver(() => {
            // Defer slightly to avoid ResizeLoop errors
            requestAnimationFrame(updateScale);
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [containerRef]);

    return scale;
};
