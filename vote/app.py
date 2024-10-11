from flask import Flask, render_template, request, make_response, g
from redis import Redis
import os
import socket
import random
import json
import logging

# Set option names for "Mountains" and "Beaches"
option_a = os.getenv('OPTION_A', "Mountains")
option_b = os.getenv('OPTION_B', "Beaches")
hostname = socket.gethostname()

app = Flask(__name__)

# Set up logging
gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.INFO)

# Connect to Redis
def get_redis():
    if not hasattr(g, 'redis'):
        g.redis = Redis(host="redis", db=0, socket_timeout=5)
    return g.redis

@app.route("/", methods=['POST', 'GET'])
def hello():
    redis = get_redis()
    voter_id = request.cookies.get('voter_id')
    
    # Generate a unique voter ID if it doesn't exist
    if not voter_id:
        voter_id = hex(random.getrandbits(64))[2:-1]

    vote = None

    # Handle form submission (voting)
    if request.method == 'POST':
        vote = request.form['vote']
        app.logger.info('Received vote for %s', vote)
        
        # Store the vote in Redis and increment the vote count for the option
        if vote == 'a':
            redis.incr('votes_mountains')
        elif vote == 'b':
            redis.incr('votes_beaches')
        
        # Log the vote (can be used for logging or analytics)
        data = json.dumps({'voter_id': voter_id, 'vote': vote})
        redis.rpush('votes', data)

    # Retrieve current vote counts from Redis
    votes_mountains = redis.get('votes_mountains') or 0
    votes_beaches = redis.get('votes_beaches') or 0

    # Convert to integers (Redis stores as bytes)
    votes_mountains = int(votes_mountains)
    votes_beaches = int(votes_beaches)

    # Render the page with current vote counts and voter choice
    resp = make_response(render_template(
        'index.html',
        option_a=option_a,
        option_b=option_b,
        hostname=hostname,
        vote=vote,
        votes_cats=votes_mountains,  # update key to votes_mountains
        votes_dogs=votes_beaches      # update key to votes_beaches
    ))
    
    # Set the voter ID in a cookie for future reference
    resp.set_cookie('voter_id', voter_id)
    return resp

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True, threaded=True)

