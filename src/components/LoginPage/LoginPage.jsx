import React, { useState } from 'react';
import { PDFViewer, Document, Page, Text, Image } from '@react-pdf/renderer';
import pdfmake from 'pdfmake';

// Assign font files
pdfMake.fonts = {
  Roboto: {
    normal:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics:
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
};

// Optional: Set Roboto as the default font
pdfMake.defaultFont = 'Roboto';
// shortened book file for testing
import testJSON from './testfile.json';

const LoginPage = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [pdfDocument, setPdfDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  //parsing test data
  console.log('testJSON', testJSON);

  const handleJsonInputChange = (event) => {
    setJsonInput(event.target.value);
  };

  const handleSubmit = (event) => {
    //for running testJSON file in project
    testPDFmake(testJSON);
  };

  const testPDFmake = (data) => {
    //pulling metadata from JSON to use
    const metadata = data.metadata;
    const {
      bucketId,
      pdfOnly,
      addTitleDivider,
      pdfFileId,
      bookTitle,
      author,
      url,
    } = metadata;

    console.log('Metadata:', {
      bucketId,
      pdfOnly,
      addTitleDivider,
      pdfFileId,
      bookTitle,
      author,
      url,
    });

    const documentDefinition = {
      content: [],
      //Here we set conditions for the page and overall settings
      //some things I think we'll need
      //characterSpacing: number: size of the letter spacing in pt
      //alignment: 'justify',
      // font: string: name of the font
      // fontSize: number: size of the font in pt
      //no 'orphan child' at end of chapter solution: https://pdfmake.github.io/docs/0.1/document-definition-object/page/
      pageMargins: [40, 60, 40, 60], // Adjust margins as needed

      //adding footer and page numbers
      footer: (currentPage, pageCount) => {
        return {
          //return  ${pageCount} to see total number of pages
          text: `Page ${currentPage} of ${pageCount}`,
          //modify for print version, left/right side alternating
          alignment: 'center',

          fontSize: 10,
          margin: [0, 30, 0, 0], // Margin from bottom
        };
      },
    };

    //creating title page
    const titlePage = {
      text: metadata.bookTitle,
      fontSize: 24,
      bold: true,
      alignment: 'center',
      margin: [0, 100, 0, 0], // Top margin
    };
    documentDefinition.content.push(titlePage);

    const authorTitle = {
      text: metadata.author,
      fontSize: 18,
      bold: true,
      alignment: 'center',
      margin: [0, 20, 0, 0], // Top margin
    };
    documentDefinition.content.push(authorTitle);
    documentDefinition.content.push({ text: '', pageBreak: 'before' });

    const TOC = {
      toc: {
        // id: 'mainToc'  // optional
        title: { text: 'Table of Contents', style: 'header' },
      },
    };
    documentDefinition.content.push(TOC);
    documentDefinition.content.push({ text: '', pageBreak: 'before' });

    // variable chapter page numbers
    const chapterPageNumbers = [];

    // Iterate over each question in the JSON data to populate TOC and chapters
    data.questions.forEach((question, index) => {
      // Add page break before starting a new chapter
      if (index !== 0) {
        documentDefinition.content.push({ text: '', pageBreak: 'before' });
      }

      // Add ID for linking from TOC
      const chapterId = `Chapter${index + 1}`;

      const chapterTitle = {
        text: question.title,
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10], // Bottom margin
        id: chapterId, // Set ID for linking from TOC
        tocItem: true,
      };
      documentDefinition.content.push(chapterTitle);

      console.log(chapterTitle);

      // Record the page number for the current chapter
      chapterPageNumbers.push({ chapterId: chapterId, pageNumber: '?' });
      console.log('chapter page numbers', chapterPageNumbers);

      // Iterate over each element in the chapter
      question.elements.forEach((element) => {
        if (element.type === 'text') {
          const textContent = {
            text: element.value,
            fontSize: 12,
            margin: [20, 20, 30, 0], // Text margins
          };
          documentDefinition.content.push(textContent);
        } else if (element.type === 'image') {
          const imageContent = {
            image: element.value,
            width: 150, // Adjust the width as needed
          };
          documentDefinition.content.push(imageContent);
        }
      });

      // Add spacing between chapters
      documentDefinition.content.push({ text: '', margin: [0, 0, 0, 20] });
    });

    // Create PDF
    var pdfDoc = pdfmake.createPdf(documentDefinition);
    //opens pdf in a new tab
    pdfDoc.open();
    pdfDoc.download(`${bookTitle}`); // Download the generated PDF
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Input your JSON file here</p>
          <center>
            <br />
            <br />
            <textarea
              id="jsonInput"
              name="jsonInput"
              value={jsonInput}
              onChange={handleJsonInputChange}
              rows={25}
              cols={80}
              placeholder="Enter JSON"
            />
          </center>
        </div>
        <br />
        <center>
          <input className="btn" type="submit" />
          <br />
          See PDF Below
          <br />
          {loading && <p>Loading PDF...</p>}
        </center>
      </form>
      <br />
      <br />
      <div style={{ width: '100%', height: '800px' }}>
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          {pdfDocument}
        </PDFViewer>
      </div>
    </div>
  );
};

export default LoginPage;
