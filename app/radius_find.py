import json
import math


EMPTY   = json.load(open('../data/businesses.json'))
CENTERS = json.load(open('../data/centers.json'))


def dist(a, b):
    x0, y0 = a
    x1, y1 = b
    return (x0 - x1)**2 + (y0 - y1)**2


def within(houses, centers, r):
    """
    Yields the houses in *houses* such that each house is at
    least distance *r* away from any center in *centers*.
    """
    for j in houses:
        X = j['utm']
        if any(dist(X, Y['utm']) <= r*r for Y in centers):
            yield j


def all_within(houses, centersList, rList):
    H = iter(houses)
    for centers, r in zip(centersList, rList):
        H = within(H, centers, r)
    return list(H)


def best_approx(houses, centersList, rList, eps=0.01, k=1.15):
    while True:
        solution = all_within(houses, centersList, rList)
        if len(solution) != 0:
            return solution, rList
        rList = [(r + eps) * k for r in rList]


def find_empty(constraints):
    """
    Constraints: {type: radius}
    Returns solution and the (perturbed) constraints.
    """
    centersList = []
    rList = []

    for type, radius in constraints.items():
        centersList.append(CENTERS[type])
        rList.append(radius)

    solution, radii = best_approx(EMPTY, centersList, rList)
    return solution, {type: r for type, r in zip(constraints.keys(), radii)}
