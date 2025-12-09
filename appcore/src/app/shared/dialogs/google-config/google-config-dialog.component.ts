import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoogleServiceAccountCredentials } from '../../services/google-drive/google-config.service';

@Component({
  selector: 'app-google-config-dialog',
  templateUrl: './google-config-dialog.component.html',
})
export class GoogleConfigDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GoogleConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GoogleServiceAccountCredentials
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
