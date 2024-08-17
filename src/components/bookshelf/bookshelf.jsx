import React from "react";
import PropTypes from "prop-types";
import { IconSearch, IconBooks, IconCat } from "@tabler/icons-react";
import Button from "../../components/button/button";
import BookCard from "../../components/bookCard/bookCard";
import Card from "../card/Card";
import NotificationCard from "../NotificationCard/NotificationCard";
import Navbar from "../../components/navbar/navbar";
import './bookshelf.css';
import { useNavigate, useParams } from 'react-router-dom';

const BookShelf = (props) => {
    const navigate = useNavigate()
    
    return (
        <div className="">
            <div className="text-cardtitle text-mehroon justify-start flex mx-14">
                {props.title}
            </div>
            <div className="Book Shelf flex flex-row mx-5 overflow-x-auto justify-evenly mask">
                {props.books.length === 0 && <span className="flex flex-row items-center text-mehroon text-text"><IconCat className="p-2 m-3 text-mehroon h-10 w-10 font-thin rounded-full bg-mehroon bg-opacity-20"/> WOW, Such Empty. </span>}
                {props.books.map((book, index) => (
                    <button
                        onClick = {() => {navigate("/Book/" +  book._id)}} 
                    >
                        <BookCard key={index} src={book.featuredImage} />
                    </button>
                ))}
            </div>
        </div>
    )
};

BookShelf.propTypes = {
    title: PropTypes.string,
    books: PropTypes.array
};

BookShelf.defaultProps = {
    title: "Books",
    books: []
};

export default BookShelf;