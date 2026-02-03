import { useState, useEffect } from 'react';

/**
 * Automatically adjusts font size to fit content within maxHeight.
 * Measures the inner content height vs the container's allowed height.
 */
export const useAutoFitFont = (contentRef, data, maxHeight = 1060, options = {}) => {
    const [fontSize, setFontSize] = useState(16);
    const [status, setStatus] = useState('OK'); // 'OK' | 'ADJUSTED' | 'OVER'

    // Options
    const minSize = options.minSize || 10;
    const step = options.step || 0.5;

    useEffect(() => {
        if (!contentRef.current) return;

        const element = contentRef.current;
        const isActive = options.active !== false; // Default true if undefined

        // If inactive, reset font and exit
        if (!isActive) {
            element.style.fontSize = ''; // Remove inline style
            setStatus('OK');
            setFontSize(16); // Reset state
            return;
        }

        let currentSize = 16;

        // Reset to initial to measure
        element.style.fontSize = `${currentSize}px`;

        const checkStrictFit = () => {
            // A4 Height (297mm) is fixed.
            // We need to check if content overflows the content-box.
            // clientHeight = includes padding if box-sizing border-box?? No, usually inner.
            // Let's use scrollHeight vs clientHeight.

            // FIXED: Use maxHeight prop if available, otherwise element height
            // We must respect the A4 limit (passed as maxHeight)
            const allowed = maxHeight || element.clientHeight;
            const actual = element.scrollHeight;

            // Allow a tiny margin of error (1px)
            return {
                allowed,
                actual,
                isOver: actual > allowed + 1
            };
        };

        const adjust = () => {
            let { allowed, actual, isOver } = checkStrictFit();
            let isAdjusted = false;

            console.log(`[AutoFit] Start: Size=${currentSize}px, Allowed=${allowed}px, Actual=${actual}px`);

            // Shrink loop only if overflowing
            if (isOver) {
                while (isOver && currentSize > minSize) {
                    currentSize -= step;
                    element.style.fontSize = `${currentSize}px`;

                    const check = checkStrictFit();
                    allowed = check.allowed;
                    actual = check.actual;
                    isOver = check.isOver;

                    isAdjusted = true;
                }
            }

            console.log(`[AutoFit] End: Size=${currentSize}px, IsOver=${isOver}, Status=${isOver ? 'OVER' : isAdjusted ? 'ADJUSTED' : 'OK'}`);

            setFontSize(currentSize);

            // Final Status Check
            if (isOver) {
                setStatus('OVER');
            } else if (isAdjusted) {
                setStatus('ADJUSTED');
            } else {
                setStatus('OK');
            }
        };

        // Small delay to ensure render
        requestAnimationFrame(() => {
            requestAnimationFrame(adjust);
        });

    }, [data, maxHeight, minSize, step, options.active]);

    return { fontSize, status };
};
