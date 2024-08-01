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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const aws_sdk_1 = require("aws-sdk");
const crypto_1 = require("crypto");
const uploadToS3 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const s3 = new aws_sdk_1.S3();
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `booksImg/${(0, crypto_1.randomUUID)()}-${file.originalname}`,
        Body: file.buffer,
    };
    //@ts-ignore
    return yield s3.upload(params).promise();
});
exports.uploadToS3 = uploadToS3;
