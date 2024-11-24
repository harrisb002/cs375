# cs375

**Computer Graphics**

### Notion for Notes - [Notion](https://www.notion.so/)

# Assignments

## ✅ **Assignment 1: WebGL Explorations on the Web**

- **Description:** Explored WebGL technology by finding and reviewing a website that utilizes WebGL for rendering graphics. I discovered the use of WebGL in rendering shaders for fractals. Specifically, I explored the Hopalong Attractor, a fractal represented through WebGL and three.js. This attractor uses a simple mathematical formula to create intricate patterns.

  - [WebGL Attractors Trip](https://iacopoapps.appspot.com/hopalongwebgl/)

- **Other Links:**

  - **[Shadertoy](https://www.shadertoy.com/)** A sick website that uses WebGL fragment shaders to create graphics.
  - **[Experiments with Google / WebGL](https://experiments.withgoogle.com/search?q=WebGL):** An awesome collection of user-contributed WebGL applications showcasing creative uses of the technology.
  - **[NORAD Tracks Santa](https://www.noradsanta.org/en/):** A cool WebGL-based application that tracks Santa on Christmas Eve using GIS information, demonstrating another unique use of WebGL.
  - [Ray Marching](https://en.wikipedia.org/wiki/Ray_marching): - A 3D rendering method that iteratively divides rays into smaller segments, sampling a function at each step, commonly used in volume ray casting and Sphere tracing.

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
- **Cylinder.js**: Renders a 3D cylinder with a height of 1 and a base radius of 1 centered at the origin. It is animated and rotated within the scene.
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

## ✅ Assignment 3: Modeling : Cubes Three Ways!

**Overview**  
This project demonstrates various 3D modeling techniques by implementing three different approaches to render a cube using WebGL. The assignment's objective is to create three JavaScript classes, each rendering a cube with unique methods to illustrate efficiency and creativity in rendering techniques.

**Objectives**

1. **Cube #1 - Basic Cube:** Render a cube using `gl.drawArrays()`. This cube is defined by 12 triangles, each rendered separately. Each vertex is assigned a unique color, enhancing visual clarity and style.
2. **Cube #2 - Indexed Cube:** Render a cube using indexed rendering with `gl.drawElements()`. This approach reduces the number of vertices required by leveraging an element array to reuse vertices. This cube demonstrates a more efficient rendering method while achieving the same visual result as the Basic Cube.
3. **Cube #3 - Experimental Cube:** An optional cube rendering using any combination of WebGL techniques. Potential methods include procedural rendering, connected primitives (e.g., `gl.TRIANGLE_FAN`), or instanced rendering. This cube encourages experimentation with WebGL to enhance efficiency and explore creative rendering methods.

---

### Assignment Goals

- Created a JavaScript class to encapsulate the rendering logic.
- Defined cube vertices and colors to satisfy the requirement of unique color attributes for each vertex.
- Used transformations for model-view and projection matrices within the vertex shader to generate final vertex positions.

**Requirements for each cube:**

- **Centered at the origin** with an edge length of one unit.
- **Front-facing triangles** for consistent rendering.
- **Vertex colors** for each unique vertex position, utilizing WebGL's Attribute and Indices classes.

---

### File Descriptions

- **cubes.html**: Main file that initializes WebGL and includes the cube class implementations.
- **cubeTest.html**: A debugging file to test individual cube implementations separately.
- **BasicCube.js**: Renders the Basic Cube with separate vertex data for each triangle and uses `gl.drawArrays()` for rendering.
- **IndexedCube.js**: Renders the Indexed Cube, using a vertex index list for efficient vertex reuse and `gl.drawElements()` for rendering.
- **ExperimentalCube.js**: Implements an experimental cube rendering method, exploring various advanced WebGL techniques.

---

### Class Implementations

1. **BasicCube.js**

   - **Purpose**: Renders the cube using `gl.drawArrays()` with 12 distinct triangles.
   - **Approach**: Each face is rendered by defining each triangle's vertices and colors, stored as attributes.
   - **Rendering**: Populates vertex attributes and renders the cube with a single call to `gl.drawArrays()`.

2. **IndexedCube.js**

   - **Purpose**: Utilizes indexed rendering to reduce vertex count.
   - **Approach**: Defines vertices and reuses them with an index list, reducing redundant vertex calculations.
   - **Rendering**: Uses `gl.drawElements()` and WebGL's element arrays to create the cube from indexed triangles.

3. **ExperimentalCube.js**
   - **Purpose**: Experiment with creative and optimized rendering techniques for a cube.
   - **Approach**: Allows for freedom in design, with options like connected primitives (`gl.TRIANGLE_FAN`) or procedural generation.
   - **Rendering**: Flexible rendering techniques, focusing on efficiency and exploring WebGL capabilities.

---

### Assignment Tasks

1. **Cube Construction**  
   Defined vertex positions and colors for each cube, with transformations applied through the vertex shader.

2. **Transformations**  
   Implemented model-view (MV) and projection (P) matrices for each cube class, allowing for seamless integration with WebGL’s shaders.

3. **Rendering Logic**

   - For **BasicCube.js**, the `gl.drawArrays()` method is used to render triangles based on defined vertex attributes.
   - For **IndexedCube.js**, the `gl.drawElements()` method renders indexed vertices.
   - For **ExperimentalCube.js**, explored new WebGL methods, such as connected primitives and procedural techniques, to render a unique cube.

4. **Shader Program**  
   Each cube class initializes a shader program for rendering, allowing for custom vertex and fragment shaders.

---

1. _BasicCube.js_

- Manual Vertex Definition: Defined all 36 vertices (12 triangles \* 3 vertices) manually, with each face consisting of two triangles, and assigned unique colors to each vertex for visual clarity.
- Centering: Centered the cube around the origin in the vertex shader by adjusting positions `(v.xyz -= 0.5)`
- Rendering: Rendered the cube using `gl.drawArrays(gl.TRIANGLES, 0, 36)`

2. _IndexedCube.js_

- Efficient Vertex Reuse: Defined 8 unique vertices for the cube's corners and created an index array to reference these vertices for rendering the 12 triangles, reducing redundant data.
- Centering & Coloring: Assigned colors to each vertex and centered the cube around the origin in the vertex shader same as before.
- Rendering: Rendered the cube using `gl.drawElements(gl.TRIANGLES, indexBuffer.count, indexBuffer.type, 0)`, reusing vertices.

3. _ExperimentalCube.js_

- Instanced Rendering: Defined 4 vertices for a single face and used `gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 6)` to render 6 instances, one for each face of the cube!
- Shader-Based Transformations: In the vertex shader I used `gl_InstanceID` to apply transformation matrices (instanceMatrices) and assign colors from an array.
- Efficiency: Efficient rendering by minimizing vertex data and minimizing data sent from CPU to GPU by leveraging instanced rendering and shader capabilities, ensured front-facing traingles using `gl_FrontFacing`.


## ⚙️ Final Project Proposal:

### 3D Data Visualization Dashboard for Hyperspectral Data

### Project Overview
This project involves creating an interactive 3D Data Visualization Dashboard to visualize hyperspectral datasets. This tool will enable users to upload hyperspectral data and explore it in a 3D environment. 

Visualization will include:

- **Geometric Objects**: Includes volume elements for spectral visualization and an external model loaded from a GLTF file.
- **Animations**: Animations such as rotations, translations, and changes to visualization parameters.
- **Texture Mapping**: Texture mapping to highlight spectral bands.

---

### Project Schedule

#### Week 1 
- **Research and Inspiration**: Study hyperspectral data visualization techniques
- **Gather Resources**: Collect sample datasets & 3D models
- **Initial Setup**: Set up the Three.js development environment

#### Week 2
- **Data Parsing and Preparation**: Functionality for uploading data
- **3D Scene Basics**: Basic 3D scene in Three.js with lighting, a camera, and a sample geometric object.
- **Geometric Representation**: Rendering hyperspectral data using geometric objects using cubes

#### Week 3 
- **Interactivity and Animations**: Object animations 
- **Advanced Rendering**: Texture mapping and model integration.

#### Week 4
- **Polish and Debugging**: Resolve any bugs
- **Documentation and Submission**: Bugs & usage instructions
---

### Project Technical Requirements

#### Technologies Used
- **Three.js**: Rendering the 3D visualization.
- **JavaScript**: Implement interactivity and manage user inputs.
- **React/HTML/CSS**: User interface.
- **Dataset**: Utilizing hyperspectral data in CSV format.

---

#### Intented use of Application
1. Upload hyperspectral data.
2. Explore data in a 3D space with interactive tools.
3. Adjust parameters to show specific spectral features.
