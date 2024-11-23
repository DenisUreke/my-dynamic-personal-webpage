import styles0 from './styles0.css?raw';

// Function to inject raw CSS into a <style> tag and display it in a <pre> tag with auto-scroll
function injectCssWithTyping(css: string, delay: number = 20) {
  const styleTag = document.createElement('style'); // Create the <style> tag
  document.head.appendChild(styleTag); // Append it to the <head>

  const preTag = document.getElementById('code-content'); // Get the <pre> tag
  const scrollBox = document.querySelector('.scroll-box'); // Get the .scroll-box container

  let currentIndex = 0;

  function typeNextCharacter() {
    if (currentIndex < css.length) {
      const nextChar = css[currentIndex];
      styleTag.textContent += nextChar; // Add to the <style> tag
      if (preTag) {
        preTag.textContent += nextChar; // Add to the <pre> tag

        // Auto-scroll the <pre> tag
        preTag.scrollTop = preTag.scrollHeight;

        // Auto-scroll the .scroll-box if it exists
        if (scrollBox) {
          scrollBox.scrollTop = scrollBox.scrollHeight;
        }

        // Auto-scroll the main HTML page
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth' // Smooth scrolling for better UX
        });
      }
      currentIndex++;
      setTimeout(typeNextCharacter, delay); // Wait for the next character
    }
  }

  typeNextCharacter(); // Start typing
}

// Inject the CSS with a typing effect
injectCssWithTyping(styles0, 20);