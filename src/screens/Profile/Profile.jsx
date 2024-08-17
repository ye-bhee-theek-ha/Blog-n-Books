import React, { useEffect, useState } from "react";
import { IconUser, IconBooks, IconHeart, IconEdit, IconLoader, IconCat } from "@tabler/icons-react";
import Navbar from "../../components/navbar/navbar";
import Button from "../../components/button/button"; 
import BookShelf from "../../components/bookshelf/bookshelf";
import Card from "../../components/card/Card";
import { isRouteErrorResponse, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/Auth";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const { getToken, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [IsRoleAuthor, SetIsRoleAuthor] = useState(false);
  const [ChangingRole, setChangingRole] = useState(false);

  const fetchProfileData = async () => {
    const token = getToken();
    try {
      const response = await axios.get(process.env.REACT_APP_BASE_URL + "/api/users/getInfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(response.data);
      SetIsRoleAuthor(profileData.user.role !== "user");
    } catch (error) {
      console.error("Error fetching info:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateProfile = () => {
    alert("Update profile functionality will be implemented here.");
  };

  console.log((profileData))

  const handleRoleChange = async () => {
    const token = getToken();
    setChangingRole(true);
    console.log("role changed")
    try {
        const response = await axios.post(process.env.REACT_APP_BASE_URL + "/api/users/toggleRole", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      var NewProfileData = profileData;
      NewProfileData.user.role = response
      console.log(response)
      setProfileData(NewProfileData);
      SetIsRoleAuthor(response !== "user");
      setChangingRole(false);
    } catch (error) {
      setChangingRole(false);
      console.error("Error fetching info:", error);
    }
  };

  const handleUploadBook = () => {
    navigate("uploadBook");
  };

  const handleUploadBlog = () => {
    navigate("uploadBlog");
  };

  const convertBase64ToUrl = (base64String) => {
    return `data:image/jpeg;base64,${base64String}`;
  };

  const extractDescription = (contentArray, numOfLines) => {
    let description = '';
    let linesAdded = 0;
  
    if (!contentArray)
    {
      return;
    }

    for (const element of contentArray) {
      if (linesAdded >= numOfLines) break;
  
      const text = element.children.map(child => child.text).join(' ');
  
      if (text.trim()) {
        description += (description ? ' ' : '') + text;
        linesAdded++;
      }
    }
  
    return description;
  };

  if (!profileData) {
    return (
    <div className="h-screen w-screen flex items-center justify-center align-middle">
      <IconLoader
          className="animate-spin h-32 w-32 text-mehroon"
      />
    </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Navbar 
        title="Logout"
        onClick={logout}
      />
      <div className="py-8">
        {/* Profile Header */}
        <div className="bg-orange bg-opacity-75 border-2 border-mehroon text-mehroon font-Display px-4 mx-8 py-6 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={convertBase64ToUrl(profileData.user.profilePic)}
                alt="Profile"
                className="h-28 w-28 rounded-full"
              />
            </div>
            <div className="h-3/4 flex flex-col flex-1 items-start pl-4">
              <h2 className="text-2xl font-bold text-profilehead">
                {profileData.user.name}
              </h2>
              <p className="text-text mt-2 text-opacity-65">
                {profileData.user.email}
              </p>
              <p className="mt-2 text-opacity-65 text-left text-btn">
                {IsRoleAuthor ? "You are in author mode." : "You are in viewer mode. fratures like upload blog or books will not be available. "}
                <a href="#" onClick={handleRoleChange} className="underline flex flex-row">Click here to change role
                  {ChangingRole && <IconLoader className="h-6 w-6 text-mehroon animate-spin ml-2"/>}
                </a>
              </p>
            </div>
            <div className="flex flex-col font-light">
              <div className="ml-auto">
                <Button
                  onClick={handleUpdateProfile}
                  name={"Update Profile"}
                  containerclassName={"hover:ring-2 ring-orange"}
                  btnclassName={"flex-nowrap"}
                >
                  <IconEdit className="min-w-5 min-h-5 h-5 w-5 mr-1" />
                </Button>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={handleUploadBook}
                  name={"Upload Book"}
                  containerclassName={"hover:ring-2 ring-orange"}
                  btnclassName={"flex-nowrap"}
                  disabled={!IsRoleAuthor}
                >
                  <IconEdit className="min-w-5 min-h-5 h-5 w-5 mr-1" />
                </Button>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={handleUploadBlog}
                  name={"Upload Blog"}
                  containerclassName={"hover:ring-2 ring-orange"}
                  btnclassName={"flex-nowrap"}
                  disabled={!IsRoleAuthor}
                >
                  <IconEdit className="min-w-5 min-h-5 h-5 w-5 mr-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Books Uploaded */}
        <div className="my-8 bg-pink border-y-2 border-mehroon">
          <BookShelf
            title="Books Uploaded"
            books={profileData.booksUploaded}
          />
        </div>

        {/* Liked Books */}
        <div className="my-8 bg-pink border-y-2 border-mehroon">
          <BookShelf
            title="Liked Books"
            books={profileData.booksLiked}
          />
        </div>

        {/* Liked Blogs */}
        <div>
          <div className="text-cardtitle text-mehroon justify-start flex mx-14 my-4">
            Liked Blogs
          </div>
          <div className="flex flex-wrap">
            {profileData.blogsLiked.length === 0 && <span className="ml-24 flex flex-row items-center text-mehroon text-text"><IconCat className="p-2 m-3 text-mehroon h-10 w-10 font-thin rounded-full bg-mehroon bg-opacity-20"/> WOW, Such Empty. </span>}
            {profileData.blogsLiked.map((blog, index) => (
              <Card key={index} src={blog.featuredImage} />
            ))}
          </div>
        </div>

        {/* Blogs Uploaded */}
 
        <div>
          <div className="text-cardtitle text-mehroon justify-start flex mx-14 my-4">
            Blogs Uploaded
          </div>
          <div className="flex flex-wrap">
            {profileData.blogsUploaded.length === 0 && <span className="ml-24 flex flex-row items-center text-mehroon text-text"><IconCat className="p-2 m-3 text-mehroon h-10 w-10 font-thin rounded-full bg-mehroon bg-opacity-20"/> WOW, Such Empty. </span>}
            {profileData.blogsUploaded.map((blog, index) => (
              <Card 
                key={index} 
                src={blog.featuredImage}
                title= {blog.title}
                discription= {extractDescription(JSON.parse(blog.content), 2)}
                id= {blog._id}
                readtime= {blog.readingTime}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
