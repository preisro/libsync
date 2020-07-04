
// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {

    if (initSqlJsPromise){
      return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {

        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction){
              originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort

var e;e||(e=typeof Module !== 'undefined' ? Module : {});
e.onRuntimeInitialized=function(){function a(h,m){this.Na=h;this.db=m;this.Ma=1;this.eb=[]}function b(h){this.filename="dbfile_"+(4294967295*Math.random()>>>0);if(null!=h){var m=this.filename,q=m?k("//"+m):"/";m=aa(!0,!0);q=ba(q,(void 0!==m?m:438)&4095|32768,0);if(h){if("string"===typeof h){for(var v=Array(h.length),B=0,Q=h.length;B<Q;++B)v[B]=h.charCodeAt(B);h=v}ca(q,m|146);v=l(q,"w");da(v,h,0,h.length,0,void 0);ea(v);ca(q,m)}}this.handleError(f(this.filename,c));this.db=p(c,"i32");sc(this.db);this.bb=
{};this.Ta={}}null;var c=t(4),d=e.cwrap,f=d("sqlite3_open","number",["string","number"]),g=d("sqlite3_close_v2","number",["number"]),n=d("sqlite3_exec","number",["number","string","number","number","number"]),r=d("sqlite3_changes","number",["number"]),w=d("sqlite3_prepare_v2","number",["number","string","number","number","number"]),u=d("sqlite3_prepare_v2","number",["number","number","number","number","number"]),C=d("sqlite3_bind_text","number",["number","number","number","number","number"]),H=d("sqlite3_bind_blob",
"number",["number","number","number","number","number"]),ia=d("sqlite3_bind_double","number",["number","number","number"]),tc=d("sqlite3_bind_int","number",["number","number","number"]),uc=d("sqlite3_bind_parameter_index","number",["number","string"]),vc=d("sqlite3_step","number",["number"]),wc=d("sqlite3_errmsg","string",["number"]),vb=d("sqlite3_data_count","number",["number"]),xc=d("sqlite3_column_double","number",["number","number"]),yc=d("sqlite3_column_text","string",["number","number"]),zc=
d("sqlite3_column_blob","number",["number","number"]),Ac=d("sqlite3_column_bytes","number",["number","number"]),Bc=d("sqlite3_column_type","number",["number","number"]),Cc=d("sqlite3_column_name","string",["number","number"]),Dc=d("sqlite3_reset","number",["number"]),Ec=d("sqlite3_clear_bindings","number",["number"]),Fc=d("sqlite3_finalize","number",["number"]),Gc=d("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),Hc=d("sqlite3_value_type",
"number",["number"]),Ic=d("sqlite3_value_bytes","number",["number"]),Jc=d("sqlite3_value_text","string",["number"]),Kc=d("sqlite3_value_blob","number",["number"]),Lc=d("sqlite3_value_double","number",["number"]),Mc=d("sqlite3_result_double","",["number","number"]),wb=d("sqlite3_result_null","",["number"]),Nc=d("sqlite3_result_text","",["number","string","number","number"]),Oc=d("sqlite3_result_blob","",["number","number","number","number"]),Pc=d("sqlite3_result_int","",["number","number"]),xb=d("sqlite3_result_error",
"",["number","string","number"]),sc=d("RegisterExtensionFunctions","number",["number"]);a.prototype.bind=function(h){if(!this.Na)throw"Statement closed";this.reset();return Array.isArray(h)?this.sb(h):null!=h&&"object"===typeof h?this.tb(h):!0};a.prototype.step=function(){if(!this.Na)throw"Statement closed";this.Ma=1;var h=vc(this.Na);switch(h){case 100:return!0;case 101:return!1;default:throw this.db.handleError(h);}};a.prototype.zb=function(h){null==h&&(h=this.Ma,this.Ma+=1);return xc(this.Na,h)};
a.prototype.Ab=function(h){null==h&&(h=this.Ma,this.Ma+=1);return yc(this.Na,h)};a.prototype.getBlob=function(h){null==h&&(h=this.Ma,this.Ma+=1);var m=Ac(this.Na,h);var q=zc(this.Na,h);var v=new Uint8Array(m);for(h=0;h<m;)v[h]=x[q+h],h+=1;return v};a.prototype.get=function(h){var m;null!=h&&this.bind(h)&&this.step();var q=[];h=0;for(m=vb(this.Na);h<m;){switch(Bc(this.Na,h)){case 1:case 2:q.push(this.zb(h));break;case 3:q.push(this.Ab(h));break;case 4:q.push(this.getBlob(h));break;default:q.push(null)}h+=
1}return q};a.prototype.getColumnNames=function(){var h;var m=[];var q=0;for(h=vb(this.Na);q<h;)m.push(Cc(this.Na,q)),q+=1;return m};a.prototype.getAsObject=function(h){var m;var q=this.get(h);var v=this.getColumnNames();var B={};h=0;for(m=v.length;h<m;){var Q=v[h];B[Q]=q[h];h+=1}return B};a.prototype.run=function(h){null!=h&&this.bind(h);this.step();return this.reset()};a.prototype.wb=function(h,m){null==m&&(m=this.Ma,this.Ma+=1);h=fa(h);var q=ha(h);this.eb.push(q);this.db.handleError(C(this.Na,
m,q,h.length-1,0))};a.prototype.rb=function(h,m){null==m&&(m=this.Ma,this.Ma+=1);var q=ha(h);this.eb.push(q);this.db.handleError(H(this.Na,m,q,h.length,0))};a.prototype.vb=function(h,m){null==m&&(m=this.Ma,this.Ma+=1);this.db.handleError((h===(h|0)?tc:ia)(this.Na,m,h))};a.prototype.ub=function(h){null==h&&(h=this.Ma,this.Ma+=1);H(this.Na,h,0,0,0)};a.prototype.kb=function(h,m){null==m&&(m=this.Ma,this.Ma+=1);switch(typeof h){case "string":this.wb(h,m);return;case "number":case "boolean":this.vb(h+
0,m);return;case "object":if(null===h){this.ub(m);return}if(null!=h.length){this.rb(h,m);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+h+").";};a.prototype.tb=function(h){var m=this;Object.keys(h).forEach(function(q){var v=uc(m.Na,q);0!==v&&m.kb(h[q],v)});return!0};a.prototype.sb=function(h){var m;for(m=0;m<h.length;)this.kb(h[m],m+1),m+=1;return!0};a.prototype.reset=function(){return 0===Ec(this.Na)&&0===Dc(this.Na)};a.prototype.freemem=function(){for(var h;void 0!==(h=
this.eb.pop());)ja(h)};a.prototype.free=function(){var h=0===Fc(this.Na);delete this.db.bb[this.Na];this.Na=0;return h};b.prototype.run=function(h,m){if(!this.db)throw"Database closed";if(m){h=this.prepare(h,m);try{h.step()}finally{h.free()}}else this.handleError(n(this.db,h,0,0,c));return this};b.prototype.exec=function(h,m){if(!this.db)throw"Database closed";var q=ka();try{var v=la(h)+1,B=t(v);ma(h,x,B,v);var Q=B;var F=t(4);for(h=[];0!==p(Q,"i8");){na(c);na(F);this.handleError(u(this.db,Q,-1,c,
F));var pa=p(c,"i32");Q=p(F,"i32");if(0!==pa){var S=null;var A=new a(pa,this);for(null!=m&&A.bind(m);A.step();)null===S&&(S={columns:A.getColumnNames(),values:[]},h.push(S)),S.values.push(A.get());A.free()}}return h}catch(L){throw A&&A.free(),L;}finally{oa(q)}};b.prototype.each=function(h,m,q,v){"function"===typeof m&&(v=q,q=m,m=void 0);h=this.prepare(h,m);try{for(;h.step();)q(h.getAsObject())}finally{h.free()}if("function"===typeof v)return v()};b.prototype.prepare=function(h,m){na(c);this.handleError(w(this.db,
h,-1,c,0));h=p(c,"i32");if(0===h)throw"Nothing to prepare";var q=new a(h,this);null!=m&&q.bind(m);return this.bb[h]=q};b.prototype["export"]=function(){Object.values(this.bb).forEach(function(m){m.free()});Object.values(this.Ta).forEach(qa);this.Ta={};this.handleError(g(this.db));var h=ra(this.filename);this.handleError(f(this.filename,c));this.db=p(c,"i32");return h};b.prototype.close=function(){null!==this.db&&(Object.values(this.bb).forEach(function(h){h.free()}),Object.values(this.Ta).forEach(qa),
this.Ta={},this.handleError(g(this.db)),sa("/"+this.filename),this.db=null)};b.prototype.handleError=function(h){if(0===h)return null;h=wc(this.db);throw Error(h);};b.prototype.getRowsModified=function(){return r(this.db)};b.prototype.create_function=function(h,m){Object.prototype.hasOwnProperty.call(this.Ta,h)&&(ta(this.Ta[h]),delete this.Ta[h]);var q=ua(function(v,B,Q){for(var F,pa=[],S=0;S<B;S+=1){var A=p(Q+4*S,"i32"),L=Hc(A);if(1===L||2===L)A=Lc(A);else if(3===L)A=Jc(A);else if(4===L){L=A;A=Ic(L);
L=Kc(L);for(var Cb=new Uint8Array(A),Ca=0;Ca<A;Ca+=1)Cb[Ca]=x[L+Ca];A=Cb}else A=null;pa.push(A)}try{F=m.apply(null,pa)}catch(Sc){xb(v,Sc,-1);return}switch(typeof F){case "boolean":Pc(v,F?1:0);break;case "number":Mc(v,F);break;case "string":Nc(v,F,-1,-1);break;case "object":null===F?wb(v):null!=F.length?(B=ha(F),Oc(v,B,F.length,-1),ja(B)):xb(v,"Wrong API use : tried to return a value of an unknown type ("+F+").",-1);break;default:wb(v)}});this.Ta[h]=q;this.handleError(Gc(this.db,h,m.length,1,0,q,0,
0,0));return this};e.Database=b};var va={},y;for(y in e)e.hasOwnProperty(y)&&(va[y]=e[y]);var wa="./this.program",xa=!1,ya=!1,za=!1,Aa=!1;xa="object"===typeof window;ya="function"===typeof importScripts;za="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node;Aa=!xa&&!za&&!ya;var z="",Ba,Da,Ea,Fa;
if(za)z=ya?require("path").dirname(z)+"/":__dirname+"/",Ba=function(a,b){Ea||(Ea=require("fs"));Fa||(Fa=require("path"));a=Fa.normalize(a);return Ea.readFileSync(a,b?null:"utf8")},Da=function(a){a=Ba(a,!0);a.buffer||(a=new Uint8Array(a));assert(a.buffer);return a},1<process.argv.length&&(wa=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),"undefined"!==typeof module&&(module.exports=e),process.on("unhandledRejection",D),e.inspect=function(){return"[Emscripten Module object]"};else if(Aa)"undefined"!=
typeof read&&(Ba=function(a){return read(a)}),Da=function(a){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(a));a=read(a,"binary");assert("object"===typeof a);return a},"undefined"!==typeof print&&("undefined"===typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!==typeof printErr?printErr:print);else if(xa||ya)ya?z=self.location.href:document.currentScript&&(z=document.currentScript.src),z=0!==z.indexOf("blob:")?z.substr(0,z.lastIndexOf("/")+
1):"",Ba=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.send(null);return b.responseText},ya&&(Da=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)});var Ga=e.print||console.log.bind(console),E=e.printErr||console.warn.bind(console);for(y in va)va.hasOwnProperty(y)&&(e[y]=va[y]);va=null;e.thisProgram&&(wa=e.thisProgram);function Ha(a){var b=G[Ia>>2];G[Ia>>2]=b+a+15&-16;return b}var Ja=[],Ka;
function ta(a){Ka.delete(I.get(a));Ja.push(a)}
function ua(a){if(!Ka){Ka=new WeakMap;for(var b=0;b<I.length;b++){var c=I.get(b);c&&Ka.set(c,b)}}if(Ka.has(a))a=Ka.get(a);else{if(Ja.length)b=Ja.pop();else{b=I.length;try{I.grow(1)}catch(g){if(!(g instanceof RangeError))throw g;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}}try{I.set(b,a)}catch(g){if(!(g instanceof TypeError))throw g;if("function"===typeof WebAssembly.Function){var d={i:"i32",j:"i64",f:"f32",d:"f64"},f={parameters:[],results:[]};for(c=1;4>c;++c)f.parameters.push(d["viii"[c]]);
c=new WebAssembly.Function(f,a)}else{d=[1,0,1,96];f={i:127,j:126,f:125,d:124};d.push(3);for(c=0;3>c;++c)d.push(f["iii"[c]]);d.push(0);d[1]=d.length-2;c=new Uint8Array([0,97,115,109,1,0,0,0].concat(d,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0]));c=new WebAssembly.Module(c);c=(new WebAssembly.Instance(c,{e:{f:a}})).exports.f}I.set(b,c)}Ka.set(a,b);a=b}return a}function qa(a){ta(a)}var La;e.wasmBinary&&(La=e.wasmBinary);var noExitRuntime;e.noExitRuntime&&(noExitRuntime=e.noExitRuntime);
"object"!==typeof WebAssembly&&E("no native wasm support detected");
function na(a){var b="i32";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":x[a>>0]=0;break;case "i8":x[a>>0]=0;break;case "i16":Ma[a>>1]=0;break;case "i32":G[a>>2]=0;break;case "i64":J=[0,(K=0,1<=+Na(K)?0<K?(Oa(+Pa(K/4294967296),4294967295)|0)>>>0:~~+Qa((K-+(~~K>>>0))/4294967296)>>>0:0)];G[a>>2]=J[0];G[a+4>>2]=J[1];break;case "float":Ra[a>>2]=0;break;case "double":Sa[a>>3]=0;break;default:D("invalid type for setValue: "+b)}}
function p(a,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return x[a>>0];case "i8":return x[a>>0];case "i16":return Ma[a>>1];case "i32":return G[a>>2];case "i64":return G[a>>2];case "float":return Ra[a>>2];case "double":return Sa[a>>3];default:D("invalid type for getValue: "+b)}return null}var Ta,I=new WebAssembly.Table({initial:387,element:"anyfunc"}),Ua=!1;function assert(a,b){a||D("Assertion failed: "+b)}
function Va(a){var b=e["_"+a];assert(b,"Cannot call unknown function "+a+", make sure it is exported");return b}
function Wa(a,b,c,d){var f={string:function(u){var C=0;if(null!==u&&void 0!==u&&0!==u){var H=(u.length<<2)+1;C=t(H);ma(u,M,C,H)}return C},array:function(u){var C=t(u.length);x.set(u,C);return C}},g=Va(a),n=[];a=0;if(d)for(var r=0;r<d.length;r++){var w=f[c[r]];w?(0===a&&(a=ka()),n[r]=w(d[r])):n[r]=d[r]}c=g.apply(null,n);c=function(u){return"string"===b?N(u):"boolean"===b?!!u:u}(c);0!==a&&oa(a);return c}var Xa=0,Ya=3;
function ha(a){var b=Xa;if("number"===typeof a){var c=!0;var d=a}else c=!1,d=a.length;var f;b==Ya?f=g:f=[Za,t,Ha][b](Math.max(d,1));if(c){var g=f;assert(0==(f&3));for(a=f+(d&-4);g<a;g+=4)G[g>>2]=0;for(a=f+d;g<a;)x[g++>>0]=0;return f}a.subarray||a.slice?M.set(a,f):M.set(new Uint8Array(a),f);return f}var $a="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function ab(a,b,c){var d=b+c;for(c=b;a[c]&&!(c>=d);)++c;if(16<c-b&&a.subarray&&$a)return $a.decode(a.subarray(b,c));for(d="";b<c;){var f=a[b++];if(f&128){var g=a[b++]&63;if(192==(f&224))d+=String.fromCharCode((f&31)<<6|g);else{var n=a[b++]&63;f=224==(f&240)?(f&15)<<12|g<<6|n:(f&7)<<18|g<<12|n<<6|a[b++]&63;65536>f?d+=String.fromCharCode(f):(f-=65536,d+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else d+=String.fromCharCode(f)}return d}function N(a){return a?ab(M,a,void 0):""}
function ma(a,b,c,d){if(!(0<d))return 0;var f=c;d=c+d-1;for(var g=0;g<a.length;++g){var n=a.charCodeAt(g);if(55296<=n&&57343>=n){var r=a.charCodeAt(++g);n=65536+((n&1023)<<10)|r&1023}if(127>=n){if(c>=d)break;b[c++]=n}else{if(2047>=n){if(c+1>=d)break;b[c++]=192|n>>6}else{if(65535>=n){if(c+2>=d)break;b[c++]=224|n>>12}else{if(c+3>=d)break;b[c++]=240|n>>18;b[c++]=128|n>>12&63}b[c++]=128|n>>6&63}b[c++]=128|n&63}}b[c]=0;return c-f}
function la(a){for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);55296<=d&&57343>=d&&(d=65536+((d&1023)<<10)|a.charCodeAt(++c)&1023);127>=d?++b:b=2047>=d?b+2:65535>=d?b+3:b+4}return b}function bb(a){var b=la(a)+1,c=Za(b);c&&ma(a,x,c,b);return c}var cb,x,M,Ma,G,Ra,Sa;
function db(a){cb=a;e.HEAP8=x=new Int8Array(a);e.HEAP16=Ma=new Int16Array(a);e.HEAP32=G=new Int32Array(a);e.HEAPU8=M=new Uint8Array(a);e.HEAPU16=new Uint16Array(a);e.HEAPU32=new Uint32Array(a);e.HEAPF32=Ra=new Float32Array(a);e.HEAPF64=Sa=new Float64Array(a)}var Ia=63056,eb=e.INITIAL_MEMORY||16777216;e.wasmMemory?Ta=e.wasmMemory:Ta=new WebAssembly.Memory({initial:eb/65536,maximum:32768});Ta&&(cb=Ta.buffer);eb=cb.byteLength;db(cb);G[Ia>>2]=5306096;
function fb(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b(e);else{var c=b.yb;"number"===typeof c?void 0===b.fb?e.dynCall_v(c):e.dynCall_vi(c,b.fb):c(void 0===b.fb?null:b.fb)}}}var gb=[],hb=[],ib=[],jb=[];function kb(){var a=e.preRun.shift();gb.unshift(a)}var Na=Math.abs,Qa=Math.ceil,Pa=Math.floor,Oa=Math.min,lb=0,mb=null,nb=null;e.preloadedImages={};e.preloadedAudios={};
function D(a){if(e.onAbort)e.onAbort(a);Ga(a);E(a);Ua=!0;throw new WebAssembly.RuntimeError("abort("+a+"). Build with -s ASSERTIONS=1 for more info.");}function ob(a){var b=pb;return String.prototype.startsWith?b.startsWith(a):0===b.indexOf(a)}function qb(){return ob("data:application/octet-stream;base64,")}var pb="sql-wasm.wasm";if(!qb()){var rb=pb;pb=e.locateFile?e.locateFile(rb,z):z+rb}
function sb(){try{if(La)return new Uint8Array(La);if(Da)return Da(pb);throw"both async and sync fetching of the wasm failed";}catch(a){D(a)}}function tb(){return La||!xa&&!ya||"function"!==typeof fetch||ob("file://")?new Promise(function(a){a(sb())}):fetch(pb,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+pb+"'";return a.arrayBuffer()}).catch(function(){return sb()})}var K,J;hb.push({yb:function(){ub()}});
function yb(a){return a.replace(/\b_Z[\w\d_]+/g,function(b){return b===b?b:b+" ["+b+"]"})}function zb(a,b){for(var c=0,d=a.length-1;0<=d;d--){var f=a[d];"."===f?a.splice(d,1):".."===f?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c;c--)a.unshift("..");return a}function k(a){var b="/"===a.charAt(0),c="/"===a.substr(-1);(a=zb(a.split("/").filter(function(d){return!!d}),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return(b?"/":"")+a}
function Ab(a){var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return".";b&&(b=b.substr(0,b.length-1));return a+b}function Bb(a){if("/"===a)return"/";var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)}function Db(a){G[Eb()>>2]=a}
function Fb(){for(var a="",b=!1,c=arguments.length-1;-1<=c&&!b;c--){b=0<=c?arguments[c]:"/";if("string"!==typeof b)throw new TypeError("Arguments to path.resolve must be strings");if(!b)return"";a=b+"/"+a;b="/"===b.charAt(0)}a=zb(a.split("/").filter(function(d){return!!d}),!b).join("/");return(b?"/":"")+a||"."}var Gb=[];function Hb(a,b){Gb[a]={input:[],output:[],Ya:b};Ib(a,Jb)}
var Jb={open:function(a){var b=Gb[a.node.rdev];if(!b)throw new O(43);a.tty=b;a.seekable=!1},close:function(a){a.tty.Ya.flush(a.tty)},flush:function(a){a.tty.Ya.flush(a.tty)},read:function(a,b,c,d){if(!a.tty||!a.tty.Ya.ob)throw new O(60);for(var f=0,g=0;g<d;g++){try{var n=a.tty.Ya.ob(a.tty)}catch(r){throw new O(29);}if(void 0===n&&0===f)throw new O(6);if(null===n||void 0===n)break;f++;b[c+g]=n}f&&(a.node.timestamp=Date.now());return f},write:function(a,b,c,d){if(!a.tty||!a.tty.Ya.hb)throw new O(60);
try{for(var f=0;f<d;f++)a.tty.Ya.hb(a.tty,b[c+f])}catch(g){throw new O(29);}d&&(a.node.timestamp=Date.now());return f}},Kb={ob:function(a){if(!a.input.length){var b=null;if(za){var c=Buffer.qb?Buffer.qb(256):new Buffer(256),d=0;try{d=Ea.readSync(process.stdin.fd,c,0,256,null)}catch(f){if(-1!=f.toString().indexOf("EOF"))d=0;else throw f;}0<d?b=c.slice(0,d).toString("utf-8"):b=null}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),null!==b&&(b+="\n")):"function"==
typeof readline&&(b=readline(),null!==b&&(b+="\n"));if(!b)return null;a.input=fa(b,!0)}return a.input.shift()},hb:function(a,b){null===b||10===b?(Ga(ab(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(Ga(ab(a.output,0)),a.output=[])}},Lb={hb:function(a,b){null===b||10===b?(E(ab(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(E(ab(a.output,0)),a.output=[])}},P={Ra:null,Sa:function(){return P.createNode(null,
"/",16895,0)},createNode:function(a,b,c,d){if(24576===(c&61440)||4096===(c&61440))throw new O(63);P.Ra||(P.Ra={dir:{node:{Qa:P.Ja.Qa,Pa:P.Ja.Pa,lookup:P.Ja.lookup,Za:P.Ja.Za,rename:P.Ja.rename,unlink:P.Ja.unlink,rmdir:P.Ja.rmdir,readdir:P.Ja.readdir,symlink:P.Ja.symlink},stream:{Va:P.Ka.Va}},file:{node:{Qa:P.Ja.Qa,Pa:P.Ja.Pa},stream:{Va:P.Ka.Va,read:P.Ka.read,write:P.Ka.write,jb:P.Ka.jb,$a:P.Ka.$a,ab:P.Ka.ab}},link:{node:{Qa:P.Ja.Qa,Pa:P.Ja.Pa,readlink:P.Ja.readlink},stream:{}},lb:{node:{Qa:P.Ja.Qa,
Pa:P.Ja.Pa},stream:Mb}});c=Nb(a,b,c,d);R(c.mode)?(c.Ja=P.Ra.dir.node,c.Ka=P.Ra.dir.stream,c.Ia={}):32768===(c.mode&61440)?(c.Ja=P.Ra.file.node,c.Ka=P.Ra.file.stream,c.Oa=0,c.Ia=null):40960===(c.mode&61440)?(c.Ja=P.Ra.link.node,c.Ka=P.Ra.link.stream):8192===(c.mode&61440)&&(c.Ja=P.Ra.lb.node,c.Ka=P.Ra.lb.stream);c.timestamp=Date.now();a&&(a.Ia[b]=c);return c},Jb:function(a){if(a.Ia&&a.Ia.subarray){for(var b=[],c=0;c<a.Oa;++c)b.push(a.Ia[c]);return b}return a.Ia},Kb:function(a){return a.Ia?a.Ia.subarray?
a.Ia.subarray(0,a.Oa):new Uint8Array(a.Ia):new Uint8Array(0)},mb:function(a,b){var c=a.Ia?a.Ia.length:0;c>=b||(b=Math.max(b,c*(1048576>c?2:1.125)>>>0),0!=c&&(b=Math.max(b,256)),c=a.Ia,a.Ia=new Uint8Array(b),0<a.Oa&&a.Ia.set(c.subarray(0,a.Oa),0))},Gb:function(a,b){if(a.Oa!=b)if(0==b)a.Ia=null,a.Oa=0;else{if(!a.Ia||a.Ia.subarray){var c=a.Ia;a.Ia=new Uint8Array(b);c&&a.Ia.set(c.subarray(0,Math.min(b,a.Oa)))}else if(a.Ia||(a.Ia=[]),a.Ia.length>b)a.Ia.length=b;else for(;a.Ia.length<b;)a.Ia.push(0);a.Oa=
b}},Ja:{Qa:function(a){var b={};b.dev=8192===(a.mode&61440)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;R(a.mode)?b.size=4096:32768===(a.mode&61440)?b.size=a.Oa:40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.xb=4096;b.blocks=Math.ceil(b.size/b.xb);return b},Pa:function(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);void 0!==b.size&&P.Gb(a,
b.size)},lookup:function(){throw Ob[44];},Za:function(a,b,c,d){return P.createNode(a,b,c,d)},rename:function(a,b,c){if(R(a.mode)){try{var d=Pb(b,c)}catch(g){}if(d)for(var f in d.Ia)throw new O(55);}delete a.parent.Ia[a.name];a.name=c;b.Ia[c]=a;a.parent=b},unlink:function(a,b){delete a.Ia[b]},rmdir:function(a,b){var c=Pb(a,b),d;for(d in c.Ia)throw new O(55);delete a.Ia[b]},readdir:function(a){var b=[".",".."],c;for(c in a.Ia)a.Ia.hasOwnProperty(c)&&b.push(c);return b},symlink:function(a,b,c){a=P.createNode(a,
b,41471,0);a.link=c;return a},readlink:function(a){if(40960!==(a.mode&61440))throw new O(28);return a.link}},Ka:{read:function(a,b,c,d,f){var g=a.node.Ia;if(f>=a.node.Oa)return 0;a=Math.min(a.node.Oa-f,d);if(8<a&&g.subarray)b.set(g.subarray(f,f+a),c);else for(d=0;d<a;d++)b[c+d]=g[f+d];return a},write:function(a,b,c,d,f,g){b.buffer===x.buffer&&(g=!1);if(!d)return 0;a=a.node;a.timestamp=Date.now();if(b.subarray&&(!a.Ia||a.Ia.subarray)){if(g)return a.Ia=b.subarray(c,c+d),a.Oa=d;if(0===a.Oa&&0===f)return a.Ia=
b.slice(c,c+d),a.Oa=d;if(f+d<=a.Oa)return a.Ia.set(b.subarray(c,c+d),f),d}P.mb(a,f+d);if(a.Ia.subarray&&b.subarray)a.Ia.set(b.subarray(c,c+d),f);else for(g=0;g<d;g++)a.Ia[f+g]=b[c+g];a.Oa=Math.max(a.Oa,f+d);return d},Va:function(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.Oa);if(0>b)throw new O(28);return b},jb:function(a,b,c){P.mb(a.node,b+c);a.node.Oa=Math.max(a.node.Oa,b+c)},$a:function(a,b,c,d,f,g){assert(0===b);if(32768!==(a.node.mode&61440))throw new O(43);a=a.node.Ia;
if(g&2||a.buffer!==cb){if(0<d||d+c<a.length)a.subarray?a=a.subarray(d,d+c):a=Array.prototype.slice.call(a,d,d+c);d=!0;c=Za(c);if(!c)throw new O(48);x.set(a,c)}else d=!1,c=a.byteOffset;return{Fb:c,cb:d}},ab:function(a,b,c,d,f){if(32768!==(a.node.mode&61440))throw new O(43);if(f&2)return 0;P.Ka.write(a,b,0,d,c,!1);return 0}}},Qb=null,Rb={},T=[],Sb=1,U=null,Tb=!0,V={},O=null,Ob={};
function W(a,b){a=Fb("/",a);b=b||{};if(!a)return{path:"",node:null};var c={nb:!0,ib:0},d;for(d in c)void 0===b[d]&&(b[d]=c[d]);if(8<b.ib)throw new O(32);a=zb(a.split("/").filter(function(n){return!!n}),!1);var f=Qb;c="/";for(d=0;d<a.length;d++){var g=d===a.length-1;if(g&&b.parent)break;f=Pb(f,a[d]);c=k(c+"/"+a[d]);f.Wa&&(!g||g&&b.nb)&&(f=f.Wa.root);if(!g||b.Ua)for(g=0;40960===(f.mode&61440);)if(f=Ub(c),c=Fb(Ab(c),f),f=W(c,{ib:b.ib}).node,40<g++)throw new O(32);}return{path:c,node:f}}
function Vb(a){for(var b;;){if(a===a.parent)return a=a.Sa.pb,b?"/"!==a[a.length-1]?a+"/"+b:a+b:a;b=b?a.name+"/"+b:a.name;a=a.parent}}function Wb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%U.length}function Xb(a){var b=Wb(a.parent.id,a.name);if(U[b]===a)U[b]=a.Xa;else for(b=U[b];b;){if(b.Xa===a){b.Xa=a.Xa;break}b=b.Xa}}
function Pb(a,b){var c;if(c=(c=Yb(a,"x"))?c:a.Ja.lookup?0:2)throw new O(c,a);for(c=U[Wb(a.id,b)];c;c=c.Xa){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.Ja.lookup(a,b)}function Nb(a,b,c,d){a=new Zb(a,b,c,d);b=Wb(a.parent.id,a.name);a.Xa=U[b];return U[b]=a}function R(a){return 16384===(a&61440)}var $b={r:0,rs:1052672,"r+":2,w:577,wx:705,xw:705,"w+":578,"wx+":706,"xw+":706,a:1089,ax:1217,xa:1217,"a+":1090,"ax+":1218,"xa+":1218};
function ac(a){var b=["r","w","rw"][a&3];a&512&&(b+="w");return b}function Yb(a,b){if(Tb)return 0;if(-1===b.indexOf("r")||a.mode&292){if(-1!==b.indexOf("w")&&!(a.mode&146)||-1!==b.indexOf("x")&&!(a.mode&73))return 2}else return 2;return 0}function bc(a,b){try{return Pb(a,b),20}catch(c){}return Yb(a,"wx")}function cc(a,b,c){try{var d=Pb(a,b)}catch(f){return f.La}if(a=Yb(a,"wx"))return a;if(c){if(!R(d.mode))return 54;if(d===d.parent||"/"===Vb(d))return 10}else if(R(d.mode))return 31;return 0}
function dc(a){var b=4096;for(a=a||0;a<=b;a++)if(!T[a])return a;throw new O(33);}function ec(a,b){fc||(fc=function(){},fc.prototype={});var c=new fc,d;for(d in a)c[d]=a[d];a=c;b=dc(b);a.fd=b;return T[b]=a}var Mb={open:function(a){a.Ka=Rb[a.node.rdev].Ka;a.Ka.open&&a.Ka.open(a)},Va:function(){throw new O(70);}};function Ib(a,b){Rb[a]={Ka:b}}
function hc(a,b){var c="/"===b,d=!b;if(c&&Qb)throw new O(10);if(!c&&!d){var f=W(b,{nb:!1});b=f.path;f=f.node;if(f.Wa)throw new O(10);if(!R(f.mode))throw new O(54);}b={type:a,Lb:{},pb:b,Db:[]};a=a.Sa(b);a.Sa=b;b.root=a;c?Qb=a:f&&(f.Wa=b,f.Sa&&f.Sa.Db.push(b))}function ba(a,b,c){var d=W(a,{parent:!0}).node;a=Bb(a);if(!a||"."===a||".."===a)throw new O(28);var f=bc(d,a);if(f)throw new O(f);if(!d.Ja.Za)throw new O(63);return d.Ja.Za(d,a,b,c)}function X(a,b){ba(a,(void 0!==b?b:511)&1023|16384,0)}
function ic(a,b,c){"undefined"===typeof c&&(c=b,b=438);ba(a,b|8192,c)}function jc(a,b){if(!Fb(a))throw new O(44);var c=W(b,{parent:!0}).node;if(!c)throw new O(44);b=Bb(b);var d=bc(c,b);if(d)throw new O(d);if(!c.Ja.symlink)throw new O(63);c.Ja.symlink(c,b,a)}
function sa(a){var b=W(a,{parent:!0}).node,c=Bb(a),d=Pb(b,c),f=cc(b,c,!1);if(f)throw new O(f);if(!b.Ja.unlink)throw new O(63);if(d.Wa)throw new O(10);try{V.willDeletePath&&V.willDeletePath(a)}catch(g){E("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+g.message)}b.Ja.unlink(b,c);Xb(d);try{if(V.onDeletePath)V.onDeletePath(a)}catch(g){E("FS.trackingDelegate['onDeletePath']('"+a+"') threw an exception: "+g.message)}}
function Ub(a){a=W(a).node;if(!a)throw new O(44);if(!a.Ja.readlink)throw new O(28);return Fb(Vb(a.parent),a.Ja.readlink(a))}function kc(a,b){a=W(a,{Ua:!b}).node;if(!a)throw new O(44);if(!a.Ja.Qa)throw new O(63);return a.Ja.Qa(a)}function lc(a){return kc(a,!0)}function ca(a,b){var c;"string"===typeof a?c=W(a,{Ua:!0}).node:c=a;if(!c.Ja.Pa)throw new O(63);c.Ja.Pa(c,{mode:b&4095|c.mode&-4096,timestamp:Date.now()})}
function mc(a){var b;"string"===typeof a?b=W(a,{Ua:!0}).node:b=a;if(!b.Ja.Pa)throw new O(63);b.Ja.Pa(b,{timestamp:Date.now()})}function nc(a,b){if(0>b)throw new O(28);var c;"string"===typeof a?c=W(a,{Ua:!0}).node:c=a;if(!c.Ja.Pa)throw new O(63);if(R(c.mode))throw new O(31);if(32768!==(c.mode&61440))throw new O(28);if(a=Yb(c,"w"))throw new O(a);c.Ja.Pa(c,{size:b,timestamp:Date.now()})}
function l(a,b,c,d){if(""===a)throw new O(44);if("string"===typeof b){var f=$b[b];if("undefined"===typeof f)throw Error("Unknown file open mode: "+b);b=f}c=b&64?("undefined"===typeof c?438:c)&4095|32768:0;if("object"===typeof a)var g=a;else{a=k(a);try{g=W(a,{Ua:!(b&131072)}).node}catch(n){}}f=!1;if(b&64)if(g){if(b&128)throw new O(20);}else g=ba(a,c,0),f=!0;if(!g)throw new O(44);8192===(g.mode&61440)&&(b&=-513);if(b&65536&&!R(g.mode))throw new O(54);if(!f&&(c=g?40960===(g.mode&61440)?32:R(g.mode)&&
("r"!==ac(b)||b&512)?31:Yb(g,ac(b)):44))throw new O(c);b&512&&nc(g,0);b&=-131713;d=ec({node:g,path:Vb(g),flags:b,seekable:!0,position:0,Ka:g.Ka,Ib:[],error:!1},d);d.Ka.open&&d.Ka.open(d);!e.logReadFiles||b&1||(oc||(oc={}),a in oc||(oc[a]=1,E("FS.trackingDelegate error on read file: "+a)));try{V.onOpenFile&&(g=0,1!==(b&2097155)&&(g|=1),0!==(b&2097155)&&(g|=2),V.onOpenFile(a,g))}catch(n){E("FS.trackingDelegate['onOpenFile']('"+a+"', flags) threw an exception: "+n.message)}return d}
function ea(a){if(null===a.fd)throw new O(8);a.gb&&(a.gb=null);try{a.Ka.close&&a.Ka.close(a)}catch(b){throw b;}finally{T[a.fd]=null}a.fd=null}function pc(a,b,c){if(null===a.fd)throw new O(8);if(!a.seekable||!a.Ka.Va)throw new O(70);if(0!=c&&1!=c&&2!=c)throw new O(28);a.position=a.Ka.Va(a,b,c);a.Ib=[]}
function qc(a,b,c,d,f){if(0>d||0>f)throw new O(28);if(null===a.fd)throw new O(8);if(1===(a.flags&2097155))throw new O(8);if(R(a.node.mode))throw new O(31);if(!a.Ka.read)throw new O(28);var g="undefined"!==typeof f;if(!g)f=a.position;else if(!a.seekable)throw new O(70);b=a.Ka.read(a,b,c,d,f);g||(a.position+=b);return b}
function da(a,b,c,d,f,g){if(0>d||0>f)throw new O(28);if(null===a.fd)throw new O(8);if(0===(a.flags&2097155))throw new O(8);if(R(a.node.mode))throw new O(31);if(!a.Ka.write)throw new O(28);a.seekable&&a.flags&1024&&pc(a,0,2);var n="undefined"!==typeof f;if(!n)f=a.position;else if(!a.seekable)throw new O(70);b=a.Ka.write(a,b,c,d,f,g);n||(a.position+=b);try{if(a.path&&V.onWriteToFile)V.onWriteToFile(a.path)}catch(r){E("FS.trackingDelegate['onWriteToFile']('"+a.path+"') threw an exception: "+r.message)}return b}
function ra(a){var b={encoding:"binary"};b=b||{};b.flags=b.flags||"r";b.encoding=b.encoding||"binary";if("utf8"!==b.encoding&&"binary"!==b.encoding)throw Error('Invalid encoding type "'+b.encoding+'"');var c,d=l(a,b.flags);a=kc(a).size;var f=new Uint8Array(a);qc(d,f,0,a,0);"utf8"===b.encoding?c=ab(f,0):"binary"===b.encoding&&(c=f);ea(d);return c}
function rc(){O||(O=function(a,b){this.node=b;this.Hb=function(c){this.La=c};this.Hb(a);this.message="FS error"},O.prototype=Error(),O.prototype.constructor=O,[44].forEach(function(a){Ob[a]=new O(a);Ob[a].stack="<generic error, no stack>"}))}var Qc;function aa(a,b){var c=0;a&&(c|=365);b&&(c|=146);return c}
function Rc(a,b,c){a=k("/dev/"+a);var d=aa(!!b,!!c);Tc||(Tc=64);var f=Tc++<<8|0;Ib(f,{open:function(g){g.seekable=!1},close:function(){c&&c.buffer&&c.buffer.length&&c(10)},read:function(g,n,r,w){for(var u=0,C=0;C<w;C++){try{var H=b()}catch(ia){throw new O(29);}if(void 0===H&&0===u)throw new O(6);if(null===H||void 0===H)break;u++;n[r+C]=H}u&&(g.node.timestamp=Date.now());return u},write:function(g,n,r,w){for(var u=0;u<w;u++)try{c(n[r+u])}catch(C){throw new O(29);}w&&(g.node.timestamp=Date.now());return u}});
ic(a,d,f)}var Tc,Y={},fc,oc,Uc={};
function Vc(a,b,c){try{var d=a(b)}catch(f){if(f&&f.node&&k(b)!==k(Vb(f.node)))return-54;throw f;}G[c>>2]=d.dev;G[c+4>>2]=0;G[c+8>>2]=d.ino;G[c+12>>2]=d.mode;G[c+16>>2]=d.nlink;G[c+20>>2]=d.uid;G[c+24>>2]=d.gid;G[c+28>>2]=d.rdev;G[c+32>>2]=0;J=[d.size>>>0,(K=d.size,1<=+Na(K)?0<K?(Oa(+Pa(K/4294967296),4294967295)|0)>>>0:~~+Qa((K-+(~~K>>>0))/4294967296)>>>0:0)];G[c+40>>2]=J[0];G[c+44>>2]=J[1];G[c+48>>2]=4096;G[c+52>>2]=d.blocks;G[c+56>>2]=d.atime.getTime()/1E3|0;G[c+60>>2]=0;G[c+64>>2]=d.mtime.getTime()/
1E3|0;G[c+68>>2]=0;G[c+72>>2]=d.ctime.getTime()/1E3|0;G[c+76>>2]=0;J=[d.ino>>>0,(K=d.ino,1<=+Na(K)?0<K?(Oa(+Pa(K/4294967296),4294967295)|0)>>>0:~~+Qa((K-+(~~K>>>0))/4294967296)>>>0:0)];G[c+80>>2]=J[0];G[c+84>>2]=J[1];return 0}var Wc=void 0;function Xc(){Wc+=4;return G[Wc-4>>2]}function Z(a){a=T[a];if(!a)throw new O(8);return a}var Yc={};
function Zc(){if(!$c){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"===typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:wa||"./this.program"},b;for(b in Yc)a[b]=Yc[b];var c=[];for(b in a)c.push(b+"="+a[b]);$c=c}return $c}var $c;ma("GMT",M,63120,4);
function ad(){function a(g){return(g=g.toTimeString().match(/\(([A-Za-z ]+)\)$/))?g[1]:"GMT"}if(!bd){bd=!0;G[cd()>>2]=60*(new Date).getTimezoneOffset();var b=(new Date).getFullYear(),c=new Date(b,0,1);b=new Date(b,6,1);G[dd()>>2]=Number(c.getTimezoneOffset()!=b.getTimezoneOffset());var d=a(c),f=a(b);d=bb(d);f=bb(f);b.getTimezoneOffset()<c.getTimezoneOffset()?(G[ed()>>2]=d,G[ed()+4>>2]=f):(G[ed()>>2]=f,G[ed()+4>>2]=d)}}var bd,fd;
za?fd=function(){var a=process.hrtime();return 1E3*a[0]+a[1]/1E6}:"undefined"!==typeof dateNow?fd=dateNow:fd=function(){return performance.now()};function gd(a){for(var b=fd();fd()-b<a/1E3;);}e._usleep=gd;function Zb(a,b,c,d){a||(a=this);this.parent=a;this.Sa=a.Sa;this.Wa=null;this.id=Sb++;this.name=b;this.mode=c;this.Ja={};this.Ka={};this.rdev=d}
Object.defineProperties(Zb.prototype,{read:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}}});rc();U=Array(4096);hc(P,"/");X("/tmp");X("/home");X("/home/web_user");
(function(){X("/dev");Ib(259,{read:function(){return 0},write:function(d,f,g,n){return n}});ic("/dev/null",259);Hb(1280,Kb);Hb(1536,Lb);ic("/dev/tty",1280);ic("/dev/tty1",1536);if("object"===typeof crypto&&"function"===typeof crypto.getRandomValues){var a=new Uint8Array(1);var b=function(){crypto.getRandomValues(a);return a[0]}}else if(za)try{var c=require("crypto");b=function(){return c.randomBytes(1)[0]}}catch(d){}b||(b=function(){D("random_device")});Rc("random",b);Rc("urandom",b);X("/dev/shm");
X("/dev/shm/tmp")})();X("/proc");X("/proc/self");X("/proc/self/fd");hc({Sa:function(){var a=Nb("/proc/self","fd",16895,73);a.Ja={lookup:function(b,c){var d=T[+c];if(!d)throw new O(8);b={parent:null,Sa:{pb:"fake"},Ja:{readlink:function(){return d.path}}};return b.parent=b}};return a}},"/proc/self/fd");function fa(a,b){var c=Array(la(a)+1);a=ma(a,c,0,c.length);b&&(c.length=a);return c}
var jd={a:function(a,b,c,d){D("Assertion failed: "+N(a)+", at: "+[b?N(b):"unknown filename",c,d?N(d):"unknown function"])},t:function(a,b){try{a=N(a);if(b&-8)var c=-28;else{var d;(d=W(a,{Ua:!0}).node)?(a="",b&4&&(a+="r"),b&2&&(a+="w"),b&1&&(a+="x"),c=a&&Yb(d,a)?-2:0):c=-44}return c}catch(f){return"undefined"!==typeof Y&&f instanceof O||D(f),-f.La}},h:function(a,b){try{return a=N(a),ca(a,b),0}catch(c){return"undefined"!==typeof Y&&c instanceof O||D(c),-c.La}},A:function(a){try{return a=N(a),mc(a),
0}catch(b){return"undefined"!==typeof Y&&b instanceof O||D(b),-b.La}},i:function(a,b){try{var c=T[a];if(!c)throw new O(8);ca(c.node,b);return 0}catch(d){return"undefined"!==typeof Y&&d instanceof O||D(d),-d.La}},C:function(a){try{var b=T[a];if(!b)throw new O(8);mc(b.node);return 0}catch(c){return"undefined"!==typeof Y&&c instanceof O||D(c),-c.La}},b:function(a,b,c){Wc=c;try{var d=Z(a);switch(b){case 0:var f=Xc();return 0>f?-28:l(d.path,d.flags,0,f).fd;case 1:case 2:return 0;case 3:return d.flags;
case 4:return f=Xc(),d.flags|=f,0;case 12:return f=Xc(),Ma[f+0>>1]=2,0;case 13:case 14:return 0;case 16:case 8:return-28;case 9:return Db(28),-1;default:return-28}}catch(g){return"undefined"!==typeof Y&&g instanceof O||D(g),-g.La}},j:function(a,b){try{var c=Z(a);return Vc(kc,c.path,b)}catch(d){return"undefined"!==typeof Y&&d instanceof O||D(d),-d.La}},F:function(a,b,c){try{var d=T[a];if(!d)throw new O(8);if(0===(d.flags&2097155))throw new O(28);nc(d.node,c);return 0}catch(f){return"undefined"!==typeof Y&&
f instanceof O||D(f),-f.La}},v:function(a,b){try{if(0===b)return-28;if(b<la("/")+1)return-68;ma("/",M,a,b);return a}catch(c){return"undefined"!==typeof Y&&c instanceof O||D(c),-c.La}},y:function(){return 0},d:function(){return 42},I:function(a,b){try{return a=N(a),Vc(lc,a,b)}catch(c){return"undefined"!==typeof Y&&c instanceof O||D(c),-c.La}},J:function(a,b){try{return a=N(a),a=k(a),"/"===a[a.length-1]&&(a=a.substr(0,a.length-1)),X(a,b),0}catch(c){return"undefined"!==typeof Y&&c instanceof O||D(c),
-c.La}},s:function(a,b,c,d,f,g){try{a:{g<<=12;var n=!1;if(0!==(d&16)&&0!==a%16384)var r=-28;else{if(0!==(d&32)){var w=hd(16384,b);if(!w){r=-48;break a}id(w,0,b);n=!0}else{var u=T[f];if(!u){r=-8;break a}var C=g;if(0!==(c&2)&&0===(d&2)&&2!==(u.flags&2097155))throw new O(2);if(1===(u.flags&2097155))throw new O(2);if(!u.Ka.$a)throw new O(43);var H=u.Ka.$a(u,a,b,C,c,d);w=H.Fb;n=H.cb}Uc[w]={Cb:w,Bb:b,cb:n,fd:f,Eb:c,flags:d,offset:g};r=w}}return r}catch(ia){return"undefined"!==typeof Y&&ia instanceof O||
D(ia),-ia.La}},q:function(a,b){try{if(-1===(a|0)||0===b)var c=-28;else{var d=Uc[a];if(d&&b===d.Bb){var f=T[d.fd];if(d.Eb&2){var g=d.flags,n=d.offset,r=M.slice(a,a+b);f&&f.Ka.ab&&f.Ka.ab(f,r,n,b,g)}Uc[a]=null;d.cb&&ja(d.Cb)}c=0}return c}catch(w){return"undefined"!==typeof Y&&w instanceof O||D(w),-w.La}},H:function(a,b,c){Wc=c;try{var d=N(a),f=Xc();return l(d,b,f).fd}catch(g){return"undefined"!==typeof Y&&g instanceof O||D(g),-g.La}},u:function(a,b,c){try{var d=Z(a);return qc(d,x,b,c)}catch(f){return"undefined"!==
typeof Y&&f instanceof O||D(f),-f.La}},w:function(a,b,c){try{a=N(a);if(0>=c)var d=-28;else{var f=Ub(a),g=Math.min(c,la(f)),n=x[b+g];ma(f,M,b,c+1);x[b+g]=n;d=g}return d}catch(r){return"undefined"!==typeof Y&&r instanceof O||D(r),-r.La}},G:function(a){try{a=N(a);var b=W(a,{parent:!0}).node,c=Bb(a),d=Pb(b,c),f=cc(b,c,!0);if(f)throw new O(f);if(!b.Ja.rmdir)throw new O(63);if(d.Wa)throw new O(10);try{V.willDeletePath&&V.willDeletePath(a)}catch(g){E("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+
g.message)}b.Ja.rmdir(b,c);Xb(d);try{if(V.onDeletePath)V.onDeletePath(a)}catch(g){E("FS.trackingDelegate['onDeletePath']('"+a+"') threw an exception: "+g.message)}return 0}catch(g){return"undefined"!==typeof Y&&g instanceof O||D(g),-g.La}},e:function(a,b){try{return a=N(a),Vc(kc,a,b)}catch(c){return"undefined"!==typeof Y&&c instanceof O||D(c),-c.La}},D:function(a){try{return a=N(a),sa(a),0}catch(b){return"undefined"!==typeof Y&&b instanceof O||D(b),-b.La}},m:function(a,b,c){M.copyWithin(a,b,b+c)},
c:function(a){a>>>=0;var b=M.length;if(2147483648<a)return!1;for(var c=1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,a+100663296);d=Math.max(16777216,a,d);0<d%65536&&(d+=65536-d%65536);a:{try{Ta.grow(Math.min(2147483648,d)-cb.byteLength+65535>>>16);db(Ta.buffer);var f=1;break a}catch(g){}f=void 0}if(f)return!0}return!1},o:function(a,b){var c=0;Zc().forEach(function(d,f){var g=b+c;f=G[a+4*f>>2]=g;for(g=0;g<d.length;++g)x[f++>>0]=d.charCodeAt(g);x[f>>0]=0;c+=d.length+1});return 0},p:function(a,b){var c=
Zc();G[a>>2]=c.length;var d=0;c.forEach(function(f){d+=f.length+1});G[b>>2]=d;return 0},f:function(a){try{var b=Z(a);ea(b);return 0}catch(c){return"undefined"!==typeof Y&&c instanceof O||D(c),c.La}},n:function(a,b){try{var c=Z(a);x[b>>0]=c.tty?2:R(c.mode)?3:40960===(c.mode&61440)?7:4;return 0}catch(d){return"undefined"!==typeof Y&&d instanceof O||D(d),d.La}},l:function(a,b,c,d,f){try{var g=Z(a);a=4294967296*c+(b>>>0);if(-9007199254740992>=a||9007199254740992<=a)return-61;pc(g,a,d);J=[g.position>>>
0,(K=g.position,1<=+Na(K)?0<K?(Oa(+Pa(K/4294967296),4294967295)|0)>>>0:~~+Qa((K-+(~~K>>>0))/4294967296)>>>0:0)];G[f>>2]=J[0];G[f+4>>2]=J[1];g.gb&&0===a&&0===d&&(g.gb=null);return 0}catch(n){return"undefined"!==typeof Y&&n instanceof O||D(n),n.La}},E:function(a){try{var b=Z(a);return b.Ka&&b.Ka.fsync?-b.Ka.fsync(b):0}catch(c){return"undefined"!==typeof Y&&c instanceof O||D(c),c.La}},z:function(a,b,c,d){try{a:{for(var f=Z(a),g=a=0;g<c;g++){var n=da(f,x,G[b+8*g>>2],G[b+(8*g+4)>>2],void 0);if(0>n){var r=
-1;break a}a+=n}r=a}G[d>>2]=r;return 0}catch(w){return"undefined"!==typeof Y&&w instanceof O||D(w),w.La}},g:function(a){var b=Date.now();G[a>>2]=b/1E3|0;G[a+4>>2]=b%1E3*1E3|0;return 0},k:function(a){ad();a=new Date(1E3*G[a>>2]);G[15768]=a.getSeconds();G[15769]=a.getMinutes();G[15770]=a.getHours();G[15771]=a.getDate();G[15772]=a.getMonth();G[15773]=a.getFullYear()-1900;G[15774]=a.getDay();var b=new Date(a.getFullYear(),0,1);G[15775]=(a.getTime()-b.getTime())/864E5|0;G[15777]=-(60*a.getTimezoneOffset());
var c=(new Date(a.getFullYear(),6,1)).getTimezoneOffset();b=b.getTimezoneOffset();a=(c!=b&&a.getTimezoneOffset()==Math.min(b,c))|0;G[15776]=a;a=G[ed()+(a?4:0)>>2];G[15778]=a;return 63072},memory:Ta,x:function(a,b){if(0===a)return Db(28),-1;var c=G[a>>2];a=G[a+4>>2];if(0>a||999999999<a||0>c)return Db(28),-1;0!==b&&(G[b>>2]=0,G[b+4>>2]=0);return gd(1E6*c+a/1E3)},B:function(a){switch(a){case 30:return 16384;case 85:return 131072;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:case 79:return 200809;
case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;
case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1E3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:return"object"===typeof navigator?navigator.hardwareConcurrency||1:1}Db(28);return-1},
table:I,K:function(a){var b=Date.now()/1E3|0;a&&(G[a>>2]=b);return b},r:function(a,b){if(b){var c=1E3*G[b+8>>2];c+=G[b+12>>2]/1E3}else c=Date.now();a=N(a);try{b=c;var d=W(a,{Ua:!0}).node;d.Ja.Pa(d,{timestamp:Math.max(b,c)});return 0}catch(f){a=f;if(!(a instanceof O)){a+=" : ";a:{d=Error();if(!d.stack){try{throw Error();}catch(g){d=g}if(!d.stack){d="(no stack trace available)";break a}}d=d.stack.toString()}e.extraStackTrace&&(d+="\n"+e.extraStackTrace());d=yb(d);throw a+d;}Db(a.La);return-1}}};
(function(){function a(f){e.asm=f.exports;lb--;e.monitorRunDependencies&&e.monitorRunDependencies(lb);0==lb&&(null!==mb&&(clearInterval(mb),mb=null),nb&&(f=nb,nb=null,f()))}function b(f){a(f.instance)}function c(f){return tb().then(function(g){return WebAssembly.instantiate(g,d)}).then(f,function(g){E("failed to asynchronously prepare wasm: "+g);D(g)})}var d={a:jd};lb++;e.monitorRunDependencies&&e.monitorRunDependencies(lb);if(e.instantiateWasm)try{return e.instantiateWasm(d,a)}catch(f){return E("Module.instantiateWasm callback failed with error: "+
f),!1}(function(){if(La||"function"!==typeof WebAssembly.instantiateStreaming||qb()||ob("file://")||"function"!==typeof fetch)return c(b);fetch(pb,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,d).then(b,function(g){E("wasm streaming compile failed: "+g);E("falling back to ArrayBuffer instantiation");return c(b)})})})();return{}})();
var ub=e.___wasm_call_ctors=function(){return(ub=e.___wasm_call_ctors=e.asm.L).apply(null,arguments)},id=e._memset=function(){return(id=e._memset=e.asm.M).apply(null,arguments)};e._sqlite3_free=function(){return(e._sqlite3_free=e.asm.N).apply(null,arguments)};var Eb=e.___errno_location=function(){return(Eb=e.___errno_location=e.asm.O).apply(null,arguments)};e._sqlite3_finalize=function(){return(e._sqlite3_finalize=e.asm.P).apply(null,arguments)};
e._sqlite3_reset=function(){return(e._sqlite3_reset=e.asm.Q).apply(null,arguments)};e._sqlite3_clear_bindings=function(){return(e._sqlite3_clear_bindings=e.asm.R).apply(null,arguments)};e._sqlite3_value_blob=function(){return(e._sqlite3_value_blob=e.asm.S).apply(null,arguments)};e._sqlite3_value_text=function(){return(e._sqlite3_value_text=e.asm.T).apply(null,arguments)};e._sqlite3_value_bytes=function(){return(e._sqlite3_value_bytes=e.asm.U).apply(null,arguments)};
e._sqlite3_value_double=function(){return(e._sqlite3_value_double=e.asm.V).apply(null,arguments)};e._sqlite3_value_int=function(){return(e._sqlite3_value_int=e.asm.W).apply(null,arguments)};e._sqlite3_value_type=function(){return(e._sqlite3_value_type=e.asm.X).apply(null,arguments)};e._sqlite3_result_blob=function(){return(e._sqlite3_result_blob=e.asm.Y).apply(null,arguments)};e._sqlite3_result_double=function(){return(e._sqlite3_result_double=e.asm.Z).apply(null,arguments)};
e._sqlite3_result_error=function(){return(e._sqlite3_result_error=e.asm._).apply(null,arguments)};e._sqlite3_result_int=function(){return(e._sqlite3_result_int=e.asm.$).apply(null,arguments)};e._sqlite3_result_int64=function(){return(e._sqlite3_result_int64=e.asm.aa).apply(null,arguments)};e._sqlite3_result_null=function(){return(e._sqlite3_result_null=e.asm.ba).apply(null,arguments)};e._sqlite3_result_text=function(){return(e._sqlite3_result_text=e.asm.ca).apply(null,arguments)};
e._sqlite3_step=function(){return(e._sqlite3_step=e.asm.da).apply(null,arguments)};e._sqlite3_data_count=function(){return(e._sqlite3_data_count=e.asm.ea).apply(null,arguments)};e._sqlite3_column_blob=function(){return(e._sqlite3_column_blob=e.asm.fa).apply(null,arguments)};e._sqlite3_column_bytes=function(){return(e._sqlite3_column_bytes=e.asm.ga).apply(null,arguments)};e._sqlite3_column_double=function(){return(e._sqlite3_column_double=e.asm.ha).apply(null,arguments)};
e._sqlite3_column_text=function(){return(e._sqlite3_column_text=e.asm.ia).apply(null,arguments)};e._sqlite3_column_type=function(){return(e._sqlite3_column_type=e.asm.ja).apply(null,arguments)};e._sqlite3_column_name=function(){return(e._sqlite3_column_name=e.asm.ka).apply(null,arguments)};e._sqlite3_bind_blob=function(){return(e._sqlite3_bind_blob=e.asm.la).apply(null,arguments)};e._sqlite3_bind_double=function(){return(e._sqlite3_bind_double=e.asm.ma).apply(null,arguments)};
e._sqlite3_bind_int=function(){return(e._sqlite3_bind_int=e.asm.na).apply(null,arguments)};e._sqlite3_bind_text=function(){return(e._sqlite3_bind_text=e.asm.oa).apply(null,arguments)};e._sqlite3_bind_parameter_index=function(){return(e._sqlite3_bind_parameter_index=e.asm.pa).apply(null,arguments)};e._sqlite3_errmsg=function(){return(e._sqlite3_errmsg=e.asm.qa).apply(null,arguments)};e._sqlite3_exec=function(){return(e._sqlite3_exec=e.asm.ra).apply(null,arguments)};
e._sqlite3_prepare_v2=function(){return(e._sqlite3_prepare_v2=e.asm.sa).apply(null,arguments)};e._sqlite3_changes=function(){return(e._sqlite3_changes=e.asm.ta).apply(null,arguments)};e._sqlite3_close_v2=function(){return(e._sqlite3_close_v2=e.asm.ua).apply(null,arguments)};e._sqlite3_create_function_v2=function(){return(e._sqlite3_create_function_v2=e.asm.va).apply(null,arguments)};e._sqlite3_open=function(){return(e._sqlite3_open=e.asm.wa).apply(null,arguments)};
var Za=e._malloc=function(){return(Za=e._malloc=e.asm.xa).apply(null,arguments)},ja=e._free=function(){return(ja=e._free=e.asm.ya).apply(null,arguments)};e._RegisterExtensionFunctions=function(){return(e._RegisterExtensionFunctions=e.asm.za).apply(null,arguments)};
var ed=e.__get_tzname=function(){return(ed=e.__get_tzname=e.asm.Aa).apply(null,arguments)},dd=e.__get_daylight=function(){return(dd=e.__get_daylight=e.asm.Ba).apply(null,arguments)},cd=e.__get_timezone=function(){return(cd=e.__get_timezone=e.asm.Ca).apply(null,arguments)},ka=e.stackSave=function(){return(ka=e.stackSave=e.asm.Da).apply(null,arguments)},oa=e.stackRestore=function(){return(oa=e.stackRestore=e.asm.Ea).apply(null,arguments)},t=e.stackAlloc=function(){return(t=e.stackAlloc=e.asm.Fa).apply(null,
arguments)},hd=e._memalign=function(){return(hd=e._memalign=e.asm.Ga).apply(null,arguments)};e.dynCall_vi=function(){return(e.dynCall_vi=e.asm.Ha).apply(null,arguments)};e.cwrap=function(a,b,c,d){c=c||[];var f=c.every(function(g){return"number"===g});return"string"!==b&&f&&!d?Va(a):function(){return Wa(a,b,c,arguments)}};e.stackSave=ka;e.stackRestore=oa;e.stackAlloc=t;var kd;nb=function ld(){kd||md();kd||(nb=ld)};
function md(){function a(){if(!kd&&(kd=!0,e.calledRun=!0,!Ua)){e.noFSInit||Qc||(Qc=!0,rc(),e.stdin=e.stdin,e.stdout=e.stdout,e.stderr=e.stderr,e.stdin?Rc("stdin",e.stdin):jc("/dev/tty","/dev/stdin"),e.stdout?Rc("stdout",null,e.stdout):jc("/dev/tty","/dev/stdout"),e.stderr?Rc("stderr",null,e.stderr):jc("/dev/tty1","/dev/stderr"),l("/dev/stdin","r"),l("/dev/stdout","w"),l("/dev/stderr","w"));fb(hb);Tb=!1;fb(ib);if(e.onRuntimeInitialized)e.onRuntimeInitialized();if(e.postRun)for("function"==typeof e.postRun&&
(e.postRun=[e.postRun]);e.postRun.length;){var b=e.postRun.shift();jb.unshift(b)}fb(jb)}}if(!(0<lb)){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)kb();fb(gb);0<lb||(e.setStatus?(e.setStatus("Running..."),setTimeout(function(){setTimeout(function(){e.setStatus("")},1);a()},1)):a())}}e.run=md;if(e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);0<e.preInit.length;)e.preInit.pop()();noExitRuntime=!0;md();


        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

  return initSqlJsPromise;
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object'){
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs;
}
else if (typeof define === 'function' && define['amd']) {
    define([], function() { return initSqlJs; });
}
else if (typeof exports === 'object'){
    exports["Module"] = initSqlJs;
}
/* global initSqlJs */
/* eslint-env worker */
/* eslint no-restricted-globals: ["error"] */
var db;

