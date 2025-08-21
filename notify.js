const fs = require('fs').promises;
const path = require('path');

// Email service configuration (example with SendGrid)
// You'll need to install: npm install @sendgrid/mail
// const sgMail = require('@sendgrid/mail');

class WaitlistNotifier {
    constructor() {
        this.emailsFile = path.join(__dirname, 'waitlist_emails.json');
        this.template = this.getDefaultTemplate();
    }
    
    getDefaultTemplate() {
        return {
            subject: "🚀 khpal.ai is now live!",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>khpal.ai is Live!</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .title { font-size: 2.5rem; font-weight: 700; color: #000; margin-bottom: 10px; }
                        .subtitle { font-size: 1.2rem; color: #666; margin-bottom: 30px; }
                        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
                        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 0.9rem; }
                        .feature { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                        .feature h3 { margin: 0 0 10px 0; color: #333; }
                        .feature p { margin: 0; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 class="title">khpal.ai</h1>
                            <p class="subtitle">personal ai agents for productivity</p>
                        </div>
                        
                        <h2>🎉 we're live!</h2>
                        <p>thank you for joining our waitlist! khpal.ai is now officially live and ready to help you track your day with personalized ai agents.</p>
                        
                        <div class="feature">
                            <h3>✨ what's new</h3>
                            <p>track your daily progress, share achievements with others, and get personalized insights from your ai companion.</p>
                        </div>
                        
                        <div class="feature">
                            <h3>🚀 get started</h3>
                            <p>join thousands of users who are already improving their productivity with khpal.ai.</p>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="https://khpal.ai" class="cta-button">start your journey →</a>
                        </div>
                        
                        <p>as one of our early supporters, you'll have access to exclusive features and updates as we continue to build the future of personal productivity.</p>
                        
                        <div class="footer">
                            <p>built with ❤️ by jibran khan</p>
                            <p>if you have any questions, just reply to this email!</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
khpal.ai is now live! 🚀

thank you for joining our waitlist! khpal.ai is now officially live and ready to help you track your day with personalized ai agents.

✨ what's new:
track your daily progress, share achievements with others, and get personalized insights from your ai companion.

🚀 get started:
join thousands of users who are already improving their productivity with khpal.ai.

visit: https://khpal.ai

as one of our early supporters, you'll have access to exclusive features and updates as we continue to build the future of personal productivity.

built with ❤️ by jibran khan
            `
        };
    }
    
    async loadEmails() {
        try {
            const data = await fs.readFile(this.emailsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading emails:', error);
            return [];
        }
    }
    
    async sendNotifications(emails, customTemplate = null) {
        const template = customTemplate || this.template;
        const emailList = Array.isArray(emails) ? emails : await this.loadEmails();
        
        console.log(`📧 preparing to send notifications to ${emailList.length} subscribers...`);
        
        // Example with SendGrid (uncomment and configure)
        /*
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const promises = emailList.map(email => {
            const msg = {
                to: email,
                from: 'jibran@khpal.ai', // verified sender
                subject: template.subject,
                text: template.text,
                html: template.html,
            };
            
            return sgMail.send(msg);
        });
        
        try {
            await Promise.all(promises);
            console.log('✅ all notifications sent successfully!');
        } catch (error) {
            console.error('❌ error sending notifications:', error);
        }
        */
        
        // For now, just log the emails (replace with actual email service)
        console.log('\n📋 email list for manual sending:');
        emailList.forEach((email, index) => {
            console.log(`${index + 1}. ${email}`);
        });
        
        console.log(`\n📊 total subscribers: ${emailList.length}`);
        console.log('\n💡 to send actual emails, configure an email service like:');
        console.log('   - SendGrid (recommended)');
        console.log('   - Mailgun');
        console.log('   - AWS SES');
        console.log('   - Resend');
    }
    
    async exportEmails(format = 'json') {
        const emails = await this.loadEmails();
        
        switch (format.toLowerCase()) {
            case 'csv':
                const csvContent = 'email\n' + emails.map(email => `"${email}"`).join('\n');
                await fs.writeFile('waitlist_export.csv', csvContent);
                console.log('📄 emails exported to waitlist_export.csv');
                break;
                
            case 'txt':
                const txtContent = emails.join('\n');
                await fs.writeFile('waitlist_export.txt', txtContent);
                console.log('📄 emails exported to waitlist_export.txt');
                break;
                
            default:
                await fs.writeFile('waitlist_export.json', JSON.stringify(emails, null, 2));
                console.log('📄 emails exported to waitlist_export.json');
        }
    }
    
    async getStats() {
        const emails = await this.loadEmails();
        
        console.log('\n📊 waitlist statistics:');
        console.log(`total subscribers: ${emails.length}`);
        
        // Domain analysis
        const domains = {};
        emails.forEach(email => {
            const domain = email.split('@')[1];
            domains[domain] = (domains[domain] || 0) + 1;
        });
        
        console.log('\n🏢 top domains:');
        Object.entries(domains)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .forEach(([domain, count]) => {
                console.log(`  ${domain}: ${count}`);
            });
    }
}

// CLI interface
async function main() {
    const notifier = new WaitlistNotifier();
    const command = process.argv[2];
    
    switch (command) {
        case 'notify':
            await notifier.sendNotifications();
            break;
            
        case 'export':
            const format = process.argv[3] || 'json';
            await notifier.exportEmails(format);
            break;
            
        case 'stats':
            await notifier.getStats();
            break;
            
        default:
            console.log(`
🚀 khpal.ai waitlist notifier

usage:
  node notify.js notify     - send launch notifications
  node notify.js export     - export emails to json
  node notify.js export csv - export emails to csv
  node notify.js export txt - export emails to txt
  node notify.js stats      - show waitlist statistics

examples:
  node notify.js notify
  node notify.js export csv
  node notify.js stats
            `);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = WaitlistNotifier;
