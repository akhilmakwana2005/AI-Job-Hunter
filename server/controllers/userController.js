import User from '../models/User.js';

// @desc    Update user preferences & complete onboarding
// @route   PUT /api/v1/users/preferences
// @access  Private
export const updateUserPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.onboardingCompleted = req.body.onboardingCompleted ?? user.onboardingCompleted;
      
      if (req.body.preferences) {
        user.preferences = { ...user.preferences, ...req.body.preferences };
      }
      
      if (req.body.profile) {
        user.profile = { ...user.profile, ...req.body.profile };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        onboardingCompleted: updatedUser.onboardingCompleted,
        preferences: updatedUser.preferences,
        profile: updatedUser.profile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
