import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import axios from "axios";
import {IconX, IconLoader} from "@tabler/icons-react"
import { useAuth } from "../../Auth/Auth"
import Loader from "../../components/Loader/Loader";
import Resizer from "react-image-file-resizer";


const UploadBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [publicationDate, setPublicationDate] = useState("");

  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState(null);
  const [file, setFile] = useState(null);
  
  const [tag_vlaue, setTag_value] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const {getToken} = useAuth()

  const [loading, setLoading] = useState(false);

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

  const handleFileChange = (event) => {
    const bookFile = event.target.files[0];
    if (bookFile) {
      setFile(bookFile);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("featuredImage", image64);
    formData.append("bookfile", file);
    formData.append("tags", JSON.stringify(selectedTags.map(tag => tag.id)));
    
    try {
      setLoading(true);
      const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      setMessage("Book uploaded successfully!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("There was an error uploading the book!", error);
      setMessage("Failed to upload book: " + error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen h-full w-full">
      <Navbar />
      <div className="w-full flex justify-center">
        <div className="max-w-[1200px] w-full justify-self-center my-12 bg-orange bg-opacity-50 border-2 border-mehroon text-mehroon font-Display px-4 mx-8 py-6 rounded-lg">
          {loading && Loader}
          <div className="overflow-hidden p-6 flex flex-col">
            <h2 className="text-profilehead font-bold mb-4">Upload a New Book</h2>

            {message && (
              <p className="mb-4 border bg-offwhite bg-opacity-50 py-2 px-4 w-fit rounded-md self-end mr-20">
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 space-x-2">
                <div>
                  <label className="text-text">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                    required
                  />
                </div>
                <div>
                  <label className="text-text">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                    required
                  />
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
                      <div className="absolute mt-10 rounded-md bg-lorange border-mehroon shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
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
                <div>
                  <label className="text-text">Publication Date</label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="flex-1">
                  <label className="text-text">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-28 px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                    required
                  />
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 justify-center ">
                <label className="block mx-auto">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-offwhite
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-mehroon file:bg-opacity-90
                    hover:file:bg-opacity-100"
                  />
                </label>
                <div className="flex flex-row justify-center items-center">
                  <button
                    type="submit"
                    className="w-fit py-1 shadow bg-offwhite bg-opacity-25 border-2 text-mehroon font-medium hover:text-offwhite hover:bg-mehroon disabled:hover:bg-offwhite disabled:hover:bg-opacity-50 rounded-lg px-2"
                    disabled={loading}
                  >
                    Upload Book
                  </button>
                  {loading && <IconLoader className="mx-2 animate-spin"/>}

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadBook;
