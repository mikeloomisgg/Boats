
var ocean : OceanFieldGenerator;
// Water plane at y = 0
private var mag = 1.0;

private var ypos = 0.0;
private var blobs : Array;
private var ax  : int = 2;
private var ay : int = 2;
private var az : int = 2;

private var dampCoeff = .2;

private var engine = false;

function Start () {
	
//	mag = rigidbody.mass / (ax * ay) * 10;
	rigidbody.centerOfMass = Vector3 (0.0, -.5, 0.0);
	
	var bounds = GetComponent("MeshCollider").mesh.bounds.size;

	var width : float = bounds.x;
	var height : float = bounds.y;
	var length : float = bounds.z;

	blobs = new Array();
	blobs.length = ax * ay * az;
	
	xstep = 1.0 / (ax-1);
	ystep = 1.0 / (ay-1);
	zstep = 1.0 / (az-1);

	var i : int = 0;

	for (x=0;x<ax;x++){
		for (y=0;y<ay;y++){	
			for(z=0;z<az;z++){
				blobs[i] = Vector3 ((-0.5+x*xstep)*width, (-0.5+y*ystep)*height,(-.5+z*zstep)*length);
				i++;
			}
		}		
	}
}

function Update (){

}

function FixedUpdate () {
	for (i=0; i<blobs.length;i++) {
		var blob = blobs[i];
		
		wpos = transform.TransformPoint (blob);
		
	 	damp = rigidbody.GetPointVelocity(wpos).y;
		rigidbody.AddForceAtPosition (-Vector3.up * ((wpos.y) + dampCoeff*damp) , wpos);
	}
	print(transform.TransformPoint(blobs[2]));
}