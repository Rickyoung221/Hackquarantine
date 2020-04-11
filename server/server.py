import json
import pymongo
from pymongo import (MongoClient,)
from flask import Flask, render_template
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

world_cases = 0
usa_cases = 0



client = pymongo.MongoClient("mongodb+srv://Perry998:test@cluster0-bd2oz.mongodb.net/test?retryWrites=true&w=majority")
db = client.get_database("covid")
col = db.get_collection("population")
col_confirmed = db.get_collection("confirmed")
col_death = db.get_collection("death")

app = Flask(__name__)
CORS(app, resources=r'/*')
@app.route('/', methods=['GET'])    # testing
def index():
    world, usa = front()
    return json.dumps({'world': world, 'usa': usa})

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

def world():
    page = requests.get('https://www.worldometers.info/coronavirus/')
    soup = BeautifulSoup(page.text, 'html.parser')
    class_list = soup.find(class_ = 'maincounter-number')
    span_list= class_list.find('span')    
    for x in span_list:
        world_cases = x
        break
    return world_cases

def USA():
    page = requests.get('https://www.worldometers.info/coronavirus/')
    soup = BeautifulSoup(page.text, 'html.parser')
    table = soup.find('tbody')
    td_list = table.find('td', attrs={'style': 'font-weight: bold; text-align:right'})
    for x in td_list:
        usa_cases = x
        break
    return usa_cases

def front():
    world_cases = world()
    usa_cases = USA()
    return world_cases, usa_cases

if __name__ == '__main__':
    app.run()