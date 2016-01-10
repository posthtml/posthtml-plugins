const allPlugins = require('./config/plugins');

const initialState = {
    searchQuery: '',
    plugins: allPlugins
};

export default function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'SEARCH':
            return search(action, state);

        default:
            return state;
    }
}



function search(action, state) {
    let plugins = allPlugins;
    const searchQuery = action.searchQuery;
    if (searchQuery.length >= 2) {
        plugins = plugins.filter(plugin => {
            return plugin.name.search(searchQuery) !== -1 ||
                plugin.description.search(searchQuery) !== -1;
        });
    }

    return Object.assign({}, state, {
        searchQuery: action.searchQuery,
        plugins
    });

}
