'use strict';

import { findById } from '../services/apiKey.service.js';

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                code: '403',
                message: 'Forbidden',
            });
        }

        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                code: '403',
                message: 'Forbidden',
            });
        }

        req.objKey = objKey;

        return next();
    } catch (error) {}
};

export default apiKey;
