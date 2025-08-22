import { StatusPipe } from './status.pipe';

describe('StatusPipe', () => {
  let pipe: StatusPipe;

  beforeEach(() => {
    pipe = new StatusPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "active" to "Active"', () => {
    const result = pipe.transform('active');
    expect(result).toBe('Active');
  });

  it('should transform "inactive" to "Inactive"', () => {
    const result = pipe.transform('inactive');
    expect(result).toBe('Inactive');
  });

  it('should handle unknown status values', () => {
    const result = pipe.transform('unknown' as any);
    expect(result).toBe('Unknown');
  });

  it('should handle null values', () => {
    const result = pipe.transform(null as any);
    expect(result).toBe('Unknown');
  });

  it('should handle undefined values', () => {
    const result = pipe.transform(undefined as any);
    expect(result).toBe('Unknown');
  });
});
