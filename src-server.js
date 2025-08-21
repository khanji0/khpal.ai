const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('src')); // Serve static files from src directory

// Data file path
const EMAILS_FILE = path.join(__dirname, 'waitlist_emails.json');

// Initialize emails file if it doesn't exist
async function initializeEmailsFile() {
    try {
        await fs.access(EMAILS_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(EMAILS_FILE, JSON.stringify([], null, 2));
        console.log('Created waitlist_emails.json file');
    }
}

// Read emails from file
async function readEmails() {
    try {
        const data = await fs.readFile(EMAILS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading emails file:', error);
        return [];
    }
}

// Write emails to file
async function writeEmails(emails) {
    try {
        await fs.writeFile(EMAILS_FILE, JSON.stringify(emails, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing emails file:', error);
        return false;
    }
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// API endpoint to submit email
app.post('/api/waitlist', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validate email
        if (!email || !validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address'
            });
        }
        
        const normalizedEmail = email.toLowerCase().trim();
        
        // Read existing emails
        const emails = await readEmails();
        
        // Check for duplicates
        if (emails.includes(normalizedEmail)) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered',
                duplicate: true
            });
        }
        
        // Add new email
        emails.push(normalizedEmail);
        
        // Write back to file
        const writeSuccess = await writeEmails(emails);
        
        if (!writeSuccess) {
            return res.status(500).json({
                success: false,
                message: 'Failed to save email'
            });
        }
        
        console.log(`New waitlist signup: ${normalizedEmail}`);
        
        res.json({
            success: true,
            message: 'Email added to waitlist successfully',
            totalSubscribers: emails.length
        });
        
    } catch (error) {
        console.error('Error processing waitlist submission:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// API endpoint to get waitlist stats (optional, for admin use)
app.get('/api/waitlist/stats', async (req, res) => {
    try {
        const emails = await readEmails();
        res.json({
            success: true,
            totalSubscribers: emails.length,
            emails: emails
        });
    } catch (error) {
        console.error('Error getting waitlist stats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start server
async function startServer() {
    await initializeEmailsFile();
    
    app.listen(PORT, () => {
        console.log(`🚀 khpal.ai professional landing server running on port ${PORT}`);
        console.log(`📧 Emails will be stored in: ${EMAILS_FILE}`);
        console.log(`🌐 Visit: http://localhost:${PORT}`);
        console.log(`📁 Serving from: src/ directory`);
    });
}

startServer().catch(console.error);
