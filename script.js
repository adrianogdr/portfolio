// Portfolio Data & Interaction Logic
(function() {
  'use strict';

  // Configuration
  const CDN_BASE = 'https://cdn.jsdelivr.net/gh/adrianogdr/portfolio/assets/images/';
  const FALLBACK_BASE = 'https://raw.githubusercontent.com/adrianogdr/portfolio/main/assets/images/';
  const PLACEHOLDER_COLORS = {
    design: '#f472b6',
    frontend: '#22d3ee',
    backend: '#a78bfa',
    fullstack: '#4ade80'
  };

  // State
  let projects = [];
  let currentCategory = 'all';
  let activeModalProject = null;
  let lastFocusedElement = null;

  // DOM Elements
  const grid = document.getElementById('projects-grid');
  const emptyState = document.getElementById('projects-empty');
  const filterPills = document.querySelectorAll('.filter-pill');
  const modal = document.getElementById('case-study');
  const modalClose = modal.querySelector('.modal__close');
  const modalBackdrop = modal.querySelector('.modal__backdrop');

  // Initialize
  async function init() {
    await loadProjects();
    renderProjects();
    bindEvents();
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
  }

  // Load projects from JSON
  async function loadProjects() {
    try {
      const response = await fetch('data/projects.json');
      if (!response.ok) throw new Error('Failed to load projects');
      projects = await response.json();
    } catch (error) {
      console.error('Error loading projects:', error);
      projects = [];
    }
  }

  // Generate placeholder SVG
  function generatePlaceholder(category, title) {
    const color = PLACEHOLDER_COLORS[category] || PLACEHOLDER_COLORS.frontend;
    const initials = title
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-label="Placeholder for ${title}">
        <rect width="640" height="400" fill="${color}15"/>
        <rect x="0" y="0" width="640" height="400" fill="url(#grad)"/>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}33"/>
            <stop offset="100%" stop-color="${color}15"/>
          </linearGradient>
        </defs>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-family="system-ui, sans-serif" font-size="48" font-weight="600" fill="${color}80">
          ${initials}
        </text>
        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle"
              font-family="system-ui, sans-serif" font-size="14" fill="${color}60">
          ${category.toUpperCase()}
        </text>
      </svg>
    `)}`;
  }

  // Build image URL with fallback
  function buildImageUrl(filename, category, title) {
    if (!filename) return generatePlaceholder(category, title);
    if (filename.startsWith('data:') || filename.startsWith('http')) return filename;
    return `${CDN_BASE}${filename}`;
  }

  // Build fallback image URL
  function buildFallbackUrl(filename) {
    if (!filename || filename.startsWith('data:') || filename.startsWith('http')) return null;
    return `${FALLBACK_BASE}${filename}`;
  }

  // Render project cards
  function renderProjects() {
    if (!grid) return;

    const filtered = currentCategory === 'all'
      ? projects
      : projects.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
      grid.innerHTML = '';
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    grid.innerHTML = filtered.map((project, index) => `
      <article class="project-card${project.featured ? ' project-card--featured' : ''}" role="listitem" data-id="${project.id}" style="--card-index: ${index}">
        <div class="project-card__media">
          <img
            class="project-card__image"
            src="${buildImageUrl(project.thumbnail, project.category, project.title)}"
            alt="Thumbnail do projeto ${project.title}"
            loading="lazy"
            decoding="async"
            data-fallback="${buildFallbackUrl(project.thumbnail) || ''}"
            onload="this.classList.add('loaded')"
            onerror="handleImageError(this, '${project.category}', '${project.title.replace(/'/g, "\\'")}')"
          >
          <div class="project-card__overlay">
            <span class="project-card__category badge--${project.category}">${project.category}</span>
            <h3 class="project-card__title">${project.title}</h3>
          </div>
        </div>
        <footer class="project-card__footer">
          <div class="project-card__tags">
            ${project.stack.slice(0, 4).map(tech => `
              <span class="project-card__tag">${tech}</span>
            `).join('')}
            ${project.stack.length > 4 ? `<span class="project-card__tag">+${project.stack.length - 4}</span>` : ''}
          </div>
          <div class="project-card__links">
            <button class="project-card__link" data-action="details" aria-label="Ver detalhes do ${project.title}" title="Detalhes">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </button>
          </div>
        </footer>
      </article>
    `).join('');

    // Animate cards on scroll
    observeCards();
  }

  // Intersection Observer for card animations
  function observeCards() {
    const cards = grid.querySelectorAll('.project-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fadeUp 400ms ease ${entry.target.style.getPropertyValue('--card-index') * 50}ms forwards`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      observer.observe(card);
    });
  }

  // Handle image errors with fallback
  window.handleImageError = function(img, category, title) {
    const fallback = img.dataset.fallback;
    if (fallback && img.src !== fallback) {
      img.src = fallback;
      return;
    }
    img.src = generatePlaceholder(category, title);
  };

  // Open modal with project details
  function openModal(project) {
    activeModalProject = project;
    lastFocusedElement = document.activeElement;

    const titleEl = modal.querySelector('.modal__title');
    const mediaEl = modal.querySelector('.modal__media');
    const detailsEl = modal.querySelector('.modal__details');
    const tagsEl = modal.querySelector('.modal__tags');
    const descEl = modal.querySelector('.modal__description');
    const linksEl = modal.querySelector('.modal__links');

    titleEl.textContent = project.title;

    // Media
    const mainImage = buildImageUrl(project.thumbnail, project.category, project.title);
    mediaEl.innerHTML = `
      <img src="${mainImage}" alt="${project.title}" loading="eager" decoding="async"
           onerror="this.src='${generatePlaceholder(project.category, project.title)}'">
      ${project.images && project.images.length > 0 ? `
        <div class="modal__gallery" style="display:flex;gap:0.5rem;margin-top:1rem;overflow-x:auto;padding-bottom:0.5rem;">
          ${project.images.map(img => `
            <img src="${buildImageUrl(img, project.category, project.title)}" alt="${project.title} - detalhe" loading="lazy" style="height:80px;border-radius:8px;flex-shrink:0;object-fit:cover;width:auto;" onerror="this.style.display='none'">
          `).join('')}
        </div>
      ` : ''}
    `;

    // Details
    detailsEl.innerHTML = `
      <dt>Categoria</dt><dd>${project.category}${project.subcategory ? ` · ${project.subcategory}` : ''}</dd>
      <dt>Ano</dt><dd>${project.year}</dd>
      <dt>Papel</dt><dd>${project.role}</dd>
      ${project.links.live ? `<dt>Demo</dt><dd><a href="${project.links.live}" target="_blank" rel="noopener">${new URL(project.links.live).hostname}</a></dd>` : ''}
      ${project.links.code ? `<dt>Código</dt><dd><a href="${project.links.code}" target="_blank" rel="noopener">${new URL(project.links.code).hostname}</a></dd>` : ''}
      ${project.links.caseStudy ? `<dt>Case Study</dt><dd><a href="${project.links.caseStudy}" target="_blank" rel="noopener">Ler estudo de caso</a></dd>` : ''}
    `;

    // Tags
    tagsEl.innerHTML = project.stack.map(tech => `
      <span class="modal__tag">${tech}</span>
    `).join('');

    // Description
    descEl.textContent = project.description;

    // Links
    linksEl.innerHTML = '';
    if (project.links.live) {
      linksEl.appendChild(createModalLink('Ver Demo', project.links.live, true));
    }
    if (project.links.code) {
      linksEl.appendChild(createModalLink('Ver Código', project.links.code, false));
    }
    if (project.links.caseStudy) {
      linksEl.appendChild(createModalLink('Case Study', project.links.caseStudy, false));
    }

    // Show modal
    modal.showModal();
    document.body.style.overflow = 'hidden';
    trapFocus(modal);
    modalClose.focus();

    // Update URL
    history.pushState(null, '', `#project=${project.id}`);
  }

  function createModalLink(text, href, primary) {
    const a = document.createElement('a');
    a.className = `modal__link ${primary ? 'modal__link--primary' : 'modal__link--secondary'}`;
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = text;
    return a;
  }

  // Close modal
  function closeModal() {
    modal.close();
    document.body.style.overflow = '';
    history.pushState(null, '', currentCategory === 'all' ? '#projects' : `#category=${currentCategory}`);
    if (lastFocusedElement) lastFocusedElement.focus();
    activeModalProject = null;
  }

  // Focus trap for modal
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function handleTab(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  // Bind events
  function bindEvents() {
    // Filter pills
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        setCategory(pill.dataset.category);
      });

      pill.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          focusNextPill(pill);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          focusPrevPill(pill);
        } else if (e.key === 'Home') {
          e.preventDefault();
          filterPills[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          filterPills[filterPills.length - 1].focus();
        }
      });
    });

    // Grid delegation for details buttons
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="details"]');
      if (btn) {
        const card = btn.closest('.project-card');
        const projectId = card.dataset.id;
        const project = projects.find(p => p.id === projectId);
        if (project) openModal(project);
      }
    });

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.open) {
        closeModal();
      }
    });

    // Click outside modal content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function focusNextPill(current) {
    const index = Array.from(filterPills).indexOf(current);
    const next = filterPills[(index + 1) % filterPills.length];
    next.focus();
  }

  function focusPrevPill(current) {
    const index = Array.from(filterPills).indexOf(current);
    const prev = filterPills[(index - 1 + filterPills.length) % filterPills.length];
    prev.focus();
  }

  // Set active category
  function setCategory(category) {
    currentCategory = category;
    filterPills.forEach(p => {
      p.classList.toggle('is-active', p.dataset.category === category);
      p.setAttribute('aria-selected', p.dataset.category === category);
    });
    renderProjects();

    // Update URL
    const hash = category === 'all' ? '#projects' : `#category=${category}`;
    history.replaceState(null, '', hash);
  }

  // Handle hash changes
  function handleHashChange() {
    const hash = window.location.hash.slice(1);

    if (hash.startsWith('project=')) {
      const projectId = hash.split('=')[1];
      const project = projects.find(p => p.id === projectId);
      if (project && !modal.open) {
        openModal(project);
      }
      return;
    }

    if (hash.startsWith('category=')) {
      const category = hash.split('=')[1];
      if (['all', 'design', 'frontend', 'backend', 'fullstack'].includes(category)) {
        setCategory(category);
      }
      return;
    }

    if (hash === 'projects' || hash === '') {
      if (modal.open) closeModal();
      setCategory('all');
    }
  }

  // Add fadeUp animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();