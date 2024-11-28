import styles0 from './styles0.css?raw';
import styles1 from './styles1.css?raw';
import styles2 from './styles2.css?raw';
import fileContent from './contactinfo.txt?raw';
import filecontent2 from './portfolio.txt?raw';


const contactContent = document.getElementById('contact-content') as HTMLElement;
const styleTag = document.getElementById('style-tag') as HTMLStyleElement;
const codeContent = document.getElementById('code-content') as HTMLElement;
const portfoliocontent = document.getElementById('portfolio-content') as HTMLElement;



enum ContactType {
  Title = 'class="title"',
  SubTitle = 'class="sub-title"',
  Content = 'class="content"',
  Link = 'class="link'
}
enum CurrentIteration{
  Contact,
  Portfolio
}

let lineBuffer: string = "";

export async function writeContact(contactContent: HTMLElement, text: string, iteration: CurrentIteration) {
    let fullText = '';
    const trimmedfile = cleanRawCSS(text);
    console.log(trimmedfile);

    for (let i = 0; i < trimmedfile.length; i++) {
        const character = trimmedfile[i];
        fullText = writeCharContact(fullText, character, iteration);
        contactContent.innerHTML = fullText;
        await pause(20);
    }
    if (lineBuffer.trim() !== "") {
        const trimmedLine = lineBuffer.trim();
        if(iteration === CurrentIteration.Contact){
        fullText = wrapLine(fullText, trimmedLine);
        }
        else if (iteration === CurrentIteration.Portfolio){
        fullText = wrapPortfolio(fullText, trimmedLine);      
        }
        contactContent.innerHTML = fullText;
        lineBuffer = "";
    }
}

function writeCharContact(fullText: string, character: string, iteration: CurrentIteration): string {
    lineBuffer += character;

    if (character === '\n') {
        const trimmedLine = lineBuffer.trim();
        if(iteration === CurrentIteration.Contact){
          fullText = wrapLine(fullText, trimmedLine);
          }
          else if (iteration === CurrentIteration.Portfolio){
          fullText = wrapPortfolio(fullText, trimmedLine);      
          }
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
      let name = extractName(line);
      return fullText.replace(line,`<span class="link"><a href="${line.trim()}" target="_blank">${name}</a></span>\n`);
    }
    return fullText.replace(line, `<span ${ContactType.Content}>${line}</span>`);
  }
  return fullText + `<span>${line}</span><br>`;
}


function extractName(line: string): string{
  let name: string = ""
  let indexOfLastBackslash = 0;

for(let i = line.length -1; i >= 0; i -= 1){
  if(line[i] === "/"){
    indexOfLastBackslash = i+1;
    break;
  }
}

for( let y = indexOfLastBackslash; y <= line.length -1; y++){
  name += line[y];
}

return name;
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
    if(lookForDot.test(lastTwo) || character === '?' || character === '!'){
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

export function cleanRawCSS(rawCSS: string): string {
  return rawCSS
    .replace(/[\r]/g, '')          // carriage return
    .replace(/^\s+/gm, '')         // leading spaces
    .replace(/\s+$/gm, '')         // trailing spaces
    .replace(/\n+/g, '\n')         // multiple newlines
    .trim();                       // extra spaces or blank liness
}

let hurryUp: boolean = false;

const toggleButton = document.getElementById('toggleButton') as HTMLButtonElement;

toggleButton.addEventListener('click', () =>{
  hurryUp = !hurryUp;
  toggleButton.innerText = hurryUp ? 'Calm Down!' : 'Hurry Up!';
})

function removeButtonAtEnd(){
  const button = document.getElementById('toggleButton') as HTMLButtonElement;
  button.classList.add('hidden');

}

export function pause(duration: number): Promise<void> {

  if(!hurryUp){
  return new Promise(resolve => setTimeout(resolve, duration));
  }
  else{
    return new Promise(resolve => setTimeout(resolve, 0));
  }
}


async function Start(cleanedone: string, cleanedtwo: string, cleanedthree: string) {
  console.log('Starting with cleanedone:', cleanedone);
  await writeToDocument(cleanedone);
  console.log('Finished cleanedone, moving to contact');
  await writeContact(contactContent, fileContent, CurrentIteration.Contact);
  console.log('Finished contact, starting cleanedtwo:', cleanedtwo);
  await writeToDocument(cleanedtwo);
  await writeContact(portfoliocontent, filecontent2, CurrentIteration.Portfolio)
  await writeToDocument(cleanedCSSthree);
  removeButtonAtEnd();
}

const cleanedCSS = cleanRawCSS(styles0);
const cleanedCSStwo = cleanRawCSS(styles1);
const cleanedCSSthree = cleanRawCSS(styles2);

Start(cleanedCSS, cleanedCSStwo, cleanedCSSthree);