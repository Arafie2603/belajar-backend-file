import { parseISO, isValid, formatISO, parse } from "date-fns";

export const normalizeDate = (dateInput: any): string => {
    // Debug logging
    console.log("normalizeDate received:", dateInput, "type:", typeof dateInput);
    
    // If input is null or undefined, return current date
    if (dateInput === null || dateInput === undefined) {
        console.log("Null or undefined input, returning current date");
        return formatISO(new Date());
    }
    
    // If input is empty string, return current date
    if (dateInput === "") {
        console.log("Empty string input, returning current date");
        return formatISO(new Date());
    }

    let parsedDate: Date | null = null;

    if (typeof dateInput === "string") {
        // Try parsing as ISO format first
        try {
            parsedDate = parseISO(dateInput);
            console.log("After parseISO:", parsedDate, "isValid:", isValid(parsedDate));
            
            // If not valid, try other formats
            if (!isValid(parsedDate)) {
                // Try yyyy-MM-dd format (without time)
                try {
                    parsedDate = parse(dateInput, 'yyyy-MM-dd', new Date());
                    console.log("After parse with yyyy-MM-dd:", parsedDate, "isValid:", isValid(parsedDate));
                } catch (e) {
                    console.log("Error parsing with yyyy-MM-dd format");
                }
                
                // If still not valid, try Date constructor
                if (!isValid(parsedDate)) {
                    parsedDate = new Date(dateInput);
                    console.log("After new Date():", parsedDate, "isValid:", isValid(parsedDate));
                }
            }
        } catch (error) {
            console.log("Error in date parsing:", error);
            parsedDate = new Date(dateInput);
        }
    } else if (dateInput instanceof Date) {
        parsedDate = dateInput;
        console.log("Input is Date instance");
    } else if (typeof dateInput === "number") {
        parsedDate = new Date(dateInput);
        console.log("Input is number");
    } else {
        console.log("Unsupported input type, using current date");
        parsedDate = new Date();
    }

    // Always return a valid date, default to current date if invalid
    if (!parsedDate || !isValid(parsedDate)) {
        console.log("Final parsed date is invalid, using current date");
        parsedDate = new Date();
    }

    const result = formatISO(parsedDate);
    console.log("normalizeDate returning:", result);
    return result;
};