import React from 'react'; // Removed useState, useEffect
import Card from "../../components/card/Card";
import Navbar from "../../components/navbar/navbar";
import BookShelf from "../../components/bookshelf/bookshelf";
import { useNavigate } from "react-router-dom";
// Removed axios import as fetching is done via Redux thunks
import { useSelector } from 'react-redux';
import { IconLoader } from '@tabler/icons-react';

const Home = (props) => {

  const navigate = useNavigate();

  // Selectors for Redux state - KEPT
  const { homepageItems: BookData = [], status: bookStatus } = useSelector((state) => state.books);
  const { homepageItems: BlogData = [], status: blogStatus } = useSelector((state) => state.blogs);

  // Derived loading states - KEPT
  const LoadingBook = bookStatus === 'loading' || bookStatus === 'idle';
  const LoadingBlog = blogStatus === 'loading' || blogStatus === 'idle';


  return (
    <div>
      <Navbar />
      {/* --- Header Section --- */}
      <div className="h-80 flex flex-row justify-between mx-10 items-center">
        <div className='w-1/2 md:w-full justify-start flex flex-col'>
          <h2 className="text-heading text-mehroon text-left font-semibold">
            Discover Engaging Stories and Insights
          </h2>
          <h4 className="text-profilehead text-mehroon text-left ml-2">
            Welcome to our Blog Viewer! Dive into a world of captivating articles, inspiring stories, and insightful commentary.
          </h4>
        </div>
        <div className="w-1/2 hidden md:flex">
          {/* Notification Card Placeholder */}
        </div>
      </div>

      {/* --- Bookshelf Section --- */}
      <div className={`mt-8 bg-pink border-y-2 border-mehroon ${LoadingBook ? "mb-8" : ""}`}>
        {LoadingBook && <div className= "h-1 bg-mehroon rounded-full loading-bar w-screen overflow-hidden" />}
        <BookShelf
          title="Featured Books" // Added a title for context
          books = {BookData} // Use data from Redux
        />
      </div>

      {/* --- Blogs Section --- */}
      <div>
        <div className="text-cardtitle text-mehroon justify-start flex mx-14 my-4">
          Featured Blogs
        </div>
        <div>
          {LoadingBlog ? (
             <div className="flex justify-center items-center p-10">
                 <IconLoader className="animate-spin h-12 w-12 text-mehroon"/>
             </div>
          ) : BlogData.length === 0 ? (
             <p className="text-center text-mehroon p-5">No blogs found.</p>
          ) : (
             BlogData.map((blog) => (
                 <Card
                    key={blog.id} // Use unique ID from data
                    src={blog.featuredImage}
                    title={blog.title}
                    description={blog.description}
                    // API uses readTime, ensure prop name matches or adapt here/in Card
                    readtime={blog.readTime || blog.readtime}
                    likes={blog.likes}
                    IsLiked = {blog.isLiked}
                    // Ensure tags are handled correctly - API returns array of strings for GET /blogs
                    tags={blog.tags?.map(tag => ({ name: tag })) || []}
                    id= {blog.id}
                 />
             ))
          )}
        </div>
      </div>
    </div>
  );
};


export default Home;
