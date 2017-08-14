varying vec2 vUv;

void main( void ) {
	vUv = vec2(uv.x * 2.0, uv.y * 4.0);
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}