import json
# Convert levels.json

data = [['.' for x in range(0,165)] for y in range(0,40)]
with open("levels.json", "r") as f:
    j = json.loads(f.read())

#for i in range(0, len(j["walls"])):
#    p = j['walls'][i]
#    for x in range(p[0],p[0]+p[2]):
#        for y in range(p[1],p[1]+p[3]):
#            data[y][x] = "W"

for i in range(0, len(j["platforms"])):
    p = j['platforms'][i]
    for x in range(p[0],p[0]+p[2]):
        for y in range(p[1],p[1]+p[3]):
            data[y][x] = "#"

for i in range(0, len(j["firepits"])):
    p = j['firepits'][i]
    for x in range(p[0],p[0]+p[2]):
        for y in range(p[1],p[1]+p[3]):
            print(y,x)
            data[y][x] = "|"

for i in range(0, len(j["coins"])):
    p = j['coins'][i]
    for x in range(p[0],p[0]+p[2]):
        for y in range(p[1],p[1]+p[3]):
            data[y][x] = "o"

for y in range(len(data)):
    print("".join(data[y]))

