import { Injectable, Inject } from '@angular/core';
import { IpcTunnelService } from '@elevate/shared/electron/ipc-tunnel';
import { IpcMessage } from '@elevate/shared/electron/ipc-message';
import { Channel } from '@elevate/shared/electron/channels.enum';
import { IPC_TUNNEL_SERVICE } from '../../../desktop/ipc/ipc-tunnel-service.token';
import { GoogleServiceAccountCredentials } from '@elevate/shared/models/google-service-account-credentials.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleConfigService {

  constructor(@Inject(IPC_TUNNEL_SERVICE) private ipcTunnelService: IpcTunnelService) { }

  public getCredentials(): Promise<GoogleServiceAccountCredentials> {
    const message = new IpcMessage(Channel.GET_GOOGLE_CREDENTIALS);
    return this.ipcTunnelService.send<IpcMessage, GoogleServiceAccountCredentials>(message);
  }

  public saveCredentials(credentials: GoogleServiceAccountCredentials): Promise<void> {
    const message = new IpcMessage(Channel.SET_GOOGLE_CREDENTIALS, credentials);
    return this.ipcTunnelService.send<IpcMessage, void>(message);
  }

  public openFileDialog(): Promise<string> {
    const message = new IpcMessage(Channel.OPEN_FILE_DIALOG);
    return this.ipcTunnelService.send<IpcMessage, string>(message);
  }
}
