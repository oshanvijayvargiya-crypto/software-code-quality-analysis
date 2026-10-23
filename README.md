# CodeInsight

CodeInsight is a full-stack web application designed for comprehensive software code analysis, providing deep insights into code quality, complexity, and security issues.

## Tech Stack
*   **Frontend:** React (Vite), Tailwind CSS
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB
*   **Code Analysis:** eslint, escomplex, pylint, radon, checkstyle

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (running locally or MongoDB Atlas)
*   Python (for Python analysis)
*   Java (for Java analysis)

### Installation & Running Locally

1.  **Clone the repository and install dependencies:**
    ```bash
    # Install backend dependencies
    cd backend
    npm install
    
    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

2.  **Environment Variables:**
    *   Navigate to the `backend/` directory.
    *   Copy `.env.example` to `.env`.
    *   Update the variables as needed (especially `MONGO_URI` and `JWT_SECRET`).

3.  **Run the application:**
    ```bash
    # In the backend directory
    npm run dev

    # In a new terminal, in the frontend directory
    npm run dev
    ```

## Screenshots
*(Add screenshots here after development is complete)*
