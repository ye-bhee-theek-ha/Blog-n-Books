import {IconLoader} from "@tabler/icons-react"
import React from 'react'

const Loader = () => {
    return (
        <div className="w-full h-full absolute rounded-full blur">
            <IconLoader
                className="animate-spin h-20 w-20 text-mehroon"
            />
        </div>
    )
}

export default Loader