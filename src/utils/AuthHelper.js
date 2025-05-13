// src/utils/AuthHelper.js

import bcrypt from 'bcrypt';

class AuthHelper {
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }
}

export default AuthHelper;