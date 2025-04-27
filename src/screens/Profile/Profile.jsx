import React, { useEffect } from "react"; // Removed useState
import { IconUser, IconBooks, IconHeart, IconEdit, IconLoader, IconCat } from "@tabler/icons-react";
import Navbar from "../../components/navbar/navbar";
import Button from "../../components/button/button";
import BookShelf from "../../components/bookshelf/bookshelf";
import Card from "../../components/card/Card";
import { useNavigate } from "react-router-dom";
// Removed axios import
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchUserProfile, toggleUserRole } from "../../store/slices/authSlice"; // Import necessary actions/thunks

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors for Redux state
  const {
      user,
      role,
      profileContent, // Contains uploads/likes fetched by fetchUserProfile
      status: authStatus,
      error: authError,
      roleToggleStatus // Status specifically for role toggle
  } = useSelector((state) => state.auth);

  // Derived states
  const isLoadingProfile = authStatus === 'loading';
  const isTogglingRole = roleToggleStatus === 'loading';
  const IsRoleAuthor = role === 'author'; // Derive directly from Redux state

  // Fetch profile data if user exists but profileContent might be missing (e.g., after direct navigation)
  useEffect(() => {
    // Fetch only if logged in but user details seem incomplete or not fetched yet
    if (user && authStatus !== 'loading' && !profileContent?.booksUploaded?.items?.length && !profileContent?.blogsUploaded?.items?.length ) {
       dispatch(fetchUserProfile());
    }
    // If not logged in (no user), redirect? Or handled by routing logic elsewhere?
    // if (!user && authStatus !== 'loading') { navigate('/auth'); }

  }, [dispatch, user, authStatus, profileContent]); // Dependencies

  const handleUpdateProfile = () => {
    // TODO: Implement update profile (likely navigate to an edit page or open a modal)
    alert("Update profile functionality will be implemented here.");
  };

  const handleRoleChange = () => {
    if (!isTogglingRole) { // Prevent multiple clicks
        dispatch(toggleUserRole());
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Navigate after logout
  };

  const handleUploadBook = () => {
    navigate("/profile/uploadBook"); // Corrected path based on App.js
  };

  const handleUploadBlog = () => {
    navigate("/profile/uploadBlog"); // Corrected path based on App.js
  };

  // Helper function (keep as is)
  const convertBase64ToUrl = (base64String) => {
     if (!base64String) return 'https://placehold.co/112x112/cccccc/ffffff?text=No+Image'; // Placeholder
     // Check if it already has the data URI prefix
     if (base64String.startsWith('data:image')) {
         return base64String;
     }
     // Assume it's raw base64 otherwise
     return `data:image/jpeg;base64,${base64String}`;
  };

  // Helper function (keep as is, but ensure content is parsed correctly)
  const extractDescription = (contentString, numOfLines) => {
    let description = '';
    let linesAdded = 0;
    if (!contentString) return '';

    try {
        const contentArray = JSON.parse(contentString);
        if (!Array.isArray(contentArray)) return '';

        for (const element of contentArray) {
            if (linesAdded >= numOfLines) break;
            if (element.children && Array.isArray(element.children)) {
                const text = element.children.map(child => child.text || '').join(' ');
                if (text.trim()) {
                    description += (description ? ' ' : '') + text.trim();
                    linesAdded++;
                }
            }
        }
    } catch (e) {
        console.error("Error parsing blog content for description:", e);
        return contentString.substring(0, 100) + "..."; // Fallback for non-JSON
    }

    return description;
  };

  // Loading state for initial profile fetch
  if (isLoadingProfile && !user) { // Show loader only if definitely loading and no user data yet
    return (
    <div className="h-screen w-screen flex items-center justify-center align-middle">
      <IconLoader className="animate-spin h-32 w-32 text-mehroon" />
    </div>
    );
  }

  // Handle case where user is not logged in or fetch failed after loading
  if (!user) {
      // Optionally redirect or show login prompt
      return (
          <div>
              <Navbar />
              <div className="text-center p-10 text-mehroon">
                  Please log in to view your profile.
                  <Button name="Login" onClick={() => navigate('/auth')} containerclassName="mx-auto mt-4"/>
              </div>
          </div>
      );
  }

  // --- Render Profile ---
  return (
    <div className="min-h-screen w-full">
      <Navbar
        title="Logout"
        onClick={handleLogout}
      />
      <div className="py-8">
        {/* Profile Header */}
        <div className="bg-orange bg-opacity-75 border-2 border-mehroon text-mehroon font-Display px-4 mx-8 py-6 rounded-lg">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-shrink-0">
              <img
                // Use user data from Redux
                src={convertBase64ToUrl(user.profilePic)}
                alt="Profile"
                className="h-28 w-28 rounded-full object-cover border-2 border-mehroon" // Added object-cover and border
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/112x112/cccccc/ffffff?text=No+Image'; }} // Basic error handling
              />
            </div>
            <div className="flex flex-col flex-1 items-center sm:items-start text-center sm:text-left">
              <h2 className="text-2xl font-bold text-profilehead">
                {/* Use user data from Redux */}
                {user.name}
              </h2>
              <p className="text-text mt-1 text-opacity-65">
                {/* Use user data from Redux */}
                {user.email}
              </p>
              <p className="mt-2 text-opacity-65 text-btn max-w-md"> {/* Added max-width */}
                {/* Use IsRoleAuthor derived from Redux */}
                {IsRoleAuthor ? "You are in author mode." : "You are in viewer mode. Features like uploading blogs or books will not be available."}
                <button onClick={handleRoleChange} className="underline flex flex-row items-center justify-center sm:justify-start text-mehroon hover:text-red-700 ml-1" disabled={isTogglingRole}>
                    Click here to change role
                  {isTogglingRole && <IconLoader className="h-5 w-5 text-mehroon animate-spin ml-2"/>}
                </button>
                 {roleToggleStatus === 'failed' && <span className="text-red-500 text-xs block mt-1">{authError || 'Failed to toggle role'}</span>}
              </p>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 font-light w-full sm:w-auto">
              <Button
                onClick={handleUpdateProfile}
                name={"Update Profile"}
                containerclassName={"hover:ring-2 ring-orange w-full"}
                btnclassName={"flex-nowrap w-full justify-center"}
              >
                <IconEdit className="min-w-5 min-h-5 h-5 w-5 mr-1" />
              </Button>
              {/* Conditionally render upload buttons based on role */}
              {IsRoleAuthor && (
                 <>
                    <Button
                        onClick={handleUploadBook}
                        name={"Upload Book"}
                        containerclassName={"hover:ring-2 ring-orange w-full"}
                        btnclassName={"flex-nowrap w-full justify-center"}
                        // disabled={!IsRoleAuthor} // No longer needed if button is conditionally rendered
                    >
                        <IconEdit className="min-w-5 min-h-5 h-5 w-5 mr-1" />
                    </Button>
                    <Button
                        onClick={handleUploadBlog}
                        name={"Upload Blog"}
                        containerclassName={"hover:ring-2 ring-orange w-full"}
                        btnclassName={"flex-nowrap w-full justify-center"}
                        // disabled={!IsRoleAuthor} // No longer needed
                    >
                        <IconEdit className="min-w-5 min-h-5 h-5 w-5 mr-1" />
                    </Button>
                 </>
              )}
            </div>
          </div>
        </div>

        {/* Books Uploaded */}
        <div className="my-8 bg-pink border-y-2 border-mehroon">
          <BookShelf
            title="Books Uploaded"
            // Use profileContent from Redux
            books={profileContent.booksUploaded?.items || []}
          />
           {/* TODO: Add pagination controls if needed based on profileContent.booksUploaded.pagination */}
        </div>

        {/* Liked Books - TODO: Fetch and display this data */}
        {/* <div className="my-8 bg-pink border-y-2 border-mehroon">
          <BookShelf
            title="Liked Books"
            books={profileContent.booksLiked?.items || []}
          />
        </div> */}

        {/* Liked Blogs - TODO: Fetch and display this data */}
        {/* <div>
          <div className="text-cardtitle text-mehroon justify-start flex mx-14 my-4">
            Liked Blogs
          </div>
          <div className="flex flex-wrap justify-center">
            {(!profileContent.blogsLiked?.items || profileContent.blogsLiked.items.length === 0) ? (
                 <span className="ml-4 flex flex-row items-center text-mehroon text-text"><IconCat className="p-2 m-3 text-mehroon h-10 w-10 font-thin rounded-full bg-mehroon bg-opacity-20"/> Nothing here yet.</span>
             ) : (
                 profileContent.blogsLiked.items.map((blog) => (
                    // Ensure Card uses correct props
                    <Card key={blog.id || blog._id} {...blog} />
                 ))
             )}
          </div>
        </div> */}

        {/* Blogs Uploaded */}
        <div>
          <div className="text-cardtitle text-mehroon justify-start flex mx-14 my-4">
            Blogs Uploaded
          </div>
          <div className="flex flex-wrap justify-center">
             {/* Use profileContent from Redux */}
             {(!profileContent.blogsUploaded?.items || profileContent.blogsUploaded.items.length === 0) ? (
                 <span className="ml-4 flex flex-row items-center text-mehroon text-text"><IconCat className="p-2 m-3 text-mehroon h-10 w-10 font-thin rounded-full bg-mehroon bg-opacity-20"/> WOW, Such Empty. </span>
             ) : (
                 profileContent.blogsUploaded.items.map((blog) => (
                    <Card
                        key={blog.id || blog._id} // Use unique ID
                        src={blog.featuredImage}
                        title= {blog.title}
                        // Pass the raw content string to extractDescription
                        description= {extractDescription(blog.content, 2)}
                        id= {blog.id || blog._id}
                        readtime= {blog.readTime || blog.readingTime} // Check API field name
                        likes={blog.likes}
                        IsLiked={blog.isLiked} // Assuming this comes from the /me endpoint data
                        tags={blog.tags?.map(tag => ({ name: tag })) || []} // Adapt if tags are objects
                    />
                 ))
             )}
          </div>
           {/* TODO: Add pagination controls if needed */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
