import {configureStore} from '@reduxjs/toolkit'
import { postsReducer } from './slices/posts.js'
export const store = configureStore({
    reducer : {
        posts : postsReducer,
    }
})