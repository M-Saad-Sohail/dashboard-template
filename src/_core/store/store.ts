import { configureStore } from "@reduxjs/toolkit";
import { PURGE, FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER } from "redux-persist";
import rootReducer from "../reducer/rootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [PURGE, FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
