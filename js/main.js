/* ===================================================================
   Kundan Kumar Jha - Portfolio Scripts
   Interactive Features, Terminal CLI, Dynamic Filters, Theme Switcher
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initTypewriter();
  initStatsCounter();
  initSkillsFilter();
  initTerminal();
  initClipboard();
  initContactForm();
  initModals();
  initChatbot();
});

/* -------------------------------------------------------------------
   1. Theme Management (Dark / Light)
------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('kj_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('kj_portfolio_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme.toUpperCase()} mode`);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggleBtn i');
  if (!icon) return;
  if (theme === 'light') {
    icon.className = 'fa-solid fa-moon';
  } else {
    icon.className = 'fa-solid fa-sun';
  }
}

/* -------------------------------------------------------------------
   2. Navbar, Mobile Drawer & ScrollSpy
------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close when clicking nav link
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Back to top button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* -------------------------------------------------------------------
   3. Typewriter Effect
------------------------------------------------------------------- */
function initTypewriter() {
  const roleEl = document.getElementById('typewriterText');
  if (!roleEl) return;

  const roles = [
    "Full Stack Developer (4+ Yrs)",
    ".NET Core & Java Spring Boot",
    "AWS & Azure Cloud Certified",
    "Banking, Finance & Steel Systems",
    "Based in Mumbai, India 📍"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseEnd = 1600;

  function type() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      roleEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(type, pauseEnd);
        return;
      }
    } else {
      roleEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  type();
}

/* -------------------------------------------------------------------
   4. Animated Stats Counter
------------------------------------------------------------------- */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1800; // ms
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = Math.ceil(target / totalSteps);

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              counter.textContent = target + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = count + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('statsSection');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* -------------------------------------------------------------------
   5. Skills Category Filtering
------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* -------------------------------------------------------------------
   6. Interactive Terminal ("Kundan CLI")
