import { z } from "zod";
export const RegisterUserValidation = z.object({
    email: z.string().email({ message: "Invalid Email Address" }),
    password: z.string().min(6, { message: "Password is Too Short Minimum Length is 6 characters" })
        .max(18, { message: "To Long Password" }),
});