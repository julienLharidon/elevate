import { LoggerService } from "../app/shared/services/logging/logger.service";
import { BuildTarget } from "@elevate/shared/enums/build-target.enum";

export const environment = {
  buildTarget: BuildTarget.MOBILE,
  production: false,
  logLevel: LoggerService.LEVEL_DEBUG,
  // Backup version threshold at which a "greater or equal" imported backup version is compatible with current code.
  minBackupVersion: "7.2.0",
  showDebugRibbon: true,
  showActivityDebugData: false,
  showRouteUrl: true,
  bypassProfileRestoreChecks: false,
  backendBaseUrl: "http://localhost:8081"
};
