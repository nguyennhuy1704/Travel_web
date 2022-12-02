import AxiosClient from '@/apis/AxiosClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getMe: any = createAsyncThunk('user/getMe', async (params, thunkAPI) => {
    if(!localStorage.getItem('token')) return
    const currentUser = await AxiosClient.get('/Authentication/GetUserInfo');
    return currentUser?.data;
});

const rootSlice = createSlice({
    name: 'user',
    initialState: {
        appLoading: true,
        user: null
    },
    reducers: {
        setAppLoading: (state) => {
            state.appLoading = false;
        },
    },
    extraReducers: {
        [getMe.fulfilled]: (state: any, action: any) => {
            state.user = action.payload;
        },
    },
});

const { reducer: appReducer, actions } = rootSlice;
export const { setAppLoading } = actions;
export default appReducer;
