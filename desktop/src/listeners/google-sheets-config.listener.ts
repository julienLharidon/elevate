import { IpcMainTunnelService } from '../ipc-main-tunnel.service';
import { IpcTunnelService } from '@elevate/shared/electron/ipc-tunnel';
import { Channel } from '@elevate/shared/electron/channels.enum';
import { GoogleSheetsConfigDialogDataModel } from '../../../appcore/src/app/shared/dialogs/google-sheets-config-dialog/google-sheets-config-dialog-data.model';
import Store from 'electron-store';

export class GoogleSheetsConfigListener {
  private readonly store = new Store();

  constructor(private readonly ipcMainTunnelService: IpcMainTunnelService) {}

  public startListening(ipcTunnelService: IpcTunnelService): void {
    ipcTunnelService.on(Channel.getGoogleSheetsConfig, () => this.getConfig());
    ipcTunnelService.on(Channel.setGoogleSheetsConfig, (config: GoogleSheetsConfigDialogDataModel) => this.setConfig(config));
  }

  private getConfig(): GoogleSheetsConfigDialogDataModel {
    const spreadsheetId = this.store.get('googleSheets.spreadsheetId') as string;
    const sheetName = this.store.get('googleSheets.sheetName') as string;
    const credentialsPath = this.store.get('googleSheets.credentialsPath') as string;
    return new GoogleSheetsConfigDialogDataModel(spreadsheetId, sheetName, credentialsPath);
  }

  private setConfig(config: GoogleSheetsConfigDialogDataModel): void {
    this.store.set('googleSheets.spreadsheetId', config.spreadsheetId);
    this.store.set('googleSheets.sheetName', config.sheetName);
    this.store.set('googleSheets.credentialsPath', config.credentialsPath);
  }
}
