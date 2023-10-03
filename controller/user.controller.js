import UserModel from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Cookies from "cookies";

export const getUserRecords = async (req, res) => {
  try {
    const userData = await UserModel.find();
    if (userData) {
      return res.status(200).json({
        data: userData,
        message: "Success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const newUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, contact } = req.body;

    const hashPassword = bcrypt.hashSync(password, 10);
    const createdRecord = new UserModel({
      name: name,
      email: email,
      password: hashPassword,
      contact: contact,
    });
    createdRecord.save();
    if (createdRecord) {
      return res.status(201).json({
        data: createdRecord,
        message: "Success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const id = req.params.user_id;

    const userData = await UserModel.findOne({ _id: id });
    if (userData) {
      return res.status(200).json({
        data: userData,
        message: "Success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.user_id;

    const deletedUser = await UserModel.deleteOne({ _id: id });
    if (deletedUser.acknowledged) {
      return res.status(200).json({
        message: "Deleted",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.user_id;
    const { name, email, password, contact } = req.body;

    const updatedUser = await UserModel.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          email: email,
          password: password,
          contact: contact,
        },
      }
    );

    if (updatedUser.acknowledged) {
      return res.status(200).json({
        message: "Updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const signUp = async (req, res) => {
    try {
      const { name, email, password, contact,role } = req.body;
  
      const existUser = await UserModel.findOne({ email: email });
      if (existUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
  
      const hashPassword = bcrypt.hashSync(password, 10);
      const newUser = new UserModel({
        name: name,
        email: email,
        password: hashPassword,
        contact: contact,
        role: role,
      });
      newUser.save();
      if (newUser) {
        return res.status(201).json({
          message: "Successfully registered.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  
  export const signIn = async (req, res) => {
    try {
      const { email, password } = req.body;  
      const existUser = await UserModel.findOne({ email: email });
      if (!existUser) {
        return res.status(400).json({
          message: "User does not exist",
        });
      }
  
      const passwordCompare = await bcrypt.compare(password, existUser.password);
      if (!passwordCompare) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }
  
      const token = await jwt.sign(
        {
          id: existUser._id,
          email: existUser.email,
          role: existUser.role,
        },
        "mysecretkey",
        { expiresIn: "6hr" }
      );
  
  
        // Create a cookies object
        var cookies = new Cookies(req, res)
  
        cookies.set('users', JSON.stringify(existUser))
  
      return res.status(200).json({
        data: existUser,
        token: token,
        message: "Successfully login",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
  
  
  export const logout = (req,res)=>{
    try {
      var cookies = new Cookies(req, res)
      cookies.set('users', null)
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }