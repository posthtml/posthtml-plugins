import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SearchForm from './components/SearchForm';
import PluginsList from './components/PluginsList';
import * as AppActions from './actions';

class App extends Component {
    render() {
        const { state, actions } = this.props;
        return (
            <div>
                <SearchForm searchQuery={state.searchQuery} search={actions.search} />
                <PluginsList plugins={state.plugins} />
            </div>
        );
    }
}

App.propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return { state };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AppActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
