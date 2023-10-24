
const crypto = require('crypto');

// Generate secret keys
const JWT_SECRET = crypto.randomBytes(32).toString('hex');
const SESSION_SECRET = crypto.randomBytes(32).toString('hex');

console.table({JWT_SECRET,JWT_VERIFICATION_SECRET})