# News Aggregator CLI

A Command-Line News Aggregator that fetches, filters, saves, and notifies users about the latest headlines from multiple categories. Built with TypeScript, Express, and MySQL.

---

## Features

- View Today’s Headlines
- View Headlines by Date Range
- Filter News by Categories (Business, Entertainment, Sports, Technology)
- Save Articles for Later
- Report Inappropriate News
- Notification System
  - Receive in-app and email notifications
  - Configure by news categories or custom keywords
- Thoroughly tested with Jest

---

## Tech Stack

- **Client**: Node.js CLI (TypeScript)
- **Server**: Express.js (TypeScript)
- **Database**: MySQL
- **Notification**: Email + Brevo
- **Testing**: Jest

---

## Getting Started

### 1. Starting the Server

 - You MySQL Database should be Up and running.

 ```bash
    cd final-project/server
    npm run install
    npm run dev
 ```

### 2. Starting the Client

```bash
    cd final-project/client
    npm install
    npm run start
```


### 3. Running Test Cases

```bash
    cd final-project/server
    npm run test
    npm run coverage
```

### 4. To format the code

```bash
    npm run format 
```