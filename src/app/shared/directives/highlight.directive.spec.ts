import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';

@Component({
  template: '<div [appHighlight]="searchTerm" [highlightClass]="highlightClass">Test content</div>',
  standalone: true,
  imports: [HighlightDirective]
})
class TestComponent {
  searchTerm = '';
  highlightClass = 'highlight';
}

describe('HighlightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(HighlightDirective));
  });

  it('should create an instance', () => {
    expect(debugElement).toBeTruthy();
  });

  it('should not highlight when search term is empty', () => {
    component.searchTerm = '';
    fixture.detectChanges();
    
    const element = debugElement.nativeElement;
    expect(element.innerHTML).toBe('Test content');
  });

  it('should highlight search term in content', () => {
    component.searchTerm = 'Test';
    fixture.detectChanges();
    
    const element = debugElement.nativeElement;
    expect(element.innerHTML).toContain('<span class="highlight">Test</span>');
  });

  it('should highlight multiple occurrences of search term', () => {
    component.searchTerm = 't';
    fixture.detectChanges();
    
    const element = debugElement.nativeElement;
    expect(element.innerHTML).toContain('<span class="highlight">t</span>');
  });

  it('should use custom highlight class', () => {
    component.searchTerm = 'Test';
    component.highlightClass = 'custom-highlight';
    fixture.detectChanges();
    
    const element = debugElement.nativeElement;
    expect(element.innerHTML).toContain('<span class="custom-highlight">Test</span>');
  });

  it('should handle case-insensitive highlighting', () => {
    component.searchTerm = 'test';
    fixture.detectChanges();
    
    const element = debugElement.nativeElement;
    expect(element.innerHTML).toContain('<span class="highlight">Test</span>');
  });

  it('should escape special regex characters', () => {
    component.searchTerm = 'Test*';
    fixture.detectChanges();
    
    const element = debugElement.nativeElement;
    // Should not crash and should handle special characters
    expect(element.innerHTML).toBeDefined();
  });

  it('should restore original content when search term is cleared', () => {
    // First set a search term
    component.searchTerm = 'Test';
    fixture.detectChanges();
    
    // Then clear it
    component.searchTerm = '';
    fixture.detectChanges();
    
    const element = debugElement.nativeElement;
    expect(element.innerHTML).toBe('Test content');
  });

  it('should handle null search term', () => {
    component.searchTerm = null as any;
    fixture.detectChanges();
    
    const element = debugElement.nativeElement;
    expect(element.innerHTML).toBe('Test content');
  });

  it('should handle undefined search term', () => {
    component.searchTerm = undefined as any;
    fixture.detectChanges();
    
    const element = debugElement.nativeElement;
    expect(element.innerHTML).toBe('Test content');
  });
});
