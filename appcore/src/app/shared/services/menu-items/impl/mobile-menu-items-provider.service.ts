import { Injectable } from "@angular/core";
import { MenuItemModel, MenuItemsProvider } from "../menu-items-provider.interface";
import { AppRoutes } from "../../../models/app-routes";

@Injectable()
export class MobileMenuItemsProvider implements MenuItemsProvider {
  public readonly mainMenuItems: MenuItemModel[] = [
    {
      icon: "smart_toy",
      routerLink: AppRoutes.aiCoach,
      routerLinkActive: true
    },
    {
      icon: "summarize",
      routerLink: AppRoutes.activities,
      routerLinkActive: true
    },
    {
      icon: "timeline",
      routerLink: AppRoutes.fitnessTrend,
      routerLinkActive: true
    },
    {
      icon: "date_range",
      routerLink: AppRoutes.yearProgressions,
      routerLinkActive: true
    },
    {
      icon: "portrait",
      routerLink: AppRoutes.athleteSettings,
      routerLinkActive: true
    },
    {
      icon: "format_line_spacing",
      routerLink: AppRoutes.zonesSettings,
      routerLinkActive: true
    }
  ];

  public getMenuItems(): MenuItemModel[] {
    return this.mainMenuItems;
  }
}
