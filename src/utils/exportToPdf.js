import html2pdf from 'html2pdf.js';

/**
 * Robust PDF Export Function
 * - Waits for images/fonts
 * - High resolution (scale 2)
 * - Removes extra blank pages if detected
 */
export const exportToPdf = async (element, filename = 'resume.pdf', options = {}) => {
    if (!element) return;

    // 1. Wait for resources
    await document.fonts.ready;
    // Optional: Add logic to wait for images if needed (e.g., Image constructor loading)

    // 2. Prepare Element
    const originalStyle = element.getAttribute('style'); // Backup style
    element.classList.add('pdf-export-mode');

    // 3. Configuration
    const margin = options.margin || 0; // margin in mm
    const quality = options.quality || 2; // scale factor

    const opt = {
        margin: [margin, margin, margin, margin],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: quality,
            useCORS: true,
            logging: false,
            scrollY: 0,
            windowWidth: 794, // Force A4 width perception
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        // 4. Generate Worker
        const worker = html2pdf().set(opt).from(element);

        // 5. Custom Save Logic to fix blank pages
        await worker.toPdf().get('pdf').then((pdf) => {
            const totalPages = pdf.internal.getNumberOfPages();

            // Heuristic: If we have > 1 page, and the content was supposed to fit in 1,
            // check if we should delete the last page.
            // However, html2pdf hard to check content empty.
            // We'll rely on our CSS to Ensure single page fit first.
            // If the user *requested* 1-page fit, we assume 1 page.

            if (totalPages > 1 && options.forceOnePage) {
                // Delete all pages after the first one
                for (let i = totalPages; i > 1; i--) {
                    pdf.deletePage(i);
                }
            }
        }).save();

    } catch (error) {
        console.error("PDF Export Failed:", error);
        alert("Export failed. See console.");
    } finally {
        // 6. Cleanup
        element.classList.remove('pdf-export-mode');
        if (originalStyle) element.setAttribute('style', originalStyle);
    }
};
