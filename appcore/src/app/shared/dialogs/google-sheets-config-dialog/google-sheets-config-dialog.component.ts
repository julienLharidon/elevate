import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GoogleSheetsConfigDialogDataModel } from './google-sheets-config-dialog-data.model';
import { GoogleConfigIpcService } from '../../../services/google-config-ipc.service';

@Component({
  selector: 'app-google-sheets-config-dialog',
  templateUrl: './google-sheets-config-dialog.component.html',
  styleUrls: ['./google-sheets-config-dialog.component.scss']
})
export class GoogleSheetsConfigDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: GoogleSheetsConfigDialogDataModel,
    private readonly dialogRef: MatDialogRef<GoogleSheetsConfigDialogComponent>,
    private readonly googleConfigIpcService: GoogleConfigIpcService
  ) {
  }

  ngOnInit(): void {
  }

  public browse(): void {
    this.googleConfigIpcService.showOpenDialog().then(filePath => {
      if (filePath) {
        this.data.credentialsPath = filePath;
      }
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
