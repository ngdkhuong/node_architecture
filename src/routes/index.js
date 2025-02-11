'use strict';

import express from 'express';
import access from './access/index.js';
const router = express.Router();

router.use('/v1/api', access);

// router.get('', (req, res) => {
//     const testMemories = 'Hello World';

//     return res.status(200).json({
//         message: 'Welcome to the API server',
//         // metadata: testMemories.repeat(10000),
//     });
// });

export default router;
