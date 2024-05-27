import React from 'react'

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields, placeholder }) => {
    return (
        <div className='w-full'>
            <input 
            type={type || "text"}
            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500" 
            value={value}
            placeholder={placeholder} 
            onChange={e => setValue(prev => ({...prev, [nameKey]: e.target.value}))}
            onFocus={() => setInvalidFields && setInvalidFields([])}
            />
            {invalidFields?.some(el => el.name === nameKey) && <small className='text-red-400 italic'>{invalidFields.find(el => el.name === nameKey)?.mes}</small>}
        </div>
    )
}

export default InputField
