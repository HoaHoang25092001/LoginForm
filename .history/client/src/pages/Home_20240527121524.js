import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import path from "../utils/path"
import { useSelector, useDispatch } from "react-redux"
import Swal from "sweetalert2"
import { getCurrent } from "../store/user/asyncAction"


const Home = () => {
    const { isLoggedIn, current, mes } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            if (isLoggedIn) dispatch(getCurrent())
        }, 300)

        return () => {
            clearTimeout(setTimeoutId)
        }
    }, [dispatch, isLoggedIn])

    useEffect(() => {
        if (mes)
            Swal.fire("Oops!", mes, "info").then(() => {
                navigate(`/${path.LOGIN}`)
            })
    }, [mes])
    return (
        <div className="font-sans text-gray-900 antialiased">
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f8f4f3]">
                {isLoggedIn && current ? (
                    <div>
                        <h2 className="font-bold text-3xl">Well come to my  <span className="bg-[#f84525] text-white px-2 rounded-md">WEBSITE</span></h2>
                        <span className="pl-2">{`Welcome, ${current?.lastname} ${current?.firstname}`}</span>
                    </div>
                ) : (
                    <Link className="hover:text-gray-800" to={`/${path.LOGIN}`}>
                      Sign In or Create Account
                    </Link>
                  )}
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
