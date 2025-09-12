# Collaborative Code Editor Frontend

A modern React frontend for the real-time collaborative code editor application.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **Room Management**: Create, join, and manage coding rooms
- **Real-time Collaboration**: Live code editing with Socket.IO
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Multiple Languages**: Support for JavaScript, Python, Java, C++, HTML, CSS, JSON, and Markdown

## Tech Stack

- **React 19** - Modern React with hooks
- **React Router** - Client-side routing
- **Monaco Editor** - VS Code editor component
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

### Authentication
1. Register a new account or login with existing credentials
2. The app will automatically redirect you to the rooms list after successful authentication

### Creating Rooms
1. Click "Create New Room" button
2. Fill in the room details:
   - Room name (required)
   - Description (optional)
   - Programming language
   - Public/Private setting
3. Click "Create Room" to create and join the room

### Joining Rooms
1. Browse available rooms on the main page
2. Click "Join Room" on any room you want to enter
3. You'll be redirected to the collaborative editor

### Collaborative Editing
1. Once in a room, you can start coding immediately
2. Changes are synchronized in real-time with other users
3. Use the "Leave Room" button to return to the rooms list

## API Integration

The frontend integrates with the following backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/rooms` - Get user's rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/join` - Join a room

## Socket.IO Events

- `join-room` - Join a collaboration room
- `text-change` - Real-time text changes
- `cursor-position` - Real-time cursor tracking
- `document-load` - Load document content
- `user-joined` - User joined notification

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Editor/         # Code editor components
│   ├── Layout/         # Layout components
│   ├── Room/           # Room management components
│   └── UI/             # Reusable UI components
├── contexts/           # React contexts
├── services/           # API and Socket.IO services
└── App.jsx            # Main application component
```

## Styling

The application uses a modern design system with:
- Gradient backgrounds and buttons
- Smooth animations and transitions
- Responsive design for mobile and desktop
- Consistent color scheme and typography
- Card-based layouts with subtle shadows

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Make sure your backend server is running on `http://localhost:5000` or update the API base URL in `src/services/api.js`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of a collaborative coding platform.