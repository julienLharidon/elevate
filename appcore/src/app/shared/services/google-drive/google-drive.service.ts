import { Injectable, Inject } from '@angular/core';
import { DesktopActivityService } from '../activity/impl/desktop-activity.service';
import { GoogleConfigService } from './google-config.service';
import { MatDialog } from '@angular/material/dialog';
import { GoogleConfigDialogComponent } from '../../dialogs/google-config/google-config-dialog.component';
import { IpcTunnelService } from '@elevate/shared/electron/ipc-tunnel';
import { IPC_TUNNEL_SERVICE } from '../../../desktop/ipc/ipc-tunnel-service.token';
import { IpcMessage } from '@elevate/shared/electron/ipc-message';
import { Channel } from '@elevate/shared/electron/channels.enum';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {

  constructor(
    @Inject(DesktopActivityService) protected readonly activityService: DesktopActivityService,
    @Inject(GoogleConfigService) protected readonly configService: GoogleConfigService,
    @Inject(MatDialog) protected readonly dialog: MatDialog,
    @Inject(IPC_TUNNEL_SERVICE) private ipcTunnelService: IpcTunnelService,
    @Inject(MatSnackBar) protected readonly snackBar: MatSnackBar
  ) {}

  public async uploadActivities(): Promise<void> {
    const credentials = await this.configService.getCredentials();
    if (!credentials || !credentials.keyFilePath || !credentials.sheetId) {
      const dialogRef = this.dialog.open(GoogleConfigDialogComponent, {
        width: '400px',
        data: { keyFilePath: '', sheetId: '' }
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (result) {
        await this.configService.saveCredentials(result);
        return this.uploadActivities();
      } else {
        return;
      }
    }

    const activities = await this.activityService.find();

    const message = new IpcMessage(Channel.UPLOAD_TO_GOOGLE_SHEETS, activities);
    this.ipcTunnelService.send<IpcMessage, void>(message).then(() => {
        this.snackBar.open('Successfully uploaded to Google Sheets!', 'Close');
    }).catch((err) => {
        this.snackBar.open('Error uploading to Google Sheets. Check console for details.', 'Close');
        console.error(err);
    });
  }
}
