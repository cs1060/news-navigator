import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  articles: [],
  savedArticles: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    interests: [],
  },
};

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSavedArticles: (state, action) => {
      state.savedArticles = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addSavedArticle: (state, action) => {
      state.savedArticles.push(action.payload);
    },
    removeSavedArticle: (state, action) => {
      state.savedArticles = state.savedArticles.filter(
        article => article.id !== action.payload
      );
    },
  },
});

export const {
  setArticles,
  setSavedArticles,
  setLoading,
  setError,
  setFilters,
  addSavedArticle,
  removeSavedArticle,
} = newsSlice.actions;

export default newsSlice.reducer;
