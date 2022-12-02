import postReducer from "@/features/App/post/slice/Post.slice";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import appReducer from "./slice/root.slice";
const rootReducer = {
  root: appReducer,
  post: postReducer
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
