import React from 'react';
import Container from './Container';
import Matter from 'matter-js'

class Doodle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {entities: []};
    }

    componentWillMount() {
        let { Engine, Bodies, World } = Matter;
        let random = (offset, span) => (offset + Math.random() * span);

        let boxes = [
            ...Array.from(new Array(100), () => Bodies.rectangle(random(0, 1000), random(0, 1000), random(40, 60), random(40, 60), { friction: 10, frictionStatic: 10})),
            Bodies.rectangle(400, 800, 810, 60, { isStatic: true })
        ];

        this.engine = Engine.create();
        this.engine.enableSleeping = true;
        // add all of the bodies to the world
        World.add(this.engine.world, boxes);
    }
    componentDidMount() {
        requestAnimationFrame(this.animationFrame.bind(this));
    }

    componentWillUnmount() {
        this.engine.clear();
    }

    animationFrame(){
        const delta = 1000 / 30;
        Matter.Engine.update(this.engine, delta);

        let bodies = Matter.Composite.allBodies(this.engine.world),
            entities = bodies.map((body) => {
                return {
                    id: body.id,
                    position: { x: body.position.x.toFixed(1) , y: body.position.y.toFixed(1) },
                    vertices: body.vertices.map(vertex => ({ x: vertex.x.toFixed(1) , y: vertex.y.toFixed(1) })),
                };
            });

        this.setState({
            entities,
        });

        requestAnimationFrame(this.animationFrame.bind(this));
    }

    render() {
        return (
            <Container>
                <svg width="100vw" height="100vh"
                     viewBox="0 0 1000 1000">
                    {this.state.entities.filter((entity) => (entity.position.x >= 0 && entity.position.y >= 0 && entity.position.x <= 1000 && entity.position.y <= 1000)).map((entity, index) => (
                        <polygon points={entity.vertices.map(vertex => `${vertex.x},${vertex.y}`).join(' ')} key={`entity-${entity.id}`}/>
                    ))}
                </svg>
            </Container>
        );
    }
}

export default Doodle;