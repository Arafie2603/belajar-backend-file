import { ZodType, ZodError } from 'zod';
import Decimal from 'decimal.js';

export class Validation {
    static validate<T>(schema: ZodType<T>, data: any): T {
        try {
            // Convert price to Decimal if necessary
            if (typeof data.price === 'number') {
                data.price = new Decimal(data.price);
            }
            return schema.parse(data);
        } catch (error) {
            if (error instanceof ZodError) {
                throw new Error(`Validation Error: ${error.message}`);
            }
            throw error;
        }
    }
}