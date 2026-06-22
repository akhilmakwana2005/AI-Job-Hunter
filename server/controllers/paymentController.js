import User from '../models/User.js';

// @desc    Simulate Razorpay Payment and Upgrade to Pro
// @route   POST /api/v1/payment/upgrade
// @access  Private
export const upgradeToPro = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    // In a real app, you would verify the Razorpay signature here
    // const crypto = require('crypto');
    // const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(order_id + "|" + paymentId).digest('hex');

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isPro = true;
    user.subscription = {
      plan: 'pro',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year
      paymentId: paymentId
    };

    await user.save();

    res.json({
      message: 'Successfully upgraded to Pro!',
      isPro: true,
      subscription: user.subscription
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
