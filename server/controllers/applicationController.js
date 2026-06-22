import Application from '../models/Application.js';

// @desc    Get user applications
// @route   GET /api/v1/applications
// @access  Private
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new application
// @route   POST /api/v1/applications
// @access  Private
export const addApplication = async (req, res) => {
  try {
    const { company, position, status, location, salary, notes } = req.body;
    
    const application = await Application.create({
      userId: req.user._id,
      company,
      position,
      status: status || 'Applied',
      location,
      salary,
      notes
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an application (e.g. status change)
// @route   PUT /api/v1/applications/:id
// @access  Private
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (application) {
      // Make sure user owns application
      if (application.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const updatedApplication = await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an application
// @route   DELETE /api/v1/applications/:id
// @access  Private
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (application) {
      if (application.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await application.deleteOne();
      res.json({ message: 'Application removed' });
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
