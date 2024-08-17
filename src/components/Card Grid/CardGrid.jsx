import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/button';
import { useNavigate } from 'react-router-dom';
import { IconHeartFilled } from "@tabler/icons-react";

const CardGrid = (props) => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col bg-gray-100 border border-pink rounded-xl overflow-hidden shadow-pink shadow-lg mx-4 my-6 col-span-1'>
            <div className="overflow-hidden">
                <img src={props.src} alt="img" className="w-full object-cover h-60" />
            </div>
            <div className='flex flex-col p-4'>
                <h3 className="text-lg font-semibold mb-2">{props.title}</h3>
                <div className="flex flex-col justify-between items-center mb-4">
                    <Button
                        name = "Read Time: 8 mins"
                        btnclassName = "text-sm py-1"
                        containerclassName = "bg-offwhite border-mehroon border bg-opacity-50 rounded-sm"
                    />
                    <Button
                        name = "likes: 8"
                        btnclassName = "text-sm py-1"
                        containerclassName = "bg-offwhite border-mehroon border bg-opacity-50 rounded-sm"
                    />
                </div>
                <div className="flex justify-between items-center">
                        <Button
                            name = "Read Now"
                            btnclassName = "text-blog_btn py-1"
                            containerclassName = "bg-lorange border-mehroon border ring-lpink hover:ring-2"
                            onClick = {() => {navigate("/book/" + props.id)}} 
                        />
                    <button className='like-button'>
                        <IconHeartFilled className='h-8 w-8 text-mehroon'/>
                    </button>
                </div>
            </div>
        </div>
    );
}

CardGrid.propTypes = {
    title: PropTypes.string,
    discription: PropTypes.string,
    containerclassName: PropTypes.string,
    onClick: PropTypes.func,
    src: PropTypes.string,
    id: PropTypes.string,
    read_time: PropTypes.number,
    likes: PropTypes.number,
}

CardGrid.defaultProps = {
    title: "Title",
    discription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    containerclassName: "",
    onClick: () => { console.log("btn pressed.") },
    src: "none",
    id: "0",
    read_time: 8,
    likes: 12,
}

export default CardGrid;
