import React, { forwardRef } from 'react';
import ResumePaper_Developer from './templates/Developer/ResumePaper_Developer';
import ResumePaper_Designer from './templates/Designer/ResumePaper_Designer';
import ResumePaper_Future from './templates/Future/ResumePaper_Future';
import ResumePaper_Executive from './templates/Executive/ResumePaper_Executive';
import ResumePaper_Startup from './templates/Startup/ResumePaper_Startup';

// 🔀 Template Switcher Component
// Acts as a router to load the correct design based on data.templateId
const ResumePaper = forwardRef(({ data }, ref) => {
    // Default to 'developer' if no ID is found (Backward Compatibility)
    const templateId = data?.templateId || 'developer';

    // console.log(`[ResumePaper] Rendering Template: ${templateId}`);

    switch (templateId) {
        case 'startup':
            return <ResumePaper_Startup data={data} ref={ref} />;
        case 'executive':
            return <ResumePaper_Executive data={data} ref={ref} />;
        case 'future':
            return <ResumePaper_Future data={data} ref={ref} />;
        case 'designer':
            return <ResumePaper_Designer data={data} ref={ref} />;
        case 'developer':
        default:
            return <ResumePaper_Developer data={data} ref={ref} />;
    }
});

export default ResumePaper;
