// namespace 
var MeshesJS = MeshesJS || {};

;(function() {

    // Constructor
    function STLLoader() {}

    STLLoader.prototype.ColorLuminance = function(hex, lum) {
    
    	// validate hex string
    	hex = String(hex).replace(/[^0-9a-f]/gi, '');
    	if (hex.length < 6) {
    		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    	}
    	lum = lum || 0;
    
    	// convert to decimal and change luminosity
    	var rgb = "#", c, i;
    	for (i = 0; i < 3; i++) {
    		c = parseInt(hex.substr(i*2,2), 16);
    		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    		rgb += ("00"+c).substr(c.length);
    	}
    
    	return rgb;
    };

    // methods
    STLLoader.prototype.onGeometry = function(geometry) {

        var self = this;

        //render here, 
        var stl = new THREE.Group();        
        //var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );  //taken from slotted disk example of STLLoader.  Bright orange!  Gets your attention!

        var colorrandom = '#' + Math.floor(Math.random()*16777215).toString(16);
        var material = new THREE.MeshPhongMaterial( { color: colorrandom, specular: 0x111111, shininess: 200 } );  //taken from slotted disk example of STLLoader.  Bright orange!  Gets your attention!

        //return three mesh here
        var mesh = new THREE.Mesh( geometry, material );
        stl.add(mesh);
        
        //return Edge Helper
        var edgecolor = self.ColorLuminance(colorrandom, -0.2);	// -20% darker colorrandom 
        var edges = new THREE.EdgesHelper(mesh, edgecolor);      //ray changed edges from black to soft grey color // peter changed to shades (;)   //ray wins
        stl.add(edges);
        
        //var box = new THREE.BoxHelper(mesh, 0xffffff);      //at some point play around with using BoundingBox helper
        //stl.add(box);;
        
        var boxColor = self.ColorLuminance(colorrandom, 0.6); // 60% lighter colorrandom
        
        var bbox = new THREE.BoundingBoxHelper(mesh, boxColor);
        bbox.update();
        stl.add(bbox);
        
        chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneadd", stl);
        
    };
    STLLoader.prototype.onError = function(error) {};

    STLLoader.prototype.loadFile = function(file) {
        console.log("Inside STL.js loadFile");
        // self alias
        var self = this;

        // file reader instance
        var reader = new FileReader();

        // on file loaded
        reader.onloadend = function(event) {
            console.log("Inside STL.js loadFile:onLoadend");
            // if error/abort
            if (this.error) {
                self.onError(this.error);
                return;
            }

            // Parse ASCII STL
            if (typeof this.result === 'string' ) {
                console.log("Inside STL.js Found ASCII");
                self.loadString(this.result);
                return;
            }

            // buffer reader
            var view = new DataView(this.result);

            // get faces number
            try {
                var faces = view.getUint32(80, true);
            }
            catch(error) {
                self.onError(error);
                return;
            }

            // is binary ?
            var binary = view.byteLength == (80 + 4 + 50 * faces);

            if (! binary) {
                // get the file contents as string
                // (faster than convert array buffer)
                return;
            }

            // parse binary STL
            console.log("Inside STL.js Binary STL");
            self.loadBinaryData(view, faces);
        };

        // start reading file as array buffer
        reader.readAsArrayBuffer(file);
    };

    STLLoader.prototype.loadString = function(data) {
        var length, normal, patternNormal, patternVertex, result, text;
        var geometry = new THREE.Geometry();
        var patternFace = /facet([\s\S]*?)endfacet/g;

        while((result = patternFace.exec(data)) !== null) {
            text = result[0];

            patternNormal = /normal[\s]+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+/g;
            patternVertex = /vertex[\s]+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+/g;

            while((result = patternNormal.exec(text)) !== null) {
                normal = new THREE.Vector3(
                    parseFloat(result[1]),
                    parseFloat(result[3]),
                    parseFloat(result[5])
                );
            }

            while((result = patternVertex.exec(text)) !== null) {
                geometry.vertices.push(new THREE.Vector3(
                    parseFloat(result[1]),
                    parseFloat(result[3]),
                    parseFloat(result[5])
                ));
            }

            length = geometry.vertices.length;

            geometry.faces.push(new THREE.Face3(length-3, length-2, length-1, normal));
        }

        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        this.onGeometry(geometry);
    };

    STLLoader.prototype.loadBinaryData = function(view, faces) {
        console.log('Yay We are inside loadBinaryData:   Face:', faces, ', View: ', view );
        if (! view instanceof DataView) {
            var view = new DataView(view);
        }

        if (! faces) {
            try {
                var faces = view.getUint32(80, true);
            }
            catch(error) {
                this.onError(error);
                return;
            }
        }

        var dataOffset = 84;
        var faceLength = 12 * 4 + 2;
        var offset = 0;
        var geometry = new THREE.BufferGeometry();
        var vertices = new Float32Array( faces * 3 * 3 );
        var normals = new Float32Array( faces * 3 * 3 );

        for ( var face = 0; face < faces; face ++ ) {
            var start = dataOffset + face * faceLength;
            var normalX = view.getFloat32( start, true );
            var normalY = view.getFloat32( start + 4, true );
            var normalZ = view.getFloat32( start + 8, true );

            for (var i = 1; i <= 3; i ++) {
                var vertexstart = start + i * 12;

                normals[ offset ] = normalX;
                normals[ offset + 1 ] = normalY;
                normals[ offset + 2 ] = normalZ;

                vertices[ offset ] = view.getFloat32( vertexstart, true );
                vertices[ offset + 1 ] = view.getFloat32( vertexstart + 4, true );
                vertices[ offset + 2 ] = view.getFloat32( vertexstart + 8, true );

                offset += 3;
            }
        }

        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

        this.onGeometry(geometry);
    };

    // export module
    MeshesJS.STLLoader = STLLoader;

})();
