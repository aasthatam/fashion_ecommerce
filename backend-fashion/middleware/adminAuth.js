import jwt from "jsonwebtoken"

const adminAuth = async (req, res, next) => {
    try {

        const { token } = req.headers
        if (!token) {
            return res.json ({success: false, message: "Not Authorized Login Again"})
        }
        // const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        // if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
        //     return res.json ({success: false, message: "Not Authorized Login Again"})
        // }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token includes the 'admin' role
        if (!decoded || decoded.role !== "admin") {
          return res.json({ success: false, message: "Not Authorized Login Again" });
        }
        next()
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export default adminAuth
