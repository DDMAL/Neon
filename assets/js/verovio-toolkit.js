var Module=typeof Module!="undefined"?Module:{};var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=typeof window=="object";var ENVIRONMENT_IS_WORKER=typeof importScripts=="function";var ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;function logExceptionOnExit(e){if(e instanceof ExitStatus)return;let toLog=e;err("exiting due to exception: "+toLog)}var fs;var nodePath;var requireNodeFS;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require("path").dirname(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}requireNodeFS=()=>{if(!nodePath){fs=require("fs");nodePath=require("path")}};read_=function shell_read(filename,binary){var ret=tryParseAsDataURI(filename);if(ret){return binary?ret:ret.toString()}requireNodeFS();filename=nodePath["normalize"](filename);return fs.readFileSync(filename,binary?undefined:"utf8")};readBinary=filename=>{var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}return ret};readAsync=(filename,onload,onerror)=>{var ret=tryParseAsDataURI(filename);if(ret){onload(ret)}requireNodeFS();filename=nodePath["normalize"](filename);fs.readFile(filename,function(err,data){if(err)onerror(err);else onload(data.buffer)})};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/")}arguments_=process["argv"].slice(2);if(typeof module!="undefined"){module["exports"]=Module}process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",function(reason){throw reason});quit_=(status,toThrow)=>{if(keepRuntimeAlive()){process["exitCode"]=status;throw toThrow}logExceptionOnExit(toThrow);process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=url=>{try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}var data=tryParseAsDataURI(url);if(data){onload(data.buffer);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=title=>document.title=title}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;var WebAssembly={Memory:function(opts){this.buffer=new ArrayBuffer(opts["initial"]*65536)},Module:function(binary){},Instance:function(module,info){this.exports=(
// EMSCRIPTEN_START_ASM

// char *getElementsAtTime(Toolkit *ic, int time)
verovio.vrvToolkit.getElementsAtTime = Module.cwrap( 'vrvToolkit_getElementsAtTime', 'string', ['number', 'number'] );

// char *vrvToolkit_getExpansionIdsForElement(Toolkit *tk, const char *xmlId);
verovio.vrvToolkit.getExpansionIdsForElement = Module.cwrap( 'vrvToolkit_getExpansionIdsForElement', 'string', ['number', 'string'] );

// char *getHumdrum(Toolkit *ic)
verovio.vrvToolkit.getHumdrum = Module.cwrap( 'vrvToolkit_getHumdrum', 'string' );

// char *getLog(Toolkit *ic)
verovio.vrvToolkit.getLog = Module.cwrap( 'vrvToolkit_getLog', 'string', ['number'] );

// char *getMEI(Toolkit *ic, const char *options)
verovio.vrvToolkit.getMEI = Module.cwrap( 'vrvToolkit_getMEI', 'string', ['number', 'string'] );

// char *vrvToolkit_getNotatedIdForElement(Toolkit *tk, const char *xmlId);
verovio.vrvToolkit.getNotatedIdForElement = Module.cwrap( 'vrvToolkit_getNotatedIdForElement', 'string', ['number', 'string'] );

// char *getOptions(Toolkit *ic, int defaultValues)
verovio.vrvToolkit.getOptions = Module.cwrap( 'vrvToolkit_getOptions', 'string', ['number', 'number'] );

// int getPageCount(Toolkit *ic)
verovio.vrvToolkit.getPageCount = Module.cwrap( 'vrvToolkit_getPageCount', 'number', ['number'] );

// int getPageWithElement(Toolkit *ic, const char *xmlId)
verovio.vrvToolkit.getPageWithElement = Module.cwrap( 'vrvToolkit_getPageWithElement', 'number', ['number', 'string'] );

// double getTimeForElement(Toolkit *ic, const char *xmlId)

// char *getMIDIValuesForElement(Toolkit *ic, const char *xmlId)
verovio.vrvToolkit.getMIDIValuesForElement = Module.cwrap( 'vrvToolkit_getMIDIValuesForElement', 'string', ['number', 'string'] );

// char *getVersion(Toolkit *ic)
verovio.vrvToolkit.getVersion = Module.cwrap( 'vrvToolkit_getVersion', 'string', ['number'] );

// bool loadData(Toolkit *ic, const char *data)
verovio.vrvToolkit.loadData = Module.cwrap( 'vrvToolkit_loadData', 'number', ['number', 'string'] );

// void redoLayout(Toolkit *ic)
verovio.vrvToolkit.redoLayout = Module.cwrap( 'vrvToolkit_redoLayout', null, ['number'] );

// void redoPagePitchPosLayout(Toolkit *ic)
verovio.vrvToolkit.redoPagePitchPosLayout = Module.cwrap( 'vrvToolkit_redoPagePitchPosLayout', null, ['number'] );

// char *renderData(Toolkit *ic, const char *data, const char *options)
verovio.vrvToolkit.renderData = Module.cwrap( 'vrvToolkit_renderData', 'string', ['number', 'string', 'string'] );

// char *renderToMidi(Toolkit *ic, const char *rendering_options)
verovio.vrvToolkit.renderToMIDI = Module.cwrap( 'vrvToolkit_renderToMIDI', 'string', ['number', 'string'] );

// char *renderToSvg(Toolkit *ic, int pageNo, const char *rendering_options)
verovio.vrvToolkit.renderToSVG = Module.cwrap( 'vrvToolkit_renderToSVG', 'string', ['number', 'number', 'string'] );

// char *renderToTimemap(Toolkit *ic)
verovio.vrvToolkit.renderToTimemap = Module.cwrap( 'vrvToolkit_renderToTimemap', 'string', ['number'] );

// void setOptions(Toolkit *ic, const char *options) 
verovio.vrvToolkit.setOptions = Module.cwrap( 'vrvToolkit_setOptions', null, ['number', 'string'] );

// A pointer to the object - only one instance can be created for now
verovio.instances = [];

/***************************************************************************************************************************/

verovio.toolkit = function ()
{
    this.ptr = verovio.vrvToolkit.constructor();
    console.debug( "Creating toolkit instance" );
    verovio.instances.push( this.ptr );
}

verovio.toolkit.prototype.destroy = function ()
{
    verovio.instances.splice( verovio.instances.indexOf( this.ptr ), 1 );
    console.debug( "Deleting toolkit instance" );
    verovio.vrvToolkit.destructor( this.ptr );
};

verovio.toolkit.prototype.edit = function ( editorAction )
{
    return verovio.vrvToolkit.edit( this.ptr, JSON.stringify( editorAction ) );
};

verovio.toolkit.prototype.editInfo = function ()
{
    return JSON.parse( verovio.vrvToolkit.editInfo( this.ptr ) );
};

verovio.toolkit.prototype.getAvailableOptions = function ()
{
    return JSON.parse( verovio.vrvToolkit.getAvailableOptions( this.ptr ) );
};

verovio.toolkit.prototype.getElementAttr = function ( xmlId )
{
    return JSON.parse( verovio.vrvToolkit.getElementAttr( this.ptr, xmlId ) );
};

verovio.toolkit.prototype.getElementsAtTime = function ( millisec )
{
    return JSON.parse( verovio.vrvToolkit.getElementsAtTime( this.ptr, millisec ) );
};

verovio.toolkit.prototype.getExpansionIdsForElement = function ( xmlId )
{
    return JSON.parse( verovio.vrvToolkit.getExpansionIdsForElement( this.ptr, xmlId ) );
};

verovio.toolkit.prototype.getHumdrum = function ()
{
    return verovio.vrvToolkit.getHumdrum( this.ptr );
};

verovio.toolkit.prototype.getLog = function ()
{
    return verovio.vrvToolkit.getLog( this.ptr );
};

verovio.toolkit.prototype.getMEI = function ( param1, scoreBased )
{
    if ( typeof param1 === 'undefined' )
    {
        return verovio.vrvToolkit.getMEI( this.ptr, JSON.stringify( {} ) );
    }
    else if ( param1 instanceof Object )
    {
        return verovio.vrvToolkit.getMEI( this.ptr, JSON.stringify( param1 ) );
    }
    else
    {
        console.warn( "Parameters deprecated; use JSON string options instead" );
        options = { "pageNo": param1, "scoreBased": scoreBased };
        return verovio.vrvToolkit.getMEI( this.ptr, JSON.stringify( options ) );
    }
};

verovio.toolkit.prototype.getMIDIValuesForElement = function ( xmlId )
{
    return JSON.parse( verovio.vrvToolkit.getMIDIValuesForElement( this.ptr, xmlId ) );
};

verovio.toolkit.prototype.getNotatedIdForElement = function ( xmlId )
{
    return verovio.vrvToolkit.getNotatedIdForElement( this.ptr, xmlId );
};

verovio.toolkit.prototype.getOptions = function ( defaultValues )
{
    return JSON.parse( verovio.vrvToolkit.getOptions( this.ptr, defaultValues ) );
};

verovio.toolkit.prototype.getPageCount = function ()
{
    return verovio.vrvToolkit.getPageCount( this.ptr );
};

verovio.toolkit.prototype.getPageWithElement = function ( xmlId )
{
    return verovio.vrvToolkit.getPageWithElement( this.ptr, xmlId );
};

verovio.toolkit.prototype.getTimeForElement = function ( xmlId )
{
    return verovio.vrvToolkit.getTimeForElement( this.ptr, xmlId );
};

verovio.toolkit.prototype.getVersion = function ()
{
    return verovio.vrvToolkit.getVersion( this.ptr );
};

verovio.toolkit.prototype.loadData = function ( data )
{
    return verovio.vrvToolkit.loadData( this.ptr, data );
};

verovio.toolkit.prototype.redoLayout = function ()
{
    verovio.vrvToolkit.redoLayout( this.ptr );
}

verovio.toolkit.prototype.redoPagePitchPosLayout = function ()
{
    verovio.vrvToolkit.redoPagePitchPosLayout( this.ptr );
}

verovio.toolkit.prototype.renderData = function ( data, options )
{
    return verovio.vrvToolkit.renderData( this.ptr, data, JSON.stringify( options ) );
};

verovio.toolkit.prototype.renderPage = function ( pageNo, options )
{
    console.warn( "Method renderPage is deprecated; use renderToSVG instead" );
    return verovio.vrvToolkit.renderToSVG( this.ptr, pageNo, JSON.stringify( options ) );
};

verovio.toolkit.prototype.renderToMIDI = function ( options )
{
    return verovio.vrvToolkit.renderToMIDI( this.ptr, JSON.stringify( options ) );
};

verovio.toolkit.prototype.renderToMidi = function ( options )
{
    console.warn( "Method renderToMidi is deprecated; use renderToMIDI instead" );
    return verovio.vrvToolkit.renderToMIDI( this.ptr, JSON.stringify( options ) );
};

verovio.toolkit.prototype.renderToSVG = function ( pageNo, options )
{
    return verovio.vrvToolkit.renderToSVG( this.ptr, pageNo, JSON.stringify( options ) );
};

verovio.toolkit.prototype.renderToTimemap = function ()
{
    return JSON.parse( verovio.vrvToolkit.renderToTimemap( this.ptr ) );
};

verovio.toolkit.prototype.setOptions = function ( options )
{
    verovio.vrvToolkit.setOptions( this.ptr, JSON.stringify( options ) );
};

/***************************************************************************************************************************/

// If the window object is defined (if we are not within a WebWorker)...
if ( ( typeof window !== "undefined" ) && ( window.addEventListener ) )
{
    // Add a listener that will delete the object (if necessary) when the page is closed
    window.addEventListener( "unload", function ()
    {
        for ( var i = 0; i < verovio.instances.length; i++ )
        {
            verovio.vrvToolkit.destructor( verovio.instances[i] );
        }
    } );
}
