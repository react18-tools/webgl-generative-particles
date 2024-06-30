#version 300 es
precision mediump float;

uniform float dt; /** time delta */
uniform sampler2D rg; /** random rg */
uniform vec2 g; /** gravity */
uniform vec2 o; /** origin*/

in vec2 p; /** position */
in float a; /** Age */
in vec2 v; /** Velocity */

out vec2 oP;
out float oA;
out vec2 oV;

void main() {
  if(a <= 0.0) {
    ivec2 ij = ivec2(gl_VertexID % 512, gl_VertexID / 512);
    vec2 rd = texelFetch(rg, ij, 0).rg;
    float th = rd.r * 6.2832;
    float x = cos(th);
    float y = sin(th);
    oP = o;
    oA = rd.r + rd.g;
    oV = vec2(x, y) * rd.g;
  } else {
    oP = p + v * dt;
    oA = a - dt;
    oV = v + g * dt;
  }
}
