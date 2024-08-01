"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserValidation = void 0;
const zod_1 = require("zod");
exports.RegisterUserValidation = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid Email Address" }),
    password: zod_1.z.string().min(6, { message: "Password is Too Short Minimum Length is 6 characters" })
        .max(18, { message: "To Long Password" }),
});
