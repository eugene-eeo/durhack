import json
import math


def within(houses, centres, r):
    found = 0
    available = []
    adjacent = {}
    for j in houses:
        ok = False
        for k in centres:
            x0, y0 = k['utm']
            x1, y1 = j['utm']
            distance = (x0-x1)**2 + (y0-y1)**2
            if distance <= r*r:
                adjacent[k['id']] = k
                ok = True
        if ok:
            available.append(j)
    return available, adjacent


def best_within(houses, centresList, rList):
    adj = {}
    for i, (centers, r) in enumerate(zip(centresList, rList)):
        houses, adjacent = within(houses, centers, r)
        if len(houses) == 0:
            return (houses, i)
        adj.update(adjacent)
    return (houses, adj, i)


def best_approx(houses, centresList, rList):
    while True:
        solution, adjacent, cons = best_within(houses, centresList, rList)
        if len(solution) != 0:
            return solution, adjacent, rList
        rList[cons] *= 1.25


def find_empty(constraints):
    empty   = json.load(open('businesses.json'))
    centers = json.load(open('centers.json'))

    centersList = []
    rList = []

    for type, radius in constraints:
        centersList.append(centers[type])
        rList.append(radius)

    sol, adjacent, radii = best_approx(empty, centersList, rList)
    return {
        "solution": sol,
        "adjacent": list(adjacent.values()),
        "radii": {constraints[i][0]: radii[i] for i in range(len(constraints))},
    };