------------------------------------------------------------------- */
function initTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const hintPills = document.querySelectorAll('.hint-pill');

  if (!terminalInput || !terminalOutput) return;

  const commands = {
    help: () => [
      '<span class="terminal-line info">Available commands:</span>',
      '  <span class="terminal-line success">about</span>          - Intro & current location (Mumbai, India)',
      '  <span class="terminal-line success">clients</span>        - Marquee clients (Zurich NA, L&T, Star Union Dai-ichi)',
      '  <span class="terminal-line success">domains</span>        - Industry domain experience (Banking, Finance, Steel)',
      '  <span class="terminal-line success">skills</span>         - Core tech stack (.NET, Java, Spring Boot, Python, Cloud)',
      '  <span class="terminal-line success">exp</span>            - Professional work timeline & positions',
      '  <span class="terminal-line success">projects</span>       - Key enterprise architectures & projects',
      '  <span class="terminal-line success">certs</span>          - AWS CLF-C02 & Azure AZ-900 credentials',
      '  <span class="terminal-line success">contact</span>        - WhatsApp (+91 9572167459), LinkedIn & email',
      '  <span class="terminal-line success">resume</span>         - Open printable resume modal',
      '  <span class="terminal-line success">sudo hire</span>      - Recruiter shortcut',
      '  <span class="terminal-line success">clear</span>          - Clear terminal window'
    ].join('<br>'),

    about: () => [
      '<span class="terminal-line info">Kundan Kumar Jha</span>',
      'Role: Executive – Full Stack Developer at Softenger',
      'Location: <b>Mumbai, India 📍</b> | Experience: 4+ Years',
      'Domains: Banking, Corporate Finance, Steel Manufacturing',
      'Clients: Zurich NA, Larsen & Toubro (L&T), Star Union Dai-ichi Bank',
      'Core Stack: C#, .NET Core, Java, Spring Boot, Python, React.js, Azure & AWS'
    ].join('<br>'),

    clients: () => [
      '<span class="terminal-line info">Marquee Enterprise Clients:</span>',
      '  1. <span class="terminal-line success">Zurich NA (Zurich North America)</span>: Insurance & Financial Risk APIs, compliance architectures.',
      '  2. <span class="terminal-line success">Larsen & Toubro (L&T)</span>: Industrial digitization & high-speed telemetry (10k+ records <2 mins).',
      '  3. <span class="terminal-line success">Star Union Dai-ichi Bank / Life</span>: Month-end Python schedulers (One Click), Policy lookup APIs, JWT auth.'
    ].join('<br>'),

    domains: () => [
      '<span class="terminal-line info">Industry Domain Expertise:</span>',
      '  • <span class="terminal-line success">Banking Domain</span>: Customer onboarding, mobile policy lookups, JWT token auth, secure transactions.',
      '  • <span class="terminal-line success">Finance Domain</span>: 23-department budget planning systems, automated month-end batch processing, audit ledgers.',
      '  • <span class="terminal-line success">Steel Manufacturing</span>: Shop-floor digitization, industrial energy tracking of 10,000+ records in &lt; 2 minutes.'
    ].join('<br>'),

    skills: () => [
      '<span class="terminal-line info">Core Technical Proficiencies:</span>',
      '  • Languages: C#, Java, Python, SQL, JavaScript, TypeScript',
      '  • Frameworks: ASP.NET Core, .NET MVC, Spring Boot, Entity Framework, LINQ, React.js',
      '  • Cloud & DevOps: Microsoft Azure (AZ-900), Amazon AWS (CLF-C02), Blob Storage, Power BI, IIS, Git',
      '  • Database & Security: SQL Server, JWT Token Authentication, RESTful APIs, Swagger/OpenAPI'
    ].join('<br>'),

    exp: () => [
      '<span class="terminal-line info">Experience Timeline:</span>',
      '  1. <span class="terminal-line success">Softenger</span> (Feb 2026 – Present) | Executive Full Stack Developer',
      '     - Clients: Star Union Dai-ichi, Zurich NA | Python Schedulers, .NET APIs, PBI Embed, React.',
      '  2. <span class="terminal-line success">Anantkaal LLP</span> (Aug 2024 – Feb 2026) | .NET Developer',
      '     - Clients: Larsen & Toubro (L&T) | Energy Management (10k+ records <2 mins), Steel Digitalization, 23 Dept Budget.',
      '  3. <span class="terminal-line success">DXC Technology</span> (Jun 2022 – Jul 2024) | Analyst II Software Engineer',
      '     - Modernized 12 enterprise apps to ASP.NET Core & IIS, RESTful APIs, SDLC compliance.'
    ].join('<br>'),

    projects: () => [
      '<span class="terminal-line info">Featured Engineering Systems:</span>',
      '  • <b>One Click</b>: Month-end automated scheduler processing LA, Group, Retail data.',
      '  • <b>Energy Management Platform</b>: High-speed analytics processing 10k+ records <2 mins for manufacturing plants.',
      '  • <b>Power BI Embed Gateway</b>: Secure Azure middleware for dynamic client analytics.',
      '  • <b>Prospector Module</b>: Python + React.js + Azure Blob recommendation platform.',
      '  • <b>Budget Management System</b>: Web app automating finance for 23 corporate departments.',
      '  • <b>Pizza & Beverage Order System</b>: Menu & billing management in .NET MVC.'
    ].join('<br>'),

    certs: () => [
      '<span class="terminal-line info">Certifications & Honors:</span>',
      '  [✓] Amazon Certified Cloud Practitioner (CLF-C02)',
      '  [✓] Microsoft Certified: Azure Fundamentals (AZ-900)',
      '  [✓] Web Development Using .NET Specialist',
      '  [🏆] National Level Hackathon Winner – Smart India Hackathon'
    ].join('<br>'),

    contact: () => [
      '<span class="terminal-line info">Connect With Kundan (Mumbai, India):</span>',
      '  • WhatsApp: <a href="https://wa.me/919572167459" target="_blank" class="terminal-line success">+91 9572167459 (Click to Chat)</a>',
      '  • Email: <a href="mailto:jhakundan986@gmail.com" class="terminal-line warning">jhakundan986@gmail.com</a>',
      '  • Phone: <a href="tel:+919572167459" class="terminal-line warning">+91 9572167459</a>',
      '  • LinkedIn: <a href="https://www.linkedin.com/in/kundan-jha-75ba19190" target="_blank" class="terminal-line info">linkedin.com/in/kundan-jha-75ba19190</a>',
      '  • Current Location: Mumbai, India 📍'
    ].join('<br>'),

    resume: () => {
      openResumeModal();
      return '<span class="terminal-line success">Opening resume viewer modal...</span>';
    },

    'sudo hire': () => {
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      return '<span class="terminal-line success">🎉 Access Granted: Superuser authorized! Routing to contact section now...</span>';
    },

    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    }
  };

  // Handle Enter key
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawInput = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';
      executeCommand(rawInput);
    }
  });

  // Hint pills click
  hintPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  function executeCommand(cmd) {
    if (!cmd) return;

    // Add command echo
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line command';
    echoLine.innerHTML = `<span class="terminal-prompt">visitor@kundan-pc:~$</span> ${cmd}`;
    terminalOutput.appendChild(echoLine);

    // Run command or error
    let responseHtml = '';
    if (commands[cmd]) {
      responseHtml = commands[cmd]();
    } else {
      responseHtml = `<span class="terminal-line warning">Command not recognized: '${cmd}'. Type 'help' to see valid commands.</span>`;
    }

    if (cmd !== 'clear' && responseHtml) {
      const respLine = document.createElement('div');
      respLine.className = 'terminal-line';
      respLine.innerHTML = responseHtml;
      terminalOutput.appendChild(respLine);
    }

    // Scroll to bottom
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }
}

