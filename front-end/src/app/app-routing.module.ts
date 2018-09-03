import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { AdminComponent } from './admin/admin.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component'; 

const routes: Routes = [
 { path: 'home', component: HomeComponent },
 { path: 'chat', component: ChatComponent },
 { path: 'admin', component: AdminComponent },
 { path: 'logout', component: LogoutComponent },
 { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
