class Terminal {
  constructor() {
    this.outputElement = document.getElementById('terminal-output');
    this.inputElement = document.getElementById('terminal-input');
    this.promptElement = document.getElementById('prompt');
    this.jsonLdElement = document.getElementById('json-ld-schema');
    this.terminalContainer = document.getElementById('terminal-container');
    this.inputLine = document.getElementById('input-line');
    
    this.commandHistory = [];
    this.historyIndex = -1;
    this.availableCommands = [];
    this.content = {};
    
    this.init();
  }
  
  async init() {
    // Load content
    await this.loadContent();
    
    // Set up event listeners
    this.inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('resize', this.scrollToBottom.bind(this));
    
    // Apply theme
    this.applyTheme();
    
    // Display banner
    this.displayBanner();
    
    // Recreate input line after banner
    this.recreateInputLine();
    
    // Focus input
    this.inputElement.focus();
    
    // Set up JSON-LD schema
    this.setupJsonLdSchema();
    
    // Initialize 3D mouse tracking
    this.init3DEffects();
  }
  
  async loadContent() {
    try {
      console.log('Loading content from ./data/content.json...');
      const response = await fetch('./data/content.json');
      console.log('Response status:', response.status);
      this.content = await response.json();
      console.log('Content loaded:', this.content);
      
      // Update page title and meta description
      document.title = this.content.meta.title;
      document.querySelector('meta[name="description"]').content = this.content.meta.description;
      
      // Update prompt
      console.log('Updating prompt to:', this.content.prompt);
      this.promptElement.textContent = this.content.prompt;
      
      // Extract available commands
      this.availableCommands = Object.keys(this.content.commands);
      this.availableCommands.push('help', 'clear', 'settings');
    } catch (error) {
      console.error('Error loading content:', error);
      this.printLine('Error loading content. Please refresh the page.', 'error');
    }
  }
  
  applyTheme() {
    const { theme } = this.content;
    
    // Apply color theme
    if (theme.color === 'green' || theme.color === 'amber' || theme.color === 'white') {
      document.documentElement.setAttribute('data-theme', theme.color);
    } else {
      // Custom color
      document.documentElement.style.setProperty('--term-color', theme.color);
    }
    
    // Apply CRT effects
    document.documentElement.style.setProperty('--crt-curve', theme.crtCurvature ? '1' : '0');
    document.documentElement.style.setProperty('--scanlines-opacity', theme.scanlines ? '0.1' : '0');
    document.documentElement.style.setProperty('--flicker-opacity', theme.flicker);
  }
  
  setupJsonLdSchema() {
    const { commands, meta } = this.content;
    const { about, skills, experience, education, contact } = commands;
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": meta.title.split(' — ')[0],
      "description": meta.description,
      "url": window.location.href,
      "knowsAbout": skills.list.map(skill => skill.name),
      "alumniOf": education.map(edu => ({
        "@type": "EducationalOrganization",
        "name": edu.institution
      })),
      "hasOccupation": experience.map(exp => ({
        "@type": "Occupation",
        "name": exp.position,
        "description": exp.description
      })),
      "email": contact.email,
      "sameAs": Object.values(contact.links)
    };
    
