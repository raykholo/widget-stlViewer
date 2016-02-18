        parseStlBinary: function(stl) {
            var geo = new THREE.Geometry();
            var dv = new DataView(stl, 80); // 80 == unused header
            var isLittleEndian = true;
            var triangles = dv.getUint32(0, isLittleEndian);

            // console.log('arraybuffer length:  ' + stl.byteLength);
            // console.log('number of triangles: ' + triangles);

            var offset = 4;
            for (var i = 0; i < triangles; i++) {
                // Get the normal for this triangle
                var normal = new THREE.Vector3(
                    dv.getFloat32(offset, isLittleEndian),
                    dv.getFloat32(offset + 4, isLittleEndian),
                    dv.getFloat32(offset + 8, isLittleEndian)
                );
                offset += 12;

                // Get all 3 vertices for this triangle
                for (var j = 0; j < 3; j++) {
                    geo.vertices.push(
                        new THREE.Vector3(
                            dv.getFloat32(offset, isLittleEndian),
                            dv.getFloat32(offset + 4, isLittleEndian),
                            dv.getFloat32(offset + 8, isLittleEndian)
                        )
                    );
                    offset += 12
                }

                // there's also a Uint16 "attribute byte count" that we
                // don't need, it should always be zero.
                offset += 2;

                // Create a new face for from the vertices and the normal             
                geo.faces.push(new THREE.Face3(i * 3, i * 3 + 1, i * 3 + 2, normal));
            }

            // The binary STL I'm testing with seems to have all
            // zeroes for the normals, unlike its ASCII counterpart.
            // We can use three.js to compute the normals for us, though,
            // once we've assembled our geometry. This is a relatively 
            // expensive operation, but only needs to be done once.
            geo.computeFaceNormals();

            var mesh = new THREE.Mesh(
                geo,
                // new THREE.MeshNormalMaterial({
                //     overdraw:true
                // }
                new THREE.MeshLambertMaterial({
                    overdraw: true,
                    color: 0xaa0000,
                    shading: THREE.FlatShading
                }));
            //scene.add(mesh);
            this.sceneAdd(mesh);

            stl = null;
        },