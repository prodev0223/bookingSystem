import { MyTimeOnlyPipe } from './my-time-only.pipe';

describe('MyTimeOnlyPipe', () => {
  it('create an instance', () => {
    const pipe = new MyTimeOnlyPipe();
    expect(pipe).toBeTruthy();
  });
});
