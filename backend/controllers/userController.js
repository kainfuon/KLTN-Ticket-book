import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"; 
import validator from "validator";

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.json({ success: false, message: "Email already registered" });

        // Check validation
        if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" }); 
        
        if (password.length < 8) return res.json({ success: false, message: "Password must be at least 8 characters long" }); 
        

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new userModel({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error registering user" });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "Invalid email or password" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid email or password" });

        // Generate token // userId chính là _id của MongoDB
        const token = jwt.sign({ userId: user._id, role: user.role }, "your_secret_key", { expiresIn: "1h" });

        res.json({ success: true, token, role: user.role });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error logging in" });
    }
};

 const getUserInfo = async (req, res) => {
    try {
        const userId = req.user?.userId; // Lấy userId từ token trong middleware

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized. User ID is missing." });
        }

        // Lấy thông tin user, bỏ password & __v
        const user = await userModel.findById(userId).select("-password -__v");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const getAllUsers = async (req, res) => {
    try {
     
      // Lấy danh sách người dùng
      const users = await userModel.find().select('-password');  // Không trả về mật khẩu
  
      // Trả về danh sách người dùng
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
};

export { registerUser, loginUser, getUserInfo, getAllUsers };
