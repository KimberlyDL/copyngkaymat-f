const jwtService = require('../services/JwtService');
const { User } = require('../model');

function getDeviceInfo(req) {
    const userAgent = req.get('user-agent') || '';
    let deviceName = 'Unknown Device';
    if (userAgent.includes('Mobile')) deviceName = 'Mobile Device';
    else if (userAgent.includes('Chrome')) deviceName = 'Chrome Browser';
    else if (userAgent.includes('Safari')) deviceName = 'Safari Browser';
    else if (userAgent.includes('Firefox')) deviceName = 'Firefox Browser';
    return {
        device_name: deviceName,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: userAgent
    };
}

exports.authenticate = async (req, res, next) => {
    try {
        // Support token via Authorization header OR ?token= query param (SSE needs query param
        // because EventSource API cannot send custom headers).
        const authHeader = req.headers.authorization
            ?? (req.query.token ? `Bearer ${req.query.token}` : undefined);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided.', code: 'NO_TOKEN' });
        }

        const token = authHeader.substring(7);

        let decoded;
        try {
            decoded = await jwtService.validateAccessToken(token);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // For SSE connections, an expired token should close the stream
                // cleanly (the frontend will reconnect with a fresh token via polling).
                if (req.path.endsWith('/stream')) {
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.flushHeaders();
                    res.write('event: auth_error\ndata: {"code":"TOKEN_EXPIRED"}\n\n');
                    return res.end();
                }
                return res.status(401).json({ message: 'Token has expired.', code: 'TOKEN_EXPIRED' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token.', code: 'INVALID_TOKEN' });
            }
            if (error.message === 'Token has been revoked') {
                return res.status(401).json({ message: 'Token has been revoked.', code: 'TOKEN_REVOKED' });
            }
            throw error;
        }

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found.', code: 'USER_NOT_FOUND' });
        }

        if (user.account_status === 'banned') {
            return res.status(403).json({ message: 'Your account has been banned.', code: 'ACCOUNT_BANNED' });
        }

        if (user.account_status === 'suspended') {
            if (user.suspended_until && new Date(user.suspended_until) > new Date()) {
                return res.status(403).json({
                    message: 'Your account is suspended.',
                    code: 'ACCOUNT_SUSPENDED',
                    suspended_until: user.suspended_until
                });
            } else {
                await user.update({ account_status: 'active', suspended_until: null, suspension_reason: null });
            }
        }

        if (user.account_status === 'deactivated') {
            return res.status(403).json({ message: 'Your account has been deactivated.', code: 'ACCOUNT_DEACTIVATED' });
        }

        if (user.tokenIssuedBeforePasswordChange(decoded.iat)) {
            return res.status(401).json({ message: 'Token invalidated due to password change.', code: 'PASSWORD_CHANGED' });
        }

        req.user = user;
        req.userId = user.id;
        req.jti = decoded.jti;
        next();
    } catch (error) {
        next(error);
    }
};

exports.requireEmailVerified = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required.' });
    if (!req.user.hasVerifiedEmail()) {
        return res.status(403).json({
            message: 'Please verify your email before accessing this resource.',
            code: 'EMAIL_NOT_VERIFIED',
            unverified: true
        });
    }
    next();
};

exports.requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Authentication required.', code: 'AUTH_REQUIRED' });
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to access this resource.',
                code: 'INSUFFICIENT_PERMISSIONS',
                required_role: allowedRoles.length === 1 ? allowedRoles[0] : allowedRoles,
                current_role: req.user.role
            });
        }
        next();
    };
};

exports.optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
        const token = authHeader.substring(7);
        try {
            const decoded = await jwtService.validateAccessToken(token);
            const user = await User.findByPk(decoded.id);
            if (user && !user.tokenIssuedBeforePasswordChange(decoded.iat)) {
                req.user = user;
                req.userId = user.id;
                req.jti = decoded.jti;
            }
        } catch (_) {}
        next();
    } catch (error) {
        next(error);
    }
};

exports.createRateLimiter = (windowMs, max) => ({
    windowMs, max,
    message: { message: 'Too many requests, please try again later.', code: 'RATE_LIMIT_EXCEEDED' },
    standardHeaders: true,
    legacyHeaders: false
});

exports.getDeviceInfo = getDeviceInfo;