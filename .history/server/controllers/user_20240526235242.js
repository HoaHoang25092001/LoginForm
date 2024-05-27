const User = require("../models/user")
const asyncHandler = require("express-async-handler")
const {
    generateAccessToken,
    generateRefreshToken,
  } = require("../middlewares/jwt")
  const jwt = require("jsonwebtoken")
  const sendMail = require("../utils/sendMail")
  const makeToken = require("uniqid")
  const crypto = require("crypto")
const { response } = require("express")

  const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if (!email || !password || !lastname || !firstname || !mobile)
      return res.status(400).json({
        status: false,
        res: "Missing inputs",
      })
    const user = await User.findOne({ email })
    if (user) throw new Error("User has existed")
    else {
      const token = makeToken()
      const emailedited = btoa(email) + "@" + token
      const newUser = await User.create({
        email: emailedited,
        password,
        firstname,
        lastname,
        mobile,
      })
      if (newUser) {
        const html = `<h2>Register code:</h2><br /><blockquote>${token}</blockquote>`
        await sendMail({
          email,
          html,
          subject: "Confirm register account in Digital World",
        })
      }
      setTimeout(async () => {
        await User.deleteOne({ email: emailedited })
      }, [300000])
  
      return res.json({
        status: newUser ? true : false,
        res: newUser
          ? "Please check your email to active account"
          : "Some went wrong, please try later",
      })
    }
  })

  const finalRegister = asyncHandler(async (req, res) => {
    // const cookie = req.cookies
    const { token } = req.params
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) })
    if (notActivedEmail) {
      notActivedEmail.email = atob(notActivedEmail?.email?.split("@")[0])
      notActivedEmail.save()
    }
    return res.json({
      status: notActivedEmail ? true : false,
      res: notActivedEmail
        ? "Register is Successfully. Please go login."
        : "Some went wrong, please try later",
    })
  })

  const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({
        status: false,
        res: "Missing inputs",
      })
    // plain object
    const response = await User.findOne({ email })
    if (response && (await response.isCorrectPassword(password))) {
      // Tách password và role ra khỏi response
      const { password, role, refreshToken, ...userData } = response.toObject()
      // Tạo access token
      const accessToken = generateAccessToken(response._id, role)
      // Tạo refresh token
      const newRefreshToken = generateRefreshToken(response._id)
      // Lưu refresh token vào database
      await User.findByIdAndUpdate(
        response._id,
        { refreshToken: newRefreshToken },
        { new: true }
      )
      // Lưu refresh token vào cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      return res.status(200).json({
        status: true,
        accessToken,
        userData,
      })
    } else {
      throw new Error("Invalid credentials!")
    }
  })

  const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error("Missing email")
    const user = await User.findOne({ email })
    if (!user) throw new Error("User not found")
    const resetToken = user.createPasswordChangedToken()
    await user.save()
  
    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`
  
    const data = {
      email,
      html,
      subject: "Forgot password",
    }
    const rs = await sendMail(data)
    return res.status(200).json({
      status: rs.response?.includes("OK") ? true : false,
      res: rs.response?.includes("OK")
        ? "Check your mail please."
        : "Something went wrong. Please try later",
    })
  })
  module.exports = {
    register,
    finalRegister,
    login,
    forgotPassword
  }