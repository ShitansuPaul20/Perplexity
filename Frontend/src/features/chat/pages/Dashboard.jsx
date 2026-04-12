import React, { useEffect, useState } from 'react'
import { useChat } from '../hooks/useChat'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import { Menu } from 'lucide-react'
import { useSelector } from 'react-redux'

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { initializeSocketConnection } = useChat()

    useEffect(() => {
        initializeSocketConnection()
    }, [])

    const state = useSelector(state => state)
    console.log(state)

    return (
        <main className="h-screen w-full flex bg-[#141414] overflow-hidden">

            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(prev => !prev)}
            />

            <div className="flex-1 flex flex-col min-w-0">

                {/* Mobile Header - sirf mobile pe */}
                <div className="flex items-center px-4 py-3 border-b border-white/8 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-white/50 hover:text-white transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                    <span className="text-white/70 text-sm font-medium ml-3">Lumina</span>
                </div>

                <ChatArea />
            </div>
        </main>
    )
}

export default Dashboard