webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../typings/tsd.d.ts"/>
	/// <reference path="./d.ts"/>
	__webpack_require__(1);
	var React = __webpack_require__(3);
	var react_dom_1 = __webpack_require__(159);
	var react_redux_1 = __webpack_require__(160);
	var react_router_1 = __webpack_require__(178);
	var store_1 = __webpack_require__(234);
	var routeConfig_1 = __webpack_require__(237);
	var components_1 = __webpack_require__(357);
	__webpack_require__(358);
	function onUpdateHook() {
	    var args = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i - 0] = arguments[_i];
	    }
	    console.log('Boot.tsx..onUpdateHook()', args, this.state.location.key);
	}
	var routes = Object.freeze({
	    path: '/',
	    component: components_1.App,
	    indexRoute: routeConfig_1.indexRoute,
	    childRoutes: routeConfig_1.childRoutes
	});
	react_dom_1.render(React.createElement(react_redux_1.Provider, {store: store_1.store}, React.createElement(react_router_1.Router, {history: react_router_1.hashHistory, routes: routes, onUpdate: onUpdateHook})), document.getElementById('app'));


/***/ },

/***/ 234:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var redux_1 = __webpack_require__(166);
	var thunkMiddleware = __webpack_require__(235);
	//const createLogger = require('redux-logger');
	var appReducers = __webpack_require__(236);
	// , createLogger()
	//const logger = store => next => action => {
	//  console.log('????',  action);
	//  return next(action);
	//}
	var store = redux_1.createStore(redux_1.combineReducers(appReducers), {}, redux_1.applyMiddleware(thunkMiddleware));
	exports.store = store;
	function replaceReducers(contentReducers) {
	    store.replaceReducer(redux_1.combineReducers(Object.assign({}, appReducers, contentReducers)));
	}
	exports.replaceReducers = replaceReducers;


/***/ },

/***/ 236:
/***/ function(module, exports) {

	"use strict";
	var sampleReducer = function (state, action) {
	    if (state === void 0) { state = {}; }
	    return state;
	};
	exports.sampleReducer = sampleReducer;


/***/ },

/***/ 237:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var entry_1 = __webpack_require__(238);
	var entry_2 = __webpack_require__(347);
	exports.indexRoute = Object.freeze(entry_1.default());
	exports.childRoutes = Object.freeze([
	    entry_2.default()
	]);


/***/ },

/***/ 238:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var react_redux_1 = __webpack_require__(160);
	var store_1 = __webpack_require__(234);
	var components_1 = __webpack_require__(239);
	var reducers = __webpack_require__(346);
	var Component = react_redux_1.connect(function (state) { return ({
	    dispatch: state.dispatch,
	    activities: state.activities
	}); })(components_1.Activities);
	var onEnter = function (location, cb) {
	    store_1.replaceReducers(reducers);
	    cb(null, Component);
	};
	function default_1() {
	    return { title: 'Activities', getComponent: onEnter };
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;


/***/ },

/***/ 239:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(3);
	var moment = __webpack_require__(240);
	var actions_1 = __webpack_require__(339);
	var ActivitiesLink = function (_a) {
	    var title = _a.title, url = _a.url, key = _a.key;
	    return (React.createElement("a", {href: url, key: key, className: "btn btn-info btn-sm", target: "_blank"}, title));
	};
	var Activities = (function (_super) {
	    __extends(Activities, _super);
	    function Activities() {
	        _super.apply(this, arguments);
	    }
	    Activities.prototype.render = function () {
	        var items = this.props.activities.items.map(function (item, i) {
	            var name = item.name;
	            var date = moment(item.date).format('MMM D, YYYY');
	            var preview;
	            var links = [];
	            if (item.github) {
	                preview = 'assets/github.svg';
	                links.push(React.createElement(ActivitiesLink, {title: "github", key: 0, url: item.github.html_url}));
	                if (item.github.branches.indexOf('gh-pages') > -1) {
	                    var ghPages = "http://" + item.github.owner.login + ".github.io/" + item.github.name;
	                    links.push(React.createElement(ActivitiesLink, {title: "pages", key: 1, url: ghPages}));
	                }
	            }
	            else if (item.gist) {
	                preview = 'assets/gist.svg';
	                links.push(React.createElement(ActivitiesLink, {title: "gist", key: 0, url: item.gist.html_url}));
	            }
	            else if (item.jsfiddle) {
	                preview = 'assets/jsfiddle.svg';
	                links.push(React.createElement(ActivitiesLink, {title: "jsfiddle", key: 0, url: item.jsfiddle.url}));
	            }
	            return (React.createElement("div", {className: "card", key: i}, React.createElement("img", {className: "card-img-top", src: preview, alt: name, width: "100%"}), React.createElement("div", {className: "card-block"}, React.createElement("h4", {className: "card-title"}, date), React.createElement("p", {className: "card-text"}, name), React.createElement("p", {className: "card-text"}, links))));
	        });
	        return (React.createElement("div", null, React.createElement("h1", {className: "content-activity"}, "Activities"), React.createElement("div", {className: "content-activity card-columns"}, items)));
	    };
	    Activities.prototype.componentDidMount = function () {
	        var dispatch = this.props.dispatch;
	        dispatch(actions_1.requestGithubRepositories());
	        dispatch(actions_1.requestGithubGists());
	        dispatch(actions_1.requestJsfiddles());
	    };
	    Activities.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
	        return this.props.activities !== nextProps.activities;
	    };
	    return Activities;
	}(React.Component));
	exports.Activities = Activities;


