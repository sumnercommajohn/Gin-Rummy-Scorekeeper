import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MatchUp from './MatchUp';
import App from './App';
import NotFound from './NotFound';

class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={MatchUp} />
                    <Route path="/matches/:playerNames" component={App} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;
