import React from 'react';
import {
    Body,
    Bodies,
    World,
    Composite,
} from 'matter-js/src/module/main';


class Cage extends React.Component {
    static propTypes = {
        container: React.PropTypes.shape({
            innerWidth: React.PropTypes.number,
            innerHeight: React.PropTypes.number,
        }),
    };
    static contextTypes = {
        engine: React.PropTypes.object
    };

    componentWillMount() {
        const { container } = this.props;

        World.add(this.context.engine.world, this.getCage(container));
    }

    componentWillUpdate(nextProps) {
        if (nextProps.container.innerWidth !== this.props.container.innerWidth ||
            nextProps.container.innerHeight !== this.props.container.innerHeight) {


            const newCage = this.getCage(nextProps.container);
            this.getCageBodies().forEach((cageBody, index) => {
                Body.setVertices(cageBody, newCage[index].vertices);
            });
        }
    }

    getCage = ({ innerWidth, innerHeight }) => [
        Bodies.rectangle(0, -(innerHeight + 5) / 2, innerWidth, 10, { isStatic: true, label: 'box' }),
        Bodies.rectangle(-(innerWidth + 5) / 2, 0, 10, innerHeight, { isStatic: true, label: 'box' }),
        Bodies.rectangle((innerWidth + 5) / 2, 0, 10, innerHeight, { isStatic: true, label: 'box' }),
        Bodies.rectangle(0, (innerHeight + 5) / 2, innerWidth, 10, { isStatic: true, label: 'box' }),
    ];

    getCageBodies() {
        return Composite.allBodies(this.context.engine.world)
            .filter((body) => body.label === 'box');
    }

    render() {
        return (
            <g>
                {this.getCageBodies().map((part, index) => (
                    <polygon points={part.vertices.map(vertex => `${vertex.x},${vertex.y}`).join(' ')}
                             key={`entity-${part.id}`}
                             stroke="currentColor"
                             strokeWidth={1.75}
                    />
                ))}
            </g>
        );
    }
}

export default Cage;