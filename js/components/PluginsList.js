import React from 'react';
import Plugin from './Plugin';
import { PluginsList as localCss } from '../config/css';

class PluginsList extends React.Component {
    render() {
        return (
            <ul className={localCss.wrapper}>
                {this.props.plugins.map(plugin =>
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
