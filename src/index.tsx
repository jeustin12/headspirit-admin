import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { theme } from './theme';
import Routes from './routes';
import * as serviceWorker from './serviceWorker';
import './theme/global.css';
import { createUploadLink } from 'apollo-upload-client';


const httpLink = createUploadLink({
  uri: 'https://protected-inlet-34357.herokuapp.com/graphql',
});

const client = new ApolloClient({
  //@ts-ignore
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  const engine = new Styletron();

  return (
    <ApolloProvider client={client as any}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={theme}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </BaseProvider>
      </StyletronProvider>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
