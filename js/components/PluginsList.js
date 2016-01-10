import React from 'react';
import Plugin from './Plugin';
import { PluginsList as localCss } from '../config/css';

class PluginsList extends React.Component {
    render() {
        const plugins = this.props.plugins.sort((a, b) => {
            a = a.name;
            b = b.name;

            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        });

        return (
            <ul className={localCss.wrapper}>
                {plugins.map(plugin =>
                    <Plugin key={plugin.name} plugin={plugin} />
                )}
            </ul>
        );
    }
}

PluginsList.propTypes = {
    plugins: React.PropTypes.array.isRequired
};

export default PluginsList;
