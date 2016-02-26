/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, setTimeout, opera */
(function(global, undefined) {

  // lightweight Event Emitter
  // author: Treri
  var Event = (function(){

    function Event(){}

    Event.prototype.on = function(evt, cbk, ctx){
      if(!this._events){
        this._events = {};
      }
      if(!this._events.hasOwnProperty(evt)){
        this._events[evt] = [];
      }
      for(var i = 0; i < this._events[evt].length; i++){
        if(this._events[evt][i].cbk == cbk){
          return this;
        }
      }

      this._events[evt].push({
        cbk: cbk,
        ctx: ctx
      });

      return this;
    };

    Event.prototype.once = function(evt, cbk, ctx){

      this.on(evt, callback, this);

      function callback(){
        cbk.apply(ctx || null, [].slice.call(arguments));
        this.off(evt, callback);
      }
    };

    Event.prototype.off = function(evt, cbk){
      if(!this._events){
        return this;
      }
      if(!this._events.hasOwnProperty(evt)){
        return this;
      }

      if(!cbk){
        this._events[evt] = [];
        return this;
      }

      var index, i;
      for(i = 0; i < this._events[evt].length; i++){
        if(this._events[evt][i].cbk == cbk){
          index = i;
          break;
        }
      }

      if(index !== undefined){
        this._events[evt].splice(index, 1);
      }

      return this;
    };

    Event.prototype.emit = function(evt){
      if(!evt){
        return this;
      }
      if(!this._events){
        return;
      }
      if(!this._events.hasOwnProperty(evt)){
        return this;
      }

      var args = [].slice.call(arguments, 1);

      var i, cbk, ctx;
      for(i = 0; i < this._events[evt].length; i++){
        cbk = this._events[evt][i].cbk;
        ctx = this._events[evt][i].ctx;

        cbk.apply(ctx || null, args);
      }
      return this;
    };

    return Event;
  })();

  var document = global.document,
    head = document.head || document.getElementsByTagName('head')[0] || document.documentElement,
    baseElement = document.getElementsByTagName('base')[0],
    noop = function() {},
    currentlyAddingScript, interactiveScript,
    dirnameReg = /[^?#]*\//,
    dotReg = /\/\.\//g,
    doubleDotReg = /\/[^/]+\/\.\.\//,
    multiSlashReg = /([^:/])\/+\//g,
    ignorePartReg = /[?#].*$/,
    suffixReg = /\.(js|css|html|jpe?g|png|gif)$/,
    jsReg = /\.js(\?.*)?$/,
    cssReg = /\.css(\?.*)?$/,
    htmlReg = /\.html(\?.*)?$/,
    imageReg = /\.(jpe?g|png|gif)(\?.*)?$/,

    seed = {
      // 缓存模块
      modules: {},
      config: {
        baseUrl: '',
        charset: '',
        paths: {},
        shim: {},
        urlArgs: ''
      }
    };

  function isType(obj, type){
    return Object.prototype.toString.call(obj) === '[object ' + type + ']';
  }

  /**
   * 遍历数组，回调返回 true 时终止遍历
   */
  function forEach(arr, callback) {
    if(!isType(arr, 'Array')){
      return;
    }
    for (var i = 0; i < arr.length; i++) {
      if (callback(arr[i], i, arr)) {
        break;
      }
    }
  }

  function map(arr, callback){
    if(!isType(arr, 'Array')){
      return [];
    }

    var result = [];
    for(var i = 0; i < arr.length; i++){
      result.push(callback(arr[i], i, arr));
    }

    return result;
  }

  /**
   * 判断是否为一个空白对象
   */
  function isPlainObject(obj) {
    var isPlain = true;

    for(var prop in obj){
      if(obj.hasOwnProperty(prop)){
        isPlain = false;
        break;
      }
    }

    return isPlain;
  }

  /**
   * 复制源对象的属性到目标对象中
   * 支持一次从多个source中进行扩展
   */
  function extend(target) {
    var sources = [].slice.call(arguments, 1);
    if (!sources.length) {
      return target;
    }

    var i, source, key;
    for(i = 0; i < sources.length; i++){
      source = sources[i];
      for (key in source) {
        if (!target[key] || isType(target[key], 'String')) {
          target[key] = source[key];
        } else {
          extend(target[key], source[key]);
        }
      }
    }

    return target;
  }

  function makeError(name, msg) {
    throw new Error(name + ":" + msg);
  }

  /**
   * 获取全局变量值。允许格式：a.b.c
   */
  function getGlobal(keychain) {
    if (!keychain) {
      return keychain;
    }
    var g = global;
    forEach(keychain.split('.'), function(key) {
      g = g[key];
    });
    return g;
  }


  /* path */
  /**
   * 获取path对应的目录部分
   *
   * a/b/c.js?foo=1#d/e  --> a/b/
   */
  function dirname(path) {
    var m = path.match(dirnameReg);
    return m ? m[0] : "./";
  }

  /**
   * 规范化path
   *
   * http://test.com/a//./b/../c  -->  "http://test.com/a/c"
   */
  function realpath(path) {
    // /a/b/./c/./d --> /a/b/c/d
    path = path.replace(dotReg, "/");

    // a//b/c --> a/b/c
    // a///b////c --> a/b/c
    path = path.replace(multiSlashReg, "$1/");

    // a/b/c/../../d --> a/b/../d --> a/d
    while (path.match(doubleDotReg)) {
      path = path.replace(doubleDotReg, "/");
    }

    return path;
  }

  /**
   * 将模块id解析为对应的url
   *
   * rules:
   * baseUrl: http://gcfeng.github.io/blog/js
   * host: http://gcfeng.github.io/blog
   *
   * http://gcfeng.github.io/blog/js/test.js  -->  http://gcfeng.github.io/blog/js/test.js
   *                                    test  -->  http://gcfeng.github.io/blog/js/test.js
   *                              ../test.js  -->  http://gcfeng.github.io/blog/test.js
   *                                /test.js  -->  http://gcfeng.github.io/blog/test.js
   *                            test?foo#bar  -->  http://gcfeng.github.io/blog/test.js
   *
   * @param {String} id 模块id
   * @param {String} baseUrl 模块url对应的基地址
   */
  function id2Url(id) {
    var config = seed.config;

    id = config.paths[id] || id;

    // main///test?foo#bar  -->  main/test?foo#bar
    id = realpath(id);

    // main/test?foo#bar  -->  main/test
    id = id.replace(ignorePartReg, "");

    id = suffixReg.test(id) ? id : (id + '.js');

    id = realpath(dirname(seed.config.baseUrl) + id);

    id = id + (config.urlArgs || "");

    return id;
  }

  /**
   * 获取当前正在运行的脚本
   */
  function getCurrentScript() {
    if (currentlyAddingScript) {
      return currentlyAddingScript;
    }

    if (interactiveScript && interactiveScript.readyState === 'interactive') {
      return interactiveScript;
    }

    if (document.currentScript) {
      return interactiveScript = document.currentScript;
    }

    var i, script, scripts = document.getElementsByTagName('script');

    for(i = scripts.length - 1; i >= 0; i--){
      script = scripts[i];
      if(script.readyState === 'interactive'){
        interactiveScript = script;
        break;
      }
    }

    return interactiveScript;
  }

  /**
   * 请求JavaScript文件
   */
  function loadScript(id, callback, context) {
    var config = seed.config,
      node = document.createElement('script'),
      supportOnload = 'onload' in node;

    node.charset = config.charset || 'utf-8';
    node.setAttribute('data-module-id', id);

    // 绑定事件
    if (supportOnload) {
      node.onload = function() {
        onload();
      };
      node.onerror = function() {
        onload(true);
      }
    } else {
      node.onreadystatechange = function() {
        if (/loaded|complete/.test(node.readyState)) {
          onload();
        }
      }
    }

    node.async = true;
    node.src = id2Url(id);

    // 在IE6-8浏览器中，某些缓存会导致结点一旦插入就立即执行脚本
    currentlyAddingScript = node;

    // ref: #185 & http://dev.jquery.com/ticket/2709
    baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);

    currentlyAddingScript = null;


    function onload(error) {
      // 保证执行一次
      node.onload = node.onerror = node.onreadystatechange = null;
      // 删除脚本节点
      // head.removeChild(node);
      node = null;
      callback.call(context, error);
    }
  }

  function loadCss(id, callback, context) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', id2Url(id));

    var parent = document.getElementsByTagName('head')[0] || document.body;
    parent.appendChild(link);

    parent = null;
    link = null;

    callback.call(context, null);
  }

  function loadText(id, callback, context) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        callback.call(context, null, xhr.responseText);
      }
    };
    xhr.open('GET', id2Url(id), true);
    xhr.send(null);
  }

  function uniqueID(){
    return "seed_" + (+new Date()) + (Math.random() + '').slice(-8);
  }

  // 记录模块的状态信息
  Module.STATUS = {
    // 初始状态，此时模块刚刚新建
    INITIAL: 0,
    // 加载module.url指定资源
    FETCH: 1,
    // 保存module的依赖信息
    SAVE: 2,
    // 解析module的依赖内容
    LOAD: 3,
    // 执行模块，exports还不可用
    EXECUTING: 4,
    // 模块执行完毕，exports可用
    EXECUTED: 5,
    // 出错：请求或者执行出错
    ERROR: 6
  };

  function Module(id) {
    this.id = id;
    this.factory = null;
    this.deps = [];
    this.exports = {};
    this.status = Module.STATUS.INITIAL;
  }

  extend(Module.prototype = new Event, {
    /**
     * 发送请求加载资源
     */
    fetch: function() {
      if (this.status >= Module.STATUS.FETCH) {
        return this;
      }
      this.status = Module.STATUS.FETCH;

      var url = id2Url(this.id);

      if (jsReg.test(url)) {
        loadScript(this.id, this.onloadScript, this);
      } else if (cssReg.test(url)) {
        loadCss(this.id, this.onloadCss, this);
      } else if (htmlReg.test(url)) {
        loadText(this.id, this.onloadText, this);
      }
    },

    save: function(deps) {
      if (this.status >= Module.STATUS.SAVE) {
        return this;
      }
      this.status = Module.STATUS.SAVE;
      this.deps = deps || [];
    },

    load: function() {
      var self = this

      if (self.status >= Module.STATUS.LOAD) {
        return self;
      }

      self.status = Module.STATUS.LOAD;

      // 如果没有依赖, 则直接执行factory方法
      if(self.deps.length === 0){
        return self.fireFactory();
      }

      forEach(self.deps, function(id){
        var module = Module.get(id);

        // 检查循环依赖
        var isCircular = false;
        forEach(module.deps, function(id){
          if(id === self.id){
            return isCircular = true;
          }
        });
        if(isCircular){
          throw new Error('circular dependency: ' + self.id + ' ==> ' + id + ' ==> ' + self.id);
          return;
        }

        if(module.status < Module.STATUS.EXECUTED){
          module.once('EXECUTED', self.executing, self);
        }

        if(module.status < Module.STATUS.FETCH){
          module.fetch();
        }else if(module.status === Module.STATUS.SAVE){
          module.load();
        }else if(module.status >= Module.STATUS.EXECUTED){
          self.executing();
        }
      });
    },

    // 检查是否全部依赖加载完毕
    executing: function(){
      var count = this.deps.length;
      var deps = this.deps.slice();
      forEach(this.deps, function(id, index){
        var module = Module.get(id);

        if(module.status >= Module.STATUS.EXECUTED){
          count --;
          deps.splice(index, 1);
        }
      });


      if(count <= 0){
        this.fireFactory();
      }
    },

    fireFactory: function(){
      var args = map(this.deps, function(id){
        var module = Module.get(id);
        return module.exports;
      });

      if(isType(this.factory, 'Function')){
        this.exports = this.factory.apply(this, args);
      }else{
        this.exports = this.factory;
      }

      this.status = Module.STATUS.EXECUTED;
      this.emit('EXECUTED');
    },

    onloadScript: function(error) {
      var mod = this,
        config = seed.config,
        shim, shimDeps;

      if (error) {
        mod.exports = undefined;
        mod.status = Module.STATUS.ERROR;
        mod.emit('EXECUTED');
        return;
      }

      // 非AMD模块
      shim = config.shim[mod.id];
      if (shim) {
        shimDeps = shim.deps || [];
        mod.save(shimDeps);
        mod.factory = function() {
          return getGlobal(shim.exports);
        };
        mod.load();
      }
    },

    onloadCss: function(error) {
      if (error) {
        this.exports = undefined;
        this.status = Module.STATUS.ERROR;
        this.fireFactory();
        return;
      }
      this.exports = true;
      this.status = Module.STATUS.EXECUTED;
      this.emit('EXECUTED');
      return;
    },

    onloadText: function(error, text) {
      if (error) {
        this.exports = undefined;
        this.status = Module.STATUS.ERROR;
        // this.emit('EXECUTED');
        return;
      }
      this.exports = text;
      this.status = Module.STATUS.EXECUTED;
      this.emit('EXECUTED');
      return;
    }
  });

  /**
   * 初始化模块加载
   */
  Module.init = function() {
    var script, scripts, initMod, url;

    if (document.currentScript) {
      script = document.currentScript;
    } else {
      // 正常情况下，在页面加载时，当前js文件的script标签始终是最后一个
      scripts = document.getElementsByTagName('script');
      script = scripts[scripts.length - 1];
    }

    initMod = script.getAttribute("data-main");
    // 加载主模块
    if (initMod) {
      // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
      url = script.hasAttribute ? script.src : script.getAttribute("src", 4);
      // 如果seed是通过script标签内嵌到页面，baseUrl为当前页面的路径
      seed.config.baseUrl = dirname(url);

      var module = new Module();
      module.save([initMod]);
      module.load();
    }

    scripts = script = null;
  };

  /**
   * 获取一个模块，如果不存在则新建
   *
   * @param url
   * @param deps
   */
  Module.get = function(id) {

    id = id.replace(ignorePartReg, '');
    if(!suffixReg.test(id)){
      id += '.js';
    }

    return seed.modules[id] || (seed.modules[id] = new Module(id));
  };

  // 页面已经存在AMD加载器或者seed已经加载
  if (global.define) {
    return;
  }

  function define(id, deps, factory) {
    var currentScript, mod;

    if (factory == null /* or undefined */ ) {
      // define(factory);
      if (deps == null) {
        factory = id;
        id = null;
        deps = [];
      } else {
        // define(id, factory)
        // define(deps, factory)
        factory = deps;
        deps = [];
        if (isType(id, 'Array')) {
          deps = id;
          id = null;
        }
      }
    }

    if (!id && (currentScript = getCurrentScript())) {
      id = currentScript.getAttribute("data-module-id");
    }

    if (id) {
      mod = Module.get(id);
      mod.factory = factory;
      mod.save(deps);
      mod.load();
    }
  };
  define.amd = {};

  function require(deps, callback) {

    // if require image, just return absolute url
    if (isType(deps, 'String') && imageReg.test(deps)) {
      return id2Url(deps, seed.config.baseUrl);
    }

    // require(callback)
    if (isType(deps, 'Function')) {
      callback = deps;
      deps = [];
    }

    var module = new Module(uniqueID());
    module.factory = callback;
    module.save(deps);
    module.load();
  };

  require.config = function(config) {
    extend(seed.config, config);
    if(!/\/$/.test(seed.config.baseUrl)){
      seed.config.baseUrl += '/';
    }
  };

  global.define = define;
  global.require = require;

  // 初始化
  Module.init();

})(window);
