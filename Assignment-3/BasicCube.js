/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

class BasicCube {
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
            // Testing for front facing traingles by making those not, black
            fColor = gl_FrontFacing? vColor : vec4(0,0,0,0);
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

        // Create the shader program (obfuscates initShaders)
        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        // Init the Attributes objects
        let aPosition = new Attribute(gl, program, 'aPosition', positions, 3, gl.FLOAT);
        let aColor = new Attribute(gl, program, 'aColor', colors, 4, gl.FLOAT);

        this.draw = () => {
            // Using the shader program
            program.use();

            // Bind and enable attributes
            aPosition.enable();
            aColor.enable();

            // Drawing the cube
            gl.drawArrays(gl.TRIANGLES, 0, 36);

            // unbinding and disabling the attributes
            aPosition.disable();
            aColor.disable();
        };
    }
};