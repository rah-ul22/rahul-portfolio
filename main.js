/**
 * Rahul M. — IT & Technology Portfolio
 * Interactive Functionality & Micro-interactions
 */

(function () {
  'use strict';

  // --- 1. THEME MANAGER (Dark / Light Mode) ---
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem('rm_portfolio_theme');
    if (saved) return saved;
    return 'dark'; // Dark mode default as specified
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('rm_portfolio_theme', theme);
    if (window.updateCanvasColors) {
      window.updateCanvasColors(theme);
    }
  }

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      showToast(`Switched to ${next} theme`);
    });
  }

  // --- 2. SCROLL PROGRESS BAR ---
  const progressBar = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!progressBar) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const currentProgress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, currentProgress))}%`;
  }

  // --- 3. STICKY NAVBAR & ACTIVE SCROLL-SPY ---
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTopBtn');

  function handleScroll() {
    const scrollPos = window.scrollY;

    // Sticky header background
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Section ScrollSpy
    let currentSectionId = '';
    const offset = 140;
    sections.forEach(section => {
      const top = section.offsetTop - offset;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    updateScrollProgress();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 4. MOBILE DRAWER NAVIGATION ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileDrawer(open) {
    if (!hamburgerBtn || !mobileDrawer) return;
    const isOpen = open !== undefined ? open : !hamburgerBtn.classList.contains('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    mobileDrawer.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
    mobileDrawer.setAttribute('aria-hidden', (!isOpen).toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileDrawer());
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileDrawer(false);
    });
  });

  // Close drawer on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      toggleMobileDrawer(false);
    }
  });

  // --- 5. INTERACTIVE BACKGROUND DATA CANVAS ---
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;
    let isDark = htmlRoot.getAttribute('data-theme') === 'dark';

    window.updateCanvasColors = function (theme) {
      isDark = theme === 'dark';
    };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class DataNode {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.35)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new DataNode());
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes within range
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isDark ? 0.14 : 0.08);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(render);
    }
    render();
  }

  // --- 6. SKILLS CATEGORY FILTERING ---
  const skillTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 7. PROJECTS FILTERING ---
  const projectTabs = document.querySelectorAll('.project-tab');
  const projectCards = document.querySelectorAll('.project-card');

  projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      projectTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 8. PROJECT DETAILS MODAL ---
  const projectData = {
    'sales-dashboard': {
      category: 'DATA & ANALYTICS',
      title: 'Sales Data Analysis Dashboard',
      metric: null,
      overview: 'Designed and built an interactive dashboard to monitor core enterprise metrics including sales trends, profit margins, and total units sold. The project enabled stakeholder reporting and provided immediate visibility into commercial operations.',
      problem: 'Business leaders lacked dynamic, consolidated reporting to evaluate multi-region performance and individual salesperson contributions, relying on fragmented raw spreadsheets.',
      approach: 'Modeled relational sales records with advanced formulas and pivot caches. Developed structured visualizations (bar charts, line graphs, pie distributions) connected to synchronized multi-criteria slicers and dynamic filters.',
      technologies: ['Microsoft Excel', 'Power BI', 'Pivot Tables', 'Data Visualization', 'VLOOKUP / XLOOKUP', 'KPI Reporting'],
      work: [
        'Built an interactive dashboard to monitor sales, profit, and units sold, enabling stakeholder reporting and supporting data-driven client decision-making.',
        'Created visualizations (bar, line, pie charts) to analyze sales trends, regional performance, and product insights.',
        'Implemented dynamic filters for region, product, and salesperson to enable real-time, data-driven decisions.'
      ],
      results: 'Delivered an interactive, stakeholder-ready business intelligence solution that simplifies complex multi-dimensional sales numbers into high-clarity operational insights.',
      disclaimer: null
    },
    'bone-cancer': {
      category: 'AI / MACHINE LEARNING',
      title: 'Predicting Length of Survival for Bone Cancer Patients',
      metric: 'Reported classification accuracy: ~89%',
      overview: 'Developed predictive machine learning models using K-Nearest Neighbors (KNN) and Random Forest classifiers to predict bone cancer risk and patient survival stratification from clinical test records.',
      problem: 'Early clinical stratification of patient risk requires synthesizing multi-parameter laboratory metrics and diagnostic tests into accurate risk indicators.',
      approach: 'Built a systematic data preparation and modeling pipeline. Evaluated missing values, standardized clinical features, applied dimensionality and feature selection methods, and rigorously benchmarked classification performance across KNN and Random Forest.',
      technologies: ['Python', 'Scikit-learn', 'Random Forest', 'KNN', 'Pandas', 'NumPy', 'Classification Metrics'],
      work: [
        'Expanded machine learning models using KNN and Random Forest to predict bone cancer risk from patient health and medical test data, achieving approximately 89% classification accuracy.',
        'Performed data preprocessing, feature selection, and model testing; evaluated accuracy metrics to validate deployment readiness.',
        'Designed the system to support early clinical decision-making through predictive insights.'
      ],
      results: 'Demonstrated high predictive fidelity with approximately 89% classification accuracy on evaluated patient datasets.',
      disclaimer: 'Academic machine-learning project intended for computational research and decision support exploration. Not a clinically certified medical device.'
    },
    'earthquake-hybrid': {
      category: 'AI / MACHINE LEARNING',
      title: 'Earthquake Prediction Using Hybrid Approach',
      metric: 'Time-Series Hybrid Modeling &bull; USGS Seismic Data',
      overview: 'Built a hybrid forecasting model combining Random Forest regression and Long Short-Term Memory (LSTM) recurrent neural networks using official USGS earthquake data.',
      problem: 'Seismic events exhibit complex non-linear temporal dynamics and high variance, presenting difficult challenges for traditional single-model statistical forecasting.',
      approach: 'Implemented sliding-window feature engineering to capture temporal trends across historical seismic sequences. Combined ensemble tree learning (Random Forest) for tabular seismic attributes with LSTM deep networks for temporal sequential patterns.',
      technologies: ['Python', 'Random Forest', 'LSTM (Keras/TensorFlow)', 'USGS Earthquake Data', 'Time Series Analysis', 'Sliding Window FE'],
      work: [
        'Built a hybrid forecasting model using Random Forest and LSTM with USGS earthquake data.',
        'Applied sliding-window techniques for seismic feature extraction and time-series forecasting.',
        'Improved model performance through preprocessing, normalization, and cross-validation.'
      ],
      results: 'Demonstrated that combining recurrent LSTM neural units with Random Forest ensemble trees yields stronger sequential stability compared to standard standalone linear approaches.',
      disclaimer: 'Academic machine-learning research project exploring computational time-series methodology using historical USGS records.'
    },
    'earthquake-framework': {
      category: 'AI / MACHINE LEARNING &bull; SOFTWARE / TECHNOLOGY',
      title: 'End-to-End Hybrid AI Framework for Earthquake Forecasting',
      metric: 'Reported risk classification accuracy: ~98% (M ≥ 6.0)',
      overview: 'Engineered an end-to-end forecasting framework designed to estimate the probability of major seismic events (M ≥ 6.0) and predict maximum expected magnitude, deployed as an interactive system for risk monitoring.',
      problem: 'Major earthquakes are statistically rare events, creating extreme class imbalance in raw historical data that degrades standard algorithmic predictive power.',
      approach: 'Engineered magnitude-based resampling to counter heavy class skew, paired with multi-step sliding-window feature engineering. Designed an integrated dual-component architecture (Random Forest + LSTM) and deployed an interactive hazard visualization dashboard for real-time risk assessment.',
      technologies: ['Python', 'Random Forest', 'LSTM', 'Interactive Hazard Visualization', 'Real-Time Seismic Risk Analysis', 'USGS Data Pipeline', 'System Monitoring'],
      work: [
        'Improved an end-to-end forecasting system to estimate the probability of major earthquakes (M ≥ 6.0) and maximum expected magnitude, achieving approximately 98% risk classification accuracy.',
        'Implemented magnitude-based resampling and sliding-window feature engineering for time-series modeling.',
        'Delivered an end-to-end solution deployment enabling real-time seismic risk analysis, interactive hazard visualization, and ongoing system monitoring.',
        'Designed system architecture for a hybrid forecasting model, selecting Random Forest and LSTM components and specifying data pipeline requirements using USGS earthquake data.'
      ],
      results: 'Achieved approximately 98% risk classification accuracy for major events (M ≥ 6.0) in validated academic testing benchmarks while deploying an end-to-end interface for system monitoring.',
      disclaimer: 'Academic and technical machine learning framework built on USGS datasets. Designed for computational seismic risk analysis research; does not claim real-world operational earthquake prediction.'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const closeProjectModalBtn = document.getElementById('closeProjectModalBtn');
  const modalCloseSecondaryBtn = document.getElementById('modalCloseSecondaryBtn');
  const viewProjectBtns = document.querySelectorAll('.view-project-btn');

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModal) return;

    document.getElementById('modalProjectCategory').textContent = data.category;
    document.getElementById('modalProjectTitle').textContent = data.title;
    
    const metricBox = document.getElementById('modalMetricBox');
    if (data.metric) {
      metricBox.innerHTML = data.metric;
      metricBox.style.display = 'inline-flex';
    } else {
      metricBox.style.display = 'none';
    }

    document.getElementById('modalProjectOverview').textContent = data.overview;
    document.getElementById('modalProjectProblem').textContent = data.problem;
    document.getElementById('modalProjectApproach').textContent = data.approach;

    // Tech tags
    const techContainer = document.getElementById('modalProjectTech');
    techContainer.innerHTML = '';
    data.technologies.forEach(tech => {
      const tag = document.createElement('span');
      tag.className = 'p-tag';
      tag.textContent = tech;
      techContainer.appendChild(tag);
    });

    // Bullets
    const workContainer = document.getElementById('modalProjectWork');
    workContainer.innerHTML = '';
    data.work.forEach(point => {
      const li = document.createElement('li');
      li.textContent = point;
      workContainer.appendChild(li);
    });

    document.getElementById('modalProjectResults').textContent = data.results;

    // Disclaimer
    const disclaimerBox = document.getElementById('modalProjectDisclaimer');
    const disclaimerText = document.getElementById('modalDisclaimerText');
    if (data.disclaimer) {
      disclaimerText.textContent = data.disclaimer;
      disclaimerBox.style.display = 'flex';
    } else {
      disclaimerBox.style.display = 'none';
    }

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewProjectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
  if (modalCloseSecondaryBtn) modalCloseSecondaryBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // --- 9. RESUME VIEWER MODAL ---
  const resumeModal = document.getElementById('resumeModal');
  const openResumeModalBtn = document.getElementById('openResumeModalBtn');
  const viewResumeModalTriggerBtn = document.getElementById('viewResumeModalTriggerBtn');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openResumeModalBtn) openResumeModalBtn.addEventListener('click', openResumeModal);
  if (viewResumeModalTriggerBtn) viewResumeModalTriggerBtn.addEventListener('click', openResumeModal);
  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeResumeModal);
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
    }
  });

  // --- 10. CONTACT EMAIL FORM ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('senderName')?.value || '').trim();
      const email = (document.getElementById('senderEmail')?.value || '').trim();
      const subject = (document.getElementById('messageSubject')?.value || '').trim();
      const message = (document.getElementById('messageContent')?.value || '').trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject || 'Opportunity Discussion'} - ${name}`);
      const emailBody = encodeURIComponent(
        `Dear Rahul,\n\n${message}\n\nBest regards,\n${name}\nContact Email: ${email}`
      );

      const mailtoUrl = `mailto:rahulmurugan1812@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      showToast('Opening your default email application...');
      window.location.href = mailtoUrl;

      // Reset form after short delay
      setTimeout(() => {
        contactForm.reset();
      }, 1500);
    });
  }

  // --- 10B. AUTODESK MAYA 3D SHOWCASE VIEWER (Three.js & FBXLoader) ---
  const mayaModelsData = {
    'ghostblaster': {
      name: 'Ghostblaster (Featured)',
      file: 'models/ghostblaster.fbx',
      focus: 'Sci-Fi Weapon &bull; Hard Surface Geometry',
      size: '5.72 MB',
      lighting: 'Studio Rim & Key Directional Lighting'
    },
    'bike': {
      name: 'Bike (Vehicle Model)',
      file: 'models/bike.fbx',
      focus: 'Mechanical Vehicle &bull; Chassis & Engine Detailing',
      size: '1.37 MB',
      lighting: 'Studio Key & Ambient Fill'
    },
    'Boat': {
      name: 'Boat (Maritime Vessel)',
      file: 'models/Boat.fbx',
      focus: 'Maritime Hull Architecture & Cabin Structure',
      size: '1.28 MB',
      lighting: 'Top-Down Sun & Ambient Fill'
    },
    'firepump': {
      name: 'Fire Pump (Industrial Prop)',
      file: 'models/firepump.fbx',
      focus: 'Industrial Machinery & Piping / Valves',
      size: '1.23 MB',
      lighting: 'Industrial Studio Lighting'
    },
    'Home': {
      name: 'Architecture Home (Environment)',
      file: 'models/Home.fbx',
      focus: 'Structural Environment & Architectural Framing',
      size: '672 KB',
      lighting: 'Architectural Daylight Rig'
    },
    'streel': {
      name: 'Street Light (Urban Asset)',
      file: 'models/streel.fbx',
      focus: 'Urban Infrastructure Prop & Structural Steel',
      size: '280 KB',
      lighting: 'Vertical Asset Key Rig'
    },
    'axe': {
      name: 'Battle Axe (Stylized Prop)',
      file: 'models/axe.fbx',
      focus: 'Stylized Weapon Mesh & Beveled Edges',
      size: '111 KB',
      lighting: 'Specular Key Highlight Rig'
    },
    'book': {
      name: 'Spell Book (Detailed Prop)',
      file: 'models/book.fbx',
      focus: 'Cover Detailing, Spine & Layered Page Block',
      size: '30 KB',
      lighting: 'Studio Specular Tabletop Rig'
    }
  };

  function initMaya3dViewer() {
    const canvas = document.getElementById('maya3dCanvas');
    const wrapper = document.getElementById('mayaCanvasWrapper');
    if (!canvas || !wrapper || typeof THREE === 'undefined' || typeof THREE.FBXLoader === 'undefined') {
      return;
    }

    const loaderOverlay = document.getElementById('mayaLoader');
    const loaderBarFill = document.getElementById('loaderBarFill');
    const loaderText = document.getElementById('loaderText');
    const currentNameEl = document.getElementById('currentModelName');
    const specFocusEl = document.getElementById('modelSpecFocus');
    const specSizeEl = document.getElementById('modelSpecSize');
    const specLightingEl = document.getElementById('modelSpecLighting');

    const btnToggleRotate = document.getElementById('btnToggleRotate');
    const btnResetView = document.getElementById('btnResetView');
    const btnOpenLocalFile = document.getElementById('btnOpenLocalFile');
    const localFbxInput = document.getElementById('localFbxInput');
    const autoRotateStatus = document.getElementById('autoRotateStatus');
    const modelTabs = document.querySelectorAll('.maya-model-tab');

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, wrapper.clientWidth / wrapper.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 3.2);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 4. OrbitControls setup
    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 12;
    controls.minDistance = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.5);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6);
    dirLight2.position.set(-5, 4, -5);
    scene.add(dirLight2);

    // Ground Grid Helper
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridHelper = new THREE.GridHelper(
      10,
      20,
      isDarkTheme ? 0x38bdf8 : 0x0284c7,
      isDarkTheme ? 0x1e293b : 0xcbd5e1
    );
    gridHelper.position.y = -0.9;
    scene.add(gridHelper);

    // State
    let currentModelGroup = null;
    let isAutoRotating = true;
    let activeLoadingToken = 0;
    const fbxLoader = new THREE.FBXLoader();
    fbxLoader.setResourcePath('models/');

    // Resize Handler
    function handleResize() {
      if (!wrapper || !renderer || !camera) return;
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize, { passive: true });

    // Helper: base64 string → ArrayBuffer
    function b64ToBuffer(b64) {
      const bin = atob(b64);
      const buf = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      return buf.buffer;
    }

    // Shared callback: receives parsed FBX group, cleans hidden objects, standardizes materials, and frames scene
    function onModelLoaded(fbxObject, token) {
      if (token !== undefined && token !== activeLoadingToken) {
        return; // Stale request, discard
      }

      if (loaderBarFill) loaderBarFill.style.width = '100%';

      // 1. Properly dispose of previous model resources to prevent memory leaks and ghost meshes
      if (currentModelGroup) {
        scene.remove(currentModelGroup);
        currentModelGroup.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
        currentModelGroup = null;
      }

      currentModelGroup = fbxObject;

      // 2. Strip out unwanted objects marked hidden in Autodesk Maya (fbxVisibility === 0 or visible === false)
      const toRemove = [];
      currentModelGroup.traverse((child) => {
        if (child.visible === false || (child.userData && child.userData.fbxVisibility === 0)) {
          toRemove.push(child);
        }
      });
      toRemove.forEach((child) => {
        if (child.parent) {
          child.parent.remove(child);
        }
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });

      // 3. Apply clean studio metallic shader (textures removed)
      currentModelGroup.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.4,
            metalness: 0.2
          });
        }
      });

      // 4. Auto-centering and scaling algorithm on clean geometry
      const box = new THREE.Box3().setFromObject(currentModelGroup);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const targetSize = 2.0;
      const scaleFactor = targetSize / maxDim;
      currentModelGroup.scale.setScalar(scaleFactor);

      // Re-calculate box and center position
      const scaledBox = new THREE.Box3().setFromObject(currentModelGroup);
      const center = scaledBox.getCenter(new THREE.Vector3());
      currentModelGroup.position.sub(center);

      scene.add(currentModelGroup);

      // 5. Place ground grid underneath model
      const finalBox = new THREE.Box3().setFromObject(currentModelGroup);
      gridHelper.position.y = finalBox.min.y - 0.05;

      // 6. Reset camera framing
      camera.position.set(0, 1.2, 3.2);
      controls.target.set(0, 0, 0);
      controls.update();

      setTimeout(() => {
        if (loaderOverlay) loaderOverlay.classList.remove('active');
      }, 150);
    }

    // Load Model Function — embedded first, network fallback
    function loadModel(modelKey) {
      const info = mayaModelsData[modelKey];
      if (!info) return;

      const currentToken = ++activeLoadingToken;

      // Update UI metadata
      if (currentNameEl) currentNameEl.textContent = info.name;
      if (specFocusEl) specFocusEl.innerHTML = info.focus;
      if (specSizeEl) specSizeEl.textContent = info.size;
      if (specLightingEl) specLightingEl.textContent = info.lighting;

      if (loaderOverlay) {
        loaderOverlay.classList.add('active');
        if (loaderText) loaderText.textContent = `Loading ${info.name}...`;
        if (loaderBarFill) loaderBarFill.style.width = '20%';
      }

      // 1. Try embedded base64 first (works on file:// and http://)
      const embedded = window.EMBEDDED_FBX_MODELS &&
        (window.EMBEDDED_FBX_MODELS[modelKey] || window.EMBEDDED_FBX_MODELS[modelKey.toLowerCase()]);

      if (embedded) {
        try {
          if (loaderBarFill) loaderBarFill.style.width = '70%';
          if (loaderText) loaderText.textContent = `Rendering ${info.name}...`;
          const fbxObject = fbxLoader.parse(b64ToBuffer(embedded), 'models/');
          onModelLoaded(fbxObject, currentToken);
          return;
        } catch (e) {
          console.warn('[Maya3D] Embedded parse failed, trying network:', e);
        }
      }

      // 2. Network fallback (http:// only)
      fbxLoader.load(
        info.file,
        (fbxObject) => { onModelLoaded(fbxObject, currentToken); },
        (xhr) => {
          if (xhr.lengthComputable && loaderBarFill && currentToken === activeLoadingToken) {
            const pct = Math.round((xhr.loaded / xhr.total) * 100);
            loaderBarFill.style.width = `${pct}%`;
            if (loaderText) loaderText.textContent = `Loading 3D Mesh (${pct}%)...`;
          }
        },
        (err) => {
          if (currentToken !== activeLoadingToken) return;
          console.error('[Maya3D] Network load failed:', err);
          if (loaderText) loaderText.textContent = window.location.protocol === 'file:'
            ? 'Open via http://localhost:8080 or use Open FBX button.'
            : 'Error loading model file.';
          setTimeout(() => { if (loaderOverlay) loaderOverlay.classList.remove('active'); }, 2500);
        }
      );
    }

    // Direct Local File Input & Drag-and-Drop Handler
    function loadLocalFile(file) {
      if (!file) return;
      const lowerName = file.name.toLowerCase();
      if (!lowerName.endsWith('.fbx')) {
        showToast('Please select a valid FBX model (.fbx)');
        return;
      }
      const currentToken = ++activeLoadingToken;
      if (loaderOverlay) {
        loaderOverlay.classList.add('active');
        if (loaderText) loaderText.textContent = `Reading ${file.name}...`;
        if (loaderBarFill) loaderBarFill.style.width = '30%';
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (loaderBarFill) loaderBarFill.style.width = '70%';
          if (loaderText) loaderText.textContent = 'Parsing 3D Mesh & Materials...';
          const fbxObject = fbxLoader.parse(e.target.result, 'models/');
          if (currentNameEl) currentNameEl.textContent = file.name.replace(/\.fbx$/i, '');
          if (specSizeEl) specSizeEl.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
          if (specFocusEl) specFocusEl.textContent = 'Custom Loaded Autodesk Maya FBX Model';
          onModelLoaded(fbxObject, currentToken);
          showToast(`Successfully loaded ${file.name}`);
        } catch (err) {
          console.error('Failed to parse local 3D file:', err);
          if (loaderText) loaderText.textContent = 'Failed to parse 3D file format.';
          setTimeout(() => {
            if (loaderOverlay) loaderOverlay.classList.remove('active');
          }, 2000);
        }
      };
      reader.readAsArrayBuffer(file);
    }

    if (btnOpenLocalFile && localFbxInput) {
      btnOpenLocalFile.addEventListener('click', () => {
        localFbxInput.click();
      });
      localFbxInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          loadLocalFile(e.target.files[0]);
        }
      });
    }

    // Drag and drop 3D files onto canvas
    wrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      wrapper.classList.add('drag-hover');
    });
    wrapper.addEventListener('dragleave', () => {
      wrapper.classList.remove('drag-hover');
    });
    wrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      wrapper.classList.remove('drag-hover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadLocalFile(e.dataTransfer.files[0]);
      }
    });

    // Initial load: Ghostblaster (Featured)
    loadModel('ghostblaster');

    // Model Selector Tabs Click
    modelTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        modelTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const modelKey = tab.getAttribute('data-model');
        loadModel(modelKey);
      });
    });

    // Control: Auto-Rotate Toggle
    if (btnToggleRotate) {
      btnToggleRotate.addEventListener('click', () => {
        isAutoRotating = !isAutoRotating;
        controls.autoRotate = isAutoRotating;
        btnToggleRotate.classList.toggle('active', isAutoRotating);
        if (autoRotateStatus) autoRotateStatus.textContent = isAutoRotating ? 'ON' : 'OFF';
      });
    }


    // Control: Reset Camera View
    if (btnResetView) {
      btnResetView.addEventListener('click', () => {
        camera.position.set(0, 1.2, 3.2);
        controls.target.set(0, 0, 0);
        controls.update();
        showToast('Camera reset to default view');
      });
    }

    // Render Loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }

  // Initialize Maya 3D Viewer once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMaya3dViewer);
  } else {
    initMaya3dViewer();
  }

  // --- 11. TOAST NOTIFICATION UTILITY ---
  let toastTimer = null;
  function showToast(message, duration = 3500) {
    const toast = document.getElementById('notificationToast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // Download resume buttons feedback
  document.querySelectorAll('a[download]').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Downloading Rahul M. Resume (PDF)...');
    });
  });

})();
