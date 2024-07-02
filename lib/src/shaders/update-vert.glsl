#version 300 es

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
    int i = gl_VertexID + 1000 * int(dt);
    vec2 q = texelFetch(rg, ivec2((i + 2) % 200, 0), 0).rg;
    vec2 r = texelFetch(rg, ivec2(i % 200, i / 200), 0).rg;
    float th = aR.x + r.r * (aR.y - aR.x);
    float x = cos(th);
    float y = sin(th);
    oP = o;
    oL = lR.x + q.r * (lR.y - lR.x);
    oV = vec2(x, y) * (sR.x + r.g * (sR.y - sR.x));
  } else {
    oP = p + v * dt;
    oL = l - dt;
    oV = v + g * dt;
  }
}
