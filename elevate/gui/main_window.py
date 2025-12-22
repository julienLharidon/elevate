from PyQt6.QtWidgets import QMainWindow, QWidget, QVBoxLayout
from PyQt6.QtGui import QAction
from elevate.gui.athlete_info import AthleteInfo
from elevate.gui.strava_credentials import StravaCredentialsDialog

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Elevate")
        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.layout = QVBoxLayout(self.central_widget)

        self.athlete_info = AthleteInfo()
        self.layout.addWidget(self.athlete_info)

        self._create_menus()

    def _create_menus(self):
        menu_bar = self.menuBar()
        settings_menu = menu_bar.addMenu("Settings")

        configure_strava_action = QAction("Configure Strava", self)
        configure_strava_action.triggered.connect(self.open_strava_credentials_dialog)
        settings_menu.addAction(configure_strava_action)

    def open_strava_credentials_dialog(self):
        dialog = StravaCredentialsDialog(self)
        dialog.exec()
