parseStl: function(data) {  //Andrew Hodel JSC3D Function
            var FACE_VERTICES = 3;

            var HEADER_BYTES = 80;
            var FACE_COUNT_BYTES = 4;
            var FACE_NORMAL_BYTES = 12;
            var VERTEX_BYTES = 12;
            var ATTRIB_BYTE_COUNT_BYTES = 2;

            var mesh = new THREE.Mesh;
            mesh.vertexBuffer = [];
            mesh.indexBuffer = [];
            mesh.faceNormalBuffer = [];

            var isBinary = false;
            var reader = new JSC3D.BinaryStream(data);

            // Detect whether this is an ASCII STL stream or a binary STL stream by checking a snippet of contents.
            reader.skip(HEADER_BYTES + FACE_COUNT_BYTES);
            for (var i = 0; i < 256 && !reader.eof(); i++) {
                if (reader.readUInt8() > 0x7f) {
                    isBinary = true;
                    break;
                }
            }

                console.log('This is recognised as ' + (isBinary ? 'a binary' : 'an ASCII') + ' STL file.');

            if (!isBinary) {
                /*
                 * This should be an ASCII STL file.
                 * By Triffid Hunter <triffid.hunter@gmail.com>.
                 */

                var facePattern = 'facet\\s+normal\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+' +
                    'outer\\s+loop\\s+' +
                    'vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+' +
                    'vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+' +
                    'vertex\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+([-+]?\\b(?:[0-9]*\\.)?[0-9]+(?:[eE][-+]?[0-9]+)?\\b)\\s+' +
                    'endloop\\s+' +
                    'endfacet';
                var faceRegExp = new RegExp(facePattern, 'ig');
                var matches = data.match(faceRegExp);

                if (matches) {
                    var numOfFaces = matches.length;

                    mesh.faceCount = numOfFaces;
                    var v2i = {};

                    // reset regexp for vertex extraction
                    faceRegExp.lastIndex = 0;
                    faceRegExp.global = false;

                    // read faces
                    for (var r = faceRegExp.exec(data); r != null; r = faceRegExp.exec(data)) {
                        mesh.faceNormalBuffer.push(parseFloat(r[1]), parseFloat(r[2]), parseFloat(r[3]));

                        for (var i = 0; i < FACE_VERTICES; i++) {
                            var x = parseFloat(r[4 + (i * 3)]);
                            var y = parseFloat(r[5 + (i * 3)]);
                            var z = parseFloat(r[6 + (i * 3)]);

                            // weld vertices by the given decimal precision
                            var vertKey = x.toFixed(this.decimalPrecision) + '-' + y.toFixed(this.decimalPrecision) + '-' + z.toFixed(this.decimalPrecision);
                            var vi = v2i[vertKey];
                            if (vi === undefined) {
                                vi = mesh.vertexBuffer.length / 3;
                                v2i[vertKey] = vi;
                                mesh.vertexBuffer.push(x);
                                mesh.vertexBuffer.push(y);
                                mesh.vertexBuffer.push(z);
                            }
                            mesh.indexBuffer.push(vi);
                        }

                        // mark the end of the indices of a face
                        mesh.indexBuffer.push(-1);
                    }
                }
            }
            else {
                /*
                 * This is a binary STL file.
                 */

                reader.reset();

                // skip 80-byte's STL file header
                reader.skip(HEADER_BYTES);

                // read face count
                var numOfFaces = reader.readUInt32();

                // calculate the expected length of the stream
                var expectedLen = HEADER_BYTES + FACE_COUNT_BYTES +
                    (FACE_NORMAL_BYTES + VERTEX_BYTES * FACE_VERTICES + ATTRIB_BYTE_COUNT_BYTES) * numOfFaces;

                // is file complete?
                if (reader.size() < expectedLen) {
                        console.log('Failed to parse contents of the file. It seems not complete.');
                    return;
                }

                mesh.faceCount = numOfFaces;
                var v2i = {};

                // read faces
                for (var i = 0; i < numOfFaces; i++) {
                    // read normal vector of a face
                    mesh.faceNormalBuffer.push(reader.readFloat32());
                    mesh.faceNormalBuffer.push(reader.readFloat32());
                    mesh.faceNormalBuffer.push(reader.readFloat32());

                    // read all 3 vertices of a face
                    for (var j = 0; j < FACE_VERTICES; j++) {
                        // read coords of a vertex
                        var x, y, z;
                        x = reader.readFloat32();
                        y = reader.readFloat32();
                        z = reader.readFloat32();

                        // weld vertices by the given decimal precision
                        var vertKey = x.toFixed(this.decimalPrecision) + '-' + y.toFixed(this.decimalPrecision) + '-' + z.toFixed(this.decimalPrecision);
                        var vi = v2i[vertKey];
                        if (vi != undefined) {
                            mesh.indexBuffer.push(vi);
                        }
                        else {
                            vi = mesh.vertexBuffer.length / 3;
                            v2i[vertKey] = vi;
                            mesh.vertexBuffer.push(x);
                            mesh.vertexBuffer.push(y);
                            mesh.vertexBuffer.push(z);
                            mesh.indexBuffer.push(vi);
                        }
                    }

                    // mark the end of the indices of a face
                    mesh.indexBuffer.push(-1);

                    // skip 2-bytes' 'attribute byte count' field, since we do not deal with any additional attribs
                    reader.skip(ATTRIB_BYTE_COUNT_BYTES);
                }
            }

            // add mesh to scene
            if (!mesh.isTrivial()) {
                // Some tools (Blender etc.) export STLs with empty face normals (all equal to 0). In this case we ...
                // ... simply set the face normal buffer to null so that they will be calculated in mesh's init stage. 
                if (Math.abs(mesh.faceNormalBuffer[0]) < 1e-6 &&
                    Math.abs(mesh.faceNormalBuffer[1]) < 1e-6 &&
                    Math.abs(mesh.faceNormalBuffer[2]) < 1e-6) {
                    mesh.faceNormalBuffer = null;
                }

                // scene.addChild(mesh);
                this.sceneAdd(mesh);
            }
        },