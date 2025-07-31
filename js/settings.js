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
    this.addTextInput('banner.subtitle', 'Subtitle', this.content.banner.subtitle);
  }
  
  addSection(title) {
    const section = document.createElement('div');
    section.className = 'form-section';
    section.innerHTML = `<h3>${title}</h3>`;
    this.formContainer.appendChild(section);
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
  
  closeSettings() {
    this.modal.style.display = 'none';
  }
  
  saveSettings() {
    if (!this.content) return;
    
    try {
      // Collect form data
      const inputs = this.formContainer.querySelectorAll('input, textarea');
      const updatedContent = JSON.parse(JSON.stringify(this.content)); // Deep clone
      
      inputs.forEach(input => {
        if (input.name.includes('.')) {
          const keys = input.name.split('.');
          let obj = updatedContent;
          
          for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) {
              obj[keys[i]] = {};
            }
            obj = obj[keys[i]];
          }
          
          // Handle special cases
          if (keys[keys.length - 1] === 'crtCurvature' || 
              keys[keys.length - 1] === 'scanlines') {
            obj[keys[keys.length - 1]] = input.type === 'checkbox' ? input.checked : input.value === 'true';
          } else if (keys[keys.length - 1] === 'flicker') {
            obj[keys[keys.length - 1]] = parseFloat(input.value);
          } else {
            obj[keys[keys.length - 1]] = input.value;
          }
        }
      });
      
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
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const settingsManager = new SettingsManager();
}); 