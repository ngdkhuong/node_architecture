'use strict';

const userModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const TokenService = require('./token.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils/index');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');

const ROLES = {
    SHOP: '001',
    WRITER: '002',
    EDITOR: '003',
    ADMIN: '004',
};

class AccessService {
    // check this token is used?
    static handleRefreshToken = async (refreshToken) => {
        // check token nay da duoc su dung chua
        const foundToken = await TokenService.findByRefreshToken(refreshToken);
        // neu co
        if (foundToken) {
            // decode xem who are you?
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log('1--', { userId, email });

            await TokenService.deleteKeyById(userId);
            throw new ForbiddenError(`Something went wrong`);
        }

        const holderToken = await TokenService.findByRefreshToken({ refreshToken });
        if (!holderToken) throw new AuthFailureError(`User not registered`);

        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
        console.log('2--', { userId, email });

        const foundUser = await findByEmail(email);
        if (!foundUser) throw new AuthFailureError('User not exists');

        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);

        await holderToken.update({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        });

        return {
            user: getInfoData({ fields: ['_id', 'name', 'email'], object: foundUser }),
            tokens,
        };
    };

    static logout = async (keyStore) => {
        return (delKey = await TokenService.removeByUserId(keyStore._id));
    };

    static login = async ({ email, password, refreshToken = null }) => {
        const userExists = await findByEmail({ email });
        if (!userExists) throw new BadRequestError('User not exists');

        const match = bcrypt.compare(password, userExists.password);

        if (!match) throw new AuthFailureError('Authentication failed');

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const { _id: userId } = userExists;

        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

        await TokenService.createToken({
            userId,
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey,
        });

        return {
            user: getInfoData({ fields: ['_id', 'name', 'email'], object: userExists }),
            tokens,
        };
    };

    static signUp = async ({ name, email, password }) => {
        const user = await userModel.findOne({ email }).lean().exec();

        if (user) {
            throw new BadRequestError('Error::User already exists');
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
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem',
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem',
            //     },
            // });
            // TODO: -- END large System

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            console.log({ privateKey, publicKey });

            const keyStore = await TokenService.createToken({
                userId: newUser._id,
                publicKey,
                // TODO: Mini System: --add private key
                privateKey,
            });

            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'Error key stored',
                };
            }

            // const publicKeyObject = crypto.createPublicKey(publicKeyString);

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
                        fields: ['_id', 'name', 'email', 'roles'],
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
    };
}

module.exports = AccessService;