/***/ },

/***/ 339:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var services = __webpack_require__(340);
	exports.RECEIVE_GITHUB_REPOSITORIES = 'RECEIVE_GITHUB_REPOSITORIES';
	exports.RECEIVE_GITHUB_GISTS = 'RECEIVE_GITHUB_GISTS';
	exports.RECEIVE_JSFIDDLE = 'RECEIVE_JSFIDDLE';
	var UPDATE_TIME = 1000 * 60;
	var needUpdate = function (items) { return !items || Date.now() - items.updatedAt > UPDATE_TIME; };
	var receiveGithubRepositories = function (items) { return ({
	    type: exports.RECEIVE_GITHUB_REPOSITORIES,
	    items: items
	}); };
	var receiveGithubGists = function (items) { return ({
	    type: exports.RECEIVE_GITHUB_GISTS,
	    items: items
	}); };
	var receiveJsfiddles = function (items) { return ({
	    type: exports.RECEIVE_JSFIDDLE,
	    items: items
	}); };
	exports.requestGithubRepositories = function () { return function (dispatch, getState) {
	    if (needUpdate(getState().githubRepositories)) {
	        services
	            .getGithubRepositories()
	            .then(function (repositories) {
	            dispatch(receiveGithubRepositories(repositories));
	        });
	    }
	}; };
	exports.requestGithubGists = function () { return function (dispatch, getState) {
	    if (needUpdate(getState().githubGists)) {
	        services
	            .getGithubGists()
	            .then(function (gists) { return dispatch(receiveGithubGists(gists)); });
	    }
	}; };
	exports.requestJsfiddles = function () { return function (dispatch, getState) {
	    if (needUpdate(getState().jsfiddles)) {
	        services
	            .getJsfiddles()
	            .then(function (jsfiddles) { return dispatch(receiveJsfiddles(jsfiddles)); });
	    }
	}; };


/***/ },

/***/ 340:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(fetch) {"use strict";
	var jsonp = __webpack_require__(342);
	var GITHUB_HEADERS = {
	    headers: {
	        Authorization: 'token cd4981226b72e9bffd3f8796026aa6865c81cb73'
	    }
	};
	function getGithubRepositories() {
	    var repos;
	    return fetch('https://api.github.com/users/iamssen/repos', GITHUB_HEADERS)
	        .then(function (response) { return response.json(); })
	        .then(function (repositories) {
	        repos = repositories;
	        return Promise.all(repositories.map(function (repository) {
	            return fetch("https://api.github.com/repos/" + repository.full_name + "/branches", GITHUB_HEADERS);
	        }));
	    })
	        .then(function (responses) { return Promise.all(responses.map(function (response) { return response.json(); })); })
	        .then(function (branchesList) { return branchesList.map(function (branches) { return branches.map(function (branch) { return branch.name; }); }); })
	        .then(function (branchesList) {
	        repos.forEach(function (repository, i) { return repository.branches = branchesList[i]; });
	        return repos;
	    });
	}
	exports.getGithubRepositories = getGithubRepositories;
	function getGithubGists() {
	    return fetch('https://api.github.com/users/iamssen/gists', GITHUB_HEADERS)
	        .then(function (response) { return response.json(); });
	}
	exports.getGithubGists = getGithubGists;
	function getJsfiddles() {
	    return new Promise(function (resolve, reject) {
	        jsonp("http://jsfiddle.net/api/user/iamssen/demo/list.json", null, function (err, res) {
	            if (err) {
	                reject(err);
	                return;
	            }
	            resolve(res.list);
	        });
	    });
	}
	exports.getJsfiddles = getJsfiddles;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(341)))

