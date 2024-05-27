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

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body
  if (!email || !password || !lastname || !firstname || !mobile)
    return res.status(res.statusCode).json({
      status: false,
      mes: "Missing inputs",
    })
  const user = await User.findOne({ email })
  if (user) {
    return res.status(res.statusCode).json({
      status: false,
      mes: "User has existed",
    })
  }
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
    }, [500000])

    return res.json({
      status: newUser ? true : false,
      mes: newUser
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
    mes: notActivedEmail
      ? "Register is Successfully. Please go login."
      : "Some went wrong, please try later",
  })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({
      status: false,
      mes: "Missing inputs",
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
  if (!email) {
    return res.status(res.statusCode).json({
      status: false,
      res: 'Missing email'
    })
  }
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(res.statusCode).json({
      status: false,
      res: 'User not found'
    })
  }
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
    mes: rs.response?.includes("OK")
      ? "Check your mail please."
      : "Something went wrong. Please try later",
  })
})

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body
  if (!password || !token) {
    return res.status(res.statusCode).json({
      status: false,
      mes: 'Missing inputs'
    })
  }
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) {
    return res.status(res.statusCode).json({
      status: false,
      mes: 'Invalid reset token'
    })
  }
  user.password = password
  user.passwordResetToken = undefined
  user.passwordChangedAt = Date.now()
  user.passwordResetExpires = undefined
  await user.save()
  return res.status(200).json({
    status: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  })
})

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies")
  // Xóa refresh token ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  )
  // Xóa refresh token ở cookie trình duyệt
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  })
  return res.status(200).json({
    status: true,
    mes: "Logout is done",
  })
})
module.exports = {
  register,
  finalRegister,
  login,
  forgotPassword,
  resetPassword,
  logout
}