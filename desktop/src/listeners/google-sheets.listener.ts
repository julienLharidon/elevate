import { ipcMain, IpcMainEvent } from 'electron';
import { google } from 'googleapis';
import { IpcMainTunnelService } from '../ipc-main-tunnel.service';
import * as fs from 'fs';
import { IGoogleSheetsUploadData } from '../../../appcore/modules/shared/models/google-sheets.model';
import { IpcTunnelService } from '@elevate/shared/electron/ipc-tunnel';
import { Channel } from '@elevate/shared/electron/channels.enum';
import Store from 'electron-store';

export class GoogleSheetsListener {
  constructor(private readonly ipcMainTunnelService: IpcMainTunnelService) {}

  public startListening(ipcTunnelService: IpcTunnelService): void {
    ipcTunnelService.on(Channel.uploadGoogleSheets, (data: IGoogleSheetsUploadData) => this.uploadDataToGoogleSheets(data));
  }

  private async uploadDataToGoogleSheets(data: IGoogleSheetsUploadData): Promise<void> {
    const store = new Store();
    const credentialsPath = store.get('googleSheets.credentialsPath') as string;
    if (!credentialsPath) {
      throw new Error('Credentials path not configured');
    }
    try {
      const credentials = JSON.parse(fs.readFileSync(credentialsPath).toString());
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      const sheets = google.sheets({ version: 'v4', auth });
      await sheets.spreadsheets.values.append({
        spreadsheetId: data.spreadsheetId,
        range: data.sheetName,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: data.data
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
