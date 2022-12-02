import AxiosClient from '@/apis/AxiosClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const postSlice = createSlice({
    name: 'post',
    initialState: {
        loading: true,
    },
    reducers: {
        setAppLoading: (state) => {
            state.loading = false;
        },
    },
    
});

const { reducer: postReducer, actions } = postSlice;
export const { setAppLoading } = actions;
export default postReducer;
