import { MyDatetimePipe } from './my-datetime.pipe';

describe('MyDatetimePipe', () => {
  it('create an instance', () => {
    const pipe = new MyDatetimePipe();
    expect(pipe).toBeTruthy();
  });
});
