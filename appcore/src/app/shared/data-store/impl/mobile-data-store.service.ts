import { DataStore } from "../data-store";
import { LoggerService } from "../../services/logging/logger.service";
import { Inject, Injectable } from "@angular/core";
import { AppUsageDetails } from "../../models/app-usage-details.model";
import { AppUsage } from "../../models/app-usage.model";
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Capacitor } from "@capacitor/core";

@Injectable()
export class MobileDataStore<T extends {}> extends DataStore<T> {
  private sqlite: SQLiteConnection;
  private db_sqlite: SQLiteDBConnection;

  constructor(
    @Inject(LoggerService) protected readonly logger: LoggerService
  ) {
    super(logger);
    if (Capacitor.isNativePlatform()) {
      this.sqlite = new SQLiteConnection(CapacitorSQLite);
    }
  }

  public getPersistenceAdapter(): LokiPersistenceAdapter {
    const self = this;
    return {
      loadDatabase(dbname: string, callback: (data: any) => void): void {
        if (!Capacitor.isNativePlatform()) {
          callback(localStorage.getItem(dbname));
          return;
        }

        self.sqlite.createConnection(dbname, false, "no-encryption", 1, false)
          .then(connection => {
            self.db_sqlite = connection;
            return self.db_sqlite.open();
          })
          .then(() => {
            return self.db_sqlite.execute(`CREATE TABLE IF NOT EXISTS lokijs (name TEXT PRIMARY KEY, data TEXT)`);
          })
          .then(() => {
            return self.db_sqlite.query(`SELECT data FROM lokijs WHERE name = ?`, [dbname]);
          })
          .then(res => {
            if (res.values && res.values.length > 0) {
              callback(res.values[0].data);
            } else {
              callback(null);
            }
          })
          .catch(err => {
            self.logger.error("Error loading database from SQLite", err);
            callback(new Error(err));
          });
      },
      saveDatabase(dbname: string, dbstring: string, callback: (err: Error | null) => void): void {
        if (!Capacitor.isNativePlatform()) {
          localStorage.setItem(dbname, dbstring);
          callback(null);
          return;
        }

        self.db_sqlite.run(`INSERT OR REPLACE INTO lokijs (name, data) VALUES (?, ?)`, [dbname, dbstring])
          .then(() => callback(null))
          .catch(err => {
            self.logger.error("Error saving database to SQLite", err);
            callback(new Error(err));
          });
      }
    };
  }

  public getAppUsageDetails(): Promise<AppUsageDetails> {
    if (navigator.storage && navigator.storage.estimate) {
      return navigator.storage.estimate().then((storageEstimate: StorageEstimate) => {
        const appUsage = new AppUsage(storageEstimate.usage, storageEstimate.quota);
        const megaBytesInUse = appUsage.bytesInUse / (1024 * 1024);
        const megaBytesQuota = appUsage.quotaBytes / (1024 * 1024);
        const percentUsage = (appUsage.bytesInUse / appUsage.quotaBytes) * 100;
        const appUsageDetails = new AppUsageDetails(appUsage, megaBytesInUse, megaBytesQuota, percentUsage);
        return Promise.resolve(appUsageDetails);
      });
    }
    return Promise.resolve(new AppUsageDetails(new AppUsage(0, 0), 0, 0, 0));
  }
}
