import fileContent from './contactinfo.txt?raw';
import { pause, cleanRawCSS } from './main';

let lineBuffer: string = "";
let index: number = 0;

enum ContactType {
  Title = 'class="title"',
  SubTitle = 'class="sub-title"',
  Content = 'class="content"'
}

export async function writeContact(contactContent: HTMLElement) {
    let fullText = '';
    const trimmedfile = cleanRawCSS(fileContent);
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