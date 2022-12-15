import AxiosClient from '@/apis/AxiosClient';
import LocalStorage from '@/apis/LocalStorage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getMe: any = createAsyncThunk('user/getMe', async (params, thunkAPI) => {
    if (!LocalStorage.getLogged()) return;
    const currentUser: any = await AxiosClient.get('/me');
    return currentUser?.user;
});

const rootSlice = createSlice({
    name: 'user',
    initialState: {
        appLoading: true,
        user: null,
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
