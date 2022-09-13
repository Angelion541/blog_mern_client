import { configureStore } from "@reduxjs/toolkit";
import { postsReducer, authReducer } from "./slices";

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
  },
});

export default store;