import requests
from bs4 import BeautifulSoup
import csv
import json
import pprint
from apscheduler.schedulers.blocking import BlockingScheduler
import schedule
import time


sched = BlockingScheduler()

# download csv file of COVID-19 data 
confirmed = 'https://usafactsstatic.blob.core.windows.net/public/data/covid-19/covid_confirmed_usafacts.csv'
death = 'https://usafactsstatic.blob.core.windows.net/public/data/covid-19/covid_deaths_usafacts.csv'

# apscheduler library
# @sched.scheduled_job('interval', seconds=10)
def timed_job():
    r_confirmed = requests.get(confirmed, allow_redirects=True)
    open('confirmed.csv', 'wb').write(r_confirmed.content)

    r_death = requests.get(death, allow_redirects=True)
    open('death.csv', 'wb').write(r_death.content)

# sched.start()

# test for schedule library
# def tmp():
#     print('Hello World')
# ---------------------------------------------
# schedule.every().day.at("10:00").do(timed_job)
# while True:
#     schedule.run_pending()
#     time.sleep(1)


data_confirmed = dict()
data_death = dict()

def collectData():
    # read the latest data of COVID_19 confirmed cases in all counties
    with open('confirmed.csv') as csv_confirmed:
        next(csv_confirmed)
        for line in csv_confirmed.readlines():
            data = line.split(',')
            county = data[1]
            state = data[2]
            cases = data[len(data)-1].rstrip('\n')
            if (state not in data_confirmed):
                county_list = []
                county_list.append({county: cases})
                data_confirmed[state] = county_list
            else:
                county_list = data_confirmed[state]
                county_list.append({county: cases})

    # read the latest data of COVID_19 confirmed deaths in all counties
    with open('death.csv') as csv_death:
        next(csv_death)
        for line in csv_death.readlines():
            data = line.split(',')
            county = data[1]
            state = data[2]
            cases = data[len(data)-1].rstrip('\n')
            if (state not in data_death):
                county_list = []
                county_list.append({county: cases})
                data_death[state] = county_list
            else:
                county_list = data_death[state]
                county_list.append({county: cases})

timed_job()
collectData()
json_confirmed = json.dumps(data_confirmed)
json_confirmed = json.dumps(data_death)

with open('data_death.json', 'w') as outfile:
    json.dump(data_death, outfile)
with open('data_confirmed.json', 'w') as outfile:
    json.dump(data_confirmed, outfile)