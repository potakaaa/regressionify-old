from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route("/api/users", methods=['GET'])

def users():
    return jsonify(
        {
            "users": [
                f'jesreal{generateRandom(100)}',
                f'lustre{generateRandom(100)}',
                f'dolar{generateRandom(100)}'
            ]
        }
    )

def generateRandom(range):
    return random.randint(0, range)

#print((generateRandom(100)))

if __name__ == '__main__':
    app.run(debug=True, port=8080)