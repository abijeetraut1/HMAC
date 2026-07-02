import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import cors from "cors";
import crypto from 'crypto';

const algorithm = 'aes-256-gcm'; // Using AES-GCM for authenticated encryption

const key = "abcdefghijklmnopqrstuvwzyz123412"; // 32 bytes key for AES-256

const app = express();
app.use(cors());

function encryptMiddleware(req: Request, res: Response, next: NextFunction) {
    const original = res.json;
    const iv = crypto.randomBytes(12); // 12-byte IV, correct for GCM

    res.json = (body: any) => {
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encryptedData = cipher.update(JSON.stringify(body), 'utf8', 'base64');
        encryptedData += cipher.final('base64');

        const tag = cipher.getAuthTag().toString('base64');

        const encryptedBody = {
            data: encryptedData,
            iv: iv.toString("base64"),
            tag: tag,
        };

        original.call(res, encryptedBody);
    };

    next();
}

app.use(encryptMiddleware);

app.get('/', (req, res) => {
    res.json({
        hello: Array.from({ length: 1000 }, (_, i) => ({
            id: i + 1,
            name: `Item ${i + 1}`,
            value: `Temporary value ${i + 1}`,
            active: i % 2 === 1,
        })),
    });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('running on 3000');
});