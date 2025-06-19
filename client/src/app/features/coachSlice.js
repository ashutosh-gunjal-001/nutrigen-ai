import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../api/chatService';

const initialState = {
  chatHistory: [],
  isTyping: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'coach/sendMessage',
  async (messages, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(messages);
      return { aiResponse: response.reply };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const coachSlice = createSlice({
  name: 'coach',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearChat: (state) => {
      state.chatHistory = [];
    },
    resetChat: (state) => {
      state.chatHistory = [];
      state.isTyping = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        state.chatHistory.push({
          role: 'assistant',
          content: action.payload.aiResponse,
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isTyping = false;
        state.error = action.payload;
        state.chatHistory.push({
          role: 'assistant',
          content: `Sorry, something went wrong. Please try again. (${action.payload})`,
        });
      });
  },
});

export const { addUserMessage, clearError, setTyping, clearChat, resetChat } = coachSlice.actions;
export default coachSlice.reducer;