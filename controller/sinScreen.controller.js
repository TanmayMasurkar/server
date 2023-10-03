import SingleScreenModel from "../model/singleScreen.model";
import upload from "../multer/multerConfig"; 

export const addData = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error("Error uploading files:", err);
        return res.status(500).json({ message: "File upload error" });
      }

      const { name, user, tvSettings, mediaItems } = req.body;
      const imagePaths = req.files.map((file) => file.path);
      console.log(imagePaths)
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
      });

      await singleScreen.save();
      return res.status(201).json({
        message: "Data added successfully",
        data: singleScreen,
      });
    });
  } catch (error) {
    console.error("Error adding data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