function onModuleReady(SQL) {
    "use strict";

    function createDb(data) {
        if (db != null) db.close();
        db = new SQL.Database(data);
        return db;
    }

    var buff; var data; var result;
    data = this["data"];
    switch (data && data["action"]) {
        case "open":
            buff = data["buffer"];
            createDb(buff && new Uint8Array(buff));
            return postMessage({
                id: data["id"],
                ready: true
            });
        case "exec":
            if (db === null) {
                createDb();
            }
            if (!data["sql"]) {
                throw "exec: Missing query string";
            }
            return postMessage({
                id: data["id"],
                results: db.exec(data["sql"], data["params"])
            });
        case "each":
            if (db === null) {
                createDb();
            }
            var callback = function callback(row) {
                return postMessage({
                    id: data["id"],
                    row: row,
                    finished: false
                });
            };
            var done = function done() {
                return postMessage({
                    id: data["id"],
                    finished: true
                });
            };
            return db.each(data["sql"], data["params"], callback, done);
        case "export":
            buff = db["export"]();
            result = {
                id: data["id"],
                buffer: buff
            };
            try {
                return postMessage(result, [result]);
            } catch (error) {
                return postMessage(result);
            }
        case "close":
            if (db) {
                db.close();
            }
            return postMessage({
                id: data["id"]
            });
        default:
            throw new Error("Invalid action : " + (data && data["action"]));
    }
}

function onError(err) {
    "use strict";

    return postMessage({
        id: this["data"]["id"],
        error: err["message"]
    });
}

if (typeof importScripts === "function") {
    db = null;
    var sqlModuleReady = initSqlJs();
    self.onmessage = function onmessage(event) {
        "use strict";

        return sqlModuleReady
            .then(onModuleReady.bind(event))
            .catch(onError.bind(event));
    };
}
