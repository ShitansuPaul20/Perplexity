import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getAllChats, getMessagesByChatId, deleteChatapi } from "../service/chat.api";
import { useDispatch } from "react-redux";
import { setLoading, setError, setCurrentChatId, createNewChat, addNewMessage, replaceTempChat, setChats, setChatMessages, deleteChat } from "../chat.slice";

export const useChat = () => {
    const dispatch = useDispatch();

    async function handleGetAllChats() {
        try {
            const response = await getAllChats()
            const chatsArray = response.data.chats

            const chatsObject = chatsArray.reduce((acc, chat) => {
                acc[chat._id] = {
                    ...chat,
                    messages: chat.messages || [],
                }
                return acc
            }, {})

            dispatch(setChats(chatsObject))
        } catch (error) {
            console.error("Error fetching chats:", error)
        }
    }

    async function handleGetMessages(chatId) {
        try {
            const response = await getMessagesByChatId(chatId)
            const messages = response.data.messages || response.data

            dispatch(setChatMessages({ chatId, messages }))
            dispatch(setCurrentChatId(chatId))
        } catch (error) {
            console.error("Error fetching messages:", error)
        }
    }

    async function handleSendMessage(messageData, chatId, tempId = null) {
        try {
            dispatch(setLoading(true))

            const response = await sendMessage({ messageData, chatId })
            const { newChat, aiMessage, userMessage } = response.data

            const activeChatId = newChat?._id || chatId

            if (newChat) {
                if (tempId) {
                    dispatch(replaceTempChat({
                        tempId,
                        realId: newChat._id,
                        title: newChat.title,
                    }))
                } else {
                    dispatch(createNewChat({
                        chatId: newChat._id,
                        title: newChat.title,
                    }))
                    dispatch(addNewMessage({
                        chatId: activeChatId,
                        content: userMessage.content,
                        role: 'user',
                    }))
                }
            }

            dispatch(addNewMessage({
                chatId: activeChatId,
                content: aiMessage.content,
                role: aiMessage.role,
            }))

            dispatch(setCurrentChatId(activeChatId))

        } catch (error) {
            console.error("Error sending message:", error)
            dispatch(setError(error.response?.data?.message || "Failed to send message"))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            await deleteChatapi(chatId)
            dispatch(deleteChat(chatId))
        } catch (error) {
            console.error("Error deleting chat:", error)
            dispatch(setError(error.response?.data?.message || "Failed to delete chat"))
        }
    }

    return {
        initializeSocketConnection,
        handleGetAllChats,
        handleGetMessages,
        handleDeleteChat,
        handleSendMessage,
    }
}