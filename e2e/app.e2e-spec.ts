import { ChatProjectPage } from './app.po';

describe('chat-project App', () => {
  let page: ChatProjectPage;

  beforeEach(() => {
    page = new ChatProjectPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