    this.jsonLdElement.textContent = JSON.stringify(schema);
  }
  
  displayBanner() {
    const { banner } = this.content;
    
    if (banner.asciiArt) {
      this.printLine(banner.asciiArt, 'ascii-art');
    }
    
    if (banner.subtitle) {
      this.printLine(banner.subtitle, 'subtitle');
    }
    
    this.printLine('');
    this.printLine(`Type 'help' for available commands.`);
    this.printLine('');
  }
  
  handleKeyDown(event) {
    const input = this.inputElement;
    
    // Handle tab completion
    if (event.key === 'Tab') {
      event.preventDefault();
      this.handleTabCompletion();
      return;
    }
    
    // Handle command history
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateHistory(-1);
      return;
    }
    
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateHistory(1);
      return;
    }
    
    // Handle command execution
    if (event.key === 'Enter') {
      event.preventDefault();
      const command = input.value.trim();
      
      // Don't display the command line in output - it stays at the bottom
      // Only execute if there's a command
      if (command) {
        // Add to history
        this.commandHistory.unshift(command);
        if (this.commandHistory.length > 50) {
          this.commandHistory.pop();
        }
        this.historyIndex = -1;
        
        // Execute command
        this.executeCommand(command);
      }
      
      // Clear input and recreate input line at the bottom
      input.value = '';
      this.recreateInputLine();
      return;
    }
  }
  
  handleTabCompletion() {
    const input = this.inputElement;
    const value = input.value.trim();
    
    if (!value) return;
    
    const matches = this.availableCommands.filter(cmd => cmd.startsWith(value));
    
    if (matches.length === 1) {
      input.value = matches[0];
    } else if (matches.length > 1) {
      // Show possible completions
      this.printLine('');
      this.printLine(matches.join('  '));
      this.printLine('');
    }
  }
  
  navigateHistory(direction) {
    const historyLength = this.commandHistory.length;
    
    if (historyLength === 0) return;
    
    if (direction === -1) { // Up
      if (this.historyIndex < historyLength - 1) {
        this.historyIndex++;
      }
    } else { // Down
      if (this.historyIndex > 0) {
        this.historyIndex--;
      } else if (this.historyIndex === 0) {
        this.historyIndex = -1;
        this.inputElement.value = '';
        return;
      }
    }
    
    this.inputElement.value = this.commandHistory[this.historyIndex];
  }
  
  executeCommand(command) {
    const [cmd, ...args] = command.toLowerCase().split(' ');
    
    switch (cmd) {
      case 'help':
        this.showHelp();
        break;
      case 'clear':
        this.clearTerminal();
        break;
      case 'settings':
        this.openSettings();
        break;
      default:
        if (cmd === 'certifications' || cmd === 'awards') {
          this.displaySpecialContent(cmd);
        } else if (this.content.commands[cmd]) {
          this.displayCommandContent(cmd, args);
        } else {
          this.printLine(`Command not found: ${cmd}`, 'error');
          this.printLine(`Type 'help' for available commands.`);
        }
        break;
    }
  }
  
  showHelp() {
    this.printLine('');
    this.printLine('Available commands:', 'section-title');
    
    this.availableCommands.forEach(cmd => {
      if (cmd !== 'help' && cmd !== 'clear' && cmd !== 'settings') {
        this.printLine(`  ${cmd}`, 'help-item');
      }
    });
    
    this.printLine('');
    this.printLine('  clear    - Clear the terminal screen');
    this.printLine('  settings - Open settings panel');
    this.printLine('');
  }
  
  clearTerminal() {
    this.outputElement.innerHTML = '';
    this.recreateInputLine();
  }
  
  openSettings() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'flex';
    
    // Trigger settings form generation
    const event = new CustomEvent('openSettings', { detail: this.content });
    document.dispatchEvent(event);
  }
  
  displayCommandContent(command, args) {
    const cmdData = this.content.commands[command];
    
    if (!cmdData) return;
    
    this.printLine('');
    
    if (cmdData.title) {
      this.printLine(cmdData.title, 'section-title');
    }
    
    if (cmdData.content) {
      this.printLine(cmdData.content);
    }
    
    if (cmdData.list) {
      cmdData.list.forEach(item => {
        this.printLine('');
        
        const skillBar = document.createElement('div');
        skillBar.className = 'skill-bar';
        skillBar.innerHTML = `
          <span class="skill-name">${item.name}</span>
          <div class="skill-level" style="--level: ${item.level}%"></div>
        `;
        
        this.outputElement.appendChild(skillBar);
      });
    }
    
    if (Array.isArray(cmdData)) {
      cmdData.forEach(item => {
        this.printLine('');
        
        if (item.name) {
          this.printLine(item.name, 'project-name');
        }
        
        if (item.tagline) {
          this.printLine(item.tagline, 'project-tagline');
        }
        
        if (item.description) {
          this.printLine(item.description);
        }
        
        if (item.url) {
          this.printLine(`URL: ${item.url}`);
        }
        
        if (item.tech) {
          this.printLine(`Tech: ${item.tech.join(', ')}`, 'project-tech');
        }
        
        if (item.period) {
          this.printLine(item.period, 'period');
        }
        
        if (item.position) {
          this.printLine(item.position, 'position');
        }
        
        if (item.company) {
          this.printLine(item.company, 'company-name');
        }
        
        if (item.institution) {
          this.printLine(item.institution, 'institution-name');
        }
        
        if (item.degree) {
          this.printLine(item.degree, 'degree');
        }
      });
    }
    
    if (command === 'contact') {
      this.printLine('');
      this.printLine(`Email: ${cmdData.email}`);
      
      if (cmdData.links) {
        const linksDiv = document.createElement('div');
        linksDiv.className = 'contact-links';
        
        Object.entries(cmdData.links).forEach(([platform, url]) => {
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.textContent = platform;
          linksDiv.appendChild(link);
        });
        
        this.outputElement.appendChild(linksDiv);
      }
    }
    
    this.printLine('');
  }
  
  // Handle special commands that are not in the commands object
  displaySpecialContent(command) {
    if (command === 'certifications') {
      const certData = this.content.commands.certifications;
      if (!certData) return;
      
      this.printLine('');
      this.printLine(certData.title, 'section-title');
      
      // Create container for certifications
      const certList = document.createElement('div');
      certList.className = 'certification-list';
      
      certData.list.forEach(item => {
        const certItem = document.createElement('div');
        certItem.className = 'certification-item';
        
        const badge = document.createElement('div');
        badge.className = 'certification-badge';
        
        const info = document.createElement('div');
        info.className = 'certification-info';
        
        const name = document.createElement('div');
        name.className = 'certification-name';
        name.textContent = item.name;
        
        const date = document.createElement('div');
        date.className = 'certification-date';
        date.textContent = item.date;
        
        info.appendChild(name);
        info.appendChild(date);
        certItem.appendChild(badge);
        certItem.appendChild(info);
        certList.appendChild(certItem);
      });
      
      this.outputElement.appendChild(certList);
      this.printLine('');
      
      // Scroll to bottom after adding content
      requestAnimationFrame(() => {
        this.scrollToBottom();
      });
      
    } else if (command === 'awards') {
      const awardsData = this.content.commands.awards;
      if (!awardsData) return;
      
      this.printLine('');
      this.printLine(awardsData.title, 'section-title');
      
      // Create container for awards
      const awardList = document.createElement('div');
      awardList.className = 'award-list';
      
      awardsData.list.forEach(item => {
        const awardItem = document.createElement('div');
        awardItem.className = 'award-item';
        
        const badge = document.createElement('div');
        badge.className = 'award-badge';
        
        const info = document.createElement('div');
        info.className = 'award-info';
        
        const name = document.createElement('div');
        name.className = 'award-name';
        name.textContent = item.name;
        
        const period = document.createElement('div');
        period.className = 'award-period';
        period.textContent = item.period;
        
        info.appendChild(name);
        info.appendChild(period);
        awardItem.appendChild(badge);
        awardItem.appendChild(info);
        awardList.appendChild(awardItem);
      });
      
      this.outputElement.appendChild(awardList);
      this.printLine('');
      
      // Scroll to bottom after adding content
      requestAnimationFrame(() => {
        this.scrollToBottom();
      });
    }
  }
  
  printLine(text, className = '') {
    const line = document.createElement('div');
    if (className) {
      line.className = className;
    }
    
    // Typewriter effect
    if (text) {
      this.typeWriter(line, text);
    } else {
      this.outputElement.appendChild(line);
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        this.scrollToBottom();
      });
    }
  }
  
  typeWriter(element, text, speed = 10) {
    this.outputElement.appendChild(element);
    this.scrollToBottom();
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          this.scrollToBottom();
        });
      } else {
        clearInterval(timer);
        // Final scroll to ensure we're at the bottom
        this.scrollToBottom();
      }
    }, speed);
  }
  
  scrollToBottom() {
    // Use smooth scrolling behavior
    this.terminalContainer.scrollTo({
      top: this.terminalContainer.scrollHeight,
      behavior: 'smooth'
    });
  }

  recreateInputLine() {
    // Remove existing input line
    const existingInputLine = document.getElementById('input-line');
    if (existingInputLine) {
      existingInputLine.remove();
    }

    // Create new input line
    const newInputLine = document.createElement('div');
    newInputLine.id = 'input-line';
    newInputLine.className = 'input-line';
    
    // Create prompt span
    const promptSpan = document.createElement('span');
    promptSpan.id = 'prompt';
    promptSpan.className = 'prompt';
    promptSpan.textContent = this.content.prompt;
    
    // Create input element
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.id = 'terminal-input';
    inputElement.className = 'terminal-input';
    inputElement.autocomplete = 'off';
    inputElement.spellcheck = false;
    
    // Add event listener to new input
    inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Append elements
    newInputLine.appendChild(promptSpan);
    newInputLine.appendChild(inputElement);
    
    // Add to output
    this.outputElement.appendChild(newInputLine);
    
    // Update references
    this.inputElement = inputElement;
    this.promptElement = promptSpan;
    this.inputLine = newInputLine;
    
    // Focus the new input
    inputElement.focus();
    
    // Scroll to bottom
    this.scrollToBottom();
  }
  
  init3DEffects() {
    const crtScreen = document.querySelector('.crt-screen');
    if (!crtScreen) return;
    
    let isMouseOver = false;
    let mouseX = 0;
    let mouseY = 0;
    
    // Mouse enter event
    crtScreen.addEventListener('mouseenter', () => {
      isMouseOver = true;
      crtScreen.classList.add('mouse-track');
    });
    
    // Mouse leave event
    crtScreen.addEventListener('mouseleave', () => {
      isMouseOver = false;
      crtScreen.classList.remove('mouse-track');
      
      // Reset to original position
      const crtCurve = getComputedStyle(document.documentElement).getPropertyValue('--crt-curve') || '1';
      crtScreen.style.transform = `rotateX(calc(${crtCurve} * 3deg))`;
      crtScreen.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.25)';
    });
    
    // Mouse move event
    crtScreen.addEventListener('mousemove', (event) => {
      if (!isMouseOver) return;
      
      const rect = crtScreen.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to center (-1 to 1)
      mouseX = (event.clientX - centerX) / (rect.width / 2);
      mouseY = (event.clientY - centerY) / (rect.height / 2);
      
      // Clamp values to prevent extreme rotations
      mouseX = Math.max(-1, Math.min(1, mouseX));
      mouseY = Math.max(-1, Math.min(1, mouseY));
      
      // Apply subtle 3D rotation based on mouse position
      const rotateY = mouseX * 3; // Max 3 degrees
      const rotateX = -mouseY * 2; // Max 2 degrees (negative for natural feel)
      const crtCurve = getComputedStyle(document.documentElement).getPropertyValue('--crt-curve') || '1';
      
      // Combine CRT curve with mouse tracking
      const baseRotateX = parseFloat(crtCurve) * 3;
      const finalRotateX = baseRotateX + rotateX;
      
      crtScreen.style.transform = `rotateX(${finalRotateX}deg) rotateY(${rotateY}deg)`;
      
      // Subtle shadow adjustment
      const shadowIntensity = 0.25 + (Math.abs(mouseX) + Math.abs(mouseY)) * 0.1;
      crtScreen.style.boxShadow = `0 0 ${30 + Math.abs(mouseX + mouseY) * 10}px rgba(0, 255, 0, ${shadowIntensity})`;
    });
  }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const terminal = new Terminal();
  
  // Handle settings save
  document.addEventListener('settingsSaved', (event) => {
    terminal.content = event.detail;
    terminal.applyTheme();
    terminal.setupJsonLdSchema();
    terminal.clearTerminal();
    terminal.displayBanner();
    terminal.recreateInputLine();
  });
});