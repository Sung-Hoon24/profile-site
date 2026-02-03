import { INITIAL_RESUME_STATE } from '../constants/resumeConstants';

/**
 * Exports data object to a JSON file download
 * @param {object} data - The data to export
 * @param {string} filename - The name of the file to download
 */
export const exportToJson = (data, filename = 'resume_backup.json') => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};

/**
 * Validates and parses a JSON file
 * @param {File} file - The file object from input
 * @returns {Promise<object>} - The parsed and validated data
 */
export const validateAndParseJson = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);

                // Simple Schema Validation
                // Must have at least 'basicInfo' or 'experience' or 'education'
                const isValid = json && (
                    json.basicInfo || json.experience || json.education || json.skills
                );

                if (!isValid) {
                    reject(new Error('Invalid Resume JSON format. Missing core fields.'));
                    return;
                }

                resolve(json);
            } catch (err) {
                reject(new Error('Failed to parse JSON file: ' + err.message));
            }
        };

        reader.onerror = () => reject(new Error('File reading failed'));
        reader.readAsText(file);
    });
};
