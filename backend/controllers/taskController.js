const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId }).sort({ date: 1, createdAt: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { text, date, category } = req.body;
        if (!text || !text.trim() || !date) {
            return res.status(400).json({ message: 'Task text and due date are required' });
        }
        const task = await Task.create({ user: req.userId, text, date, category: category || '' });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { complete: true },
            { new: true }
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset button: clears only the logged-in user's tasks
exports.deleteAllTasks = async (req, res) => {
    try {
        await Task.deleteMany({ user: req.userId });
        res.json({ message: 'All tasks deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
