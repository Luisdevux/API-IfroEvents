// src/utils/AuthHelper.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AuthHelper {
    
    static decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            return null;
        }
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    }
}

export default AuthHelper;