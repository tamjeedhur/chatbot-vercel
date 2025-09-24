import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface TextContent {
  chatbotId: string;
  tenantId: string;
  title: string;
  content: string;
  contentType: string;
  metadata: {
    source: string;
    author: string;
    createdAt: string;
  };
  hash: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface TextContentState {
  allTextContent: TextContent[];
}
const initialState: TextContentState = {
  allTextContent: [],
};

const dataSourcesSlice = createSlice({
  name: 'dataSources',
  initialState,
  reducers: {
    setAllTextContent: (state, action: PayloadAction<TextContent[]>) => {
      state.allTextContent = action.payload;
    },
    addTextContent: (state, action: PayloadAction<TextContent>) => {
      state.allTextContent.push(action.payload);
    },
    updateTextContent: (state, action: PayloadAction<TextContent>) => {
      state.allTextContent = state.allTextContent.map((content) => content.id === action.payload.id ? action.payload : content);
    },
    deleteTextContent: (state, action: PayloadAction<string>) => {
      state.allTextContent = state.allTextContent.filter((content) => content.id !== action.payload);
    },
  },
});

export const { setAllTextContent, addTextContent, updateTextContent, deleteTextContent } = dataSourcesSlice.actions;
export default dataSourcesSlice.reducer;

export const selectAllTextContent = (state: { dataSources: TextContentState }) => state.dataSources.allTextContent;
