import React from 'react';
import { Plugin as localCss } from '../config/css';

class Plugin extends React.Component {
    render() {
        const { plugin } = this.props;

        const shortName = plugin.name.replace('posthtml-', '');

        return (
            <li className={localCss.wrapper}>
                <span className={localCss.name}>
                    <a href={plugin.url} className={localCss.link}>{shortName}</a>
                </span>
                <span className={localCss.description}>{plugin.description}</span>
            </li>
        );
    }
}

Plugin.propTypes = {
    plugin: React.PropTypes.object.isRequired
};

export default Plugin;
