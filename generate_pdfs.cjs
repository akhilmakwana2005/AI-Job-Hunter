const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a real resume PDF
const doc1 = new PDFDocument();
doc1.pipe(fs.createWriteStream('real_resume.pdf'));
doc1.fontSize(25).text('John Doe - Software Engineer', 100, 100);
doc1.fontSize(12).text('\nExperience:\n- Worked at Google as a frontend engineer.\n\nEducation:\n- BSc Computer Science\n\nSkills:\nReact, Node.js, JavaScript');
doc1.end();

// Create a dummy non-resume PDF (e.g. Bank Statement)
const doc2 = new PDFDocument();
doc2.pipe(fs.createWriteStream('bank_statement.pdf'));
doc2.fontSize(25).text('Bank of America - Statement', 100, 100);
doc2.fontSize(12).text('\nAccount Number: 123456789\nBalance: $5000\nTransaction 1: Groceries $50\nTransaction 2: Rent $1000');
doc2.end();

// Create a cover letter PDF
const doc3 = new PDFDocument();
doc3.pipe(fs.createWriteStream('cover_letter.pdf'));
doc3.fontSize(25).text('Cover Letter', 100, 100);
doc3.fontSize(12).text('\nDear Hiring Manager,\n\nI am writing to apply for the Software Engineer role. I have great skills and experience.\n\nSincerely,\nJohn Doe');
doc3.end();

console.log('PDFs generated.');
