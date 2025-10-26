import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Campanha } from '../../../../../shared/models/campanha.model';
import { Form, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step-revisao',
  templateUrl: './step-revisao.component.html',
  styleUrl: './step-revisao.component.css',
})
export class StepRevisaoComponent implements OnInit, OnChanges {
  @Input() campanhaForm!: FormGroup | null;
  @Input() activeStep: number = 0;
  @Input() totalSteps: number = 5;
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() onSave: EventEmitter<Campanha> = new EventEmitter();
  @ViewChild('header', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<any>;

  tabItems: any[] = [];
  activeTab: any;
  imagePreviewUrl: string = '';
  mapUrl: SafeResourceUrl = '';

  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.initializeTabs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeStep'] && this.activeStep === 4) {
      this.initializeTabs();
      this.getGoogleMapsUrl();
      this.updateImagePreview();
    }
  }

  initializeTabs(): void {
    this.tabItems = [];

    this.tabItems.push({ label: 'Resumo', icon: 'pi pi-file' });

    if (this.campanhaForm?.get('have_address')?.value) {
      this.tabItems.push({ label: 'Endereço', icon: 'pi pi-map-marker' });
    }

    if (this.activeTab && this.tabItems.find((tab) => tab.label === this.activeTab.label)) {
      this.activeTab = this.tabItems.find((tab) => tab.label === this.activeTab.label);
    } else {
      this.activeTab = this.tabItems[0];
    }
  }

  updateImagePreview(): void {
    const newFileImage = this.campanhaForm?.get('new_file_image')?.value as File;

    if (newFileImage) {
      this.imagePreviewUrl = URL.createObjectURL(newFileImage);
    } else if (this.campanhaForm?.get('image')?.value) {
      this.imagePreviewUrl = this.campanhaForm?.get('image')?.value.url;
    } else {
      this.imagePreviewUrl = '';
    }
  }

  getGoogleMapsUrl() {
    const address = [
      this.street?.value,
      this.number?.value,
      this.neighborhood?.value,
      this.city?.value,
      this.state?.value,
      this.zipcode?.value,
    ]
      .filter(Boolean)
      .join(', ');

    if (!address.trim()) return;

    const url = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getGoogleMapsLink() {
    const addressParts = [
      this.street?.value,
      this.number?.value,
      this.neighborhood?.value,
      this.city?.value,
      this.state?.value,
      this.zipcode?.value,
    ].filter((part) => part && part.toString().trim());

    if (addressParts.length === 0) return '';

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressParts.join(', '))}`;
  }

  get title() {
    return this.campanhaForm?.get('title')?.value;
  }

  get emergency() {
    return this.campanhaForm?.get('emergency')?.value;
  }

  get categoriesFormatted(): string {
    const categories = this.campanhaForm?.get('category')?.value;
    if (Array.isArray(categories)) {
      return categories.map((cat: any) => cat.name).join(', ');
    }
    return '';
  }

  get value_required() {
    return this.campanhaForm?.get('value_required')?.value;
  }

  get description() {
    return this.campanhaForm?.get('description')?.value;
  }

  get street() {
    return this.campanhaForm?.get('street')?.value;
  }

  get number() {
    return this.campanhaForm?.get('number')?.value;
  }

  get complement() {
    return this.campanhaForm?.get('complement')?.value;
  }

  get city() {
    return this.campanhaForm?.get('city')?.value;
  }

  get state() {
    return this.campanhaForm?.get('state')?.value;
  }

  get zipcode() {
    return this.campanhaForm?.get('zipcode')?.value;
  }

  get neighborhood() {
    return this.campanhaForm?.get('neighborhood')?.value;
  }

  get campanha_id() {
    return this.campanhaForm?.get('campanha_id')?.value;
  }
}

