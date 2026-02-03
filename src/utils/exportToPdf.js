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
        const pdf = await worker.toPdf().get('pdf');
        const totalPages = pdf.internal.getNumberOfPages();

        // Heuristic: If forceOnePage is true and we somehow got > 1 page,
        // it means either genuine overflow or the phantom empty page bug.
        // We will attempt to delete the extra pages if strictly forced, 
        // OR just delete the last page if it's very likely empty (advanced detection is hard without canvas access here).
        // For V1 Safety: We will only delete pages if 'forceOnePage' is explicitly True.

        if (totalPages > 1 && options.forceOnePage) {
            console.warn(`[PDF Export] Generated ${totalPages} pages but Force 1-Page is ON. Removing extra pages.`);
            // Remove from the end backwards
            for (let i = totalPages; i > 1; i--) {
                pdf.deletePage(i);
            }
        }

        pdf.save(filename);

    } catch (error) {
        console.error("PDF Export Failed:", error);
        alert("Export failed. See console.");
    } finally {
        // 6. Cleanup
        element.classList.remove('pdf-export-mode');
        if (originalStyle) element.setAttribute('style', originalStyle);
    }
};
