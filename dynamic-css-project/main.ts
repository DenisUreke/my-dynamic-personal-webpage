import styles0 from './styles0.css?raw';

// Function to inject raw CSS into a <style> tag and display it in a <pre> tag with auto-scroll
async function injectCssWithTyping(css: string, delay: number = 20) {
  const styleTag = document.getElementById('style-tag') as HTMLStyleElement;
  const preTag = document.getElementById('code-content');

  let currentIndex = 0;

  function typeNextCharacter() {
    if (currentIndex < css.length) {
      const nextChar = css[currentIndex];
      styleTag.textContent += nextChar;
      if (preTag) {
        preTag.textContent += nextChar;

        // Auto-scroll
        preTag.scrollTop = preTag.scrollHeight;

        // Auto-scroll
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth' // Smooth scrolling for better UX
        });
      }
      currentIndex++;
      setTimeout(typeNextCharacter, delay); // Wait for the next character
    }
  }

  typeNextCharacter();
}

async function extractObjects(styles0: string): Promise <string>{
    const selectorRegex = /^([^{]+){/;
    const propertyRegex = /([a-zA-Z-]+):/g;
    const valueRegex = /:\s*([^;]+);/g;
    const bracketRegex = /[{}]/g;
    const commentRegex = /\/\*.*\*\//g;

    let highlighted = styles0;

    // Highlight comments
    highlighted = highlighted.replace(commentRegex, (match) => `<span class="comments">${match}</span>`);

    // Highlight selectors
    highlighted = highlighted.replace(selectorRegex, (match, selector) => 
      `<span class="selector">${selector.trim()}</span> <span class="brackets">{</span>`
    );

    // Highlight properties
    highlighted = highlighted.replace(propertyRegex, (match, property) => 
      `<span class="property">${property}</span>:`
    );

    // Highlight values
    highlighted = highlighted.replace(valueRegex, (match, value) => {
      const valueClass = /^[0-9.]+(px|em|rem|%|vh|vw|s)?$/.test(value.trim())
        ? 'value_integer'
        : 'value_text';
      return `: <span class="${valueClass}">${value.trim()}</span>;`;
    });

    // Highlight brackets
    highlighted = highlighted.replace(bracketRegex, (match) => 
      `<span class="brackets">${match}</span>`
    );

    return highlighted;

}

// Inject the CSS with a typing effect
injectCssWithTyping(styles0, 20);

