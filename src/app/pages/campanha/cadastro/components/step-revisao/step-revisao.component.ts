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

@Component({
  selector: 'app-step-revisao',
  templateUrl: './step-revisao.component.html',
  styleUrl: './step-revisao.component.css',
})
export class StepRevisaoComponent implements OnInit, OnChanges {
  @Input() campanha!: Campanha;
  @Input() activeStep: number = 0;
  @Input() totalSteps: number = 5;
  @Output() onCancel: EventEmitter<void> = new EventEmitter();
  @Output() onSave: EventEmitter<Campanha> = new EventEmitter();
  @ViewChild('header', { static: true }) headerTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentTemplate!: TemplateRef<any>;

  tabItems: any[] = [];
  activeTab: any;

  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.initializeTabs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campanha'] && this.campanha) {
      this.initializeTabs();
    }
  }

  initializeTabs(): void {
    this.tabItems = [];

    this.tabItems.push({ label: 'Resumo', icon: 'pi pi-file' });

    if (this.campanha?.have_address) {
      this.tabItems.push({ label: 'Endereço', icon: 'pi pi-map-marker' });
    }

    if (this.activeTab && this.tabItems.find((tab) => tab.label === this.activeTab.label)) {
      this.activeTab = this.tabItems.find((tab) => tab.label === this.activeTab.label);
    } else {
      this.activeTab = this.tabItems[0];
    }
  }

  getGoogleMapsUrl(): SafeResourceUrl | null {
    if (!this.campanha?.have_address) return null;

    const address = [
      this.campanha.address.street,
      this.campanha.address.number,
      this.campanha.address.neighborhood,
      this.campanha.address.city,
      this.campanha.address.state,
      this.campanha.address.zipcode,
    ]
      .filter(Boolean)
      .join(', ');

    if (!address.trim()) return null;

    const url = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getGoogleMapsLink(): string {
    if (!this.campanha?.have_address) return '';

    const addressParts = [
      this.campanha.address.street,
      this.campanha.address.number,
      this.campanha.address.neighborhood,
      this.campanha.address.city,
      this.campanha.address.state,
      this.campanha.address.zipcode,
    ].filter((part) => part && part.toString().trim());

    if (addressParts.length === 0) return '';

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressParts.join(', '))}`;
  }

  log() {
    console.log(this.campanha);
  }
}

