import utm
import json

with open('businesses.json') as fp:
    data = json.load(fp)
    for B in data:
        B['utm'] = list(utm.from_latlon(
            B['loc'][0],
            B['loc'][1],
            ))[:2]

print(json.dumps(data))
