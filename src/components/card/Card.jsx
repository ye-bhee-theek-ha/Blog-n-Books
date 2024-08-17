import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '../button/button';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../../Auth/Auth";

import {
    IconHeart,
    IconHeartFilled
} from "@tabler/icons-react";

const Card = (props) => {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const token = getToken();

    const [loading, SetLoading] = useState(false)

    const like = async () => {
        SetLoading(true);
        try {  
          const response = await axios.post(`https://blog-and-books-backend-56eu.vercel.app/api/blogs/like/${props.id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(response)
        SetLoading(false);         
        
        } catch (error) {
            SetLoading(false);          
            console.error("Error liking:", error);
        }
      }

    return(
        <div className='flex flex-row mx-10 my-6 rounded-3xl bg-grey border-pink border-2 overflow-hidden text-mehroon col-span-1'>
            <div className={"flex flex-wrap content-center h-full w-36 rounded-2xl border-pink overflow-hidden shadow-pink shadow-lg self-center" 
                            + " " 
                            + props.containerclassName}>
                <img src={props.src} alt="img" className="h-full w-full object-cover self-center" />
            </div>
            <div className='flex flex-1 flex-col justify-around'>
                <div className='flex flex-row mx-8 mr-14 text-subheading justify-between'>
                    <div className="relative h-24">
                        <h3>{props.title}</h3>
                        <div className="h-fit w-fit mx-4 space-x-2 absolute bottom-0">
                            {props.tags.map((tag, index) => (
                                <button
                                    key={index}
                                    className="text-tag_btn px-2 bg-mehroon bg-opacity-25 rounded-full border border-mehroon hover:shadow-md hover:bg-opacity-35"
                                >
                                {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className='flex h-8 w-8 my-3 rounded-md border-mehroon bg-lorange border justify-center items-center ring-lpink hover:ring-2'
                        onClick={like}
                    >
                        {props.IsLiked ? <IconHeartFilled className={loading && "animate-ping"}/> : <IconHeart className={loading && "animate-ping"}/>}
                        {props.IsLiked ? <IconHeartFilled className = "absolute inline-flex  opacity-75" /> : <IconHeart className="absolute inline-flex opacity-75"/>}
                    </button>
                </div>
                <div className='flex mx-4 text-text text-start'>
                    <p>{props.description}</p>
                </div>
                <div className='mt-3 flex flex-row justify-between mx-12'>
                    <div className='flex flex-row'>
                        <Button
                            name = {"Read Time: " + props.readtime + " mins"}
                            btnclassName = "text-blog_btn py-1"
                            containerclassName = "bg-offwhite border-mehroon border bg-opacity-50"
                        />
                        <Button
                            name = {"likes: " + props.likes}
                            btnclassName = "text-blog_btn py-1"
                            containerclassName = "bg-offwhite border-mehroon border bg-opacity-50"
                        />
                    </div>
                    <div>
                        <Button
                            name = "Read Now"
                            btnclassName = "text-blog_btn py-1"
                            containerclassName = "bg-lorange border-mehroon border ring-lpink hover:ring-2"
                            onClick = {() => {navigate("/blog/" + props.id)}} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

Card.prototypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    containerclassName: PropTypes.string,
    onclick: PropTypes.func,
    src: PropTypes.string,
    id: PropTypes.string,
    readtime: PropTypes.int,
    likes: PropTypes.int,
    tags: PropTypes.array
}

Card.defaultProps = {
    title: "Title",
    description: "lorem ipsium dala dolorese, okay done the lazy brown foz jumps over the lazy goats, the lazy brown foz jumps over the, the lazy brown foz jumps over the",
    containerclassName: "",
    onClick: () => {console.log("btn pressed.")},
    src: "none",
    id: "",
    readtime: 2,
    likes: 3,
    IsLiked: false,
    tags: []
}

export default Card;
