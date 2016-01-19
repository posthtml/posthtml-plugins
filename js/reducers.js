function sortByShortName(a, b) {
    a = a.shortName;
    b = b.shortName;

    // A -> Z
    if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    } else {
        return 0;
    }
}


const allPlugins = require('./config/plugins')
    .map(plugin => {
        plugin.shortName = plugin.name.replace('posthtml-', '');
        return plugin;
    })
    .sort(sortByShortName);


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
