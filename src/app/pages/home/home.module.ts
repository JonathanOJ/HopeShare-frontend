import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './components/home.component';
import { PesquisaCampanhaListComponent } from './components/pesquisa/pesquisa-campanha-list.component';
import { CampanhaCardComponent } from './components/pesquisa/components/campanha-card/campanha-card.component';
import { HeroLoggedComponent } from './components/hero/hero-logged/hero-logged.component';
import { HeroUnloggedComponent } from './components/hero/hero-unlogged/hero-unlogged.component';
import { ReportModalComponent } from './components/pesquisa/components/report-modal/report-modal.component';
import { CommentsModalComponent } from './components/pesquisa/components/comments-modal/comments-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    PesquisaCampanhaListComponent,
    CampanhaCardComponent,
    HeroLoggedComponent,
    HeroUnloggedComponent,
    ReportModalComponent,
    CommentsModalComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
})
export class HomeModule {}

