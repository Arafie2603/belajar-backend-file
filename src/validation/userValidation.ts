import { z, ZodType } from 'zod';

export class userValidation {
    static readonly REGISTER : ZodType = z.object({
        id_user: z.string().min(3).max(100),
        password: z.string().min(1).max(100),
    });
    static readonly LOGIN : ZodType = z.object({
        id_user: z.string().min(3).max(100),
        password: z.string().min(1).max(100),
    });
}