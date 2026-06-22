const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function testParse() {
  console.log(Object.keys(pdfParse));
  const parser = pdfParse.default || pdfParse.pdfParse || pdfParse;
  const filePath = path.resolve('../public/Akhil_Makwana_Resume-4.pdf');
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    console.log('--- SUCCESS ---');
    console.log('Text Length:', data.text.length);
    console.log('Preview:', data.text.substring(0, 1000));
  } catch (err) {
    console.error('--- ERROR ---');
    console.error(err);
  }
}

testParse();
