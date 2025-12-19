import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GoogleSheetsConfigDialogComponent } from '../shared/dialogs/google-sheets-config-dialog/google-sheets-config-dialog.component';
import { GoogleSheetsConfigDialogDataModel } from '../shared/dialogs/google-sheets-config-dialog/google-sheets-config-dialog-data.model';
import { GoogleConfigIpcService } from './google-config-ipc.service';
import { IGoogleSheetsUploadData } from '@elevate/shared/models/google-sheets.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleConfigService {

  constructor(
    private readonly dialog: MatDialog,
    private readonly googleConfigIpcService: GoogleConfigIpcService
  ) {
  }

  public openConfigDialog(): Promise<void> {
    return this.googleConfigIpcService.getConfig().then(config => {
      const dialogRef = this.dialog.open(GoogleSheetsConfigDialogComponent, {
        data: new GoogleSheetsConfigDialogDataModel(
          config.spreadsheetId,
          config.sheetName,
          config.credentialsPath
        )
      });

      return dialogRef.afterClosed().toPromise().then(result => {
        if (result) {
          return this.googleConfigIpcService.setConfig(result);
        }
      });
    });
  }

  public uploadData(data: IGoogleSheetsUploadData): Promise<void> {
    return this.googleConfigIpcService.uploadData(data);
  }

  public getConfig(): Promise<GoogleSheetsConfigDialogDataModel> {
    return this.googleConfigIpcService.getConfig();
  }
}
