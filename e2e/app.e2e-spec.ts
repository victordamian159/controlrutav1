import { ControlBusesFrontV1Page } from './app.po';

describe('control-buses-front-v1 App', function() {
  let page: ControlBusesFrontV1Page;

  beforeEach(() => {
    page = new ControlBusesFrontV1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
