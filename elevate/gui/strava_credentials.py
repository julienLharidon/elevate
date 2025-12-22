from PyQt6.QtWidgets import QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout, QDialog
from elevate.core import credentials

class StravaCredentialsDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Strava Credentials")
        self.layout = QVBoxLayout(self)

        self.client_id_label = QLabel("Client ID:")
        self.client_id_input = QLineEdit()
        self.layout.addWidget(self.client_id_label)
        self.layout.addWidget(self.client_id_input)

        self.client_secret_label = QLabel("Client Secret:")
        self.client_secret_input = QLineEdit()
        self.client_secret_input.setEchoMode(QLineEdit.EchoMode.Password)
        self.layout.addWidget(self.client_secret_label)
        self.layout.addWidget(self.client_secret_input)

        self.refresh_token_label = QLabel("Refresh Token:")
        self.refresh_token_input = QLineEdit()
        self.layout.addWidget(self.refresh_token_label)
        self.layout.addWidget(self.refresh_token_input)

        self.save_button = QPushButton("Save")
        self.save_button.clicked.connect(self.save_credentials)
        self.layout.addWidget(self.save_button)

    def save_credentials(self):
        client_id = self.client_id_input.text()
        client_secret = self.client_secret_input.text()
        refresh_token = self.refresh_token_input.text()

        credentials.save_strava_credentials(client_id, client_secret, refresh_token)
        self.accept()
