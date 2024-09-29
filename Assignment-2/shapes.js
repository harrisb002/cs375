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

// Declare my axes object
let axes = undefined

function init() {
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) { alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave"); }

    // Initialization the stack
    stack = new MatrixStack()

    // Init the Axes
    axes = new Axes(gl);

    // Render the axes
    render()
}

function render() {
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT)

    // Transform the axes to the center
    stack.loadIdentity()

    // Pass the transformation matrix to the axes shader
    axes.MV = stack.current()

    // Draw the axes
    axes.draw()

    // Get the next frame to continously render the axes
    requestAnimationFrame(render)
}

window.onload = init;

