class ExperimentalCube {
    constructor(gl, vertexShader, fragmentShader) {
        vertexShader ||= `
            in vec4 aPosition;
            uniform mat4 P;
            uniform mat4 MV;
            out vec4 vColor;

            void main() {
                vec4 vertices[] = vec4[]( // Defining the face vertices in normalized space
                    vec4(0.0, 0.0, 1.0, 1.0),
                    vec4(1.0, 0.0, 1.0, 1.0),
                    vec4(0.0, 1.0, 1.0, 1.0),
                    vec4(1.0, 1.0, 1.0, 1.0)
                );

                // This took me forever... bulk of the work here
                mat4 instanceMatrices[6] = mat4[](
                    mat4(1, 0, 0, 0,   0, 1, 0, 0,   0, 0, 1, 0,    0, 0, 0, 1),     // Front
                    mat4(-1, 0, 0, 0,  0, 1, 0, 0,   0, 0, 01, 0,   1, 0, -1, 1),    // Back
                    mat4(1, 0, 0, 0,   0, 0, 1, 0,   0, 0, 0, 0,    0, 0, 0, 1),     // Top
                    mat4(1, 0, 0, 0,   0, 0, 1, 0,   0, 1, 0, 0,    0, 0, 0, 1),     // Bottom
                    mat4(0, 0, 1, 0,   0, 1, 0, 0,   0, 0, 0, 0,    0, 0, 0, 1),     // Right
                    mat4(0, 0, -1, 0,  0, -1, 0, 0,  1, 1, 1, 0,    0, 0, 0, 1)      // Left
                );

                vec4 colors[6] = vec4[](
                    vec4(0.0, 1.0, 0.0, 1.0),   // Green for front face
                    vec4(1.0, 0.0, 0.0, 1.0),   // Red for back face
                    vec4(1.0, 0.0, 1.0, 1.0),   // Magenta for top face
                    vec4(0.0, 1.0, 1.0, 1.0),   // Cyan for bottom face
                    vec4(1.0, 1.0, 0.0, 1.0),   // Yellow for right face
                    vec4(0.2, 0.3, 4, 1.0)      // Grayish-Blue for left face
                );

                
                
                vec4 v = instanceMatrices[gl_InstanceID] * vertices[gl_VertexID];
                gl_Position = P * MV * v;
                vColor = colors[gl_InstanceID];
            }
        `;

        fragmentShader = `
            in vec4 vColor;
            out vec4 fColor;

            void main() {
                fColor = vColor;
            }
        `;

        // Only defining 4 points for the cube! Pretty cool if ya ask me lol
        const positions = new Float32Array([
            0, 0, 1,
            1, 0, 1,
            0, 1, 1,
            1, 1, 1
        ]);

        const program = new ShaderProgram(gl, this, vertexShader, fragmentShader);
        let aPosition = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);

        this.draw = () => {
            program.use();
            aPosition.enable();

            // Drawing a TRIANGLE_STRIP with 4 vertices, instanced 6 times for each cube face
            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 6);

            aPosition.disable();
        };
    }
}
