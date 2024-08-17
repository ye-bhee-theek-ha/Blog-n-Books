import React from 'react'
import PropTypes from 'prop-types'

const NotificationCard = (props) => {

    return(
        <div className={"flex flex-col m-2 h-fit w-fit rounded-2xl  text-mehroon border-mehroon border-2 flex-wrap " 
                        + " " 
                        + props.containerclassName}>
            <div className='w-full h-fit min-h-8 px-3 border-b-2 border-mehroon rounded-t-2xl bg-lorange'>
                <div className='flex text-text justify-start'>
                    {props.title}
                </div>
            </div>
            <div className={'flex flex-1 flex-col flex-wrap justify-evenly rounded-b-2xl content-start w-full p-3 py-5 bg-mehroon bg-opacity-25'}>
                {props.children}
            </div>
        </div>
    )
}

NotificationCard.prototypes = {
    onclick: PropTypes.func,
    title: PropTypes.string,
    containerclassName: PropTypes.string
}

NotificationCard.defaultProps = {
    onClick: () => {console.log("btn pressed.")},
    title: "Title",
    containerclassName: "",
}

export default NotificationCard;