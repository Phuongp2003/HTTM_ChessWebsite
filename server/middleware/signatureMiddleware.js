const jwt = require('jsonwebtoken');

// Middleware to verify access token
function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization'];

	if (!authHeader) {
		res.status(403).json({ message: 'No token provided.' });
		return;
	}

	const token = authHeader.split(' ')[1]; // Get token from Authorization header (Bearer token)

	if (!token) {
		res.status(403).json({ message: 'No token provided.' });
		return;
	}

	// Verify the validity of the token
	jwt.verify(
		token,
		process.env.SECRET_KEY,
		{ algorithms: ['HS256'] },
		(err, decoded) => {
			if (err) {
				if (err.name === 'TokenExpiredError') {
					res.status(401).json({ message: 'Token has expired.' });
					return;
				}
				// Remove all tokens if there is a change in the cookie
				res.setHeader('Set-Cookie', [
					'jwtToken=; HttpOnly; Secure; Max-Age=0; SameSite=None',
					'user=; HttpOnly; Secure; Max-Age=0; SameSite=None',
					'refreshToken=; HttpOnly; Secure; Max-Age=0; SameSite=None',
				]);
				res.status(500).json({
					message: 'Failed to authenticate token.',
				});
				return;
			}

			// Save user information to the request
			req.user = decoded; // Save user information to the request for use in subsequent steps
			next();
		}
	);
}

module.exports = { verifyToken };
