import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BstWidgetsModule } from 'bst-widgets';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BstWidgetsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
