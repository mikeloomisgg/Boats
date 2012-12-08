#pragma strict
#pragma implicit
#pragma downcast

var vertices : Vector3[];
var normals : Vector3[];

var width : int;
var height : int;

var newVertices : Vector3[];
var newUV : Vector2[];
var newTriangles : int[];
var newNormals : Vector3[];

var mesh = new Mesh();

var cam : Transform;
var toCam : Vector3[];


function Start () {

	var mf: MeshFilter = GetComponent(MeshFilter);
	cam = Camera.main.transform;
	toCam = new Vector3[vertices.length];
	


	mf.mesh = mesh;
	
	newVertices = new Vector3[vertices.length * 4];
	newTriangles = new int[vertices.length * 6];
	newNormals = new Vector3[vertices.length * 4];
	newUV = new Vector2[vertices.length * 4];
    
    var i : int = 0;
    
    for(i=0;i<vertices.length;i++){
    	//Assigning 4 vertices forming a square around each point in the other surface
    	newVertices[4*i] = vertices[i] + Vector3(-.5, 0, -.5);
    	newVertices[4*i + 1] = vertices[i] + Vector3( .5, 0, -.5);
    	newVertices[4*i + 2] = vertices[i] + Vector3(- .5, 0, .5);
    	newVertices[4*i + 3] = vertices[i] + Vector3( .5, 0, .5);

    	//Make sure that triangles are indexed clockwise for proper rendering
    	newTriangles[6*i] = 4*i;
    	newTriangles[6*i + 1] = 4*i + 2;
    	newTriangles[6*i + 2] = 4*i + 1;
    	
    	newTriangles[6*i + 3] = 4*i + 2;
    	newTriangles[6*i + 4] = 4*i + 3;
    	newTriangles[6*i + 5] = 4*i + 1;
    	
    	//Set all normals facing derivative direction from ocean field generator
    	newNormals[4*i] = Vector3.up;
    	newNormals[4*i + 1] = Vector3.up;
    	newNormals[4*i + 2] = Vector3.up;
    	newNormals[4*i + 3] = Vector3.up;
    	
    	//Set the UV coords
    	newUV[4*i] = Vector2(0,0);
    	newUV[4*i + 1] = Vector2(1,0);
    	newUV[4*i + 2] = Vector2(0,1);
    	newUV[4*i + 3] = Vector2(1,1);
    }
    
    mesh.vertices = newVertices;
    mesh.triangles = newTriangles;
    mesh.normals = newNormals;
    mesh.uv = newUV;
}


function Update () {

	var mf: MeshFilter = GetComponent(MeshFilter);
	mf.mesh = mesh;
	
	for(y=0;y<height;y++){
		for(x=0;x<width;x++){
//		if((y*width + x - 1) == -1){
//			newVertices[4*(y*width + x)] = vertices[y*width + x] + Vector3(-.5,(vertices[y*width + x].y - vertices[y*width + x + 1].y)/2, -.5);
//    		newVertices[4*(y*width + x) + 1] = vertices[(y*width + x)] + Vector3( .5,(vertices[y*width + x + 1].y - vertices[y*width + x].y)/2, -.5);
//    		newVertices[4*(y*width + x) + 2] = vertices[(y*width + x)] + Vector3(- .5,(vertices[y*width + x].y - vertices[y*width + x + 1].y)/2, .5);
//    		newVertices[4*(y*width + x) + 3] = vertices[(y*width + x)] + Vector3( .5,(vertices[y*width + x + 1].y - vertices[y*width + x].y)/2, .5);
//    	}
//    	else{
//    		newVertices[4*(y*width + x)] = vertices[y*width + x] + Vector3(-.5,(vertices[y*width + x - 1].y - vertices[y*width + x].y)/2, -.5);
//    		newVertices[4*(y*width + x) + 1] = vertices[(y*width + x)] + Vector3( .5,(vertices[y*width + x].y - vertices[y*width + x - 1].y)/2, -.5);
//    		newVertices[4*(y*width + x) + 2] = vertices[(y*width + x)] + Vector3(- .5,(vertices[y*width + x - 1].y - vertices[y*width + x].y)/2, .5);
//    		newVertices[4*(y*width + x) + 3] = vertices[(y*width + x)] + Vector3( .5,(vertices[y*width + x].y - vertices[y*width + x - 1].y)/2, .5);
//    	}

    	newNormals[4*(y*width + x)] = normals[y*width + x];
    	newNormals[4*(y*width + x) + 1] = normals[y*width + x];
    	newNormals[4*(y*width + x) + 2] = normals[y*width + x];
    	newNormals[4*(y*width + x) + 3] = normals[y*width + x];
    	
    	toCam[y*width + x] = cam.transform.position - (transform.position + vertices[y*width + x]);
    	
    	newVertices[4*(y*width + x)] = vertices[y*width + x] + Quaternion.FromToRotation (Vector3.up, toCam[y*width + x]) * Vector3(-.5,0,-.5) * (Mathf.Abs(Vector3.Cross(normals[y*width + x], Vector3.up).magnitude) + 1);
		newVertices[4*(y*width + x) + 1] = vertices[(y*width + x)] + Quaternion.FromToRotation (Vector3.up, toCam[y*width + x]) * Vector3(.5,0,-.5) * (Mathf.Abs(Vector3.Cross(normals[y*width + x], Vector3.up).magnitude) + 1);
		newVertices[4*(y*width + x) + 2] = vertices[(y*width + x)] + Quaternion.FromToRotation (Vector3.up, toCam[y*width + x]) * Vector3(-.5,0,.5) * (Mathf.Abs(Vector3.Cross(normals[y*width + x], Vector3.up).magnitude) + 1);
		newVertices[4*(y*width + x) + 3] = vertices[(y*width + x)] + Quaternion.FromToRotation (Vector3.up, toCam[y*width + x]) * Vector3(.5,0,.5) * (Mathf.Abs(Vector3.Cross(normals[y*width + x], Vector3.up).magnitude) + 1);

    	}
    }
	
	mesh.normals = newNormals;
	mesh.vertices = newVertices;
}