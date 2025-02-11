'use strict';

import tokenModel from '../models/token.model.js';

class TokenService {
    static createToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await tokenModel.create({
                user: userId,
                publicKey: publicKeyString,
                // publicKey,
                // privateKey,
            });

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            throw new Error('Error creating token');
        }
    };
}

export default TokenService;
