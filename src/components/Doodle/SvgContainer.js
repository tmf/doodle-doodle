import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
`;


class SvgContainer extends React.PureComponent {
    static propTypes = {
        children: React.PropTypes.any,
    };

    render() {
        const {
            children,
        } = this.props;

        return (
            <Container>
                <svg width="100vw"
                     height="100vh"
                     viewBox={`-500 -500 1000 1000`}
                     preserveAspectRatio="xMidYMid slice"
                >
                    {children}
                </svg>
            </Container>
        );
    }
}

export default SvgContainer;