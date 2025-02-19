import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from '../services/userService';

// Extend Request type to include user information
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: {
                    role_id: string;
                    nama: string;
                }
            }
        }
    }
}

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: {
            role_id: string;
            nama: string;
        }
    };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

export const createToken = (user: any) => {
    return jwt.sign(
        { 
            id: user.id,
            role: {
                role_id: user.role.role_id,
                nama: user.role.nama
            }
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    );
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                status: 401,
                message: 'No token provided'
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Periksa apakah token telah di-blacklist
        userService.isTokenBlacklisted(token).then((isBlacklisted) => {
            if (isBlacklisted) {
                res.status(401).json({
                    status: 401,
                    message: 'Invalid token'
                });
                return;
            }

            const decoded = jwt.verify(token, JWT_SECRET) as any;
            
            req.user = {
                id: decoded.id,
                role: decoded.role
            };
            
            next();
        }).catch((error) => {
            res.status(500).json({
                status: 500,
                message: 'Internal server error'
            });
        });
    } catch (error) {
        res.status(401).json({
            status: 401,
            message: 'Invalid token'
        });
    }
};

export const refreshJWT = (req: AuthenticatedRequest, res: Response) => {
    const authHeader = req.header('Authorization');
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const newToken = jwt.sign({ user }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
            res.json({ token: newToken });
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
