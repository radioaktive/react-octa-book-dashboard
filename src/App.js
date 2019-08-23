import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';

import Navbar from './Navbar';
import Home from './Home'
import Books from './Books'

const config = {
    issuer: 'https://dev-425291.okta.com/oauth2/default',
    redirect_uri: window.location.origin + '/implicit/callback',
    client_id: '0oa163b3uaUjxXQ5F357'
}

class App extends Component {
  render() {
    return (
        <Router>
            <Security issuer={config.issuer}
                   client_id={config.client_id}
                redirect_uri={config.redirect_uri}
            >
            <Navbar />
            <Container text style={{ marginTop: '7em' }}>
                <Route path="/" exact component={Home} />
                <Route path="/implicit/callback" component={ImplicitCallback} />
                <SecureRoute path="/books" component={Books} />
            </Container>
        </Security>
      </Router>
    );
  }
}

export default App
