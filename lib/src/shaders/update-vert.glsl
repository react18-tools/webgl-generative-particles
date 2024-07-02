#version 300 es
precision mediump float;

uniform float dt;/** time delta */
uniform sampler2D rg; /** random rg */
uniform vec2 g; /** gravity - forceField */
uniform vec2 o; /** origin*/
uniform vec2 aR; /** Angle Range */
uniform vec2 sR; /** scalar Speed Range pixels/sec */
uniform vec2 lR; /** life range */

in vec2 p; /** position */
in float l; /** Life */
in vec2 v; /** Velocity */

out vec2 oP;
out float oL;
out vec2 oV;

void main() {
  if(l <= 0.f) {
    int i = gl_VertexID;
    ivec2 ij = ivec2(i % 200, i / 200);
    vec2 rd = texelFetch(rg, ij, 0).rg;
    float th = aR.x + rd.r * (aR.y - aR.x);
    float x = cos(th);
    float y = sin(th);
    oP = o;
    oL = lR.x + rd.r * (lR.y - lR.x);
    oV = vec2(x, y) * (sR.x + rd.g * (sR.y - sR.x));
  } else {
    oP = p + v * dt;
    oL = l - dt;
    oV = v + g * dt;
  }
}
