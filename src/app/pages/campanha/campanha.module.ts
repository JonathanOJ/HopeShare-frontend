import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampanhaRoutingModule } from './campanha-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { CampanhaCreateComponent } from './cadastro/campanha-create.component';
import { StepCategoriaComponent } from './cadastro/components/step-categoria/step-categoria.component';
import { StepDescricaoComponent } from './cadastro/components/step-descricao/step-descricao.component';
import { StepMetaComponent } from './cadastro/components/step-meta/step-meta.component';
import { StepRevisaoComponent } from './cadastro/components/step-revisao/step-revisao.component';
import { StepEnderecoComponent } from './cadastro/components/step-endereco/step-endereco.component';
import { CampanhaListagemComponent } from './listagem/campanha-listagem.component';

@NgModule({
  declarations: [
    StepCategoriaComponent,
    StepDescricaoComponent,
    StepMetaComponent,
    StepRevisaoComponent,
    CampanhaListagemComponent,
    CampanhaCreateComponent,
    StepEnderecoComponent,
  ],
  imports: [CommonModule, CampanhaRoutingModule, SharedModule],
})
export class CampanhaModule {}

