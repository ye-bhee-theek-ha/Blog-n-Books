import React from 'react'
import PropTypes from 'prop-types'

const BookCard = (props) => {

    return(
        <div className={"flex flex-wrap content-center m-2 h-[150px] min-w-[100px] w-[100px] rounded-3xl border-pink border-2 overflow-hidden shadow-pink shadow-sm transition ease-in-out duration-300 hover:shadow-pink hover:shadow-lg hover:scale-105" 
                        + " " 
                        + props.containerclassName}>
            <img src={props.src} alt="img" className="h-full w-full object-cover" />
        </div>
    )
}

BookCard.prototypes = {
    containerclassName: PropTypes.string,
    onclick: PropTypes.func,
    src: PropTypes.string,
}

BookCard.defaultProps = {
    containerclassName: "",
    onClick: () => {console.log("btn pressed.")},
    src: "none",
}

export default BookCard;