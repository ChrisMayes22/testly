import React, { Component } from 'react';
import * as actions from '../actions';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './Header';

class App extends Component {
    componentDidMount(){
        this.props.fetchUser();
    }

    render(){
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" component={Header} />
                    <Route  component={() => '404 not found'} />
                </div>
            </BrowserRouter>
        )
    }
}

export default connect(null, actions)(App);
