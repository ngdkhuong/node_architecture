'use strict';
import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const ROLES = {
    SHOP: '001',
    WRITER: '002',
    EDITOR: '003',
    ADMIN: '004',
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            const user = await userModel.findOne({ email }).lean();

            if (user) {
                return {
                    code: '409',
                    message: 'Email already in use',
                    status: 409,
                };
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await userModel.create({
                name,
                email,
                password: hashPassword,
                roles: [ROLES.SHOP],
            });

            if (newUser) {
                const { privateKey, publishKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 2048,
                });

                console.log({ privateKey, publishKey });
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: error.status,
            };
        }
    };
}

export default AccessService;