/* -------------------------------------------------------------------
   7. Copy to Clipboard
------------------------------------------------------------------- */
function initClipboard() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        showToast(`Copied "${textToCopy}" to clipboard!`);
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }).catch(err => {
        showToast('Failed to copy to clipboard');
      });
    });
  });
}

/* -------------------------------------------------------------------
   8. Contact Form Handling
------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const subject = document.getElementById('contactSubject')?.value.trim() || 'Portfolio Inquiry';
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields');
      return;
    }

    // Construct mailto
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject}`);
    const mailtoLink = `mailto:jhakundan986@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    showToast('Opening default email client...');
    window.location.href = mailtoLink;
    form.reset();
  });
}

/* -------------------------------------------------------------------
   9. Modals (Resume & Projects)
------------------------------------------------------------------- */
function initModals() {
  const resumeModal = document.getElementById('resumeModal');
  const projectModal = document.getElementById('projectModal');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Close on backdrop click
  [resumeModal, projectModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeAllModals();
        }
      });
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Print resume
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Setup project details triggers
  const projectDetailBtns = document.querySelectorAll('.view-project-details');
  projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      showProjectDetails(projectId);
    });
  });
}

function openResumeModal() {
  const resumeModal = document.getElementById('resumeModal');
  if (resumeModal) {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = 'auto';
}

const projectData = {
  'one-click': {
    title: 'One Click – Automated Month-End Processing Platform',
    role: 'Lead Developer at Softenger',
    tech: 'Python, Schedulers, REST API, SQL Server, Azure',
    metrics: 'Automated 100% of repetitive month-end data cycles',
    overview: 'Engineered a mission-critical automated Python application to streamline complex month-end computational tasks across multiple business verticals: LA (Life & Annuities), Group, Retail, and Individual policy segments.',
    keyPoints: [
      'Designed fault-tolerant background schedulers with automatic retry mechanisms and execution status logging.',
      'Parsed, normalized, and transformed heavy datasets from disparate internal repositories.',
      'Reduced month-end data turnaround time drastically while eliminating human operational errors.',
      'Implemented proactive health alerts and diagnostic telemetry for administrative staff.'
    ]
  },
  'energy-mgmt': {
    title: 'Energy Management System (High-Throughput Analytics)',
    role: 'Full Stack .NET Developer at Anantkaal LLP',
    tech: '.NET MVC, C#, Entity Framework, LINQ, SQL Server, Charting',
    metrics: 'Processed & rendered 10,000+ industrial metrics in < 2 minutes',
    overview: 'High-performance industrial energy consumption tracking application built to monitor, audit, and benchmark electrical and utility loads across heavy manufacturing plants.',
    keyPoints: [
      'Optimized LINQ expressions and raw SQL procedures to slice query latency by over 70%.',
      'Configured database indexing and batch aggregation pipelines in SQL Server for rapid reporting.',
      'Designed interactive visualizations and alert thresholds for peak consumption spikes.',
      'Delivered rock-solid sub-2 minute load times for datasets exceeding 10,000 live telemetry logs.'
    ]
  },
  'pbi-embed': {
    title: 'PBI Embed API & Secure Reporting Gateway',
    role: 'API & Integration Specialist at Softenger',
    tech: 'C#, ASP.NET MVC, Microsoft Azure, Power BI Embedded, REST API, JWT',
    metrics: 'Zero-trust role-based dynamic dashboard generation',
    overview: 'Architected a secure API bridge combining Azure cloud authentication, third-party microservices, and Microsoft Power BI Embedded to deliver tenant-isolated analytics dashboards directly in client web interfaces.',
    keyPoints: [
      'Implemented token-based authentication (JWT) and row-level security (RLS) enforcement per client account.',
      'Generated custom, secure HTML embed containers with granular report permissioning on the fly.',
      'Integrated Azure App Services and Azure Active Directory for corporate Single Sign-On (SSO).',
      'Prevented data leaks across competing client organizations through strict cryptographic validation.'
    ]
  },
  'prospector': {
    title: 'Prospector Module & Recommendation Engine',
    role: 'Full Stack Developer at Softenger',
    tech: 'Python Backend, React.js Frontend, Azure Blob Storage, LMS Integration',
    metrics: 'End-to-end customer application processing & recommendations',
    overview: 'Full-stack enterprise module designed to manage customer lead applications, evaluate suitability parameters, and dynamically suggest optimal products through integrated recommendation logic.',
    keyPoints: [
      'Engineered a modern, responsive React.js single-page frontend with responsive validation workflows.',
      'Built Python microservice backend to ingest customer attributes and run scoring algorithms.',
      'Connected Azure Blob Storage for secure document upload, retention, and encryption at rest.',
      'Integrated external LMS APIs to synchronize training, status updates, and customer pipeline records.'
    ]
  },
  'budget-system': {
    title: '23-Department Budget Management Web Solution',
    role: '.NET Engineer at Anantkaal LLP',
    tech: '.NET MVC, C#, Entity Framework, SQL Server, Excel Export/Import',
    metrics: 'Transformed 23 departments from Excel chaos to automated cloud web portal',
    overview: 'Designed and deployed an enterprise-wide financial planning and departmental expenditure system that completely eliminated manual, error-prone spreadsheets for 23 corporate business units.',
    keyPoints: [
      'Established multi-tier approval workflows with role-based permissions (Department Heads, Finance, Executive Board).',
      'Implemented comprehensive audit trails recording every currency modification and fiscal projection.',
      'Built automatic validation guards preventing department overspending against assigned allocations.',
      'Dramatically decreased annual budget finalization time from several weeks to a few days.'
    ]
  },
  'pizza-app': {
    title: 'Restaurant Order & Beverage Management System',
    role: 'Full Stack Project Developer',
    tech: 'C#, .NET MVC, SQL Server, HTML5, CSS3, JavaScript',
    metrics: 'End-to-end menu, real-time table tracking, and billing system',
    overview: 'A complete commercial restaurant management system handling table reservations, real-time kitchen order tickets (KOT), item customization, stock reduction, and receipt billing generation.',
    keyPoints: [
      'Built complete CRUD workflows for dishes, beverage add-ons, pricing tiers, and dietary categorizations.',
      'Designed responsive order checkout interface with live price calculation and split-bill functionality.',
      'Implemented normalized SQL Server schema ensuring zero data corruption during peak billing hours.',
      'Structured using MVC architecture with clean separation of domain entities and controllers.'
    ]
  }
};

function showProjectDetails(projectId) {
  const project = projectData[projectId];
  if (!project) return;

  const projectModal = document.getElementById('projectModal');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalBody = document.getElementById('projectModalBody');

  if (projectModal && projectModalTitle && projectModalBody) {
    projectModalTitle.textContent = project.title;

    projectModalBody.innerHTML = `
      <div style="margin-bottom: 16px;">
        <span class="pill-tag" style="background: rgba(14, 165, 233, 0.15); color: var(--text-highlight);">${project.role}</span>
        <span class="pill-tag" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-success);">${project.metrics}</span>
      </div>
      <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px;">
        ${project.overview}
      </p>
      <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 12px;">Key Architectural Achievements:</h4>
      <ul style="list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
        ${project.keyPoints.map(pt => `
          <li style="position: relative; padding-left: 24px; color: var(--text-secondary); font-size: 0.95rem;">
            <span style="position: absolute; left: 0; color: var(--text-highlight); font-weight: bold;">✓</span>
            ${pt}
          </li>
        `).join('')}
      </ul>
      <div style="padding-top: 16px; border-top: 1px solid var(--border-subtle);">
        <strong style="color: var(--text-primary); font-size: 0.9rem;">Technologies Used:</strong>
        <p style="color: var(--text-highlight); font-size: 0.9rem; margin-top: 4px;">${project.tech}</p>
      </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* -------------------------------------------------------------------
   10. Toast Notifications
------------------------------------------------------------------- */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color: var(--text-highlight);"></i> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* -------------------------------------------------------------------
   11. Interactive AI Portfolio Chatbot
------------------------------------------------------------------- */
function initChatbot() {
  const toggleBtn = document.getElementById('chatbotToggleBtn');
  const chatWindow = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatCloseBtn');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const suggestionChips = document.querySelectorAll('.chat-chip');

  if (!toggleBtn || !chatWindow) return;

  // Toggle Chatbot
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      const badge = toggleBtn.querySelector('.chatbot-badge');
      if (badge) badge.style.display = 'none';
      setTimeout(() => chatInput?.focus(), 300);
    }
  });

  closeBtn?.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  // Suggestion Chips
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query) {
        handleUserMessage(query);
      }
    });
  });

  // Chat Form Submit
  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    chatInput.value = '';
    handleUserMessage(message);
  });

  function handleUserMessage(userText) {
    appendMessage('user', userText);

    // Show typing dots
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg bot chat-typing-indicator';
    typingEl.innerHTML = `
      <div class="chat-msg-bubble">
        <div class="chat-typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate AI thinking time (400-700ms)
    setTimeout(() => {
      typingEl.remove();
      const botResponse = generateBotResponse(userText);
      appendMessage('bot', botResponse);
    }, 550);
  }

  function appendMessage(sender, textHtml) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.innerHTML = `
      <div class="chat-msg-bubble">
        ${textHtml}
      </div>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Intelligent Response Brain
  function generateBotResponse(input) {
    const text = input.toLowerCase().trim();

    // 1. Greetings
    if (/^(hi|hello|hey|hola|greetings|namaste|good\s?(morning|afternoon|evening))/i.test(text)) {
      return `Hello! 👋 Great to meet you! I'm Kundan's AI Assistant. How can I help you? You can ask about his <b>experience</b>, <b>Java/.NET skills</b>, <b>clients (Zurich NA, L&T, Star Union)</b>, or how to <b>WhatsApp/hire him in Mumbai</b>!`;
    }

    // 2. Who is Kundan
    if (/who (is|are)|about|introduce|bio/i.test(text)) {
      return `<strong>Kundan Kumar Jha</strong> is a Full Stack Developer with <strong>4+ years of experience</strong> based in <strong>Mumbai, India</strong> 📍. He specializes in <strong>C#, .NET Core, Java, Spring Boot, Python, React.js</strong>, and cloud architectures on <strong>Microsoft Azure & AWS</strong>. He has engineered systems for clients like <strong>Zurich NA, L&T</strong>, and <strong>Star Union Dai-ichi Bank</strong>.`;
    }

    // 3. Location / Mumbai
    if (/where|location|mumbai|city|relocate|remote|based/i.test(text)) {
      return `Kundan is currently located in <strong>Mumbai, India</strong> 📍! He is open to exciting full-time opportunities, hybrid roles in Mumbai, as well as high-impact remote engineering positions globally.`;
    }

    // 4. Clients Worked With
    if (/client|zurich|l&t|larsen|star union|dai-ichi|bank of india|union bank/i.test(text)) {
      return `Kundan has worked with leading global & enterprise clients:<br>
      • <strong>Zurich NA (Zurich North America)</strong>: Commercial insurance & financial risk APIs, secure policy retrieval.<br>
      • <strong>Larsen & Toubro (L&T)</strong>: Industrial plant digitalization & high-throughput energy processing (10,000+ records in &lt;2 mins).<br>
      • <strong>Star Union Dai-ichi Bank / Life (SUD Life)</strong>: Month-end Python batch automation (One Click), customer policy lookup APIs, and JWT security.`;
    }

    // 5. Domains: Banking, Finance, Steel
    if (/domain|banking|finance|steel|manufacturing|industry/i.test(text)) {
      return `Kundan has deep domain expertise in three high-compliance sectors:<br>
      🏦 <strong>Banking Domain</strong>: Customer onboarding, mobile policy lookups, zero-trust JWT token authentication.<br>
      💳 <strong>Finance Domain</strong>: 23-department budget planning systems, Python automated month-end schedulers (One Click).<br>
      🏭 <strong>Steel Manufacturing Domain</strong>: Real-time plant energy management crunching 10k+ records in under 2 mins.`;
    }

    // 6. Java / Spring Boot
    if (/java|spring|spring boot|microservice/i.test(text)) {
      return `Yes! Kundan has strong hands-on experience in <strong>Java and Spring Boot</strong> ☕:<br>
      • Core Java, OOP principles, Collections Framework, Multithreading, Streams API.<br>
      • Building scalable <strong>RESTful Microservices</strong> with Spring Boot, Spring MVC, Spring Data JPA, and annotations.<br>
      • Database integration with SQL Server and Hibernate/JPA.`;
    }

    // 7. .NET / C#
    if (/c#|csharp|\.net|asp\.net|linq|entity framework/i.test(text)) {
      return `Kundan is a <strong>.NET Specialist with 4+ years of depth</strong> ⚡:<br>
      • ASP.NET Core, .NET MVC, and Web API for high-throughput microservices.<br>
      • Modernized <strong>12 legacy applications to ASP.NET Core & IIS</strong> at DXC Technology.<br>
      • Advanced LINQ query tuning and Entity Framework optimization under heavy data volumes.`;
    }

    // 8. Python / One Click
    if (/python|scheduler|one click|automation/i.test(text)) {
      return `In Python, Kundan developed <strong>One Click</strong> at Softenger 🐍:<br>
      • An automated month-end financial execution engine with resilient background schedulers.<br>
      • Gathers, transforms, and normalizes large datasets across <strong>LA, Group, Retail</strong>, and <strong>Individual</strong> parameters.`;
    }

    // 9. Tech Stack / Skills Overall
    if (/skill|tech stack|technolog|stack|languages|framework/i.test(text)) {
      return `Here is Kundan's core technology matrix 🛠️:<br>
      • <strong>Backend:</strong> C#, .NET Core, Java, Spring Boot, Python, REST APIs<br>
      • <strong>Frontend:</strong> React.js, JavaScript (ES6+), TypeScript, HTML5, CSS3<br>
      • <strong>Cloud:</strong> Microsoft Azure (AZ-900), AWS (CLF-C02), Blob Storage, Power BI<br>
      • <strong>Database & Tools:</strong> SQL Server, JWT Auth, Postman, Swagger, IIS, Git`;
    }

    // 10. Experience / Companies
    if (/exp|experience|company|companies|softenger|anantkaal|dxc|career/i.test(text)) {
      return `Kundan has <strong>4+ years of professional engineering experience</strong>:<br>
      1. <strong>Softenger</strong> (Feb 2026 – Present): Executive – Full Stack Developer (Python Schedulers, .NET APIs, React, Azure, Power BI).<br>
      2. <strong>Anantkaal LLP</strong> (Aug 2024 – Feb 2026): .NET Developer (L&T Energy Management 10k+ records <2 mins, 23 Dept Budget System).<br>
      3. <strong>DXC Technology</strong> (Jun 2022 – Jul 2024): Analyst II – Software Engineer (Upgraded 12 legacy apps to ASP.NET Core).`;
    }

    // 11. Certifications
    if (/certif|aws|azure|az-900|clf-c02|credential/i.test(text)) {
      return `Kundan is dual-cloud certified ☁️:<br>
      1. <strong>Amazon Certified Cloud Practitioner (CLF-C02)</strong><br>
      2. <strong>Microsoft Certified: Azure Fundamentals (AZ-900)</strong><br>
      3. <strong>Web Development Using .NET Specialist</strong>`;
    }

    // 12. Hackathon / Awards
    if (/hackathon|award|sih|smart india|achievement|honor/i.test(text)) {
      return `🏆 <strong>National Level Hackathon Winner</strong> – Smart India Hackathon (SIH)!<br>
      He also received formal corporate management appreciation for exceptional diligence and high delivery speed.`;
    }

    // 13. Education
    if (/education|degree|btech|college|silicon|cgpa/i.test(text)) {
      return `🎓 <strong>Silicon Institute of Technology</strong> (Aug 2018 – May 2022)<br>
      Bachelor of Technology in <strong>Electrical & Electronics Engineering</strong> with a CGPA of <strong>7.53 / 10</strong>.`;
    }

    // 14. Resume / CV
    if (/resume|cv|download|pdf|profile/i.test(text)) {
      setTimeout(() => openResumeModal(), 600);
      return `📄 Opening Kundan's official resume viewer right now! You can also view or print it directly here: <a href="resume.html" target="_blank" style="color:#0284c7;font-weight:700;">Open Printable Resume</a>.`;
    }

    // 15. Contact / WhatsApp / Phone / Email / Hire
    if (/contact|hire|whatsapp|phone|email|call|reach|message|talk/i.test(text)) {
      return `You can reach Kundan directly in Mumbai 💬:<br>
      • <strong>WhatsApp:</strong> <a href="https://wa.me/919572167459?text=Hi%20Kundan" target="_blank" style="color:#25d366;font-weight:700;">+91 9572167459 (Click to Chat)</a><br>
      • <strong>Email:</strong> <a href="mailto:jhakundan986@gmail.com" style="color:#0284c7;font-weight:700;">jhakundan986@gmail.com</a><br>
      • <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/kundan-jha-75ba19190" target="_blank" style="color:#0284c7;font-weight:700;">kundan-jha-75ba19190</a><br>
      • <strong>Phone:</strong> +91 9572167459`;
    }

    // 16. Fallback response
    return `I can help you with anything regarding Kundan! Try asking:<br>
    • <em>"What is his tech stack?"</em><br>
    • <em>"Which clients has he worked with?"</em><br>
    • <em>"Does he know Java and Spring Boot?"</em><br>
    • <em>"Tell me about his banking domain work"</em><br>
    • <em>"How can I WhatsApp or hire him in Mumbai?"</em>`;
  }
}
