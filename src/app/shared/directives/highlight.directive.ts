import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit, OnChanges {
  @Input() appHighlight: string = '';
  @Input() highlightClass: string = 'highlight';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.highlight();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appHighlight']) {
      this.highlight();
    }
  }

  private highlight() {
    if (!this.appHighlight) {
      this.el.nativeElement.innerHTML = this.el.nativeElement.textContent;
      return;
    }

    const text = this.el.nativeElement.textContent;
    if (!text) return;

    const regex = new RegExp(`(${this.escapeRegExp(this.appHighlight)})`, 'gi');
    const highlightedText = text.replace(regex, `<span class="${this.highlightClass}">$1</span>`);
    
    this.el.nativeElement.innerHTML = highlightedText;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
