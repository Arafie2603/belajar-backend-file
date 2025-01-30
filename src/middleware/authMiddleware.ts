import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
        { expiresIn: '24h' }
    );
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
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
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        res.status(401).json({
            status: 401,
            message: 'Invalid token'
        });
    }
};
