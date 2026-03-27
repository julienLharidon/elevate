import { LoggerService } from "../app/shared/services/logging/logger.service";
import { BuildTarget } from "@elevate/shared/enums/build-target.enum";

export const environment = {
  buildTarget: BuildTarget.MOBILE,
  production: false,
  logLevel: LoggerService.LEVEL_DEBUG,
  minBackupVersion: "7.0.0-0",
  showDebugRibbon: true,
  showActivityDebugData: false,
  showRouteUrl: true,
  bypassProfileRestoreChecks: false,
  backendBaseUrl: null
};
