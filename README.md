# Custom Link Shortener 

A simple and efficient tool for shortening URLs, making them easier to share and track.

https://tldr-link.onrender.com

<img src="https://github.com/Marti-code/TLDR-link/blob/master/public/tldr-desktop.jpg"/>


## Description

The Custom Link Shortener is designed to help users quickly shorten long URLs into manageable links and QR codes. This tool is perfect for social media, marketing campaigns, and any scenario where space and ease of use are important. It also offers tracking features to monitor the performance of your links.

## Features

- Create personalized short URLs.
- Track clicks and performance of your short links.
- Share QR codes for even easier access.

## Setup

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/TLDR-link.git
2. Install the required packages:
   ```bash
   npm install
3. Create a .env file in the project root directory and add your MongoDB connection and secret key (which is just a random string of characters):
   ```bash
   MONGODB_CONNECT=DB_CONNECTION
   SECRET_KEY=YOUR_KEY
4. Run the application:
   ```bash
   npm run dev
5. Open web browser:
   http://127.0.0.1:5000


