import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar/navbar";
import Button from "../../components/button/button";
import BlogEditor from "../../components/BlogEditor/BlogEditor";
import Resizer from "react-image-file-resizer";
import { IconX, IconLoader } from "@tabler/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { createTag, fetchTags } from "../../store/slices/tagsSlice"; // Assuming fetchTags is handled globally in App.js
import { createBlog } from "../../store/slices/blogsSlice"; // Import the createBlog thunk

const UploadBlog = () => {
  // --- Local State for Form Inputs ---
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(""); // Consider pre-filling from user profile
  const [publicationDate, setPublicationDate] = useState("");
  const [tag_vlaue, setTag_value] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [image, setImage] = useState(null); // Preview URL
  const [image64, setImage64] = useState(null); // Base64 for submission
  const [status, SetStatus] = useState("Published"); // Draft or Published
  const [visibility, SetVisibility] = useState("Public"); // Public or Private
  const [content, SetContent] = useState(null); // Content from Slate editor (JSON string)
  const [message, setMessage] = useState(""); // Feedback message

  // --- Redux State and Dispatch ---
  const dispatch = useDispatch();
  const availableTags = useSelector((state) => state.tags.items);
  const { status: blogCreationStatus, error: blogCreationError } = useSelector((state) => state.blogs); // Status for blog creation
  const { status: tagCreationStatus, error: tagCreationError } = useSelector((state) => state.tags); // Status for tag creation
  const userName = useSelector((state) => state.auth.user?.name); // Get user name for potential prefill

  const loading = blogCreationStatus === 'loading'; // Loading state from Redux

  // --- Effects ---
  // Prefill author name if available
  useEffect(() => {
      if (userName) {
          setAuthor(userName);
      }
  }, [userName]);

  // Update local message based on Redux blog creation status
  useEffect(() => {
    if (blogCreationStatus === 'failed') {
      setMessage(blogCreationError || "Failed to upload blog");
    } else if (blogCreationStatus === 'succeeded') {
      setMessage("Blog uploaded successfully!");
      // Consider resetting form state here
    }
    // Optionally reset message when status goes back to idle
    // else if (blogCreationStatus === 'idle') {
    //   setMessage("");
    // }
  }, [blogCreationStatus, blogCreationError]);

  // --- Handlers ---
  const HandleVisibilityChange = useCallback(() => {
    SetVisibility(prev => prev === "Public" ? "Private" : "Public");
  }, []);

  const handleTagKeyDown = async (event) => {
    handleTagInputChange(event); // Keep for filtering dropdown
    if (event.key === "Enter" && tag_vlaue.trim()) {
        event.preventDefault();
        const tagName = tag_vlaue.trim().toLowerCase();

        if (selectedTags.some(tag => tag.name.toLowerCase() === tagName)) {
            setTag_value("");
            setShowDropdown(false);
            return;
        }

        let tagObj = availableTags.find(tag => tag.name.toLowerCase() === tagName);

        if (!tagObj) {
            try {
                const resultAction = await dispatch(createTag({ name: tagName }));
                if (createTag.fulfilled.match(resultAction)) {
                    tagObj = resultAction.payload;
                } else {
                    console.error("Failed to create tag:", resultAction.payload);
                    setMessage(resultAction.payload || "Failed to create tag");
                    return;
                }
            } catch (error) {
                console.error("Error dispatching createTag:", error);
                setMessage("Error creating tag");
                return;
            }
        }

        if (tagObj && selectedTags.length < 5) {
            setSelectedTags([...selectedTags, tagObj]);
        } else if (selectedTags.length >= 5) {
            setMessage("Max 5 tags allowed");
        }

        setTag_value("");
        setShowDropdown(false);
    }
};


  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagToRemove.id));
  };

  const handleTagInputChange = (event) => {
    const inputValue = event.target.value;
    setTag_value(inputValue);

    if (inputValue.trim().length >= 1) {
      setShowDropdown(true);
      const filtered = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
        !selectedTags.some(selectedTag => selectedTag.id === tag.id)
      ).slice(0, 5);
      setFilteredTags(filtered);
    } else {
      setShowDropdown(false);
      setFilteredTags([]);
    }
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.length < 5 && !selectedTags.some(selected => selected.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    } else if (selectedTags.length >= 5) {
      setMessage("Max 5 tags allowed");
    }
    setTag_value("");
    setShowDropdown(false);
  };

  const resizeFile = (file) =>
    new Promise((resolve, reject) => {
      Resizer.imageFileResizer(
        file, 800, 800, 'JPEG', 100, 0,
        (uri) => { resolve(uri); },
        'base64', 200, 200,
        (err) => { reject(err); }
      );
    });

  const handleImageChange = async (event) => {
    const img = event.target.files[0];
    if (img) {
        try {
            const resizedImage = await resizeFile(img);
            setImage64(resizedImage);
            setImage(URL.createObjectURL(img));
        } catch (err) {
            console.error("Error resizing image:", err);
            setMessage("Error processing image");
        }
    }
  };

  // Handler to be passed to the submit buttons
  const prepareAndSubmit = (submitStatus) => {
    setMessage(""); // Clear previous messages
    const currentContent = localStorage.getItem("content"); // Get latest content

    if (!currentContent || JSON.parse(currentContent)[0]?.children[0]?.text === '') {
      setMessage("Blog content cannot be empty.");
      return;
    }
     if (!title) {
      setMessage("Blog title cannot be empty.");
      return;
    }

    const blogData = {
      title: title,
      authorName: author || userName || 'Anonymous', // Fallback for author name
      publicationDate: publicationDate || new Date().toISOString(), // Default to now if not set
      tags: JSON.stringify(selectedTags.map(tag => tag.id)),
      content: currentContent, // Use content from localStorage
      image: image64, // Base64 image string or null
      status: submitStatus, // 'Published' or 'Draft'
      visibility: visibility,
    };

    dispatch(createBlog(blogData));
  };

  // --- Render ---
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="w-full flex justify-center">
        <div className="max-w-[1200px] w-full justify-self-center my-12 bg-orange bg-opacity-50 border-2 border-mehroon text-mehroon font-Display px-4 mx-8 py-6 rounded-lg">
          <div className="overflow-hidden p-6 flex flex-col">
            <h2 className="text-profilehead font-bold mb-4">Create a New Blog Post</h2>

             {message && (
              <p className={`mb-4 border ${blogCreationStatus === 'failed' ? 'border-red-500 bg-red-100 text-red-700' : 'border-green-500 bg-green-100 text-green-700'} py-2 px-4 w-fit rounded-md self-end mr-20`}>
                {message}
              </p>
            )}

            {/* Using a div instead of form to prevent default browser submission */}
            <div className="space-y-4">

              {/* Title */}
              <div className="w-full flex flex-col items-center">
                <label className="text-text self-start mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                  required
                />
              </div>

              {/* Author, Visibility, Image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                 {/* Author & Visibility */}
                <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <label className="text-text block mb-1">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                      placeholder="Author name"
                    />
                  </div>
                   <div>
                    <label className="text-text block mb-1">Visibility</label>
                    <Button
                      name= {visibility}
                      onClick= {HandleVisibilityChange}
                      type="button" // Important: prevent form submission
                      containerclassName= {"h-full w-full !m-0"} // Adjust styling as needed
                      btnclassName={"w-full justify-center"}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="flex-shrink-0 w-full sm:w-32">
                   <label className="text-text block mb-1">Featured Image</label>
                   <div className="h-40 w-full border-2 border-dashed border-mehroon rounded-md shadow flex items-center justify-center text-center p-2 relative overflow-hidden">
                      {image ? (
                        <>
                          <img
                            src={image}
                            alt="Featured Preview"
                            className="h-full w-full object-contain"
                          />
                           <button
                             type="button"
                             onClick={() => {setImage(null); setImage64(null);}}
                             className="absolute h-5 w-5 rounded-full bg-white bg-opacity-70 right-1 top-1 hover:bg-opacity-90 flex items-center justify-center"
                             aria-label="Remove image"
                           >
                             <IconX className="h-4 w-4 text-red-600"/>
                           </button>
                        </>
                      ) : (
                        <div className="text-mehroon text-sm">
                           <input
                              type="file"
                              id="blogImageUpload"
                              accept="image/jpeg, image/png, image/webp"
                              onChange={handleImageChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              aria-label="Upload featured image"
                           />
                           <label htmlFor="blogImageUpload" className="cursor-pointer">
                                Click to Upload Image
                           </label>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Tags and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="relative">
                  <label className="text-text block mb-1">Add Tags (up to 5, press Enter)</label>
                  <div className="w-full min-h-[40px] flex flex-wrap items-center px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus-within:ring focus-within:border-orange">
                     {selectedTags.map((tag) => (
                        <div key={tag.id} className="bg-gray-200 bg-opacity-25 rounded-md px-2 py-0.5 mr-2 mb-1 text-sm flex items-center">
                          {tag.name}
                          <button
                            type="button"
                            className="ml-1.5 text-lorange hover:text-red-500 text-xs"
                            onClick={() => handleRemoveTag(tag)}
                            aria-label={`Remove ${tag.name}`}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                     <input
                        type="text"
                        value={tag_vlaue}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagKeyDown}
                        className="flex-grow bg-transparent h-fit border-none focus:outline-none p-1"
                        placeholder={selectedTags.length < 5 ? "Type tag and press Enter..." : "Max 5 tags"}
                        disabled={selectedTags.length >= 5}
                      />
                  </div>
                   {showDropdown && filteredTags.length > 0 && (
                      <div className="absolute mt-1 w-full rounded-md bg-lorange border border-mehroon shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                        <div className="py-1 max-h-40 overflow-y-auto" role="menu" aria-orientation="vertical">
                          {filteredTags.map((tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              className="block w-full text-left px-4 py-2 text-sm text-mehroon hover:bg-opacity-50 hover:bg-orange"
                              onClick={() => handleTagSelect(tag)}
                            >
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
                <div>
                  <label className="text-text block mb-1">Date (Optional)</label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                  />
                </div>
              </div>

              {/* Blog Editor */}
              <div className="mt-4">
                <label htmlFor="editor" className="text-subheading font-bold mb-2 block">
                  Convert thoughts to text here
                </label>
                <div className="mt-1">
                    <BlogEditor
                      EditorClassname = "bg-orange rounded-lg border-2 border-mehroon overflow-hidden" // Added overflow-hidden
                      TxtAreaClassname = "bg-lorange p-4 min-h-80 rounded-lg"
                      // Pass initial content if needed for editing later
                    />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end items-center gap-4 pt-4">
                 <span className="text-sm text-mehroon">
                    {/* Optionally show status */}
                 </span>
                 <Button
                    containerclassName = "h-12 px-5 bg-transparent text-mehroon border-mehroon border-2 hover:shadow-lg hover:bg-mehroon hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick= {() => prepareAndSubmit("Draft")} // Pass status
                    type="button" // Use type="button"
                    name= "Save as Draft"
                    disabled={loading}
                 />
                 <Button
                    containerclassName = "h-12 px-5 hover:shadow-lg hover:border-mehroon hover:border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick= {() => prepareAndSubmit("Published")} // Pass status
                    type="button" // Use type="button"
                    name= "Publish"
                    disabled={loading}
                 />
                 {loading && <IconLoader className="h-6 w-6 animate-spin text-mehroon"/>}
              </div>
            </div> {/* End of div replacing form */}
          </div>
         </div>
      </div>
    </div>
  );
};

export default UploadBlog;
