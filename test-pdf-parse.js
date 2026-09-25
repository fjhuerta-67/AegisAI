import fs from 'fs';
import * as pdfModule from 'pdf-parse';

async function test() {
  try {
    const data = fs.readFileSync('dummy.pdf');
    // For pdf-parse@2.4.5 in ESM, let's see what pdfModule is
    console.log(Object.keys(pdfModule));
    
    const PDFParseClass = pdfModule.PDFParse || pdfModule.default?.PDFParse;
    const parser = new PDFParseClass({ data });
    const result = await parser.getText();
    console.log("Extracted text:", result.text);
  } catch (e) {
    console.error(e);
  }
}
test();
