# khpal.ai - Personal AI Agents Waitlist

A professional waitlist system for khpal.ai, featuring email collection, duplicate prevention, and a modern, responsive design.

## Features

- ✅ **Professional Design**: Clean, modern UI with smooth animations
- ✅ **Email Validation**: Real-time email format validation
- ✅ **Duplicate Prevention**: Prevents multiple submissions from the same email
- ✅ **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ✅ **Backend Storage**: Emails stored securely in JSON file
- ✅ **Analytics Ready**: Built-in analytics tracking hooks
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **Loading States**: Professional loading animations
- ✅ **Session Management**: Remembers user submissions across sessions

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Visit the application:**
   Open your browser and go to `http://localhost:3001`

### Production Deployment

1. **Install dependencies:**
   ```bash
   npm install --production
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

3. **Visit the application:**
   Open your browser and go to `http://localhost:3001`

## File Structure

```
khpal.ai_offical/
├── src/                # Professional source code
│   ├── index.html      # Main landing page
│   ├── css/
│   │   └── styles.css  # All styling and animations
│   ├── js/
│   │   └── main.js     # Interactive functionality
│   ├── assets/         # Images and other assets
│   └── README.md       # Source documentation
├── src-server.js       # Backend Express server
├── notify.js           # Email notification system
├── package.json        # Dependencies and scripts
├── waitlist_emails.json # Email storage (created automatically)
├── DEPLOYMENT.md       # Deployment guide
└── README.md           # This file
```

## API Endpoints

### POST `/api/waitlist`
Submit an email to the waitlist.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email added to waitlist successfully",
  "totalSubscribers": 42
}
```

### GET `/api/waitlist/stats`
Get waitlist statistics (for admin use).

**Response:**
```json
{
  "success": true,
  "totalSubscribers": 42,
  "emails": ["user1@example.com", "user2@example.com"]
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

## Email Storage

Emails are stored in `waitlist_emails.json` in the following format:

```json
[
  "user1@example.com",
  "user2@example.com",
  "user3@example.com"
]
```

## Customization

### Styling
- Modify `style.css` to change colors, fonts, and layout
- The design uses CSS custom properties for easy theming
- All animations and transitions are customizable

### Backend Integration
- Replace the file-based storage with a database (MongoDB, PostgreSQL, etc.)
- Add email service integration (SendGrid, Mailgun, etc.) for notifications
- Implement rate limiting and additional security measures

### Analytics
The system includes hooks for popular analytics services:

```javascript
// Google Analytics
gtag('event', 'waitlist_signup', {
    'event_category': 'waitlist',
    'event_label': email
});

// Mixpanel
mixpanel.track('waitlist_signup', {
    email: email,
    timestamp: new Date().toISOString()
});
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## Security Considerations

- Emails are validated on both client and server side
- CORS is enabled for cross-origin requests
- Input sanitization prevents injection attacks
- Rate limiting can be added for production use

## Deployment Options

### Vercel
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set output directory: `.`
4. Deploy

### Netlify
1. Connect your repository
2. Set build command: `npm install`
3. Set publish directory: `.`
4. Deploy

### Heroku
1. Create a new Heroku app
2. Connect your repository
3. Set environment variables
4. Deploy

### DigitalOcean App Platform
1. Create a new app
2. Connect your repository
3. Set environment variables
4. Deploy

## Monitoring and Maintenance

### Logs
The server logs all waitlist submissions:
```
New waitlist signup: user@example.com
```

### Health Checks
Monitor the `/api/health` endpoint for uptime monitoring.

### Email Export
Use the `/api/waitlist/stats` endpoint to export emails for marketing campaigns.

## Support

For questions or issues, please contact the development team.

---

**Built with ❤️ for khpal.ai**
