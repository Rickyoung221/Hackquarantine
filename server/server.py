import json
import pymongo
from pymongo import (MongoClient,)
from flask import Flask, render_template

client = pymongo.MongoClient("mongodb+srv://Perry998:test@cluster0-bd2oz.mongodb.net/test?retryWrites=true&w=majority")
db = client.get_database("covid")
col = db.get_collection("population")
col_confirmed = db.get_collection("confirmed")
col_death = db.get_collection("death")

app = Flask(__name__)

@app.route('/', methods=['GET'])    # testing
def index():
    data = col.find_one({"state": "Alabama", "county": "Alabama"})
    return render_template('index.html', data = data)

@app.route('/<state>/<county>', methods=['GET'])    # get confirmed and death cases of covid-19 for each county
def getData(state, county):
    data = {"death": "", "confirmed": ""}
    data_death = col_death.find({"state": state, "county": county}, {"_id": 0, "state": 0, "county": 0})
    data_confirmed = col_confirmed.find({"state": state, "county": county}, {"_id": 0, "state": 0, "county": 0})
    for d in data_death:
        data["death"] = int(d["death"])
    for c in data_confirmed:
        data["confirmed"] = int(c["confirmed"])
    return render_template('index.html', data = data)



if __name__ == '__main__':
    app.run()