from flask import Flask, render_template, request, jsonify
from radius_find import find_empty

TYPES = {
    'Electronics Store': 'electronics_store',
    'ATM':               'atm',
    'Place of Worship':  'place_of_worship',
    'Bar':               'bar',
    'Landmark':          'point_of_interest',
    'Banks':             'bank',
    'Lodging':           'lodging',
    'Food':              'food',
    'Stores':            'store',
    'Establishments':    'establishment',
    'Restaurant':        'restaurant',
    'Theatres':          'movie_theater',
    'Museums':           'museum',
    'Park':              'park',
    'University':        'university',
}

app = Flask(__name__)


@app.route('/')
def main():
    return render_template('main.html')

@app.route('/query')
def data():
    r = request.args
    return jsonify(find_empty([(k, float(r[k])) for k in r]))


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
