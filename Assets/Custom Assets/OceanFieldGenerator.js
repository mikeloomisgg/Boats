#pragma strict
#pragma implicit
#pragma downcast

var size = Vector2(50,50);

var color = Color.white;
var radius = .001;

var baseHeight : Vector3[];
var baseNormals : Vector3[];

var width : int;
var height : int;
var time : float = 0;

var tiles_x : int = 2;
var tiles_y : int = 2;

width = Mathf.Min(size.x, 50);
height = Mathf.Min(size.y, 50);

var surfaceMeshes = new Array();

var waveArray = new Array();
var usedWaveArray = new Array();

private var waveAmplitudes : float[];
private var waveHarmonics : int[];
private var waveSpeeds : float[];
private var waveDirections : Vector2[];


var waterMaterial : Material;



//var wave : WaveStruct = new WaveStruct("wind1",Vector2(1,0),1,3,.5);
//var wave2 : WaveStruct = new WaveStruct("wind2",Vector2(1,1),1,3,2);


function AddWave (passedWave : GameObject) {
	waveArray.Push(passedWave);
}

function GetWaterHeightAtLocation (x : float, z : float) {
	x = x / size.x;
	x = (x-Mathf.Floor (x)) * width;
	z = z / size.y;
	z = (z-Mathf.Floor (z)) * height;

	return 0;
}

function Start () {
	
	
	waveAmplitudes = new float[4];
	waveHarmonics = new int[4];
	waveSpeeds = new float[4];
	waveDirections = new Vector2[4];
	
	
	//var wave[] : SomeStruct = new SomeStruct("wind2",Vector2(0,0),0.0,0,0.0);
	//var waveStruct[2] : SomeStruct = new SomeStruct("wind",Vector2(0,0),0.0,0,0.0);
	//var waveStruct[3] : SomeStruct = new SomeStruct("wind",Vector2(0,0),0.0,0,0.0);
	
	var y = 0;
	var x = 0;
	
	baseHeight = new Vector3[width * height];
	baseNormals = new Vector3[width * height];
	
	for (y=0;y<height;y++)
	{
		for (x=0;x<width;x++)
		{
			var vertex = Vector3 (x, 0, y);
			baseHeight[y*width + x] = vertex;
			baseNormals[y*width + x] = Vector3(0,1,0);
		}
	}
	
	var tile : GameObject;
	for (y=0;y<tiles_y;y++) {
		for (x=0;x<tiles_x;x++) {
			
			var cy = y-tiles_y/2;
			var cx = x-tiles_x/2;
			tile = new GameObject("WaterTile");
			tile.transform.position.x = cx*size.x;
			tile.transform.position.z = cy*size.y;
			tile.transform.parent = transform;
			tile.AddComponent(surfaceMesh);
			tile.AddComponent(MeshFilter);
			tile.AddComponent(MeshRenderer);
			tile.GetComponent(MeshRenderer).material = waterMaterial;
			
			var newTile : surfaceMesh;
			newTile = tile.GetComponent(surfaceMesh);
			
			newTile.vertices = baseHeight;
			newTile.normals = baseNormals;
			newTile.width = width;
			newTile.height = height;
			
			surfaceMeshes.Add(tile);
		}
	}
}

//gizmos to see where pixels are while debugging
function OnDrawGizmos () {
    Gizmos.color = color;
    
    
    //for (var vector3 in base) 
      //  Gizmos.DrawWireSphere(transform.TransformPoint(vector3), radius);
    Gizmos.color = Color.red;
    var direction = new Vector3();
    
//    for(y=0;y<height;y++){
//		for(x=0;x<width;x++){
//			direction = baseNormals[y*width + x];
//    		Gizmos.DrawRay (baseHeight[y*width + x], direction);
//    	}
//    }

    
//    for (var tile : GameObject in surfaceMeshes){
//    	var newTile : surfaceMesh;
//    	newTile = tile.GetComponent(surfaceMesh);
//    	for(var vector3 : Vector3 in newTile.vertices){
//    		Gizmos.DrawWireSphere(tile.transform.TransformPoint(vector3), radius);
//    	}
//    }
}

function Update () {
	

	var displacement = new float[width*height];
	var partialx = new float[width*height];
	var partialy = new float[width*height];
	
	
	time = time + Time.deltaTime;
	
	for(i=0;i<waveArray.length;i++){
		waveAmplitudes[i] = (waveArray[i] as GameObject).GetComponent(Wave).amplitude;
		waveDirections[i] = (waveArray[i] as GameObject).GetComponent(Wave).direction;
		waveHarmonics[i] = (waveArray[i] as GameObject).GetComponent(Wave).harmonic;
		waveSpeeds[i] = (waveArray[i] as GameObject).GetComponent(Wave).speed;
	}
	
	//Wave formula: y = A sin((2pi/wavelength) * (x - vt)
	//The wavelength must be an odd harmonic in order to maintain continuous waves
	
	//figure out how many displacement waves are generated based on number of waves
	//, and use that number for a loop to apply the displacements
	
	


//loop over the base tile
	for (y=0;y<height;y++)
	{
		for (x=0;x<width;x++)
		{
			
			for (k=0;k<waveArray.length;k++){
				displacement[y*width + x] += waveAmplitudes[k] * Mathf.Sin((2 * Mathf.PI / (((width)/waveHarmonics[k])))*(waveDirections[k].x * x + waveDirections[k].y * y - waveSpeeds[k] * time));
				partialx[y*width + x] += (2 * Mathf.PI * waveDirections[k].x / (((0+width)/waveHarmonics[k])))*waveAmplitudes[k] * Mathf.Cos((2 * Mathf.PI / (((0+width)/waveHarmonics[k])))*(waveDirections[k].x * x + waveDirections[k].y * y - waveSpeeds[k] * time));
				partialy[y*width + x] += (2 * Mathf.PI * waveDirections[k].y / (((0+width)/waveHarmonics[k])))*waveAmplitudes[k] * Mathf.Cos((2 * Mathf.PI / (((0+width)/waveHarmonics[k])))*(waveDirections[k].x * x + waveDirections[k].y * y - waveSpeeds[k] * time));
			}
			baseNormals[y*width + x] = Vector3(-partialx[y*width + x]/Mathf.Abs(partialx[y*width + x] + partialy[y*width + x] + 1),1/Mathf.Abs(partialx[y*width + x] + partialy[y*width + x] + 1),-partialy[y*width + x]/Mathf.Abs(partialx[y*width + x] + partialy[y*width + x] + 1)).normalized;
			
			baseHeight[y*width + x].y = displacement[y*width + x];
		}
	}
}