import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const PdfViewer = ({ pdfFile, viewMode }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const renderPages = () => {
    const pages = [];
    if (viewMode === 'scroll') {
      for (let i = pageNumber; i < pageNumber + 5 && i <= numPages; i++) {
        pages.push(<Page key={i} pageNumber={i} />);
      }
    } else {
      pages.push(<Page key={pageNumber} pageNumber={pageNumber} />);
    }
    return pages;
  };

  const nextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };

  const prevPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const nextPages = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 5, numPages));
  };

  const prevPages = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 5, 1));
  };

  return (
    <div className="pdf-container">
      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {renderPages()}
      </Document>
      <p>Page {pageNumber} of {numPages}</p>
      {viewMode === 'page' && (
        <div>
          <button onClick={prevPage} disabled={pageNumber <= 1}>Previous</button>
          <button onClick={nextPage} disabled={pageNumber >= numPages}>Next</button>
        </div>
      )}
      {viewMode === 'scroll' && (
        <div>
          <button onClick={prevPages} disabled={pageNumber <= 1}>Previous 5 Pages</button>
          <button onClick={nextPages} disabled={pageNumber + 5 > numPages}>Next 5 Pages</button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
