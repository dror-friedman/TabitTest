import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DemoComponent } from './demo/demo.component';

export const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: 'demo', component: DemoComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
