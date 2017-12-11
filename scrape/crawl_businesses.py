import sys
import googlemaps
import json

a = [
 'lodging',
 'university',
 'restaurant',
 'park',
 'bank',
 'movie_theater',
 'food',
 'electronics_store',
 'bar',
 'museum',
 'point_of_interest',
 'establishment',
 'store',
 'place_of_worship',
 'atm'
 ]

client = googlemaps.Client('AIzaSyCdh5RdEECP7SE1AvSc_0g3BNO632t_Ghk')

for t in a:
    data = client.places_nearby(
        (54.729410, -1.881160),
        type=t,
        radius=40000,
        )['results']
    print(json.dumps([t, data]))
    sys.stdout.flush()
