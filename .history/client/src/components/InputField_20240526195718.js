import React from 'react'

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields, placeholder }) => {
    return (
        <div className='w-full'>
            <input 
            type={type || "text"}
            className="-ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" 
            value={value}
            placeholder={placeholder} 
            onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
            />
        </div>
    )
}

export default InputField
