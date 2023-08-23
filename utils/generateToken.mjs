import jwt from 'jsonwebtoken';
export default function generateToken(res, userID)
{
    const token = jwt.sign({ userID }, process.env.SECRET_KEY, {
        expiresIn: '30d',
      });
    
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });    
}