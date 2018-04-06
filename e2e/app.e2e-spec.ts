import { CpePage } from './app.po';

describe('cpe App', () => {
  let page: CpePage;

  beforeEach(() => {
    page = new CpePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
