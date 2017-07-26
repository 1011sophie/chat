var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cors = require('cors');
var bodyParser = require('body-parser');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var options = {
    swaggerDefinition: {
        info: {
            title: 'chat' // Title (required) 
        },
    },
    apis: ['./server.js'], // Path to the API docs 
};

var swaggerSpec = swaggerJSDoc(options);

app.get('/api-docs.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.listen(8001);

var data = {
    userIncrement: 1,
    messageIncrement: 1,
    users: [],
    messages: []
};

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 *  @swagger
 *  /login:
 *    post:
 *      responses:
 *        200:
 *    parameters:
 *       - name: username
 *         description: Username to use for login.
 *         required: true
 *         in: header
 *         type: string
 *    description: Login to the application 
 */
app.post('/login', function (req, res) {

    var username = req.body.username;

    var user = {
        id: data.userIncrement++,
        name: username
    };

    data.users.push(user);

    io.sockets.emit('users', {});

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(user));
});

/**
 *  @swagger
 *  /users:
 *    get:
 *      responses:
 *        200:
 *    description: Get the user list
 */
app.get('/users', function (req, res) {

    var userId = req.query.userId;
    var users = data.users.filter(function (user) {
        return userId != user.id;
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(users));
});

/**
 *  @swagger
 *  /messages:
 *    post:
 *      responses:
 *        200:
 *      protocol: http
 *      parameters:
 *       - name: sender
 *         description: user who sends message.
 *         required: true
 *         in: header
 *         type: object
 *       - name: receiver
 *         description: user who will receive the message.
 *         required: true
 *         in: header
 *         type: object
 *       - name: text
 *         description: message text.
 *         required: true
 *         in: header
 *         type: string
 *      description: Post new message from one specific user to another        
 */
app.post('/messages', function (req, res) {

    var message = {
        id: data.messageIncrement++,
        text: req.body.text,
        sender: req.body.sender,
        receiver: req.body.receiver,
        seen: false
    };

    data.messages.push(message);

    var roomName = 'messages' + req.body.receiver.id + '-' + req.body.sender.id;
    var channelName = 'messages' + req.body.receiver.id;

    io.sockets.emit(roomName, {});
    io.sockets.emit(channelName, {});

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(message));
});

/**
 *  @swagger
 *  /messages:
 *    get:
 *      responses:
 *        200:
 *      protocol: http
 *      parameters:
 *       - name: pair1
 *         description: user who will receive the message.
 *         required: true
 *         in: query
 *         type: string
 *       - name: pair2
 *         description: user who will receive the message.
 *         required: true
 *         in: query
 *         type: string          
 *      description: Get the list of unread messages from specific user 
 */
app.get('/messages', function (req, res) {

    var pair1 = parseInt(req.query.pair1);
    var pair2 = parseInt(req.query.pair2);

    var messages = data.messages.filter(function (message) {

        if (!message.seen && (message.receiver.id === pair1) && message.sender.id == pair2) {
            message.seen = true;
            io.sockets.emit("seen" + pair2 + '-' + pair1, {});
            return message;
        }
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(messages));
});

/**
 *  @swagger
 *  /messageCounts:
 *    get:
 *      responses:
 *        200:
 *    protocol: http
 *    parameters:
 *       - name: user
 *         description: host user
 *         required: true
 *         in: header
 *         type: string
 *    description: Get the counts of unread messages per user
 */
app.get('/messageCounts', function (req, res) {
    var user = parseInt(req.query.user);
    var result = [];
    data.users.forEach(function (u) {
        if (u.id != user) {
            var messages = data.messages.filter(function (message) {
                return (!message.seen) && message.receiver.id == user && message.sender.id == u.id;
            });
            result.push({ id: u.id, count: messages.length })
        }
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
});

io.on('connection', function (socket) {
    console.log("CONNECT");
});

module.exports.server = app;