/***/ },

/***/ 341:
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/*** IMPORTS FROM imports-loader ***/
	(function() {
	
	(function(self) {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }
	
	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }
	
	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        }
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	
	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this)
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }
	
	      var xhr = new XMLHttpRequest()
	
	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }
	
	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }
	
	        return;
	      }
	
	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);
	
	
	/*** EXPORTS FROM exports-loader ***/
	module.exports = global.fetch;
	}.call(global));
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 346:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var moment = __webpack_require__(240);
	var actions_1 = __webpack_require__(339);
	var now = Date.now;
	var freeze = Object.freeze;
	var init = function () { return ({ items: freeze([]), updatedAt: 0 }); };
	var githubRepositories = function (state, action) {
	    if (state === void 0) { state = init(); }
	    if (action.type === actions_1.RECEIVE_GITHUB_REPOSITORIES) {
	        return freeze({
	            items: freeze(action.items),
	            updatedAt: now()
	        });
	    }
	    return state;
	};
	exports.githubRepositories = githubRepositories;
	var githubGists = function (state, action) {
	    if (state === void 0) { state = init(); }
	    if (action.type === actions_1.RECEIVE_GITHUB_GISTS) {
	        return freeze({
	            items: freeze(action.items),
	            updatedAt: now()
	        });
	    }
	    return state;
	};
	exports.githubGists = githubGists;
	var jsfiddles = function (state, action) {
	    if (state === void 0) { state = init(); }
	    if (action.type === actions_1.RECEIVE_JSFIDDLE) {
	        return freeze({
	            items: freeze(action.items),
	            updatedAt: now()
	        });
	    }
	    return state;
	};
	exports.jsfiddles = jsfiddles;
	var activities = function (state, action) {
	    if (state === void 0) { state = { items: [], updatedAt: 0 }; }
	    if (action.type === actions_1.RECEIVE_GITHUB_REPOSITORIES || action.type === actions_1.RECEIVE_GITHUB_GISTS || action.type === actions_1.RECEIVE_JSFIDDLE) {
	        var oldItems = void 0;
	        var newItems = void 0;
	        switch (action.type) {
	            case actions_1.RECEIVE_GITHUB_REPOSITORIES:
	                oldItems = state.items.filter(function (item) { return !item.github; });
	                newItems = action.items.map(function (item) { return freeze({
	                    name: item.name,
	                    date: moment(item.updated_at).toDate(),
	                    github: item
	                }); });
	                break;
	            case actions_1.RECEIVE_GITHUB_GISTS:
	                oldItems = state.items.filter(function (item) { return !item.gist; });
	                newItems = action.items.map(function (item) { return freeze({
	                    name: item.description,
	                    date: moment(item.updated_at).toDate(),
	                    gist: item
	                }); });
	                break;
	            case actions_1.RECEIVE_JSFIDDLE:
	                oldItems = state.items.filter(function (item) { return !item.jsfiddle; });
	                newItems = action.items.map(function (item) { return freeze({
	                    name: item.title,
	                    date: moment(item.created).toDate(),
	                    jsfiddle: item
	                }); });
	                break;
	        }
	        return freeze({
	            items: freeze(newItems.concat(oldItems).sort(function (a, b) { return a.date > b.date ? -1 : 1; })),
	            updatedAt: now()
	        });
	    }
	    return state;
	};
	exports.activities = activities;


/***/ },

/***/ 347:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(3);
	var basic_charts_1 = __webpack_require__(348);
	var Infographics = function () { return (React.createElement("div", null, React.createElement(basic_charts_1.default, null))); };
	function default_1() {
	    return { path: '/infographics', title: 'Infographics', component: Infographics };
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = default_1;


/***/ },

