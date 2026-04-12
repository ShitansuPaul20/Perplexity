import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},           
        currentChatId: null,   
        // messages: [],        
        isloading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[chatId] = { _id: chatId, title, messages: [] ,lastUpdated: new Date().toISOString(), }
            state.currentChatId = chatId;
        },
        replaceTempChat: (state, action) => {
            const { tempId, realId, title } = action.payload;
            const tempChat = state.chats[tempId];
            if (tempChat) {
                // temp ke messages real chat mein le jao
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
            state.chats[chatId].messages.push({ content, role });
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
            state.messages = []  // clear old messages on chat switch
        },
        setLoading: (state, action) => {
            state.isloading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        // Socket se aane wale real-time messages ke liye
        // appendMessage: (state, action) => {
        //     state.messages.push(action.payload)
        // },
    }
})

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, replaceTempChat } = chatSlice.actions
export default chatSlice.reducer