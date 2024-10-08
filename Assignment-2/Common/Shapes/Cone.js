/////////////////////////////////////////////////////////////////////////////
//
//  Cone.js
//
//    Class for rendering a cone with a height of one, and base radius of
//      one (diameter of two).  The origin of the cone is in the middle of
//      the disk forming the bottom, with the apex of the cone one unit up
//      the +z axis.
//

'use strict;'

class Cone {
    constructor(gl, numSides, vertexShader, fragmentShader) {

        vertexShader ||= `
            uniform int  numSides; // number of slices around the perimeter
            uniform mat4 P;  // Projection transformation
            uniform mat4 MV; // Model-view transformation

            // Using to pass the color to the fragment shader
            out vec4 vColor;

            void main() {
                vec4  v;  // our generated vertex

                // If we're the first vertex, we're at the center of the disk
                //   forming either the base or top of the cone.  This means,
                if (gl_VertexID == 0) {
                    float iid = float(gl_InstanceID);
                    v = vec4(0.0, 0.0, iid, 1.0);

                    // Create a gradient from red (1.0, 0.0, 0.0) at base to violet (0.5, 0.0, 0.5) at apex.
                    // Red dec. and blue inc. as iid (the instance ID) goes from 0 (the base) to 1 (the apex).
                    vColor = vec4(1.0 - 0.5 * iid, 0.0, 0.5 * iid, 1.0); 
                }
                else {
                    // Since vertex ID zero is reserved for the center vertex
                    //   of the cone, we subtract one from the current 
                    //   gl_VertexID so we can get a useful angle index 
                    float vid = float(gl_VertexID) - 1.0;
                    const float Pi = 3.14159265358979;
                    float dir = gl_InstanceID == 0 ? 1.0 : -1.0;
                    float angle = dir * vid * 2.0 * Pi / float(numSides);
                    v = vec4(cos(angle), sin(angle), 0.0, 1.0);

                    // Red: if gl_InstanceID == 0 then make it full red else half red.
                    // Green: 0.0 no green.
                    // Blue: if gl_InstanceID == 0 then make it no blue else half blue.
                    // Alpha: 1.0 fully opaque.
                    vColor = vec4(gl_InstanceID == 0 ? 1.0 : 0.5, 0.0, gl_InstanceID == 0 ? 0.0 : 0.5, 1.0);
                }

                gl_Position = P * MV * v;
            }
        `;

        fragmentShader ||= `
            // Taking in color vect
            in vec4 vColor;
            out vec4 fColor;

            void main() {
                // Using color passed in from the vertex shader
                fColor = vColor;
            }
        `;

        let program = initShaders(gl, vertexShader, fragmentShader);
        gl.useProgram(program);

        let setupUniform = (program, name, value) => {
            let location = gl.getUniformLocation(program, name);
            this[name] = value;
            program[name] = ()  => {
                switch(value.type) {
                    case "vec4":
                        gl.uniform4fv(location, this[name]);
                        break;

                    case "mat4":
                        gl.uniformMatrix4fv(location, false, flatten(this[name])); 
                        break;
                }
            };
        };

        setupUniform(program, "MV", mat4());
        setupUniform(program, "P", mat4());
        setupUniform(program, "color", vec4(0.8, 0.8, 0.8, 1.0));

        let setupConstant = (name, value) => {
            let location = gl.getUniformLocation(program, name);
            gl.uniform1i(location, value);
        };

        setupConstant("numSides", numSides);
        gl.useProgram(null);

        this.draw = () => {
            gl.useProgram(program);

            program.MV();
            program.P();

            program.color();

            gl.drawArraysInstanced(gl.TRIANGLE_FAN, 0, numSides + 2, 3);

            gl.useProgram(null);
        };
    }

    get AABB() { 
        return { 
            min : [-1.0, -1.0, 0.0], 
            max : [1.0, 1.0, 1.0] 
        };
    }
};


