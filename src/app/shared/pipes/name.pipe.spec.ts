import { NamePipe } from './name.pipe';

describe('NamePipe', () => {
  let pipe: NamePipe;

  beforeEach(() => {
    pipe = new NamePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should capitalize first letter of each word', () => {
    const result = pipe.transform('john doe');
    expect(result).toBe('John Doe');
  });

  it('should handle single word names', () => {
    const result = pipe.transform('john');
    expect(result).toBe('John');
  });

  it('should handle names with multiple spaces', () => {
    const result = pipe.transform('john   doe');
    expect(result).toBe('John   Doe');
  });

  it('should handle already capitalized names', () => {
    const result = pipe.transform('John Doe');
    expect(result).toBe('John Doe');
  });

  it('should handle mixed case names', () => {
    const result = pipe.transform('jOHN dOE');
    expect(result).toBe('John Doe');
  });

  it('should handle empty string', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });

  it('should handle null values', () => {
    const result = pipe.transform(null as any);
    expect(result).toBe('');
  });

  it('should handle undefined values', () => {
    const result = pipe.transform(undefined as any);
    expect(result).toBe('');
  });

  it('should handle names with special characters', () => {
    const result = pipe.transform('john-doe');
    expect(result).toBe('John-doe');
  });
});
