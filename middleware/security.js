/**
 * सिक्योरिटी मिडलवेयर
 * 
 * यह फाइल एक्सप्रेस ऐप के लिए विभिन्न सिक्योरिटी मिडलवेयर सेटअप करती है
 */

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

/**
 * सिक्योरिटी मिडलवेयर कॉन्फिगर करें
 * @param {Express} app - एक्सप्रेस ऐप इंस्टेंस
 */
const configureSecurityMiddleware = (app) => {
  // CORS सेटअप
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

  app.use(
    cors({
      origin: (origin, callback) => {
        // origin नहीं होने पर (जैसे पोस्टमैन से API कॉल)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
    })
  );

  // सिक्योरिटी हेडर्स सेट करें
  app.use(helmet());

  // रेट लिमिटिंग - बहुत अधिक रिक्वेस्ट्स को रोकें
  const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 मिनट डिफॉल्ट
    max: process.env.RATE_LIMIT_MAX || 100, // 15 मिनट में अधिकतम 100 रिक्वेस्ट्स
    message: {
      status: 'error',
      message: 'Too many requests from this IP, please try again later.'
    }
  });
  
  // सभी API रूट्स पर रेट लिमिटिंग लागू करें
  app.use('/api', limiter);

  // XSS अटैक्स से बचाव
  app.use(xss());

  // HTTP पैरामीटर पॉल्यूशन से बचाव
  app.use(hpp());

  // JSON बॉडी साइज लिमिट
  app.use(express.json({ limit: '10kb' }));

  // सिक्योरिटी हेडर्स सेट करें
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  console.log('Security middleware configured');
};

module.exports = configureSecurityMiddleware;