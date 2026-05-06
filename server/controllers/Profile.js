import Profile from "../models/Profile.js"
import User from "../models/User.js"

export const updateProfile = async (req, res) => {
  try {
    const {
      dateOfBirth = "",
      about = "",
      contactNumber,
      gender,
    } = req.body;

    const id = req.user.id;

    // ✅ validation
    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "Contact number and gender are required",
      });
    }

    // ✅ find user
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ find profile
    const profileDetails = await Profile.findById(
      userDetails.additionalDetails
    );

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // ✅ update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    profileDetails.about = about;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // ✅ delete profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    // ✅ delete user
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while deleting the user",
      error: error.message,
    });
  }
};

export const getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails, // ✅ FIXED
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while getting the user",
      error: error.message,
    });
  }
};

