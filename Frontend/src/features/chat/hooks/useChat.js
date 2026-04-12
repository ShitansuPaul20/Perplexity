import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage } from "../service/chat.api";
import { useDispatch } from "react-redux";
import { setLoading, setError, setCurrentChatId, createNewChat, addNewMessage, replaceTempChat } from "../chat.slice";

export const useChat = () => {
    const dispatch = useDispatch();

    // tempId - sirf naye chat ke liye pass hoga
    async function handleSendMessage(messageData, chatId, tempId = null) {
        try {
            dispatch(setLoading(true))

            const response = await sendMessage({ messageData, chatId })
            const { newChat, aiMessage, userMessage } = response.data

            const activeChatId = newChat?._id || chatId

            if (newChat) {
                if (tempId) {
                    // temp chat ko real chat se replace karo
                    dispatch(replaceTempChat({
                        tempId,
                        realId: newChat._id,
                        title: newChat.title,
                        // user message already add tha temp chat mein, usse move karo
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
            } else {
                // existing chat - user message ChatArea ne already add kar diya
                // duplicate avoid karne ke liye yahan add nahi karenge
            }

            // AI message add karo
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

    return {
        initializeSocketConnection,
        handleSendMessage,
    }
}