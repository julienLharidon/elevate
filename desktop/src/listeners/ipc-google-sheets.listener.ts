import { IpcTunnelService } from "@elevate/shared/electron/ipc-tunnel";
import { Channel } from "@elevate/shared/electron/channels.enum";
import { IpcListener } from "./ipc-listener.interface";
import Store from 'electron-store';
import { google } from 'googleapis';
import { GoogleServiceAccountCredentials } from "@elevate/shared/models/google-service-account-credentials.model";
import { Activity } from "@elevate/shared/models/sync/activity.model";

export class IpcGoogleSheetsListener implements IpcListener {

    private store = new Store();

    public startListening(ipcTunnelService: IpcTunnelService): void {
        ipcTunnelService.on<Activity[], void>(Channel.UPLOAD_TO_GOOGLE_SHEETS, async (activities: Activity[]) => {
            if (!activities || activities.length === 0) {
                return;
            }

            const credentials = this.store.get('googleServiceAccountCredentials') as GoogleServiceAccountCredentials;
            if (!credentials || !credentials.keyFilePath || !credentials.sheetId) {
                return Promise.reject('Google Sheets credentials not configured.');
            }

            const auth = new google.auth.GoogleAuth({
                keyFile: credentials.keyFilePath,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            const sheets = google.sheets({ version: 'v4', auth });

            const header = [...new Set(activities.flatMap(activity => Object.keys(activity)))];
            const values = activities.map(activity => header.map(key => activity[key]));
            const resource = {
                values: [header, ...values],
            };

            try {
                await sheets.spreadsheets.values.clear({
                    spreadsheetId: credentials.sheetId,
                    range: 'A1:ZZ',
                });

                await sheets.spreadsheets.values.update({
                    spreadsheetId: credentials.sheetId,
                    range: 'A1',
                    valueInputOption: 'RAW',
                    requestBody: resource,
                });
            } catch (err) {
                console.error(err);
                return Promise.reject(err);
            }
        });
    }
}
