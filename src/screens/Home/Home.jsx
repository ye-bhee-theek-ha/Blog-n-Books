import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { IconSearch, IconBooks } from "@tabler/icons-react";
import Button from "../../components/button/button";
import BookCard from "../../components/bookCard/bookCard";
import Card from "../../components/card/Card";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import Navbar from "../../components/navbar/navbar";
import BookShelf from "../../components/bookshelf/bookshelf";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Auth/Auth";

const Home = (props) => {

  const navigate = useNavigate()
  const [BookData, setBookData] = useState(null)
  const [BlogData, setBlogData] = useState(null)
  const [LoadingBook, setLoadingBook] = useState(true)
  const [LoadingBlog, setLoadingBlog] = useState(true)


  const [err, setErr] = useState(false)

  const { getToken } = useAuth();

  const token = getToken();

  useEffect(() => {
    fetchBooksData();
    fetchBlogsData();
  }, []);

  const fetchBooksData = async () => {
    try {
      // setLoadingBook(true);

      const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/booksHomePage/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookData(response.data);

      setLoadingBook(false);
    } catch (error) {
      // setLoadingBook(false);
      setErr(true);
      console.error("Error fetching info:", error);
    }
  }

  const fetchBlogsData = async () => {
    try {
      setLoadingBlog(true);

      const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/blogs/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogData(response.data);
      console.log(response.data);
      setLoadingBlog(false);
    } catch (error) {
      setLoadingBlog(false);
      console.error("Error fetching info:", error);
    }
  }




  return (
    <div>
      <Navbar />
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
          {/* <NotificationCard title="Top Today" containerclassName="w-full" /> */}
        </div>
      </div>

      <div className={`mt-8 bg-pink border-y-2 border-mehroon ${LoadingBook ? "mb-8" : ""}`}>
        {LoadingBook && <div className= "h-1 bg-mehroon rounded-full loading-bar w-screen overflow-hidden" />}
        <BookShelf 
          books = {LoadingBook? [] : BookData}
        />
      </div>
      <div>
        <div className="text-cardtitle text-mehroon justify-start flex mx-14 my-4">
          Blogs by the Author
        </div>
        <div>
          {LoadingBlog? [] : BlogData.map((blog, index) => (
            // const [Isliked, setIsLiked] = useState{blog.IsLiked}
            <Card 
              key={index} 
              src={blog.featuredImage}
              title={blog.title}
              description={blog.description}
              readtime={blog.readtime}
              likes={blog.likes}

              tags= {blog.tags}
              id= {blog.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {};

Home.defaultProps = {};

export default Home;
