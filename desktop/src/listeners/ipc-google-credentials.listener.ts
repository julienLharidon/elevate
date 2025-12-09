import { IpcTunnelService } from "@elevate/shared/electron/ipc-tunnel";
import { Channel } from "@elevate/shared/electron/channels.enum";
import { IpcListener } from "./ipc-listener.interface";
import Store from 'electron-store';
import { GoogleServiceAccountCredentials } from "../../../../appcore/src/app/shared/services/google-drive/google-config.service";

export class IpcGoogleCredentialsListener implements IpcListener {

    private store = new Store();

    public startListening(ipcTunnelService: IpcTunnelService): void {
        ipcTunnelService.on<void, GoogleServiceAccountCredentials>(Channel.GET_GOOGLE_CREDENTIALS, () => {
            return this.store.get('googleServiceAccountCredentials') as GoogleServiceAccountCredentials;
        });

        ipcTunnelService.on<GoogleServiceAccountCredentials, void>(Channel.SET_GOOGLE_CREDENTIALS, (credentials: GoogleServiceAccountCredentials) => {
            this.store.set('googleServiceAccountCredentials', credentials);
        });
    }
}
