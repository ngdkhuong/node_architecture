'use strict';
import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import TokenService from './token.service.js';
import { createTokenPair } from '../auth/authUtils.js';
import { getInfoData } from '../utils/index.js';

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
                // TODO: Large System Design
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem',
                    },
                });
                // TODO: -- END large System

                // const privateKey = crypto.randomBytes(64).toString('hex');
                // const publicKey = crypto.randomBytes(64).toString('hex');

                console.log({ privateKey, publicKey });

                const publicKeyString = await TokenService.createToken({
                    userId: newUser._id,
                    publicKey,
                    // TODO: Mini System: --add private key
                    // privateKey,
                });

                if (!publicKeyString) {
                    return {
                        code: 'xxx',
                        message: 'Error creating public key',
                        status: 500,
                    };
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString);

                const tokens = await createTokenPair(
                    {
                        userId: newUser._id,
                        email,
                    },
                    publicKeyString,
                    privateKey,
                );

                console.log('Created token::', tokens);

                return {
                    code: '201',
                    metadata: {
                        user: getInfoData({
                            fields: ['id', 'name', 'email', 'roles'],
                            object: newUser,
                        }),
                        tokens,
                    },
                };
            }
            return {
                code: '200',
                metadata: null,
            };
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
