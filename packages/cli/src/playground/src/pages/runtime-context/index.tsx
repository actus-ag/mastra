import {
  Header,
  HeaderTitle,
  MainContentContent,
  MainContentLayout,
  RuntimeContext,
  RuntimeContextWrapper,
} from '@mastra/cli/cli/cli/playground-ui';

export default function RuntimeContextPage() {
  return (
    <MainContentLayout>
      <Header>
        <HeaderTitle>Runtime Context</HeaderTitle>
      </Header>

      <MainContentContent>
        <RuntimeContextWrapper>
          <RuntimeContext />
        </RuntimeContextWrapper>
      </MainContentContent>
    </MainContentLayout>
  );
}
