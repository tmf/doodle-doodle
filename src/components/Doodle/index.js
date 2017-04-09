import React from 'react';
import ReactDOM from 'react-dom';
import SvgContainer from './SvgContainer';

// eslint-disable-next-line import/no-webpack-loader-syntax
import 'expose-members?decomp!poly-decomp';
import {
    Engine,
    Bodies,
    World,
    Vertices,
    Body,
    Vector,
    Mouse,
    MouseConstraint,
    Composite,
    Events,
} from 'matter-js/src/module/main';

import { svgPathProperties } from 'svg-path-properties';
import Logo from './Logo';

class Doodle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { entities: [] };
    }

    componentDidMount() {
        this.engine = Engine.create({});
        this.engine.enableSleeping = true;

        const thickness = 1, width = 1000, height = 1000;
        let box = [
            Bodies.rectangle(0, -(height + thickness) / 2, width, 10, { isStatic: true }),
            Bodies.rectangle(-(width + thickness) / 2, 0, 10, height, { isStatic: true }),
            Bodies.rectangle((width + thickness) / 2, 0, 10, height, { isStatic: true }),
            Bodies.rectangle(0, (height + thickness) / 2, width, 10, { isStatic: true }),
        ];

        World.add(this.engine.world, box);

        const svgPaths = this.getSvgPathPropertiesFrom(Logo);

        const bodies = svgPaths
            .map(({ properties }) =>
                Array.from({ length: 4 * properties.getTotalLength() - 1 }, (_, i) => (i + 1) * 0.25)
                    .reduce((sampled, length) => {

                        const pointA = sampled[sampled.length - 1];
                        const pointB = properties.getPointAtLength(length);
                        const pointC = properties.getPointAtLength(length + 0.25);

                        if (Math.abs(Vector.angle(pointA, pointB) - Vector.angle(pointA, pointC)) > 0.0025) {
                            sampled.push(pointB);
                        }
                        return sampled;
                    }, [properties.getPointAtLength(0)]))
            .map((points) => Vertices.create(points))
            .map((vertices) => Vertices.scale(vertices, 10, 10, { x: 0, y: 0 }))
            .map((vertices) => Vertices.translate(vertices, Vector.create(width, 0), -0.5))
            .map((vertices, i) => Body.create({
                vertices,
                label: svgPaths[i].id,
                position: Vertices.centre(vertices),
            }));

        const filterByGroup = (group) => (body, index) => svgPaths[index].group === group;

        const letters = [
            Body.create({ parts: bodies.filter(filterByGroup('letter-capital-d')) }),
            Body.create({ parts: bodies.filter(filterByGroup('letter-o1')) }),
            Body.create({ parts: bodies.filter(filterByGroup('letter-o2')) }),
            Body.create({ parts: bodies.filter(filterByGroup('letter-d')) }),
            Body.create({ parts: bodies.filter(filterByGroup('letter-l')) }),
            Body.create({ parts: bodies.filter(filterByGroup('letter-e')) }),
        ];
        World.add(this.engine.world, letters);

        requestAnimationFrame(this.animationFrame.bind(this));
    }

    componentWillUnmount() {
        this.engine.clear();
    }

    getSvgPathPropertiesFrom(Component) {
        const scratch = document.createElement('div');
        ReactDOM.render(React.createElement(Component), scratch);
        const paths = [].map.call(scratch.querySelectorAll('path'), (path) => path);

        return paths.map((path) => ({
            id: path.getAttribute('id'),
            group: path.getAttribute('class'),
            properties: svgPathProperties(path.getAttribute('d')),
        }));
    }

    animationFrame() {
        const delta = 1000 / 30;
        Engine.update(this.engine, delta);

        let bodies = Composite.allBodies(this.engine.world),
            allBodies = [].concat.apply([], bodies.map((body) => body.parts.length > 1 ? body.parts.slice(1) : [body])),
            entities = allBodies.map(body => {
                return {
                    id: body.id,
                    position: { x: body.position.x.toFixed(1), y: body.position.y.toFixed(1) },
                    vertices: body.vertices.map(vertex => ({ x: vertex.x.toFixed(1), y: vertex.y.toFixed(1) })),
                };
            });

        this.setState({
            entities,
        });

        requestAnimationFrame(this.animationFrame.bind(this));
    }

    render() {
        return (
            <SvgContainer>
                {this.state.entities.map((entity, index) => (
                    <polygon points={entity.vertices.map(vertex => `${vertex.x},${vertex.y}`).join(' ')}
                             key={`entity-${entity.id}`}
                             stroke="currentColor"
                             strokeWidth={1.75}
                    />
                ))}
            </SvgContainer>
        );
    }
}

export default Doodle;