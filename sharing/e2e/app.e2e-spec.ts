import { SharingPage } from './app.po';

describe('sharing App', () => {
  let page: SharingPage;

  beforeEach(() => {
    page = new SharingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
