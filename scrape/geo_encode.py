import sys
import json
import csv
from geopy.geocoders import ArcGIS

with open('empty.csv') as fp:
    next(fp)
    reader = csv.reader(fp)
    geolocator = ArcGIS()
    for i, row in enumerate(reader, 1):
        print(i, file=sys.stderr)
        ref, desc, addr1, addr2, addr3, addr4, addr5, postcode, _ = row
        addrs = [addr1, addr2, addr3, addr4, addr5]
        address = ', '.join(a for a in addrs if a)
        loc = geolocator.geocode(address)
        if not loc:
            continue
        print(json.dumps({
            "ref":      ref,
            "desc":     desc,
            "loc":      [loc.latitude, loc.longitude],
            "raw":      loc.raw,
            "address":  address,
            "postcode": postcode,
            }))
