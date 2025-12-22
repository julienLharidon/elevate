from PyQt6.QtWidgets import QWidget, QLabel, QVBoxLayout
from elevate.core.database import SessionLocal
from elevate.core.schemas import AthleteModel

class AthleteInfo(QWidget):
    def __init__(self):
        super().__init__()
        self.layout = QVBoxLayout(self)
        self.name_label = QLabel()
        self.layout.addWidget(self.name_label)
        self.load_athlete()

    def load_athlete(self):
        db = SessionLocal()
        athlete = db.query(AthleteModel).first()
        db.close()
        if athlete:
            self.name_label.setText(f"{athlete.first_name} {athlete.last_name}")
        else:
            self.name_label.setText("No athlete found.")
