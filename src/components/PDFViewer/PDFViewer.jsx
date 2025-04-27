import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { IconChevronLeft, IconChevronRight, IconLoader } from "@tabler/icons-react";

// PDF.js worker setup (Consider moving this to App.js or index.js to run once)
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ pdfFile, viewMode }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); // Represents the *first* page being displayed (even in two-page view)
  const [isLoading, setIsLoading] = useState(true);
  const [renderError, setRenderError] = useState(null);
  const [isTwoPageView, setIsTwoPageView] = useState(false); // State for two-page view
  const [pageWidth, setPageWidth] = useState(800); // Calculated width for PDF pages

  const viewerContainerRef = useRef(null); // Ref to get container width

  // --- Document Load Handlers ---
  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
    setPageNumber(1);
    setIsLoading(false);
    setRenderError(null);
    // Initial width calculation after document loads
    handleResize();
  }, []);

  const onDocumentLoadError = useCallback((error) => {
      console.error("Error loading document:", error);
      setRenderError(`Failed to load PDF: ${error.message}`);
      setIsLoading(false);
  }, []);

  // --- Width Calculation & Two-Page View Logic ---
  const handleResize = useCallback(() => {
      const containerWidth = viewerContainerRef.current?.clientWidth;
      if (!containerWidth) return;

      const singlePageMaxWidth = 800; // Max width for a single page
      const twoPageBreakpoint = 1024; // Example breakpoint: Show two pages above 1024px container width

      if (viewMode === 'page' && containerWidth >= twoPageBreakpoint) {
          setIsTwoPageView(true);
          // Calculate width for two pages side-by-side with some gap
          setPageWidth(Math.min((containerWidth / 2) - 20, singlePageMaxWidth)); // Subtract gap/padding
      } else {
          setIsTwoPageView(false);
          // Calculate width for single page view (responsive)
          setPageWidth(Math.min(containerWidth * 0.95, singlePageMaxWidth)); // Use slightly less than full width
      }
  }, [viewMode]); // Rerun when viewMode changes

  // Effect for resize listener
  useEffect(() => {
    // Initial calculation
    handleResize();
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]); // Rerun if handleResize changes (due to viewMode change)

  // --- Page Navigation Handlers ---
  const goToPage = useCallback((newPageNumber) => {
      setPageNumber(Math.max(1, Math.min(newPageNumber, numPages)));
  }, [numPages]);

  const nextPage = useCallback(() => {
      const increment = isTwoPageView ? 2 : 1;
      goToPage(pageNumber + increment);
  }, [goToPage, pageNumber, isTwoPageView]);

  const prevPage = useCallback(() => {
      const decrement = isTwoPageView ? 2 : 1;
      goToPage(pageNumber - decrement);
  }, [goToPage, pageNumber, isTwoPageView]);

  // --- Render Logic ---
  const renderPageContent = () => {
    if (viewMode === 'scroll') {
        // Render all pages for scrolling
        return Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            className="mb-4 shadow-md pdf-page" // Added pdf-page class
            renderAnnotationLayer={true}
            renderTextLayer={true}
            loading={<div className="flex justify-center items-center p-4 h-64"><IconLoader className="animate-spin h-8 w-8 text-mehroon"/></div>}
            error={<div className="text-red-500 p-4 h-64">Failed to load page {index + 1}.</div>}
            width={pageWidth} // Use calculated width
          />
        ));
    } else {
        // Render one or two pages for page-by-page view
        const pagesToRender = [];
        // First page (always attempt to render if within bounds)
        if (pageNumber <= numPages) {
            pagesToRender.push(
                <Page
                    key={`page_${pageNumber}`}
                    pageNumber={pageNumber}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                    loading={<div className="flex justify-center items-center p-4 h-64"><IconLoader className="animate-spin h-8 w-8 text-mehroon"/></div>}
                    error={<div className="text-red-500 p-4 h-64">Failed to load page {pageNumber}.</div>}
                    width={pageWidth}
                    className="pdf-page" // Added pdf-page class
                />
            );
        }
        // Second page (only in two-page view and if within bounds)
        if (isTwoPageView && pageNumber + 1 <= numPages) {
             pagesToRender.push(
                <Page
                    key={`page_${pageNumber + 1}`}
                    pageNumber={pageNumber + 1}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                    loading={<div className="flex justify-center items-center p-4 h-64"><IconLoader className="animate-spin h-8 w-8 text-mehroon"/></div>}
                    error={<div className="text-red-500 p-4 h-64">Failed to load page {pageNumber + 1}.</div>}
                    width={pageWidth}
                    className="pdf-page" // Added pdf-page class
                />
            );
        }
        return (
            <div className={`flex justify-center ${isTwoPageView ? 'gap-4' : ''}`}>
                {pagesToRender}
            </div>
        );
    }
  };

  // Determine page range text for display
  const getPageRangeText = () => {
      if (!numPages) return '';
      if (viewMode === 'scroll') return `Total Pages: ${numPages}`; // Simple total for scroll
      if (isTwoPageView) {
          const endPage = Math.min(pageNumber + 1, numPages);
          return `Pages ${pageNumber}-${endPage} of ${numPages}`;
      } else {
          return `Page ${pageNumber} of ${numPages}`;
      }
  };

  // Determine if next/prev buttons should be disabled
  const isPrevDisabled = pageNumber <= 1 || isLoading;
  const isNextDisabled = isLoading || (isTwoPageView ? pageNumber + 2 > numPages : pageNumber + 1 > numPages);

  return (
    <div ref={viewerContainerRef} className="pdf-viewer-container w-full flex flex-col items-center">
      {/* Loading Indicator */}
       {isLoading && !renderError && (
         <div className="flex justify-center items-center py-10 text-mehroon">
           <IconLoader className="animate-spin h-10 w-10 mr-3" />
           Loading PDF...
         </div>
       )}

      {/* Error Message */}
      {renderError && (
          <div className="text-center text-red-600 p-6 bg-red-100 rounded-md border border-red-400 w-full max-w-3xl">
              {renderError}
          </div>
      )}

      {/* Document Renderer (only if pdfFile exists and no error) */}
      {pdfFile && !renderError && (
        <>
            {/* Pagination Controls (Only for 'page' viewMode) */}
            {viewMode === 'page' && numPages && (
                <div className="flex justify-center items-center space-x-4 my-4 p-2 bg-lorange rounded-full shadow-sm border border-pink w-fit mx-auto sticky top-2 z-10"> {/* Made controls sticky */}
                <button
                    onClick={prevPage}
                    disabled={isPrevDisabled}
                    className="p-2 rounded-full text-mehroon disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-orange transition duration-200"
                    aria-label="Previous Page(s)"
                >
                    <IconChevronLeft size={24} />
                </button>
                <p className="text-sm font-medium text-mehroon select-none whitespace-nowrap">
                    {getPageRangeText()}
                </p>
                <button
                    onClick={nextPage}
                    disabled={isNextDisabled}
                    className="p-2 rounded-full text-mehroon disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-orange transition duration-200"
                    aria-label="Next Page(s)"
                >
                    <IconChevronRight size={24} />
                </button>
                </div>
            )}

            {/* PDF Document Area */}
            {/* Adjusted scroll height and added class */}
            <div className={`pdf-document-wrapper w-full ${viewMode === 'scroll' ? 'max-h-[70vh] overflow-y-auto border border-gray-300 rounded-md p-2 bg-gray-100' : 'overflow-x-auto'}`}>
                <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<></>} // Handled above
                    error={<></>} // Handled above
                    options={{ // Standard options
                        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                        cMapPacked: true,
                        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`
                    }}
                    className="flex flex-col items-center pdf-document-container" // Added class
                >
                    {renderPageContent()}
                </Document>
            </div>

             {/* Bottom Pagination Controls (Optional) */}
             {viewMode === 'page' && numPages && numPages > (isTwoPageView ? 2 : 1) && ( // Only show if more than 1/2 pages
                <div className="flex justify-center items-center space-x-4 mt-4 p-2 bg-lorange rounded-full shadow-sm border border-pink w-fit mx-auto">
                <button
                    onClick={prevPage}
                    disabled={isPrevDisabled}
                    className="p-2 rounded-full text-mehroon disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-orange transition duration-200"
                    aria-label="Previous Page(s)"
                >
                    <IconChevronLeft size={24} />
                </button>
                <p className="text-sm font-medium text-mehroon select-none whitespace-nowrap">
                    {getPageRangeText()}
                </p>
                <button
                    onClick={nextPage}
                    disabled={isNextDisabled}
                    className="p-2 rounded-full text-mehroon disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-orange transition duration-200"
                    aria-label="Next Page(s)"
                >
                    <IconChevronRight size={24} />
                </button>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default PdfViewer;
