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
let stack = undefined;

// Declare objects
let axes = undefined
let cone = undefined
let cylinder = undefined

function init() {
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) { alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave"); }

    // Setting the background color
    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // Initialization the stack
    stack = new MatrixStack()

    // Init objects
    axes = new Axes(gl);
    cone = new Cone(gl, 30) // Pass 30 numOfSlices for perimeter
    cylinder = new Cylinder(gl, 30) // Pass 30 numOfSlices for perimeter

    // Render the axes
    render()
}

function render() {
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT)

    // Load the identity matric to reset transforms
    stack.loadIdentity()

    // Push the identity matrix onto the top of the stack
    stack.push()
    stack.translate(0.0, 0.0, 0.0); // Move cone to the right
    stack.scale(0.5, 0.5, 0.0)  // Scale the axes

    // Pass the transformation matrix to the axes shader
    axes.MV = stack.current()
    axes.draw() // Draw the axes
    
    // Pop the axes off the Matrix stack
    stack.pop()

    // Push the identity matrix onto the top of the stack
    stack.push()
    stack.translate(0.5, 0.0, 0.0); // Move cone to the right
    stack.scale(0.2, 0.2, 0.0) // Scale the cone

    // Pass the transformation matrix to the cone shader
    cone.MV = stack.current()
    cone.draw() // Draw the cone

    // Pop the cone off the Matrix stack
    stack.pop()

    // Push the identity matrix onto the top of the stack
    stack.push()
    stack.translate(0.1, 0.7, 0.0); // Move cylinder to the right
    stack.scale(0.2, 0.2, 0.0) // Scale the cylinder

    // Pass the transformation matrix to the cylinder shader
    cylinder.MV = stack.current()
    cylinder.draw() // Draw the cylinder

    // Pop the cylinder off the Matrix stack
    stack.pop()

    // Get the next frame to continously render the objects
    requestAnimationFrame(render)
}

window.onload = init;

