# Google Keep Clone Frontend

A React-based frontend for the Google Keep Clone API. This application allows users to create, read, update, and delete notes with tags and reminders.
This frontend is designed to work with the [Google Keep Clone API backend] (https://github.com/metsarnele/google-keep-clone-api). Make sure to have the backend running before using this frontend.

## Features

- User authentication (register, login, profile management)
- Create, edit, and delete notes
- Organize notes with tags
- Set reminders for notes
- Responsive design

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Google Keep Clone API backend running on http://localhost:3000

## Installation

1. Clone this repository
```bash
git clone https://github.com/your-username/google-keep-frontend.git
cd google-keep-frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
REACT_APP_API_URL=http://localhost:3000
```

4. Start the development server
```bash
npm start
```

5. Open your browser and navigate to http://localhost:3000

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `build` directory with optimized production files that can be deployed to any static hosting service.
