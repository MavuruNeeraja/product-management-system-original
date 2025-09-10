const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Role-based filtering
    if (req.user.role === 'developer') {
      query.$or = [
        { manager: req.user._id },
        { 'team.user': req.user._id }
      ];
    }

    const projects = await Project.find(query)
      .populate('manager', 'name email')
      .populate('team.user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

// Get single project
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, isActive: true })
      .populate('manager', 'name email')
      .populate('team.user', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    const hasAccess = project.manager._id.toString() === req.user._id.toString() ||
                     project.team.some(member => member.user._id.toString() === req.user._id.toString()) ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get project tasks
    const tasks = await Task.find({ project: project._id, isActive: true })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ project, tasks });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
});

// Create new project
router.post('/', authenticateToken, authorize('admin', 'manager'), async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      manager: req.user._id
    };

    const project = new Project(projectData);
    await project.save();

    await project.populate('manager', 'name email');
    await project.populate('team.user', 'name email');

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    const canEdit = project.manager.toString() === req.user._id.toString() || req.user.role === 'admin';
    if (!canEdit) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('manager', 'name email').populate('team.user', 'name email');

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
});

// Delete project (soft delete)
router.delete('/:id', authenticateToken, authorize('admin', 'manager'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the manager or admin
    const canDelete = project.manager.toString() === req.user._id.toString() || req.user.role === 'admin';
    if (!canDelete) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete project and related tasks
    await Project.findByIdAndUpdate(req.params.id, { isActive: false });
    await Task.updateMany({ project: req.params.id }, { isActive: false });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

// Add team member to project
router.post('/:id/team', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    const canEdit = project.manager.toString() === req.user._id.toString() || req.user.role === 'admin';
    if (!canEdit) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if user is already in team
    const existingMember = project.team.find(member => member.user.toString() === userId);
    if (existingMember) {
      return res.status(400).json({ message: 'User is already a team member' });
    }

    project.team.push({ user: userId, role: role || 'developer' });
    await project.save();

    await project.populate('team.user', 'name email');

    res.json({
      message: 'Team member added successfully',
      project
    });
  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({ message: 'Failed to add team member', error: error.message });
  }
});

// Remove team member from project
router.delete('/:id/team/:userId', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    const canEdit = project.manager.toString() === req.user._id.toString() || req.user.role === 'admin';
    if (!canEdit) {
      return res.status(403).json({ message: 'Access denied' });
    }

    project.team = project.team.filter(member => member.user.toString() !== req.params.userId);
    await project.save();

    await project.populate('team.user', 'name email');

    res.json({
      message: 'Team member removed successfully',
      project
    });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({ message: 'Failed to remove team member', error: error.message });
  }
});

module.exports = router;
