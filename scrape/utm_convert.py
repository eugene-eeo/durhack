import utm
import json

data = {}

with open('centers.json') as fp:
    for line in fp:
        key, rows = json.loads(line.strip())
        for R in rows:
            R['utm'] = list(utm.from_latlon(
                R['geometry']['location']['lat'],
                R['geometry']['location']['lng'],
                ))[:2]
        data[key] = rows

print(json.dumps(data))
