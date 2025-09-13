// src/javascripts/config/passport.js
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/user.js";

// Local username/password strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username }).populate("roles");
      if (!user) return done(null, false, { message: "Invalid username" });

      if (!user.isValidPassword(password)) {
        return done(null, false, { message: "Invalid password" });
      }

    const safeClaims = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        roles: (user.roles || []).map(r => r.name),
      };
      return done(null, safeClaims);
    } catch (err) {
      return done(err);
    }
  })
);

// Sessions: store user id in the session cookie; hydrate on each request
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const u = await User.findById(id).populate("roles");
    if (!u) return done(null, false);
    done(null, {
      id: u._id.toString(),
      username: u.username,
      name: `${u.firstName} ${u.lastName}`,
      roles: (u.roles || []).map(r => r.name),
    });
  } catch (e) {
    done(e);
  }
});

// Route guards
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ success: false, message: "Not authenticated" });
}

export function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
    const ok = req.user.roles?.some(r => allowed.includes(r));
    if (!ok) return res.status(403).json({ success: false, message: "Forbidden: insufficient role" });
    next();
  };
}

export { passport };
