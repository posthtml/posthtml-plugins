var searchInput = document.getElementById('searchInput');
var plugins = document.getElementsByClassName('Plugin_wrapper')

searchInput.addEventListener('change', onChange);
searchInput.addEventListener('keyup', onChange);
searchInput.addEventListener('search', onChange);

function onChange(event) {
    var searchQuery = (event.target.value || '').trim().toLowerCase();

    for (var plugin of plugins) {
        if (isMatch(plugin, searchQuery)) {
            plugin.classList.remove('Plugin_wrapper-hidden');
        } else {
            plugin.classList.add('Plugin_wrapper-hidden');
        }
    }
}

function isMatch(plugin, searchQuery) {
    if (! searchQuery) {
        return true;
    }

    var pluginName = plugin.getElementsByClassName('Plugin_link')[0].textContent;
    var pluginDescription = plugin.getElementsByClassName('Plugin_description')[0].textContent;
    var text = (pluginName + pluginDescription).toLowerCase();

    return text.indexOf(searchQuery) !== -1;
}
