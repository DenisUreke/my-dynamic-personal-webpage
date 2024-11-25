import styles0 from './styles0.css?raw';

const styleTag = document.getElementById('style-tag') as HTMLStyleElement;
const codeContent = document.getElementById('code-content') as HTMLElement;

async function writeToDocument(rawCSS: string) {
  let fullText = ''; // Buffer for the live display
  let styleBuffer = ''; // Buffer for CSS rules to apply live

  for (let i = 0; i < rawCSS.length; i++) {
    const character = rawCSS[i];

    // Process the current character and update fullText
    fullText = writeChar(fullText, character);

    // Update the live coding display
    codeContent.innerHTML = fullText;
    codeContent.scrollTop = codeContent.scrollHeight; // Ensure scrolling stays at the bottom

    // Add the character to the style buffer
    styleBuffer += character;

    // Append to the <style> tag when a rule/block ends
    if (character === ';' || character === '}') {
      styleTag.textContent += styleBuffer;
      styleBuffer = ''; // Clear the buffer
    }

    // Simulate typing delay and allow browser to repaint
    await new Promise(resolve => setTimeout(resolve, 50)); // Adjust speed as needed
  }
}

let openComment = false;
const commentRegex = /(\/\*(?:[^](?!\/\*))*\*)$/;
const keyRegex = /([a-zA-Z- ^\n]*)$/;
const valueRegex = /([^:]*)$/;
const selectorRegex = /(.*)$/;
const pxRegex = /\dp/;
const pxRegex2 = /p$/;

function writeChar(fullText: string, char: string) {
  if (openComment && char !== '/') {
    // Short-circuit during a comment so we don't highlight inside it.
    fullText += char;
  } else if (char === '/' && openComment === false) {
    openComment = true;
    fullText += char;
  } else if (char === '/' && fullText.slice(-1) === '*' && openComment === true) {
    openComment = false;
    // Unfortunately we can't just open a span and close it, because the browser will helpfully
    // 'fix' it for us, and we'll end up with a single-character span and an empty closing tag.
    fullText = fullText.replace(commentRegex, '<span class="comment">$1/</span>');
  } else if (char === ':') {
    fullText = fullText.replace(keyRegex, '<span class="key">$1</span>:');
  } else if (char === ';') {
    fullText = fullText.replace(valueRegex, '<span class="value">$1</span>;');
  } else if (char === '{') {
    fullText = fullText.replace(selectorRegex, '<span class="selector">$1</span>{');
  } else if (char === 'x' && pxRegex.test(fullText.slice(-2))) {
    fullText = fullText.replace(pxRegex2, '<span class="value px">px</span>');
  } else {
    fullText += char;
  }
  return fullText;
}

writeToDocument(styles0);