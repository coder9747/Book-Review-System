import { ResponseType } from "../types";
export function generateResponeType(succes: boolean, message: string, payload: any): ResponseType {
    return { succes, message, payload }
}