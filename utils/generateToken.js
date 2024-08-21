import jwt from 'jsonwebtoken'

const generateToken = (res, client) => {
    // const token = jwt.sign({ clientId }, process.env.JWT_SECRET,{
    //     expiresIn: '30d'
    // });
 
    
    // res.cookie('jwt', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV !== 'development',// Use secure cookies in production
    //     sameSite: 'none',// Prevent CSRF attacks
    //     maxAge: 30 * 24 * 60 * 60 * 1000,// 30 days
    // })

    // return token;
    const accessToken = jwt.sign(
        {
            "ClientInfo": {
                "id": client._id,
                "fullName": client.fullName, 
                "phoneNumber": client.phoneNumber,
                "isAdmin": client.isAdmin
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "fullName": client.fullName },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })
    const clientId = client._id

    // Send accessToken containing id 
    res.json({ accessToken , clientId  })


}

export default generateToken