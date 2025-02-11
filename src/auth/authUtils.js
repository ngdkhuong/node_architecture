'use strict';

import JWT from 'jsonwebtoken';

export const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '2d' });

        const refreshToken = await JWT.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '7d' });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('Error signing::', err);
            } else {
                console.log('decode verified::', decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {}
};
