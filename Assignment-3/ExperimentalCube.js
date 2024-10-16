class ExperimentalCube {
    constructor(gl, vertexShader, fragmentShader) {
        vertexShader ||= `
            in vec4 aPosition;
            in vec4 aColor;

            uniform mat4 P;
            uniform mat4 MV;

            out vec4 vColor;

            void main() {
                vec4 v = aPosition;
                v.xyz -= 0.5; // Center cube around orgin by shifting each axis by -0.5
                gl_Position = P * MV * v;
                vColor = aColor;
             }
        `;
        fragmentShader = `
        in vec4 vColor;
        out vec4 fColor;

        void main() {
            fColor = vColor; // Render all faces with the same color regardless of orientation.
            }
        `;

        const positions = new Float32Array([
            // Front face
            0, 0, 1, 1, 0, 1, 1, 1, 1,
            0, 0, 1, 1, 1, 1, 0, 1, 1,
            // Back face
            0, 0, 0, 0, 1, 0, 1, 1, 0,
            0, 0, 0, 1, 1, 0, 1, 0, 0,
            // Top face
            0, 1, 0, 0, 1, 1, 1, 1, 1,
            0, 1, 0, 1, 1, 1, 1, 1, 0,
            // Bottom face
            0, 0, 0, 1, 0, 0, 1, 0, 1,
            0, 0, 0, 1, 0, 1, 0, 0, 1,
            // Right face
            1, 0, 0, 1, 1, 0, 1, 1, 1,
            1, 0, 0, 1, 1, 1, 1, 0, 1,
            // Left face
            0, 0, 0, 0, 0, 1, 0, 1, 1,
            0, 0, 0, 0, 1, 1, 0, 1, 0
        ]);

        const colors = new Float32Array([
            // Triangle 1&2, Front face (Green)
            0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0,
            // Triangle 3&4, Back face (Red)
            1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,
            // Triangle 5&6, Top face (Magenta)
            1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0,
            // Triangle 7&8, Bottom face (Cyan)
            0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0,
            // Triangle 9&10, Right face (Yellow)
            1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0,
            // Triangle 11&12, Left face (Blue)
            0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0
        ]);

        // Shader program initialization
        const program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        // Init position and color attributes using the Attribute helper class
        let aPosition = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);
        let aColor = new Attribute(gl, program, "aColor", colors, 4, gl.FLOAT);

        // Init instance attribute 
        let aInstance = gl.getAttribLocation(program.program, 'aInstance');
        // Create buffer to send instance data to gpu
        let buffer = gl.createBuffer();

        // Using Uniform buffer for instance model matrices
        gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
        gl.bufferData(gl.UNIFORM_BUFFER, [], gl.STATIC_DRAW);

        // Draw function using instanced rendering
        this.draw = () => {
            // Using the shader program
            program.use();

            // Bind and enable attributes
            aPosition.enable();
            aColor.enable();

            // Bind and enable Instance attribute
            gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
            // numComponents = 10 for num of instances, rest is default
            gl.vertexAttribPointer(aInstance, 10, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aInstance);

            // Draw 10 triangles using TRIANGLE_STRIP (just rendering a single instance, i.e. the 1 as last param)
            // (starting index for vertex attr, num of vertices to use per inst., num inst. to draw)
            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 36, 1);

            aPosition.disable();
            aColor.disable();

            // unbind and disable Instance attribute
            gl.disableVertexAttribArray(aInstance);
            gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        };

    }
}
