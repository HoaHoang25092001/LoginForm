import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        mes: '',
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
            state.token = action.payload.token
        },
        logout: (state, action) => {
            state.isLoggedIn = false
            state.current = null
            state.token = null
            state.isLoading = false
            state.mes = ''
        },
    },
    //   extraReducers: (builder) => {
    //     builder.addCase(getNewProducts.pending, (state) => {
    //       state.isLoading = true
    //     })
    //     builder.addCase(getNewProducts.fulfilled, (state, action) => {
    //       state.isLoading = false
    //       state.newProducts = action.payload
    //     })
    //     builder.addCase(getNewProducts.rejected, (state, action) => {
    //       state.isLoading = false
    //       state.errorMessage = action.payload.message
    //     })
    //   },
})
export const { login, logout } = userSlice.actions

export default userSlice.reducer
