import csv
import json
FILENAME = "census.csv"

data = {}
with open (FILENAME, encoding='latin-1') as f:
    try:
        for row in csv.reader(f):
            if not (row[0] in data.keys()):
                data[row[0]] = [{row[1] : int(row[2])}]
            else:
                data[row[0]].append({row[1] : int(row[2])})
    except csv.Error as e:
        sys.exit('file {}, line {}: {}'.format(filename, reader.line_num, e))

with open("census.json", 'w') as output:
    json.dump(data, output, indent=4)
            

        
            
        
