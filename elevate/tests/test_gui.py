import pytest
from PyQt6.QtWidgets import QApplication
from elevate.gui.main_window import MainWindow
from elevate.gui.athlete_info import AthleteInfo

@pytest.fixture(scope="session")
def app():
    return QApplication([])

def test_main_window(app):
    window = MainWindow()
    assert window.windowTitle() == "Elevate"
    assert isinstance(window.athlete_info, AthleteInfo)

def test_athlete_info(app):
    widget = AthleteInfo()
    assert widget.name_label.text() == "John Doe"

def test_configure_strava_action(app, mocker):
    window = MainWindow()
    mock_dialog = mocker.patch("elevate.gui.main_window.StravaCredentialsDialog")

    # Find the "Configure Strava" action and trigger it
    for action in window.menuBar().actions():
        if action.text() == "Settings":
            for sub_action in action.menu().actions():
                if sub_action.text() == "Configure Strava":
                    sub_action.trigger()
                    break

    mock_dialog.assert_called_once()