/***/ 348:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(3);
	var d3 = __webpack_require__(349);
	var basic_chart_bar_1 = __webpack_require__(350);
	var BasicCharts = (function (_super) {
	    __extends(BasicCharts, _super);
	    function BasicCharts(props, context) {
	        _super.call(this, props, context);
	        this.state = { data: null };
	    }
	    BasicCharts.prototype.render = function () {
	        var _this = this;
	        var style = { textAlign: 'right' };
	        var colors = [
	            d3.scale.category10(),
	            d3.scale.category20(),
	            d3.scale.category20b(),
	            d3.scale.category20c()
	        ];
	        var bars = d3.range(50).map(function (x) { return (React.createElement(basic_chart_bar_1.default, {key: x, width: 310, height: 150, data: _this.state.data, color: colors[x % colors.length]})); });
	        return (React.createElement("div", null, React.createElement("div", {style: style}, React.createElement("button", {onClick: this.refresh.bind(this)}, "Refresh")), bars));
	    };
	    BasicCharts.prototype.data = function () {
	        var max = Math.random() * 1000;
	        var arr = [];
	        var f = -1;
	        var fmax = 5 + (Math.random() * 10);
	        while (++f < fmax) {
	            arr.push({
	                Category: 1980 + f,
	                Data1: Math.random() * max,
	                Data2: Math.random() * max,
	                Data3: Math.random() * max,
	                Data4: Math.random() * max
	            });
	        }
	        return arr;
	    };
	    BasicCharts.prototype.componentDidMount = function () {
	        this.refresh();
	    };
	    BasicCharts.prototype.refresh = function () {
	        this.setState({
	            data: this.data()
	        });
	    };
	    return BasicCharts;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BasicCharts;


/***/ },

/***/ 350:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var React = __webpack_require__(3);
	var d3 = __webpack_require__(349);
	var d3tip_1 = __webpack_require__(351);
	__webpack_require__(353);
	var Chart = (function () {
	    function Chart(svg) {
	        this.svg = svg;
	        this._svg = d3.select(svg);
	        this._g = this._svg.append('g');
	        this._x = this._g.append('g');
	        this._y = this._g.append('g');
	        this._easeIn = d3.ease('quad-in');
	        this._easeOut = d3.ease('quad-out');
	    }
	    Chart.prototype.invalidate = function () {
	        this._invalidated = true;
	    };
	    Chart.prototype.update = function (data) {
	        var _this = this;
	        if (this._invalidated) {
	            this._svg.attr({ width: this.width, height: this.height });
	            this._width = this.width - this.gutterLeft - this.gutterRight;
	            this._height = this.height - this.gutterTop - this.gutterBottom;
	            this._g.attr('transform', "translate(" + this.gutterLeft + ", " + this.gutterTop + ")");
	            this._x.attr('transform', "translate(0, 0)");
	            this._y.attr('transform', "translate(0, " + this._height + ")");
	            this._invalidated = false;
	        }
	        var xmax = d3.max(data, function (d) { return d.Data1; });
	        var xscale = d3.scale.linear().rangeRound([0, this._width]).domain([0, xmax]).nice();
	        var yscale = d3.scale.ordinal().rangeRoundBands([0, this._height]).domain(data.map(function (d) { return d.Category; }));
	        var rects = this._g.selectAll('rect').data(data);
	        // update existing nodes
	        rects
	            .transition()
	            .duration(this.duration)
	            .delay(function (d, i) { return _this.delay * i; })
	            .ease(this._easeOut)
	            .attr({
	            fill: function (d) { return _this.color(d.Category); },
	            y: function (d) { return yscale(d.Category); },
	            width: function (d) { return xscale(d.Data1); },
	            height: function (d) { return yscale.rangeBand(); }
	        });
	        // remove ramaining nodes
	        rects
	            .exit()
	            .transition()
	            .duration(this.duration)
	            .delay(function (d, i) { return _this.delay * i; })
	            .ease(this._easeIn)
	            .attr({
	            opacity: 0,
	            y: this._height,
	            width: 0,
	            height: 0
	        })
	            .remove();
	        // create additional nodes
	        rects
	            .enter()
	            .append('rect')
	            .attr({
	            fill: function (d) { return _this.color(d.Category); },
	            opacity: 0,
	            y: function (d) { return yscale(d.Category); },
	            width: 0,
	            height: function (d) { return yscale.rangeBand(); }
	        })
	            .call(d3tip_1.default({
	            html: function (d) { return ("<h5>" + d.Category + "</h5>" + d.Data1); }
	        }))
	            .transition()
	            .duration(this.duration)
	            .delay(function (d, i) { return _this.delay * i; })
	            .ease(this._easeOut)
	            .attr({
	            opacity: 1,
	            width: function (d) { return xscale(d.Data1); }
	        });
	        // draw axis
	        var xaxis = d3.svg.axis().scale(xscale).orient('bottom');
	        var yaxis = d3.svg.axis().scale(yscale).orient('left');
	        this._y.call(xaxis);
	        this._x.call(yaxis);
	    };
	    return Chart;
	}());
	var Component = (function (_super) {
	    __extends(Component, _super);
	    function Component(props, context) {
	        _super.call(this, props, context);
	    }
	    Component.prototype.render = function () {
	        return (React.createElement("svg", {className: "basic-chart-bar", ref: "svg"}));
	    };
	    Component.prototype.bind = function (props) {
	        var chart = this.chart;
	        chart.duration = props.duration;
	        chart.delay = props.delay;
	        chart.width = props.width;
	        chart.height = props.height;
	        chart.gutterLeft = props.gutterLeft;
	        chart.gutterRight = props.gutterRight;
	        chart.gutterTop = props.gutterTop;
	        chart.gutterBottom = props.gutterBottom;
	        chart.color = props.color;
	        chart.invalidate();
	    };
	    Component.prototype.componentDidMount = function () {
	        this.chart = new Chart(this.refs['svg']);
	        this.bind(this.props);
	    };
	    Component.prototype.componentWillUnmount = function () {
	        this.chart = null;
	    };
	    Component.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
	        if (this.props.duration !== nextProps.duration
	            || this.props.delay !== nextProps.delay
	            || this.props.width !== nextProps.width
	            || this.props.height !== nextProps.height
	            || this.props.gutterLeft !== nextProps.gutterLeft
	            || this.props.gutterRight !== nextProps.gutterRight
	            || this.props.gutterTop !== nextProps.gutterTop
	            || this.props.gutterBottom !== nextProps.gutterBottom
	            || this.props.color !== nextProps.color) {
	            this.bind(nextProps);
	        }
	        if (this.props.data !== nextProps.data) {
	            this.chart.update(nextProps.data);
	        }
	        return false;
	    };
	    Component.defaultProps = {
	        duration: 300,
	        delay: 40,
	        width: 540,
	        height: 320,
	        gutterLeft: 50,
	        gutterRight: 20,
	        gutterTop: 20,
	        gutterBottom: 30,
	        color: d3.scale.category20c()
	    };
	    return Component;
	}(React.Component));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Component;


