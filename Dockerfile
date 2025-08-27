# Node.js बेस इमेज का उपयोग करें
FROM node:18-alpine

# वर्किंग डायरेक्टरी सेट करें
WORKDIR /app

# पैकेज.जेसन और पैकेज-लॉक.जेसन कॉपी करें
COPY package*.json ./

# डिपेंडेंसीज इंस्टॉल करें
RUN npm install --production

# सोर्स कोड कॉपी करें
COPY . .

# प्रोडक्शन एनवायरनमेंट वेरिएबल्स सेट करें
ENV NODE_ENV=production

# हेल्थ चेक के लिए एक्सपोज़ पोर्ट
EXPOSE 5000

# ऐप स्टार्ट करें
CMD ["node", "server.js"]