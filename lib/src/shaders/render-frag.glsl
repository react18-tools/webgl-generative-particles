#version 300 es
precision mediump float;

uniform vec4 c;/** Particle Color */

out vec4 oC;

void main(){
  oC=c;
}
