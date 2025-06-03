// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Add page refresh warning
    window.addEventListener('beforeunload', function(e) {
        // Cancel the event and show confirmation dialog
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = 'Changes you made may not be saved. Are you sure you want to leave?';
        // This custom message may not be shown in modern browsers for security reasons
        // But the browser will still show a standard confirmation dialog
        return 'Changes you made may not be saved. Are you sure you want to leave?';
    });

    const tabButtons = document.querySelectorAll('.tab-btn');
    const formContents = document.querySelectorAll('.form-content');
    const addEducationBtn = document.getElementById('addEducation');
    const addExperienceBtn = document.getElementById('addExperience');
    const addProjectBtn = document.getElementById('addProject');
    const educationList = document.getElementById('educationList');
    const experienceList = document.getElementById('experienceList');
    const projectsList = document.getElementById('projectsList');
    const skillInput = document.getElementById('skillInput');
    const addSkillBtn = document.getElementById('addSkill');
    const skillsList = document.getElementById('skillsList');
    const templateSelect = document.getElementById('templateSelect');
    const saveBtn = document.getElementById('saveBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resumePreview = document.getElementById('resumePreview');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const photoInput = document.getElementById('photo');

    // Resume Data Structure - this will be used by your custom template
    window.resumeData = {
        personal: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            photo: '',
            summary: ''
        },
        education: [],
        experience: [],
        skills: [],
        projects: []
    };

    // Theme Management
    const initTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', currentTheme);
        
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('i');
            icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            
            darkModeToggle.addEventListener('click', () => {
                const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                document.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            });
        }
    };

    // Tab Navigation
    const initTabs = () => {
        // Tab switching functionality
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                formContents.forEach(content => {
                    content.classList.remove('active');
                    content.classList.add('hidden');
                });
                
                // Add active class to selected button and content
                button.classList.add('active');
                const targetSection = button.dataset.section;
                const targetContent = document.getElementById(targetSection);
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.classList.remove('hidden');
                }
            });
        });
        
        // Ensure at least one tab is active (Personal tab by default)
        if (document.querySelector('.form-content.active') === null) {
            const personalTab = document.querySelector('[data-section="personal"]');
            if (personalTab) {
                personalTab.classList.add('active');
            }
            
            const personalContent = document.getElementById('personal');
            if (personalContent) {
                personalContent.classList.add('active');
                personalContent.classList.remove('hidden');
            }
        }
    };

    // Template Functions
    const educationTemplate = document.getElementById('educationTemplate');
    const experienceTemplate = document.getElementById('experienceTemplate');
    const projectTemplate = document.getElementById('projectTemplate');

    const createEducationEntry = (data = null) => {
        const entry = educationTemplate.content.cloneNode(true);
        setupEntryListeners(entry, 'education');
        educationList.appendChild(entry);

        // If data is provided, populate the fields
        if (data) {
            const newEntry = educationList.lastElementChild;
            newEntry.querySelector('[name="school"]').value = data.school || '';
            newEntry.querySelector('[name="degree"]').value = data.degree || '';
            newEntry.querySelector('[name="eduStartDate"]').value = data.startDate || '';
            
            const currentCheckbox = newEntry.querySelector('[name="current"]');
            if (currentCheckbox) {
                currentCheckbox.checked = data.current || false;
                const endDateInput = newEntry.querySelector('[name="eduEndDate"]');
                endDateInput.disabled = data.current || false;
                endDateInput.value = data.current ? '' : (data.endDate || '');
            } else {
                newEntry.querySelector('[name="eduEndDate"]').value = data.endDate || '';
            }
            
            newEntry.querySelector('[name="eduDescription"]').value = data.description || '';
        }
        
        return educationList.lastElementChild;
    };

    const createExperienceEntry = (data = null) => {
        const entry = experienceTemplate.content.cloneNode(true);
        setupEntryListeners(entry, 'experience');
        experienceList.appendChild(entry);

        // If data is provided, populate the fields
        if (data) {
            const newEntry = experienceList.lastElementChild;
            newEntry.querySelector('[name="company"]').value = data.company || '';
            newEntry.querySelector('[name="position"]').value = data.position || '';
            newEntry.querySelector('[name="expStartDate"]').value = data.startDate || '';
            
            const currentCheckbox = newEntry.querySelector('[name="current"]');
            if (currentCheckbox) {
                currentCheckbox.checked = data.current || false;
                const endDateInput = newEntry.querySelector('[name="expEndDate"]');
                endDateInput.disabled = data.current || false;
                endDateInput.value = data.current ? '' : (data.endDate || '');
            } else {
                newEntry.querySelector('[name="expEndDate"]').value = data.endDate || '';
            }
            
            newEntry.querySelector('[name="expDescription"]').value = data.description || '';
        }
        
        return experienceList.lastElementChild;
    };

    const createProjectEntry = (data = null) => {
        const entry = projectTemplate.content.cloneNode(true);
        setupEntryListeners(entry, 'projects');
        projectsList.appendChild(entry);

        // If data is provided, populate the fields
        if (data) {
            const newEntry = projectsList.lastElementChild;
            newEntry.querySelector('[name="projectName"]').value = data.name || '';
            newEntry.querySelector('[name="technologies"]').value = data.technologies || '';
            newEntry.querySelector('[name="projectUrl"]').value = data.url || '';
            newEntry.querySelector('[name="projectDescription"]').value = data.description || '';
        }
        
        return projectsList.lastElementChild;
    };

    // Setup Entry Listeners
    const setupEntryListeners = (entry, type) => {
        const deleteBtn = entry.querySelector('.delete-btn');
        const inputs = entry.querySelectorAll('input, textarea');
        const currentCheckbox = entry.querySelector('.current-checkbox');

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                deleteBtn.closest('.entry-card').remove();
                updateResumeData();
            });
        }

        if (currentCheckbox) {
            currentCheckbox.addEventListener('change', (e) => {
                const endDateInput = e.target.closest('.form-group').querySelector(`[name="${type === 'education' ? 'eduEndDate' : 'expEndDate'}"]`);
                if (endDateInput) {
                    endDateInput.disabled = e.target.checked;
                    if (e.target.checked) {
                        endDateInput.value = '';
                    }
                }
                updateResumeData();
            });
        }

        inputs.forEach(input => {
            input.addEventListener('input', updateResumeData);
        });
    };

    // Skills Management
    const addSkill = () => {
        const skillText = skillInput.value.trim();
        if (!skillText) return;

        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skillText}
            <button type="button" class="remove-skill">
                <i class="fas fa-times"></i>
            </button>
        `;

        const removeBtn = skillTag.querySelector('.remove-skill');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                skillTag.remove();
                updateResumeData();
            });
        }

        skillsList.appendChild(skillTag);
        skillInput.value = '';
        updateResumeData();
    };

    // Update Resume Data
    const updateResumeData = () => {
        // Personal Information
        const personalForm = document.getElementById('personalForm');
        if (personalForm) {
            window.resumeData.personal = {
                fullName: personalForm.fullName.value || '',
                email: personalForm.email.value || '',
                phone: personalForm.phone.value || '',
                location: personalForm.location.value || '',
                photo: window.resumeData.personal.photo || '',
                summary: personalForm.summary.value || ''
            };
        }

        // Education
        window.resumeData.education = Array.from(educationList.children || []).map(entry => ({
            school: entry.querySelector('[name="school"]')?.value || '',
            degree: entry.querySelector('[name="degree"]')?.value || '',
            startDate: entry.querySelector('[name="eduStartDate"]')?.value || '',
            endDate: entry.querySelector('[name="eduEndDate"]')?.value || '',
            current: entry.querySelector('[name="current"]')?.checked || false,
            description: entry.querySelector('[name="eduDescription"]')?.value || ''
        }));

        // Experience
        window.resumeData.experience = Array.from(experienceList.children || []).map(entry => ({
            company: entry.querySelector('[name="company"]')?.value || '',
            position: entry.querySelector('[name="position"]')?.value || '',
            startDate: entry.querySelector('[name="expStartDate"]')?.value || '',
            endDate: entry.querySelector('[name="expEndDate"]')?.value || '',
            current: entry.querySelector('[name="current"]')?.checked || false,
            description: entry.querySelector('[name="expDescription"]')?.value || ''
        }));

        // Skills
        window.resumeData.skills = Array.from(skillsList.children || []).map(skill => 
            skill.textContent.trim().replace(/×/g, '').trim()
        );

        // Projects
        window.resumeData.projects = Array.from(projectsList.children || []).map(entry => ({
            name: entry.querySelector('[name="projectName"]')?.value || '',
            technologies: entry.querySelector('[name="technologies"]')?.value || '',
            url: entry.querySelector('[name="projectUrl"]')?.value || '',
            description: entry.querySelector('[name="projectDescription"]')?.value || ''
        }));
        
        // Update preview - this is where your custom template will be rendered
        updatePreview();
    };

    // Update Resume Preview
    const updatePreview = () => {
        if (!resumePreview) return;
        
        // Get the selected template
        const template = templateSelect ? templateSelect.value : 'modern-simple';
        
        try {
            // Use the template loader to load the selected template
            if (window.loadResumeTemplate && typeof window.loadResumeTemplate === 'function') {
                console.log('Loading template:', template);
                const success = window.loadResumeTemplate(template, resumePreview);
                
                if (!success) {
                    throw new Error(`Failed to load template: ${template}`);
                }
                
                // Apply photo styles after template is loaded
                applyPhotoStyles();
            } else if (window.resumeTemplates && window.resumeTemplates[template]) {
                // Fallback to using the template content directly
                console.log('Using template content directly:', template);
                resumePreview.innerHTML = window.resumeTemplates[template];
                
                // Apply photo styles 
                applyPhotoStyles();
            } else {
                throw new Error('Template system not loaded correctly');
            }
            
            console.log('Template loaded successfully');
            
            // After template is loaded, we can try to customize it with user data
            try {
                // Update name
                const nameElement = resumePreview.querySelector('h1');
                if (nameElement) {
                    nameElement.textContent = window.resumeData.personal.fullName || 'Your Name';
                }
                
                // Update job title if available in the template
                const titleElement = resumePreview.querySelector('p.text-xl, p.text-lg');
                if (titleElement && titleElement.textContent.includes('Professional Title')) {
                    titleElement.textContent = 'Professional Resume';
                }
                
                // Update contact information
                const contactElements = resumePreview.querySelectorAll('.text-gray-500, .text-gray-600, .prof-contact');
                for (const contactElement of contactElements) {
                    if (contactElement.textContent.includes('email') || contactElement.textContent.includes('john.doe@email.com') || contactElement.textContent.includes('📧')) {
                        let contactInfo = [];
                        
                        if (window.resumeData.personal.email) {
                            contactInfo.push(`📧 ${window.resumeData.personal.email}`);
                        }
                        if (window.resumeData.personal.phone) {
                            contactInfo.push(`📞 ${window.resumeData.personal.phone}`);
                        }
                        if (window.resumeData.personal.location) {
                            contactInfo.push(`🌍 ${window.resumeData.personal.location}`);
                        }
                        
                        if (contactInfo.length > 0) {
                            if (contactElement.querySelector('p')) {
                                // Handle multiple paragraph format
                                const paragraphs = contactElement.querySelectorAll('p');
                                if (paragraphs.length >= 3) {
                                    if (window.resumeData.personal.email) paragraphs[0].textContent = `📧 ${window.resumeData.personal.email}`;
                                    if (window.resumeData.personal.phone) paragraphs[1].textContent = `📞 ${window.resumeData.personal.phone}`;
                                    if (window.resumeData.personal.location) paragraphs[2].textContent = `🌍 ${window.resumeData.personal.location}`;
                                }
                            } else if (contactElement.textContent.includes('|')) {
                                // Pipe separated format
                                contactElement.textContent = contactInfo.join(' | ');
                            } else {
                                // Simple text format
                                contactElement.textContent = contactInfo.join(' • ');
                            }
                            break;
                        }
                    }
                }
                
                // Update photo if available in the template
                if (window.resumeData.personal.photo) {
                    const photoElement = resumePreview.querySelector('img');
                    if (photoElement) {
                        photoElement.src = window.resumeData.personal.photo;
                        photoElement.alt = window.resumeData.personal.fullName || 'Profile Photo';
                        
                        // Ensure proper image sizing based on parent container
                        const parentContainer = photoElement.parentElement;
                        if (parentContainer) {
                            // Make sure the image maintains aspect ratio and fits in its container
                            photoElement.style.width = '100%';
                            photoElement.style.height = '100%';
                            photoElement.style.objectFit = 'cover';
                            photoElement.style.objectPosition = 'center';
                            
                            // Ensure parent container has proper dimensions
                            if (!parentContainer.style.width || !parentContainer.style.height) {
                                // Get template type to determine appropriate sizing
                                const templateId = templateSelect ? templateSelect.value : 'modern-simple';
                                
                                if (templateId.includes('modern')) {
                                    parentContainer.style.width = '120px';
                                    parentContainer.style.height = '120px';
                                    // Modern templates typically have round photos
                                    if (!parentContainer.classList.contains('rounded-full')) {
                                        parentContainer.classList.add('rounded-full');
                                        parentContainer.style.overflow = 'hidden';
                                    }
                                } else if (templateId.includes('professional')) {
                                    parentContainer.style.width = '150px';
                                    parentContainer.style.height = '180px';
                                    // Professional templates often have square/rectangle photos
                                    if (!parentContainer.classList.contains('rounded-lg')) {
                                        parentContainer.classList.add('rounded-lg');
                                        parentContainer.style.overflow = 'hidden';
                                    }
                                } else if (templateId.includes('classic')) {
                                    parentContainer.style.width = '120px';
                                    parentContainer.style.height = '150px';
                                    // Classic templates often have simple photos
                                    parentContainer.style.overflow = 'hidden';
                                }
                            }
                        }
                    }
                }
                
                // Update summary if available in the template
                if (window.resumeData.personal.summary) {
                    const summaryElement = resumePreview.querySelector('.text-sm.text-gray-700, .text-gray-700.leading-relaxed');
                    if (summaryElement && (summaryElement.textContent.includes('brief professional summary') || summaryElement.textContent.trim() === '')) {
                        summaryElement.textContent = window.resumeData.personal.summary;
                    }
                }
                
                // Update skills
                if (window.resumeData.skills && window.resumeData.skills.length > 0) {
                    // Find skills container based on common template structures
                    const skillsContainers = [
                        resumePreview.querySelector('.flex.flex-wrap.gap-2'),
                        resumePreview.querySelector('.grid.grid-cols-2'),
                        resumePreview.querySelector('.flex.flex-wrap.gap-6'),
                        resumePreview.querySelector('.grid.grid-cols-2.md\\:grid-cols-3'),
                        resumePreview.querySelector('.flex.flex-wrap.justify-center'),
                        resumePreview.querySelector('.flex.flex-wrap')
                    ];
                    
                    // Use the first valid container found
                    const skillsContainer = skillsContainers.find(container => container !== null);
                    
                    if (skillsContainer) {
                        skillsContainer.innerHTML = '';
                        window.resumeData.skills.forEach(skill => {
                            const styleClass = skillsContainer.classList.contains('grid') ? '' : 
                                              skillsContainer.firstElementChild?.classList.toString() || '';
                            
                            const skillElement = document.createElement('span');
                            skillElement.textContent = skill;
                            if (styleClass) skillElement.className = styleClass;
                            
                            skillsContainer.appendChild(skillElement);
                            
                            // Add separators if using center-justified layout with bullets
                            if (skillsContainer.classList.contains('justify-center') && 
                                skillsContainer.children.length < window.resumeData.skills.length * 2) {
                                const separator = document.createElement('span');
                                separator.textContent = '•';
                                separator.className = 'text-gray-700';
                                skillsContainer.appendChild(separator);
                            }
                        });
                        
                        // Remove the last bullet if it exists
                        if (skillsContainer.lastElementChild && 
                            skillsContainer.lastElementChild.textContent === '•') {
                            skillsContainer.removeChild(skillsContainer.lastElementChild);
                        }
                    } else if (resumePreview.textContent.includes('Skill 1, Skill 2')) {
                        // Handle comma-separated skills format
                        const paragraphs = resumePreview.querySelectorAll('p');
                        for (const p of paragraphs) {
                            if (p.textContent.includes('Skill 1, Skill 2')) {
                                p.textContent = window.resumeData.skills.join(', ');
                                break;
                            }
                        }
                    }
                }
                
                // Handle education entries
                if (window.resumeData.education && window.resumeData.education.length > 0) {
                    // Find the education section
                    const sectionTitles = Array.from(resumePreview.querySelectorAll('h2'));
                    const educationSection = sectionTitles.find(el => 
                        el.textContent.toLowerCase().includes('education'))?.closest('section');
                    
                    if (educationSection) {
                        // Keep the section header
                        const sectionHeader = educationSection.querySelector('h2');
                        const sectionStyle = educationSection.className;
                        educationSection.innerHTML = '';
                        educationSection.className = sectionStyle;
                        if (sectionHeader) educationSection.appendChild(sectionHeader);
                        
                        // Add education entries
                        window.resumeData.education.forEach(edu => {
                            // Try to match the template style based on what was there before
                            const entryDiv = document.createElement('div');
                            entryDiv.className = 'mb-4';
                            
                            // Create header with degree and dates
                            const headerDiv = document.createElement('div');
                            headerDiv.className = 'flex justify-between';
                            
                            const degreeHeader = document.createElement('h3');
                            degreeHeader.className = 'font-bold text-gray-800';
                            degreeHeader.textContent = edu.degree || 'Degree';
                            headerDiv.appendChild(degreeHeader);
                            
                            const dateSpan = document.createElement('span');
                            dateSpan.className = 'text-gray-600';
                            dateSpan.textContent = `${edu.startDate || ''} - ${edu.current ? 'Present' : (edu.endDate || '')}`;
                            headerDiv.appendChild(dateSpan);
                            
                            entryDiv.appendChild(headerDiv);
                            
                            // Add school name
                            const schoolP = document.createElement('p');
                            schoolP.className = 'text-gray-700';
                            schoolP.textContent = edu.school || 'School';
                            entryDiv.appendChild(schoolP);
                            
                            // Add description if available
                            if (edu.description) {
                                const descP = document.createElement('p');
                                descP.className = 'text-gray-600 mt-1';
                                descP.textContent = edu.description;
                                entryDiv.appendChild(descP);
                            }
                            
                            educationSection.appendChild(entryDiv);
                        });
                    }
                }
                
                // Handle experience entries
                if (window.resumeData.experience && window.resumeData.experience.length > 0) {
                    // Find the experience section
                    const sectionTitles = Array.from(resumePreview.querySelectorAll('h2'));
                    const experienceSection = sectionTitles.find(el => 
                        el.textContent.toLowerCase().includes('experience'))?.closest('section');
                    
                    if (experienceSection) {
                        // Keep the section header
                        const sectionHeader = experienceSection.querySelector('h2');
                        const sectionStyle = experienceSection.className;
                        experienceSection.innerHTML = '';
                        experienceSection.className = sectionStyle;
                        if (sectionHeader) experienceSection.appendChild(sectionHeader);
                        
                        // Add experience entries
                        window.resumeData.experience.forEach(exp => {
                            const entryDiv = document.createElement('div');
                            entryDiv.className = 'mb-4';
                            
                            // Create header with job title and dates
                            const headerDiv = document.createElement('div');
                            headerDiv.className = 'flex justify-between';
                            
                            const positionHeader = document.createElement('h3');
                            positionHeader.className = 'font-bold text-gray-800';
                            positionHeader.textContent = exp.position || 'Position';
                            headerDiv.appendChild(positionHeader);
                            
                            const dateSpan = document.createElement('span');
                            dateSpan.className = 'text-gray-600';
                            dateSpan.textContent = `${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}`;
                            headerDiv.appendChild(dateSpan);
                            
                            entryDiv.appendChild(headerDiv);
                            
                            // Add company name
                            const companyP = document.createElement('p');
                            companyP.className = 'text-gray-700 font-medium';
                            companyP.textContent = exp.company || 'Company';
                            entryDiv.appendChild(companyP);
                            
                            // Add description if available
                            if (exp.description) {
                                // If the description contains line breaks, create a bullet list
                                if (exp.description.includes('\n')) {
                                    const descUl = document.createElement('ul');
                                    descUl.className = 'list-disc pl-5 mt-2 text-gray-700';
                                    
                                    exp.description.split('\n').forEach(line => {
                                        if (line.trim()) {
                                            const li = document.createElement('li');
                                            li.textContent = line.trim();
                                            descUl.appendChild(li);
                                        }
                                    });
                                    
                                    entryDiv.appendChild(descUl);
                                } else {
                                    const descP = document.createElement('p');
                                    descP.className = 'text-gray-600 mt-2';
                                    descP.textContent = exp.description;
                                    entryDiv.appendChild(descP);
                                }
                            }
                            
                            experienceSection.appendChild(entryDiv);
                        });
                    }
                }
                
                // Handle projects if available in template
                if (window.resumeData.projects && window.resumeData.projects.length > 0) {
                    // Find projects section or create one
                    const sectionTitles = Array.from(resumePreview.querySelectorAll('h2'));
                    let projectsSection = sectionTitles.find(el => 
                        el.textContent.toLowerCase().includes('project'))?.closest('section');
                    
                    // If projects section exists
                    if (projectsSection) {
                        // Keep the section header
                        const sectionHeader = projectsSection.querySelector('h2');
                        const sectionStyle = projectsSection.className;
                        projectsSection.innerHTML = '';
                        projectsSection.className = sectionStyle;
                        if (sectionHeader) projectsSection.appendChild(sectionHeader);
                        
                        // Add project entries
                        window.resumeData.projects.forEach(project => {
                            const projectDiv = document.createElement('div');
                            projectDiv.className = 'mb-4';
                            
                            const nameHeader = document.createElement('h3');
                            nameHeader.className = 'font-bold text-gray-800';
                            nameHeader.textContent = project.name || 'Project Name';
                            projectDiv.appendChild(nameHeader);
                            
                            if (project.technologies) {
                                const techP = document.createElement('p');
                                techP.className = 'text-gray-600 italic';
                                techP.textContent = `Technologies: ${project.technologies}`;
                                projectDiv.appendChild(techP);
                            }
                            
                            if (project.url) {
                                const urlP = document.createElement('p');
                                const urlA = document.createElement('a');
                                urlA.href = project.url;
                                urlA.target = '_blank';
                                urlA.textContent = project.url;
                                urlA.className = 'text-blue-600 hover:underline';
                                urlP.appendChild(urlA);
                                projectDiv.appendChild(urlP);
                            }
                            
                            if (project.description) {
                                const descP = document.createElement('p');
                                descP.className = 'text-gray-700 mt-1';
                                descP.textContent = project.description;
                                projectDiv.appendChild(descP);
                            }
                            
                            projectsSection.appendChild(projectDiv);
                        });
                    }
                }
            } catch (error) {
                console.error('Error customizing template:', error);
            }
        } catch (error) {
            console.error('Template loading error:', error);
            resumePreview.innerHTML = `
                <div class="template-error">
                    <h2>Template Loading Error</h2>
                    <p>Failed to load the custom template.</p>
                    <p>Error details: ${error.message}</p>
                    <p>Please check the following:</p>
                    <ul>
                        <li>Make sure the template-loader.js file is properly loaded</li>
                        <li>Check console for additional error messages</li>
                    </ul>
                    <p>As a workaround, try selecting another template option.</p>
                </div>
            `;
        }
    };

    // Download PDF Functionality
    const downloadResume = async () => {
        try {
            // Show loading state
            if (downloadBtn) {
                downloadBtn.disabled = true;
                downloadBtn.textContent = 'Generating PDF...';
            }
            
            // Get jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Use html2canvas to capture the custom template as a PDF
            const resumeElement = document.getElementById('resumePreview');
            
            if (resumeElement) {
                const canvas = await html2canvas(resumeElement);
                const imgData = canvas.toDataURL('image/png');
                
                // Add the image to the PDF
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = doc.internal.pageSize.getHeight();
                
                // Calculate ratio to fit the image in the PDF
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                
                doc.addImage(
                    imgData, 'PNG', 
                    0, 0, 
                    imgWidth * ratio, 
                    imgHeight * ratio
                );
                
                // Save the PDF
                const filename = `${window.resumeData.personal.fullName ? window.resumeData.personal.fullName.replace(/\s+/g, '_') : 'Resume'}.pdf`;
                doc.save(filename);
            } else {
                alert('Could not find resume preview element.');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            // Reset button state
            if (downloadBtn) {
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Download PDF';
            }
        }
    };

    // Event Listeners
    if (addEducationBtn) addEducationBtn.addEventListener('click', () => createEducationEntry());
    if (addExperienceBtn) addExperienceBtn.addEventListener('click', () => createExperienceEntry());
    if (addProjectBtn) addProjectBtn.addEventListener('click', () => createProjectEntry());
    if (skillInput) {
        skillInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
            }
        });
    }
    if (addSkillBtn) addSkillBtn.addEventListener('click', addSkill);
    if (templateSelect) {
        templateSelect.addEventListener('change', () => {
            updatePreview();
            // Apply photo styles whenever template changes
            setTimeout(applyPhotoStyles, 100);
        });
    }
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            updateResumeData();
            alert('Resume data saved for this session. Note: All data will be lost when you refresh the page.');
        });
    }
    if (downloadBtn) downloadBtn.addEventListener('click', downloadResume);

    // Function to preview uploaded image
    window.previewImage = function(event) {
        const preview = document.getElementById('photoPreview');
        const file = event.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                preview.src = reader.result;
                preview.style.display = 'block';
                // Update resume data with the new image
                window.resumeData.personal.photo = reader.result;
                updatePreview();
                
                // Apply photo styles to ensure proper sizing
                setTimeout(applyPhotoStyles, 100);
            }
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
            preview.style.display = 'none';
            window.resumeData.personal.photo = '';
            updatePreview();
        }
    };

    // Function to apply template-specific styles to profile photos
    const applyPhotoStyles = () => {
        const template = templateSelect ? templateSelect.value : 'modern-simple';
        const photoElements = resumePreview.querySelectorAll('img');
        
        photoElements.forEach(img => {
            // Find the parent container
            let photoContainer = img.parentElement;
            if (!photoContainer.classList.contains('profile-photo') && 
                !photoContainer.classList.contains('rounded-full') && 
                !photoContainer.classList.contains('rounded-lg')) {
                
                photoContainer.classList.add('profile-photo');
                
                if (template.includes('modern')) {
                    photoContainer.style.width = '120px';
                    photoContainer.style.height = '120px';
                    photoContainer.style.borderRadius = '50%';
                } else if (template.includes('professional')) {
                    photoContainer.style.width = '150px';
                    photoContainer.style.height = '180px';
                    photoContainer.style.borderRadius = '5px';
                } else if (template.includes('classic')) {
                    photoContainer.style.width = '120px';
                    photoContainer.style.height = '150px';
                    photoContainer.style.borderRadius = '0';
                }
                
                photoContainer.style.overflow = 'hidden';
                photoContainer.style.border = '2px solid #4a6fa5';
                
                // Style the img element
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.objectPosition = 'center top';
            }
        });
    };

    // Initialize
    initTheme();
    initTabs();
    updatePreview();
    
    // This global function will help connect your custom template
    window.renderCustomTemplate = (templateHTML) => {
        if (resumePreview) {
            resumePreview.innerHTML = templateHTML;
        }
    };
}); 