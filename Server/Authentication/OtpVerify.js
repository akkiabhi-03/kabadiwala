import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const VerifyToken = async (req, res, next) => {
  const token = req.body.token;

  console.log('hello!')
  if (!token) {
    console.log('❌ No token provided');
    return res.status(400).json({ error: 'Token is required' });
  }
    const msg91Url = process.env.MSG91URL;
    const authkey = process.env.MSG91AUTH_KEY;
//   const msg91Url = 'https://control.msg91.com/api/v5/widget/verifyAccessToken';
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const body = {
    authkey: authkey,
    'access-token': token,
  };

  try {
    const response = await fetch(msg91Url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const result = await response.json();
    console.log('✅ MSG91 Response:', result);

    if (result && result.type === 'success') {
      // You can store result info in req if needed later
      req.otpVerified = true;
      req.otpResult = result;
      next(); // Proceed to next middleware or route handler
    } else {
      return res.status(401).json({
        verified: false,
        msg: result?.message || 'Authentication failed',
        code: result?.code || 'Unknown',
      });
    }
  } catch (err) {
    console.error('❌ Exception during MSG91 verification:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default VerifyToken;