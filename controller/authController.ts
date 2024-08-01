import { Request, Response } from "express";
import { generateResponeType } from "../Helper";
import { RegisterUserValidation } from "../validations";
import { UserModel } from "../Models/UserModel";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, passwordConfirm } = req.body;
  if (!email || !password || !passwordConfirm) {
    return res.json(generateResponeType(false, "Credentails Requred", null));
  }
  if (password !== passwordConfirm) {
    return res.json(generateResponeType(false, "Password Not Match", null));
  }
  //check validation
  const isValidationSucces = RegisterUserValidation.safeParse({
    email,
    password,
  });
  if (!isValidationSucces.success) {
    const errors = isValidationSucces.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return res.json(generateResponeType(false, errors, null));
  }
  try {
    //check  if user already exists or not
    const isUserExists = await UserModel.findOne({ email });
    if (isUserExists) {
      return res.json(
        generateResponeType(false, "email already registered", null)
      );
    }
    //now we can register the user

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({ email, password: hashPassword });
    await newUser.save();
    return res.json(
      generateResponeType(true, "User Registered Succesful", null)
    );
  } catch (error) {
    return res.json(generateResponeType(false, "Internal Server Error", null));
  }
};
export const loginUser = async (req: Request, res: Response) => {
  console.log("requrest come");
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json(generateResponeType(false, "Credentials Required", null));
  }
  try {
    const isUserExists = await UserModel.findOne({ email }).sort({
      createdAt: -1,
    });
    if (!isUserExists) {
      return res.json(generateResponeType(false, "Email Not Registered", null));
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserExists.password
    );
    if (!isPasswordCorrect) {
      return res.json(generateResponeType(false, "Invalid Credentials", null));
    }
    //@ts-ignore

    const data = isUserExists?._doc;
    if (data) {
      return res.json(
        generateResponeType(true, "User Logged In Succes", {
          ...data,
          password: null,
        })
      );
    }
  } catch (error) {
    return res.json(generateResponeType(false, "Internal Server Error", null));
  }
};
