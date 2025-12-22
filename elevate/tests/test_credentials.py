import pytest
from keyring.backends.null import Keyring as NullKeyring
from elevate.core import credentials

def setup_function():
    credentials.set_keyring(NullKeyring())

def test_save_and_load_strava_credentials(mocker):
    client_id = "test_client_id"
    client_secret = "test_client_secret"
    refresh_token = "test_refresh_token"

    mocker.patch.object(credentials.get_keyring(), "set_password")
    mocker.patch.object(credentials.get_keyring(), "get_password", side_effect=[client_id, client_secret, refresh_token])

    credentials.save_strava_credentials(client_id, client_secret, refresh_token)
    loaded_client_id, loaded_client_secret, loaded_refresh_token = credentials.load_strava_credentials()

    assert loaded_client_id == client_id
    assert loaded_client_secret == client_secret
    assert loaded_refresh_token == refresh_token
