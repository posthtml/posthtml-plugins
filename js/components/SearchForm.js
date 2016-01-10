import React from 'react';
import { SearchForm as localCss } from '../config/css';

class SearchForm extends React.Component {
    render() {
        return (
            <div className={localCss.wrapper}>
                <input
                    type="search"
                    autoFocus
                    tabIndex="1"
                    placeholder="Search"
                    className={localCss.queryInput}
                    value={this.props.searchQuery}
                    onChange={this.handleSearch.bind(this)}
                />
            </div>
        );
    }

    handleSearch(event) {
        this.props.search(event.target.value);
    }
}

SearchForm.propTypes = {
    searchQuery: React.PropTypes.string.isRequired,
    search: React.PropTypes.func.isRequired
};

export default SearchForm;
