import { Inject, Injectable } from "@angular/core";
import { AppLoadService } from "../app-load.service";
import { DataStore, DbEvent } from "../../shared/data-store/data-store";

@Injectable()
export class MobileLoadService extends AppLoadService {
  constructor(
    @Inject(DataStore) protected readonly dataStore: DataStore<object>
  ) {
    super(dataStore);
  }

  public loadApp(): Promise<void> {
    const platform = (window as any).Capacitor?.getPlatform();
    if (platform !== "android" && platform !== "ios") {
        setTimeout(() => this.dataStore.dbEvent$.next(DbEvent.LOADED), 1000);
    }
    return super.loadApp();
  }
}
