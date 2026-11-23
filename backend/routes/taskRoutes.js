const router = require('express').Router();
const auth = require('../middleware/auth');
const { getTasks, createTask, completeTask, deleteTask, deleteAllTasks } = require('../controllers/taskController');

router.use(auth);                       // every task route needs a logged-in user
router.get('/', getTasks);
router.post('/', createTask);
router.delete('/', deleteAllTasks);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

module.exports = router;
