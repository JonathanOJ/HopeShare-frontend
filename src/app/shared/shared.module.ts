import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './components/loading/loading.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmptyTableComponent } from './components/empty-table/empty-table.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { LoadingService } from './services/loading.service';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepperModule } from 'primeng/stepper';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { LayoutService } from './services/layout.service';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SupportDialogComponent } from './components/support-dialog/support-dialog.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    LoadingComponent,
    EmptyTableComponent,
    NotfoundComponent,
    FooterComponent,
    HeaderComponent,
    SupportDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
    InputMaskModule,
    CalendarModule,
    CarouselModule,
    GalleriaModule,
    TabViewModule,
    InputIconModule,
    IconFieldModule,
    DropdownModule,
    TagModule,
    DividerModule,
    ProgressSpinnerModule,
    InfiniteScrollDirective,
    TableModule,
    ProgressBarModule,
    ToastModule,
    DialogModule,
    StepperModule,
    FileUploadModule,
    InputTextareaModule,
    ToggleButtonModule,
    MenuModule,
    InputNumberModule,
    ConfirmDialogModule,
    TabMenuModule,
    CardModule,
    SelectButtonModule,
    AutoCompleteModule,
    RadioButtonModule,
    TooltipModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    LoadingComponent,
    EmptyTableComponent,
    NotfoundComponent,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    PasswordModule,
    InputMaskModule,
    CalendarModule,
    CarouselModule,
    GalleriaModule,
    TabViewModule,
    InputIconModule,
    IconFieldModule,
    DropdownModule,
    TagModule,
    DividerModule,
    ProgressSpinnerModule,
    InfiniteScrollDirective,
    TableModule,
    ProgressBarModule,
    ToastModule,
    DialogModule,
    StepperModule,
    FileUploadModule,
    InputTextareaModule,
    ToggleButtonModule,
    MenuModule,
    InputNumberModule,
    FooterComponent,
    HeaderComponent,
    SupportDialogComponent,
    ConfirmDialogModule,
    TabMenuModule,
    CardModule,
    SelectButtonModule,
    AutoCompleteModule,
    RadioButtonModule,
    TooltipModule,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [LoadingService, MessageService, ConfirmationService, DialogService, LayoutService],
    };
  }
}