/***/ },

/***/ 353:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(354);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(356)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/less-loader/index.js!./basic-chart-bar.less", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/less-loader/index.js!./basic-chart-bar.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 354:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(355)();
	// imports
	
	
	// module
	exports.push([module.id, "svg.basic-chart-bar text {\n  font-size: 10px;\n}\n", ""]);
	
	// exports


/***/ },

/***/ 355:
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },

/***/ 356:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },

/***/ 357:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var React = __webpack_require__(3);
	var react_router_1 = __webpack_require__(178);
	var routeConfig_1 = __webpack_require__(237);
	exports.Menu = function () {
	    var indexLink = (React.createElement("li", {key: routeConfig_1.indexRoute.title, className: "nav-item"}, React.createElement(react_router_1.IndexLink, {className: "nav-link", to: "/", activeClassName: "active"}, routeConfig_1.indexRoute.title)));
	    var childLinks = routeConfig_1.childRoutes.map(function (route) { return (React.createElement("li", {key: route.title, className: "nav-item"}, React.createElement(react_router_1.Link, {className: "nav-link", to: route.path, activeClassName: "active"}, route.title))); });
	    return (React.createElement("div", {className: "main-menu"}, React.createElement("nav", {className: "navbar navbar-fixed-top navbar-light bg-faded"}, React.createElement("button", {className: "navbar-toggler hidden-sm-up", type: "button", "data-toggle": "collapse", "data-target": "#navbar"}, "&#9776;"), React.createElement("div", {className: "collapse navbar-toggleable-xs", id: "navbar"}, React.createElement("a", {className: "navbar-brand", href: "#"}, "SSEN"), React.createElement("ul", {className: "nav navbar-nav"}, indexLink, childLinks)))));
	};
	exports.App = function (_a) {
	    var children = _a.children;
	    return (React.createElement("div", null, React.createElement(exports.Menu, null), React.createElement("div", {className: "main-content"}, children)));
	};


/***/ },

/***/ 358:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(359);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(356)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 359:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(355)();
	// imports
	
	
	// module
	exports.push([module.id, "div.main-menu nav.navbar {\n  background-color: rgba(255, 255, 255, 0.98);\n}\ndiv.main-menu a {\n  font-weight: 300;\n}\ndiv.main-content {\n  margin-top: 60px;\n}\ndiv.main-content h1.content-activity {\n  font-weight: 200;\n}\ndiv.main-content div.content-activity h4 {\n  font-weight: 400;\n}\ndiv.main-content div.content-activity div.card-block {\n  padding: 0.8rem;\n}\ndiv.main-content div.content-activity div.card p.card-text {\n  line-height: 130%;\n}\ndiv.main-content div.content-activity div.card a.btn {\n  margin-left: 4px;\n}\ndiv.main-content div.content-activity div.card a.btn:first-child {\n  margin-left: 0;\n}\n", ""]);
	
	// exports


/***/ }

});
//# sourceMappingURL=app.map