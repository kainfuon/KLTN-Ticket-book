import jwt from "jsonwebtoken";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");  

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), "your_secret_key"); 
        req.user = verified;  
        next();  
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid token" });
    }
};

// Middleware to check if the user is an admin
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {  
        if (req.user.role === "admin") {  
            next();  
        } else {
            res.status(403).json({ success: false, message: "Access denied. Admins only." });
        }
    });
};

export { verifyToken, verifyAdmin };
