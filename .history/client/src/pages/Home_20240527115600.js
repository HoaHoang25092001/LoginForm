import React from 'react'

const Home = () => {
    return (
        <div className="font-sans text-gray-900 antialiased">
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f8f4f3]">
                <div>
                    <h2 className="font-bold text-3xl">Well come to my  <span className="bg-[#f84525] text-white px-2 rounded-md">WEBSITE</span></h2>
                </div>
                <div>
                    <button
                        type="button"
                        className="px-4 py-2 mt-4 mx-auto bg-blue-500 font-semibold text-white rounded-md ml-4"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Home
