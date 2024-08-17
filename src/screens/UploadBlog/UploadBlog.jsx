import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import axios from "axios";
import { useAuth } from "../../Auth/Auth"
import Button from "../../components/button/button";
import BlogEditor from "../../components/BlogEditor/BlogEditor";
import Resizer from "react-image-file-resizer";
import {
  IconX,
  IconLoader
} from "@tabler/icons-react";

const UploadBlog = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState("");

  const [tag_vlaue, setTag_value] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState(null);

  const [status, SetStatus] = useState("Published");
  const [visibility, SetVisibility] = useState("Public");
    
  const {getToken} = useAuth();

  const [content,  SetContent] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setloading] = useState(false);


  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/tags");
      setTags(response.data.map(tag => ({ name: tag.name, id: tag._id })));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    const token = getToken();

    SetContent(localStorage.getItem("content"))

    const data = {
      title: title,
      authorName: author,
      publicationDate: publicationDate,
      tags: JSON.stringify(selectedTags.map(tag => tag.id)),
      content: content,
      image: image64,
      status: status,
      visibility: visibility,
    };

    if (!content) {
      setMessage("Content cannot be empty");
      setloading(false);
      return;
    }
    
    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/blogs",
        data,
        { 
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Blog uploaded successfully");
      setloading(false)

    } catch (error) {
      console.error("Error uploading blog:", error);
      setMessage( error.response.data.message? error.response.data.message : "Error uploading blog" );
      setloading(false)
    }
  };

  const HandleVisibilityChange = () => {
    if (visibility === "Public")
      {
        SetVisibility("Private")
      }
    else if (visibility === "Private")
      {
        SetVisibility("Public")
      }
  } 

  const handleTagKeyDown = async (event) => {
    handleTagInputChange(event)
    if (event.key === "Enter") {
      event.preventDefault();

      const inputTags = event.target.value.split(" ").filter(tag => tag.trim() !== "");

      for (let tag of inputTags) {
        tag = tag.trim();
        if (tag) {
          // Check if tag already exists in selectedTags
          if (!selectedTags.find(existingTag => existingTag.name === tag)) {
            let tagObj = tags.find(existingTag => existingTag.name === tag);
            if (!tagObj) {
              try {
                const token = getToken();
                const response = await axios.post(
                  process.env.REACT_APP_BASE_URL + "/api/tags",
                  { name: tag },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                tagObj = { name: response.data.name, id: response.data._id };
                setTags([...tags, tagObj]);
                console.log(tagObj)
              } catch (error) {
                console.error("Error creating new tag:", error);
                continue;
              }
            }
            // Update selectedTags with the new tag object
            if (selectedTags.length < 5) {
              setSelectedTags([...selectedTags, tagObj]);
            } else {
              setMessage("Max 5 tags allowed");
              return;
            }
          }
        }
      }
      setTag_value(null);
    }
  };


  
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
  }; 


  const handleTagInputChange = (event) => {
    const inputValue = event.target.value.trim();
    if (inputValue.length >= 1) {
      setShowDropdown(true);
      // Filter tags based on inputValue and not in selectedTags
      let filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedTags.find(selectedTag => selectedTag.name === tag.name)
      );
      // Show only top five filtered tags
      filteredTags = filteredTags.slice(0, 5);
      setFilteredTags(filteredTags);
    } else {
      setShowDropdown(false);
      setFilteredTags([]);
    }
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setMessage("Max 5 tags allowed");
      return;
    }
    setTag_value(""); // Clear input field
    setShowDropdown(false); // Hide dropdown after selection
  };
  
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        800, // width
        800, // height
        'JPEG', // format
        100, // quality
        0, // rotation
        (uri) => {
          resolve(uri);
        },
        'base64'
      );
    });

    const handleImageChange = async (event) => {
      const img = event.target.files[0];
      if (img) {
        const resizedImage = await resizeFile(img);
        setImage64(resizedImage);
        setImage(URL.createObjectURL(img));
      } else {
        console.log("No image selected");
      }
    };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="w-full flex justify-center">
        <div className="max-w-[1200px] w-full justify-self-center my-12 bg-orange bg-opacity-50 border-2 border-mehroon text-mehroon font-Display px-4 mx-8 py-6 rounded-lg">
          <div className="overflow-hidden p-6 flex flex-col">
            <h2 className="text-profilehead font-bold mb-4">Create a New Blog Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                {message && (
                  <p className="mb-4 border bg-offwhite bg-opacity-50 py-2 px-4 w-fit rounded-md self-end mr-20">
                    {message}
                  </p>
                )}

              <div className="w-full flex flex-col items-center">
                <label className="text-text">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-fit min-w-80 px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 space-x-2">
                <div className="flex flex-row justify-evenly col-span-2 items-center">
                  <div>
                    <label className="text-text">Author</label>
                    <div className="w-full flex justify-center">
                      <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                      />
                    </div>
                  </div>

                  <div> 
                    <label className="text-text">Visibility</label>
                    <div className="w-full flex justify-center">
                      <Button
                        name= {visibility}
                        onClick= {HandleVisibilityChange}
                        containerclassName= {"h-full"}
                      />
                    </div>
                  </div>
                </div>

                
              
                <div className="w-full flex justify-center">
                  <div className="h-40 w-32 border-2 border-mehroon mx-6 mt-8 rounded-md shadow">
                  {image ? (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Uploaded"
                        className="h-40 w-32 object-cover mb-4 rounded-md bg-clip-padding"
                      />
                      <div className="absolute h-5 w-5 rounded-full bg-white bg-opacity-50 right-2 top-2 hover:bg-opacity-50">
                        <button
                          onClick={() => setImage(null)}
                        >
                          <IconX className="h-5 w-5 text-mehroon"/>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-200 bg-opacity-25 w-full h-full flex flex-col items-center justify-center mb-4 rounded-md bg-clip-padding">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="book_cover block w-full text-sm text-offwhite
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-mehroon file:bg-opacity-90
                                    hover:file:bg-opacity-100"
                      />
                      <span className="text-mehroon">Book Cover</span>
                    </div>
                  )}
                                  
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 space-x-2">
                <div>
                  <label className="text-text">Add Tags</label>
                  <div className="w-full h-fit flex flex-row px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange">
                    <input
                      type="text"
                      value={tag_vlaue}
                      onChange={(e) => {setTag_value(e.target.value);handleTagInputChange(e)}}
                      onKeyDown={handleTagKeyDown}
                      className="w-1/2 bg-transparent h-fit border-none focus:outline-none"
                    />
                    {showDropdown && filteredTags.length > 0 && (
                      <div className="absolute mt-10 rounded-md bg-lorange border-mehroon shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                          {filteredTags.map((tag, index) => (
                            <button
                              key={index}
                              className="block w-full px-4 py-2 text-sm text-mehroon hover:bg-opacity-50 hover:bg-orange"
                              onClick={() => handleTagSelect(tag)}
                            >
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="w-1/2 justify-end flex flex-wrap mt-2">
                      {selectedTags.map((tag, index) => (
                        <div key={index} className="bg-gray-200 bg-opacity-25 rounded-md px-2 mr-2 mb-2 text-sm flex items-center">
                          {tag.name}
                          <button
                            type="button"
                            className="ml-2 text-lorange text-sm"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-evenly">
                  <div>
                    <label className="text-text">Date</label>
                    <input
                      type="date"
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="editor" className="text-subheading font-bold mb-4">
                  <br />
                  Convert thoughts to text here
                  <br />
                </label>
                <div className="mt-1">
                    <BlogEditor
                      EditorClassname = "h-48 bg-orange rounded-lg border-2 border-mehroon"
                      TxtAreaClassname = "bg-lorange p-4 min-h-80 rounded-lg"
                    />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  containerclassName = "h-12 px-5 bg-transparent text-mehroon border-mehroon border-2 hover:shadow-lg hover:bg-mehroon hover:text-white"
                  onClick= {() => {SetStatus("Draft")}}
                  type="submit"
                  name= "Save as Draft"
                />

                <Button
                  containerclassName = "h-12 px-5 hover:shadow-lg hover:border-mehroon hover:border-2"
                  onClick= {() => {SetStatus("Published")}}
                  type="submit"
                  name= "Publish"
                />

                {loading && <IconLoader className="mx-2 animate-spin"/>}

              </div>
            </form>
          </div>
         </div>
      </div>
    </div>
  );
};

export default UploadBlog;
