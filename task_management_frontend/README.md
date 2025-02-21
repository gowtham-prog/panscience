# Task Management App (React + Vite)

This is a Task Management web application built using React and Vite. Follow the instructions below to set up the project.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. **Install dependencies:**
   ```sh
   npm install  # or yarn install
   ```

## Setting Up Environment Variables

1. Create a `.env` file in the root of the project and add the following content:
   ```sh
   VITE_SERVER_URL=server_url
   ```

## Running the Project

### Development Mode

Start the development server with:
   ```sh
   npm run dev  # or yarn dev
   ```

This will start Vite and serve the project at `http://localhost:5173` (by default).

### Production Build

To create a production build, run:
   ```sh
   npm run build  # or yarn build
   ```

This will generate an optimized build in the `dist/` folder.

## Running in Preview Mode

To preview the production build, use:
   ```sh
   npm run preview  # or yarn preview
   ```

## Project Structure

```
/task-management-app
│── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page components
│   ├── hooks/       # Custom hooks
│   ├── context/     # Global state management
│   ├── utils/       # Utility functions
│   ├── App.jsx      # Root component
│   ├── main.jsx     # Entry point
│── public/          # Static assets
│── .env             # Environment variables
│── vite.config.js   # Vite configuration
│── package.json     # Project metadata and scripts
│── README.md        # Project documentation
```

## Additional Notes

- This project uses Vite for fast development and optimized builds.
- Ensure that the backend is running at the URL specified in `.env`.
- Modify the `.env` file as needed for different environments.




