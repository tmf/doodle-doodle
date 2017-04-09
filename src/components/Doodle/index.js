import React from 'react';

import FullScreen from './FullScreen';
import Physics from './Physics';
import Render from './Render';
import Logo from './Logo';
import Cage from './Cage';
import ControlConstraint from './ControlConstraint';

class Doodle extends React.Component {
    render() {
        return (
            <FullScreen>
                <Physics>
                    <Render>
                        <ControlConstraint />
                        <Cage />
                        <Logo />
                    </Render>
                </Physics>
            </FullScreen>
        );
    }
}

export default Doodle;