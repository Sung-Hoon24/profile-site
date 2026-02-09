// Define the strict schema for the resume data
export const INITIAL_RESUME_STATE = {
    templateId: 'developer', // Template ID for switching designs
    lang: 'ko', // 'ko' | 'en'
    theme: {
        fontSize: 'medium', // small, medium, large
        fontFamily: 'pretendard', // pretendard, serif, sans
        lineHeight: 1.6,
        color: '#000000'
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
