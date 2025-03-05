const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer TOKEN"
  
    if (!token) return res.status(403).json({ message: "Token is required" });
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid token" });
  
      req.user = decoded; // Attach user data to request
      next();
    });
  };

  export default verifyToken;