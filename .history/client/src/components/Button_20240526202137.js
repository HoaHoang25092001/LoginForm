import React from 'react'

const Button = ({ name, handleOnclick, style, iconBefore, iconAfter }) => {
    return (
        <div>
            <button
                className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
            >
                {iconBefore}
                <span>LOGIN HERE </span>
                {iconAfter}
            </button>
        </div>
    )
}

export default Button
