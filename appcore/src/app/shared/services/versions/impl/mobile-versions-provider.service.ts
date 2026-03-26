import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { VersionsProvider } from "../versions-provider";
import { MatDialog } from "@angular/material/dialog";
import { GhRelease } from "@elevate/shared/models/updates/gh-release.model";
import { Platform } from "@elevate/shared/enums/platform.enum";
import { Capacitor } from "@capacitor/core";

@Injectable()
export class MobileVersionsProvider extends VersionsProvider {
  constructor(
    @Inject(HttpClient) public readonly httpClient: HttpClient,
    @Inject(MatDialog) protected readonly dialog: MatDialog
  ) {
    super(httpClient, dialog);
  }

  public getGithubReleases(acceptPreReleases: boolean = false): Promise<GhRelease[]> {
    return this.httpClient.get<GhRelease[]>(VersionsProvider.getGithubReleasesApiEndpoint("https://github.com/thomaschampagne/elevate")).toPromise()
      .then(releases => releases.filter(r => acceptPreReleases || !r.prerelease));
  }

  public getBuildMetadata(): Promise<{ commit: string; date: string }> {
    return Promise.resolve({ commit: "unknown", date: new Date().toISOString() });
  }

  public getPlatform(): Platform {
    const platform = Capacitor.getPlatform();
    if (platform === "android") return Platform.ANDROID;
    if (platform === "ios") return Platform.IOS;
    return Platform.WINDOWS;
  }

  public getWrapperVersion(): string {
    return "Capacitor " + Capacitor.getPlatform();
  }
}
