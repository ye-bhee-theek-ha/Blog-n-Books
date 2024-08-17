import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NotificationCard from '../../components/NotificationCard/NotificationCard';
import Navbar from '../../components/navbar/navbar';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { createEditor } from 'slate';
import { renderElement, renderLeaf } from '../../components/BlogEditor/EditorElements';




const ViewBlog = () => {

  const {ID} = useParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [tags, setTags] = useState(null);
  const [comments, setComments] = useState(null);
  const [content, setContent] = useState(null);
  const [publicationDate, setPublicationDate] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [status, setStatus] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [readingTime, setReadingTime] = useState(null);


  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue = useMemo(
    () =>
      JSON.parse(content)
  )

  console.log(content)

  useEffect(() => {
    setLoading(true)
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`https://blog-and-books-backend-56eu.vercel.app/api/blogs/${ID}`);
        const blog = response.data;
        setTitle(blog.title)
        setAuthor(blog.author)
        setTags(blog.tags)
        setComments(blog.comments)
        setContent(blog.content)
        setPublicationDate(blog.publicationDate)
        setStatus(blog.status)
        setVisibility(blog.visibility)
        setReadingTime(blog.readingTime)

        const base64Image = `data:image/jpeg;base64,${blog.featuredImage}`;
        setFeaturedImage(base64Image);

        if (visibility == "Private")
        {

        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching Blog details:', error);
        setLoading(false)
      }
    };

    fetchBlogs();
  }, [ID]);

  if (loading)
  {
    return <div>Loading...</div>  
  }

  return (
    <div className="min-h-screen h-full w-full">
      <Navbar />
      <div className='mx-6 my-8 grid grid-cols-3 lg:grid-cols-4'>

      {message != "" && 
        <div className="px-4 py-6 border-2 border-mehroon bg-mehroon bg-opacity-50 text-text text-mehroon">
          {message}
        </div>
      }

        <div className='col-span-4 lg:col-span-1 lg:mx-24 flex justify-center pr-5 mt-12'>
          <NotificationCard
            title="Details"
          >
            <div className="text-btn text-mehroon flex flex-row flex-wrap justify-start">
              <div className= "font-medium my-1 mx-1 flex flex-col items-start">
                Author:
                <button
                 className="mt-1 ml-1 font-normal"
                  onclick = {() => {console.log("author");}} 
                >
                  {author.name}
                </button>
              </div>
              <div className= "font-medium my-2 mx-5 lg:mx-2 flex flex-col items-start">
                Published on:
                <div
                 className="mt-1 ml-2 font-normal"
                 disabled
                >
                  {publicationDate}
                </div>
              </div>
              <div className= "font-medium my-2 mx-2 flex flex-col items-start">
                Reading Time:
                <div
                 className="mt-1 ml-2 font-normal"
                >
                  {readingTime} min(s)
                </div>
              </div>
            </div>
          </NotificationCard>
        </div>

        <div className=' col-span-4 md:col-span-3 px-2'>
          <div className=" flex flex-col items-start ms-20">
            <h1 className='text-mehroon text-heading font-bold'>{title}</h1>
            <div className="flex flex-row">
              {
                tags.map((tag, key) => {
                  <button 
                    className="text-sm rounded-full bg-lorange border-1 border-mehroon p-1 mx-2 hover:bg-orange hover:bg-opacity-75 hover:border-2"
                    onclick={console.log("tag pressed")}
                  >
                    {tag.name}
                  </button>
                })
              }
            </div>
          </div>

          <div className="w-full flex justify-center my-4">
            <img src={featuredImage} alt="" className="rounded-lg h-96 border-mehroon border-2" />
          </div>

          <div className="text-mehroon">
            <Slate editor={editor} initialValue={initialValue} onChange={() => {}}>
              <Editable
                readOnly 
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </Slate>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ViewBlog;
