# cs375

**Computer Graphics**

# Assignments

## ✅ **Assignment 1: WebGL Explorations on the Web**

- **Description:** Explored WebGL technology by finding and reviewing a website that utilizes WebGL for rendering graphics. I discovered the use of WebGL in rendering shaders for fractals. Specifically, I explored the Hopalong Attractor, a fractal represented through WebGL and three.js. This attractor uses a simple mathematical formula to create intricate patterns.

  - [WebGL Attractors Trip](https://iacopoapps.appspot.com/hopalongwebgl/)

- **Other Links:**

  - **[Shadertoy](https://www.shadertoy.com/)** A sick website that uses WebGL fragment shaders to create graphics.
  - **[Experiments with Google / WebGL](https://experiments.withgoogle.com/search?q=WebGL):** An awesome collection of user-contributed WebGL applications showcasing creative uses of the technology.
  - **[NORAD Tracks Santa](https://www.noradsanta.org/en/):** A cool WebGL-based application that tracks Santa on Christmas Eve using GIS information, demonstrating another unique use of WebGL.
  - [Ray Marching](https://en.wikipedia.org/wiki/Ray_marching): - A 3D rendering method that iteratively divides rays into smaller segments, sampling a function at each step, commonly used in volume ray casting and Sphere tracing.

#### Notion for Notes - [Notion](https://www.notion.so/Computer-Graphics-be3235a9ad304109876f0b9bc7ea7d44)

## ✅ **Assignment-2: Matrix Stacks**

### Assignment Goals

- Knowing the roles of HTML and JavaScript files and content in developing a WebGL-based applications
- Using a MatrixStack to manage transformations to control the position and orientation of geometric objects
- Assign values to WebGL shader uniform variables to enable customization and manipulation of geometric objects
- Update motion variables to enable animation in a WebGL-based application coordinate systems, transformations, and matrix order-of-operations

### Overview

- **Description:** This assignment involves creating a 3D scene using WebGL where I will render and animate shapes.
  I will use a set of provided JS files to set up the scene, apply transformations, and animate objects.
  The goal is to understand the basics of 3D rendering and transformations in WebGL.

### File Descriptions

- **shapes.html**: HTML file to init the WebGL canvas and link the JS files.
- **shapes.js**: Main logic to init WebGL and create/position the objects as well as handle their animations.

- **initShaders.js**: Helper script to compile and init the WebGL shaders.
- **MatrixStack.js**: Implements a matrix stack for hierarchical modeling in 3D space.
  Will be used to apply transformations such as: translation, scaling, and rotation.
- **MV.js**: Utility functions for vector and matrix operations.

- **Axes.js**: Renders coordinate axes at the origin.
- **Cone.js**: Renders a cone with a height of 1 and a base radius of 1 centered at the origin. Also has as a gradient applied to it, from red at the base to violet at the apex.
- **Cylinder.js**: Renders a 3D cylinder with a height of 1 and a base radius of 1 centered at the origin. It is animated and rotated  within the scene.
- **Sphere.js**: Renders a wireframe sphere centered at the origin with a radius of 1. It is animated and color gradients are applied based on its vertices.
- **Tetrahedron.js**: Renders a tetrahedron symmetric around the origin.

### **Assignment Tasks**
---

#### Instantiate Objects

- In `shapes.js`, I have created all objects using the provided shape classes.
- Example: `let sphere = new Sphere(gl, 12, 24);`.

#### Positioning

- I have made sure the objects are positioned to avoid intersections with each other or the canvas edges. I have used translation and scaling transformations to achieve this.

#### Animation

- I have animated all the objects in a loop. The animations involve rotation, translation, and scaling.

#### Rendering Loop

- I have implemented the rendering loop in the `render()` function.
- This loop clears the canvas, draws all objects, and request the next animation frame.
