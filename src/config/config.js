//src/config/config.js

import dotenv from 'dotenv';
dotenv.config();

const config = {
    secretKey: process.env.JWT_SECRET || 'default_secret', 
    tokenExpiresIn: process.env.TOKEN_EXPIRES_IN || '1h'
};
//1h, 2h,30m,etc.

export default config;