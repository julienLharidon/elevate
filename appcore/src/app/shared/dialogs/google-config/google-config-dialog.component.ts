import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoogleConfigService } from '../../services/google-drive/google-config.service';
import { GoogleServiceAccountCredentials } from '@elevate/shared/models/google-service-account-credentials.model';

@Component({
  selector: 'app-google-config-dialog',
  templateUrl: './google-config-dialog.component.html',
})
export class GoogleConfigDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GoogleConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GoogleServiceAccountCredentials,
    private configService: GoogleConfigService
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onBrowseClick(): void {
    this.configService.openFileDialog().then(filePath => {
      if (filePath) {
        this.data.keyFilePath = filePath;
      }
    });
  }
}
