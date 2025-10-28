import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  computed,
  signal,
} from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-translated-text',
  template: `{{ translatedText() }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TranslatedTextComponent implements OnInit, OnDestroy {
  @Input() key!: string;
  @Input() params?: { [key: string]: string | number };
  @Input() fallback?: string;

  private keySignal = signal<string>('');
  private paramsSignal = signal<{ [key: string]: string | number } | undefined>(undefined);
  private fallbackSignal = signal<string | undefined>(undefined);

  translatedText = computed(() => {
    const key = this.keySignal();
    const params = this.paramsSignal();
    const fallback = this.fallbackSignal();

    if (!key) {
      return fallback || '';
    }

    const translation = this.translationService.translate(key, params);

    if (translation === key && fallback) {
      return fallback;
    }

    return translation;
  });

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.key) {
      console.warn('TranslatedTextComponent: key is required');
      return;
    }

    this.keySignal.set(this.key);
    this.paramsSignal.set(this.params);
    this.fallbackSignal.set(this.fallback);
  }

  ngOnDestroy(): void {
    // No cleanup needed
  }
}
