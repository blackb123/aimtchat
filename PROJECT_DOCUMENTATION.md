# NEANCHAT - Real-time Chat Application

## Project Overview

NEANCHAT is a modern, real-time chat application built with a React frontend and FastAPI backend. It enables users to create accounts, authenticate, and engage in private conversations with real-time messaging capabilities.

## Technology Stack

### Frontend
- **React 19.2.0** - Modern React with latest features
- **TypeScript** - Type-safe JavaScript development
- **Vite 7.2.4** - Fast build tool and development server
- **React Router DOM 7.9.6** - Client-side routing
- **Socket.IO Client 4.8.1** - Real-time WebSocket communication
- **React Icons 5.5.0** - Icon library (Feather Icons)
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - CSS vendor prefixing

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Python** - Programming language
- **SQLAlchemy** - SQL toolkit and ORM
- **Socket.IO** - Real-time bidirectional communication
- **CORS Middleware** - Cross-origin resource sharing
- **Pydantic** - Data validation and settings management

### Development Tools
- **ESLint** - JavaScript/TypeScript linting
- **TypeScript Compiler** - Type checking and compilation
- **Vite Plugin React** - React support for Vite

## Architecture

### Frontend Architecture

The frontend follows a component-based architecture with clear separation of concerns:

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (ChatLayout)
│   └── ui/            # General UI components
├── pages/              # Page-level components
│   ├── auth/          # Authentication pages
│   └── chat/          # Chat interface pages
├── hooks/              # Custom React hooks
│   ├── useAuth.ts     # Authentication state management
│   └── useSocket.ts   # Socket.IO integration
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
└── assets/             # Static assets
```

### Backend Architecture

The backend follows a layered architecture pattern:

```
backend/app/
├── core/               # Core functionality
│   ├── database.py    # Database configuration
│   └── socket.py      # Socket.IO setup
├── model.py           # Database models
├── routes/            # API route handlers
│   ├── auth.py        # Authentication endpoints
│   ├── message.py     # Message endpoints
│   └── conversation.py # Conversation endpoints
├── schemas/           # Pydantic schemas
└── main.py           # Application entry point
```

## Core Features

### 1. Authentication System
- **User Registration**: Create new user accounts with username and email
- **User Login**: Authenticate users with JWT tokens
- **Session Management**: Persistent login state using localStorage
- **Protected Routes**: Route guards for authenticated users only

### 2. Real-time Messaging
- **WebSocket Communication**: Real-time bidirectional messaging using Socket.IO
- **Message Delivery**: Instant message delivery to online users
- **Message History**: Persistent message storage in database
- **Read Receipts**: Track message read status
- **Online Status**: Real-time user presence indicators

### 3. Chat Interface
- **Modern UI**: Clean, responsive chat interface using Tailwind CSS
- **User List**: View all users and their online status
- **Conversation Management**: Switch between different conversations
- **Message Input**: Rich text input with emoji and file attachment support
- **Mobile Responsive**: Fully responsive design for mobile devices

### 4. User Management
- **Profile Management**: User profiles with avatars
- **Online/Offline Status**: Real-time presence tracking
- **Contact List**: Manage and view user contacts
- **Search Functionality**: Search users and conversations

## Data Models

### User Model
```typescript
interface User {
  id: number;
  username: string;
  email?: string;
  token?: string;
  status?: 'online' | 'away' | 'offline';
}
```

### Message Model
```typescript
interface Message {
  id?: string;
  chat_id?: number;
  text: string;
  sender: string;
  sender_id: number;
  sent_at?: string;
  tempId?: string;
  is_read?: boolean;
}
```

### Conversation Model
```typescript
interface Conversation {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string;
  chat_id: number;
}
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Messages
- `GET /messages/{chat_id}` - Get messages for a conversation
- `POST /messages` - Send a new message

### Conversations
- `GET /conversations` - Get user conversations
- `POST /conversations` - Create new conversation
- `GET /conversations/{id}/messages` - Get conversation messages

## Socket.IO Events

### Client to Server
- `connect` - Establish connection with authentication
- `send_message` - Send a new message
- `mark_messages_read` - Mark messages as read
- `disconnect` - Close connection

### Server to Client
- `receive_message` - Receive a new message
- `message_sent_confirm` - Confirmation of sent message
- `user_status` - User online/offline status updates
- `messages_read` - Notification that messages were read

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn
- PostgreSQL or SQLite (for database)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

### Backend Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload
```

## Key Implementation Details

### Authentication Flow
1. User enters credentials in login form
2. Frontend sends request to `/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token in localStorage
5. Token used for subsequent API requests
6. Socket.IO connection established with token authentication

### Real-time Messaging Flow
1. User sends message through chat interface
2. Frontend emits `send_message` event to server
3. Server validates and saves message to database
4. Server emits `receive_message` to recipient
5. Server emits `message_sent_confirm` to sender
6. Both clients update UI in real-time

### State Management
- **Authentication**: Managed through `useAuth` custom hook
- **Socket Connection**: Managed through `useSocket` custom hook
- **Chat State**: Local component state with real-time updates
- **Message History**: Fetched from API and cached locally

## Security Features
- JWT token-based authentication
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Secure Socket.IO connections with authentication
- SQL injection prevention through SQLAlchemy ORM

## Performance Optimizations
- Lazy loading of components
- Efficient Socket.IO event handling
- Optimized database queries
- Component memoization where appropriate
- Efficient re-rendering with React hooks

## Future Enhancements
- File sharing capabilities
- Voice/video calling
- Group chats
- Message encryption
- Push notifications
- Message reactions
- Typing indicators
- Message search
- User blocking/muting

## Conclusion

NEANCHAT demonstrates a modern full-stack chat application with real-time capabilities, clean architecture, and a responsive user interface. The project showcases best practices in React development, FastAPI backend design, and real-time WebSocket communication.
