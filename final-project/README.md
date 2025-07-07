# News Aggregator CLI

A command-line News Aggregator that fetches, filters, saves, and notifies users about the latest headlines across multiple categories. Built with TypeScript, Express.js, and MySQL.

---

## Features

- View today's headlines
- View headlines by custom date range
- Filter news by categories (Business, Entertainment, Sports, Technology)
- Save articles for later reading
- Report inappropriate news
- Notification system
  - Receive in-app and email notifications
  - Configure notifications based on selected categories or custom keywords
- High test coverage using Jest

---

## Tech Stack

- **Client**: Node.js CLI (TypeScript)
- **Server**: Express.js (TypeScript)
- **Database**: MySQL
- **Notification**: Email via Brevo
- **Testing**: Jest

---

## Getting Started

### 1. Set Up MySQL Database

Ensure your MySQL server is up and running. Create a database and configure your credentials in a `.env` file inside the `server` directory.

Example `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=news_db
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_SERVICE=brevo
```

### 2. Starting the Server

 - You MySQL Database should be Up and running.

 ```bash
    cd final-project/server
    npm run install
    npm run dev
 ```

### 3. Starting the Client

```bash
    cd final-project/client
    npm install
    npm run start
```


### 4. Running Test Cases

```bash
    cd final-project/server
    npm run test
    npm run coverage
```

### 5. To format the code

```bash
    npm run format 
```

---

## Folder Structure

```bash

    final-project/
    ├── client/               # CLI interface
    │   └── ...
    ├── server/               # Express.js API
    │   └── ...
    ├── __tests__/            # Jest tests
    ├── .env                  # Environment config
    └── README.md
```

---

## Author

**Krishanu Mishra**

---

**Note**

 - To run the project you would first need to setup the database and connect to it using by creating an .env file in the server side.
