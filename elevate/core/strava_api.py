import requests
from elevate.core.credentials import load_strava_credentials

STRAVA_API_BASE_URL = "https://www.strava.com/api/v3"

class StravaApiClient:
    def __init__(self):
        self.client_id, self.client_secret, self.refresh_token = load_strava_credentials()
        self.access_token = None
        self._refresh_access_token()

    def _refresh_access_token(self):
        response = requests.post(
            f"{STRAVA_API_BASE_URL}/oauth/token",
            params={
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "refresh_token": self.refresh_token,
                "grant_type": "refresh_token",
            },
        )
        response.raise_for_status()
        self.access_token = response.json()["access_token"]

    def get_athlete_activities(self, page=1, per_page=30, after=None):
        params = {"page": page, "per_page": per_page}
        if after:
            params["after"] = after

        headers = {"Authorization": f"Bearer {self.access_token}"}
        response = requests.get(
            f"{STRAVA_API_BASE_URL}/athlete/activities",
            headers=headers,
            params=params,
        )
        response.raise_for_status()
        return response.json()

    def get_activity_streams(self, activity_id, keys=None):
        if keys is None:
            keys = ["time", "distance", "latlng", "altitude", "velocity_smooth", "heartrate", "cadence", "watts", "temp", "grade_adjusted_distance"]

        headers = {"Authorization": f"Bearer {self.access_token}"}
        response = requests.get(
            f"{STRAVA_API_BASE_URL}/activities/{activity_id}/streams",
            headers=headers,
            params={"keys": ",".join(keys), "key_by_type": True},
        )
        response.raise_for_status()
        return response.json()
