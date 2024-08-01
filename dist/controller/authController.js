"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const Helper_1 = require("../Helper");
const validations_1 = require("../validations");
const UserModel_1 = require("../Models/UserModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, passwordConfirm } = req.body;
    if (!email || !password || !passwordConfirm) {
        return res.json((0, Helper_1.generateResponeType)(false, "Credentails Requred", null));
    }
    if (password !== passwordConfirm) {
        return res.json((0, Helper_1.generateResponeType)(false, "Password Not Match", null));
    }
    //check validation
    const isValidationSucces = validations_1.RegisterUserValidation.safeParse({
        email,
        password,
    });
    if (!isValidationSucces.success) {
        const errors = isValidationSucces.error.issues
            .map((issue) => issue.message)
            .join(", ");
        return res.json((0, Helper_1.generateResponeType)(false, errors, null));
    }
    try {
        //check  if user already exists or not
        const isUserExists = yield UserModel_1.UserModel.findOne({ email });
        if (isUserExists) {
            return res.json((0, Helper_1.generateResponeType)(false, "email already registered", null));
        }
        //now we can register the user
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = new UserModel_1.UserModel({ email, password: hashPassword });
        yield newUser.save();
        return res.json((0, Helper_1.generateResponeType)(true, "User Registered Succesful", null));
    }
    catch (error) {
        return res.json((0, Helper_1.generateResponeType)(false, "Internal Server Error", null));
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("requrest come");
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json((0, Helper_1.generateResponeType)(false, "Credentials Required", null));
    }
    try {
        const isUserExists = yield UserModel_1.UserModel.findOne({ email }).sort({
            createdAt: -1,
        });
        if (!isUserExists) {
            return res.json((0, Helper_1.generateResponeType)(false, "Email Not Registered", null));
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, isUserExists.password);
        if (!isPasswordCorrect) {
            return res.json((0, Helper_1.generateResponeType)(false, "Invalid Credentials", null));
        }
        //@ts-ignore
        const data = isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists._doc;
        if (data) {
            return res.json((0, Helper_1.generateResponeType)(true, "User Logged In Succes", Object.assign(Object.assign({}, data), { password: null })));
        }
    }
    catch (error) {
        return res.json((0, Helper_1.generateResponeType)(false, "Internal Server Error", null));
    }
});
exports.loginUser = loginUser;
