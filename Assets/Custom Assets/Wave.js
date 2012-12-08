#pragma strict

//fields
var direction : Vector2 = Vector2(1,0);
var amplitude : float = 1.0;
var harmonic : int = 1;
var speed : float = 5;

//Methods
/*public function getWavelength(width : int){
	var wavelength : float;
	wavelength = width * Mathf.Sqrt(2.0) * Mathf.Cos(Mathf.Deg2Rad*(Vector2.Angle(direction, Vector2(1,1))));

	return wavelength;
}*/


function Start () {
	SendMessageUpwards("AddWave",this.gameObject);
}

function Update () {
	
}