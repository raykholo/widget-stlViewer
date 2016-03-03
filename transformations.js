// namespace
var MeshesJS = MeshesJS || {};

;
(function() {


    function Transformations() {}

    Transformations.prototype.packAllObjects = function(center) {
        var name, object, size;
        var objects = [];
        var margins = 5;
        for (name in this.objects) {
            object = this.objects[name];
            this.transformObject(object);
            size = this.getObjectSize(object);
            size.x += margins;
            size.y += margins;
            objects.push({
                w: size.x,
                h: size.y,
                name: object.name,
                area: size.x * size.y
            });
        }
        objects.sort(sort.area);
        var packer = new GrowingPacker();
        packer.fit(objects);
        var i, result;
        size = {
            x: 0,
            y: 0
        };
        for (i = 0; i < objects.length; i++) {
            result = objects[i];
            object = this.objects[result.name];
            object.position.x = result.fit.x;
            object.position.y = result.fit.y;
            size.x = Math.max(size.x, result.fit.x + result.w);
            size.y = Math.max(size.y, result.fit.y + result.h);
            object.userData.box.update(object);
            this.dropObject(object);
        }
        if (center !== undefined && !center) {
            return null;
        }
        var difference = {
            x: (this.settings.buildVolume.size.x - size.x) / 2,
            y: (this.settings.buildVolume.size.y - size.y) / 2
        };
        for (name in this.objects) {
            object = this.objects[name];
            object.position.x += difference.x;
            object.position.y += difference.y;
            object.userData.box.update(object);
        }
        this.transform.update();
        //console.log(width, height);
    };




    MeshesJS.STLLoader = Transformations;

})();