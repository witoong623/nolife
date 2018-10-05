import { Injectable } from "@angular/core";
import { AppDbProvider } from "./app-db/app-db";
import { Homework } from "../models/models";

declare var cordova;

@Injectable()
export class AppNotificationProvider {
  constructor(private appDb: AppDbProvider) {

  }

  async deleteHomeworkNotification(homework: Homework): Promise<void> {
    let homeworkNoti = await this.appDb.getHomeworkNotification(homework);

    cordova.plugins.notification.local.cancel(homeworkNoti.id, function() {
      console.log(`clear notification id ${homeworkNoti.id} done`);
    });
  }
}