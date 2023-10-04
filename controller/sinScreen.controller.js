import SingleScreenModel from "../model/singleScreen.model";
import upload from "../multer/multerConfig";
import { randomBytes } from 'crypto';
import fs from 'fs';
import path from 'path';

function generatePassword(length) {
  const buffer = randomBytes(Math.ceil(length / 2));
  return buffer.toString('hex').slice(0, length);
}

export const addData = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error("Error uploading files:", err);
        return res.status(500).json({ message: "File upload error" });
      }

      const { name, user, tvSettings, mediaItems } = req.body;
      const imagePaths = req.files.map((file) => file.path);
      console.log(imagePaths);

      const password = generatePassword(6);
      console.log('Generated Password:', password);

      const formattedName = name.toLowerCase().replace(/ /g, '-');
      const uniqueUrl = `/user/${formattedName}`; 

      const singleScreen = new SingleScreenModel({
        name,
        user,
        tvSettings: {
          position: tvSettings.position,
          animationEffect: tvSettings.animationEffect,
          sliderDuration: tvSettings.sliderDuration,
        },
        mediaItems: {
          type: mediaItems.type,
          images: imagePaths,
        },
        password:password,
        url: uniqueUrl,
      });

      await singleScreen.save();
      return res.status(201).json({
        message: "Data added successfully",
        data: singleScreen,
        password: password, 
        uniqueUrl: uniqueUrl,
      });
    });
  } catch (error) {
    console.error("Error adding data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserData = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userData = await SingleScreenModel.find({ user: userId });
    if (!userData) {
      return res.status(404).json({ message: "User data not found" });
    }
    return res
      .status(200)
      .json({ data: userData, message: "User data retrieved successfully" });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const getSingleScreen = async (req, res) => {
//   const productId = req.params.productId;
//   try {
//     const product = await SingleScreenModel.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     return res.status(200).json({
//       data: product,
//       message: "Product retrieved successfully",
//     });
//   } catch (error) {
//     console.error("Error retrieving product:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


export const getSingleScreen = async (req, res) => {
  const uniqueUrl = req.params.uniqueUrl;
  const password = req.query.passwordOne;

  try {
    const product = await SingleScreenModel.findOne({ uniqueUrl: uniqueUrl });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (password !== product.password) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      data: product,
      message: "Product retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const deleteSingleScreen = async (req, res) => {
//   const screenId = req.params.id;
//   const imagesFolder = path.join(__dirname, '../uploads/images');

//   try {
//     const singleScreen = await SingleScreenModel.findById(screenId);

//     if (!singleScreen) {
//       return res.status(404).json({ message: 'Screen not found' });
//     }

//     singleScreen.mediaItems.forEach((imageFilename) => {
//       const filePath = path.join(imagesFolder, imageFilename);

//       // Check if the file exists before attempting to delete it
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
//     });

//     // Delete the SingleScreenModel entry from the database
//     await singleScreen.remove();

//     return res.status(200).json({ message: 'Screen and images deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting screen:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const removeImageFromSingleScreen = async (req, res) => {
  const screenId = req.params.id;
  const imageFilename = req.params.filename;

  try {
    const singleScreen = await SingleScreenModel.findById(screenId);

    if (!singleScreen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    const updatedImages = singleScreen.mediaItems.images.filter(
      (imagePath) => imagePath !== imageFilename
    );

    const filePath = path.join(__dirname, '../uploads/images', imageFilename);
    fs.unlinkSync(filePath);

    singleScreen.mediaItems.images = updatedImages;
    await singleScreen.save();

    return res.status(200).json({ message: 'Image removed successfully' });
  } catch (error) {
    console.error('Error removing image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
