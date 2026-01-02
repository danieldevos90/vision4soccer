// Lucide Icons Integration for Vision4Soccer
// This script provides easy icon functionality using Lucide icons

(function() {
  'use strict';

  // Wait for DOM to be ready and Lucide to load
  function initLucide() {
    if (typeof lucide === 'undefined') {
      // Wait a bit more for Lucide to load
      setTimeout(initLucide, 100);
      return;
    }

    // Initialize Lucide icons
    lucide.createIcons();
    
    // Watch for dynamically added icons
    const observer = new MutationObserver(function(mutations) {
      lucide.createIcons();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLucide);
  } else {
    initLucide();
  }

  // Utility function to create icon elements
  window.createLucideIcon = function(iconName, options = {}) {
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', iconName);
    
    if (options.size) {
      icon.style.width = typeof options.size === 'number' ? options.size + 'px' : options.size;
      icon.style.height = typeof options.size === 'number' ? options.size + 'px' : options.size;
    }
    
    if (options.color) {
      icon.style.color = options.color;
      icon.setAttribute('data-lucide-color', options.color);
    }
    
    if (options.class) {
      icon.className = options.class;
    }
    
    if (options.strokeWidth) {
      icon.setAttribute('data-lucide-stroke-width', options.strokeWidth);
    }
    
    // Initialize the icon when Lucide is ready
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 10);
    }
    
    return icon;
  };

  // Helper to replace text with icons
  window.iconify = function(selector, iconMap) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function(el) {
      const text = el.textContent.trim().toLowerCase();
      if (iconMap[text]) {
        const icon = createLucideIcon(iconMap[text], {
          size: '1em',
          class: 'inline-icon'
        });
        el.innerHTML = '';
        el.appendChild(icon);
      }
    });
  };

  // Add icon to existing elements
  window.addIcon = function(selector, iconName, options = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function(el) {
      const icon = createLucideIcon(iconName, {
        size: options.size || '1em',
        class: options.class || 'lucide-icon',
        color: options.color,
        strokeWidth: options.strokeWidth
      });
      
      if (options.position === 'before') {
        el.insertBefore(icon, el.firstChild);
      } else if (options.position === 'after') {
        el.appendChild(icon);
      } else {
        // Default: prepend
        el.insertBefore(icon, el.firstChild);
      }
    });
    
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 10);
    }
  };
})();
