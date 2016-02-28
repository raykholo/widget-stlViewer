/* global requirejs cprequire cpdefine chilipeppr THREE */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.7
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
        Three: '//i2dcui.appspot.com/geturl?url=http://threejs.org/build/three.min.js',
        ThreeTextGeometry: '//i2dcui.appspot.com/js/three/TextGeometry',
        ThreeFontUtils: '//i2dcui.appspot.com/js/three/FontUtils',
        ThreeHelvetiker: '//i2dcui.appspot.com/js/three/threehelvetiker',
        Clipper: '//i2dcui.appspot.com/js/clipper/clipper_unminified',
        STLLoader: '//preview.c9users.io/raykholo/widget-stlviewer/stl'
            //JSC3D: "//raw.githubusercontent.com/raykholo/widget-stlViewer/master/JSC3D"
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
        ThreeTextGeometry: ['Three'],
        ThreeFontUtils: ['Three', 'ThreeTextGeometry'],
        ThreeHelvetiker: ['Three', 'ThreeTextGeometry', 'ThreeFontUtils'],
        //JSC3D: ['Three', 'ThreeTextGeometry', 'ThreeFontUtils', 'ThreeHelvetiker'],
    }
});

cprequire_test(["inline:com-chilipeppr-widget-stlViewer"], function(myWidget) {

    // Test this element. This code is auto-removed by the chilipeppr.load()
    // when using this widget in production. So use the cpquire_test to do things
    // you only want to have happen during testing, like loading other widgets or
    // doing unit tests. Don't remove end_test at the end or auto-remove will fail.

    // Please note that if you are working on multiple widgets at the same time
    // you may need to use the ?forcerefresh=true technique in the URL of
    // your test widget to force the underlying chilipeppr.load() statements
    // to referesh the cache. For example, if you are working on an Add-On
    // widget to the Eagle BRD widget, but also working on the Eagle BRD widget
    // at the same time you will have to make ample use of this technique to
    // get changes to load correctly. If you keep wondering why you're not seeing
    // your changes, try ?forcerefresh=true as a get parameter in your URL.

    console.log("test running of " + myWidget.id);

    $('#com-chilipeppr-widget-stlViewer').css('position', 'relative');
    $('#com-chilipeppr-widget-stlViewer').css('background', 'none');
    $('#com-chilipeppr-widget-stlViewer').css('width', '300px');

    $('body').prepend('<div id="3dviewer"></div>');

    $('body').prepend('<div id="testDivForFlashMessageWidget"></div>');

    chilipeppr.load("#3dviewer", "https://raw.githubusercontent.com/chilipeppr/widget-3dviewer/master/auto-generated-widget.html", function() {
        cprequire(['inline:com-chilipeppr-widget-3dviewer'], function(threed) {
            threed.init({
                doMyOwnDragDrop: false
            });
            //$('#com-chilipeppr-widget-3dviewer .panel-heading').addClass('hidden');
            //autolevel.addRegionTo3d();
            //autolevel.loadFileFromLocalStorageKey('com-chilipeppr-widget-autolevel-recent8');
            //autolevel.toggleShowMatrix();

            // only init eagle widget once 3d is loaded
            // set doMyOwnDragDrop
            //ew.init(true);
            myWidget.init();
        });
    });
    /*
    $('body').prepend('<div id="test-drag-drop"></div>');
    chilipeppr.load("#test-drag-drop", "http://raw.githubusercontent.com/raykholo/elem-dragdrop/master/auto-generated-widget.html",

        function() {
            cprequire(
                ["inline:com-chilipeppr-elem-dragdrop"],

                function(dd) {
                    dd.init();
                    dd.bind("body", null);
                });
        });
        */

    chilipeppr.load(
        "#testDivForFlashMessageWidget",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        }
    );

    //$('body').append('<div id="com-chilipeppr-flash"></div>');
    chilipeppr.load("#com-chilipeppr-flash",
        "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",

        function() {
            console.log("mycallback got called after loading flash msg module");
            cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                //console.log("inside require of " + fm.id);
                fm.init();
            });
        });

    // init my widget
    //myWidget.init();
    $('#' + myWidget.id).css('margin', '10px');
    $('title').html(myWidget.name);

    myWidget.bind("body", null);

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-widget-stlViewer", ["chilipeppr_ready", "Clipper", "jqueryuiWidget", "STLLoader"], function(cp, clipper, jqui, stlR) {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-widget-stlViewer", // Make the id the same as the cpdefine id
        name: "Widget / stlViewer", // The descriptive name of your widget.
        desc: "This example widget gives you a framework for creating your own widget. Please change this description once you fork this template and create your own widget. Make sure to run runme.js every time you are done editing your code so you can regenerate your README.md file, regenerate your auto-generated-widget.html, and automatically push your changes to Github.", // A description of what your widget does
        url: "(auto fill by runme.js)", // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)", // The standalone working widget so can view it working by itself
        /**
         * Define pubsub signals below. These are basically ChiliPeppr's event system.
         * ChiliPeppr uses amplify.js's pubsub system so please refer to docs at
         * http://amplifyjs.com/api/pubsub/
         */
        /**
         * Define the publish signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        publish: {
            // Define a key:value pair here as strings to document what signals you publish.
            '/onExampleGenerate': 'Example: Publish this signal when we go to generate gcode.'
        },
        /**
         * Define the subscribe signals that this widget/element owns or defines so that
         * other widgets know how to subscribe to them and what they do.
         */
        subscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // so other widgets can publish to this widget to have it do something.
            // '/onExampleConsume': 'Example: This widget subscribe to this signal so other widgets can send to us and we'll do something with it.'
            '/com-chilipeppr-widget-3dviewer/recv3dObject': 'Waiting for 3D Viewer Callback'
        },
        /**
         * Document the foreign publish signals, i.e. signals owned by other widgets
         * or elements, that this widget/element publishes to.
         */
        foreignPublish: {
            // Define a key:value pair here as strings to document what signals you publish to
            // that are owned by foreign/other widgets.
            // '/jsonSend': 'Example: We send Gcode to the serial port widget to do stuff with the CNC controller.'
        },
        /**
         * Document the foreign subscribe signals, i.e. signals owned by other widgets
         * or elements, that this widget/element subscribes to.
         */
        foreignSubscribe: {
            // Define a key:value pair here as strings to document what signals you subscribe to
            // that are owned by foreign/other widgets.
            // '/com-chilipeppr-elem-dragdrop/ondropped': 'Example: We subscribe to this signal at a higher priority to intercept the signal. We do not let it propagate by returning false.'
            '/com-chilipeppr-elem-dragdrop/ondroppedSTL': 'We subscribe to this signal at a higher priority to intercept the signal, double check if it is an Eagle Brd file and if so, we do not let it propagate by returning false. That way the 3D Viewer, Gcode widget, or other widgets will not get Eagle Brd file drag/drop events because they will not know how to interpret them.'
        },
        /**
         * The main object for this widget is the STL Loader so
         * it is available in this property for all methods to refer to.
         */
        stlloader: null,
        object: null, // Used in stl.js to push the combined STL plate to sceneAdd
        /**
         * All widgets should have an init method. It should be run by the
         * instantiating code like a workspace or a different widget.
         */
        init: function() {
            console.log("I am being initted. Thanks.");

            console.log('adding check: are we getting a defined callback from require: ', stlR);
            console.log('and do we have the namespace:', MeshesJS);


            this.stlloader = new MeshesJS.STLLoader();
            console.log('and do we have the loader object, ', this.stlloader);

            this.setupUiFromLocalStorage();
            this.btnSetup();
            this.forkSetup();

            //$('#com-chilipeppr-widget-stlViewer').click(this.loadChiliPepprGcode.bind(this));

            this.setupSlicingParamUI();
            this.bindSlicingParam();
            this.setupParamsFromLocalStorage();

            this.setupDragDrop();

            this.init3d();

            //this.testCube();
            
            ///com-chilipeppr-widget-3dviewer/recv3dObject
            chilipeppr.subscribe("com-chilipeppr-widget-3dviewer/recv3dObject", this, this.onRecv3dObject);

            console.log("I am done being initted.");
        },
        setupSlicingParamUI: function() {
            var that = this;

            console.log("paramElements:  ", this.paramElements);


            var paramTableHtmlString = "";
            paramTableHtmlString += that.createHtmlElements(that.paramElements.printSettings);
            $('#' + that.id + ' .slicingParamTablePrintSettings').append(paramTableHtmlString);


            paramTableHtmlString = "";
            paramTableHtmlString += that.createHtmlElements(that.paramElements.filamentSettings);
            $('#' + that.id + ' .slicingParamTableFilamentSettings').append(paramTableHtmlString);

            paramTableHtmlString = "";
            paramTableHtmlString += that.createHtmlElements(that.paramElements.machineSettings);
            $('#' + that.id + ' .slicingParamTableMachineSettings').append(paramTableHtmlString);






        },

        paramElements: {

            printSettings: {
                layerHeight: {
                    name: "Layer Height",
                    type: "number",
                    properties: "min=\"0.01\" max=\"1.8\" step=\"0.01\" value=\"0.3\"",
                    units: "mm",
                    defaultValue: 0.3,
                    nameforSlic3r: "--layer-height"
                },

                numPerimeters: {
                    name: "Number Perimeters",
                    type: "number",
                    properties: "min=\"1\" max=\"99\" step=\"1\" value=\"3\"",
                    units: "shells",
                    defaultValue: 3,
                    nameforSlic3r: "--perimeters"
                },

                infillPattern: {
                    name: "Infill Pattern",
                    type: "select",
                    values: ["Honeycomb", "Rectlinear"],
                    // defaultValue: "Rectlinear"
                    defaultValue: "Honeycomb",
                    nameforSlic3r: "--fill-pattern"
                },

                infillPercentage: {
                    name: "Infill Percentage",
                    type: "number",
                    properties: "min=\"1\" max=\"100\" step=\"1\" value=\"30\"",
                    units: "%",
                    defaultValue: 30,
                    nameforSlic3r: "fill-density"
                },

                topLayers: {
                    name: "Top Solid Layers",
                    type: "number",
                    properties: "min=\"1\" max=\"100\" step=\"1\" value=\"3\"",
                    units: "layers",
                    defaultValue: 3,
                    nameforSlic3r: "--top-solid-layers"
                },

                bottomLayers: {
                    name: "Bottom Solid Layers",
                    type: "number",
                    properties: "min=\"1\" max=\"100\" step=\"1\" value=\"3\"",
                    units: "layers",
                    defaultValue: 3,
                    nameforSlic3r: "--bottom-solid-layers"
                },
                printSpeed: {
                    name: "Print Speed",
                    type: "number",
                    properties: "min=\"1\" max=\"300\" step=\"1\" value=\"65\"",
                    units: "mm/s",
                    defaultValue: 65,
                    nameforSlic3r: "--perimeter-speed" //Technically this needs to get broken into perimeter speed (60), infull speed (80), and support material speed (60)
                },

                travelSpeed: {
                    name: "Travel Speed",
                    type: "number",
                    properties: "min=\"1\" max=\"300\" step=\"1\" value=\"110\"",
                    units: "mm/s",
                    defaultValue: 110,
                    nameforSlic3r: "--travel-speed"
                },

                firstLayerSpeed: {
                    name: "First Layer Speed",
                    type: "number",
                    properties: "min=\"1\" max=\"300\" step=\"1\" value=\"65\"",
                    units: "mm/s",
                    defaultValue: 65,
                    nameforSlic3r: "--first-layer-speed"
                },

                //add fields for raft/ brim/ skirt
                //xy-size-compensation
                generateSupport: {
                    name: "Generate Support",
                    type: "checkbox",
                    defaultValue: false,
                    nameforSlic3r: "--support-material"
                },

                spiralVaseMode: {
                    name: "Spiral Vase",
                    type: "checkbox",
                    defaultValue: false,
                    nameforSlic3r: "--spiral-vase"
                }

            },
            filamentSettings: {
                filamentDiameter: {
                    name: "Filament Diameter",
                    type: "number",
                    properties: "min=\"0.01\" max=\"10\" step=\".01\" value=\"1.7\"",
                    units: "mm",
                    defaultValue: 1.7,
                    nameforSlic3r: "--filament-diameter"
                },
                extrusionMultiplier: {
                    name: "Extrusion Multiplier",
                    type: "number",
                    properties: "min=\"0.01\" max=\"10\" step=\".01\" value=\"1\"",
                    units: "<b>x</b>",
                    defaultValue: 1,
                    nameforSlic3r: "--extrusion-multiplier"
                },
                firstLayerTemp: {
                    name: "First Layer Temp",
                    type: "number",
                    properties: "min=\"1\" max=\"1000\" step=\"1\" value=\"200\"",
                    units: "&#8451",
                    defaultValue: 200,
                    nameforSlic3r: "--first-layer-temperature"
                },
                otherLayerTemp: {
                    name: "Other Layer Temp",
                    type: "number",
                    properties: "min=\"1\" max=\"1000\" step=\"1\" value=\"200\"",
                    units: "&#8451",
                    defaultValue: 200,
                    nameforSlic3r: "--temperature"
                },
                firstLayerBedTemp: {
                    name: "First Layer Bed",
                    type: "number",
                    properties: "min=\"1\" max=\"1000\" step=\"1\" value=\"200\"",
                    units: "&#8451",
                    defaultValue: 200,
                    nameforSlic3r: "--first-layer-bed-temperature"
                },
                otherLayerBedTemp: {
                    name: "Other Layer Bed",
                    type: "number",
                    properties: "min=\"1\" max=\"1000\" step=\"1\" value=\"200\"",
                    units: "&#8451",
                    defaultValue: 200,
                    nameforSlic3r: "--bed-temperature"
                }
                //--cooling
            },
            machineSettings: {
                nozzleDiameter: {
                    name: "Nozzle Diameter",
                    type: "number",
                    properties: "min=\"0.1\" max=\"10\" step=\".01\" value=\"0.4\"",
                    units: "mm",
                    defaultValue: 0.4,
                    nameforSlic3r: "--nozzle-diameter"
                },
                bedSizeX: {
                    name: "Bed Size X",
                    type: "number",
                    properties: "min=\"1\" max=\"2000\" step=\"1\" value=\"200\"",
                    units: "mm",
                    defaultValue: 200,
                    nameforSlic3r: null
                },

                bedSizeY: {
                    name: "Bed Size Y",
                    type: "number",
                    properties: "min=\"1\" max=\"2000\" step=\"1\" value=\"200\"",
                    units: "mm",
                    defaultValue: 200,
                    nameforSlic3r: null
                },
                //need x, y bed center -- this is what we pass to Slic3r
                //z offset?
                startGcode: {
                    name: "Start Gcode",
                    type: "textarea",
                    defaultValue: "G28 ; home all axes\n;G1 Z5 F5000 ; lift nozzle",
                    nameforSlic3r: "--start-gcode"
                },
                endGcode: {
                    name: "End Gcode",
                    type: "textarea",
                    defaultValue: "M104 S0 ; turn off temperature\nM140 S0\nG28 X0  ; home X axis\nM84     ; disable motors",
                    nameforSlic3r: "--end-gcode"
                }
            }
            //add 4th text area for advanced users that want to append their other parameters.

        },
        buildSlic3rParamString: function() {
            var that = this;
            //new empty string to build
            var slic3rParamString = "";

            //for each key in paramElements, check that there is a corresponding value in selectedParams.  If nothing use all defaults.  
            $.each(that.paramElements, function(key, value) {
                console.log("level 1. key:  ", key, " value:  ", value);

                $.each(value, function(key2, value2) {
                    console.log("level 2. key:  ", key2, " value:  ", value2, "selectedParams.key: ", that.selectedParams[key2]);

                    if (!(that.selectedParams[key2] == undefined) && (value2.nameforSlic3r != null)) {
                        console.log("Can use selected value:  ", that.selectedParams[key2]);

                        //add paramElements[key].nameForSlic3r to string.  Add space.  Add value.  Add space. Repeat.
                        switch (value2.type) {
                            case "number":
                                slic3rParamString += value2.nameforSlic3r + " " + String(that.selectedParams[key2]) + " ";
                                break;
                            case "textarea":
                                var textAreaAsString = JSON.stringify(that.selectedParams[key2]);
                                textAreaAsString = textAreaAsString.replace(/\"/g, "");
                                //console.log ("textAreaAsString:  ", textAreaAsString);
                                slic3rParamString += value2.nameforSlic3r + " " + textAreaAsString + " ";
                                break;
                            case "select":
                                //slic3rParamString += value2.nameforSlic3r + " " + String(that.selectedParams[key2]) + " ";
                                var selectAsString = that.selectedParams[key2];
                                selectAsString = selectAsString.toLowerCase();
                                //console.log ("selectAsString:  ", textAreaAsString);
                                slic3rParamString += value2.nameforSlic3r + " " + selectAsString + " ";
                                break;
                            case "checkbox":
                                if (that.selectedParams[key2] == true) {
                                    slic3rParamString += value2.nameforSlic3r + " ";
                                }
                                break;
                        }

                    }
                    else {
                        console.log("VALUE UNDEFINED!");
                    }


                });



            });




            //log completed string.
            console.log("Slic3r Param String:  ", slic3rParamString);

            chilipeppr.publish(
                "/com-chilipeppr-elem-flashmsg/flashmsg",
                "Slic3r Param String",
                slic3rParamString,
                100000
            );
        },

        createHtmlElements: function(inputJSON) { //jQuery is fun
            var that = this;
            var htmlString = "";
            $.each(inputJSON, function(index, elem) {
                console.log("index:", index, "elem:", elem);

                htmlString += "<tr>";
                htmlString += "<td class=\"text-nowrap\" style=\"white-space: nowrap\">" + elem.name + "</td>";
                htmlString += "<td align=\"right\">";

                if (elem.type == "number") {
                    htmlString += "<div class=\"input-group input-group-sm\">";

                    htmlString += "<input type=\"number\" id=\"exampleInputAmount\" class=\"form-control slicing-param slicing-param-" + index + "\"" + elem.properties + ">";
                    htmlString += "<div class=\"input-group-addon\">" + elem.units + "</div>";

                    htmlString += "</div>";
                }
                else if (elem.type == "select") {
                    htmlString += "<select class=\"form-control slicing-param slicing-param-" + index + "\" input-sm\" style=\"width:auto\">";

                    // console.log ("dropdown values:  ", elem.values);
                    for (var i = 0; i < elem.values.length; i++) {
                        htmlString += "<option value=\"" + elem.values[i] + "\">" + elem.values[i] + "</option>";
                    }

                    htmlString += "</select>";
                }
                else if (elem.type == "checkbox") {
                    htmlString += "<label>";

                    htmlString += "<input class=\"slicing-param slicing-param-" + index + "\" input-sm\" type=\"checkbox\" value=\"\">";


                    htmlString += "</label>";
                }

                else if (elem.type == "textarea") {
                    htmlString += "<textarea rows=\"4\" cols=\"20\" class=\"form-control slicing-param slicing-param-" + index + "\" style=\"max-width:300px; max-height:300px\">"; //style=\"resize: none\"
                    htmlString += elem.defaultValue;
                    htmlString += "</textarea>";

                }

                htmlString += "</td>";
                htmlString += "</tr>";

            });
            console.log("htmlString:  ", htmlString);
            return (htmlString);
        },


        bindSlicingParam: function() {

            // lets bind some onchange events
            var that = this;
            $('#' + this.id + ' .slicing-param').each(function(index, elem) {
                console.log("index:", index, "elem:", elem);
                var el = $(elem);
                console.log("el: ", el);
                el.change(that.onParamChange.bind(that));


                var clsName = el.context.className;
                console.log("clsName:  ", clsName);

                var defaultValue = el.context.defaultValue;
                //console.log ("defaultValue:  ", defaultValue);

                that.selectedParams[that.getUniqueParamName(clsName)] = defaultValue;
            });
        },
        onParamChange: function(el, el2) {
            console.log("got change on el:", el, el2);

            // Extract the data we need from the passed object
            var clsName = el.target.className; //I added the $( ) wrapper around el b/c error el.attr is not a function
            var value = el.target.value;
            var ticked = el.target.checked; //looking through el to see what target contains checked



            console.log("clsName:  ", clsName, ' value: ', value, ' ticked: ', ticked); //clsName returns the classes (all of them) now

            var valueToWrite;
            if (!value) {
                //console.log ("Not value.  ticked: ", ticked);
                valueToWrite = ticked; //set valueToWrite to checkbox value
                //may need to convert bool to string .ToString()
            }
            else
                valueToWrite = value;

            console.log("valueToWrite:  ", valueToWrite);


            this.selectedParams[this.getUniqueParamName(clsName)] = valueToWrite;

            console.log("selectedParams:  ", this.selectedParams);

            //localStorage.setItem(this.id + "param");
            this.saveParamsLocalStorage();
        },
        selectedParams: {},
        getUniqueParamName: function(input) {
            var regExPattern = /slicing-param-[a-zA-Z]+/;
            var regExpResult = input.match(regExPattern);
            var regExpResultAsString = regExpResult[0];

            regExpResultAsString = regExpResultAsString.replace('slicing-param-', '');

            return regExpResultAsString;
        },
        combineInputDataTypes: function(value, ticked) {
            var valueToWrite;
            if (!value) {
                //console.log ("Not value.  ticked: ", ticked);
                valueToWrite = ticked; //set valueToWrite to checkbox value
                //may need to convert bool to string .ToString()
            }
            else {
                valueToWrite = value;
            }
            return valueToWrite;
        },
        setupParamsFromLocalStorage: function() {
            var that = this;

            var options = localStorage.getItem(this.id + '-params');
            if (options) {
                // if (true) {
                options = $.parseJSON(options);
                //options.catchMe = "gotcha!"; //for testing
                console.log("just evaled params: ", options);

                $.each(that.paramElements, function(key, value) {
                    console.log("level 1. key:  ", key, " value:  ", value);

                    $.each(value, function(key2, value2) {
                        console.log("level 2. key:  ", key2, " value:  ", value2, "options.key: ", options[key2]);

                        if ((options[key2] == value2.defaultValue) || (options[key2] == undefined)) { //FIXED:  think I need to add case that particular key does not exist. 
                            console.log("default match!");

                            that.selectedParams[key2] = value2.defaultValue;



                            /*
                            var elemName = '#' + that.id + " .slicing-param-" + key2;
                            console.log("Recreated html class: ", elemName);

                            if (value2.type == "select") {
                                console.log("prop for select");
                                //var valToWrite = that.selectedParams[key2];
                                $(elemName).val(that.selectedParams[key2]).prop('selected', true);
                            }
                            else {
                                $(elemName).val(that.selectedParams[key2]);
                            }*/


                        }
                        else { //defaultValue does not equal stored value, but storedValue exists.  Use storedValue
                            console.log("overwriting default:  ");

                            that.selectedParams[key2] = options[key2];

                            var elemName = '#' + that.id + " .slicing-param-" + key2;
                            console.log("Recreated html class: ", elemName);
                            /*
                            var valToWrite;
                            
                            if (value2.type == "number") {
                                console.log ("type = number");
                                valToWrite = parseInt (value, 10);
                            }*/
                            if (value2.type == "select") {
                                console.log("prop for select");
                                //var valToWrite = that.selectedParams[key2];
                                $(elemName).val(that.selectedParams[key2]).prop('selected', true);
                            }
                            else {
                                $(elemName).val(that.selectedParams[key2]);
                            }

                        }



                    });



                });
                console.log("done checking stored Params, selectedParams now updated:  ", that.selectedParams);


            }
            else {
                console.log("param first load");


                $('#' + this.id + ' .slicing-param').each(function(index, elem) {
                    console.log("index:", index, "elem:", elem);
                    var el = $(elem);
                    //console.log("el: ", el);
                    // el.change(that.onParamChange.bind(that));


                    var clsName = el.context.className;
                    //console.log("clsName:  ", clsName);

                    var defaultValue = el.context.defaultValue;
                    //console.log ("defaultValue:  ", defaultValue);

                    //that.selectedParams[that.getUniqueParamName(clsName)] = defaultValue;




                });


            }

        },
        onRecv3dObject: function () {
            
        },

        setupParamsFromLocalStorage_old: function() { //this func doesn't work yet. 

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items
            var that = this;

            var defaultParams = this.selectedParams;
            //defaultParams.infillPattern = "Rectlinear";
            console.log("Default Params:  ", defaultParams);

            var options = localStorage.getItem(this.id + '-params');
            if (options) {
                options = $.parseJSON(options);
                options.catchMe = "gotcha!"; //for testing
                console.log("just evaled params: ", options);

                //forEach param, if the key exists in selectedParams this means it is a needed key
                //then replace the key with this one. then update html?  
                $.each(options, function(key, value) {
                    //key = JSON.stringify(key);
                    //console.log('Debug:  Key = ', key); //, So KEY contains the NAME of the key (value)
                    var defKey = defaultParams[key]; // but defaultparams.(.....) you want the ... to be the substituted name? (i.e insert key here)
                    console.log("key:  ", key, " value:  ", value, "defKey:  ", defKey);
                    //if (defaultParams.key != null) {
                    if (defaultParams.hasOwnProperty(key)) { //key exists in json. Let's have some fun.
                        // if (typeof(defaultParams.key) !== 'undefined') {
                        console.log("do: ", key);

                        var elemName = '#' + that.id + " .slicing-param-" + key;
                        console.log("Recreated html class: ", elemName);

                        $(elemName).val(value);

                        console.log("that.selectedParams.key:  ", that.selectedParams[key]);
                        //that.selectedParams.key = value;

                    }
                    else
                        console.log("Caught: ", key);

                });


            }

            // this.options.tabShowing

            //this.options = options;
            console.log("params:", options);

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveParamsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.selectedParams;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-params', optionsStr);
        },


        testCube: function() {
            var geometry = new THREE.BoxGeometry(10, 10, 10);
            var material = new THREE.MeshBasicMaterial({
                color: 0x00ff00
            });
            var cube = new THREE.Mesh(geometry, material);
            cube.position.set(10, 10, 5);

            var edges = new THREE.EdgesHelper(cube, 0x000000);

            this.sceneAdd(cube);
            this.sceneAdd(edges);
        },

        /**
         * Call this method from init to setup all the buttons when this widget
         * is first loaded. This basically attaches click events to your 
         * buttons. It also turns on all the bootstrap popovers by scanning
         * the entire DOM of the widget.
         */
        btnSetup: function() {

            // Chevron hide/show body
            var that = this;
            $('#' + this.id + ' .hidebody').click(function(evt) {
                console.log("hide/unhide body");
                if ($('#' + that.id + ' .panel-body').hasClass('hidden')) {
                    // it's hidden, unhide
                    that.showBody(evt);
                }
                else {
                    // hide
                    that.hideBody(evt);
                }
            });

            // Ask bootstrap to scan all the buttons in the widget to turn
            // on popover menus
            $('#' + this.id + ' .btn').popover({
                delay: 1000,
                animation: true,
                placement: "auto",
                trigger: "hover",
                container: 'body'
            });

            // Init Say Hello Button on Main Toolbar
            // We are inlining an anonymous method as the callback here
            // as opposed to a full callback method in the Hello Word 2
            // example further below. Notice we have to use "that" so 
            // that the this is set correctly inside the anonymous method
            $('#' + this.id + ' .btn-sayhello').click(function() {
                console.log("saying hello");
                // Make sure popover is immediately hidden
                $('#' + that.id + ' .btn-sayhello').popover("hide");
                // Show a flash msg

                chilipeppr.publish(
                    "/com-chilipeppr-elem-flashmsg/flashmsg",
                    "Slicer Params",
                    JSON.stringify(that.selectedParams, null, 2),
                    1000
                );
            });

            $('#' + this.id + ' .btn-testSlic3rParams').click(this.buildSlic3rParamString.bind(this));
            $('#' + this.id + ' .btn-resetParams').click(this.onResetParamBtnClick.bind(this));
            $('#' + this.id + ' .btn-slice').click(this.onSliceBtnClick.bind(this));


            // Init Hello World 2 button on Tab 1. Notice the use
            // of the slick .bind(this) technique to correctly set "this"
            // when the callback is called
            $('#' + this.id + ' .btn-helloworld2').click(this.onHelloBtnClick.bind(this));

        },
        onResetParamBtnClick: function(evt) {
            localStorage.removeItem(this.id + '-params');
            this.setupParamsFromLocalStorage();
        },
        sliceBtnWaitingForCallback: false,
        onSliceBtnClick: function(evt) {
            
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/request3dObject");
            
            this.sliceBtnWaitingForCallback = true;
            
            /*
            var settings = {
                "async": true,
                "crossDomain": true,
                //"url": "http://mockbin.org/bin/390b962c-e678-4e15-acee-74510d881057?foo=bar&foo=baz",
                //"url": "//i2dcui.appspot.com/slingshot?url=http://mockbin.org/bin/93071bc3-e3bd-4424-bd11-1ac27e08c32c?foo=bar&foo=baz",
                // "url": "http://mockbin.org/bin/c1427327-ade1-4cfe-8820-507ac379027c?foo=bar&foo=baz",
                "url": "http://mockbin.org/bin/e1372990-3a3a-4100-b085-b7a80c949c30?foo=bar&foo=baz",
                "method": "POST",
                "headers": {
                    //"cookie": "foo=bar; bar=baz",
                    "accept": "application/json",
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "foo": "bar",
                    "bar": "baz"
                }
            };

            $.ajax(settings).done(function(response) {
                console.log("ajax response: ", response);
                
                chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondropped", response, "composition.gcode");
                
            });*/

            var formData = new FormData();
            
            /*
            var ajaxRequest = $.ajax({
                type: "POST",
                url: "api/Slic3rAPI/STLtoGcode",
                contentType: false, //'application/json; charset=utf-8',
                processData: false,
                data: formData,
                success: function(data) {
                    //alert('Returned Data: ' + JSON.stringify(data));
                    $('#txtOutput').val(JSON.stringify(data));
                },
                error: function(response) {
                    alert('Error: ' + JSON.stringify(response.responseText));
                }
            });
            */


        },

        /**
         * onHelloBtnClick is an example of a button click event callback
         */
        onHelloBtnClick: function(evt) {
            console.log("saying hello 2 from btn in tab 1");
            chilipeppr.publish(
                '/com-chilipeppr-elem-flashmsg/flashmsg',
                "Hello 2 Title",
                "Hello World 2 from Tab 1 from widget " + this.id,
                2000 /* show for 2 second */
            );
        },
        /**
         * User options are available in this property for reference by your
         * methods. If any change is made on these options, please call
         * saveOptionsLocalStorage()
         */
        options: null,
        /**
         * Call this method on init to setup the UI by reading the user's
         * stored settings from localStorage and then adjust the UI to reflect
         * what the user wants.
         */
        setupUiFromLocalStorage: function() {

            // Read vals from localStorage. Make sure to use a unique
            // key specific to this widget so as not to overwrite other
            // widgets' options. By using this.id as the prefix of the
            // key we're safe that this will be unique.

            // Feel free to add your own keys inside the options 
            // object for your own items

            var options = localStorage.getItem(this.id + '-options');

            if (options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            }
            else {
                // sets defaults for first time loaders
                options = {
                    showBody: true,
                    tabShowing: 1,
                    customParam1: null,
                    customParam2: 1.0
                };
            }

            // this.options.tabShowing

            this.options = options;
            console.log("options:", options);

            // show/hide body
            if (options.showBody) {
                this.showBody();
            }
            else {
                this.hideBody();
            }

        },
        /**
         * When a user changes a value that is stored as an option setting, you
         * should call this method immediately so that on next load the value
         * is correctly set.
         */
        saveOptionsLocalStorage: function() {
            // You can add your own values to this.options to store them
            // along with some of the normal stuff like showBody
            var options = this.options;

            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store settings to localStorage
            localStorage.setItem(this.id + '-options', optionsStr);
        },
        /**
         * Show the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        showBody: function(evt) {
            $('#' + this.id + ' .panel-body').removeClass('hidden');
            $('#' + this.id + ' .panel-footer').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = true;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * Hide the body of the panel.
         * @param {jquery_event} evt - If you pass the event parameter in, we 
         * know it was clicked by the user and thus we store it for the next 
         * load so we can reset the user's preference. If you don't pass this 
         * value in we don't store the preference because it was likely code 
         * that sent in the param.
         */
        hideBody: function(evt) {
            $('#' + this.id + ' .panel-body').addClass('hidden');
            $('#' + this.id + ' .panel-footer').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) {
                this.options.showBody = false;
                this.saveOptionsLocalStorage();
            }
        },
        /**
         * This method loads the pubsubviewer widget which attaches to our 
         * upper right corner triangle menu and generates 3 menu items like
         * Pubsub Viewer, View Standalone, and Fork Widget. It also enables
         * the modal dialog that shows the documentation for this widget.
         * 
         * By using chilipeppr.load() we can ensure that the pubsubviewer widget
         * is only loaded and inlined once into the final ChiliPeppr workspace.
         * We are given back a reference to the instantiated singleton so its
         * not instantiated more than once. Then we call it's attachTo method
         * which creates the full pulldown menu for us and attaches the click
         * events.
         */
        forkSetup: function() {
            var topCssSelector = '#' + this.id;

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            var that = this;
            chilipeppr.load("http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },
        //dragdrop setup
        setupDragDrop: function() {
            // subscribe to events

            //chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragover", this, this.onDragOver);
            //chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragleave", this, this.onDragLeave);

            // /com-chilipeppr-elem-dragdrop/ondropped
            chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondroppedSTL", this, this.onDroppedSTL, 9); // default is 10, we do 9 to be higher priority
        },
        onDroppedSTL: function(data) {
            console.log("STL Dropped:  ", data);

            //var reader = new FileReader();

            // reader.readAsArrayBuffer (data);
            //reader.readAsText (data);

            var arrayBuffer;
            var fileReader = new FileReader();
            fileReader.onload = function() {
                arrayBuffer = this.result;
                console.log('Raw filereader result:  ', this.result);
            };
            fileReader.readAsArrayBuffer(data);


            console.log("result:  ", fileReader.result);
            //this.parseStlBinary(reader.result);
        },
        //end dragdrop setup
        //init3d functions
        clear3dViewer: function() {
            console.log("clearing 3d viewer");
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneclear");
            //if (this.obj3d) this.obj3d.children = [];            
            /*
            this.obj3d.children.forEach(function(obj3d) {
                chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj3d);
            });
            */
            this.is3dViewerReady = true;
        },

        init3d: function() {
            this.get3dObj();
            if (this.obj3d == null) {
                console.log("loading 3d scene failed, try again in 1 second");
                var attempts = 1;
                var that = this;
                setTimeout(function() {
                    that.get3dObj();
                    if (that.obj3d == null) {
                        attempts++;
                        setTimeout(function() {
                            that.get3dObj();
                            if (that.obj3d == null) {
                                console.log("giving up on trying to get 3d");
                            }
                            else {
                                console.log("succeeded on getting 3d after attempts:", attempts);
                                that.onInit3dSuccess();
                            }
                        }, 5000);
                    }
                    else {
                        console.log("succeeded on getting 3d after attempts:", attempts);
                        that.onInit3dSuccess();
                    }
                }, 1000);
            }
            else {
                this.onInit3dSuccess();
            }

        },
        onInit3dSuccess: function() {
            console.log("onInit3dSuccess. That means we finally got an object back.");
            this.clear3dViewer();

            // open the last file
            var that = this;
            //setTimeout(function () {
            //that.open();
            //this.testCube();
            //}, 1000);
        },
        obj3d: null, // gets the 3dviewer obj stored in here on callback
        obj3dmeta: null, // gets metadata for 3dviewer
        userCallbackForGet3dObj: null,
        get3dObj: function(callback) {
            this.userCallbackForGet3dObj = callback;
            chilipeppr.subscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this, this.get3dObjCallback);
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/request3dObject", "");
            chilipeppr.unsubscribe("/com-chilipeppr-widget-3dviewer/recv3dObject", this.get3dObjCallback);
        },
        get3dObjCallback: function(data, meta) {
            console.log("got 3d obj:", data, meta);
            this.obj3d = data;
            this.obj3dmeta = meta;
            if (this.userCallbackForGet3dObj) {
                //setTimeout(this.userCallbackForGet3dObj.bind(this), 200);
                //console.log("going to call callback after getting back the new 3dobj. this.userCallbackForGet3dObj:", this.userCallbackForGet3dObj);
                this.userCallbackForGet3dObj();
                this.userCallbackForGet3dObj = null;
            }
        },
        is3dViewerReady: false,
        clear3dViewer: function() {
            console.log("clearing 3d viewer");
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneclear");
            //if (this.obj3d) this.obj3d.children = [];            
            /*
            this.obj3d.children.forEach(function(obj3d) {
                chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj3d);
            });
            */
            this.is3dViewerReady = true;
        },
        //end init3d functions

        //sceneAdd functions
        mySceneGroup: null,
        sceneReAddMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.add(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemoveMySceneGroup: function() {
            if (this.obj3d && this.mySceneGroup) {
                this.obj3d.remove(this.mySceneGroup);
            }
            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneAdd: function(obj) {
            console.log("InsideScene Add :", obj);
            chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneadd", obj);
            //chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneadd", obj);

            // this method of adding puts us in the object that contains rendered Gcode
            // that's one option, but when we send gcode to workspace we get overwritten
            // then
            //this.obj3d.add(obj);

            // let's add our Eagle BRD content outside the scope of the Gcode content
            // // so that we have it stay while the Gcode 3D Viewer still functions
            //if (this.mySceneGroup == null) {
            //   this.mySceneGroup = new THREE.Group();
            //   this.obj3d.add(this.mySceneGroup);
            //    }
            //  this.mySceneGroup.add(obj);
            //this.obj3dmeta.scene.add(obj);

            this.obj3dmeta.widget.wakeAnimate();
        },
        sceneRemove: function(obj) {
            //chilipeppr.publish("/com-chilipeppr-widget-3dviewer/sceneremove", obj);
            //this.obj3d.remove(obj);
            //this.obj3dmeta.scene.remove(obj);
            if (this.mySceneGroup != null)
                this.mySceneGroup.remove(obj);
            this.obj3dmeta.widget.wakeAnimate();
        },
        //end sceneAdd functions. 

        //begin self dragdrop functions
        bind: function(dropDomElemSelector, txtDomElemSelector) {

            var that = this;

            // Create drag and drop
            //dropArea = $('.dropArea');
            this.dropArea = $(dropDomElemSelector);
            this.txtDomElemSelector = $(txtDomElemSelector);

            // Attach our drag and drop handlers.
            this.dropArea.bind({
                dragover: function() {
                    $(this).addClass('hover');
                    $(".com-chilipeppr-elem-dragdrop").addClass('hover');
                    //$(".com-chilipeppr-elem-dragdrop").popover('show');
                    //chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondragover", "");
                    return false;
                },
                dragend: function() {
                    $(this).removeClass('hover');
                    $(".com-chilipeppr-elem-dragdrop").removeClass('hover');
                    //$(".com-chilipeppr-elem-dragdrop").popover('hide');
                    //chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondragleave", "");
                    return false;
                },
                dragleave: function() {
                    $(this).removeClass('hover');
                    $(".com-chilipeppr-elem-dragdrop").removeClass('hover');
                    //$(".com-chilipeppr-elem-dragdrop").popover('hide');
                    //chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondragleave", "");

                    return false;
                },

                drop: function(e) {

                    $(this).removeClass('hover');
                    $(".com-chilipeppr-elem-dragdrop").removeClass('hover');
                    //$(".com-chilipeppr-elem-dragdrop").popover('hide');
                    //chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondragleave", "");

                    e = e || window.event;
                    e.preventDefault();


                    // jQuery wraps the originalEvent, so we try to detect that here...
                    e = e.originalEvent || e;
                    //console.log(e);

                    // Using e.files with fallback because e.dataTransfer is immutable and can't be overridden in Polyfills (http://sandbox.knarly.com/js/dropfiles/).            
                    var files = (e.files || e.dataTransfer.files);
                    //console.log(files);


                    $(this).removeClass('hover');
                    $(".com-chilipeppr-elem-dragdrop").removeClass('hover');
                    //$(".com-chilipeppr-elem-dragdrop").popover('hide');
                    //chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondragleave", "");

                    console.log("Files dropped: ", files);

                    for (var i = 0; i < files.length; i++) {
                        console.log('Loading STL no ', i);
                        $('#stlFileNames > tbody:last-child').append('<tr id="tr' + [i] + '"><td>' + [i] + '</td><td>' + files[i].name + '</td></tr>');
                        (function(i) {
                            // parse binary STL
                            console.log('But do we have a loader?', that.stlloader);
                            console.log("what does loadFile look like?", that.stlloader.loadFile);
                            that.stlloader.loadFile(files[i], i);
                            console.log('After Loadfile no ', i);
                        })(i);



                    }


                    return false;
                },


                dropold: function(e) {
                    $(this).removeClass('hover');
                    $(".com-chilipeppr-elem-dragdrop").removeClass('hover');
                    //$(".com-chilipeppr-elem-dragdrop").popover('hide');
                    //chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondragleave", "");

                    e = e || window.event;
                    e.preventDefault();



                    // jQuery wraps the originalEvent, so we try to detect that here...
                    e = e.originalEvent || e;
                    //console.log(e);

                    // Using e.files with fallback because e.dataTransfer is immutable and can't be overridden in Polyfills (http://sandbox.knarly.com/js/dropfiles/).            
                    var files = (e.files || e.dataTransfer.files);
                    //console.log(files);
                    for (var i = 0; i < files.length; i++) {
                        (function(i) {
                            // Loop through our files with a closure so each of our FileReader's are isolated.
                            var reader = new FileReader();
                            //console.log(reader);
                            //console.log("file");
                            //console.log(files[i]);
                            //var thefile = files[i];
                            reader.onload = function(event) {



                                var data = this.result
                                    //  console.log('Raw filereader result:  ', data);

                                //console.log(event);
                                //console.log(event.target.result);
                                //console.log(event.target.result);
                                $(this.txtDomElemSelector).html(event.target.result);

                                // publish event to pubsub
                                var info = {
                                    name: thefile.name,
                                    lastModified: thefile.lastModifiedDate
                                };
                                console.log("self drag/drop got a drop. file.length:", event.target.result.length, "info:", info);
                                /*
                                chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondropped", event.target.result, info);
                                chilipeppr.publish(
                                    "/com-chilipeppr-elem-flashmsg/flashmsg", "File Loaded",
                                    '<div class="row">' +
                                    '<div class="col-xs-3">' +
                                    "Name: " +
                                    '</div><div class="col-xs-9">' +
                                    thefile.name +
                                    '</div>' +
                                    '</div><div class="row">' +
                                    '<div class="col-xs-3">' +
                                    "Size: " +
                                    '</div><div class="col-xs-9">' +
                                    thefile.size +
                                    '</div>' +
                                    '</div><div class="row">' +
                                    '<div class="col-xs-3">' +
                                    "Last Modified: " +
                                    '</div><div class="col-xs-9">' +
                                    thefile.lastModifiedDate +
                                    '</div>' +
                                    '</div>' +
                                    "</div>", 1000 * 3, true);*/
                            };
                            //reader.readAsDataURL(files[i]);

                            // var fileExtension = files[i].name.split();
                            var fileExtension = files[i].name.substr(files[i].name.lastIndexOf('.') + 1);

                            console.log("Before File Reader. Extension:  ", fileExtension);

                            if (fileExtension.match(/stl/g)) {
                                console.log("We have an STL file.  Read as Array Buffer");
                                reader.readAsBinaryString(files[i]);
                                //chilipeppr.publish("/com-chilipeppr-elem-dragdrop/ondroppedSTL", files[i]);

                                //that.parseStlBinary (files[i] );

                                console.log("files[i]:  ", files[i]);

                                console.log("result ", this.result);

                                //var convertedBuffer = (that.arrayBufferToString (reader.result) );

                                //console.log ("convertedBuffer ",  convertedBuffer);


                            }
                            else {
                                reader.readAsText(files[i]);
                            }

                        })(i);
                    }

                    return false;
                }
            });
            // end drop area code
        },
        //end self dragdrop functions


        //end reader functions

        /*
        arrayBufferToString: function(buffer, onSuccess, onFail) {
            var bufView = new Uint8Array(buffer);
            var length = bufView.length;
            var result = '';
            for (var i = 0; i < length; i += 65535) {
                var addition = 65535;
                if (i + 65535 > length) {
                    addition = length - i;
                }
                result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
            }
            if (result) {
                if (onSuccess)
                    onSuccess(result);
            }
            else {
                if (onFail)
                    onFail('buffer was invalid');
            }

            return result;

        },*/

        //start stl parsing functions
        parseStlBinary: function(stl) { //this is from jsstl.  we have a failure on the new DataView
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
        //end stl parsing functions


    }
});