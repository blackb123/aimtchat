import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiSearch, FiMoreVertical, FiPaperclip, FiSmile, FiMic, FiInfo, FiLogOut, FiUser, FiMenu, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { apiService } from '@/services/api';
import { Message } from '@/types';
import logoImage from '@/assets/logoaimt.jpeg';

interface ChatLayoutProps {}

const ChatLayout: React.FC<ChatLayoutProps> = () => {
  const [activeChatUserId, setActiveChatUserId] = useState<number | null>(null);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user: currentUser } = useAuth();

  const [conversationMessages, setConversationMessages] = useState<{ [key: string]: Message[] }>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleReceiveMessage = useCallback((message: Message & { tempId?: string }) => {
    if (!message.chat_id) return;
    const chatKey = message.chat_id.toString();
    setConversationMessages(prev => {
      const messages = prev[chatKey] || [];
      let updatedMessages = [...messages];
      if (message.tempId) {
        const index = updatedMessages.findIndex(msg => msg.id === message.tempId);
        if (index !== -1) {
          updatedMessages[index] = { ...message, id: message.id };
        } else {
          if (!updatedMessages.some(msg => msg.id === message.id)) {
            updatedMessages.push(message);
          }
        }
      } else {
        if (!updatedMessages.some(msg => msg.id === message.id)) {
          updatedMessages.push(message);
        }
      }
      return { ...prev, [chatKey]: updatedMessages };
    });
    if (message.sender_id !== currentUser?.id && activeChatId !== message.chat_id) {
      setUsers(prev => prev.map(user =>
        user.chat_id === message.chat_id
          ? { ...user, unread_count: (user.unread_count || 0) + 1 }
          : user
      ));
    }
  }, [activeChatId, currentUser?.id]);

  const handleUserStatus = useCallback((status: { user_id: number; is_online: boolean; username: string }) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      if (status.is_online) {
        newSet.add(status.user_id);
      } else {
        newSet.delete(status.user_id);
      }
      return newSet;
    });
  }, []);

  const { sendMessage: sendSocketMessage, isConnected, connectWithAuth, markMessagesRead } = useSocket(handleReceiveMessage, handleUserStatus);

  const handleUserClick = async (user: any) => {
    if (!currentUser) return;
    try {
      const chatResponse = await apiService.createPrivateChat(currentUser.id, user.id);
      setActiveChatUserId(user.id);
      setActiveChatId(chatResponse.id);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Failed to create/get chat:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const token = localStorage.getItem('token');
      if (token) {
        connectWithAuth(currentUser.id.toString(), token);
      }
    }
  }, [currentUser, connectWithAuth]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiService.getConversations();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeChatId && currentUser) {
        try {
          setMessagesLoading(true);
          const messages = await apiService.getConversationMessages(activeChatId);
          setConversationMessages(prev => ({
            ...prev,
            [activeChatId.toString()]: messages
          }));
          markMessagesRead(activeChatId);
          setUsers(prev => prev.map(user =>
            user.chat_id === activeChatId
              ? { ...user, unread_count: 0 }
              : user
          ));
        } catch (error) {
          console.error('Failed to fetch conversation messages:', error);
        } finally {
          setMessagesLoading(false);
        }
      }
    };
    fetchMessages();
  }, [activeChatId, currentUser, markMessagesRead]);

  const currentUserChat = users.find(user => user.id === activeChatUserId);
  const currentMessages = activeChatId ? (conversationMessages[activeChatId.toString()] || []) : [];

  useEffect(() => {
    if (!messagesLoading && currentMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, messagesLoading, activeChatId]);

  const contacts = users
    .filter((user: any) => user.has_chat)
    .map((user: any) => ({
      id: user.id,
      name: user.name,
      status: onlineUsers.has(user.id) ? 'online' : 'offline',
      avatar: user.avatar,
    }));

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeChatUserId || !activeChatId || !currentUser) return;

    const tempId = Date.now().toString();
    const tempMessage: Message = {
      id: tempId,
      text: content.trim(),
      sender_id: currentUser.id,
      sender: currentUser.username,
      chat_id: activeChatId,
      sent_at: new Date().toISOString(),
    };

    setConversationMessages(prev => ({
      ...prev,
      [activeChatId.toString()]: [...(prev[activeChatId.toString()] || []), tempMessage]
    }));

    try {
      if (isConnected) {
        sendSocketMessage({
          content: content.trim(),
          chat_id: activeChatId,
          receiver_id: activeChatUserId,
          tempId,
        });
      } else {
        const messageResponse = await apiService.sendMessage(
          activeChatUserId,
          content.trim(),
          activeChatId
        );
        setConversationMessages(prev => ({
          ...prev,
          [activeChatId.toString()]: (prev[activeChatId.toString()] || []).map(msg =>
            msg.id === tempId ? { ...messageResponse, sender: currentUser.username } : msg
          )
        }));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setConversationMessages(prev => ({
        ...prev,
        [activeChatId.toString()]: (prev[activeChatId.toString()] || []).filter(msg => msg.id !== tempId)
      }));
    }

    const messageInput = document.getElementById('message-input') as HTMLInputElement;
    if (messageInput) messageInput.value = '';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition"
      >
        <FiMenu size={20} />
      </button>

      {/* Left Sidebar - Conversations */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 w-80 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logoImage}
                alt="AIMT Chat"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-800">AIMT Chat</h2>
            </div>
            {/* Current User Card */}
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold">
                <FiUser size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {currentUser?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500">Connected</p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500">Loading conversations...</div>
              </div>
            ) : (
              <>
                {users
                  .filter(user => user.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => (b.unread_count || 0) - (a.unread_count || 0))
                  .map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className={`flex items-center p-4 mx-2 rounded-md cursor-pointer transition-all duration-200 ${
                        activeChatUserId === user.id
                          ? 'bg-red-50 border-l-1 border-red-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="relative mr-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                          {user.avatar}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          onlineUsers.has(user.id) ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium truncate ${
                            activeChatUserId === user.id ? 'text-red-600' : user.unread_count ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {user.name}
                          </h3>
                          {user.unread_count > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                              {user.unread_count > 99 ? '99+' : user.unread_count}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm truncate ${user.unread_count ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                          {user.message}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 ml-2">
                        {user.time}
                      </div>
                    </div>
                  ))}
              </>
            )}
            {users.length === 0 && (
              <div className="flex justify-center items-center h-32">
                <div className="text-gray-500 text-center">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Start a new chat</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {currentUserChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mr-3 p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <FiMenu size={20} className="text-gray-600" />
                </button>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold">
                  {currentUserChat?.avatar}
                </div>
                <div className="ml-3">
                  <h2 className="font-semibold text-gray-800">{currentUserChat?.name}</h2>
                  <p className={`text-xs ${activeChatUserId && onlineUsers.has(activeChatUserId) ? 'text-green-500' : 'text-gray-400'}`}>
                    {activeChatUserId && onlineUsers.has(activeChatUserId) ? 'Active now' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
                >
                  <FiInfo size={20} />
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/auth';
                  }}
                  className="p-2 hover:bg-red-50 rounded-full transition text-red-500"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar">
              <div className="flex justify-center mb-4">
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">Today</span>
              </div>

              <div className="space-y-4">
                {currentMessages.map((message) => (
                  <div key={message.id || `${message.sender_id}-${message.sent_at}`} className={`flex ${message.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs lg:max-w-md ${message.sender_id === currentUser?.id ? "items-end" : "items-start"}`}>
                      <div className={`${
                        message.sender_id === currentUser?.id
                          ? "bg-red-500 text-white rounded-2xl rounded-tr-none shadow-sm"
                          : "bg-white text-gray-800 rounded-2xl rounded-tl-none shadow-sm border border-gray-100"
                      } px-4 py-2`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className={`text-xs text-gray-400 mt-1 ${
                        message.sender_id === currentUser?.id ? "text-right mr-1" : "ml-1"
                      }`}>
                        {new Date(message.sent_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {messagesLoading && (
                  <div className="flex justify-center items-center h-32">
                    <div className="text-gray-500 text-center">
                      <p>Loading messages...</p>
                    </div>
                  </div>
                )}

                {!messagesLoading && currentMessages.length === 0 && (
                  <div className="flex justify-center items-center h-32">
                    <div className="text-gray-500 text-center">
                      <p>No messages yet</p>
                      <p className="text-sm mt-1">Start the conversation!</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-100 px-4 py-3">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
                  <FiPaperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    id="message-input"
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          handleSendMessage(target.value);
                          target.value = '';
                        }
                      }
                    }}
                  />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
                  <FiSmile size={20} />
                </button>
                <button className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition text-white shadow-sm">
                  <FiMic size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiMessageSquare size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">Welcome to AIMT Chat</h3>
              <p className="text-gray-500 mt-1">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Contact Info */}
      <div className={`${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed lg:relative right-0 z-40 w-80 h-full bg-white border-l border-gray-200 transition-transform duration-300 ease-in-out shadow-lg lg:shadow-none`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Contact Info</h3>
            <button
              onClick={() => setRightSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <FiMoreVertical size={18} />
            </button>
          </div>

          {currentUserChat && (
            <>
              <div className="p-4 text-center border-b border-gray-100">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl font-bold mx-auto mb-3">
                    {currentUserChat?.avatar}
                  </div>
                  {activeChatUserId && onlineUsers.has(activeChatUserId) && (
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">{currentUserChat?.name}</h3>
                <p className={`text-sm ${activeChatUserId && onlineUsers.has(activeChatUserId) ? 'text-green-500' : 'text-gray-500'}`}>
                  {activeChatUserId && onlineUsers.has(activeChatUserId) ? 'Online' : 'Offline'}
                </p>
              </div>

              <div className="p-4 border-b border-gray-100">
                <div className="grid grid-cols-1 gap-2">
                  <button className="flex items-center justify-center space-x-2 p-3 hover:bg-gray-50 rounded-lg transition">
                    <FiSearch size={18} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Search in conversation</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">My Contacts</h4>
                  <div className="space-y-2">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                        onClick={() => {
                          const user = users.find(u => u.id === contact.id);
                          if (user) {
                            handleUserClick(user);
                            setRightSidebarOpen(false);
                          }
                        }}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold">
                            {contact.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800 text-sm">{contact.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{contact.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Overlays */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {rightSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setRightSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatLayout;

// Add this to your global CSS or use a Tailwind plugin for custom scrollbar styling
// For example, in your global CSS:
/*

*/