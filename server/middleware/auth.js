import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    // ✅ correct header
    const authHeader = req.headers.authorization;

    // check token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token missing or malformed",
      });
    }

    // extract token
    const token = authHeader.split(" ")[1];

    // verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};