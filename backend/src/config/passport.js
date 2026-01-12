const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');

// Local Strategy for username/password login
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({
          where: { email },
          include: [
            {
              model: Role,
              through: { attributes: [] },
              attributes: ['id', 'name', 'level']
            }
          ]
        });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Check if user is active
        if (!user.is_active) {
          return done(null, false, { message: 'Account is deactivated' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Remove password from user object
        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;

        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy for token-based authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromUrlQueryParameter('token'),
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['jwt'];
      }
      return token;
    }
  ]),
  secretOrKey: process.env.JWT_SECRET || 'stayspot-secret-key',
  passReqToCallback: true
};

passport.use(
  new JwtStrategy(jwtOptions, async (req, jwtPayload, done) => {
    try {
      // Find user by ID from JWT payload
      const user = await User.findOne({
        where: { id: jwtPayload.id },
        include: [
          {
            model: Role,
            through: { attributes: [] },
            attributes: ['id', 'name', 'level', 'permissions'],
            include: [
              {
                model: Permission,
                through: { attributes: [] },
                attributes: ['id', 'name', 'action', 'resource']
              }
            ]
          },
          {
            model: Company,
            attributes: ['id', 'name', 'is_active']
          }
        ]
      });

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      // Check if user is active
      if (!user.is_active) {
        return done(null, false, { message: 'Account is deactivated' });
      }

      // Check if token was issued before password change
      if (user.password_changed_at) {
        const changedTimestamp = parseInt(
          user.password_changed_at.getTime() / 1000,
          10
        );
        if (jwtPayload.iat < changedTimestamp) {
          return done(null, false, {
            message: 'Password changed recently. Please login again.'
          });
        }
      }

      // Remove password from user object
      const userWithoutPassword = user.toJSON();
      delete userWithoutPassword.password;

      // Add user to request object
      req.user = userWithoutPassword;

      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ['id', 'name', 'level']
        }
      ]
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Authentication middleware
const authenticateJWT = passport.authenticate('jwt', { session: false });
const authenticateLocal = passport.authenticate('local', { session: false });

// Role-based authorization middleware
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRoles = req.user.roles.map(role => role.name);
    const hasRequiredRole = roles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        required: roles,
        userRoles: userRoles 
      });
    }

    next();
  };
};

// Permission-based authorization middleware
const authorizePermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Get user with permissions
      const user = await User.findByPk(req.user.id, {
        include: [
          {
            model: Role,
            through: { attributes: [] },
            include: [
              {
                model: Permission,
                through: { attributes: [] },
                where: { resource, action },
                required: false
              }
            ]
          }
        ]
      });

      // Check if user has the required permission
      const hasPermission = user.roles.some(role => 
        role.permissions.some(permission => 
          permission.resource === resource && permission.action === action
        )
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'Insufficient permissions',
          required: { resource, action }
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Multi-role hierarchy check
const authorizeRoleHierarchy = (minLevel) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userMaxLevel = Math.max(...req.user.roles.map(role => role.level));
    
    if (userMaxLevel < minLevel) {
      return res.status(403).json({ 
        message: 'Insufficient role level',
        requiredLevel: minLevel,
        userLevel: userMaxLevel
      });
    }

    next();
  };
};

module.exports = {
  passport,
  authenticateJWT,
  authenticateLocal,
  authorizeRole,
  authorizePermission,
  authorizeRoleHierarchy
};