import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PdfViewer from '../../components/PDFViewer/PDFViewer';
import { pdfjs } from 'react-pdf';
import Navbar from '../../components/navbar/navbar';


const ViewBooks = () => {

  const id = useParams();

  const [bookTitle, setBookTitle] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [viewMode, setViewMode] = useState('page');

  console.log(pdfjs.version)
  
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  


  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BASE_URL + `/api/bookDetails/${id.ID}`);
        const book = response.data;
        setBookTitle(book.title);
        setBookDescription(book.description);
        setAuthorName(book.author);
        setFeaturedImage(book.featuredImage);
        const pdfResponse = await axios.get(process.env.REACT_APP_BASE_URL + `/api/book/${id.ID}`, {
          responseType: 'blob'
        });
        const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfFile(pdfBlobUrl);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [id]);


  const handleViewModeChange = () => {
    if (viewMode == "page")
    {
      setViewMode("scroll");
    }
    else {
      setViewMode("page");
    }
  };


  return (
    <div>
      <Navbar/>
      <div className='mt-20 px-4 lg:px-24'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            {featuredImage && <img src={featuredImage} alt={bookTitle} className='h-auto max-h-96 md:max-h-full rounded-lg shadow-lg' />}
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{bookTitle}</h2>
            <p className="text-lg text-gray-700 mb-4"><strong>Author:</strong> {authorName}</p>
            <p className="text-lg text-gray-700 mb-4">{bookDescription}</p>
            <div className='my-10'>
              <button
                type="button"
                onClick={() => handleViewModeChange('page')}
                className='bg-blue-700 text-white font-semibold px-5 mx-2 py-2 rounded hover:bg-black transition duration-300'>
                View Page by Page
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('scroll')}
                className='bg-blue-700 text-white font-semibold px-5 mx-2 py-2 rounded hover:bg-black transition duration-300'>
                View by Scrolling
              </button>
            </div>
          </div>
        </div>
        <div>
          {pdfFile && <PdfViewer pdfFile={pdfFile} viewMode={viewMode} />}
        </div>
      </div>
    </div>
  );
};

export default ViewBooks;
