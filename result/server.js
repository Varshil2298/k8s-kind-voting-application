var express = require('express'),
    async = require('async'),
    { Pool } = require('pg'),
    cookieParser = require('cookie-parser'),
    path = require('path'),  // Add path for serving index.html
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

var port = process.env.PORT || 4000;

io.on('connection', function (socket) {
  socket.emit('message', { text: 'Welcome!' });

  socket.on('subscribe', function (data) {
    socket.join(data.channel);
  });
});

var pool = new Pool({
  connectionString: 'postgres://postgres:postgres@db/postgres'
});

async.retry(
  { times: 1000, interval: 1000 },
  function (callback) {
    pool.connect(function (err, client, done) {
      if (err) {
        console.error("Waiting for db");
      }
      callback(err, client);
    });
  },
  function (err, client) {
    if (err) {
      return console.error("Giving up");
    }
    console.log("Connected to db");
    getVotes(client);
  }
);

function getVotes(client) {
  // Query to get votes for all options (including new pairs like a2, b2)
  client.query('SELECT vote, COUNT(id) AS count FROM votes GROUP BY vote', [], function (err, result) {
    if (err) {
      console.error("Error performing query: " + err);
    } else {
      var votes = collectVotesFromResult(result);
      io.sockets.emit("scores", JSON.stringify(votes));
    }

    setTimeout(function () { getVotes(client); }, 1000);
  });
}

function collectVotesFromResult(result) {
  // Initialize all pairs (extendable as per your HTML)
  var votes = {
    a: 0, b: 0,  // For first pair
    a2: 0, b2: 0,  // For second pair
    a3: 0, b3: 0,  // For third pair
    a4: 0, b4: 0   // For fourth pair
  };

  // Collect votes from the result and map them to correct pair
  result.rows.forEach(function (row) {
    if (votes.hasOwnProperty(row.vote)) {
      votes[row.vote] = parseInt(row.count);
    }
  });

  return votes;
}

app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/views/index.html'));  // Use path.resolve to correctly serve index.html
});

server.listen(port, function () {
  var port = server.address().port;
  console.log('App running on port ' + port);
});
