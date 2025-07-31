class SettingsManager {
  constructor() {
    this.modal = document.getElementById('settings-modal');
    this.formContainer = document.getElementById('settings-form-container');
    this.closeBtn = document.getElementById('close-settings');
    this.saveBtn = document.getElementById('save-settings');
    this.cancelBtn = document.getElementById('cancel-settings');
    
    this.content = null;
    
    this.init();
  }
  
  init() {
    // Set up event listeners
    this.closeBtn.addEventListener('click', this.closeSettings.bind(this));
    this.cancelBtn.addEventListener('click', this.closeSettings.bind(this));
    this.saveBtn.addEventListener('click', this.saveSettings.bind(this));
    
    // Close modal when clicking outside
    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.closeSettings();
      }
    });
    
    // Listen for open settings event
    document.addEventListener('openSettings', (event) => {
      this.content = event.detail;
      this.generateSettingsForm();
    });
  }
  
  generateSettingsForm() {
    if (!this.content) return;
    
    this.formContainer.innerHTML = '';
    
    // Meta settings
    this.addSection('Meta Information');
    this.addTextInput('meta.title', 'Page Title', this.content.meta.title);
    this.addTextInput('meta.description', 'Description', this.content.meta.description);
    
    // Theme settings
    this.addSection('Theme Settings');
    this.addThemeSelector('theme.color', 'Color Theme', this.content.theme.color);
    this.addToggle('theme.crtCurvature', 'CRT Curvature', this.content.theme.crtCurvature);
    this.addToggle('theme.scanlines', 'Scanlines', this.content.theme.scanlines);
    this.addRange('theme.flicker', 'Flicker Intensity', this.content.theme.flicker, 0, 1, 0.05);
    
    // Prompt setting
    this.addSection('Terminal Settings');
    this.addTextInput('prompt', 'Command Prompt', this.content.prompt);
    
    // Banner settings
    this.addSection('Banner');
    this.addTextarea('banner.asciiArt', 'ASCII Art', this.content.banner.asciiArt);
    this.addTextInput('banner.subtitle', 'Subtitle', this.content.banner.subtitle);
    
    // Command content
    this.addSection('Command Content');
    
    // About
    this.addSubsection('About');
    this.addTextInput('commands.about.title', 'Title', this.content.commands.about.title);
    this.addTextarea('commands.about.content', 'Content', this.content.commands.about.content);
    
    // Skills
    this.addSubsection('Skills');
    this.addTextInput('commands.skills.title', 'Title', this.content.commands.skills.title);
    this.addDynamicList('commands.skills.list', 'Skills', this.content.commands.skills.list, 
      ['name', 'level'], ['Skill Name', 'Level (0-100)']);
    
    // Projects
    this.addSubsection('Projects');
    this.addDynamicList('commands.projects', 'Projects', this.content.commands.projects,
      ['name', 'tagline', 'url', 'tech'], 
      ['Project Name', 'Tagline', 'URL', 'Technologies (comma-separated)']);
    
    // Experience
    this.addSubsection('Experience');
    this.addDynamicList('commands.experience', 'Experience', this.content.commands.experience,
      ['company', 'position', 'period', 'description'],
      ['Company', 'Position', 'Period', 'Description']);
    
    // Education
    this.addSubsection('Education');
    this.addDynamicList('commands.education', 'Education', this.content.commands.education,
      ['institution', 'degree', 'period'],
      ['Institution', 'Degree', 'Period']);
    
    // Contact
    this.addSubsection('Contact');
    this.addTextInput('commands.contact.email', 'Email', this.content.commands.contact.email);
    this.addDynamicObject('commands.contact.links', 'Links', this.content.commands.contact.links,
      ['Platform', 'URL']);
  }
  
  addSection(title) {
    const section = document.createElement('div');
    section.className = 'form-section';
    section.innerHTML = `<h3>${title}</h3>`;
    this.formContainer.appendChild(section);
  }
  
  addSubsection(title) {
    const subsection = document.createElement('div');
    subsection.className = 'form-subsection';
    subsection.innerHTML = `<h4>${title}</h4>`;
    this.formContainer.appendChild(subsection);
  }
  
  addTextInput(name, label, value) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.id = name;
    input.name = name;
    input.value = value;
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = name;
    labelElement.textContent = label;
    
    group.appendChild(labelElement);
    group.appendChild(input);
    this.formContainer.appendChild(group);
  }
  
  addTextarea(name, label, value) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const textarea = document.createElement('textarea');
    textarea.id = name;
    textarea.name = name;
    textarea.value = value;
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = name;
    labelElement.textContent = label;
    
    group.appendChild(labelElement);
    group.appendChild(textarea);
    this.formContainer.appendChild(group);
  }
  
  addToggle(name, label, value) {
    const group = document.createElement('div');
    group.className = 'toggle-group form-group';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = name;
    input.name = name;
    input.checked = value;
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = name;
    labelElement.textContent = label;
    
    group.appendChild(input);
    group.appendChild(labelElement);
    this.formContainer.appendChild(group);
  }
  
  addRange(name, label, value, min, max, step) {
    const group = document.createElement('div');
    group.className = 'range-group form-group';
    
    const input = document.createElement('input');
    input.type = 'range';
    input.id = name;
    input.name = name;
    input.value = value;
    input.min = min;
    input.max = max;
    input.step = step;
    
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = value;
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = name;
    labelElement.textContent = label;
    
    input.addEventListener('input', () => {
      valueDisplay.textContent = input.value;
    });
    
    group.appendChild(labelElement);
    group.appendChild(input);
    group.appendChild(valueDisplay);
    this.formContainer.appendChild(group);
  }
  
  addThemeSelector(name, label, value) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    
    const selector = document.createElement('div');
    selector.className = 'theme-selector';
    
    const themes = [
      { value: 'green', class: 'theme-green' },
      { value: 'amber', class: 'theme-amber' },
      { value: 'white', class: 'theme-white' }
    ];
    
    themes.forEach(theme => {
      const option = document.createElement('div');
      option.className = `theme-option ${theme.class}`;
      if (theme.value === value) {
        option.classList.add('active');
      }
      
      option.addEventListener('click', () => {
        document.querySelectorAll('.theme-option').forEach(opt => {
          opt.classList.remove('active');
        });
        option.classList.add('active');
        
        // Update hidden input value
        const hiddenInput = document.getElementById(name);
        if (!hiddenInput) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.id = name;
          input.name = name;
          input.value = theme.value;
          group.appendChild(input);
        } else {
          hiddenInput.value = theme.value;
        }
      });
      
      selector.appendChild(option);
    });
    
    // Add hidden input with current value
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = name;
    hiddenInput.name = name;
    hiddenInput.value = value;
    
    group.appendChild(labelElement);
    group.appendChild(selector);
    group.appendChild(hiddenInput);
    this.formContainer.appendChild(group);
  }
  
  addDynamicList(name, label, items, fields, fieldLabels) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    
    const container = document.createElement('div');
    container.className = 'dynamic-list-container';
    
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn';
    addButton.textContent = `Add ${label.slice(0, -1)}`;
    addButton.addEventListener('click', () => {
      this.addListItem(container, name, fields, fieldLabels, {});
    });
    
    group.appendChild(labelElement);
    group.appendChild(container);
    group.appendChild(addButton);
    this.formContainer.appendChild(group);
    
    // Add existing items
    items.forEach(item => {
      this.addListItem(container, name, fields, fieldLabels, item);
    });
  }
  
  addListItem(container, listName, fields, fieldLabels, item = {}) {
    const index = container.children.length;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'dynamic-list-item';
    
    fields.forEach((field, fieldIndex) => {
      const fieldGroup = document.createElement('div');
      fieldGroup.className = 'form-group';
      
      const fieldLabel = document.createElement('label');
      fieldLabel.textContent = fieldLabels[fieldIndex];
      
      const fieldInput = document.createElement('input');
      fieldInput.type = 'text';
      fieldInput.name = `${listName}[${index}].${field}`;
      fieldInput.value = item[field] || '';
      
      if (field === 'tech') {
        // Join array with commas
        fieldInput.value = Array.isArray(item[field]) ? item[field].join(', ') : (item[field] || '');
      }
      
      fieldGroup.appendChild(fieldLabel);
      fieldGroup.appendChild(fieldInput);
      itemDiv.appendChild(fieldGroup);
    });
    
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'btn';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      container.removeChild(itemDiv);
      this.updateListIndices(container, listName);
    });
    
    itemDiv.appendChild(removeButton);
    container.appendChild(itemDiv);
  }
  
  updateListIndices(container, listName) {
    Array.from(container.children).forEach((item, index) => {
      Array.from(item.querySelectorAll('input')).forEach(input => {
        const match = input.name.match(new RegExp(`${listName}\\[(\\d+)\\]`));
        if (match) {
          input.name = input.name.replace(match[0], `${listName}[${index}]`);
        }
      });
    });
  }
  
  addDynamicObject(name, label, obj, fieldLabels) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    
    const container = document.createElement('div');
    container.className = 'dynamic-object-container';
    
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn';
    addButton.textContent = `Add ${label.slice(0, -1)}`;
    addButton.addEventListener('click', () => {
      this.addObjectItem(container, name, fieldLabels, {});
    });
    
    group.appendChild(labelElement);
    group.appendChild(container);
    group.appendChild(addButton);
    this.formContainer.appendChild(group);
    
    // Add existing items
    Object.entries(obj).forEach(([key, value]) => {
      this.addObjectItem(container, name, fieldLabels, { [fieldLabels[0]]: key, [fieldLabels[1]]: value });
    });
  }
  
  addObjectItem(container, objectName, fieldLabels, item = {}) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'dynamic-object-item';
    
    fieldLabels.forEach((fieldLabel, index) => {
      const fieldGroup = document.createElement('div');
      fieldGroup.className = 'form-group';
      
      const label = document.createElement('label');
      label.textContent = fieldLabel;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `${objectName}.${fieldLabel}`;
      input.value = item[fieldLabel] || '';
      
      fieldGroup.appendChild(label);
      fieldGroup.appendChild(input);
      itemDiv.appendChild(fieldGroup);
    });
    
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'btn';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      container.removeChild(itemDiv);
    });
    
    itemDiv.appendChild(removeButton);
    container.appendChild(itemDiv);
  }
  
  closeSettings() {
    this.modal.style.display = 'none';
  }
  
  async saveSettings() {
    if (!this.content) return;
    
    try {
      // Collect form data
      const formData = new FormData();
      const inputs = this.formContainer.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        if (input.type === 'checkbox') {
          formData.append(input.name, input.checked);
        } else {
          formData.append(input.name, input.value);
        }
      });
      
      // Update content object
      const updatedContent = this.parseFormData(formData);
      
      // Save to server (in a real app, this would be an API call)
      const response = await fetch('./data/content.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedContent, null, 2)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      // Dispatch event with updated content
      const event = new CustomEvent('settingsSaved', { detail: updatedContent });
      document.dispatchEvent(event);
      
      // Close settings
      this.closeSettings();
      
      // Show success message
      const terminal = document.querySelector('#terminal-output');
      const successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      successMsg.textContent = 'Settings saved successfully!';
      terminal.appendChild(successMsg);
      
      // Scroll to bottom
      const container = document.querySelector('.terminal-container');
      container.scrollTop = container.scrollHeight;
      
    } catch (error) {
      console.error('Error saving settings:', error);
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.textContent = 'Error saving settings. Please try again.';
      this.formContainer.prepend(errorMsg);
    }
  }
  
  parseFormData(formData) {
    const content = JSON.parse(JSON.stringify(this.content)); // Deep clone
    
    // Process simple fields
    for (const [key, value] of formData.entries()) {
      if (key.includes('.')) {
        const keys = key.split('.');
        let obj = content;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) {
            obj[keys[i]] = {};
          }
          obj = obj[keys[i]];
        }
        
        // Handle special cases
        if (keys[keys.length - 1] === 'crtCurvature' || 
            keys[keys.length - 1] === 'scanlines') {
          obj[keys[keys.length - 1]] = value === 'true';
        } else if (keys[keys.length - 1] === 'flicker') {
          obj[keys[keys.length - 1]] = parseFloat(value);
        } else if (keys[keys.length - 1] === 'tech') {
          // Convert comma-separated string to array
          obj[keys[keys.length - 1]] = value.split(',').map(item => item.trim());
        } else {
          obj[keys[keys.length - 1]] = value;
        }
      }
    }
    
    // Process array fields (projects, skills, experience, education)
    const arrayFields = ['commands.projects', 'commands.skills.list', 'commands.experience', 'commands.education'];
    
    arrayFields.forEach(fieldPath => {
      const keys = fieldPath.split('.');
      let parent = content;
      
      for (let i = 0; i < keys.length - 1; i++) {
        parent = parent[keys[i]];
      }
      
      const fieldName = keys[keys.length - 1];
      const items = [];
      
      // Find all inputs for this array
      const inputs = this.formContainer.querySelectorAll(`input[name^="${fieldPath}["]`);
      
      // Group by index
      const indices = new Set();
      inputs.forEach(input => {
        const match = input.name.match(new RegExp(`${fieldPath}\\[(\\d+)\\]`));
        if (match) {
          indices.add(parseInt(match[1]));
        }
      });
      
      // Build items
      indices.forEach(index => {
        const item = {};
        
        inputs.forEach(input => {
          const match = input.name.match(new RegExp(`${fieldPath}\\[${index}\\]\\.([^\\[\\]]+)`));
          if (match) {
            const field = match[1];
            
            if (field === 'level') {
              item[field] = parseInt(input.value);
            } else if (field === 'tech') {
              item[field] = input.value.split(',').map(item => item.trim());
            } else {
              item[field] = input.value;
            }
          }
        });
        
        if (Object.keys(item).length > 0) {
          items.push(item);
        }
      });
      
      parent[fieldName] = items;
    });
    
    // Process object fields (contact links)
    const links = {};
    const linkInputs = this.formContainer.querySelectorAll('input[name^="commands.contact.links."]');
    
    linkInputs.forEach(input => {
      const platform = input.name.split('.').pop();
      if (platform === 'Platform') {
        const urlInput = this.formContainer.querySelector(`input[name="commands.contact.links.URL"][data-platform="${input.value}"]`);
        if (urlInput) {
          links[input.value] = urlInput.value;
        }
      }
    });
    
    content.commands.contact.links = links;
    
    return content;
  }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const settingsManager = new SettingsManager();
}); 