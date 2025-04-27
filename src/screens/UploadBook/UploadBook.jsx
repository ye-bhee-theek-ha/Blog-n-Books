import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import { IconX, IconLoader } from "@tabler/icons-react";
import Loader from "../../components/Loader/Loader"; // Assuming this is a general loading overlay, might be redundant
import Resizer from "react-image-file-resizer";
import { useSelector, useDispatch } from "react-redux";
import { createTag, fetchTags } from "../../store/slices/tagsSlice"; // Assuming fetchTags is handled globally in App.js, but createTag needed here
import { createBook } from "../../store/slices/booksSlice"; // Import the createBook thunk

const UploadBook = () => {
  // --- Local State for Form Inputs ---
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [image, setImage] = useState(null); // For preview URL
  const [image64, setImage64] = useState(null); // For submission
  const [file, setFile] = useState(null); // PDF file
  const [tag_vlaue, setTag_value] = useState(""); // Input field for tags
  const [selectedTags, setSelectedTags] = useState([]); // Tags chosen for this book
  const [filteredTags, setFilteredTags] = useState([]); // For dropdown suggestions
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState(""); // Local message state for success/error feedback

  // --- Redux State and Dispatch ---
  const dispatch = useDispatch();
  const availableTags = useSelector((state) => state.tags.items); // Get all tags from Redux
  const { status: bookCreationStatus, error: bookCreationError } = useSelector((state) => state.books); // Status for book creation
  const { status: tagCreationStatus, error: tagCreationError } = useSelector((state) => state.tags); // Status for tag creation (if needed)
  const token = useSelector((state) => state.auth.token); // Get token if needed for tag creation

  const loading = bookCreationStatus === 'loading'; // Loading state based on Redux

  // --- Effects ---
  // Update local message based on Redux book creation status
  useEffect(() => {
    if (bookCreationStatus === 'failed') {
      setMessage(bookCreationError || "Failed to upload book");
    } else if (bookCreationStatus === 'succeeded') {
      setMessage("Book uploaded successfully!");
      // Consider resetting form state here:
      // setTitle(""); setAuthor(""); setDescription(""); ... etc.
    }
    // Optionally reset message when status goes back to idle
    // else if (bookCreationStatus === 'idle') {
    //   setMessage("");
    // }
  }, [bookCreationStatus, bookCreationError]);

  // --- Handlers ---
  const handleTagKeyDown = async (event) => {
    handleTagInputChange(event); // Keep for filtering dropdown
    if (event.key === "Enter" && tag_vlaue.trim()) {
        event.preventDefault();
        const tagName = tag_vlaue.trim().toLowerCase(); // Process one tag at a time

        // Prevent adding duplicates to selectedTags
        if (selectedTags.some(tag => tag.name.toLowerCase() === tagName)) {
            setTag_value(""); // Clear input
            setShowDropdown(false);
            return;
        }

        // Find if tag exists in availableTags from Redux
        let tagObj = availableTags.find(tag => tag.name.toLowerCase() === tagName);

        if (!tagObj) {
            // If tag doesn't exist, dispatch action to create it
            try {
                // Dispatch createTag thunk
                const resultAction = await dispatch(createTag({ name: tagName }));
                if (createTag.fulfilled.match(resultAction)) {
                    tagObj = resultAction.payload; // Get the newly created tag object
                } else {
                    // Handle tag creation error (e.g., show a message)
                    console.error("Failed to create tag:", resultAction.payload);
                    setMessage(resultAction.payload || "Failed to create tag");
                    return; // Stop if tag creation failed
                }
            } catch (error) {
                console.error("Error dispatching createTag:", error);
                setMessage("Error creating tag");
                return;
            }
        }

        // Add the existing or newly created tag to selectedTags (if limit not reached)
        if (tagObj && selectedTags.length < 5) {
            setSelectedTags([...selectedTags, tagObj]);
        } else if (selectedTags.length >= 5) {
            setMessage("Max 5 tags allowed");
        }

        setTag_value(""); // Clear input field
        setShowDropdown(false); // Hide dropdown
    }
};


  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagToRemove.id));
  };

  const handleTagInputChange = (event) => {
    const inputValue = event.target.value;
    setTag_value(inputValue); // Update input value state

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

  const handleImageChange = async (event) => {
    const img = event.target.files[0];
    if (img) {
      try {
        const resizedImage = await resizeFile(img);
        setImage64(resizedImage); // Store base64 for submission
        setImage(URL.createObjectURL(img)); // Store URL for preview
      } catch (err) {
          console.error("Error resizing image:", err);
          setMessage("Error processing image");
      }
    }
  };

  const handleFileChange = (event) => {
    const bookFile = event.target.files[0];
    if (bookFile && bookFile.type === "application/pdf") {
      setFile(bookFile);
    } else if (bookFile) {
        setMessage("Please select a PDF file.");
        event.target.value = null; // Clear the input
    }
  };

  const resizeFile = (file) =>
    new Promise((resolve, reject) => { // Added reject
      Resizer.imageFileResizer(
        file, 800, 800, 'JPEG', 100, 0,
        (uri) => { resolve(uri); },
        'base64', 200, 200, // Added min width/height (optional)
        (err) => { reject(err); } // Added error handler
      );
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (!file) {
      setMessage('Please select a PDF file to upload.');
      return;
    }
    if (!image64) {
      setMessage('Please select a cover image.');
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("featuredImage", image64); // Send base64 string
    formData.append("bookfile", file);
    formData.append("tags", JSON.stringify(selectedTags.map(tag => tag.id))); // Send array of IDs
    // Append publicationDate if it exists
    if (publicationDate) {
        formData.append("publicationDate", publicationDate);
    }
    // Note: Visibility is handled by the backend default ('public') if not sent

    // Dispatch the createBook thunk
    dispatch(createBook(formData));
  };

  // --- Render ---
  return (
    <div className="min-h-screen h-full w-full">
      <Navbar />
      <div className="w-full flex justify-center">
        <div className="max-w-[1200px] w-full justify-self-center my-12 bg-orange bg-opacity-50 border-2 border-mehroon text-mehroon font-Display px-4 mx-8 py-6 rounded-lg">
          {/* {loading && <Loader />} */} {/* Consider if this overlay is needed if button shows loader */}
          <div className="overflow-hidden p-6 flex flex-col">
            <h2 className="text-profilehead font-bold mb-4">Upload a New Book</h2>

            {message && (
              <p className={`mb-4 border ${bookCreationStatus === 'failed' ? 'border-red-500 bg-red-100 text-red-700' : 'border-green-500 bg-green-100 text-green-700'} py-2 px-4 w-fit rounded-md self-end mr-20`}>
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title and Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text block mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                    required
                  />
                </div>
                <div>
                  <label className="text-text block mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                    required
                  />
                </div>
              </div>

              {/* Tags and Publication Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-text block mb-1">Add Tags (up to 5, press Enter)</label>
                  <div className="w-full min-h-[40px] flex flex-wrap items-center px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus-within:ring focus-within:border-orange">
                     {/* Display selected tags */}
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
                     {/* Input field */}
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
                   {/* Dropdown */}
                   {showDropdown && filteredTags.length > 0 && (
                      <div className="absolute mt-1 w-full rounded-md bg-lorange border border-mehroon shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
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
                  <label className="text-text block mb-1">Publication Date</label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                    // required // Making optional based on API doc
                  />
                </div>
              </div>

              {/* Description and Image Upload */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-text block mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-40 px-4 py-1 border border-mehroon bg-orange rounded-lg ring-lorange text-offwhite font-Display text-btn focus:outline-none focus:ring focus:border-orange"
                    required
                    rows="5"
                  />
                </div>
                <div className="flex-shrink-0 w-full sm:w-32">
                   <label className="text-text block mb-1">Book Cover</label>
                   <div className="h-40 w-full border-2 border-dashed border-mehroon rounded-md shadow flex items-center justify-center text-center p-2 relative overflow-hidden">
                      {image ? (
                        <>
                          <img
                            src={image}
                            alt="Cover Preview"
                            className="h-full w-full object-contain" // Use contain to see whole image
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
                              id="imageUpload"
                              accept="image/jpeg, image/png, image/webp" // Specify acceptable types
                              onChange={handleImageChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" // Hidden input overlay
                              aria-label="Upload book cover"
                           />
                           <label htmlFor="imageUpload" className="cursor-pointer">
                                Click to Upload Cover
                           </label>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* File Upload and Submit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-4">
                <div>
                   <label className="text-text block mb-1">Book File (PDF only)</label>
                   <input
                      type="file"
                      id="fileUpload"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-offwhite file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-mehroon file:bg-opacity-90 hover:file:bg-opacity-100 cursor-pointer"
                      required
                      aria-label="Upload book PDF"
                   />
                   {file && <span className="text-xs text-mehroon mt-1 block">Selected: {file.name}</span>}
                </div>
                <div className="flex flex-row justify-center items-center sm:justify-end h-full">
                  <button
                    type="submit"
                    className="w-fit py-2 px-6 shadow bg-offwhite bg-opacity-25 border-2 border-mehroon text-mehroon font-medium hover:text-offwhite hover:bg-mehroon disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-offwhite disabled:hover:bg-opacity-25 disabled:hover:text-mehroon rounded-lg flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? 'Uploading...' : 'Upload Book'}
                  </button>
                  {loading && <IconLoader className="ml-2 h-5 w-5 animate-spin text-mehroon"/>}
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
