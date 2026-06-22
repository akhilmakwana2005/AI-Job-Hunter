import fs from 'fs';
import path from 'path';
async function testParse() {
  const pdfParseMod = await import('pdf-parse');
  console.log('Keys:', Object.keys(pdfParseMod));
  const pdfParse = pdfParseMod.default || pdfParseMod;
  const filePath = path.resolve('../public/Akhil_Makwana_Resume-4.pdf');
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    console.log('--- SUCCESS ---');
    console.log('Text Length:', data.text.length);
    console.log('Preview:', data.text.substring(0, 500));
  } catch (err) {
    console.error('--- ERROR ---');
    console.error(err);
  }
}

testParse();
