import React from 'react'

const Button = ({ name, handleOnclick, style, iconBefore, iconAfter }) => {
    return (
        <div>
            <button
                className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                onClick={() => {handleOnclick && handleOnclick()}}
            >
                {iconBefore}
                <span>{name} </span>
                {iconAfter}
            </button>
        </div>
    )
}

export default Button
