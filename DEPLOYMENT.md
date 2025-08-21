# Deployment Guide - khpal.ai Waitlist

This guide will help you deploy your professional waitlist system to production.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Free)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Set project name: `khpal-ai-waitlist`
   - Deploy to production

### Option 2: Netlify (Free)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy
   ```

3. **Configure:**
   - Build command: `npm install`
   - Publish directory: `.`
   - Deploy to production

### Option 3: Railway (Free Tier)

1. **Connect GitHub repository**
2. **Set environment variables:**
   - `PORT`: 3000
   - `NODE_ENV`: production
3. **Deploy automatically**

## 🔧 Production Setup

### 1. Environment Variables

Create a `.env` file for production:

```env
NODE_ENV=production
PORT=3000
# Add your email service API keys here
SENDGRID_API_KEY=your_sendgrid_key
```

### 2. Email Service Setup

#### SendGrid (Recommended)

1. **Sign up at [SendGrid](https://sendgrid.com)**
2. **Get API key from dashboard**
3. **Verify your sender domain**
4. **Install SendGrid package:**
   ```bash
   npm install @sendgrid/mail
   ```
5. **Update `notify.js`:**
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   ```

#### Alternative Email Services

- **Mailgun**: `npm install mailgun.js`
- **AWS SES**: `npm install @aws-sdk/client-ses`
- **Resend**: `npm install resend`

### 3. Database Setup (Optional)

For production, consider replacing file storage with a database:

#### MongoDB Atlas (Free Tier)

1. **Create MongoDB Atlas account**
2. **Create cluster**
3. **Get connection string**
4. **Install MongoDB driver:**
   ```bash
   npm install mongodb
   ```

#### PostgreSQL (Railway/Heroku)

1. **Create PostgreSQL database**
2. **Install PostgreSQL driver:**
   ```bash
   npm install pg
   ```

## 📊 Analytics Setup

### Google Analytics 4

Add to `index.html` before `</head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Mixpanel

Add to `index.html` before `</head>`:

```html
<!-- Mixpanel -->
<script type="text/javascript">
(function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0));for(var c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
mixpanel.init("YOUR_MIXPANEL_TOKEN");
</script>
```

## 🔒 Security Considerations

### 1. Rate Limiting

Add rate limiting to prevent spam:

```bash
npm install express-rate-limit
```

Add to `server.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/waitlist', limiter);
```

### 2. CORS Configuration

Update CORS settings for production:

```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

### 3. Input Validation

Add additional validation:

```javascript
const validator = require('validator');

// In your email validation
if (!validator.isEmail(email)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid email format'
  });
}
```

## 📈 Monitoring

### 1. Health Checks

Monitor your `/api/health` endpoint:

- **Uptime Robot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring
- **StatusCake**: Comprehensive monitoring

### 2. Logs

Set up logging:

```bash
npm install winston
```

Add to `server.js`:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## 🚀 Launch Checklist

### Before Launch

- [ ] Deploy to production
- [ ] Test email collection
- [ ] Set up analytics
- [ ] Configure email service
- [ ] Test notification system
- [ ] Set up monitoring
- [ ] Backup email data

### Launch Day

- [ ] Send launch notifications
- [ ] Monitor signups
- [ ] Check server performance
- [ ] Respond to any issues

### Post-Launch

- [ ] Export email list
- [ ] Analyze signup patterns
- [ ] Plan next steps
- [ ] Consider database migration

## 📞 Support

If you need help with deployment:

1. **Check the logs** for error messages
2. **Test locally** with `npm run dev`
3. **Verify environment variables**
4. **Check email service configuration**

## 🎯 Next Steps

After successful deployment:

1. **Marketing**: Share your waitlist page
2. **Analytics**: Monitor signup patterns
3. **Feedback**: Collect user feedback
4. **Development**: Continue building your product
5. **Launch**: Use the notification system when ready

---

**Good luck with your launch! 🚀**
