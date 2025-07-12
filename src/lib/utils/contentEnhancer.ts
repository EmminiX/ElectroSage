/**
 * Content Enhancement Utility
 * Automatically identifies and highlights formulas, examples, and practice questions
 * in rendered content for better visual presentation
 */

export function enhanceContentDisplay(container: HTMLElement): void {
  if (!container) return;

  // Enhance mathematical formulas (KaTeX elements)
  enhanceFormulas(container);
  
  // Enhance examples
  enhanceExamples(container);
  
  // Enhance practice questions
  enhancePracticeQuestions(container);
  
  // Enhance applications sections
  enhanceApplications(container);
}

/**
 * Enhance mathematical formulas with better visual styling
 */
function enhanceFormulas(container: HTMLElement): void {
  // KaTeX formulas are already styled via CSS, but we can add additional enhancements
  const katexElements = container.querySelectorAll('.katex-display, .katex');
  
  katexElements.forEach((element) => {
    // Ensure formulas have proper ARIA labels for accessibility
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', 'Mathematical formula');
    }
    
    // Add role for screen readers
    element.setAttribute('role', 'img');
  });
}

/**
 * Identify and highlight example sections
 */
function enhanceExamples(container: HTMLElement): void {
  // Find text nodes and paragraphs containing "Example:"
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );
  
  const textNodes: Text[] = [];
  let node;
  
  while ((node = walker.nextNode())) {
    if (node.textContent?.includes('Example:')) {
      textNodes.push(node as Text);
    }
  }
  
  textNodes.forEach((textNode) => {
    const parent = textNode.parentElement;
    if (parent && !parent.classList.contains('example-highlight')) {
      // Find the containing paragraph or block element
      const blockElement = findBlockParent(parent);
      if (blockElement) {
        blockElement.classList.add('example-highlight');
        
        // Also highlight subsequent elements until next heading or section
        highlightRelatedContent(blockElement, 'example-highlight');
      }
    }
  });
}

/**
 * Identify and highlight practice questions sections
 */
function enhancePracticeQuestions(container: HTMLElement): void {
  // Find headings or text containing "Practice Questions"
  const elements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, strong');
  
  elements.forEach((element) => {
    const text = element.textContent?.trim() || '';
    
    if (text.includes('Practice Questions') && !element.classList.contains('practice-questions-highlight')) {
      const blockElement = findBlockParent(element as HTMLElement);
      if (blockElement) {
        blockElement.classList.add('practice-questions-highlight');
        
        // Highlight the questions that follow
        highlightRelatedContent(blockElement, 'practice-questions-highlight');
      }
    }
  });
}

/**
 * Identify and highlight applications sections
 */
function enhanceApplications(container: HTMLElement): void {
  // Find text containing "Applications of" or similar patterns
  const elements = container.querySelectorAll('p, strong');
  
  elements.forEach((element) => {
    const text = element.textContent?.trim() || '';
    
    if ((text.includes('Applications of') || text.includes('Application:')) && 
        !element.classList.contains('applications-highlight')) {
      const blockElement = findBlockParent(element as HTMLElement);
      if (blockElement) {
        blockElement.classList.add('applications-highlight');
      }
    }
  });
}

/**
 * Find the nearest block-level parent element
 */
function findBlockParent(element: HTMLElement): HTMLElement | null {
  const blockTags = ['P', 'DIV', 'SECTION', 'ARTICLE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'];
  
  let current = element;
  while (current && current.parentElement) {
    if (blockTags.includes(current.tagName)) {
      return current;
    }
    current = current.parentElement;
  }
  
  return element; // Fallback to the element itself
}

/**
 * Highlight content that follows a highlighted section until a natural break
 */
function highlightRelatedContent(startElement: HTMLElement, highlightClass: string): void {
  let currentElement = startElement.nextElementSibling;
  let count = 0;
  const maxElements = 5; // Limit to prevent over-highlighting
  
  while (currentElement && count < maxElements) {
    const tagName = currentElement.tagName;
    const text = currentElement.textContent?.trim() || '';
    
    // Stop at headings (new sections)
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tagName)) {
      break;
    }
    
    // Stop at other highlighted sections
    if (currentElement.classList.contains('example-highlight') ||
        currentElement.classList.contains('practice-questions-highlight') ||
        currentElement.classList.contains('applications-highlight')) {
      break;
    }
    
    // Stop at empty elements
    if (text.length === 0) {
      currentElement = currentElement.nextElementSibling;
      continue;
    }
    
    // For examples, highlight calculation steps and results
    if (highlightClass === 'example-highlight') {
      if (text.includes('=') || text.includes('coulombs') || text.includes('Answer:') || 
          /^\d+\./.test(text) || text.includes('$')) {
        (currentElement as HTMLElement).classList.add(highlightClass);
        count++;
      }
    }
    
    // For practice questions, highlight numbered questions
    if (highlightClass === 'practice-questions-highlight') {
      if (/^\d+\./.test(text) || text.includes('?')) {
        (currentElement as HTMLElement).classList.add(highlightClass);
        count++;
      }
    }
    
    currentElement = currentElement.nextElementSibling;
  }
}

/**
 * Initialize content enhancement for a specific element
 */
export function initializeContentEnhancement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    // Wait for content to be rendered, then enhance
    setTimeout(() => {
      enhanceContentDisplay(element);
    }, 100);
  }
}

/**
 * Observe content changes and re-enhance when needed
 */
export function setupContentObserver(container: HTMLElement): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    let shouldReEnhance = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldReEnhance = true;
      }
    });
    
    if (shouldReEnhance) {
      // Debounce re-enhancement
      setTimeout(() => {
        enhanceContentDisplay(container);
      }, 200);
    }
  });
  
  observer.observe(container, {
    childList: true,
    subtree: true
  });
  
  return observer;
}