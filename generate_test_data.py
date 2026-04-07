import json
import random
import time
from datetime import datetime, timedelta

def generate_activities():
    activities = []
    base_date = datetime.now() - timedelta(days=45)

    athlete = {
        "age": 40,
        "vo2max": 56,
        "ftp": 240,
        "weight": 69
    }

    # 9 Pool Swims (25m)
    for i in range(9):
        day_offset = i * 4
        start_time = base_date + timedelta(days=day_offset, hours=7)
        activities.append({
            "id": 1000 + i,
            "name": f"Pool Swim {i+1}",
            "type": "Swim",
            "startTime": int(start_time.timestamp() * 1000),
            "distance": 2500.0,
            "movingTime": 3000,
            "elapsedTime": 3600,
            "averageHeartRate": 140.0 + random.uniform(-5, 5),
            "isPool": True,
            "poolLength": 25
        })

    # 1 Open Water Swim
    start_time = base_date + timedelta(days=38, hours=10)
    activities.append({
        "id": 1009,
        "name": "Open Water Swim",
        "type": "Swim",
        "startTime": int(start_time.timestamp() * 1000),
        "distance": 1500.0,
        "movingTime": 1800,
        "elapsedTime": 1900,
        "averageHeartRate": 150.0,
        "isPool": False
    })

    # 10 Runs
    for i in range(10):
        day_offset = i * 4 + 1
        start_time = base_date + timedelta(days=day_offset, hours=18)
        dist = 10000.0 + random.uniform(-1000, 3000)
        dur = dist / (3.33 + random.uniform(-0.2, 0.5)) # around 12km/h
        activities.append({
            "id": 2000 + i,
            "name": f"Run {i+1}",
            "type": "Run",
            "startTime": int(start_time.timestamp() * 1000),
            "distance": dist,
            "movingTime": int(dur),
            "elapsedTime": int(dur + 100),
            "averageHeartRate": 155.0 + random.uniform(-10, 10),
            "averageSpeed": dist/dur
        })

    # 10 Bike Rides
    for i in range(10):
        day_offset = i * 4 + 2
        start_time = base_date + timedelta(days=day_offset, hours=9)
        dist = 40000.0 + random.uniform(-5000, 20000)
        dur = dist / (8.0 + random.uniform(-1, 2)) # around 30km/h
        power = 180.0 + random.uniform(-20, 60)
        activities.append({
            "id": 3000 + i,
            "name": f"Ride {i+1}",
            "type": "Ride",
            "startTime": int(start_time.timestamp() * 1000),
            "distance": dist,
            "movingTime": int(dur),
            "elapsedTime": int(dur + 300),
            "averageHeartRate": 145.0 + random.uniform(-10, 15),
            "averagePower": power
        })

    with open('V2/app/src/test/resources/test_data/activities.json', 'w') as f:
        json.dump(activities, f, indent=2)

if __name__ == "__main__":
    generate_activities()
