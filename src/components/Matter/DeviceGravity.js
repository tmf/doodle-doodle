import React from 'react';
import { deviceOrientation } from 'react-device-events'

class DeviceGravity extends React.Component {
    static contextTypes = {
        engine: React.PropTypes.object
    };

    render() {
        let { gamma, beta } = this.props.deviceOrientation;
        const { engine } = this.context;

        if (gamma && beta) {
            engine.world.gravity.x = Math.min(10, 0.2 * gamma).toFixed(1);
            engine.world.gravity.y = Math.min(10, 0.2 * beta).toFixed(1);
        }

        return null;
    }
}

export default deviceOrientation(DeviceGravity);