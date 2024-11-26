import styles0 from './styles0.css?raw';
import styles1 from './styles1.css?raw';
import fileContent from './contactinfo.txt?raw';
import filecontent2 from './portfolio.txt?raw';

const contactContent = document.getElementById('contact-content') as HTMLElement;
const styleTag = document.getElementById('style-tag') as HTMLStyleElement;
const codeContent = document.getElementById('code-content') as HTMLElement;
const portfoliocontent = document.getElementById('portfolio-content') as HTMLElement;


let lineBuffer: string = "";

enum ContactType {
  Title = 'class="title"',
  SubTitle = 'class="sub-title"',
  Content = 'class="content"',
  Link = ""
}

export async function writeContact(contactContent: HTMLElement, text: string) {
    let fullText = '';
    const trimmedfile = cleanRawCSS(text);
    console.log(trimmedfile);

    for (let i = 0; i < trimmedfile.length; i++) {
        const character = trimmedfile[i];
        fullText = writeCharContact(fullText, character);
        contactContent.innerHTML = fullText;
        await pause(20);
    }
    if (lineBuffer.trim() !== "") {
        const trimmedLine = lineBuffer.trim();
        fullText = wrapLine(fullText, trimmedLine);
        contactContent.innerHTML = fullText;
        lineBuffer = "";
    }
}

function writeCharContact(fullText: string, character: string): string {
    lineBuffer += character;

    if (character === '\n') {
        const trimmedLine = lineBuffer.trim();
        fullText = wrapLine(fullText, trimmedLine);
        lineBuffer = "";
    } else {
        fullText += character;
    }

    return fullText;
}

let index: number = 0;

function wrapLine(fullText: string, line: string): string {

    if (fullText.includes(line)) {
      if(index === 0){
        index += 1;
        return fullText.replace(line, `<span ${ContactType.Title}>${line}\n\n</span>`);
      }
      else if(index === 1){
        index += 1;
        return fullText.replace(line, `<span ${ContactType.SubTitle}>${line}\n\n</span>`);
      }
      else if(index === 2 || index === 3){
        index ++;
        return fullText.replace(line, `<span ${ContactType.Content}>${line}\n</span>`);
      }
      else if(index === 4){
        index ++;
        return fullText.replace(line, `<span ${ContactType.Content}>${line}\n\n</span>`);
      }
      return fullText.replace(line, `<span ${ContactType.Content}>${line}</span>`);
    }
    return fullText + `<span>${line}</span><br>`;
}

let index2: number = 0;

function wrapPortfolio(fullText: string, line: string): string {

  if (fullText.includes(line)) {
    if(index2 === 0){
      index2 += 1;
      return fullText.replace(line, `<span ${ContactType.Title}>${line}\n\n</span>`);
    }
    else if(index2 === 1){
      index2 += 1;
      return fullText.replace(line, `<span ${ContactType.SubTitle}>${line}\n\n</span>`);
    }
    else if(index2 >= 2){
      index2 ++;
      return fullText.replace(line, `<span ${ContactType.Content}>${line}\n</span>`);
    }
    return fullText.replace(line, `<span ${ContactType.Content}>${line}</span>`);
  }
  return fullText + `<span>${line}</span><br>`;
}

//********************************************************************* */

let fullText = '';

async function writeToDocument(rawCSS: string) {
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
      await pause(20);
    }
    if(character === '}' || character === ','){
      await pause(20);
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

export function cleanRawCSS(rawCSS: string): string {
  return rawCSS
    .replace(/[\r]/g, '')          // carriage return
    .replace(/^\s+/gm, '')         // leading spaces
    .replace(/\s+$/gm, '')         // trailing spaces
    .replace(/\n+/g, '\n')         // multiple newlines
    .trim();                       // extra spaces or blank lines
}

export function pause(duration: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, duration));
}


async function Start(cleanedone: string, cleanedtwo: string) {
  console.log('Starting with cleanedone:', cleanedone);
  //await writeToDocument(cleanedone);
  console.log('Finished cleanedone, moving to contact');
  //await writeContact(contactContent, fileContent);
  console.log('Finished contact, starting cleanedtwo:', cleanedtwo);
  //await writeToDocument(cleanedtwo);
  await writeContact(portfoliocontent, filecontent2)
}

const cleanedCSS = cleanRawCSS(styles0);
const cleanedCSStwo = cleanRawCSS(styles1); // Should be different

Start(cleanedCSS, cleanedCSStwo);