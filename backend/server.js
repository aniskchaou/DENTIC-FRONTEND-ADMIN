const init = require('./db/init.sequelize.js');
const config = require('./config/connection.server.js');
const db = require('./db/models.sequelize.js');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
var cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./routes/swagger.js'); // 
const { sendMail } = require('./utils/email.services.js');
const { saveReminderJob, executePendingReminders } = require('./utils/reminderScheduler');
require('./jobs/scheduler');
var app = express()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs.create({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layout/' }).engine);
app.set('view engine', 'hbs')
app.listen(process.env.PORT || config.port, () => {
    console.log("Express server is started at port : " + config.port);
})
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '/views/assets/')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  setTimeout(async () => {
     executePendingReminders();
    console.log('Executed pending reminders.');
  }, 60 * 1000);
app.use('/', routes)

