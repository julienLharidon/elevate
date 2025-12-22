import keyring
from keyrings.cryptfile.cryptfile import EncryptedKeyring
import os

from PyQt6.QtWidgets import QInputDialog

_keyring = None

def get_password_from_user():
    dialog = QInputDialog()
    password, ok = dialog.getText(None, "Password", "Enter the password to unlock your keyring:")
    if ok:
        return password
    return None

def get_keyring():
    global _keyring
    if _keyring is None:
        _keyring = EncryptedKeyring()
        if hasattr(_keyring, 'keyring_key'):
            try:
                # This will fail if the keyring is locked
                _keyring.get_password("elevate", "test")
            except Exception:
                password = get_password_from_user()
                if password:
                    _keyring.keyring_key = password
                else:
                    # Handle case where user cancels password entry
                    return None
    return _keyring

def set_keyring(kr):
    global _keyring
    _keyring = kr

def save_strava_credentials(client_id, client_secret, refresh_token):
    """Saves Strava API credentials to the system's keychain."""
    kr = get_keyring()
    kr.set_password("elevate", "strava_client_id", client_id)
    kr.set_password("elevate", "strava_client_secret", client_secret)
    kr.set_password("elevate", "strava_refresh_token", refresh_token)

def load_strava_credentials():
    """Loads Strava API credentials from the system's keychain."""
    kr = get_keyring()
    client_id = kr.get_password("elevate", "strava_client_id")
    client_secret = kr.get_password("elevate", "strava_client_secret")
    refresh_token = kr.get_password("elevate", "strava_refresh_token")
    return client_id, client_secret, refresh_token
