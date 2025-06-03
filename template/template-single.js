// Template rendering functions
function renderResume(data, container) {
    // Ensure container is empty
    container.innerHTML = '';
    
    // Create modern template structure
    const resumeHTML = `
        <div class="p-6 bg-white">
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row items-center mb-6 pb-6 border-b border-gray-300">
                ${data.photo ? `
                    <div class="w-32 h-32 mb-4 md:mb-0 md:mr-6">
                        <img src="${data.photo}" alt="${data.personal.fullName}" class="w-32 h-32 rounded-full object-cover border-4 border-gray-200">
                    </div>
                ` : ''}
                
                <div class="flex-1 text-center md:text-left">
                    <h1 class="text-3xl font-bold text-gray-800 mb-1">${data.personal.fullName || 'Your Name'}</h1>
                    <h2 class="text-xl text-gray-600 mb-3">${data.personal.title || 'Your Title'}</h2>
                    
                    <div class="flex flex-wrap justify-center md:justify-start text-sm text-gray-600 gap-y-1">
                        ${data.personal.email ? `
                            <div class="flex items-center mr-4">
                                <i class="fas fa-envelope mr-2 text-gray-500"></i>
                                <span>${data.personal.email}</span>
                            </div>
                        ` : ''}
                        
                        ${data.personal.phone ? `
                            <div class="flex items-center mr-4">
                                <i class="fas fa-phone mr-2 text-gray-500"></i>
                                <span>${data.personal.phone}</span>
                            </div>
                        ` : ''}
                        
                        ${data.personal.location ? `
                            <div class="flex items-center mr-4">
                                <i class="fas fa-map-marker-alt mr-2 text-gray-500"></i>
                                <span>${data.personal.location}</span>
                            </div>
                        ` : ''}
                        
                        ${data.personal.website ? `
                            <div class="flex items-center">
                                <i class="fas fa-globe mr-2 text-gray-500"></i>
                                <span>${data.personal.website}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <!-- Summary Section -->
            ${data.summary ? `
                <div class="mb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Professional Summary</h2>
                    <p class="text-gray-600">${formatText(data.summary)}</p>
                </div>
            ` : ''}
            
            <!-- Skills Section -->
            ${data.skills && data.skills.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Skills</h2>
                    <div class="flex flex-wrap gap-2" id="skills-container">
                        ${data.skills.map(skill => `<span>${skill}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Experience Section -->
            ${data.experience && data.experience.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Work Experience</h2>
                    ${data.experience.map(job => `
                        <div class="mb-4">
                            <div class="flex flex-col md:flex-row md:justify-between mb-1">
                                <h3 class="font-bold text-gray-800">${job.position}</h3>
                                <p class="text-gray-600 text-sm">${formatDate(job.startDate)} - ${formatDate(job.endDate)}</p>
                            </div>
                            <p class="text-gray-700 mb-1">${job.company}</p>
                            ${job.description ? `<div class="text-gray-600 text-sm">${formatText(job.description)}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <!-- Education Section -->
            ${data.education && data.education.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">Education</h2>
                    ${data.education.map(edu => `
                        <div class="mb-4">
                            <div class="flex flex-col md:flex-row md:justify-between mb-1">
                                <h3 class="font-bold text-gray-800">${edu.degree}</h3>
                                <p class="text-gray-600 text-sm">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</p>
                            </div>
                            <p class="text-gray-700 mb-1">${edu.school}</p>
                            ${edu.description ? `<p class="text-gray-600 text-sm">${formatText(edu.description)}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <!-- Custom Fields Section -->
            ${data.customFields && data.customFields.length > 0 ? 
                data.customFields.map(field => `
                    <div class="mb-6">
                        <h2 class="text-xl font-bold text-gray-800 mb-3 pb-1 border-b border-gray-200">${field.name}</h2>
                        <div class="text-gray-600">${formatText(field.content)}</div>
                    </div>
                `).join('')
            : ''}
        </div>
    `;
    
    container.innerHTML = resumeHTML;
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return '';
    if (dateString === 'Present') return 'Present';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
}

// Helper function to format text (handle bullet points, etc.)
function formatText(text) {
    if (!text) return '';
    
    // Replace line breaks with <br>
    let formatted = text.replace(/\n/g, '<br>');
    
    // Convert markdown-style bullet points to HTML
    formatted = formatted.replace(/^[\s-]*[-*][\s]+(.*)/gm, '<li>$1</li>');
    
    // Wrap lists in <ul> tags
    if (formatted.includes('<li>')) {
        formatted = '<ul class="list-disc pl-5">' + formatted + '</ul>';
    }
    
    return formatted;
}

// Warning before refresh
window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    e.returnValue = '';
}); 