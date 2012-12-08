#pragma strict
#pragma implicit
#pragma downcast


/*
function GaussianRnd () {
	var x1 = Random.value;
	var x2 = Random.value;
	
	if (x1 == 0.0)
		x1 = 0.01;
	
	return Mathf.Sqrt (-2.0 * Mathf.Log (x1)) * Mathf.Cos (2.0 * Mathf.PI * x2);
}

// Phillips spectrum
function P_spectrum (vec_k : Vector2, wind : Vector2) {
	var A = vec_k.x > 0.0 ? 1.0 : 0.05; // Set wind to blow only in one direction - otherwise we get turmoiling water
	
	var L = wind.sqrMagnitude / 9.81;
	var k2 = vec_k.sqrMagnitude;
	// Avoid division by zero
	if (vec_k.magnitude == 0.0) {
		return 0.0;
	}
	return A * Mathf.Exp (-1.0 / (k2*L*L) - Mathf.Pow (vec_k.magnitude * 0.1, 2.0)) / (k2*k2) * Mathf.Pow (Vector2.Dot (vec_k/vec_k.magnitude, wind/wind.magnitude), 2.0);// * wind_x * wind_y;
}

function Start () {

	// normal map size
	n_width = 128;
	n_height = 128;
	
	
	// Init the water height matrix
	data = new ComplexF[width*height];
	// lateral offset matrix to get the choppy waves
	data_x = new ComplexF[width*height];
	
	// tangent
	t_x = new ComplexF[width*height];
	t_y = new ComplexF[width*height];

	n_x = new ComplexF[n_width * n_height];
	n_y = new ComplexF[n_width * n_height];

	// Geometry size
	g_height = height + 1;	
	g_width = width + 1;
	
	var y = 0;
	var x = 0;
	
	baseHeight = new Vector3[width * height];
	
	for (y=0;y<height;y++)
	{
		for (x=0;x<width;x++)
		{
			var vertex = Vector3 (x, 0, y);
			baseHeight[y*width + x] = vertex;
			baseDdx[y*width + x] = vertex;
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
			newTile.width = width;
			newTile.height = height;
			
			surfaceMeshes.Add(tile);
		}
	}
	
	// Init wave spectra. One for vertex offset and another for normal map
	h0 = new ComplexF[width * height];
	n0 = new ComplexF[n_width * n_height];

	// Wind restricted to one direction, reduces calculations
	wind = Vector2 (windx, 0.0);

	// Initialize wave generator	
	for (y=0;y<height;y++) {
		for (x=0;x<width;x++) {
			yc = y < height / 2 ? y : -height + y;
			xc = x < width / 2 ? x : -width + x;
			vec_k = Vector2 (2.0 * Mathf.PI * xc / size.x, 2.0 * Mathf.PI * yc / size.z);
			h0[width * y + x] = ComplexF ( GaussianRnd(), GaussianRnd()) * 0.707 * Mathf.Sqrt (P_spectrum (vec_k, wind));
		}
	}
	
	for (y=0;y<n_height;y++) {
		for (x=0;x<n_width;x++) {	
			yc = y < n_height / 2 ? y : -n_height + y;
			xc = x < n_width / 2 ? x : -n_width + x;
			vec_k = Vector2 (2.0 * Mathf.PI * xc / (size.x / normal_scale), 2.0 * Mathf.PI * yc / (size.z / normal_scale));
			n0[n_width * y + x] = ComplexF ( GaussianRnd(), GaussianRnd()) * 0.707 * Mathf.Sqrt (P_spectrum (vec_k, wind));
		}
	}
	GenerateHeightmap ();
	GenerateBumpmaps ();
}
function GenerateBumpmaps () {
	if (!normalDone) { 
		for (idx=0;idx<2;idx++) {
			for (y = 0;y<n_height;y++) {
				for (x = 0;x<n_width;x++) {	
					yc = y < n_height / 2 ? y : -n_height + y;
					xc = x < n_width / 2 ? x : -n_width + x;
					vec_k = Vector2 (2.0 * Mathf.PI * xc / (size.x / normal_scale), 2.0 * Mathf.PI * yc / (size.z / normal_scale));

					iwkt = idx == 0 ? 0.0 : Mathf.PI / 2;
					coeffA = ComplexF (Mathf.Cos (iwkt), Mathf.Sin (iwkt));
					coeffB = coeffA.GetConjugate();

					ny = y > 0 ? n_height - y : 0;
					nx = x > 0 ? n_width - x : 0;

					n_x[n_width * y + x] = (n0[n_width * y + x] * coeffA + n0[n_width * ny + nx].GetConjugate() * coeffB) * ComplexF (0.0, -vec_k.x);				
					n_y[n_width * y + x] = (n0[n_width * y + x] * coeffA + n0[n_width * ny + nx].GetConjugate() * coeffB) * ComplexF (0.0, -vec_k.y);				
				}
			}
			Fourier.FFT2 (n_x, n_width, n_height, FourierDirection.Backward);
			Fourier.FFT2 (n_y, n_width, n_height, FourierDirection.Backward);

			for (i=0; i<n_width*n_height; i++){
				bump = Vector3 (n_x[i].Re*Mathf.Abs(n_x[i].Re), n_y[i].Re*Mathf.Abs(n_y[i].Re), n_width * n_height / scale / normal_scale * normalStrength).normalized * 0.5;
				pixelData[i] = Color (bump.x + 0.5, bump.y + 0.5, bump.z + 0.5);
				//			pixelData[i] = Color (0.5, 0.5, 1.0);			
			}
			if (idx==0) {
				textureA.SetPixels (pixelData, 0);
				textureA.Apply();
			}
			else {
				textureB.SetPixels (pixelData, 0);
				textureB.Apply();
			}
		}
		normalDone = true;
	}
	
}

function Update () {

}*/