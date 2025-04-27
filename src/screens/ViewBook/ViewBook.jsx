import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PdfViewer from '../../components/PDFViewer/PDFViewer'; // [cite: src/components/PDFViewer/PDFViewer.jsx]
import { pdfjs } from 'react-pdf';
import Navbar from '../../components/navbar/navbar'; // [cite: src/components/navbar/navbar.jsx]
import { IconLoader, IconBook } from "@tabler/icons-react"; // Added icons

const ViewBooks = () => {
  const { ID } = useParams(); // Destructure ID directly

  // State for book details and loading
  const [bookTitle, setBookTitle] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [viewMode, setViewMode] = useState('page'); // 'page' or 'scroll'
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // PDF.js worker setup
  useEffect(() => {
      // Set workerSrc only once, preferably outside the component or in an effect with empty dependency array
      // Ensure pdfjs.version is available
      if (pdfjs.version) {
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      } else {
        console.warn("pdfjs.version not found, workerSrc might not be set correctly.");
        // Fallback or default version if needed
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.mjs`; // Example fallback
      }
  }, []);


  // Fetch book details and PDF
  useEffect(() => {
    const fetchBookDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch metadata
        const detailsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/books/${ID}/details`);
        const book = detailsResponse.data;
        setBookTitle(book.title);
        setBookDescription(book.description);
        setAuthorName(book.author); // API returns string 'author' [cite: Backend API Documentation]
        // Assuming featuredImage is a base64 string or URL
        setFeaturedImage(book.featuredImage?.startsWith('data:image') ? book.featuredImage : `data:image/jpeg;base64,${book.featuredImage}`);

        // Fetch PDF blob
        const pdfResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/books/${ID}/download`, {
          responseType: 'blob'
        });
        const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfFile(pdfBlobUrl);

      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (ID) {
        fetchBookDetails();
    }

    // Cleanup Blob URL on component unmount
    return () => {
        if (pdfFile) {
            URL.revokeObjectURL(pdfFile);
        }
    };
  }, [ID]); // Rerun effect if ID changes


  // Toggle view mode
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-mehroon">
          <IconLoader className="animate-spin h-16 w-16" />
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-center text-red-600 p-8">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-green"> {/* Ensure base background */}
      <Navbar/>
      <div className='flex-grow container mx-auto mt-8 mb-12 px-4 lg:px-8'> {/* Centered container */}

        {/* Book Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Featured Image */}
          <div className="md:col-span-1 flex justify-center items-start">
            {featuredImage ? (
                <img
                    src={featuredImage}
                    alt={bookTitle}
                    className='w-full max-w-xs md:max-w-full h-auto object-cover rounded-lg shadow-lg border-2 border-pink'
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x450/cccccc/ffffff?text=Image+Error'; }}
                />
            ) : (
                 <div className="w-full max-w-xs md:max-w-full h-[450px] bg-gray-200 rounded-lg shadow-lg border-2 border-pink flex items-center justify-center text-mehroon">
                     <IconBook size={48} />
                 </div>
            )}
          </div>

          {/* Text Details & Controls */}
          <div className="md:col-span-2 bg-offwhite rounded-lg shadow-lg p-6 border border-mehroon text-mehroon">
            <h2 className="text-3xl font-bold text-mehroon mb-3 font-display">{bookTitle}</h2>
            <p className="text-lg text-mehroon mb-4">
                <strong className="font-semibold">Author:</strong> {authorName || 'Unknown'}
            </p>
            <p className="text-base text-mehroon text-opacity-80 mb-6">{bookDescription || 'No description available.'}</p>

            {/* View Mode Toggle Buttons */}
            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                type="button"
                onClick={() => handleViewModeChange('page')}
                className={`px-5 py-2 rounded-full font-semibold transition duration-300 ease-in-out flex items-center justify-center text-sm group ${
                  viewMode === 'page'
                    ? 'bg-mehroon text-white shadow-md ring-2 ring-offset-2 ring-mehroon'
                    : 'bg-lorange text-mehroon border border-mehroon hover:bg-mehroon hover:text-white hover:shadow-md'
                }`}
              >
                View Page by Page
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('scroll')}
                 className={`px-5 py-2 rounded-full font-semibold transition duration-300 ease-in-out flex items-center justify-center text-sm group ${
                  viewMode === 'scroll'
                    ? 'bg-mehroon text-white shadow-md ring-2 ring-offset-2 ring-mehroon'
                    : 'bg-lorange text-mehroon border border-mehroon hover:bg-mehroon hover:text-white hover:shadow-md'
                }`}
              >
                View by Scrolling
              </button>
            </div>
          </div>
        </div>

        {/* PDF Viewer Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-pink mt-8">
          {pdfFile ? (
             <PdfViewer pdfFile={pdfFile} viewMode={viewMode} />
          ) : (
             <div className="text-center text-mehroon py-10">Loading PDF viewer...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBooks;
