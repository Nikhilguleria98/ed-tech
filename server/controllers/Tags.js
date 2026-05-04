import Tag from "../models/Tag.js";

// ✅ CREATE TAG
export const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const tagDetails = await Tag.create({
      name,
      description,
    });

    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
      data: tagDetails, // ✅ return created tag
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ✅ GET ALL TAGS (VERY IMPORTANT FOR DROPDOWN)
export const showAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: 1, description: 1 });

    return res.status(200).json({
      success: true,
      message: "All tags fetched successfully",
      data: allTags, // ✅ REQUIRED
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ✅ GET TAG DETAILS
export const getTagDetails = async (req, res) => {
  try {
    const { tagId } = req.body;

    const selectedTag = await Tag.findById(tagId)
      .populate("courses")
      .exec();

    if (!selectedTag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    const differentTags = await Tag.find({
      _id: { $ne: tagId },
    })
      .populate("courses")
      .exec();

    return res.status(200).json({
      success: true,
      data: {
        selectedTag,
        differentTags,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};