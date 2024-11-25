import styles0 from './styles0.css?raw';
import fileContent from './contactinfo.txt?raw';

const styleTag = document.getElementById('style-tag') as HTMLStyleElement;
const codeContent = document.getElementById('code-content') as HTMLElement;
const contactContent = document.getElementById('contact-content') as HTMLElement;
const portfoliocontent = document.getElementById('portfolio-content') as HTMLElement;

enum Box{
  Code,
  Contanct, 
  Portfolio
}

async function writeContact(){
  
  for(let i = 0; i < fileContent.length; i++){
    contactContent.innerHTML += fileContent[i];
    await pause(20);
  }
}


async function writeToDocument(rawCSS: string) {
  let fullText = '';
  let styleBuffer = '';

  for (let i = 0; i < rawCSS.length; i++) {
    const character = rawCSS[i];

    fullText = writeChar(fullText, character);
    
    const lastFewChars = fullText.slice(-8);
    if (lastFewChars.includes('/</span>')) {
      fullText += '<br>';
    }
    if(character === '}'){
      fullText += '<br>'
    }

    const lastTwo = fullText.slice(-2);
    const lookForDot = /([a-zA-Z]\.|\.{2})/;
    codeContent.innerHTML = fullText;
    if(lookForDot.test(lastTwo) || character === '?'){
      await pause(1200);
    }
    if(character === '}' || character === ','){
      await pause(500);
    }

    codeContent.scrollTop = codeContent.scrollHeight;
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });

    styleBuffer += character;

    if (character === ';' || character === '}') {
      styleTag.textContent += styleBuffer;
      styleBuffer = '';
    }

    await pause(20);
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
    fullText += char;
  } else if (char === '/' && openComment === false) {
    openComment = true;
    fullText += char;
  } else if (char === '/' && fullText.slice(-1) === '*' && openComment === true) {
    openComment = false;
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

function cleanRawCSS(rawCSS: string): string {
  return rawCSS
    .replace(/[\r]/g, '')          // carriage return
    .replace(/^\s+/gm, '')         // leading spaces
    .replace(/\s+$/gm, '')         // trailing spaces
    .replace(/\n+/g, '\n')         // multiple newlines
    .trim();                       // extra spaces or blank lines
}

function pause(duration: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, duration));
}

const cleanedCSS = cleanRawCSS(styles0);
//writeToDocument(cleanedCSS);
writeContact();