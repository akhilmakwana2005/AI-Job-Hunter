import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Application from '../models/Application.js';
import SalaryNegotiation from '../models/SalaryNegotiation.js';

// @desc    Get complete admin statistics
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const proUsers = await User.countDocuments({ isPro: true });
    const totalApplications = await Application.countDocuments();
    const totalResumesScanned = await Resume.countDocuments();
    const totalNegotiations = await SalaryNegotiation.countDocuments();

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .select('fullName email isPro createdAt')
      .limit(5);

    // Calculate MRR (Monthly Recurring Revenue) roughly (assuming 499 per pro user)
    const currentMRR = proUsers * 499;

    res.json({
      stats: {
        totalUsers,
        proUsers,
        totalApplications,
        totalResumesScanned,
        totalNegotiations,
        revenue: currentMRR
      },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Promote a user to Pro
// @route   PUT /api/v1/admin/users/:id/promote
// @access  Private/Admin
export const promoteUserToPro = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isPro = true;
    await user.save();
    res.json({ message: 'User promoted to Pro successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
