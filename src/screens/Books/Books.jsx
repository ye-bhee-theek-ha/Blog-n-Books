import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconSearch, IconBooks } from "@tabler/icons-react";
import Button from "../../components/button/button";
import BookCard from "../../components/bookCard/bookCard";
import Card from "../../components/card/Card";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import Navbar from "../../components/navbar/navbar";
import {
    IconLayoutGrid,
    IconLayoutList
} from "@tabler/icons-react";
import CardGrid from "../../components/Card Grid/CardGrid";


const Books = (props) => {

    const [Layout, SetLayout] = useState("List")

    const ChangeLayout = () => {

        if (Layout == "List"){
            SetLayout("Grid")
        }
        else if (Layout == "Grid"){
            SetLayout("List")
        }
    }

    const blogs = [
        "https://picsum.photos/100/180",
        "https://picsum.photos/120/180",
        "https://picsum.photos/130/190",
        "https://picsum.photos/130/150",
        "https://picsum.photos/170/180",
        "https://picsum.photos/190/180",
        "https://picsum.photos/100/180",
        "https://picsum.photos/120/180",
        "https://picsum.photos/130/190",
        "https://picsum.photos/130/150",
        "https://picsum.photos/170/180",
        "https://picsum.photos/190/180",
      ];


  return (
    <div>
        <div className="bg-lgreen">
            <Navbar />
        </div>
        
        <div className="flex flex-row justify-between items-center">
            <div className="text-cardtitle text-mehroon justify-start flex mx-14 my-4">
            Books by the Author
            </div>
            <div className="mx-14 my-4">
                <button onClick={ChangeLayout}>
                    {Layout == "List" ? <IconLayoutList className="h-8 w-8 text-mehroon"/> : <IconLayoutGrid className="h-8 w-8 text-mehroon"/>}
                </button>
            </div>
        </div>
        <div>
            {Layout === "List" &&
                blogs.map((blog, index) => (
                    <Card key={index} src={blog} />
                ))
            }
            <div className={"grid grid-cols-3 md:grid-cols-4 w-full h-full p-10 max-w-7xl mx-auto gap-4 relative "}>
                {Layout === "Grid" &&
                    blogs.map((blog, index) => (
                        <CardGrid key={index} src={blog} />
                    ))
                }
            </div>
            
        </div>
    </div>
  );
};

Books.propTypes = {};

Books.defaultProps = {};

export default Books;
