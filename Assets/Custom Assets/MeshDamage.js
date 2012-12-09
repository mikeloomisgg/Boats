#pragma strict
#pragma implicit
#pragma downcast



var mesh : Mesh;

//float array of how much kinetic energy will be absorbed before failure
//There should be a value for each normal in the mesh collider
var strengthCoeff : float[];
var materialStrength : float;



function Start () {
//	Create the hole-shape as a mesh object based on material and whatever is
//	causing the damage. Imagine a 3d worms type game where spheres negate the material
//	In this system the spheres will have edges that are formed to cause more realistic
//	edges to form on the meshes

//	When damage happens, we can add rigidbody free flying objects and particle effects
//	so that the materaial feels conserved.

//	Damage sphere can be a sphere mesh with a certain amount of polygon density
//	and a random displacement map on that sphere can simulate splintering perhaps


	
}

function DestroyMesh(location : Vector3, mass : float, velocity : Vector3){
	//Only the velocity vector that is parallel with the normal vector
	//of the mesh is transferred to the object
	
}

function Update () {
//	in the update what could be done? possibly checking
//	distances to see if the sub meshes need to be loaded for the client
	
}