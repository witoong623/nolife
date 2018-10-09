import { IonicPageModule } from "ionic-angular";
import { HomePage } from "./home";
import { NgModule } from "@angular/core";
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
      IonicPageModule.forChild(HomePage),
      SuperTabsModule
    ],
  })
export class HomePageModule {}