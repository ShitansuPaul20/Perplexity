import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isloading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[chatId] = {
                _id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
            state.currentChatId = chatId;
        },
        replaceTempChat: (state, action) => {
            const { tempId, realId, title } = action.payload;
            const tempChat = state.chats[tempId];
            if (tempChat) {
                state.chats[realId] = {
                    _id: realId,
                    title,
                    messages: tempChat.messages,
                    lastUpdated: new Date().toISOString(),
                }
                delete state.chats[tempId]
            }
            state.currentChatId = realId;
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push({ content, role });
                state.chats[chatId].lastUpdated = new Date().toISOString();
            }
        },
        deleteChat: (state, action) => {
            const chatId = action.payload;
            delete state.chats[chatId];
            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        },
        
        setChatMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages;
            }
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isloading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const {
    setChats,
    setCurrentChatId,
    setLoading,
    setError,
    createNewChat,
    addNewMessage,
    replaceTempChat,
    setChatMessages,
    deleteChat,
} = chatSlice.actions

export default chatSlice.reducer