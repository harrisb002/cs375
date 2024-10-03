/////////////////////////////////////////////////////////////////////////////
//
//  shapes.js
//
//  Creates and renders five objects (axes, cone, cylinder, sphere, and tetrahedron)
//  using a WebGL context. Objects are positioned using the MatrixStack
//  to make sure they do not intersect and are within the bounds of the canvas.
//
/////////////////////////////////////////////////////////////////////////////

// Initialize the WebGL context and Matrix Stack
let gl = undefined;
let ms = undefined;

// Declare objects
let axes = undefined;
let cone = undefined;
let cylinder = undefined;
let sphere = undefined;
let tetrahedron = undefined;

// Init the angle to rotate
let angle = 0.0;

// init scale factor for dynamically scalling
let scaleFactor = 1.0;

// Define color for uniforms (Only being used with sphere)
let color = vec4(0.9, 0.1, 0.7, 1.0);

// Create array to store shapes
let objects = [];

function init() {
  let canvas = document.getElementById("webgl-canvas");
  gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave");
  }

  gl.clearColor(0.7, 0.7, 0.7, 1.0); // Clear the canvas color to slightly grey

  // Init objects
  axes = new Axes(gl);
  cone = new Cone(gl, 30);
  cylinder = new Cylinder(gl, 30);
  sphere = new Sphere(gl, 30, 18);
  tetrahedron = new Tetrahedron(gl);

  // (Object, RotateAxis, Translate, Scale)
  initObjectProperties(axes, [0, 1, 1], [-0.7, 0.7, 0.0], [0.2, 0.2, 0.0]);
  initObjectProperties(cone, [1, 1, 0], [0.5, 0.5, 0.0], [0.2, 0.2, 0.0]);
  initObjectProperties(cylinder, [0, 1, 0], [-0.7, -0.7, 0.0], [0.2, 0.2, 0.0]);
  initObjectProperties(sphere, [0, 1, 1], [0.5, -0.5, 0.0], [0.3, 0.3, 0.0]);
  initObjectProperties(
    tetrahedron,
    [0, 1, 0],
    [-0.4, 0.1, 0.0],
    [0.3, 0.3, 0.0]
  );

  // Store all shapes in the objects array
  objects.push(axes, cone, cylinder, sphere, tetrahedron);

  // Init the stack
  ms = new MatrixStack();

  render();
}

function render() {
  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // increment & mod angle
  angle += 3.0;
  angle %= 360.0;

  // Change scale based on sine wave to oscilate and angle
  scaleFactor = 0.5 * Math.sin((angle * Math.PI) / 360);

  // Using dynamic scale on tetrahedron
  tetrahedron.scale = [scaleFactor, scaleFactor, scaleFactor];

  // Render the objects passing their props
  objects.forEach((obj) => {
    renderObject(obj, obj.rotateAxis, obj.translate, obj.scale);
  });

  requestAnimationFrame(render);
}

function renderObject(obj, rotateAxis, translate, scale) {
  ms.push();
  ms.translate(translate);
  ms.scale(scale);
  ms.rotate(angle, rotateAxis);
  obj.MV = ms.current();
  // Update color for objects that have color uniforms (Only sphere)
  if (obj.color) {
    obj.color = color;
  }
  obj.draw();
  ms.pop();
}

// Adding props on each obj, I want to mutate original instead of using spread...
function initObjectProperties(obj, rotateAxis, translate, scale) {
  obj.rotateAxis = rotateAxis;
  obj.translate = translate;
  obj.scale = scale;
}

window.onload = init;
