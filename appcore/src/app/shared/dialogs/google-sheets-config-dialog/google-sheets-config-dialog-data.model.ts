export class GoogleSheetsConfigDialogDataModel {
  constructor(
    public spreadsheetId: string,
    public sheetName: string,
    public credentialsPath: string
  ) {
  }
}
