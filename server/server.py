import pymongo
from pymongo import (MongoClient,)
from flask import Flask, render_template

client = pymongo.MongoClient("mongodb+srv://Perry998:test@cluster0-bd2oz.mongodb.net/test?retryWrites=true&w=majority")
db = client.get_database("covid")
col = db.get_collection("population")

app = Flask(__name__)

@app.route('/', methods=['GET'])	# testing
def index():
	data = col.find_one({"state": "Alabama", "county": "Alabama"})
	return render_template('index.html', data = data)

if __name__ == '__main__':
	app.run()