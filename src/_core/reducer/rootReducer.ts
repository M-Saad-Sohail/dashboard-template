import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/authSlice";
import adminAlbumsReducer from '../features/adminAlbumsSlice';
import adminTracksReducer from '../features/adminTracksSlice';
import adminMusicReducer from '../features/adminMusicSlice';
import adminAlbumDetailsReducer from '../features/adminAlbumDetailsSlice';

const appReducer = combineReducers({
  auth: authReducer,
  adminAlbums: adminAlbumsReducer,
  adminTracks: adminTracksReducer,
  adminMusic: adminMusicReducer,
  adminAlbumDetails: adminAlbumDetailsReducer,
});

// Root reducer with optional global reset behavior
const rootReducer = (state: any, action: any) => {
  // If logout is dispatched, clear persisted data from storage
  if (action.type === "auth/signOut/fulfilled") {
    storage.removeItem("persist:root");
    // Reset state to undefined, effectively clearing all reducers
    return appReducer(undefined, action);
  }

  // Otherwise, proceed normally
  return appReducer(state, action);
};

// Wrap the root reducer with persistence configuration
const persistedReducers = persistReducer(
  {
    key: "root", // Key for persisted root object
    storage, // Use localStorage via redux-persist
    whitelist: ["auth"], // Only persist these slices
  },
  rootReducer
);

// Export persisted root reducer for use in store configuration
export default persistedReducers;
