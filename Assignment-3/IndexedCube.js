/////////////////////////////////////////////////////////////////////////////
//
//  IndexedCube.js
//
//  A cube defined of 12 triangles using vertex indices.
//

class IndexedCube {
    constructor(gl, vertexShader, fragmentShader) {
        vertexShader ||= `
            in vec4 aPosition;
            in vec4 aColor;

            uniform mat4 P;
            uniform mat4 MV;

            out vec4 vColor;

            void main() {
                vec4 v = aPosition;
                v.xyz -= 0.5; // Center cube around the origin
                gl_Position = P * MV * v;
                vColor = aColor;
            }
        `;
        fragmentShader ||= `
            in vec4 vColor;
            out vec4 fColor;

            void main() {
                fColor = gl_FrontFacing ? vColor : vec4(0, 0, 0, 0);
            }
        `;

        // Vertex positions
        const positions = new Float32Array([
            1, 1, 1,  // 0: Front_top_r
            0, 1, 1,  // 1: Front_top_left
            1, 0, 1,  // 2: Front_bottom_r
            0, 0, 1,  // 3: Front_bottom_left
            1, 1, 0,  // 4: Back_top_r
            0, 1, 0,  // 5: Back_top_left
            1, 0, 0,  // 6: Back_bottom_r
            0, 0, 0   // 7: Back_bottom_left
        ]);

        // Vertex colors
        const colors = new Float32Array([
            1.0, 0.0, 0.0, 1.0, // Front_top_r
            1.0, 0.0, 0.0, 1.0, // Front_top_left
            0.0, 1.0, 0.0, 1.0, // Front_bottom_r
            0.0, 1.0, 0.0, 1.0, // Front_bottom_left
            0.0, 0.0, 1.0, 1.0, // Back_top_r
            0.0, 0.0, 1.0, 1.0, // Back_top_left
            1.0, 1.0, 0.0, 1.0, // Back_bottom_r
            1.0, 1.0, 0.0, 1.0  // Back_bottom_left
        ]);

        // Indexing for each defined triangle (12 triangles)
        const indices = new Uint16Array([
            // Front 
            3, 2, 0, 3, 0, 1,
            // Back
            7, 4, 6, 7, 5, 4,
            // Top
            1, 0, 4, 1, 4, 5,
            // Bottom
            3, 6, 2, 3, 7, 6,
            // Right
            2, 6, 4, 2, 4, 0,
            // Left
            3, 1, 5, 3, 5, 7
        ]);


        // Initialize the shader program
        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        // Create attributes for positions and colors
        let aPosition = new Attribute(gl, program, 'aPosition', positions, 3, gl.FLOAT);
        let aColor = new Attribute(gl, program, 'aColor', colors, 4, gl.FLOAT);

        // Create the index buffer
        let indexBuffer = new Indices(gl, indices);

        this.draw = () => {
            // Use the shader program
            program.use();

            // binding and enabling the attributes
            aPosition.enable();
            aColor.enable();
            indexBuffer.enable();

            // Draw cube using indexed rendering! 
            gl.drawElements(gl.TRIANGLES, indexBuffer.count, indexBuffer.type, 0);

            // unbinding and disabling the attributes
            aPosition.disable();
            aColor.disable();
            indexBuffer.disable();
        };
    }
};
