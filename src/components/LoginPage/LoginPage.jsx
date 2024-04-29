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
    const documentDefinition = {
      content: [],
    };

    // Iterate over each question in the JSON data
    data.questions.forEach((question) => {
      const questionContent = {
        text: question.title,
        fontSize: 14,
        bold: true,
        //questions title margins [left, top, right, bottom]
        margin: [0, 0, 0, 10],
      };

      documentDefinition.content.push(questionContent);

      // Iterate over each element in the question
      question.elements.forEach((element) => {
        if (element.type === 'text') {
          const textContent = {
            text: element.value,
            fontSize: 12,
            // text margins [left, top, right, bottom]
            margin: [20, 20, 30, 35],
          };
          documentDefinition.content.push(textContent);
        } else if (element.type === 'image') {
          const imageContent = {
            //image formatting here: https://pdfmake.github.io/docs/0.1/document-definition-object/images/
            image: element.value,
            width: 150, // Adjust the width as needed
          };
          documentDefinition.content.push(imageContent);
        }
      });

      // Add spacing between questions
      documentDefinition.content.push({ text: '', margin: [0, 0, 0, 20] });
    });

    // Create PDF
    var pdfDoc = pdfmake.createPdf(documentDefinition);
    //opens pdf in a new tab
    pdfDoc.open();
    pdfDoc.download('sample.pdf'); // Download the generated PDF
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
