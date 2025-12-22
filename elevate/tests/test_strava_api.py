import pytest
import requests_mock
from elevate.core.strava_api import StravaApiClient

@pytest.fixture
def mock_strava_credentials(mocker):
    mocker.patch(
        "elevate.core.strava_api.load_strava_credentials",
        return_value=("test_client_id", "test_client_secret", "test_refresh_token"),
    )

def test_strava_api_client(mock_strava_credentials, requests_mock):
    # Mock the token refresh response
    requests_mock.post(
        "https://www.strava.com/api/v3/oauth/token",
        json={"access_token": "test_access_token"},
    )

    client = StravaApiClient()

    # Mock the get_athlete_activities response
    requests_mock.get(
        "https://www.strava.com/api/v3/athlete/activities",
        json=[{"id": 123, "name": "Test Activity"}],
    )
    activities = client.get_athlete_activities()
    assert activities[0]["name"] == "Test Activity"

    # Mock the get_activity_streams response
    requests_mock.get(
        "https://www.strava.com/api/v3/activities/123/streams",
        json={"time": {"data": [1, 2, 3]}},
    )
    streams = client.get_activity_streams(123)
    assert streams["time"]["data"] == [1, 2, 3]
