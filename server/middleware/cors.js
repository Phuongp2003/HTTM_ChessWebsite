const cors = require('cors');

async function loadCorsSettings() {
    return {
        allowedOrigins: ['http://localhost:5173', 'http://localhost:3000'],
    };
}

async function corsMiddleware(req, res, next) {
    const settings = await loadCorsSettings();
    cors({
        origin: (origin, callback) => {
            if (
                (typeof origin === 'string' &&
                    settings.allowedOrigins.includes(origin)) ||
                !origin
            ) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })(req, res, next);
}

module.exports = corsMiddleware;
