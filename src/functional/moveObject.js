import Shape from "../canvas/shape";

const moveObject = ({object, deltaX, deltaY}) => object.shapes = object.shapes.map(shape => {
    const newShape = new Shape(shape.x + deltaX, shape.y + deltaY, shape.width, shape.height, shape.color);
    newShape.oldX = shape.x;
    newShape.oldY = shape.y;
    return newShape;
});

export default moveObject;
