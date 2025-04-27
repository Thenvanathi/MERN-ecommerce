const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

async function authToken(req, res, next) {
    try {
        console.log('Request Cookies:', req.cookies);

        const token = req.cookies?.token;

        if (!token) {
            console.log("No token found in request");
            return res.status(401).json({
                message: "Please Login...!",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
            if (err) {
                console.log("Error verifying token:", err.message);
                return res.status(401).json({
                    message: "Invalid Token!",
                    error: true,
                    success: false
                });
            }

            console.log("Decoded Token:", decoded);

            req.userId = decoded?._id;  
            next();  
        });

    } catch (err) {
        console.log("Error in authToken middleware:", err); 
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;