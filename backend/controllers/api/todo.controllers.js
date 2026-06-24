const {
  findTodoById,
  updateTodo,
  deleteTodoById,
  deleteAllTodos,
  findAllTodos,
  createTodo,
} = require("../../services/todo.services");

/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - namepatient
 *         - emailpatient
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID of the todo
 *         namepatient:
 *           type: string
 *         emailpatient:
 *           type: string
 *         birth:
 *           type: string
 *           format: date
 *         telephone:
 *           type: string
 *         gender:
 *           type: string
 *         address:
 *           type: string
 *       example:
 *         namepatient: John Doe
 *         emailpatient: john@example.com
 *         birth: 1990-01-01
 *         telephone: "+123456789"
 *         gender: Male
 *         address: 123 Main St
 */

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Content can not be empty
 */
exports.create = (req, res) => {
  if (!req.body.username) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const patient = {
    namepatient: req.body.namepatient,
    emailpatient: req.body.emailpatient,
    birth: req.body.birth,
    telephone: req.body.telephone,
    gender: req.body.gender,
    address: req.body.address,
  };

  createTodo(patient, res);
};

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Retrieve all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: A list of todos
 */
exports.findAll = (req, res) => {
  findAllTodos(res);
};

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The todo data
 *       404:
 *         description: Todo not found
 */
exports.findOne = (req, res) => {
  const id = req.params.id;
  findTodoById(id, res);
};

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found
 */
exports.update = (req, res) => {
  const id = req.params.id;
  updateTodo(id, req, res);
};

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 */
exports.delete = (req, res) => {
  const id = req.params.id;
  deleteTodoById(id, res);
};

/**
 * @swagger
 * /api/todos:
 *   delete:
 *     summary: Delete all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: All todos deleted
 */
exports.deleteAll = (req, res) => {
  deleteAllTodos(req, res);
};
