import { Routes } from '@angular/router';
import { AnimalsComponent } from './pages/animals/animals.component';
import { NewsComponent } from './pages/news/news.component';
import { AnimalDetailComponent } from './pages/animal-detail/animal-detail.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AdoptionRequestsComponent } from './pages/adoption-requests/adoption-requests.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { MeetingsComponent } from './pages/meetings/meetings.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'news', pathMatch: 'full' },
    { path: 'animals', component: AnimalsComponent },
    { path: 'news', component: NewsComponent},
    { path: 'animals/:id', component: AnimalDetailComponent },
    { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard]  },
    { path : 'my-adoptions', component: AdoptionRequestsComponent, canActivate: [AuthGuard] },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminGuard] 
      },
      { path: 'meetings', 
        component: MeetingsComponent, 
        canActivate: [AuthGuard] 
      },
    { path : '**', redirectTo: 'news' }
];
