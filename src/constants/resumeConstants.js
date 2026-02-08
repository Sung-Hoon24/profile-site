// Define the strict schema for the resume data
export const INITIAL_RESUME_STATE = {
    templateId: 'developer', // Template ID for switching designs
    theme: {
        fontSize: 'medium'
    },
    basicInfo: {
        fullName: '',
        role: '',
        email: '',
        phone: '',
        summary: ''
    },
    // List items MUST have 'id'
    experience: [], // Array of { id, company, role, period, desc }
    education: [],  // Array of { id, school, major, year }
    skills: ''      // String (comma separated)
};
