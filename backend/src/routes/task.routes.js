const express = require('express')
const { body, param, query } = require('express-validator')

// Controllers
const taskController = require('../controllers/tasks/task.controller')
const assignmentController = require('../controllers/tasks/assignment.controller')

// Middleware
const { auth, requirePermission } = require('../middleware/auth')
const { validation } = require('../middleware/validation')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Task Management Routes

/**
 * @route   GET /api/tasks
 * @desc    Get tasks
 * @access  Private
 */
router.get('/',
  auth,
  [
    query('status').optional().isIn(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']),
    query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    query('type').optional().isString(),
    query('assignedTo').optional().isUUID(),
    query('propertyId').optional().isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(taskController.getTasks)
)

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Private
 */
router.get('/:id',
  auth,
  param('id').isUUID().withMessage('Invalid task ID'),
  validation,
  asyncHandler(taskController.getTaskById)
)

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Private
 */
router.post('/',
  auth,
  requirePermission('task:create'),
  [
    body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title required'),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('type').isString().withMessage('Task type required'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    body('dueDate').optional().isISO8601(),
    body('assignedTo').optional().isUUID(),
    body('propertyId').optional().isUUID()
  ],
  validation,
  asyncHandler(taskController.createTask)
)

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private
 */
router.put('/:id',
  auth,
  param('id').isUUID().withMessage('Invalid task ID'),
  validation,
  asyncHandler(taskController.updateTask)
)

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private
 */
router.delete('/:id',
  auth,
  requirePermission('task:delete'),
  param('id').isUUID().withMessage('Invalid task ID'),
  validation,
  asyncHandler(taskController.deleteTask)
)

/**
 * @route   POST /api/tasks/:id/assign
 * @desc    Assign task
 * @access  Private
 */
router.post('/:id/assign',
  auth,
  requirePermission('task:assign'),
  param('id').isUUID().withMessage('Invalid task ID'),
  body('userId').isUUID().withMessage('Valid user ID required'),
  validation,
  asyncHandler(assignmentController.assignTask)
)

/**
 * @route   POST /api/tasks/:id/status
 * @desc    Update task status
 * @access  Private
 */
router.post('/:id/status',
  auth,
  param('id').isUUID().withMessage('Invalid task ID'),
  body('status').isIn(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']),
  body('notes').optional().trim().isLength({ max: 1000 }),
  validation,
  asyncHandler(taskController.updateTaskStatus)
)

/**
 * @route   GET /api/tasks/my-tasks
 * @desc    Get current user's tasks
 * @access  Private
 */
router.get('/my-tasks',
  auth,
  asyncHandler(taskController.getMyTasks)
)

/**
 * @route   GET /api/tasks/metrics
 * @desc    Get task metrics
 * @access  Private
 */
router.get('/metrics',
  auth,
  requirePermission('task:read'),
  query('period').optional().isInt({ min: 1, max: 365 }),
  validation,
  asyncHandler(taskController.getTaskMetrics)
)

module.exports = router
