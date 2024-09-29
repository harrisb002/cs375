/////////////////////////////////////////////////////////////////////////////
//
//  shapes.js
//
//  Create and render three objects (for not trying axes, cone, and cylinder) 
//  in a WebGL context. Objects are positioned using the MatrixStack to 
//  make sure they do not intersect and are within the canvas bounds. 
//
/////////////////////////////////////////////////////////////////////////////

// Initialize the WebGL context and Matrix Stack
let gl = undefined;
let ms = undefined;

// Declare objects
let axes = undefined
let cone = undefined
let cylinder = undefined

// Init the angle to rotate
let angle = 0.0 

function init() {
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) { alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave"); }

    gl.clearColor(0.2, 0.2, 0.2, 1.0) // Clear the canvas color

    // Init objects
    axes = new Axes(gl);
    cone = new Cone(gl, 30);
    cylinder = new Cylinder(gl, 30);

    // Object, RotateAxis, Translate, Scale
    initObjectProperties(axes, [1, 1, 0],[-0.5, 0.5, 0.0], [0.5, 0.5, 0.0])
    initObjectProperties(cone, [1, 1, 0],[0.5, 0.5, 0.0], [0.2, 0.2, 0.0])
    initObjectProperties(cylinder, [0, 1, 0],[-0.5, -0.4, 0.0], [0.2, 0.3, 0.0])

    ms = new MatrixStack() // Init the stack

    // Render the axes
    render()
}

function render() {
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT)

    // increment & mod angle
    angle += 3.0
    angle %= 360.0

    // Render the objects passing their props
    renderObj(axes, axes.rotateAxis, axes.translate, axes.scale)
    renderObj(cone, cone.rotateAxis, cone.translate, cone.scale)
    renderObj(cylinder, cylinder.rotateAxis, cylinder.translate, cylinder.scale)

    requestAnimationFrame(render)
}

function renderObj(obj, rotateAxis, translate, scale) {
    ms.push()
    ms.translate(translate)
    ms.scale(scale)
    ms.rotate(angle, rotateAxis)
    obj.MV = ms.current()
    obj.draw() 
    ms.pop()
}

// Adding props on each obj, I want to mutate original instead of using spread...
function initObjectProperties(obj, rotateAxis, translate, scale) {
    obj.rotateAxis = rotateAxis
    obj.translate = translate
    obj.scale = scale
}

window.onload = init;