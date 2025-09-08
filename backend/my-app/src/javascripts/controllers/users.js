import { User } from '../models/user';
import { Role } from '../models/role';

// used for registration and for creating new users in admin tools
export const createUserAPI = async (req, res, next) => {
  try {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.username = req.body.username;
    user.setPassword(req.body.password);
    user.roles = req.body.roles;

    await user.save();

    res.status(200).json({ success: true, message: 'Account creation successful' });
  } catch (err) {
    if (err?.code === 11000) {
      // duplicate key (e.g., username or email already exists)
      res.status(409).json({
        success: false,
        errorCode: err.code,
        message:
          'Most likely you are trying to create an account with a username that already exists. Try a different username.',
      });
    } else {
      res.status(400).json({ success: false, message: err?.message || err });
    }
  }
};

export const signUserInAPI = async (req, res) => {
  try {
    // NOTE: don't use .lean() here because we need instance methods (isValidPassword, generateJWT)
    const user = await User.findOne({ username: req.body.username }).populate('roles');

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'No account matching that username was found' });
    }

    if (!user.isValidPassword(req.body.password)) {
      return res.status(401).json({
        success: false,
        message: 'An account with that username was found but the password did not match',
      });
    }

    const token = user.generateJWT();
    console.log('User authenticated. . . .');

    res.cookie('token', token, { maxAge: 1000 * 60 * 60 });
    return res.status(200).json({ success: true, user, message: 'Successfully signed in.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || err });
  }
};

/////////// Standard CRUD Methods Below

// GET /api/users
export const allUsersAPI = async (req, res, next) => {
  try {
    // lean() returns plain objects (faster when you don't need methods/getters)
    const users = await User.find().lean();
    res.send(JSON.stringify(users));
  } catch (err) {
    res.status(500).json({ success: false, message: 'Query failed' });
  }
};

// PUT /api/users/:id  (update user)
export const updateUserAPI = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    Object.assign(user, req.body);

    if (req.body.password !== 'dummy') {
      user.setPassword(req.body.password);
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Account update successful' });
  } catch (err) {
    if (err?.code === 11000) {
      res.status(409).json({
        success: false,
        errorCode: err.code,
        message:
          'Most likely you are trying to create an account with a username that already exists. Try a different username.',
      });
    } else {
      res.status(400).json({ success: false, message: err?.message || err });
    }
  }
};

// DELETE /api/users/:id
export const deleteUserAPI = async (req, res, next) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    // result: { acknowledged: true, deletedCount: N }
    if (result?.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'Delete Query succeeded' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete Query failed' });
  }
};

export const allUsersWhoAreStudentsAPI = async (req, res, next) => {
  // *** Add a controller here that will service an api/students route
  // this route returns all users who are students and is used in the CourseForm
};

