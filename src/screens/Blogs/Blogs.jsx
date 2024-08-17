import React from "react";
import PropTypes from "prop-types";
import { IconSearch, IconBooks } from "@tabler/icons-react";
import Button from "../../components/button/button";
import BookCard from "../../components/bookCard/bookCard";
import Card from "../../components/card/Card";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import Navbar from "../../components/navbar/navbar";

const Blog = (props) => {
  return (
    <div className="bg-lgreen">
      <Navbar />
    </div>
  );
};

Blog.propTypes = {};

Blog.defaultProps = {};

export default Blog;
