  

# IAM task

  

This project contains two separate applications:

1.  **Express App** (Backend)

2.  **Vue App** (Frontend)

  

The Express app handles the backend server functionality, while the Vue app serves as the frontend interface.

  

---

  

## Table of Contents


- [Getting Started](#getting-started)

- [Prerequisites](#prerequisites)

- [Setup](#setup)

- [Backend (Express App)](#backend-express-app)

- [Frontend (Vue App)](#frontend-vue-app)

  

---

## Getting Started

  

### Prerequisites

  

Ensure you have the following installed on your machine:

  

-  **Node.js** (>= 22.x)

-  **npm** (comes with Node.js)

-  **Vue CLI** (optional, for additional Vue development commands)

  

### Setup

  

#### Backend (Express App)

  

1.  **Navigate to the backend folder:**

  

```bash

cd IAM-user-api

```

  

2.  **Install dependencies:**

  

```bash

npm install

```

4.  **Run the server:**

```bash

npm start

```

  

This will start the Express server, typically on `http://localhost:3000` (unless configured otherwise).

  

#### Frontend (Vue App)

  

1.  **Navigate to the frontend folder:**

  

```bash

cd iam-data-frontend

```

  

2.  **Install dependencies:**

  

```bash

npm install

```

  

3.  **Add a `.env` file:**

Create a `.env` file in the `iam-data-frontend` folder. This file should contain the API endpoint for connecting to the backend. Add the following line to the `.env` file:

  

```bash

VUE_APP_API_ENDPOINT=http://localhost:3000  # or your desired backend URL

```

  

4.  **Run the Vue app:**

  

```bash

npm run serve

```

  

This will start the Vue development server, typically on `http://localhost:8080` (unless configured otherwise).

  

---

## Additional Notes

  

- If you need to change the default ports, update the `.env` files and any client code accordingly.

- For production, you may build the Vue app (`npm run build`) and serve the static files from the Express backend.