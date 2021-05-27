webpackHotUpdate_N_E("pages/index",{

/***/ "./node_modules/@wry/context/lib/context.esm.js":
/*!******************************************************!*\
  !*** ./node_modules/@wry/context/lib/context.esm.js ***!
  \******************************************************/
/*! exports provided: Slot, asyncFromGen, bind, noContext, setTimeout, wrapYieldingFiberMethods */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Slot", function() { return Slot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "asyncFromGen", function() { return asyncFromGen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bind", function() { return bind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "noContext", function() { return noContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setTimeout", function() { return setTimeoutWithContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrapYieldingFiberMethods", function() { return wrapYieldingFiberMethods; });
// This currentContext variable will only be used if the makeSlotClass
// function is called, which happens only if this is the first copy of the
// @wry/context package to be imported.
var currentContext = null;
// This unique internal object is used to denote the absence of a value
// for a given Slot, and is never exposed to outside code.
var MISSING_VALUE = {};
var idCounter = 1;
// Although we can't do anything about the cost of duplicated code from
// accidentally bundling multiple copies of the @wry/context package, we can
// avoid creating the Slot class more than once using makeSlotClass.
var makeSlotClass = function () { return /** @class */ (function () {
    function Slot() {
        // If you have a Slot object, you can find out its slot.id, but you cannot
        // guess the slot.id of a Slot you don't have access to, thanks to the
        // randomized suffix.
        this.id = [
            "slot",
            idCounter++,
            Date.now(),
            Math.random().toString(36).slice(2),
        ].join(":");
    }
    Slot.prototype.hasValue = function () {
        for (var context_1 = currentContext; context_1; context_1 = context_1.parent) {
            // We use the Slot object iself as a key to its value, which means the
            // value cannot be obtained without a reference to the Slot object.
            if (this.id in context_1.slots) {
                var value = context_1.slots[this.id];
                if (value === MISSING_VALUE)
                    break;
                if (context_1 !== currentContext) {
                    // Cache the value in currentContext.slots so the next lookup will
                    // be faster. This caching is safe because the tree of contexts and
                    // the values of the slots are logically immutable.
                    currentContext.slots[this.id] = value;
                }
                return true;
            }
        }
        if (currentContext) {
            // If a value was not found for this Slot, it's never going to be found
            // no matter how many times we look it up, so we might as well cache
            // the absence of the value, too.
            currentContext.slots[this.id] = MISSING_VALUE;
        }
        return false;
    };
    Slot.prototype.getValue = function () {
        if (this.hasValue()) {
            return currentContext.slots[this.id];
        }
    };
    Slot.prototype.withValue = function (value, callback, 
    // Given the prevalence of arrow functions, specifying arguments is likely
    // to be much more common than specifying `this`, hence this ordering:
    args, thisArg) {
        var _a;
        var slots = (_a = {
                __proto__: null
            },
            _a[this.id] = value,
            _a);
        var parent = currentContext;
        currentContext = { parent: parent, slots: slots };
        try {
            // Function.prototype.apply allows the arguments array argument to be
            // omitted or undefined, so args! is fine here.
            return callback.apply(thisArg, args);
        }
        finally {
            currentContext = parent;
        }
    };
    // Capture the current context and wrap a callback function so that it
    // reestablishes the captured context when called.
    Slot.bind = function (callback) {
        var context = currentContext;
        return function () {
            var saved = currentContext;
            try {
                currentContext = context;
                return callback.apply(this, arguments);
            }
            finally {
                currentContext = saved;
            }
        };
    };
    // Immediately run a callback function without any captured context.
    Slot.noContext = function (callback, 
    // Given the prevalence of arrow functions, specifying arguments is likely
    // to be much more common than specifying `this`, hence this ordering:
    args, thisArg) {
        if (currentContext) {
            var saved = currentContext;
            try {
                currentContext = null;
                // Function.prototype.apply allows the arguments array argument to be
                // omitted or undefined, so args! is fine here.
                return callback.apply(thisArg, args);
            }
            finally {
                currentContext = saved;
            }
        }
        else {
            return callback.apply(thisArg, args);
        }
    };
    return Slot;
}()); };
// We store a single global implementation of the Slot class as a permanent
// non-enumerable symbol property of the Array constructor. This obfuscation
// does nothing to prevent access to the Slot class, but at least it ensures
// the implementation (i.e. currentContext) cannot be tampered with, and all
// copies of the @wry/context package (hopefully just one) will share the
// same Slot implementation. Since the first copy of the @wry/context package
// to be imported wins, this technique imposes a very high cost for any
// future breaking changes to the Slot class.
var globalKey = "@wry/context:Slot";
var host = Array;
var Slot = host[globalKey] || function () {
    var Slot = makeSlotClass();
    try {
        Object.defineProperty(host, globalKey, {
            value: host[globalKey] = Slot,
            enumerable: false,
            writable: false,
            configurable: false,
        });
    }
    finally {
        return Slot;
    }
}();

var bind = Slot.bind, noContext = Slot.noContext;
function setTimeoutWithContext(callback, delay) {
    return setTimeout(bind(callback), delay);
}
// Turn any generator function into an async function (using yield instead
// of await), with context automatically preserved across yields.
function asyncFromGen(genFn) {
    return function () {
        var gen = genFn.apply(this, arguments);
        var boundNext = bind(gen.next);
        var boundThrow = bind(gen.throw);
        return new Promise(function (resolve, reject) {
            function invoke(method, argument) {
                try {
                    var result = method.call(gen, argument);
                }
                catch (error) {
                    return reject(error);
                }
                var next = result.done ? resolve : invokeNext;
                if (isPromiseLike(result.value)) {
                    result.value.then(next, result.done ? reject : invokeThrow);
                }
                else {
                    next(result.value);
                }
            }
            var invokeNext = function (value) { return invoke(boundNext, value); };
            var invokeThrow = function (error) { return invoke(boundThrow, error); };
            invokeNext();
        });
    };
}
function isPromiseLike(value) {
    return value && typeof value.then === "function";
}
// If you use the fibers npm package to implement coroutines in Node.js,
// you should call this function at least once to ensure context management
// remains coherent across any yields.
var wrappedFibers = [];
function wrapYieldingFiberMethods(Fiber) {
    // There can be only one implementation of Fiber per process, so this array
    // should never grow longer than one element.
    if (wrappedFibers.indexOf(Fiber) < 0) {
        var wrap = function (obj, method) {
            var fn = obj[method];
            obj[method] = function () {
                return noContext(fn, arguments, this);
            };
        };
        // These methods can yield, according to
        // https://github.com/laverdet/node-fibers/blob/ddebed9b8ae3883e57f822e2108e6943e5c8d2a8/fibers.js#L97-L100
        wrap(Fiber, "yield");
        wrap(Fiber.prototype, "run");
        wrap(Fiber.prototype, "throwInto");
        wrappedFibers.push(Fiber);
    }
    return Fiber;
}


//# sourceMappingURL=context.esm.js.map


/***/ }),

/***/ "./node_modules/@wry/equality/lib/equality.esm.js":
/*!********************************************************!*\
  !*** ./node_modules/@wry/equality/lib/equality.esm.js ***!
  \********************************************************/
/*! exports provided: default, equal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "equal", function() { return equal; });
var _a = Object.prototype, toString = _a.toString, hasOwnProperty = _a.hasOwnProperty;
var previousComparisons = new Map();
/**
 * Performs a deep equality check on two JavaScript values, tolerating cycles.
 */
function equal(a, b) {
    try {
        return check(a, b);
    }
    finally {
        previousComparisons.clear();
    }
}
function check(a, b) {
    // If the two values are strictly equal, our job is easy.
    if (a === b) {
        return true;
    }
    // Object.prototype.toString returns a representation of the runtime type of
    // the given value that is considerably more precise than typeof.
    var aTag = toString.call(a);
    var bTag = toString.call(b);
    // If the runtime types of a and b are different, they could maybe be equal
    // under some interpretation of equality, but for simplicity and performance
    // we just return false instead.
    if (aTag !== bTag) {
        return false;
    }
    switch (aTag) {
        case '[object Array]':
            // Arrays are a lot like other objects, but we can cheaply compare their
            // lengths as a short-cut before comparing their elements.
            if (a.length !== b.length)
                return false;
        // Fall through to object case...
        case '[object Object]': {
            if (previouslyCompared(a, b))
                return true;
            var aKeys = Object.keys(a);
            var bKeys = Object.keys(b);
            // If `a` and `b` have a different number of enumerable keys, they
            // must be different.
            var keyCount = aKeys.length;
            if (keyCount !== bKeys.length)
                return false;
            // Now make sure they have the same keys.
            for (var k = 0; k < keyCount; ++k) {
                if (!hasOwnProperty.call(b, aKeys[k])) {
                    return false;
                }
            }
            // Finally, check deep equality of all child properties.
            for (var k = 0; k < keyCount; ++k) {
                var key = aKeys[k];
                if (!check(a[key], b[key])) {
                    return false;
                }
            }
            return true;
        }
        case '[object Error]':
            return a.name === b.name && a.message === b.message;
        case '[object Number]':
            // Handle NaN, which is !== itself.
            if (a !== a)
                return b !== b;
        // Fall through to shared +a === +b case...
        case '[object Boolean]':
        case '[object Date]':
            return +a === +b;
        case '[object RegExp]':
        case '[object String]':
            return a == "" + b;
        case '[object Map]':
        case '[object Set]': {
            if (a.size !== b.size)
                return false;
            if (previouslyCompared(a, b))
                return true;
            var aIterator = a.entries();
            var isMap = aTag === '[object Map]';
            while (true) {
                var info = aIterator.next();
                if (info.done)
                    break;
                // If a instanceof Set, aValue === aKey.
                var _a = info.value, aKey = _a[0], aValue = _a[1];
                // So this works the same way for both Set and Map.
                if (!b.has(aKey)) {
                    return false;
                }
                // However, we care about deep equality of values only when dealing
                // with Map structures.
                if (isMap && !check(aValue, b.get(aKey))) {
                    return false;
                }
            }
            return true;
        }
    }
    // Otherwise the values are not equal.
    return false;
}
function previouslyCompared(a, b) {
    // Though cyclic references can make an object graph appear infinite from the
    // perspective of a depth-first traversal, the graph still contains a finite
    // number of distinct object references. We use the previousComparisons cache
    // to avoid comparing the same pair of object references more than once, which
    // guarantees termination (even if we end up comparing every object in one
    // graph to every object in the other graph, which is extremely unlikely),
    // while still allowing weird isomorphic structures (like rings with different
    // lengths) a chance to pass the equality test.
    var bSet = previousComparisons.get(a);
    if (bSet) {
        // Return true here because we can be sure false will be returned somewhere
        // else if the objects are not equivalent.
        if (bSet.has(b))
            return true;
    }
    else {
        previousComparisons.set(a, bSet = new Set);
    }
    bSet.add(b);
    return false;
}

/* harmony default export */ __webpack_exports__["default"] = (equal);

//# sourceMappingURL=equality.esm.js.map


/***/ }),

/***/ "./node_modules/apollo-boost/lib/bundle.esm.js":
/*!*****************************************************!*\
  !*** ./node_modules/apollo-boost/lib/bundle.esm.js ***!
  \*****************************************************/
/*! exports provided: ApolloClient, ApolloError, FetchType, NetworkStatus, ObservableQuery, isApolloError, Observable, getOperationName, ApolloLink, concat, createOperation, empty, execute, from, fromError, fromPromise, makePromise, split, toPromise, HeuristicFragmentMatcher, InMemoryCache, IntrospectionFragmentMatcher, ObjectCache, StoreReader, StoreWriter, WriteError, assertIdValue, defaultDataIdFromObject, defaultNormalizedCacheFactory, enhanceErrorWithDocument, HttpLink, gql, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var apollo_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-client */ "./node_modules/apollo-client/bundle.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ApolloClient", function() { return apollo_client__WEBPACK_IMPORTED_MODULE_1__["ApolloClient"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ApolloError", function() { return apollo_client__WEBPACK_IMPORTED_MODULE_1__["ApolloError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FetchType", function() { return apollo_client__WEBPACK_IMPORTED_MODULE_1__["FetchType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkStatus", function() { return apollo_client__WEBPACK_IMPORTED_MODULE_1__["NetworkStatus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ObservableQuery", function() { return apollo_client__WEBPACK_IMPORTED_MODULE_1__["ObservableQuery"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isApolloError", function() { return apollo_client__WEBPACK_IMPORTED_MODULE_1__["isApolloError"]; });

/* harmony import */ var apollo_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! apollo-link */ "./node_modules/apollo-link/lib/bundle.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Observable", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["Observable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getOperationName", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["getOperationName"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ApolloLink", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["ApolloLink"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "concat", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["concat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createOperation", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["createOperation"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "empty", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["empty"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "execute", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["execute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "from", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["from"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fromError", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["fromError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fromPromise", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["fromPromise"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makePromise", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["makePromise"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "split", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["split"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "toPromise", function() { return apollo_link__WEBPACK_IMPORTED_MODULE_2__["toPromise"]; });

/* harmony import */ var apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apollo-cache-inmemory */ "./node_modules/apollo-cache-inmemory/lib/bundle.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HeuristicFragmentMatcher", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["HeuristicFragmentMatcher"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InMemoryCache", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["InMemoryCache"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IntrospectionFragmentMatcher", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["IntrospectionFragmentMatcher"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ObjectCache", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["ObjectCache"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StoreReader", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["StoreReader"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StoreWriter", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["StoreWriter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WriteError", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["WriteError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "assertIdValue", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["assertIdValue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defaultDataIdFromObject", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["defaultDataIdFromObject"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defaultNormalizedCacheFactory", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["defaultNormalizedCacheFactory"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "enhanceErrorWithDocument", function() { return apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["enhanceErrorWithDocument"]; });

/* harmony import */ var apollo_link_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! apollo-link-http */ "./node_modules/apollo-link-http/lib/bundle.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HttpLink", function() { return apollo_link_http__WEBPACK_IMPORTED_MODULE_4__["HttpLink"]; });

/* harmony import */ var apollo_link_error__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! apollo-link-error */ "./node_modules/apollo-link-error/lib/bundle.esm.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/lib/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "gql", function() { return graphql_tag__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var ts_invariant__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ts-invariant */ "./node_modules/ts-invariant/lib/invariant.esm.js");













var PRESET_CONFIG_KEYS = [
    'request',
    'uri',
    'credentials',
    'headers',
    'fetch',
    'fetchOptions',
    'clientState',
    'onError',
    'cacheRedirects',
    'cache',
    'name',
    'version',
    'resolvers',
    'typeDefs',
    'fragmentMatcher',
];
var DefaultClient = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(DefaultClient, _super);
    function DefaultClient(config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        if (config) {
            var diff = Object.keys(config).filter(function (key) { return PRESET_CONFIG_KEYS.indexOf(key) === -1; });
            if (diff.length > 0) {
                 false || ts_invariant__WEBPACK_IMPORTED_MODULE_7__["invariant"].warn('ApolloBoost was initialized with unsupported options: ' +
                    ("" + diff.join(' ')));
            }
        }
        var request = config.request, uri = config.uri, credentials = config.credentials, headers = config.headers, fetch = config.fetch, fetchOptions = config.fetchOptions, clientState = config.clientState, cacheRedirects = config.cacheRedirects, errorCallback = config.onError, name = config.name, version = config.version, resolvers = config.resolvers, typeDefs = config.typeDefs, fragmentMatcher = config.fragmentMatcher;
        var cache = config.cache;
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_7__["invariant"])(!cache || !cacheRedirects, 'Incompatible cache configuration. When not providing `cache`, ' +
            'configure the provided instance with `cacheRedirects` instead.');
        if (!cache) {
            cache = cacheRedirects
                ? new apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["InMemoryCache"]({ cacheRedirects: cacheRedirects })
                : new apollo_cache_inmemory__WEBPACK_IMPORTED_MODULE_3__["InMemoryCache"]();
        }
        var errorLink = errorCallback
            ? Object(apollo_link_error__WEBPACK_IMPORTED_MODULE_5__["onError"])(errorCallback)
            : Object(apollo_link_error__WEBPACK_IMPORTED_MODULE_5__["onError"])(function (_a) {
                var graphQLErrors = _a.graphQLErrors, networkError = _a.networkError;
                if (graphQLErrors) {
                    graphQLErrors.forEach(function (_a) {
                        var message = _a.message, locations = _a.locations, path = _a.path;
                        return  false || ts_invariant__WEBPACK_IMPORTED_MODULE_7__["invariant"].warn("[GraphQL error]: Message: " + message + ", Location: " +
                            (locations + ", Path: " + path));
                    });
                }
                if (networkError) {
                     false || ts_invariant__WEBPACK_IMPORTED_MODULE_7__["invariant"].warn("[Network error]: " + networkError);
                }
            });
        var requestHandler = request
            ? new apollo_link__WEBPACK_IMPORTED_MODULE_2__["ApolloLink"](function (operation, forward) {
                return new apollo_link__WEBPACK_IMPORTED_MODULE_2__["Observable"](function (observer) {
                    var handle;
                    Promise.resolve(operation)
                        .then(function (oper) { return request(oper); })
                        .then(function () {
                        handle = forward(operation).subscribe({
                            next: observer.next.bind(observer),
                            error: observer.error.bind(observer),
                            complete: observer.complete.bind(observer),
                        });
                    })
                        .catch(observer.error.bind(observer));
                    return function () {
                        if (handle) {
                            handle.unsubscribe();
                        }
                    };
                });
            })
            : false;
        var httpLink = new apollo_link_http__WEBPACK_IMPORTED_MODULE_4__["HttpLink"]({
            uri: uri || '/graphql',
            fetch: fetch,
            fetchOptions: fetchOptions || {},
            credentials: credentials || 'same-origin',
            headers: headers || {},
        });
        var link = apollo_link__WEBPACK_IMPORTED_MODULE_2__["ApolloLink"].from([errorLink, requestHandler, httpLink].filter(function (x) { return !!x; }));
        var activeResolvers = resolvers;
        var activeTypeDefs = typeDefs;
        var activeFragmentMatcher = fragmentMatcher;
        if (clientState) {
            if (clientState.defaults) {
                cache.writeData({
                    data: clientState.defaults,
                });
            }
            activeResolvers = clientState.resolvers;
            activeTypeDefs = clientState.typeDefs;
            activeFragmentMatcher = clientState.fragmentMatcher;
        }
        _this = _super.call(this, {
            cache: cache,
            link: link,
            name: name,
            version: version,
            resolvers: activeResolvers,
            typeDefs: activeTypeDefs,
            fragmentMatcher: activeFragmentMatcher,
        }) || this;
        return _this;
    }
    return DefaultClient;
}(apollo_client__WEBPACK_IMPORTED_MODULE_1__["default"]));

/* harmony default export */ __webpack_exports__["default"] = (DefaultClient);
//# sourceMappingURL=bundle.esm.js.map


/***/ }),

/***/ "./node_modules/apollo-cache-inmemory/lib/bundle.esm.js":
/*!**************************************************************!*\
  !*** ./node_modules/apollo-cache-inmemory/lib/bundle.esm.js ***!
  \**************************************************************/
/*! exports provided: HeuristicFragmentMatcher, InMemoryCache, IntrospectionFragmentMatcher, ObjectCache, StoreReader, StoreWriter, WriteError, assertIdValue, defaultDataIdFromObject, defaultNormalizedCacheFactory, enhanceErrorWithDocument */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HeuristicFragmentMatcher", function() { return HeuristicFragmentMatcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InMemoryCache", function() { return InMemoryCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntrospectionFragmentMatcher", function() { return IntrospectionFragmentMatcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectCache", function() { return ObjectCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StoreReader", function() { return StoreReader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StoreWriter", function() { return StoreWriter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WriteError", function() { return WriteError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assertIdValue", function() { return assertIdValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultDataIdFromObject", function() { return defaultDataIdFromObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultNormalizedCacheFactory", function() { return defaultNormalizedCacheFactory$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enhanceErrorWithDocument", function() { return enhanceErrorWithDocument; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var apollo_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-cache */ "./node_modules/apollo-cache/lib/bundle.esm.js");
/* harmony import */ var apollo_utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! apollo-utilities */ "./node_modules/apollo-utilities/lib/bundle.esm.js");
/* harmony import */ var optimism__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! optimism */ "./node_modules/optimism/lib/bundle.esm.js");
/* harmony import */ var ts_invariant__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ts-invariant */ "./node_modules/ts-invariant/lib/invariant.esm.js");






var haveWarned = false;
function shouldWarn() {
    var answer = !haveWarned;
    if (!Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isTest"])()) {
        haveWarned = true;
    }
    return answer;
}
var HeuristicFragmentMatcher = (function () {
    function HeuristicFragmentMatcher() {
    }
    HeuristicFragmentMatcher.prototype.ensureReady = function () {
        return Promise.resolve();
    };
    HeuristicFragmentMatcher.prototype.canBypassInit = function () {
        return true;
    };
    HeuristicFragmentMatcher.prototype.match = function (idValue, typeCondition, context) {
        var obj = context.store.get(idValue.id);
        var isRootQuery = idValue.id === 'ROOT_QUERY';
        if (!obj) {
            return isRootQuery;
        }
        var _a = obj.__typename, __typename = _a === void 0 ? isRootQuery && 'Query' : _a;
        if (!__typename) {
            if (shouldWarn()) {
                 false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].warn("You're using fragments in your queries, but either don't have the addTypename:\n  true option set in Apollo Client, or you are trying to write a fragment to the store without the __typename.\n   Please turn on the addTypename option and include __typename when writing fragments so that Apollo Client\n   can accurately match fragments.");
                 false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].warn('Could not find __typename on Fragment ', typeCondition, obj);
                 false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].warn("DEPRECATION WARNING: using fragments without __typename is unsupported behavior " +
                    "and will be removed in future versions of Apollo client. You should fix this and set addTypename to true now.");
            }
            return 'heuristic';
        }
        if (__typename === typeCondition) {
            return true;
        }
        if (shouldWarn()) {
             false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].error('You are using the simple (heuristic) fragment matcher, but your ' +
                'queries contain union or interface types. Apollo Client will not be ' +
                'able to accurately map fragments. To make this error go away, use ' +
                'the `IntrospectionFragmentMatcher` as described in the docs: ' +
                'https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher');
        }
        return 'heuristic';
    };
    return HeuristicFragmentMatcher;
}());
var IntrospectionFragmentMatcher = (function () {
    function IntrospectionFragmentMatcher(options) {
        if (options && options.introspectionQueryResultData) {
            this.possibleTypesMap = this.parseIntrospectionResult(options.introspectionQueryResultData);
            this.isReady = true;
        }
        else {
            this.isReady = false;
        }
        this.match = this.match.bind(this);
    }
    IntrospectionFragmentMatcher.prototype.match = function (idValue, typeCondition, context) {
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(this.isReady, 'FragmentMatcher.match() was called before FragmentMatcher.init()');
        var obj = context.store.get(idValue.id);
        var isRootQuery = idValue.id === 'ROOT_QUERY';
        if (!obj) {
            return isRootQuery;
        }
        var _a = obj.__typename, __typename = _a === void 0 ? isRootQuery && 'Query' : _a;
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(__typename, "Cannot match fragment because __typename property is missing: " + JSON.stringify(obj));
        if (__typename === typeCondition) {
            return true;
        }
        var implementingTypes = this.possibleTypesMap[typeCondition];
        if (__typename &&
            implementingTypes &&
            implementingTypes.indexOf(__typename) > -1) {
            return true;
        }
        return false;
    };
    IntrospectionFragmentMatcher.prototype.parseIntrospectionResult = function (introspectionResultData) {
        var typeMap = {};
        introspectionResultData.__schema.types.forEach(function (type) {
            if (type.kind === 'UNION' || type.kind === 'INTERFACE') {
                typeMap[type.name] = type.possibleTypes.map(function (implementingType) { return implementingType.name; });
            }
        });
        return typeMap;
    };
    return IntrospectionFragmentMatcher;
}());

var hasOwn = Object.prototype.hasOwnProperty;
var DepTrackingCache = (function () {
    function DepTrackingCache(data) {
        var _this = this;
        if (data === void 0) { data = Object.create(null); }
        this.data = data;
        this.depend = Object(optimism__WEBPACK_IMPORTED_MODULE_3__["wrap"])(function (dataId) { return _this.data[dataId]; }, {
            disposable: true,
            makeCacheKey: function (dataId) {
                return dataId;
            },
        });
    }
    DepTrackingCache.prototype.toObject = function () {
        return this.data;
    };
    DepTrackingCache.prototype.get = function (dataId) {
        this.depend(dataId);
        return this.data[dataId];
    };
    DepTrackingCache.prototype.set = function (dataId, value) {
        var oldValue = this.data[dataId];
        if (value !== oldValue) {
            this.data[dataId] = value;
            this.depend.dirty(dataId);
        }
    };
    DepTrackingCache.prototype.delete = function (dataId) {
        if (hasOwn.call(this.data, dataId)) {
            delete this.data[dataId];
            this.depend.dirty(dataId);
        }
    };
    DepTrackingCache.prototype.clear = function () {
        this.replace(null);
    };
    DepTrackingCache.prototype.replace = function (newData) {
        var _this = this;
        if (newData) {
            Object.keys(newData).forEach(function (dataId) {
                _this.set(dataId, newData[dataId]);
            });
            Object.keys(this.data).forEach(function (dataId) {
                if (!hasOwn.call(newData, dataId)) {
                    _this.delete(dataId);
                }
            });
        }
        else {
            Object.keys(this.data).forEach(function (dataId) {
                _this.delete(dataId);
            });
        }
    };
    return DepTrackingCache;
}());
function defaultNormalizedCacheFactory(seed) {
    return new DepTrackingCache(seed);
}

var StoreReader = (function () {
    function StoreReader(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.cacheKeyRoot, cacheKeyRoot = _c === void 0 ? new optimism__WEBPACK_IMPORTED_MODULE_3__["KeyTrie"](apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["canUseWeakMap"]) : _c, _d = _b.freezeResults, freezeResults = _d === void 0 ? false : _d;
        var _e = this, executeStoreQuery = _e.executeStoreQuery, executeSelectionSet = _e.executeSelectionSet, executeSubSelectedArray = _e.executeSubSelectedArray;
        this.freezeResults = freezeResults;
        this.executeStoreQuery = Object(optimism__WEBPACK_IMPORTED_MODULE_3__["wrap"])(function (options) {
            return executeStoreQuery.call(_this, options);
        }, {
            makeCacheKey: function (_a) {
                var query = _a.query, rootValue = _a.rootValue, contextValue = _a.contextValue, variableValues = _a.variableValues, fragmentMatcher = _a.fragmentMatcher;
                if (contextValue.store instanceof DepTrackingCache) {
                    return cacheKeyRoot.lookup(contextValue.store, query, fragmentMatcher, JSON.stringify(variableValues), rootValue.id);
                }
            }
        });
        this.executeSelectionSet = Object(optimism__WEBPACK_IMPORTED_MODULE_3__["wrap"])(function (options) {
            return executeSelectionSet.call(_this, options);
        }, {
            makeCacheKey: function (_a) {
                var selectionSet = _a.selectionSet, rootValue = _a.rootValue, execContext = _a.execContext;
                if (execContext.contextValue.store instanceof DepTrackingCache) {
                    return cacheKeyRoot.lookup(execContext.contextValue.store, selectionSet, execContext.fragmentMatcher, JSON.stringify(execContext.variableValues), rootValue.id);
                }
            }
        });
        this.executeSubSelectedArray = Object(optimism__WEBPACK_IMPORTED_MODULE_3__["wrap"])(function (options) {
            return executeSubSelectedArray.call(_this, options);
        }, {
            makeCacheKey: function (_a) {
                var field = _a.field, array = _a.array, execContext = _a.execContext;
                if (execContext.contextValue.store instanceof DepTrackingCache) {
                    return cacheKeyRoot.lookup(execContext.contextValue.store, field, array, JSON.stringify(execContext.variableValues));
                }
            }
        });
    }
    StoreReader.prototype.readQueryFromStore = function (options) {
        return this.diffQueryAgainstStore(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options), { returnPartialData: false })).result;
    };
    StoreReader.prototype.diffQueryAgainstStore = function (_a) {
        var store = _a.store, query = _a.query, variables = _a.variables, previousResult = _a.previousResult, _b = _a.returnPartialData, returnPartialData = _b === void 0 ? true : _b, _c = _a.rootId, rootId = _c === void 0 ? 'ROOT_QUERY' : _c, fragmentMatcherFunction = _a.fragmentMatcherFunction, config = _a.config;
        var queryDefinition = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["getQueryDefinition"])(query);
        variables = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["assign"])({}, Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["getDefaultValues"])(queryDefinition), variables);
        var context = {
            store: store,
            dataIdFromObject: config && config.dataIdFromObject,
            cacheRedirects: (config && config.cacheRedirects) || {},
        };
        var execResult = this.executeStoreQuery({
            query: query,
            rootValue: {
                type: 'id',
                id: rootId,
                generated: true,
                typename: 'Query',
            },
            contextValue: context,
            variableValues: variables,
            fragmentMatcher: fragmentMatcherFunction,
        });
        var hasMissingFields = execResult.missing && execResult.missing.length > 0;
        if (hasMissingFields && !returnPartialData) {
            execResult.missing.forEach(function (info) {
                if (info.tolerable)
                    return;
                throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_4__["InvariantError"]("Can't find field " + info.fieldName + " on object " + JSON.stringify(info.object, null, 2) + ".");
            });
        }
        if (previousResult) {
            if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isEqual"])(previousResult, execResult.result)) {
                execResult.result = previousResult;
            }
        }
        return {
            result: execResult.result,
            complete: !hasMissingFields,
        };
    };
    StoreReader.prototype.executeStoreQuery = function (_a) {
        var query = _a.query, rootValue = _a.rootValue, contextValue = _a.contextValue, variableValues = _a.variableValues, _b = _a.fragmentMatcher, fragmentMatcher = _b === void 0 ? defaultFragmentMatcher : _b;
        var mainDefinition = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["getMainDefinition"])(query);
        var fragments = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["getFragmentDefinitions"])(query);
        var fragmentMap = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["createFragmentMap"])(fragments);
        var execContext = {
            query: query,
            fragmentMap: fragmentMap,
            contextValue: contextValue,
            variableValues: variableValues,
            fragmentMatcher: fragmentMatcher,
        };
        return this.executeSelectionSet({
            selectionSet: mainDefinition.selectionSet,
            rootValue: rootValue,
            execContext: execContext,
        });
    };
    StoreReader.prototype.executeSelectionSet = function (_a) {
        var _this = this;
        var selectionSet = _a.selectionSet, rootValue = _a.rootValue, execContext = _a.execContext;
        var fragmentMap = execContext.fragmentMap, contextValue = execContext.contextValue, variables = execContext.variableValues;
        var finalResult = { result: null };
        var objectsToMerge = [];
        var object = contextValue.store.get(rootValue.id);
        var typename = (object && object.__typename) ||
            (rootValue.id === 'ROOT_QUERY' && 'Query') ||
            void 0;
        function handleMissing(result) {
            var _a;
            if (result.missing) {
                finalResult.missing = finalResult.missing || [];
                (_a = finalResult.missing).push.apply(_a, result.missing);
            }
            return result.result;
        }
        selectionSet.selections.forEach(function (selection) {
            var _a;
            if (!Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["shouldInclude"])(selection, variables)) {
                return;
            }
            if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isField"])(selection)) {
                var fieldResult = handleMissing(_this.executeField(object, typename, selection, execContext));
                if (typeof fieldResult !== 'undefined') {
                    objectsToMerge.push((_a = {},
                        _a[Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["resultKeyNameFromField"])(selection)] = fieldResult,
                        _a));
                }
            }
            else {
                var fragment = void 0;
                if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isInlineFragment"])(selection)) {
                    fragment = selection;
                }
                else {
                    fragment = fragmentMap[selection.name.value];
                    if (!fragment) {
                        throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_4__["InvariantError"]("No fragment named " + selection.name.value);
                    }
                }
                var typeCondition = fragment.typeCondition && fragment.typeCondition.name.value;
                var match = !typeCondition ||
                    execContext.fragmentMatcher(rootValue, typeCondition, contextValue);
                if (match) {
                    var fragmentExecResult = _this.executeSelectionSet({
                        selectionSet: fragment.selectionSet,
                        rootValue: rootValue,
                        execContext: execContext,
                    });
                    if (match === 'heuristic' && fragmentExecResult.missing) {
                        fragmentExecResult = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, fragmentExecResult), { missing: fragmentExecResult.missing.map(function (info) {
                                return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, info), { tolerable: true });
                            }) });
                    }
                    objectsToMerge.push(handleMissing(fragmentExecResult));
                }
            }
        });
        finalResult.result = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["mergeDeepArray"])(objectsToMerge);
        if (this.freezeResults && "development" !== 'production') {
            Object.freeze(finalResult.result);
        }
        return finalResult;
    };
    StoreReader.prototype.executeField = function (object, typename, field, execContext) {
        var variables = execContext.variableValues, contextValue = execContext.contextValue;
        var fieldName = field.name.value;
        var args = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["argumentsObjectFromField"])(field, variables);
        var info = {
            resultKey: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["resultKeyNameFromField"])(field),
            directives: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["getDirectiveInfoFromField"])(field, variables),
        };
        var readStoreResult = readStoreResolver(object, typename, fieldName, args, contextValue, info);
        if (Array.isArray(readStoreResult.result)) {
            return this.combineExecResults(readStoreResult, this.executeSubSelectedArray({
                field: field,
                array: readStoreResult.result,
                execContext: execContext,
            }));
        }
        if (!field.selectionSet) {
            assertSelectionSetForIdValue(field, readStoreResult.result);
            if (this.freezeResults && "development" !== 'production') {
                Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["maybeDeepFreeze"])(readStoreResult);
            }
            return readStoreResult;
        }
        if (readStoreResult.result == null) {
            return readStoreResult;
        }
        return this.combineExecResults(readStoreResult, this.executeSelectionSet({
            selectionSet: field.selectionSet,
            rootValue: readStoreResult.result,
            execContext: execContext,
        }));
    };
    StoreReader.prototype.combineExecResults = function () {
        var execResults = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            execResults[_i] = arguments[_i];
        }
        var missing;
        execResults.forEach(function (execResult) {
            if (execResult.missing) {
                missing = missing || [];
                missing.push.apply(missing, execResult.missing);
            }
        });
        return {
            result: execResults.pop().result,
            missing: missing,
        };
    };
    StoreReader.prototype.executeSubSelectedArray = function (_a) {
        var _this = this;
        var field = _a.field, array = _a.array, execContext = _a.execContext;
        var missing;
        function handleMissing(childResult) {
            if (childResult.missing) {
                missing = missing || [];
                missing.push.apply(missing, childResult.missing);
            }
            return childResult.result;
        }
        array = array.map(function (item) {
            if (item === null) {
                return null;
            }
            if (Array.isArray(item)) {
                return handleMissing(_this.executeSubSelectedArray({
                    field: field,
                    array: item,
                    execContext: execContext,
                }));
            }
            if (field.selectionSet) {
                return handleMissing(_this.executeSelectionSet({
                    selectionSet: field.selectionSet,
                    rootValue: item,
                    execContext: execContext,
                }));
            }
            assertSelectionSetForIdValue(field, item);
            return item;
        });
        if (this.freezeResults && "development" !== 'production') {
            Object.freeze(array);
        }
        return { result: array, missing: missing };
    };
    return StoreReader;
}());
function assertSelectionSetForIdValue(field, value) {
    if (!field.selectionSet && Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isIdValue"])(value)) {
        throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_4__["InvariantError"]("Missing selection set for object of type " + value.typename + " returned for query field " + field.name.value);
    }
}
function defaultFragmentMatcher() {
    return true;
}
function assertIdValue(idValue) {
     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isIdValue"])(idValue), "Encountered a sub-selection on the query, but the store doesn't have an object reference. This should never happen during normal use unless you have custom code that is directly manipulating the store; please file an issue.");
}
function readStoreResolver(object, typename, fieldName, args, context, _a) {
    var resultKey = _a.resultKey, directives = _a.directives;
    var storeKeyName = fieldName;
    if (args || directives) {
        storeKeyName = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["getStoreKeyName"])(storeKeyName, args, directives);
    }
    var fieldValue = void 0;
    if (object) {
        fieldValue = object[storeKeyName];
        if (typeof fieldValue === 'undefined' &&
            context.cacheRedirects &&
            typeof typename === 'string') {
            var type = context.cacheRedirects[typename];
            if (type) {
                var resolver = type[fieldName];
                if (resolver) {
                    fieldValue = resolver(object, args, {
                        getCacheKey: function (storeObj) {
                            var id = context.dataIdFromObject(storeObj);
                            return id && Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["toIdValue"])({
                                id: id,
                                typename: storeObj.__typename,
                            });
                        },
                    });
                }
            }
        }
    }
    if (typeof fieldValue === 'undefined') {
        return {
            result: fieldValue,
            missing: [{
                    object: object,
                    fieldName: storeKeyName,
                    tolerable: false,
                }],
        };
    }
    if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isJsonValue"])(fieldValue)) {
        fieldValue = fieldValue.json;
    }
    return {
        result: fieldValue,
    };
}

var ObjectCache = (function () {
    function ObjectCache(data) {
        if (data === void 0) { data = Object.create(null); }
        this.data = data;
    }
    ObjectCache.prototype.toObject = function () {
        return this.data;
    };
    ObjectCache.prototype.get = function (dataId) {
        return this.data[dataId];
    };
    ObjectCache.prototype.set = function (dataId, value) {
        this.data[dataId] = value;
    };
    ObjectCache.prototype.delete = function (dataId) {
        this.data[dataId] = void 0;
    };
    ObjectCache.prototype.clear = function () {
        this.data = Object.create(null);
    };
    ObjectCache.prototype.replace = function (newData) {
        this.data = newData || Object.create(null);
    };
    return ObjectCache;
}());
function defaultNormalizedCacheFactory$1(seed) {
    return new ObjectCache(seed);
}

var WriteError = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(WriteError, _super);
    function WriteError() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'WriteError';
        return _this;
    }
    return WriteError;
}(Error));
function enhanceErrorWithDocument(error, document) {
    var enhancedError = new WriteError("Error writing result to store for query:\n " + JSON.stringify(document));
    enhancedError.message += '\n' + error.message;
    enhancedError.stack = error.stack;
    return enhancedError;
}
var StoreWriter = (function () {
    function StoreWriter() {
    }
    StoreWriter.prototype.writeQueryToStore = function (_a) {
        var query = _a.query, result = _a.result, _b = _a.store, store = _b === void 0 ? defaultNormalizedCacheFactory() : _b, variables = _a.variables, dataIdFromObject = _a.dataIdFromObject, fragmentMatcherFunction = _a.fragmentMatcherFunction;
        return this.writeResultToStore({
            dataId: 'ROOT_QUERY',
            result: result,
            document: query,
            store: store,
            variables: variables,
            dataIdFromObject: dataIdFromObject,
            fragmentMatcherFunction: fragmentMatcherFunction,
        });
    };
    StoreWriter.prototype.writeResultToStore = function (_a) {
        var dataId = _a.dataId, result = _a.result, document = _a.document, _b = _a.store, store = _b === void 0 ? defaultNormalizedCacheFactory() : _b, variables = _a.variables, dataIdFromObject = _a.dataIdFromObject, fragmentMatcherFunction = _a.fragmentMatcherFunction;
        var operationDefinition = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["getOperationDefinition"])(document);
        try {
            return this.writeSelectionSetToStore({
                result: result,
                dataId: dataId,
                selectionSet: operationDefinition.selectionSet,
                context: {
                    store: store,
                    processedData: {},
                    variables: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["assign"])({}, Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["getDefaultValues"])(operationDefinition), variables),
                    dataIdFromObject: dataIdFromObject,
                    fragmentMap: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["createFragmentMap"])(Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["getFragmentDefinitions"])(document)),
                    fragmentMatcherFunction: fragmentMatcherFunction,
                },
            });
        }
        catch (e) {
            throw enhanceErrorWithDocument(e, document);
        }
    };
    StoreWriter.prototype.writeSelectionSetToStore = function (_a) {
        var _this = this;
        var result = _a.result, dataId = _a.dataId, selectionSet = _a.selectionSet, context = _a.context;
        var variables = context.variables, store = context.store, fragmentMap = context.fragmentMap;
        selectionSet.selections.forEach(function (selection) {
            var _a;
            if (!Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["shouldInclude"])(selection, variables)) {
                return;
            }
            if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isField"])(selection)) {
                var resultFieldKey = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["resultKeyNameFromField"])(selection);
                var value = result[resultFieldKey];
                if (typeof value !== 'undefined') {
                    _this.writeFieldToStore({
                        dataId: dataId,
                        value: value,
                        field: selection,
                        context: context,
                    });
                }
                else {
                    var isDefered = false;
                    var isClient = false;
                    if (selection.directives && selection.directives.length) {
                        isDefered = selection.directives.some(function (directive) { return directive.name && directive.name.value === 'defer'; });
                        isClient = selection.directives.some(function (directive) { return directive.name && directive.name.value === 'client'; });
                    }
                    if (!isDefered && !isClient && context.fragmentMatcherFunction) {
                         false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].warn("Missing field " + resultFieldKey + " in " + JSON.stringify(result, null, 2).substring(0, 100));
                    }
                }
            }
            else {
                var fragment = void 0;
                if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isInlineFragment"])(selection)) {
                    fragment = selection;
                }
                else {
                    fragment = (fragmentMap || {})[selection.name.value];
                     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(fragment, "No fragment named " + selection.name.value + ".");
                }
                var matches = true;
                if (context.fragmentMatcherFunction && fragment.typeCondition) {
                    var id = dataId || 'self';
                    var idValue = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["toIdValue"])({ id: id, typename: undefined });
                    var fakeContext = {
                        store: new ObjectCache((_a = {}, _a[id] = result, _a)),
                        cacheRedirects: {},
                    };
                    var match = context.fragmentMatcherFunction(idValue, fragment.typeCondition.name.value, fakeContext);
                    if (!Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isProduction"])() && match === 'heuristic') {
                         false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].error('WARNING: heuristic fragment matching going on!');
                    }
                    matches = !!match;
                }
                if (matches) {
                    _this.writeSelectionSetToStore({
                        result: result,
                        selectionSet: fragment.selectionSet,
                        dataId: dataId,
                        context: context,
                    });
                }
            }
        });
        return store;
    };
    StoreWriter.prototype.writeFieldToStore = function (_a) {
        var _b;
        var field = _a.field, value = _a.value, dataId = _a.dataId, context = _a.context;
        var variables = context.variables, dataIdFromObject = context.dataIdFromObject, store = context.store;
        var storeValue;
        var storeObject;
        var storeFieldName = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["storeKeyNameFromField"])(field, variables);
        if (!field.selectionSet || value === null) {
            storeValue =
                value != null && typeof value === 'object'
                    ?
                        { type: 'json', json: value }
                    :
                        value;
        }
        else if (Array.isArray(value)) {
            var generatedId = dataId + "." + storeFieldName;
            storeValue = this.processArrayValue(value, generatedId, field.selectionSet, context);
        }
        else {
            var valueDataId = dataId + "." + storeFieldName;
            var generated = true;
            if (!isGeneratedId(valueDataId)) {
                valueDataId = '$' + valueDataId;
            }
            if (dataIdFromObject) {
                var semanticId = dataIdFromObject(value);
                 false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(!semanticId || !isGeneratedId(semanticId), 'IDs returned by dataIdFromObject cannot begin with the "$" character.');
                if (semanticId ||
                    (typeof semanticId === 'number' && semanticId === 0)) {
                    valueDataId = semanticId;
                    generated = false;
                }
            }
            if (!isDataProcessed(valueDataId, field, context.processedData)) {
                this.writeSelectionSetToStore({
                    dataId: valueDataId,
                    result: value,
                    selectionSet: field.selectionSet,
                    context: context,
                });
            }
            var typename = value.__typename;
            storeValue = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["toIdValue"])({ id: valueDataId, typename: typename }, generated);
            storeObject = store.get(dataId);
            var escapedId = storeObject && storeObject[storeFieldName];
            if (escapedId !== storeValue && Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isIdValue"])(escapedId)) {
                var hadTypename = escapedId.typename !== undefined;
                var hasTypename = typename !== undefined;
                var typenameChanged = hadTypename && hasTypename && escapedId.typename !== typename;
                 false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(!generated || escapedId.generated || typenameChanged, "Store error: the application attempted to write an object with no provided id but the store already contains an id of " + escapedId.id + " for this object. The selectionSet that was trying to be written is:\n" + JSON.stringify(field));
                 false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(!hadTypename || hasTypename, "Store error: the application attempted to write an object with no provided typename but the store already contains an object with typename of " + escapedId.typename + " for the object of id " + escapedId.id + ". The selectionSet that was trying to be written is:\n" + JSON.stringify(field));
                if (escapedId.generated) {
                    if (typenameChanged) {
                        if (!generated) {
                            store.delete(escapedId.id);
                        }
                    }
                    else {
                        mergeWithGenerated(escapedId.id, storeValue.id, store);
                    }
                }
            }
        }
        storeObject = store.get(dataId);
        if (!storeObject || !Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isEqual"])(storeValue, storeObject[storeFieldName])) {
            store.set(dataId, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, storeObject), (_b = {}, _b[storeFieldName] = storeValue, _b)));
        }
    };
    StoreWriter.prototype.processArrayValue = function (value, generatedId, selectionSet, context) {
        var _this = this;
        return value.map(function (item, index) {
            if (item === null) {
                return null;
            }
            var itemDataId = generatedId + "." + index;
            if (Array.isArray(item)) {
                return _this.processArrayValue(item, itemDataId, selectionSet, context);
            }
            var generated = true;
            if (context.dataIdFromObject) {
                var semanticId = context.dataIdFromObject(item);
                if (semanticId) {
                    itemDataId = semanticId;
                    generated = false;
                }
            }
            if (!isDataProcessed(itemDataId, selectionSet, context.processedData)) {
                _this.writeSelectionSetToStore({
                    dataId: itemDataId,
                    result: item,
                    selectionSet: selectionSet,
                    context: context,
                });
            }
            return Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["toIdValue"])({ id: itemDataId, typename: item.__typename }, generated);
        });
    };
    return StoreWriter;
}());
function isGeneratedId(id) {
    return id[0] === '$';
}
function mergeWithGenerated(generatedKey, realKey, cache) {
    if (generatedKey === realKey) {
        return false;
    }
    var generated = cache.get(generatedKey);
    var real = cache.get(realKey);
    var madeChanges = false;
    Object.keys(generated).forEach(function (key) {
        var value = generated[key];
        var realValue = real[key];
        if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isIdValue"])(value) &&
            isGeneratedId(value.id) &&
            Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isIdValue"])(realValue) &&
            !Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isEqual"])(value, realValue) &&
            mergeWithGenerated(value.id, realValue.id, cache)) {
            madeChanges = true;
        }
    });
    cache.delete(generatedKey);
    var newRealValue = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, generated), real);
    if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["isEqual"])(newRealValue, real)) {
        return madeChanges;
    }
    cache.set(realKey, newRealValue);
    return true;
}
function isDataProcessed(dataId, field, processedData) {
    if (!processedData) {
        return false;
    }
    if (processedData[dataId]) {
        if (processedData[dataId].indexOf(field) >= 0) {
            return true;
        }
        else {
            processedData[dataId].push(field);
        }
    }
    else {
        processedData[dataId] = [field];
    }
    return false;
}

var defaultConfig = {
    fragmentMatcher: new HeuristicFragmentMatcher(),
    dataIdFromObject: defaultDataIdFromObject,
    addTypename: true,
    resultCaching: true,
    freezeResults: false,
};
function defaultDataIdFromObject(result) {
    if (result.__typename) {
        if (result.id !== undefined) {
            return result.__typename + ":" + result.id;
        }
        if (result._id !== undefined) {
            return result.__typename + ":" + result._id;
        }
    }
    return null;
}
var hasOwn$1 = Object.prototype.hasOwnProperty;
var OptimisticCacheLayer = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(OptimisticCacheLayer, _super);
    function OptimisticCacheLayer(optimisticId, parent, transaction) {
        var _this = _super.call(this, Object.create(null)) || this;
        _this.optimisticId = optimisticId;
        _this.parent = parent;
        _this.transaction = transaction;
        return _this;
    }
    OptimisticCacheLayer.prototype.toObject = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.parent.toObject()), this.data);
    };
    OptimisticCacheLayer.prototype.get = function (dataId) {
        return hasOwn$1.call(this.data, dataId)
            ? this.data[dataId]
            : this.parent.get(dataId);
    };
    return OptimisticCacheLayer;
}(ObjectCache));
var InMemoryCache = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(InMemoryCache, _super);
    function InMemoryCache(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this) || this;
        _this.watches = new Set();
        _this.typenameDocumentCache = new Map();
        _this.cacheKeyRoot = new optimism__WEBPACK_IMPORTED_MODULE_3__["KeyTrie"](apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["canUseWeakMap"]);
        _this.silenceBroadcast = false;
        _this.config = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, defaultConfig), config);
        if (_this.config.customResolvers) {
             false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].warn('customResolvers have been renamed to cacheRedirects. Please update your config as we will be deprecating customResolvers in the next major version.');
            _this.config.cacheRedirects = _this.config.customResolvers;
        }
        if (_this.config.cacheResolvers) {
             false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].warn('cacheResolvers have been renamed to cacheRedirects. Please update your config as we will be deprecating cacheResolvers in the next major version.');
            _this.config.cacheRedirects = _this.config.cacheResolvers;
        }
        _this.addTypename = !!_this.config.addTypename;
        _this.data = _this.config.resultCaching
            ? new DepTrackingCache()
            : new ObjectCache();
        _this.optimisticData = _this.data;
        _this.storeWriter = new StoreWriter();
        _this.storeReader = new StoreReader({
            cacheKeyRoot: _this.cacheKeyRoot,
            freezeResults: config.freezeResults,
        });
        var cache = _this;
        var maybeBroadcastWatch = cache.maybeBroadcastWatch;
        _this.maybeBroadcastWatch = Object(optimism__WEBPACK_IMPORTED_MODULE_3__["wrap"])(function (c) {
            return maybeBroadcastWatch.call(_this, c);
        }, {
            makeCacheKey: function (c) {
                if (c.optimistic) {
                    return;
                }
                if (c.previousResult) {
                    return;
                }
                if (cache.data instanceof DepTrackingCache) {
                    return cache.cacheKeyRoot.lookup(c.query, JSON.stringify(c.variables));
                }
            }
        });
        return _this;
    }
    InMemoryCache.prototype.restore = function (data) {
        if (data)
            this.data.replace(data);
        return this;
    };
    InMemoryCache.prototype.extract = function (optimistic) {
        if (optimistic === void 0) { optimistic = false; }
        return (optimistic ? this.optimisticData : this.data).toObject();
    };
    InMemoryCache.prototype.read = function (options) {
        if (typeof options.rootId === 'string' &&
            typeof this.data.get(options.rootId) === 'undefined') {
            return null;
        }
        var fragmentMatcher = this.config.fragmentMatcher;
        var fragmentMatcherFunction = fragmentMatcher && fragmentMatcher.match;
        return this.storeReader.readQueryFromStore({
            store: options.optimistic ? this.optimisticData : this.data,
            query: this.transformDocument(options.query),
            variables: options.variables,
            rootId: options.rootId,
            fragmentMatcherFunction: fragmentMatcherFunction,
            previousResult: options.previousResult,
            config: this.config,
        }) || null;
    };
    InMemoryCache.prototype.write = function (write) {
        var fragmentMatcher = this.config.fragmentMatcher;
        var fragmentMatcherFunction = fragmentMatcher && fragmentMatcher.match;
        this.storeWriter.writeResultToStore({
            dataId: write.dataId,
            result: write.result,
            variables: write.variables,
            document: this.transformDocument(write.query),
            store: this.data,
            dataIdFromObject: this.config.dataIdFromObject,
            fragmentMatcherFunction: fragmentMatcherFunction,
        });
        this.broadcastWatches();
    };
    InMemoryCache.prototype.diff = function (query) {
        var fragmentMatcher = this.config.fragmentMatcher;
        var fragmentMatcherFunction = fragmentMatcher && fragmentMatcher.match;
        return this.storeReader.diffQueryAgainstStore({
            store: query.optimistic ? this.optimisticData : this.data,
            query: this.transformDocument(query.query),
            variables: query.variables,
            returnPartialData: query.returnPartialData,
            previousResult: query.previousResult,
            fragmentMatcherFunction: fragmentMatcherFunction,
            config: this.config,
        });
    };
    InMemoryCache.prototype.watch = function (watch) {
        var _this = this;
        this.watches.add(watch);
        return function () {
            _this.watches.delete(watch);
        };
    };
    InMemoryCache.prototype.evict = function (query) {
        throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_4__["InvariantError"]("eviction is not implemented on InMemory Cache");
    };
    InMemoryCache.prototype.reset = function () {
        this.data.clear();
        this.broadcastWatches();
        return Promise.resolve();
    };
    InMemoryCache.prototype.removeOptimistic = function (idToRemove) {
        var toReapply = [];
        var removedCount = 0;
        var layer = this.optimisticData;
        while (layer instanceof OptimisticCacheLayer) {
            if (layer.optimisticId === idToRemove) {
                ++removedCount;
            }
            else {
                toReapply.push(layer);
            }
            layer = layer.parent;
        }
        if (removedCount > 0) {
            this.optimisticData = layer;
            while (toReapply.length > 0) {
                var layer_1 = toReapply.pop();
                this.performTransaction(layer_1.transaction, layer_1.optimisticId);
            }
            this.broadcastWatches();
        }
    };
    InMemoryCache.prototype.performTransaction = function (transaction, optimisticId) {
        var _a = this, data = _a.data, silenceBroadcast = _a.silenceBroadcast;
        this.silenceBroadcast = true;
        if (typeof optimisticId === 'string') {
            this.data = this.optimisticData = new OptimisticCacheLayer(optimisticId, this.optimisticData, transaction);
        }
        try {
            transaction(this);
        }
        finally {
            this.silenceBroadcast = silenceBroadcast;
            this.data = data;
        }
        this.broadcastWatches();
    };
    InMemoryCache.prototype.recordOptimisticTransaction = function (transaction, id) {
        return this.performTransaction(transaction, id);
    };
    InMemoryCache.prototype.transformDocument = function (document) {
        if (this.addTypename) {
            var result = this.typenameDocumentCache.get(document);
            if (!result) {
                result = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_2__["addTypenameToDocument"])(document);
                this.typenameDocumentCache.set(document, result);
                this.typenameDocumentCache.set(result, result);
            }
            return result;
        }
        return document;
    };
    InMemoryCache.prototype.broadcastWatches = function () {
        var _this = this;
        if (!this.silenceBroadcast) {
            this.watches.forEach(function (c) { return _this.maybeBroadcastWatch(c); });
        }
    };
    InMemoryCache.prototype.maybeBroadcastWatch = function (c) {
        c.callback(this.diff({
            query: c.query,
            variables: c.variables,
            previousResult: c.previousResult && c.previousResult(),
            optimistic: c.optimistic,
        }));
    };
    return InMemoryCache;
}(apollo_cache__WEBPACK_IMPORTED_MODULE_1__["ApolloCache"]));


//# sourceMappingURL=bundle.esm.js.map


/***/ }),

/***/ "./node_modules/apollo-cache/lib/bundle.esm.js":
/*!*****************************************************!*\
  !*** ./node_modules/apollo-cache/lib/bundle.esm.js ***!
  \*****************************************************/
/*! exports provided: ApolloCache, Cache */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApolloCache", function() { return ApolloCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cache", function() { return Cache; });
/* harmony import */ var apollo_utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-utilities */ "./node_modules/apollo-utilities/lib/bundle.esm.js");


function queryFromPojo(obj) {
    var op = {
        kind: 'OperationDefinition',
        operation: 'query',
        name: {
            kind: 'Name',
            value: 'GeneratedClientQuery',
        },
        selectionSet: selectionSetFromObj(obj),
    };
    var out = {
        kind: 'Document',
        definitions: [op],
    };
    return out;
}
function fragmentFromPojo(obj, typename) {
    var frag = {
        kind: 'FragmentDefinition',
        typeCondition: {
            kind: 'NamedType',
            name: {
                kind: 'Name',
                value: typename || '__FakeType',
            },
        },
        name: {
            kind: 'Name',
            value: 'GeneratedClientQuery',
        },
        selectionSet: selectionSetFromObj(obj),
    };
    var out = {
        kind: 'Document',
        definitions: [frag],
    };
    return out;
}
function selectionSetFromObj(obj) {
    if (typeof obj === 'number' ||
        typeof obj === 'boolean' ||
        typeof obj === 'string' ||
        typeof obj === 'undefined' ||
        obj === null) {
        return null;
    }
    if (Array.isArray(obj)) {
        return selectionSetFromObj(obj[0]);
    }
    var selections = [];
    Object.keys(obj).forEach(function (key) {
        var nestedSelSet = selectionSetFromObj(obj[key]);
        var field = {
            kind: 'Field',
            name: {
                kind: 'Name',
                value: key,
            },
            selectionSet: nestedSelSet || undefined,
        };
        selections.push(field);
    });
    var selectionSet = {
        kind: 'SelectionSet',
        selections: selections,
    };
    return selectionSet;
}
var justTypenameQuery = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: null,
            variableDefinitions: null,
            directives: [],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        alias: null,
                        name: {
                            kind: 'Name',
                            value: '__typename',
                        },
                        arguments: [],
                        directives: [],
                        selectionSet: null,
                    },
                ],
            },
        },
    ],
};

var ApolloCache = (function () {
    function ApolloCache() {
    }
    ApolloCache.prototype.transformDocument = function (document) {
        return document;
    };
    ApolloCache.prototype.transformForLink = function (document) {
        return document;
    };
    ApolloCache.prototype.readQuery = function (options, optimistic) {
        if (optimistic === void 0) { optimistic = false; }
        return this.read({
            query: options.query,
            variables: options.variables,
            optimistic: optimistic,
        });
    };
    ApolloCache.prototype.readFragment = function (options, optimistic) {
        if (optimistic === void 0) { optimistic = false; }
        return this.read({
            query: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_0__["getFragmentQueryDocument"])(options.fragment, options.fragmentName),
            variables: options.variables,
            rootId: options.id,
            optimistic: optimistic,
        });
    };
    ApolloCache.prototype.writeQuery = function (options) {
        this.write({
            dataId: 'ROOT_QUERY',
            result: options.data,
            query: options.query,
            variables: options.variables,
        });
    };
    ApolloCache.prototype.writeFragment = function (options) {
        this.write({
            dataId: options.id,
            result: options.data,
            variables: options.variables,
            query: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_0__["getFragmentQueryDocument"])(options.fragment, options.fragmentName),
        });
    };
    ApolloCache.prototype.writeData = function (_a) {
        var id = _a.id, data = _a.data;
        if (typeof id !== 'undefined') {
            var typenameResult = null;
            try {
                typenameResult = this.read({
                    rootId: id,
                    optimistic: false,
                    query: justTypenameQuery,
                });
            }
            catch (e) {
            }
            var __typename = (typenameResult && typenameResult.__typename) || '__ClientData';
            var dataToWrite = Object.assign({ __typename: __typename }, data);
            this.writeFragment({
                id: id,
                fragment: fragmentFromPojo(dataToWrite, __typename),
                data: dataToWrite,
            });
        }
        else {
            this.writeQuery({ query: queryFromPojo(data), data: data });
        }
    };
    return ApolloCache;
}());

var Cache;
(function (Cache) {
})(Cache || (Cache = {}));


//# sourceMappingURL=bundle.esm.js.map


/***/ }),

/***/ "./node_modules/apollo-client/bundle.esm.js":
/*!**************************************************!*\
  !*** ./node_modules/apollo-client/bundle.esm.js ***!
  \**************************************************/
/*! exports provided: default, ApolloClient, ApolloError, FetchType, NetworkStatus, ObservableQuery, isApolloError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApolloClient", function() { return ApolloClient; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApolloError", function() { return ApolloError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FetchType", function() { return FetchType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkStatus", function() { return NetworkStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObservableQuery", function() { return ObservableQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isApolloError", function() { return isApolloError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var apollo_utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-utilities */ "./node_modules/apollo-utilities/lib/bundle.esm.js");
/* harmony import */ var apollo_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! apollo-link */ "./node_modules/apollo-link/lib/bundle.esm.js");
/* harmony import */ var symbol_observable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! symbol-observable */ "./node_modules/symbol-observable/es/index.js");
/* harmony import */ var ts_invariant__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ts-invariant */ "./node_modules/ts-invariant/lib/invariant.esm.js");
/* harmony import */ var graphql_language_visitor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! graphql/language/visitor */ "./node_modules/graphql/language/visitor.mjs");







var NetworkStatus;
(function (NetworkStatus) {
    NetworkStatus[NetworkStatus["loading"] = 1] = "loading";
    NetworkStatus[NetworkStatus["setVariables"] = 2] = "setVariables";
    NetworkStatus[NetworkStatus["fetchMore"] = 3] = "fetchMore";
    NetworkStatus[NetworkStatus["refetch"] = 4] = "refetch";
    NetworkStatus[NetworkStatus["poll"] = 6] = "poll";
    NetworkStatus[NetworkStatus["ready"] = 7] = "ready";
    NetworkStatus[NetworkStatus["error"] = 8] = "error";
})(NetworkStatus || (NetworkStatus = {}));
function isNetworkRequestInFlight(networkStatus) {
    return networkStatus < 7;
}

var Observable = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(Observable, _super);
    function Observable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Observable.prototype[symbol_observable__WEBPACK_IMPORTED_MODULE_3__["default"]] = function () {
        return this;
    };
    Observable.prototype['@@observable'] = function () {
        return this;
    };
    return Observable;
}(apollo_link__WEBPACK_IMPORTED_MODULE_2__["Observable"]));

function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}

function isApolloError(err) {
    return err.hasOwnProperty('graphQLErrors');
}
var generateErrorMessage = function (err) {
    var message = '';
    if (isNonEmptyArray(err.graphQLErrors)) {
        err.graphQLErrors.forEach(function (graphQLError) {
            var errorMessage = graphQLError
                ? graphQLError.message
                : 'Error message not found.';
            message += "GraphQL error: " + errorMessage + "\n";
        });
    }
    if (err.networkError) {
        message += 'Network error: ' + err.networkError.message + '\n';
    }
    message = message.replace(/\n$/, '');
    return message;
};
var ApolloError = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(ApolloError, _super);
    function ApolloError(_a) {
        var graphQLErrors = _a.graphQLErrors, networkError = _a.networkError, errorMessage = _a.errorMessage, extraInfo = _a.extraInfo;
        var _this = _super.call(this, errorMessage) || this;
        _this.graphQLErrors = graphQLErrors || [];
        _this.networkError = networkError || null;
        if (!errorMessage) {
            _this.message = generateErrorMessage(_this);
        }
        else {
            _this.message = errorMessage;
        }
        _this.extraInfo = extraInfo;
        _this.__proto__ = ApolloError.prototype;
        return _this;
    }
    return ApolloError;
}(Error));

var FetchType;
(function (FetchType) {
    FetchType[FetchType["normal"] = 1] = "normal";
    FetchType[FetchType["refetch"] = 2] = "refetch";
    FetchType[FetchType["poll"] = 3] = "poll";
})(FetchType || (FetchType = {}));

var hasError = function (storeValue, policy) {
    if (policy === void 0) { policy = 'none'; }
    return storeValue && (storeValue.networkError ||
        (policy === 'none' && isNonEmptyArray(storeValue.graphQLErrors)));
};
var ObservableQuery = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(ObservableQuery, _super);
    function ObservableQuery(_a) {
        var queryManager = _a.queryManager, options = _a.options, _b = _a.shouldSubscribe, shouldSubscribe = _b === void 0 ? true : _b;
        var _this = _super.call(this, function (observer) {
            return _this.onSubscribe(observer);
        }) || this;
        _this.observers = new Set();
        _this.subscriptions = new Set();
        _this.isTornDown = false;
        _this.options = options;
        _this.variables = options.variables || {};
        _this.queryId = queryManager.generateQueryId();
        _this.shouldSubscribe = shouldSubscribe;
        var opDef = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["getOperationDefinition"])(options.query);
        _this.queryName = opDef && opDef.name && opDef.name.value;
        _this.queryManager = queryManager;
        return _this;
    }
    ObservableQuery.prototype.result = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var observer = {
                next: function (result) {
                    resolve(result);
                    _this.observers.delete(observer);
                    if (!_this.observers.size) {
                        _this.queryManager.removeQuery(_this.queryId);
                    }
                    setTimeout(function () {
                        subscription.unsubscribe();
                    }, 0);
                },
                error: reject,
            };
            var subscription = _this.subscribe(observer);
        });
    };
    ObservableQuery.prototype.currentResult = function () {
        var result = this.getCurrentResult();
        if (result.data === undefined) {
            result.data = {};
        }
        return result;
    };
    ObservableQuery.prototype.getCurrentResult = function () {
        if (this.isTornDown) {
            var lastResult = this.lastResult;
            return {
                data: !this.lastError && lastResult && lastResult.data || void 0,
                error: this.lastError,
                loading: false,
                networkStatus: NetworkStatus.error,
            };
        }
        var _a = this.queryManager.getCurrentQueryResult(this), data = _a.data, partial = _a.partial;
        var queryStoreValue = this.queryManager.queryStore.get(this.queryId);
        var result;
        var fetchPolicy = this.options.fetchPolicy;
        var isNetworkFetchPolicy = fetchPolicy === 'network-only' ||
            fetchPolicy === 'no-cache';
        if (queryStoreValue) {
            var networkStatus = queryStoreValue.networkStatus;
            if (hasError(queryStoreValue, this.options.errorPolicy)) {
                return {
                    data: void 0,
                    loading: false,
                    networkStatus: networkStatus,
                    error: new ApolloError({
                        graphQLErrors: queryStoreValue.graphQLErrors,
                        networkError: queryStoreValue.networkError,
                    }),
                };
            }
            if (queryStoreValue.variables) {
                this.options.variables = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.options.variables), queryStoreValue.variables);
                this.variables = this.options.variables;
            }
            result = {
                data: data,
                loading: isNetworkRequestInFlight(networkStatus),
                networkStatus: networkStatus,
            };
            if (queryStoreValue.graphQLErrors && this.options.errorPolicy === 'all') {
                result.errors = queryStoreValue.graphQLErrors;
            }
        }
        else {
            var loading = isNetworkFetchPolicy ||
                (partial && fetchPolicy !== 'cache-only');
            result = {
                data: data,
                loading: loading,
                networkStatus: loading ? NetworkStatus.loading : NetworkStatus.ready,
            };
        }
        if (!partial) {
            this.updateLastResult(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, result), { stale: false }));
        }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, result), { partial: partial });
    };
    ObservableQuery.prototype.isDifferentFromLastResult = function (newResult) {
        var snapshot = this.lastResultSnapshot;
        return !(snapshot &&
            newResult &&
            snapshot.networkStatus === newResult.networkStatus &&
            snapshot.stale === newResult.stale &&
            Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["isEqual"])(snapshot.data, newResult.data));
    };
    ObservableQuery.prototype.getLastResult = function () {
        return this.lastResult;
    };
    ObservableQuery.prototype.getLastError = function () {
        return this.lastError;
    };
    ObservableQuery.prototype.resetLastResults = function () {
        delete this.lastResult;
        delete this.lastResultSnapshot;
        delete this.lastError;
        this.isTornDown = false;
    };
    ObservableQuery.prototype.resetQueryStoreErrors = function () {
        var queryStore = this.queryManager.queryStore.get(this.queryId);
        if (queryStore) {
            queryStore.networkError = null;
            queryStore.graphQLErrors = [];
        }
    };
    ObservableQuery.prototype.refetch = function (variables) {
        var fetchPolicy = this.options.fetchPolicy;
        if (fetchPolicy === 'cache-only') {
            return Promise.reject( false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_4__["InvariantError"]('cache-only fetchPolicy option should not be used together with query refetch.'));
        }
        if (fetchPolicy !== 'no-cache' &&
            fetchPolicy !== 'cache-and-network') {
            fetchPolicy = 'network-only';
        }
        if (!Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["isEqual"])(this.variables, variables)) {
            this.variables = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.variables), variables);
        }
        if (!Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["isEqual"])(this.options.variables, this.variables)) {
            this.options.variables = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.options.variables), this.variables);
        }
        return this.queryManager.fetchQuery(this.queryId, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.options), { fetchPolicy: fetchPolicy }), FetchType.refetch);
    };
    ObservableQuery.prototype.fetchMore = function (fetchMoreOptions) {
        var _this = this;
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(fetchMoreOptions.updateQuery, 'updateQuery option is required. This function defines how to update the query data with the new results.');
        var combinedOptions = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, (fetchMoreOptions.query ? fetchMoreOptions : Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.options), fetchMoreOptions), { variables: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.variables), fetchMoreOptions.variables) }))), { fetchPolicy: 'network-only' });
        var qid = this.queryManager.generateQueryId();
        return this.queryManager
            .fetchQuery(qid, combinedOptions, FetchType.normal, this.queryId)
            .then(function (fetchMoreResult) {
            _this.updateQuery(function (previousResult) {
                return fetchMoreOptions.updateQuery(previousResult, {
                    fetchMoreResult: fetchMoreResult.data,
                    variables: combinedOptions.variables,
                });
            });
            _this.queryManager.stopQuery(qid);
            return fetchMoreResult;
        }, function (error) {
            _this.queryManager.stopQuery(qid);
            throw error;
        });
    };
    ObservableQuery.prototype.subscribeToMore = function (options) {
        var _this = this;
        var subscription = this.queryManager
            .startGraphQLSubscription({
            query: options.document,
            variables: options.variables,
        })
            .subscribe({
            next: function (subscriptionData) {
                var updateQuery = options.updateQuery;
                if (updateQuery) {
                    _this.updateQuery(function (previous, _a) {
                        var variables = _a.variables;
                        return updateQuery(previous, {
                            subscriptionData: subscriptionData,
                            variables: variables,
                        });
                    });
                }
            },
            error: function (err) {
                if (options.onError) {
                    options.onError(err);
                    return;
                }
                 false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].error('Unhandled GraphQL subscription error', err);
            },
        });
        this.subscriptions.add(subscription);
        return function () {
            if (_this.subscriptions.delete(subscription)) {
                subscription.unsubscribe();
            }
        };
    };
    ObservableQuery.prototype.setOptions = function (opts) {
        var oldFetchPolicy = this.options.fetchPolicy;
        this.options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.options), opts);
        if (opts.pollInterval) {
            this.startPolling(opts.pollInterval);
        }
        else if (opts.pollInterval === 0) {
            this.stopPolling();
        }
        var fetchPolicy = opts.fetchPolicy;
        return this.setVariables(this.options.variables, oldFetchPolicy !== fetchPolicy && (oldFetchPolicy === 'cache-only' ||
            oldFetchPolicy === 'standby' ||
            fetchPolicy === 'network-only'), opts.fetchResults);
    };
    ObservableQuery.prototype.setVariables = function (variables, tryFetch, fetchResults) {
        if (tryFetch === void 0) { tryFetch = false; }
        if (fetchResults === void 0) { fetchResults = true; }
        this.isTornDown = false;
        variables = variables || this.variables;
        if (!tryFetch && Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["isEqual"])(variables, this.variables)) {
            return this.observers.size && fetchResults
                ? this.result()
                : Promise.resolve();
        }
        this.variables = this.options.variables = variables;
        if (!this.observers.size) {
            return Promise.resolve();
        }
        return this.queryManager.fetchQuery(this.queryId, this.options);
    };
    ObservableQuery.prototype.updateQuery = function (mapFn) {
        var queryManager = this.queryManager;
        var _a = queryManager.getQueryWithPreviousResult(this.queryId), previousResult = _a.previousResult, variables = _a.variables, document = _a.document;
        var newResult = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["tryFunctionOrLogError"])(function () {
            return mapFn(previousResult, { variables: variables });
        });
        if (newResult) {
            queryManager.dataStore.markUpdateQueryResult(document, variables, newResult);
            queryManager.broadcastQueries();
        }
    };
    ObservableQuery.prototype.stopPolling = function () {
        this.queryManager.stopPollingQuery(this.queryId);
        this.options.pollInterval = undefined;
    };
    ObservableQuery.prototype.startPolling = function (pollInterval) {
        assertNotCacheFirstOrOnly(this);
        this.options.pollInterval = pollInterval;
        this.queryManager.startPollingQuery(this.options, this.queryId);
    };
    ObservableQuery.prototype.updateLastResult = function (newResult) {
        var previousResult = this.lastResult;
        this.lastResult = newResult;
        this.lastResultSnapshot = this.queryManager.assumeImmutableResults
            ? newResult
            : Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["cloneDeep"])(newResult);
        return previousResult;
    };
    ObservableQuery.prototype.onSubscribe = function (observer) {
        var _this = this;
        try {
            var subObserver = observer._subscription._observer;
            if (subObserver && !subObserver.error) {
                subObserver.error = defaultSubscriptionObserverErrorCallback;
            }
        }
        catch (_a) { }
        var first = !this.observers.size;
        this.observers.add(observer);
        if (observer.next && this.lastResult)
            observer.next(this.lastResult);
        if (observer.error && this.lastError)
            observer.error(this.lastError);
        if (first) {
            this.setUpQuery();
        }
        return function () {
            if (_this.observers.delete(observer) && !_this.observers.size) {
                _this.tearDownQuery();
            }
        };
    };
    ObservableQuery.prototype.setUpQuery = function () {
        var _this = this;
        var _a = this, queryManager = _a.queryManager, queryId = _a.queryId;
        if (this.shouldSubscribe) {
            queryManager.addObservableQuery(queryId, this);
        }
        if (this.options.pollInterval) {
            assertNotCacheFirstOrOnly(this);
            queryManager.startPollingQuery(this.options, queryId);
        }
        var onError = function (error) {
            _this.updateLastResult(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, _this.lastResult), { errors: error.graphQLErrors, networkStatus: NetworkStatus.error, loading: false }));
            iterateObserversSafely(_this.observers, 'error', _this.lastError = error);
        };
        queryManager.observeQuery(queryId, this.options, {
            next: function (result) {
                if (_this.lastError || _this.isDifferentFromLastResult(result)) {
                    var previousResult_1 = _this.updateLastResult(result);
                    var _a = _this.options, query_1 = _a.query, variables = _a.variables, fetchPolicy_1 = _a.fetchPolicy;
                    if (queryManager.transform(query_1).hasClientExports) {
                        queryManager.getLocalState().addExportedVariables(query_1, variables).then(function (variables) {
                            var previousVariables = _this.variables;
                            _this.variables = _this.options.variables = variables;
                            if (!result.loading &&
                                previousResult_1 &&
                                fetchPolicy_1 !== 'cache-only' &&
                                queryManager.transform(query_1).serverQuery &&
                                !Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["isEqual"])(previousVariables, variables)) {
                                _this.refetch();
                            }
                            else {
                                iterateObserversSafely(_this.observers, 'next', result);
                            }
                        });
                    }
                    else {
                        iterateObserversSafely(_this.observers, 'next', result);
                    }
                }
            },
            error: onError,
        }).catch(onError);
    };
    ObservableQuery.prototype.tearDownQuery = function () {
        var queryManager = this.queryManager;
        this.isTornDown = true;
        queryManager.stopPollingQuery(this.queryId);
        this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        this.subscriptions.clear();
        queryManager.removeObservableQuery(this.queryId);
        queryManager.stopQuery(this.queryId);
        this.observers.clear();
    };
    return ObservableQuery;
}(Observable));
function defaultSubscriptionObserverErrorCallback(error) {
     false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].error('Unhandled error', error.message, error.stack);
}
function iterateObserversSafely(observers, method, argument) {
    var observersWithMethod = [];
    observers.forEach(function (obs) { return obs[method] && observersWithMethod.push(obs); });
    observersWithMethod.forEach(function (obs) { return obs[method](argument); });
}
function assertNotCacheFirstOrOnly(obsQuery) {
    var fetchPolicy = obsQuery.options.fetchPolicy;
     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(fetchPolicy !== 'cache-first' && fetchPolicy !== 'cache-only', 'Queries that specify the cache-first and cache-only fetchPolicies cannot also be polling queries.');
}

var MutationStore = (function () {
    function MutationStore() {
        this.store = {};
    }
    MutationStore.prototype.getStore = function () {
        return this.store;
    };
    MutationStore.prototype.get = function (mutationId) {
        return this.store[mutationId];
    };
    MutationStore.prototype.initMutation = function (mutationId, mutation, variables) {
        this.store[mutationId] = {
            mutation: mutation,
            variables: variables || {},
            loading: true,
            error: null,
        };
    };
    MutationStore.prototype.markMutationError = function (mutationId, error) {
        var mutation = this.store[mutationId];
        if (mutation) {
            mutation.loading = false;
            mutation.error = error;
        }
    };
    MutationStore.prototype.markMutationResult = function (mutationId) {
        var mutation = this.store[mutationId];
        if (mutation) {
            mutation.loading = false;
            mutation.error = null;
        }
    };
    MutationStore.prototype.reset = function () {
        this.store = {};
    };
    return MutationStore;
}());

var QueryStore = (function () {
    function QueryStore() {
        this.store = {};
    }
    QueryStore.prototype.getStore = function () {
        return this.store;
    };
    QueryStore.prototype.get = function (queryId) {
        return this.store[queryId];
    };
    QueryStore.prototype.initQuery = function (query) {
        var previousQuery = this.store[query.queryId];
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(!previousQuery ||
            previousQuery.document === query.document ||
            Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["isEqual"])(previousQuery.document, query.document), 'Internal Error: may not update existing query string in store');
        var isSetVariables = false;
        var previousVariables = null;
        if (query.storePreviousVariables &&
            previousQuery &&
            previousQuery.networkStatus !== NetworkStatus.loading) {
            if (!Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["isEqual"])(previousQuery.variables, query.variables)) {
                isSetVariables = true;
                previousVariables = previousQuery.variables;
            }
        }
        var networkStatus;
        if (isSetVariables) {
            networkStatus = NetworkStatus.setVariables;
        }
        else if (query.isPoll) {
            networkStatus = NetworkStatus.poll;
        }
        else if (query.isRefetch) {
            networkStatus = NetworkStatus.refetch;
        }
        else {
            networkStatus = NetworkStatus.loading;
        }
        var graphQLErrors = [];
        if (previousQuery && previousQuery.graphQLErrors) {
            graphQLErrors = previousQuery.graphQLErrors;
        }
        this.store[query.queryId] = {
            document: query.document,
            variables: query.variables,
            previousVariables: previousVariables,
            networkError: null,
            graphQLErrors: graphQLErrors,
            networkStatus: networkStatus,
            metadata: query.metadata,
        };
        if (typeof query.fetchMoreForQueryId === 'string' &&
            this.store[query.fetchMoreForQueryId]) {
            this.store[query.fetchMoreForQueryId].networkStatus =
                NetworkStatus.fetchMore;
        }
    };
    QueryStore.prototype.markQueryResult = function (queryId, result, fetchMoreForQueryId) {
        if (!this.store || !this.store[queryId])
            return;
        this.store[queryId].networkError = null;
        this.store[queryId].graphQLErrors = isNonEmptyArray(result.errors) ? result.errors : [];
        this.store[queryId].previousVariables = null;
        this.store[queryId].networkStatus = NetworkStatus.ready;
        if (typeof fetchMoreForQueryId === 'string' &&
            this.store[fetchMoreForQueryId]) {
            this.store[fetchMoreForQueryId].networkStatus = NetworkStatus.ready;
        }
    };
    QueryStore.prototype.markQueryError = function (queryId, error, fetchMoreForQueryId) {
        if (!this.store || !this.store[queryId])
            return;
        this.store[queryId].networkError = error;
        this.store[queryId].networkStatus = NetworkStatus.error;
        if (typeof fetchMoreForQueryId === 'string') {
            this.markQueryResultClient(fetchMoreForQueryId, true);
        }
    };
    QueryStore.prototype.markQueryResultClient = function (queryId, complete) {
        var storeValue = this.store && this.store[queryId];
        if (storeValue) {
            storeValue.networkError = null;
            storeValue.previousVariables = null;
            if (complete) {
                storeValue.networkStatus = NetworkStatus.ready;
            }
        }
    };
    QueryStore.prototype.stopQuery = function (queryId) {
        delete this.store[queryId];
    };
    QueryStore.prototype.reset = function (observableQueryIds) {
        var _this = this;
        Object.keys(this.store).forEach(function (queryId) {
            if (observableQueryIds.indexOf(queryId) < 0) {
                _this.stopQuery(queryId);
            }
            else {
                _this.store[queryId].networkStatus = NetworkStatus.loading;
            }
        });
    };
    return QueryStore;
}());

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

var LocalState = (function () {
    function LocalState(_a) {
        var cache = _a.cache, client = _a.client, resolvers = _a.resolvers, fragmentMatcher = _a.fragmentMatcher;
        this.cache = cache;
        if (client) {
            this.client = client;
        }
        if (resolvers) {
            this.addResolvers(resolvers);
        }
        if (fragmentMatcher) {
            this.setFragmentMatcher(fragmentMatcher);
        }
    }
    LocalState.prototype.addResolvers = function (resolvers) {
        var _this = this;
        this.resolvers = this.resolvers || {};
        if (Array.isArray(resolvers)) {
            resolvers.forEach(function (resolverGroup) {
                _this.resolvers = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["mergeDeep"])(_this.resolvers, resolverGroup);
            });
        }
        else {
            this.resolvers = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["mergeDeep"])(this.resolvers, resolvers);
        }
    };
    LocalState.prototype.setResolvers = function (resolvers) {
        this.resolvers = {};
        this.addResolvers(resolvers);
    };
    LocalState.prototype.getResolvers = function () {
        return this.resolvers || {};
    };
    LocalState.prototype.runResolvers = function (_a) {
        var document = _a.document, remoteResult = _a.remoteResult, context = _a.context, variables = _a.variables, _b = _a.onlyRunForcedResolvers, onlyRunForcedResolvers = _b === void 0 ? false : _b;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_c) {
                if (document) {
                    return [2, this.resolveDocument(document, remoteResult.data, context, variables, this.fragmentMatcher, onlyRunForcedResolvers).then(function (localResult) { return (Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, remoteResult), { data: localResult.result })); })];
                }
                return [2, remoteResult];
            });
        });
    };
    LocalState.prototype.setFragmentMatcher = function (fragmentMatcher) {
        this.fragmentMatcher = fragmentMatcher;
    };
    LocalState.prototype.getFragmentMatcher = function () {
        return this.fragmentMatcher;
    };
    LocalState.prototype.clientQuery = function (document) {
        if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["hasDirectives"])(['client'], document)) {
            if (this.resolvers) {
                return document;
            }
             false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].warn('Found @client directives in a query but no ApolloClient resolvers ' +
                'were specified. This means ApolloClient local resolver handling ' +
                'has been disabled, and @client directives will be passed through ' +
                'to your link chain.');
        }
        return null;
    };
    LocalState.prototype.serverQuery = function (document) {
        return this.resolvers ? Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["removeClientSetsFromDocument"])(document) : document;
    };
    LocalState.prototype.prepareContext = function (context) {
        if (context === void 0) { context = {}; }
        var cache = this.cache;
        var newContext = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, context), { cache: cache, getCacheKey: function (obj) {
                if (cache.config) {
                    return cache.config.dataIdFromObject(obj);
                }
                else {
                     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(false, 'To use context.getCacheKey, you need to use a cache that has ' +
                        'a configurable dataIdFromObject, like apollo-cache-inmemory.');
                }
            } });
        return newContext;
    };
    LocalState.prototype.addExportedVariables = function (document, variables, context) {
        if (variables === void 0) { variables = {}; }
        if (context === void 0) { context = {}; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                if (document) {
                    return [2, this.resolveDocument(document, this.buildRootValueFromCache(document, variables) || {}, this.prepareContext(context), variables).then(function (data) { return (Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, variables), data.exportedVariables)); })];
                }
                return [2, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, variables)];
            });
        });
    };
    LocalState.prototype.shouldForceResolvers = function (document) {
        var forceResolvers = false;
        Object(graphql_language_visitor__WEBPACK_IMPORTED_MODULE_5__["visit"])(document, {
            Directive: {
                enter: function (node) {
                    if (node.name.value === 'client' && node.arguments) {
                        forceResolvers = node.arguments.some(function (arg) {
                            return arg.name.value === 'always' &&
                                arg.value.kind === 'BooleanValue' &&
                                arg.value.value === true;
                        });
                        if (forceResolvers) {
                            return graphql_language_visitor__WEBPACK_IMPORTED_MODULE_5__["BREAK"];
                        }
                    }
                },
            },
        });
        return forceResolvers;
    };
    LocalState.prototype.buildRootValueFromCache = function (document, variables) {
        return this.cache.diff({
            query: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["buildQueryFromSelectionSet"])(document),
            variables: variables,
            returnPartialData: true,
            optimistic: false,
        }).result;
    };
    LocalState.prototype.resolveDocument = function (document, rootValue, context, variables, fragmentMatcher, onlyRunForcedResolvers) {
        if (context === void 0) { context = {}; }
        if (variables === void 0) { variables = {}; }
        if (fragmentMatcher === void 0) { fragmentMatcher = function () { return true; }; }
        if (onlyRunForcedResolvers === void 0) { onlyRunForcedResolvers = false; }
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var mainDefinition, fragments, fragmentMap, definitionOperation, defaultOperationType, _a, cache, client, execContext;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_b) {
                mainDefinition = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["getMainDefinition"])(document);
                fragments = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["getFragmentDefinitions"])(document);
                fragmentMap = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["createFragmentMap"])(fragments);
                definitionOperation = mainDefinition
                    .operation;
                defaultOperationType = definitionOperation
                    ? capitalizeFirstLetter(definitionOperation)
                    : 'Query';
                _a = this, cache = _a.cache, client = _a.client;
                execContext = {
                    fragmentMap: fragmentMap,
                    context: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, context), { cache: cache,
                        client: client }),
                    variables: variables,
                    fragmentMatcher: fragmentMatcher,
                    defaultOperationType: defaultOperationType,
                    exportedVariables: {},
                    onlyRunForcedResolvers: onlyRunForcedResolvers,
                };
                return [2, this.resolveSelectionSet(mainDefinition.selectionSet, rootValue, execContext).then(function (result) { return ({
                        result: result,
                        exportedVariables: execContext.exportedVariables,
                    }); })];
            });
        });
    };
    LocalState.prototype.resolveSelectionSet = function (selectionSet, rootValue, execContext) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var fragmentMap, context, variables, resultsToMerge, execute;
            var _this = this;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                fragmentMap = execContext.fragmentMap, context = execContext.context, variables = execContext.variables;
                resultsToMerge = [rootValue];
                execute = function (selection) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(_this, void 0, void 0, function () {
                    var fragment, typeCondition;
                    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                        if (!Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["shouldInclude"])(selection, variables)) {
                            return [2];
                        }
                        if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["isField"])(selection)) {
                            return [2, this.resolveField(selection, rootValue, execContext).then(function (fieldResult) {
                                    var _a;
                                    if (typeof fieldResult !== 'undefined') {
                                        resultsToMerge.push((_a = {},
                                            _a[Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["resultKeyNameFromField"])(selection)] = fieldResult,
                                            _a));
                                    }
                                })];
                        }
                        if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["isInlineFragment"])(selection)) {
                            fragment = selection;
                        }
                        else {
                            fragment = fragmentMap[selection.name.value];
                             false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(fragment, "No fragment named " + selection.name.value);
                        }
                        if (fragment && fragment.typeCondition) {
                            typeCondition = fragment.typeCondition.name.value;
                            if (execContext.fragmentMatcher(rootValue, typeCondition, context)) {
                                return [2, this.resolveSelectionSet(fragment.selectionSet, rootValue, execContext).then(function (fragmentResult) {
                                        resultsToMerge.push(fragmentResult);
                                    })];
                            }
                        }
                        return [2];
                    });
                }); };
                return [2, Promise.all(selectionSet.selections.map(execute)).then(function () {
                        return Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["mergeDeepArray"])(resultsToMerge);
                    })];
            });
        });
    };
    LocalState.prototype.resolveField = function (field, rootValue, execContext) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var variables, fieldName, aliasedFieldName, aliasUsed, defaultResult, resultPromise, resolverType, resolverMap, resolve;
            var _this = this;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_a) {
                variables = execContext.variables;
                fieldName = field.name.value;
                aliasedFieldName = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["resultKeyNameFromField"])(field);
                aliasUsed = fieldName !== aliasedFieldName;
                defaultResult = rootValue[aliasedFieldName] || rootValue[fieldName];
                resultPromise = Promise.resolve(defaultResult);
                if (!execContext.onlyRunForcedResolvers ||
                    this.shouldForceResolvers(field)) {
                    resolverType = rootValue.__typename || execContext.defaultOperationType;
                    resolverMap = this.resolvers && this.resolvers[resolverType];
                    if (resolverMap) {
                        resolve = resolverMap[aliasUsed ? fieldName : aliasedFieldName];
                        if (resolve) {
                            resultPromise = Promise.resolve(resolve(rootValue, Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["argumentsObjectFromField"])(field, variables), execContext.context, { field: field, fragmentMap: execContext.fragmentMap }));
                        }
                    }
                }
                return [2, resultPromise.then(function (result) {
                        if (result === void 0) { result = defaultResult; }
                        if (field.directives) {
                            field.directives.forEach(function (directive) {
                                if (directive.name.value === 'export' && directive.arguments) {
                                    directive.arguments.forEach(function (arg) {
                                        if (arg.name.value === 'as' && arg.value.kind === 'StringValue') {
                                            execContext.exportedVariables[arg.value.value] = result;
                                        }
                                    });
                                }
                            });
                        }
                        if (!field.selectionSet) {
                            return result;
                        }
                        if (result == null) {
                            return result;
                        }
                        if (Array.isArray(result)) {
                            return _this.resolveSubSelectedArray(field, result, execContext);
                        }
                        if (field.selectionSet) {
                            return _this.resolveSelectionSet(field.selectionSet, result, execContext);
                        }
                    })];
            });
        });
    };
    LocalState.prototype.resolveSubSelectedArray = function (field, result, execContext) {
        var _this = this;
        return Promise.all(result.map(function (item) {
            if (item === null) {
                return null;
            }
            if (Array.isArray(item)) {
                return _this.resolveSubSelectedArray(field, item, execContext);
            }
            if (field.selectionSet) {
                return _this.resolveSelectionSet(field.selectionSet, item, execContext);
            }
        }));
    };
    return LocalState;
}());

function multiplex(inner) {
    var observers = new Set();
    var sub = null;
    return new Observable(function (observer) {
        observers.add(observer);
        sub = sub || inner.subscribe({
            next: function (value) {
                observers.forEach(function (obs) { return obs.next && obs.next(value); });
            },
            error: function (error) {
                observers.forEach(function (obs) { return obs.error && obs.error(error); });
            },
            complete: function () {
                observers.forEach(function (obs) { return obs.complete && obs.complete(); });
            },
        });
        return function () {
            if (observers.delete(observer) && !observers.size && sub) {
                sub.unsubscribe();
                sub = null;
            }
        };
    });
}
function asyncMap(observable, mapFn) {
    return new Observable(function (observer) {
        var next = observer.next, error = observer.error, complete = observer.complete;
        var activeNextCount = 0;
        var completed = false;
        var handler = {
            next: function (value) {
                ++activeNextCount;
                new Promise(function (resolve) {
                    resolve(mapFn(value));
                }).then(function (result) {
                    --activeNextCount;
                    next && next.call(observer, result);
                    completed && handler.complete();
                }, function (e) {
                    --activeNextCount;
                    error && error.call(observer, e);
                });
            },
            error: function (e) {
                error && error.call(observer, e);
            },
            complete: function () {
                completed = true;
                if (!activeNextCount) {
                    complete && complete.call(observer);
                }
            },
        };
        var sub = observable.subscribe(handler);
        return function () { return sub.unsubscribe(); };
    });
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var QueryManager = (function () {
    function QueryManager(_a) {
        var link = _a.link, _b = _a.queryDeduplication, queryDeduplication = _b === void 0 ? false : _b, store = _a.store, _c = _a.onBroadcast, onBroadcast = _c === void 0 ? function () { return undefined; } : _c, _d = _a.ssrMode, ssrMode = _d === void 0 ? false : _d, _e = _a.clientAwareness, clientAwareness = _e === void 0 ? {} : _e, localState = _a.localState, assumeImmutableResults = _a.assumeImmutableResults;
        this.mutationStore = new MutationStore();
        this.queryStore = new QueryStore();
        this.clientAwareness = {};
        this.idCounter = 1;
        this.queries = new Map();
        this.fetchQueryRejectFns = new Map();
        this.transformCache = new (apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["canUseWeakMap"] ? WeakMap : Map)();
        this.inFlightLinkObservables = new Map();
        this.pollingInfoByQueryId = new Map();
        this.link = link;
        this.queryDeduplication = queryDeduplication;
        this.dataStore = store;
        this.onBroadcast = onBroadcast;
        this.clientAwareness = clientAwareness;
        this.localState = localState || new LocalState({ cache: store.getCache() });
        this.ssrMode = ssrMode;
        this.assumeImmutableResults = !!assumeImmutableResults;
    }
    QueryManager.prototype.stop = function () {
        var _this = this;
        this.queries.forEach(function (_info, queryId) {
            _this.stopQueryNoBroadcast(queryId);
        });
        this.fetchQueryRejectFns.forEach(function (reject) {
            reject( false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_4__["InvariantError"]('QueryManager stopped while query was in flight'));
        });
    };
    QueryManager.prototype.mutate = function (_a) {
        var mutation = _a.mutation, variables = _a.variables, optimisticResponse = _a.optimisticResponse, updateQueriesByName = _a.updateQueries, _b = _a.refetchQueries, refetchQueries = _b === void 0 ? [] : _b, _c = _a.awaitRefetchQueries, awaitRefetchQueries = _c === void 0 ? false : _c, updateWithProxyFn = _a.update, _d = _a.errorPolicy, errorPolicy = _d === void 0 ? 'none' : _d, fetchPolicy = _a.fetchPolicy, _e = _a.context, context = _e === void 0 ? {} : _e;
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var mutationId, generateUpdateQueriesInfo, self;
            var _this = this;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_f) {
                switch (_f.label) {
                    case 0:
                         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(mutation, 'mutation option is required. You must specify your GraphQL document in the mutation option.');
                         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(!fetchPolicy || fetchPolicy === 'no-cache', "Mutations only support a 'no-cache' fetchPolicy. If you don't want to disable the cache, remove your fetchPolicy setting to proceed with the default mutation behavior.");
                        mutationId = this.generateQueryId();
                        mutation = this.transform(mutation).document;
                        this.setQuery(mutationId, function () { return ({ document: mutation }); });
                        variables = this.getVariables(mutation, variables);
                        if (!this.transform(mutation).hasClientExports) return [3, 2];
                        return [4, this.localState.addExportedVariables(mutation, variables, context)];
                    case 1:
                        variables = _f.sent();
                        _f.label = 2;
                    case 2:
                        generateUpdateQueriesInfo = function () {
                            var ret = {};
                            if (updateQueriesByName) {
                                _this.queries.forEach(function (_a, queryId) {
                                    var observableQuery = _a.observableQuery;
                                    if (observableQuery) {
                                        var queryName = observableQuery.queryName;
                                        if (queryName &&
                                            hasOwnProperty.call(updateQueriesByName, queryName)) {
                                            ret[queryId] = {
                                                updater: updateQueriesByName[queryName],
                                                query: _this.queryStore.get(queryId),
                                            };
                                        }
                                    }
                                });
                            }
                            return ret;
                        };
                        this.mutationStore.initMutation(mutationId, mutation, variables);
                        this.dataStore.markMutationInit({
                            mutationId: mutationId,
                            document: mutation,
                            variables: variables,
                            updateQueries: generateUpdateQueriesInfo(),
                            update: updateWithProxyFn,
                            optimisticResponse: optimisticResponse,
                        });
                        this.broadcastQueries();
                        self = this;
                        return [2, new Promise(function (resolve, reject) {
                                var storeResult;
                                var error;
                                self.getObservableFromLink(mutation, Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, context), { optimisticResponse: optimisticResponse }), variables, false).subscribe({
                                    next: function (result) {
                                        if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["graphQLResultHasError"])(result) && errorPolicy === 'none') {
                                            error = new ApolloError({
                                                graphQLErrors: result.errors,
                                            });
                                            return;
                                        }
                                        self.mutationStore.markMutationResult(mutationId);
                                        if (fetchPolicy !== 'no-cache') {
                                            self.dataStore.markMutationResult({
                                                mutationId: mutationId,
                                                result: result,
                                                document: mutation,
                                                variables: variables,
                                                updateQueries: generateUpdateQueriesInfo(),
                                                update: updateWithProxyFn,
                                            });
                                        }
                                        storeResult = result;
                                    },
                                    error: function (err) {
                                        self.mutationStore.markMutationError(mutationId, err);
                                        self.dataStore.markMutationComplete({
                                            mutationId: mutationId,
                                            optimisticResponse: optimisticResponse,
                                        });
                                        self.broadcastQueries();
                                        self.setQuery(mutationId, function () { return ({ document: null }); });
                                        reject(new ApolloError({
                                            networkError: err,
                                        }));
                                    },
                                    complete: function () {
                                        if (error) {
                                            self.mutationStore.markMutationError(mutationId, error);
                                        }
                                        self.dataStore.markMutationComplete({
                                            mutationId: mutationId,
                                            optimisticResponse: optimisticResponse,
                                        });
                                        self.broadcastQueries();
                                        if (error) {
                                            reject(error);
                                            return;
                                        }
                                        if (typeof refetchQueries === 'function') {
                                            refetchQueries = refetchQueries(storeResult);
                                        }
                                        var refetchQueryPromises = [];
                                        if (isNonEmptyArray(refetchQueries)) {
                                            refetchQueries.forEach(function (refetchQuery) {
                                                if (typeof refetchQuery === 'string') {
                                                    self.queries.forEach(function (_a) {
                                                        var observableQuery = _a.observableQuery;
                                                        if (observableQuery &&
                                                            observableQuery.queryName === refetchQuery) {
                                                            refetchQueryPromises.push(observableQuery.refetch());
                                                        }
                                                    });
                                                }
                                                else {
                                                    var queryOptions = {
                                                        query: refetchQuery.query,
                                                        variables: refetchQuery.variables,
                                                        fetchPolicy: 'network-only',
                                                    };
                                                    if (refetchQuery.context) {
                                                        queryOptions.context = refetchQuery.context;
                                                    }
                                                    refetchQueryPromises.push(self.query(queryOptions));
                                                }
                                            });
                                        }
                                        Promise.all(awaitRefetchQueries ? refetchQueryPromises : []).then(function () {
                                            self.setQuery(mutationId, function () { return ({ document: null }); });
                                            if (errorPolicy === 'ignore' &&
                                                storeResult &&
                                                Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["graphQLResultHasError"])(storeResult)) {
                                                delete storeResult.errors;
                                            }
                                            resolve(storeResult);
                                        });
                                    },
                                });
                            })];
                }
            });
        });
    };
    QueryManager.prototype.fetchQuery = function (queryId, options, fetchType, fetchMoreForQueryId) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var _a, metadata, _b, fetchPolicy, _c, context, query, variables, storeResult, isNetworkOnly, needToFetch, _d, complete, result, shouldFetch, requestId, cancel, networkResult;
            var _this = this;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = options.metadata, metadata = _a === void 0 ? null : _a, _b = options.fetchPolicy, fetchPolicy = _b === void 0 ? 'cache-first' : _b, _c = options.context, context = _c === void 0 ? {} : _c;
                        query = this.transform(options.query).document;
                        variables = this.getVariables(query, options.variables);
                        if (!this.transform(query).hasClientExports) return [3, 2];
                        return [4, this.localState.addExportedVariables(query, variables, context)];
                    case 1:
                        variables = _e.sent();
                        _e.label = 2;
                    case 2:
                        options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options), { variables: variables });
                        isNetworkOnly = fetchPolicy === 'network-only' || fetchPolicy === 'no-cache';
                        needToFetch = isNetworkOnly;
                        if (!isNetworkOnly) {
                            _d = this.dataStore.getCache().diff({
                                query: query,
                                variables: variables,
                                returnPartialData: true,
                                optimistic: false,
                            }), complete = _d.complete, result = _d.result;
                            needToFetch = !complete || fetchPolicy === 'cache-and-network';
                            storeResult = result;
                        }
                        shouldFetch = needToFetch && fetchPolicy !== 'cache-only' && fetchPolicy !== 'standby';
                        if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["hasDirectives"])(['live'], query))
                            shouldFetch = true;
                        requestId = this.idCounter++;
                        cancel = fetchPolicy !== 'no-cache'
                            ? this.updateQueryWatch(queryId, query, options)
                            : undefined;
                        this.setQuery(queryId, function () { return ({
                            document: query,
                            lastRequestId: requestId,
                            invalidated: true,
                            cancel: cancel,
                        }); });
                        this.invalidate(fetchMoreForQueryId);
                        this.queryStore.initQuery({
                            queryId: queryId,
                            document: query,
                            storePreviousVariables: shouldFetch,
                            variables: variables,
                            isPoll: fetchType === FetchType.poll,
                            isRefetch: fetchType === FetchType.refetch,
                            metadata: metadata,
                            fetchMoreForQueryId: fetchMoreForQueryId,
                        });
                        this.broadcastQueries();
                        if (shouldFetch) {
                            networkResult = this.fetchRequest({
                                requestId: requestId,
                                queryId: queryId,
                                document: query,
                                options: options,
                                fetchMoreForQueryId: fetchMoreForQueryId,
                            }).catch(function (error) {
                                if (isApolloError(error)) {
                                    throw error;
                                }
                                else {
                                    if (requestId >= _this.getQuery(queryId).lastRequestId) {
                                        _this.queryStore.markQueryError(queryId, error, fetchMoreForQueryId);
                                        _this.invalidate(queryId);
                                        _this.invalidate(fetchMoreForQueryId);
                                        _this.broadcastQueries();
                                    }
                                    throw new ApolloError({ networkError: error });
                                }
                            });
                            if (fetchPolicy !== 'cache-and-network') {
                                return [2, networkResult];
                            }
                            networkResult.catch(function () { });
                        }
                        this.queryStore.markQueryResultClient(queryId, !shouldFetch);
                        this.invalidate(queryId);
                        this.invalidate(fetchMoreForQueryId);
                        if (this.transform(query).hasForcedResolvers) {
                            return [2, this.localState.runResolvers({
                                    document: query,
                                    remoteResult: { data: storeResult },
                                    context: context,
                                    variables: variables,
                                    onlyRunForcedResolvers: true,
                                }).then(function (result) {
                                    _this.markQueryResult(queryId, result, options, fetchMoreForQueryId);
                                    _this.broadcastQueries();
                                    return result;
                                })];
                        }
                        this.broadcastQueries();
                        return [2, { data: storeResult }];
                }
            });
        });
    };
    QueryManager.prototype.markQueryResult = function (queryId, result, _a, fetchMoreForQueryId) {
        var fetchPolicy = _a.fetchPolicy, variables = _a.variables, errorPolicy = _a.errorPolicy;
        if (fetchPolicy === 'no-cache') {
            this.setQuery(queryId, function () { return ({
                newData: { result: result.data, complete: true },
            }); });
        }
        else {
            this.dataStore.markQueryResult(result, this.getQuery(queryId).document, variables, fetchMoreForQueryId, errorPolicy === 'ignore' || errorPolicy === 'all');
        }
    };
    QueryManager.prototype.queryListenerForObserver = function (queryId, options, observer) {
        var _this = this;
        function invoke(method, argument) {
            if (observer[method]) {
                try {
                    observer[method](argument);
                }
                catch (e) {
                     false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].error(e);
                }
            }
            else if (method === 'error') {
                 false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].error(argument);
            }
        }
        return function (queryStoreValue, newData) {
            _this.invalidate(queryId, false);
            if (!queryStoreValue)
                return;
            var _a = _this.getQuery(queryId), observableQuery = _a.observableQuery, document = _a.document;
            var fetchPolicy = observableQuery
                ? observableQuery.options.fetchPolicy
                : options.fetchPolicy;
            if (fetchPolicy === 'standby')
                return;
            var loading = isNetworkRequestInFlight(queryStoreValue.networkStatus);
            var lastResult = observableQuery && observableQuery.getLastResult();
            var networkStatusChanged = !!(lastResult &&
                lastResult.networkStatus !== queryStoreValue.networkStatus);
            var shouldNotifyIfLoading = options.returnPartialData ||
                (!newData && queryStoreValue.previousVariables) ||
                (networkStatusChanged && options.notifyOnNetworkStatusChange) ||
                fetchPolicy === 'cache-only' ||
                fetchPolicy === 'cache-and-network';
            if (loading && !shouldNotifyIfLoading) {
                return;
            }
            var hasGraphQLErrors = isNonEmptyArray(queryStoreValue.graphQLErrors);
            var errorPolicy = observableQuery
                && observableQuery.options.errorPolicy
                || options.errorPolicy
                || 'none';
            if (errorPolicy === 'none' && hasGraphQLErrors || queryStoreValue.networkError) {
                return invoke('error', new ApolloError({
                    graphQLErrors: queryStoreValue.graphQLErrors,
                    networkError: queryStoreValue.networkError,
                }));
            }
            try {
                var data = void 0;
                var isMissing = void 0;
                if (newData) {
                    if (fetchPolicy !== 'no-cache' && fetchPolicy !== 'network-only') {
                        _this.setQuery(queryId, function () { return ({ newData: null }); });
                    }
                    data = newData.result;
                    isMissing = !newData.complete;
                }
                else {
                    var lastError = observableQuery && observableQuery.getLastError();
                    var errorStatusChanged = errorPolicy !== 'none' &&
                        (lastError && lastError.graphQLErrors) !==
                            queryStoreValue.graphQLErrors;
                    if (lastResult && lastResult.data && !errorStatusChanged) {
                        data = lastResult.data;
                        isMissing = false;
                    }
                    else {
                        var diffResult = _this.dataStore.getCache().diff({
                            query: document,
                            variables: queryStoreValue.previousVariables ||
                                queryStoreValue.variables,
                            returnPartialData: true,
                            optimistic: true,
                        });
                        data = diffResult.result;
                        isMissing = !diffResult.complete;
                    }
                }
                var stale = isMissing && !(options.returnPartialData ||
                    fetchPolicy === 'cache-only');
                var resultFromStore = {
                    data: stale ? lastResult && lastResult.data : data,
                    loading: loading,
                    networkStatus: queryStoreValue.networkStatus,
                    stale: stale,
                };
                if (errorPolicy === 'all' && hasGraphQLErrors) {
                    resultFromStore.errors = queryStoreValue.graphQLErrors;
                }
                invoke('next', resultFromStore);
            }
            catch (networkError) {
                invoke('error', new ApolloError({ networkError: networkError }));
            }
        };
    };
    QueryManager.prototype.transform = function (document) {
        var transformCache = this.transformCache;
        if (!transformCache.has(document)) {
            var cache = this.dataStore.getCache();
            var transformed = cache.transformDocument(document);
            var forLink = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["removeConnectionDirectiveFromDocument"])(cache.transformForLink(transformed));
            var clientQuery = this.localState.clientQuery(transformed);
            var serverQuery = this.localState.serverQuery(forLink);
            var cacheEntry_1 = {
                document: transformed,
                hasClientExports: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["hasClientExports"])(transformed),
                hasForcedResolvers: this.localState.shouldForceResolvers(transformed),
                clientQuery: clientQuery,
                serverQuery: serverQuery,
                defaultVars: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["getDefaultValues"])(Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["getOperationDefinition"])(transformed)),
            };
            var add = function (doc) {
                if (doc && !transformCache.has(doc)) {
                    transformCache.set(doc, cacheEntry_1);
                }
            };
            add(document);
            add(transformed);
            add(clientQuery);
            add(serverQuery);
        }
        return transformCache.get(document);
    };
    QueryManager.prototype.getVariables = function (document, variables) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.transform(document).defaultVars), variables);
    };
    QueryManager.prototype.watchQuery = function (options, shouldSubscribe) {
        if (shouldSubscribe === void 0) { shouldSubscribe = true; }
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(options.fetchPolicy !== 'standby', 'client.watchQuery cannot be called with fetchPolicy set to "standby"');
        options.variables = this.getVariables(options.query, options.variables);
        if (typeof options.notifyOnNetworkStatusChange === 'undefined') {
            options.notifyOnNetworkStatusChange = false;
        }
        var transformedOptions = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options);
        return new ObservableQuery({
            queryManager: this,
            options: transformedOptions,
            shouldSubscribe: shouldSubscribe,
        });
    };
    QueryManager.prototype.query = function (options) {
        var _this = this;
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(options.query, 'query option is required. You must specify your GraphQL document ' +
            'in the query option.');
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(options.query.kind === 'Document', 'You must wrap the query string in a "gql" tag.');
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(!options.returnPartialData, 'returnPartialData option only supported on watchQuery.');
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(!options.pollInterval, 'pollInterval option only supported on watchQuery.');
        return new Promise(function (resolve, reject) {
            var watchedQuery = _this.watchQuery(options, false);
            _this.fetchQueryRejectFns.set("query:" + watchedQuery.queryId, reject);
            watchedQuery
                .result()
                .then(resolve, reject)
                .then(function () {
                return _this.fetchQueryRejectFns.delete("query:" + watchedQuery.queryId);
            });
        });
    };
    QueryManager.prototype.generateQueryId = function () {
        return String(this.idCounter++);
    };
    QueryManager.prototype.stopQueryInStore = function (queryId) {
        this.stopQueryInStoreNoBroadcast(queryId);
        this.broadcastQueries();
    };
    QueryManager.prototype.stopQueryInStoreNoBroadcast = function (queryId) {
        this.stopPollingQuery(queryId);
        this.queryStore.stopQuery(queryId);
        this.invalidate(queryId);
    };
    QueryManager.prototype.addQueryListener = function (queryId, listener) {
        this.setQuery(queryId, function (_a) {
            var listeners = _a.listeners;
            listeners.add(listener);
            return { invalidated: false };
        });
    };
    QueryManager.prototype.updateQueryWatch = function (queryId, document, options) {
        var _this = this;
        var cancel = this.getQuery(queryId).cancel;
        if (cancel)
            cancel();
        var previousResult = function () {
            var previousResult = null;
            var observableQuery = _this.getQuery(queryId).observableQuery;
            if (observableQuery) {
                var lastResult = observableQuery.getLastResult();
                if (lastResult) {
                    previousResult = lastResult.data;
                }
            }
            return previousResult;
        };
        return this.dataStore.getCache().watch({
            query: document,
            variables: options.variables,
            optimistic: true,
            previousResult: previousResult,
            callback: function (newData) {
                _this.setQuery(queryId, function () { return ({ invalidated: true, newData: newData }); });
            },
        });
    };
    QueryManager.prototype.addObservableQuery = function (queryId, observableQuery) {
        this.setQuery(queryId, function () { return ({ observableQuery: observableQuery }); });
    };
    QueryManager.prototype.removeObservableQuery = function (queryId) {
        var cancel = this.getQuery(queryId).cancel;
        this.setQuery(queryId, function () { return ({ observableQuery: null }); });
        if (cancel)
            cancel();
    };
    QueryManager.prototype.clearStore = function () {
        this.fetchQueryRejectFns.forEach(function (reject) {
            reject( false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_4__["InvariantError"]('Store reset while query was in flight (not completed in link chain)'));
        });
        var resetIds = [];
        this.queries.forEach(function (_a, queryId) {
            var observableQuery = _a.observableQuery;
            if (observableQuery)
                resetIds.push(queryId);
        });
        this.queryStore.reset(resetIds);
        this.mutationStore.reset();
        return this.dataStore.reset();
    };
    QueryManager.prototype.resetStore = function () {
        var _this = this;
        return this.clearStore().then(function () {
            return _this.reFetchObservableQueries();
        });
    };
    QueryManager.prototype.reFetchObservableQueries = function (includeStandby) {
        var _this = this;
        if (includeStandby === void 0) { includeStandby = false; }
        var observableQueryPromises = [];
        this.queries.forEach(function (_a, queryId) {
            var observableQuery = _a.observableQuery;
            if (observableQuery) {
                var fetchPolicy = observableQuery.options.fetchPolicy;
                observableQuery.resetLastResults();
                if (fetchPolicy !== 'cache-only' &&
                    (includeStandby || fetchPolicy !== 'standby')) {
                    observableQueryPromises.push(observableQuery.refetch());
                }
                _this.setQuery(queryId, function () { return ({ newData: null }); });
                _this.invalidate(queryId);
            }
        });
        this.broadcastQueries();
        return Promise.all(observableQueryPromises);
    };
    QueryManager.prototype.observeQuery = function (queryId, options, observer) {
        this.addQueryListener(queryId, this.queryListenerForObserver(queryId, options, observer));
        return this.fetchQuery(queryId, options);
    };
    QueryManager.prototype.startQuery = function (queryId, options, listener) {
         false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].warn("The QueryManager.startQuery method has been deprecated");
        this.addQueryListener(queryId, listener);
        this.fetchQuery(queryId, options)
            .catch(function () { return undefined; });
        return queryId;
    };
    QueryManager.prototype.startGraphQLSubscription = function (_a) {
        var _this = this;
        var query = _a.query, fetchPolicy = _a.fetchPolicy, variables = _a.variables;
        query = this.transform(query).document;
        variables = this.getVariables(query, variables);
        var makeObservable = function (variables) {
            return _this.getObservableFromLink(query, {}, variables, false).map(function (result) {
                if (!fetchPolicy || fetchPolicy !== 'no-cache') {
                    _this.dataStore.markSubscriptionResult(result, query, variables);
                    _this.broadcastQueries();
                }
                if (Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["graphQLResultHasError"])(result)) {
                    throw new ApolloError({
                        graphQLErrors: result.errors,
                    });
                }
                return result;
            });
        };
        if (this.transform(query).hasClientExports) {
            var observablePromise_1 = this.localState.addExportedVariables(query, variables).then(makeObservable);
            return new Observable(function (observer) {
                var sub = null;
                observablePromise_1.then(function (observable) { return sub = observable.subscribe(observer); }, observer.error);
                return function () { return sub && sub.unsubscribe(); };
            });
        }
        return makeObservable(variables);
    };
    QueryManager.prototype.stopQuery = function (queryId) {
        this.stopQueryNoBroadcast(queryId);
        this.broadcastQueries();
    };
    QueryManager.prototype.stopQueryNoBroadcast = function (queryId) {
        this.stopQueryInStoreNoBroadcast(queryId);
        this.removeQuery(queryId);
    };
    QueryManager.prototype.removeQuery = function (queryId) {
        this.fetchQueryRejectFns.delete("query:" + queryId);
        this.fetchQueryRejectFns.delete("fetchRequest:" + queryId);
        this.getQuery(queryId).subscriptions.forEach(function (x) { return x.unsubscribe(); });
        this.queries.delete(queryId);
    };
    QueryManager.prototype.getCurrentQueryResult = function (observableQuery, optimistic) {
        if (optimistic === void 0) { optimistic = true; }
        var _a = observableQuery.options, variables = _a.variables, query = _a.query, fetchPolicy = _a.fetchPolicy, returnPartialData = _a.returnPartialData;
        var lastResult = observableQuery.getLastResult();
        var newData = this.getQuery(observableQuery.queryId).newData;
        if (newData && newData.complete) {
            return { data: newData.result, partial: false };
        }
        if (fetchPolicy === 'no-cache' || fetchPolicy === 'network-only') {
            return { data: undefined, partial: false };
        }
        var _b = this.dataStore.getCache().diff({
            query: query,
            variables: variables,
            previousResult: lastResult ? lastResult.data : undefined,
            returnPartialData: true,
            optimistic: optimistic,
        }), result = _b.result, complete = _b.complete;
        return {
            data: (complete || returnPartialData) ? result : void 0,
            partial: !complete,
        };
    };
    QueryManager.prototype.getQueryWithPreviousResult = function (queryIdOrObservable) {
        var observableQuery;
        if (typeof queryIdOrObservable === 'string') {
            var foundObserveableQuery = this.getQuery(queryIdOrObservable).observableQuery;
             false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(foundObserveableQuery, "ObservableQuery with this id doesn't exist: " + queryIdOrObservable);
            observableQuery = foundObserveableQuery;
        }
        else {
            observableQuery = queryIdOrObservable;
        }
        var _a = observableQuery.options, variables = _a.variables, query = _a.query;
        return {
            previousResult: this.getCurrentQueryResult(observableQuery, false).data,
            variables: variables,
            document: query,
        };
    };
    QueryManager.prototype.broadcastQueries = function () {
        var _this = this;
        this.onBroadcast();
        this.queries.forEach(function (info, id) {
            if (info.invalidated) {
                info.listeners.forEach(function (listener) {
                    if (listener) {
                        listener(_this.queryStore.get(id), info.newData);
                    }
                });
            }
        });
    };
    QueryManager.prototype.getLocalState = function () {
        return this.localState;
    };
    QueryManager.prototype.getObservableFromLink = function (query, context, variables, deduplication) {
        var _this = this;
        if (deduplication === void 0) { deduplication = this.queryDeduplication; }
        var observable;
        var serverQuery = this.transform(query).serverQuery;
        if (serverQuery) {
            var _a = this, inFlightLinkObservables_1 = _a.inFlightLinkObservables, link = _a.link;
            var operation = {
                query: serverQuery,
                variables: variables,
                operationName: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["getOperationName"])(serverQuery) || void 0,
                context: this.prepareContext(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, context), { forceFetch: !deduplication })),
            };
            context = operation.context;
            if (deduplication) {
                var byVariables_1 = inFlightLinkObservables_1.get(serverQuery) || new Map();
                inFlightLinkObservables_1.set(serverQuery, byVariables_1);
                var varJson_1 = JSON.stringify(variables);
                observable = byVariables_1.get(varJson_1);
                if (!observable) {
                    byVariables_1.set(varJson_1, observable = multiplex(Object(apollo_link__WEBPACK_IMPORTED_MODULE_2__["execute"])(link, operation)));
                    var cleanup = function () {
                        byVariables_1.delete(varJson_1);
                        if (!byVariables_1.size)
                            inFlightLinkObservables_1.delete(serverQuery);
                        cleanupSub_1.unsubscribe();
                    };
                    var cleanupSub_1 = observable.subscribe({
                        next: cleanup,
                        error: cleanup,
                        complete: cleanup,
                    });
                }
            }
            else {
                observable = multiplex(Object(apollo_link__WEBPACK_IMPORTED_MODULE_2__["execute"])(link, operation));
            }
        }
        else {
            observable = Observable.of({ data: {} });
            context = this.prepareContext(context);
        }
        var clientQuery = this.transform(query).clientQuery;
        if (clientQuery) {
            observable = asyncMap(observable, function (result) {
                return _this.localState.runResolvers({
                    document: clientQuery,
                    remoteResult: result,
                    context: context,
                    variables: variables,
                });
            });
        }
        return observable;
    };
    QueryManager.prototype.fetchRequest = function (_a) {
        var _this = this;
        var requestId = _a.requestId, queryId = _a.queryId, document = _a.document, options = _a.options, fetchMoreForQueryId = _a.fetchMoreForQueryId;
        var variables = options.variables, _b = options.errorPolicy, errorPolicy = _b === void 0 ? 'none' : _b, fetchPolicy = options.fetchPolicy;
        var resultFromStore;
        var errorsFromStore;
        return new Promise(function (resolve, reject) {
            var observable = _this.getObservableFromLink(document, options.context, variables);
            var fqrfId = "fetchRequest:" + queryId;
            _this.fetchQueryRejectFns.set(fqrfId, reject);
            var cleanup = function () {
                _this.fetchQueryRejectFns.delete(fqrfId);
                _this.setQuery(queryId, function (_a) {
                    var subscriptions = _a.subscriptions;
                    subscriptions.delete(subscription);
                });
            };
            var subscription = observable.map(function (result) {
                if (requestId >= _this.getQuery(queryId).lastRequestId) {
                    _this.markQueryResult(queryId, result, options, fetchMoreForQueryId);
                    _this.queryStore.markQueryResult(queryId, result, fetchMoreForQueryId);
                    _this.invalidate(queryId);
                    _this.invalidate(fetchMoreForQueryId);
                    _this.broadcastQueries();
                }
                if (errorPolicy === 'none' && isNonEmptyArray(result.errors)) {
                    return reject(new ApolloError({
                        graphQLErrors: result.errors,
                    }));
                }
                if (errorPolicy === 'all') {
                    errorsFromStore = result.errors;
                }
                if (fetchMoreForQueryId || fetchPolicy === 'no-cache') {
                    resultFromStore = result.data;
                }
                else {
                    var _a = _this.dataStore.getCache().diff({
                        variables: variables,
                        query: document,
                        optimistic: false,
                        returnPartialData: true,
                    }), result_1 = _a.result, complete = _a.complete;
                    if (complete || options.returnPartialData) {
                        resultFromStore = result_1;
                    }
                }
            }).subscribe({
                error: function (error) {
                    cleanup();
                    reject(error);
                },
                complete: function () {
                    cleanup();
                    resolve({
                        data: resultFromStore,
                        errors: errorsFromStore,
                        loading: false,
                        networkStatus: NetworkStatus.ready,
                        stale: false,
                    });
                },
            });
            _this.setQuery(queryId, function (_a) {
                var subscriptions = _a.subscriptions;
                subscriptions.add(subscription);
            });
        });
    };
    QueryManager.prototype.getQuery = function (queryId) {
        return (this.queries.get(queryId) || {
            listeners: new Set(),
            invalidated: false,
            document: null,
            newData: null,
            lastRequestId: 1,
            observableQuery: null,
            subscriptions: new Set(),
        });
    };
    QueryManager.prototype.setQuery = function (queryId, updater) {
        var prev = this.getQuery(queryId);
        var newInfo = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, prev), updater(prev));
        this.queries.set(queryId, newInfo);
    };
    QueryManager.prototype.invalidate = function (queryId, invalidated) {
        if (invalidated === void 0) { invalidated = true; }
        if (queryId) {
            this.setQuery(queryId, function () { return ({ invalidated: invalidated }); });
        }
    };
    QueryManager.prototype.prepareContext = function (context) {
        if (context === void 0) { context = {}; }
        var newContext = this.localState.prepareContext(context);
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, newContext), { clientAwareness: this.clientAwareness });
    };
    QueryManager.prototype.checkInFlight = function (queryId) {
        var query = this.queryStore.get(queryId);
        return (query &&
            query.networkStatus !== NetworkStatus.ready &&
            query.networkStatus !== NetworkStatus.error);
    };
    QueryManager.prototype.startPollingQuery = function (options, queryId, listener) {
        var _this = this;
        var pollInterval = options.pollInterval;
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(pollInterval, 'Attempted to start a polling query without a polling interval.');
        if (!this.ssrMode) {
            var info = this.pollingInfoByQueryId.get(queryId);
            if (!info) {
                this.pollingInfoByQueryId.set(queryId, (info = {}));
            }
            info.interval = pollInterval;
            info.options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options), { fetchPolicy: 'network-only' });
            var maybeFetch_1 = function () {
                var info = _this.pollingInfoByQueryId.get(queryId);
                if (info) {
                    if (_this.checkInFlight(queryId)) {
                        poll_1();
                    }
                    else {
                        _this.fetchQuery(queryId, info.options, FetchType.poll).then(poll_1, poll_1);
                    }
                }
            };
            var poll_1 = function () {
                var info = _this.pollingInfoByQueryId.get(queryId);
                if (info) {
                    clearTimeout(info.timeout);
                    info.timeout = setTimeout(maybeFetch_1, info.interval);
                }
            };
            if (listener) {
                this.addQueryListener(queryId, listener);
            }
            poll_1();
        }
        return queryId;
    };
    QueryManager.prototype.stopPollingQuery = function (queryId) {
        this.pollingInfoByQueryId.delete(queryId);
    };
    return QueryManager;
}());

var DataStore = (function () {
    function DataStore(initialCache) {
        this.cache = initialCache;
    }
    DataStore.prototype.getCache = function () {
        return this.cache;
    };
    DataStore.prototype.markQueryResult = function (result, document, variables, fetchMoreForQueryId, ignoreErrors) {
        if (ignoreErrors === void 0) { ignoreErrors = false; }
        var writeWithErrors = !Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["graphQLResultHasError"])(result);
        if (ignoreErrors && Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["graphQLResultHasError"])(result) && result.data) {
            writeWithErrors = true;
        }
        if (!fetchMoreForQueryId && writeWithErrors) {
            this.cache.write({
                result: result.data,
                dataId: 'ROOT_QUERY',
                query: document,
                variables: variables,
            });
        }
    };
    DataStore.prototype.markSubscriptionResult = function (result, document, variables) {
        if (!Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["graphQLResultHasError"])(result)) {
            this.cache.write({
                result: result.data,
                dataId: 'ROOT_SUBSCRIPTION',
                query: document,
                variables: variables,
            });
        }
    };
    DataStore.prototype.markMutationInit = function (mutation) {
        var _this = this;
        if (mutation.optimisticResponse) {
            var optimistic_1;
            if (typeof mutation.optimisticResponse === 'function') {
                optimistic_1 = mutation.optimisticResponse(mutation.variables);
            }
            else {
                optimistic_1 = mutation.optimisticResponse;
            }
            this.cache.recordOptimisticTransaction(function (c) {
                var orig = _this.cache;
                _this.cache = c;
                try {
                    _this.markMutationResult({
                        mutationId: mutation.mutationId,
                        result: { data: optimistic_1 },
                        document: mutation.document,
                        variables: mutation.variables,
                        updateQueries: mutation.updateQueries,
                        update: mutation.update,
                    });
                }
                finally {
                    _this.cache = orig;
                }
            }, mutation.mutationId);
        }
    };
    DataStore.prototype.markMutationResult = function (mutation) {
        var _this = this;
        if (!Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["graphQLResultHasError"])(mutation.result)) {
            var cacheWrites_1 = [{
                    result: mutation.result.data,
                    dataId: 'ROOT_MUTATION',
                    query: mutation.document,
                    variables: mutation.variables,
                }];
            var updateQueries_1 = mutation.updateQueries;
            if (updateQueries_1) {
                Object.keys(updateQueries_1).forEach(function (id) {
                    var _a = updateQueries_1[id], query = _a.query, updater = _a.updater;
                    var _b = _this.cache.diff({
                        query: query.document,
                        variables: query.variables,
                        returnPartialData: true,
                        optimistic: false,
                    }), currentQueryResult = _b.result, complete = _b.complete;
                    if (complete) {
                        var nextQueryResult = Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["tryFunctionOrLogError"])(function () {
                            return updater(currentQueryResult, {
                                mutationResult: mutation.result,
                                queryName: Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["getOperationName"])(query.document) || undefined,
                                queryVariables: query.variables,
                            });
                        });
                        if (nextQueryResult) {
                            cacheWrites_1.push({
                                result: nextQueryResult,
                                dataId: 'ROOT_QUERY',
                                query: query.document,
                                variables: query.variables,
                            });
                        }
                    }
                });
            }
            this.cache.performTransaction(function (c) {
                cacheWrites_1.forEach(function (write) { return c.write(write); });
                var update = mutation.update;
                if (update) {
                    Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_1__["tryFunctionOrLogError"])(function () { return update(c, mutation.result); });
                }
            });
        }
    };
    DataStore.prototype.markMutationComplete = function (_a) {
        var mutationId = _a.mutationId, optimisticResponse = _a.optimisticResponse;
        if (optimisticResponse) {
            this.cache.removeOptimistic(mutationId);
        }
    };
    DataStore.prototype.markUpdateQueryResult = function (document, variables, newResult) {
        this.cache.write({
            result: newResult,
            dataId: 'ROOT_QUERY',
            variables: variables,
            query: document,
        });
    };
    DataStore.prototype.reset = function () {
        return this.cache.reset();
    };
    return DataStore;
}());

var version = "2.6.10";

var hasSuggestedDevtools = false;
var ApolloClient = (function () {
    function ApolloClient(options) {
        var _this = this;
        this.defaultOptions = {};
        this.resetStoreCallbacks = [];
        this.clearStoreCallbacks = [];
        var cache = options.cache, _a = options.ssrMode, ssrMode = _a === void 0 ? false : _a, _b = options.ssrForceFetchDelay, ssrForceFetchDelay = _b === void 0 ? 0 : _b, connectToDevTools = options.connectToDevTools, _c = options.queryDeduplication, queryDeduplication = _c === void 0 ? true : _c, defaultOptions = options.defaultOptions, _d = options.assumeImmutableResults, assumeImmutableResults = _d === void 0 ? false : _d, resolvers = options.resolvers, typeDefs = options.typeDefs, fragmentMatcher = options.fragmentMatcher, clientAwarenessName = options.name, clientAwarenessVersion = options.version;
        var link = options.link;
        if (!link && resolvers) {
            link = apollo_link__WEBPACK_IMPORTED_MODULE_2__["ApolloLink"].empty();
        }
        if (!link || !cache) {
            throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_4__["InvariantError"]("In order to initialize Apollo Client, you must specify 'link' and 'cache' properties in the options object.\n" +
                "These options are part of the upgrade requirements when migrating from Apollo Client 1.x to Apollo Client 2.x.\n" +
                "For more information, please visit: https://www.apollographql.com/docs/tutorial/client.html#apollo-client-setup");
        }
        this.link = link;
        this.cache = cache;
        this.store = new DataStore(cache);
        this.disableNetworkFetches = ssrMode || ssrForceFetchDelay > 0;
        this.queryDeduplication = queryDeduplication;
        this.defaultOptions = defaultOptions || {};
        this.typeDefs = typeDefs;
        if (ssrForceFetchDelay) {
            setTimeout(function () { return (_this.disableNetworkFetches = false); }, ssrForceFetchDelay);
        }
        this.watchQuery = this.watchQuery.bind(this);
        this.query = this.query.bind(this);
        this.mutate = this.mutate.bind(this);
        this.resetStore = this.resetStore.bind(this);
        this.reFetchObservableQueries = this.reFetchObservableQueries.bind(this);
        var defaultConnectToDevTools =  true &&
            typeof window !== 'undefined' &&
            !window.__APOLLO_CLIENT__;
        if (typeof connectToDevTools === 'undefined'
            ? defaultConnectToDevTools
            : connectToDevTools && typeof window !== 'undefined') {
            window.__APOLLO_CLIENT__ = this;
        }
        if (!hasSuggestedDevtools && "development" !== 'production') {
            hasSuggestedDevtools = true;
            if (typeof window !== 'undefined' &&
                window.document &&
                window.top === window.self) {
                if (typeof window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
                    if (window.navigator &&
                        window.navigator.userAgent &&
                        window.navigator.userAgent.indexOf('Chrome') > -1) {
                        console.debug('Download the Apollo DevTools ' +
                            'for a better development experience: ' +
                            'https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm');
                    }
                }
            }
        }
        this.version = version;
        this.localState = new LocalState({
            cache: cache,
            client: this,
            resolvers: resolvers,
            fragmentMatcher: fragmentMatcher,
        });
        this.queryManager = new QueryManager({
            link: this.link,
            store: this.store,
            queryDeduplication: queryDeduplication,
            ssrMode: ssrMode,
            clientAwareness: {
                name: clientAwarenessName,
                version: clientAwarenessVersion,
            },
            localState: this.localState,
            assumeImmutableResults: assumeImmutableResults,
            onBroadcast: function () {
                if (_this.devToolsHookCb) {
                    _this.devToolsHookCb({
                        action: {},
                        state: {
                            queries: _this.queryManager.queryStore.getStore(),
                            mutations: _this.queryManager.mutationStore.getStore(),
                        },
                        dataWithOptimisticResults: _this.cache.extract(true),
                    });
                }
            },
        });
    }
    ApolloClient.prototype.stop = function () {
        this.queryManager.stop();
    };
    ApolloClient.prototype.watchQuery = function (options) {
        if (this.defaultOptions.watchQuery) {
            options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.defaultOptions.watchQuery), options);
        }
        if (this.disableNetworkFetches &&
            (options.fetchPolicy === 'network-only' ||
                options.fetchPolicy === 'cache-and-network')) {
            options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options), { fetchPolicy: 'cache-first' });
        }
        return this.queryManager.watchQuery(options);
    };
    ApolloClient.prototype.query = function (options) {
        if (this.defaultOptions.query) {
            options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.defaultOptions.query), options);
        }
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"])(options.fetchPolicy !== 'cache-and-network', 'The cache-and-network fetchPolicy does not work with client.query, because ' +
            'client.query can only return a single result. Please use client.watchQuery ' +
            'to receive multiple results from the cache and the network, or consider ' +
            'using a different fetchPolicy, such as cache-first or network-only.');
        if (this.disableNetworkFetches && options.fetchPolicy === 'network-only') {
            options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options), { fetchPolicy: 'cache-first' });
        }
        return this.queryManager.query(options);
    };
    ApolloClient.prototype.mutate = function (options) {
        if (this.defaultOptions.mutate) {
            options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, this.defaultOptions.mutate), options);
        }
        return this.queryManager.mutate(options);
    };
    ApolloClient.prototype.subscribe = function (options) {
        return this.queryManager.startGraphQLSubscription(options);
    };
    ApolloClient.prototype.readQuery = function (options, optimistic) {
        if (optimistic === void 0) { optimistic = false; }
        return this.cache.readQuery(options, optimistic);
    };
    ApolloClient.prototype.readFragment = function (options, optimistic) {
        if (optimistic === void 0) { optimistic = false; }
        return this.cache.readFragment(options, optimistic);
    };
    ApolloClient.prototype.writeQuery = function (options) {
        var result = this.cache.writeQuery(options);
        this.queryManager.broadcastQueries();
        return result;
    };
    ApolloClient.prototype.writeFragment = function (options) {
        var result = this.cache.writeFragment(options);
        this.queryManager.broadcastQueries();
        return result;
    };
    ApolloClient.prototype.writeData = function (options) {
        var result = this.cache.writeData(options);
        this.queryManager.broadcastQueries();
        return result;
    };
    ApolloClient.prototype.__actionHookForDevTools = function (cb) {
        this.devToolsHookCb = cb;
    };
    ApolloClient.prototype.__requestRaw = function (payload) {
        return Object(apollo_link__WEBPACK_IMPORTED_MODULE_2__["execute"])(this.link, payload);
    };
    ApolloClient.prototype.initQueryManager = function () {
         false || ts_invariant__WEBPACK_IMPORTED_MODULE_4__["invariant"].warn('Calling the initQueryManager method is no longer necessary, ' +
            'and it will be removed from ApolloClient in version 3.0.');
        return this.queryManager;
    };
    ApolloClient.prototype.resetStore = function () {
        var _this = this;
        return Promise.resolve()
            .then(function () { return _this.queryManager.clearStore(); })
            .then(function () { return Promise.all(_this.resetStoreCallbacks.map(function (fn) { return fn(); })); })
            .then(function () { return _this.reFetchObservableQueries(); });
    };
    ApolloClient.prototype.clearStore = function () {
        var _this = this;
        return Promise.resolve()
            .then(function () { return _this.queryManager.clearStore(); })
            .then(function () { return Promise.all(_this.clearStoreCallbacks.map(function (fn) { return fn(); })); });
    };
    ApolloClient.prototype.onResetStore = function (cb) {
        var _this = this;
        this.resetStoreCallbacks.push(cb);
        return function () {
            _this.resetStoreCallbacks = _this.resetStoreCallbacks.filter(function (c) { return c !== cb; });
        };
    };
    ApolloClient.prototype.onClearStore = function (cb) {
        var _this = this;
        this.clearStoreCallbacks.push(cb);
        return function () {
            _this.clearStoreCallbacks = _this.clearStoreCallbacks.filter(function (c) { return c !== cb; });
        };
    };
    ApolloClient.prototype.reFetchObservableQueries = function (includeStandby) {
        return this.queryManager.reFetchObservableQueries(includeStandby);
    };
    ApolloClient.prototype.extract = function (optimistic) {
        return this.cache.extract(optimistic);
    };
    ApolloClient.prototype.restore = function (serializedState) {
        return this.cache.restore(serializedState);
    };
    ApolloClient.prototype.addResolvers = function (resolvers) {
        this.localState.addResolvers(resolvers);
    };
    ApolloClient.prototype.setResolvers = function (resolvers) {
        this.localState.setResolvers(resolvers);
    };
    ApolloClient.prototype.getResolvers = function () {
        return this.localState.getResolvers();
    };
    ApolloClient.prototype.setLocalStateFragmentMatcher = function (fragmentMatcher) {
        this.localState.setFragmentMatcher(fragmentMatcher);
    };
    return ApolloClient;
}());

/* harmony default export */ __webpack_exports__["default"] = (ApolloClient);

//# sourceMappingURL=bundle.esm.js.map


/***/ }),

/***/ "./node_modules/apollo-link-error/lib/bundle.esm.js":
/*!**********************************************************!*\
  !*** ./node_modules/apollo-link-error/lib/bundle.esm.js ***!
  \**********************************************************/
/*! exports provided: ErrorLink, onError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorLink", function() { return ErrorLink; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onError", function() { return onError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var apollo_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-link */ "./node_modules/apollo-link/lib/bundle.esm.js");



function onError(errorHandler) {
    return new apollo_link__WEBPACK_IMPORTED_MODULE_1__["ApolloLink"](function (operation, forward) {
        return new apollo_link__WEBPACK_IMPORTED_MODULE_1__["Observable"](function (observer) {
            var sub;
            var retriedSub;
            var retriedResult;
            try {
                sub = forward(operation).subscribe({
                    next: function (result) {
                        if (result.errors) {
                            retriedResult = errorHandler({
                                graphQLErrors: result.errors,
                                response: result,
                                operation: operation,
                                forward: forward,
                            });
                            if (retriedResult) {
                                retriedSub = retriedResult.subscribe({
                                    next: observer.next.bind(observer),
                                    error: observer.error.bind(observer),
                                    complete: observer.complete.bind(observer),
                                });
                                return;
                            }
                        }
                        observer.next(result);
                    },
                    error: function (networkError) {
                        retriedResult = errorHandler({
                            operation: operation,
                            networkError: networkError,
                            graphQLErrors: networkError &&
                                networkError.result &&
                                networkError.result.errors,
                            forward: forward,
                        });
                        if (retriedResult) {
                            retriedSub = retriedResult.subscribe({
                                next: observer.next.bind(observer),
                                error: observer.error.bind(observer),
                                complete: observer.complete.bind(observer),
                            });
                            return;
                        }
                        observer.error(networkError);
                    },
                    complete: function () {
                        if (!retriedResult) {
                            observer.complete.bind(observer)();
                        }
                    },
                });
            }
            catch (e) {
                errorHandler({ networkError: e, operation: operation, forward: forward });
                observer.error(e);
            }
            return function () {
                if (sub)
                    sub.unsubscribe();
                if (retriedSub)
                    sub.unsubscribe();
            };
        });
    });
}
var ErrorLink = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(ErrorLink, _super);
    function ErrorLink(errorHandler) {
        var _this = _super.call(this) || this;
        _this.link = onError(errorHandler);
        return _this;
    }
    ErrorLink.prototype.request = function (operation, forward) {
        return this.link.request(operation, forward);
    };
    return ErrorLink;
}(apollo_link__WEBPACK_IMPORTED_MODULE_1__["ApolloLink"]));


//# sourceMappingURL=bundle.esm.js.map


/***/ }),

/***/ "./node_modules/apollo-link-http-common/lib/bundle.esm.js":
/*!****************************************************************!*\
  !*** ./node_modules/apollo-link-http-common/lib/bundle.esm.js ***!
  \****************************************************************/
/*! exports provided: checkFetcher, createSignalIfSupported, fallbackHttpConfig, parseAndCheckHttpResponse, selectHttpOptionsAndBody, selectURI, serializeFetchParameter, throwServerError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkFetcher", function() { return checkFetcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSignalIfSupported", function() { return createSignalIfSupported; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fallbackHttpConfig", function() { return fallbackHttpConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseAndCheckHttpResponse", function() { return parseAndCheckHttpResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectHttpOptionsAndBody", function() { return selectHttpOptionsAndBody; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectURI", function() { return selectURI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "serializeFetchParameter", function() { return serializeFetchParameter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throwServerError", function() { return throwServerError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var graphql_language_printer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! graphql/language/printer */ "./node_modules/graphql/language/printer.mjs");
/* harmony import */ var ts_invariant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ts-invariant */ "./node_modules/ts-invariant/lib/invariant.esm.js");




var defaultHttpOptions = {
    includeQuery: true,
    includeExtensions: false,
};
var defaultHeaders = {
    accept: '*/*',
    'content-type': 'application/json',
};
var defaultOptions = {
    method: 'POST',
};
var fallbackHttpConfig = {
    http: defaultHttpOptions,
    headers: defaultHeaders,
    options: defaultOptions,
};
var throwServerError = function (response, result, message) {
    var error = new Error(message);
    error.name = 'ServerError';
    error.response = response;
    error.statusCode = response.status;
    error.result = result;
    throw error;
};
var parseAndCheckHttpResponse = function (operations) { return function (response) {
    return (response
        .text()
        .then(function (bodyText) {
        try {
            return JSON.parse(bodyText);
        }
        catch (err) {
            var parseError = err;
            parseError.name = 'ServerParseError';
            parseError.response = response;
            parseError.statusCode = response.status;
            parseError.bodyText = bodyText;
            return Promise.reject(parseError);
        }
    })
        .then(function (result) {
        if (response.status >= 300) {
            throwServerError(response, result, "Response not successful: Received status code " + response.status);
        }
        if (!Array.isArray(result) &&
            !result.hasOwnProperty('data') &&
            !result.hasOwnProperty('errors')) {
            throwServerError(response, result, "Server response was missing for query '" + (Array.isArray(operations)
                ? operations.map(function (op) { return op.operationName; })
                : operations.operationName) + "'.");
        }
        return result;
    }));
}; };
var checkFetcher = function (fetcher) {
    if (!fetcher && typeof fetch === 'undefined') {
        var library = 'unfetch';
        if (typeof window === 'undefined')
            library = 'node-fetch';
        throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_2__["InvariantError"]("\nfetch is not found globally and no fetcher passed, to fix pass a fetch for\nyour environment like https://www.npmjs.com/package/" + library + ".\n\nFor example:\nimport fetch from '" + library + "';\nimport { createHttpLink } from 'apollo-link-http';\n\nconst link = createHttpLink({ uri: '/graphql', fetch: fetch });");
    }
};
var createSignalIfSupported = function () {
    if (typeof AbortController === 'undefined')
        return { controller: false, signal: false };
    var controller = new AbortController();
    var signal = controller.signal;
    return { controller: controller, signal: signal };
};
var selectHttpOptionsAndBody = function (operation, fallbackConfig) {
    var configs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        configs[_i - 2] = arguments[_i];
    }
    var options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, fallbackConfig.options, { headers: fallbackConfig.headers, credentials: fallbackConfig.credentials });
    var http = fallbackConfig.http;
    configs.forEach(function (config) {
        options = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options, config.options, { headers: Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, options.headers, config.headers) });
        if (config.credentials)
            options.credentials = config.credentials;
        http = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, http, config.http);
    });
    var operationName = operation.operationName, extensions = operation.extensions, variables = operation.variables, query = operation.query;
    var body = { operationName: operationName, variables: variables };
    if (http.includeExtensions)
        body.extensions = extensions;
    if (http.includeQuery)
        body.query = Object(graphql_language_printer__WEBPACK_IMPORTED_MODULE_1__["print"])(query);
    return {
        options: options,
        body: body,
    };
};
var serializeFetchParameter = function (p, label) {
    var serialized;
    try {
        serialized = JSON.stringify(p);
    }
    catch (e) {
        var parseError =  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_2__["InvariantError"]("Network request failed. " + label + " is not serializable: " + e.message);
        parseError.parseError = e;
        throw parseError;
    }
    return serialized;
};
var selectURI = function (operation, fallbackURI) {
    var context = operation.getContext();
    var contextURI = context.uri;
    if (contextURI) {
        return contextURI;
    }
    else if (typeof fallbackURI === 'function') {
        return fallbackURI(operation);
    }
    else {
        return fallbackURI || '/graphql';
    }
};


//# sourceMappingURL=bundle.esm.js.map


/***/ }),

/***/ "./node_modules/apollo-link-http/lib/bundle.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/apollo-link-http/lib/bundle.esm.js ***!
  \*********************************************************/
/*! exports provided: HttpLink, createHttpLink */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpLink", function() { return HttpLink; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createHttpLink", function() { return createHttpLink; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var apollo_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-link */ "./node_modules/apollo-link/lib/bundle.esm.js");
/* harmony import */ var apollo_link_http_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! apollo-link-http-common */ "./node_modules/apollo-link-http-common/lib/bundle.esm.js");




var createHttpLink = function (linkOptions) {
    if (linkOptions === void 0) { linkOptions = {}; }
    var _a = linkOptions.uri, uri = _a === void 0 ? '/graphql' : _a, fetcher = linkOptions.fetch, includeExtensions = linkOptions.includeExtensions, useGETForQueries = linkOptions.useGETForQueries, requestOptions = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__rest"])(linkOptions, ["uri", "fetch", "includeExtensions", "useGETForQueries"]);
    Object(apollo_link_http_common__WEBPACK_IMPORTED_MODULE_2__["checkFetcher"])(fetcher);
    if (!fetcher) {
        fetcher = fetch;
    }
    var linkConfig = {
        http: { includeExtensions: includeExtensions },
        options: requestOptions.fetchOptions,
        credentials: requestOptions.credentials,
        headers: requestOptions.headers,
    };
    return new apollo_link__WEBPACK_IMPORTED_MODULE_1__["ApolloLink"](function (operation) {
        var chosenURI = Object(apollo_link_http_common__WEBPACK_IMPORTED_MODULE_2__["selectURI"])(operation, uri);
        var context = operation.getContext();
        var clientAwarenessHeaders = {};
        if (context.clientAwareness) {
            var _a = context.clientAwareness, name_1 = _a.name, version = _a.version;
            if (name_1) {
                clientAwarenessHeaders['apollographql-client-name'] = name_1;
            }
            if (version) {
                clientAwarenessHeaders['apollographql-client-version'] = version;
            }
        }
        var contextHeaders = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"])({}, clientAwarenessHeaders, context.headers);
        var contextConfig = {
            http: context.http,
            options: context.fetchOptions,
            credentials: context.credentials,
            headers: contextHeaders,
        };
        var _b = Object(apollo_link_http_common__WEBPACK_IMPORTED_MODULE_2__["selectHttpOptionsAndBody"])(operation, apollo_link_http_common__WEBPACK_IMPORTED_MODULE_2__["fallbackHttpConfig"], linkConfig, contextConfig), options = _b.options, body = _b.body;
        var controller;
        if (!options.signal) {
            var _c = Object(apollo_link_http_common__WEBPACK_IMPORTED_MODULE_2__["createSignalIfSupported"])(), _controller = _c.controller, signal = _c.signal;
            controller = _controller;
            if (controller)
                options.signal = signal;
        }
        var definitionIsMutation = function (d) {
            return d.kind === 'OperationDefinition' && d.operation === 'mutation';
        };
        if (useGETForQueries &&
            !operation.query.definitions.some(definitionIsMutation)) {
            options.method = 'GET';
        }
        if (options.method === 'GET') {
            var _d = rewriteURIForGET(chosenURI, body), newURI = _d.newURI, parseError = _d.parseError;
            if (parseError) {
                return Object(apollo_link__WEBPACK_IMPORTED_MODULE_1__["fromError"])(parseError);
            }
            chosenURI = newURI;
        }
        else {
            try {
                options.body = Object(apollo_link_http_common__WEBPACK_IMPORTED_MODULE_2__["serializeFetchParameter"])(body, 'Payload');
            }
            catch (parseError) {
                return Object(apollo_link__WEBPACK_IMPORTED_MODULE_1__["fromError"])(parseError);
            }
        }
        return new apollo_link__WEBPACK_IMPORTED_MODULE_1__["Observable"](function (observer) {
            fetcher(chosenURI, options)
                .then(function (response) {
                operation.setContext({ response: response });
                return response;
            })
                .then(Object(apollo_link_http_common__WEBPACK_IMPORTED_MODULE_2__["parseAndCheckHttpResponse"])(operation))
                .then(function (result) {
                observer.next(result);
                observer.complete();
                return result;
            })
                .catch(function (err) {
                if (err.name === 'AbortError')
                    return;
                if (err.result && err.result.errors && err.result.data) {
                    observer.next(err.result);
                }
                observer.error(err);
            });
            return function () {
                if (controller)
                    controller.abort();
            };
        });
    });
};
function rewriteURIForGET(chosenURI, body) {
    var queryParams = [];
    var addQueryParam = function (key, value) {
        queryParams.push(key + "=" + encodeURIComponent(value));
    };
    if ('query' in body) {
        addQueryParam('query', body.query);
    }
    if (body.operationName) {
        addQueryParam('operationName', body.operationName);
    }
    if (body.variables) {
        var serializedVariables = void 0;
        try {
            serializedVariables = Object(apollo_link_http_common__WEBPACK_IMPORTED_MODULE_2__["serializeFetchParameter"])(body.variables, 'Variables map');
        }
        catch (parseError) {
            return { parseError: parseError };
        }
        addQueryParam('variables', serializedVariables);
    }
    if (body.extensions) {
        var serializedExtensions = void 0;
        try {
            serializedExtensions = Object(apollo_link_http_common__WEBPACK_IMPORTED_MODULE_2__["serializeFetchParameter"])(body.extensions, 'Extensions map');
        }
        catch (parseError) {
            return { parseError: parseError };
        }
        addQueryParam('extensions', serializedExtensions);
    }
    var fragment = '', preFragment = chosenURI;
    var fragmentStart = chosenURI.indexOf('#');
    if (fragmentStart !== -1) {
        fragment = chosenURI.substr(fragmentStart);
        preFragment = chosenURI.substr(0, fragmentStart);
    }
    var queryParamsPrefix = preFragment.indexOf('?') === -1 ? '?' : '&';
    var newURI = preFragment + queryParamsPrefix + queryParams.join('&') + fragment;
    return { newURI: newURI };
}
var HttpLink = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(HttpLink, _super);
    function HttpLink(opts) {
        return _super.call(this, createHttpLink(opts).request) || this;
    }
    return HttpLink;
}(apollo_link__WEBPACK_IMPORTED_MODULE_1__["ApolloLink"]));


//# sourceMappingURL=bundle.esm.js.map


/***/ }),

/***/ "./node_modules/apollo-link/lib/bundle.esm.js":
/*!****************************************************!*\
  !*** ./node_modules/apollo-link/lib/bundle.esm.js ***!
  \****************************************************/
/*! exports provided: Observable, getOperationName, ApolloLink, concat, createOperation, empty, execute, from, fromError, fromPromise, makePromise, split, toPromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApolloLink", function() { return ApolloLink; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "concat", function() { return concat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createOperation", function() { return createOperation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "empty", function() { return empty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "execute", function() { return execute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "from", function() { return from; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromError", function() { return fromError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromPromise", function() { return fromPromise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makePromise", function() { return makePromise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "split", function() { return split; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toPromise", function() { return toPromise; });
/* harmony import */ var zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zen-observable-ts */ "./node_modules/zen-observable-ts/lib/bundle.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Observable", function() { return zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var ts_invariant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ts-invariant */ "./node_modules/ts-invariant/lib/invariant.esm.js");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var apollo_utilities__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! apollo-utilities */ "./node_modules/apollo-utilities/lib/bundle.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getOperationName", function() { return apollo_utilities__WEBPACK_IMPORTED_MODULE_3__["getOperationName"]; });








function validateOperation(operation) {
    var OPERATION_FIELDS = [
        'query',
        'operationName',
        'variables',
        'extensions',
        'context',
    ];
    for (var _i = 0, _a = Object.keys(operation); _i < _a.length; _i++) {
        var key = _a[_i];
        if (OPERATION_FIELDS.indexOf(key) < 0) {
            throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_1__["InvariantError"]("illegal argument: " + key);
        }
    }
    return operation;
}
var LinkError = (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__extends"])(LinkError, _super);
    function LinkError(message, link) {
        var _this = _super.call(this, message) || this;
        _this.link = link;
        return _this;
    }
    return LinkError;
}(Error));
function isTerminating(link) {
    return link.request.length <= 1;
}
function toPromise(observable) {
    var completed = false;
    return new Promise(function (resolve, reject) {
        observable.subscribe({
            next: function (data) {
                if (completed) {
                     false || ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"].warn("Promise Wrapper does not support multiple results from Observable");
                }
                else {
                    completed = true;
                    resolve(data);
                }
            },
            error: reject,
        });
    });
}
var makePromise = toPromise;
function fromPromise(promise) {
    return new zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"](function (observer) {
        promise
            .then(function (value) {
            observer.next(value);
            observer.complete();
        })
            .catch(observer.error.bind(observer));
    });
}
function fromError(errorValue) {
    return new zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"](function (observer) {
        observer.error(errorValue);
    });
}
function transformOperation(operation) {
    var transformedOperation = {
        variables: operation.variables || {},
        extensions: operation.extensions || {},
        operationName: operation.operationName,
        query: operation.query,
    };
    if (!transformedOperation.operationName) {
        transformedOperation.operationName =
            typeof transformedOperation.query !== 'string'
                ? Object(apollo_utilities__WEBPACK_IMPORTED_MODULE_3__["getOperationName"])(transformedOperation.query)
                : '';
    }
    return transformedOperation;
}
function createOperation(starting, operation) {
    var context = Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({}, starting);
    var setContext = function (next) {
        if (typeof next === 'function') {
            context = Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({}, context, next(context));
        }
        else {
            context = Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({}, context, next);
        }
    };
    var getContext = function () { return (Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({}, context)); };
    Object.defineProperty(operation, 'setContext', {
        enumerable: false,
        value: setContext,
    });
    Object.defineProperty(operation, 'getContext', {
        enumerable: false,
        value: getContext,
    });
    Object.defineProperty(operation, 'toKey', {
        enumerable: false,
        value: function () { return getKey(operation); },
    });
    return operation;
}
function getKey(operation) {
    var query = operation.query, variables = operation.variables, operationName = operation.operationName;
    return JSON.stringify([operationName, query, variables]);
}

function passthrough(op, forward) {
    return forward ? forward(op) : zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of();
}
function toLink(handler) {
    return typeof handler === 'function' ? new ApolloLink(handler) : handler;
}
function empty() {
    return new ApolloLink(function () { return zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of(); });
}
function from(links) {
    if (links.length === 0)
        return empty();
    return links.map(toLink).reduce(function (x, y) { return x.concat(y); });
}
function split(test, left, right) {
    var leftLink = toLink(left);
    var rightLink = toLink(right || new ApolloLink(passthrough));
    if (isTerminating(leftLink) && isTerminating(rightLink)) {
        return new ApolloLink(function (operation) {
            return test(operation)
                ? leftLink.request(operation) || zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of()
                : rightLink.request(operation) || zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of();
        });
    }
    else {
        return new ApolloLink(function (operation, forward) {
            return test(operation)
                ? leftLink.request(operation, forward) || zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of()
                : rightLink.request(operation, forward) || zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of();
        });
    }
}
var concat = function (first, second) {
    var firstLink = toLink(first);
    if (isTerminating(firstLink)) {
         false || ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"].warn(new LinkError("You are calling concat on a terminating link, which will have no effect", firstLink));
        return firstLink;
    }
    var nextLink = toLink(second);
    if (isTerminating(nextLink)) {
        return new ApolloLink(function (operation) {
            return firstLink.request(operation, function (op) { return nextLink.request(op) || zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of(); }) || zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of();
        });
    }
    else {
        return new ApolloLink(function (operation, forward) {
            return (firstLink.request(operation, function (op) {
                return nextLink.request(op, forward) || zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of();
            }) || zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of());
        });
    }
};
var ApolloLink = (function () {
    function ApolloLink(request) {
        if (request)
            this.request = request;
    }
    ApolloLink.prototype.split = function (test, left, right) {
        return this.concat(split(test, left, right || new ApolloLink(passthrough)));
    };
    ApolloLink.prototype.concat = function (next) {
        return concat(this, next);
    };
    ApolloLink.prototype.request = function (operation, forward) {
        throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_1__["InvariantError"]('request is not implemented');
    };
    ApolloLink.empty = empty;
    ApolloLink.from = from;
    ApolloLink.split = split;
    ApolloLink.execute = execute;
    return ApolloLink;
}());
function execute(link, operation) {
    return (link.request(createOperation(operation.context, transformOperation(validateOperation(operation)))) || zen_observable_ts__WEBPACK_IMPORTED_MODULE_0__["default"].of());
}


//# sourceMappingURL=bundle.esm.js.map


/***/ }),

/***/ "./node_modules/apollo-utilities/lib/bundle.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/apollo-utilities/lib/bundle.esm.js ***!
  \*********************************************************/
/*! exports provided: isEqual, addTypenameToDocument, argumentsObjectFromField, assign, buildQueryFromSelectionSet, canUseWeakMap, checkDocument, cloneDeep, createFragmentMap, getDefaultValues, getDirectiveInfoFromField, getDirectiveNames, getDirectivesFromDocument, getEnv, getFragmentDefinition, getFragmentDefinitions, getFragmentQueryDocument, getInclusionDirectives, getMainDefinition, getMutationDefinition, getOperationDefinition, getOperationDefinitionOrDie, getOperationName, getQueryDefinition, getStoreKeyName, graphQLResultHasError, hasClientExports, hasDirectives, isDevelopment, isEnv, isField, isIdValue, isInlineFragment, isJsonValue, isNumberValue, isProduction, isScalarValue, isTest, maybeDeepFreeze, mergeDeep, mergeDeepArray, removeArgumentsFromDocument, removeClientSetsFromDocument, removeConnectionDirectiveFromDocument, removeDirectivesFromDocument, removeFragmentSpreadFromDocument, resultKeyNameFromField, shouldInclude, storeKeyNameFromField, stripSymbols, toIdValue, tryFunctionOrLogError, valueFromNode, valueToObjectRepresentation, variablesInOperation, warnOnceInDevelopment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addTypenameToDocument", function() { return addTypenameToDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "argumentsObjectFromField", function() { return argumentsObjectFromField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildQueryFromSelectionSet", function() { return buildQueryFromSelectionSet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canUseWeakMap", function() { return canUseWeakMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkDocument", function() { return checkDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneDeep", function() { return cloneDeep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFragmentMap", function() { return createFragmentMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDefaultValues", function() { return getDefaultValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDirectiveInfoFromField", function() { return getDirectiveInfoFromField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDirectiveNames", function() { return getDirectiveNames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDirectivesFromDocument", function() { return getDirectivesFromDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEnv", function() { return getEnv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFragmentDefinition", function() { return getFragmentDefinition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFragmentDefinitions", function() { return getFragmentDefinitions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFragmentQueryDocument", function() { return getFragmentQueryDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInclusionDirectives", function() { return getInclusionDirectives; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMainDefinition", function() { return getMainDefinition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMutationDefinition", function() { return getMutationDefinition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOperationDefinition", function() { return getOperationDefinition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOperationDefinitionOrDie", function() { return getOperationDefinitionOrDie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOperationName", function() { return getOperationName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getQueryDefinition", function() { return getQueryDefinition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStoreKeyName", function() { return getStoreKeyName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "graphQLResultHasError", function() { return graphQLResultHasError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasClientExports", function() { return hasClientExports; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasDirectives", function() { return hasDirectives; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDevelopment", function() { return isDevelopment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEnv", function() { return isEnv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isField", function() { return isField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isIdValue", function() { return isIdValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isInlineFragment", function() { return isInlineFragment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isJsonValue", function() { return isJsonValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNumberValue", function() { return isNumberValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isProduction", function() { return isProduction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isScalarValue", function() { return isScalarValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isTest", function() { return isTest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "maybeDeepFreeze", function() { return maybeDeepFreeze; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeDeep", function() { return mergeDeep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeDeepArray", function() { return mergeDeepArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeArgumentsFromDocument", function() { return removeArgumentsFromDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeClientSetsFromDocument", function() { return removeClientSetsFromDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeConnectionDirectiveFromDocument", function() { return removeConnectionDirectiveFromDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeDirectivesFromDocument", function() { return removeDirectivesFromDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeFragmentSpreadFromDocument", function() { return removeFragmentSpreadFromDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resultKeyNameFromField", function() { return resultKeyNameFromField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shouldInclude", function() { return shouldInclude; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "storeKeyNameFromField", function() { return storeKeyNameFromField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stripSymbols", function() { return stripSymbols; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toIdValue", function() { return toIdValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tryFunctionOrLogError", function() { return tryFunctionOrLogError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "valueFromNode", function() { return valueFromNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "valueToObjectRepresentation", function() { return valueToObjectRepresentation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "variablesInOperation", function() { return variablesInOperation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "warnOnceInDevelopment", function() { return warnOnceInDevelopment; });
/* harmony import */ var graphql_language_visitor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql/language/visitor */ "./node_modules/graphql/language/visitor.mjs");
/* harmony import */ var ts_invariant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ts-invariant */ "./node_modules/ts-invariant/lib/invariant.esm.js");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var fast_json_stable_stringify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fast-json-stable-stringify */ "./node_modules/fast-json-stable-stringify/index.js");
/* harmony import */ var fast_json_stable_stringify__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fast_json_stable_stringify__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wry_equality__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wry/equality */ "./node_modules/@wry/equality/lib/equality.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isEqual", function() { return _wry_equality__WEBPACK_IMPORTED_MODULE_4__["equal"]; });







function isScalarValue(value) {
    return ['StringValue', 'BooleanValue', 'EnumValue'].indexOf(value.kind) > -1;
}
function isNumberValue(value) {
    return ['IntValue', 'FloatValue'].indexOf(value.kind) > -1;
}
function isStringValue(value) {
    return value.kind === 'StringValue';
}
function isBooleanValue(value) {
    return value.kind === 'BooleanValue';
}
function isIntValue(value) {
    return value.kind === 'IntValue';
}
function isFloatValue(value) {
    return value.kind === 'FloatValue';
}
function isVariable(value) {
    return value.kind === 'Variable';
}
function isObjectValue(value) {
    return value.kind === 'ObjectValue';
}
function isListValue(value) {
    return value.kind === 'ListValue';
}
function isEnumValue(value) {
    return value.kind === 'EnumValue';
}
function isNullValue(value) {
    return value.kind === 'NullValue';
}
function valueToObjectRepresentation(argObj, name, value, variables) {
    if (isIntValue(value) || isFloatValue(value)) {
        argObj[name.value] = Number(value.value);
    }
    else if (isBooleanValue(value) || isStringValue(value)) {
        argObj[name.value] = value.value;
    }
    else if (isObjectValue(value)) {
        var nestedArgObj_1 = {};
        value.fields.map(function (obj) {
            return valueToObjectRepresentation(nestedArgObj_1, obj.name, obj.value, variables);
        });
        argObj[name.value] = nestedArgObj_1;
    }
    else if (isVariable(value)) {
        var variableValue = (variables || {})[value.name.value];
        argObj[name.value] = variableValue;
    }
    else if (isListValue(value)) {
        argObj[name.value] = value.values.map(function (listValue) {
            var nestedArgArrayObj = {};
            valueToObjectRepresentation(nestedArgArrayObj, name, listValue, variables);
            return nestedArgArrayObj[name.value];
        });
    }
    else if (isEnumValue(value)) {
        argObj[name.value] = value.value;
    }
    else if (isNullValue(value)) {
        argObj[name.value] = null;
    }
    else {
        throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_1__["InvariantError"]("The inline argument \"" + name.value + "\" of kind \"" + value.kind + "\"" +
            'is not supported. Use variables instead of inline arguments to ' +
            'overcome this limitation.');
    }
}
function storeKeyNameFromField(field, variables) {
    var directivesObj = null;
    if (field.directives) {
        directivesObj = {};
        field.directives.forEach(function (directive) {
            directivesObj[directive.name.value] = {};
            if (directive.arguments) {
                directive.arguments.forEach(function (_a) {
                    var name = _a.name, value = _a.value;
                    return valueToObjectRepresentation(directivesObj[directive.name.value], name, value, variables);
                });
            }
        });
    }
    var argObj = null;
    if (field.arguments && field.arguments.length) {
        argObj = {};
        field.arguments.forEach(function (_a) {
            var name = _a.name, value = _a.value;
            return valueToObjectRepresentation(argObj, name, value, variables);
        });
    }
    return getStoreKeyName(field.name.value, argObj, directivesObj);
}
var KNOWN_DIRECTIVES = [
    'connection',
    'include',
    'skip',
    'client',
    'rest',
    'export',
];
function getStoreKeyName(fieldName, args, directives) {
    if (directives &&
        directives['connection'] &&
        directives['connection']['key']) {
        if (directives['connection']['filter'] &&
            directives['connection']['filter'].length > 0) {
            var filterKeys = directives['connection']['filter']
                ? directives['connection']['filter']
                : [];
            filterKeys.sort();
            var queryArgs_1 = args;
            var filteredArgs_1 = {};
            filterKeys.forEach(function (key) {
                filteredArgs_1[key] = queryArgs_1[key];
            });
            return directives['connection']['key'] + "(" + JSON.stringify(filteredArgs_1) + ")";
        }
        else {
            return directives['connection']['key'];
        }
    }
    var completeFieldName = fieldName;
    if (args) {
        var stringifiedArgs = fast_json_stable_stringify__WEBPACK_IMPORTED_MODULE_3___default()(args);
        completeFieldName += "(" + stringifiedArgs + ")";
    }
    if (directives) {
        Object.keys(directives).forEach(function (key) {
            if (KNOWN_DIRECTIVES.indexOf(key) !== -1)
                return;
            if (directives[key] && Object.keys(directives[key]).length) {
                completeFieldName += "@" + key + "(" + JSON.stringify(directives[key]) + ")";
            }
            else {
                completeFieldName += "@" + key;
            }
        });
    }
    return completeFieldName;
}
function argumentsObjectFromField(field, variables) {
    if (field.arguments && field.arguments.length) {
        var argObj_1 = {};
        field.arguments.forEach(function (_a) {
            var name = _a.name, value = _a.value;
            return valueToObjectRepresentation(argObj_1, name, value, variables);
        });
        return argObj_1;
    }
    return null;
}
function resultKeyNameFromField(field) {
    return field.alias ? field.alias.value : field.name.value;
}
function isField(selection) {
    return selection.kind === 'Field';
}
function isInlineFragment(selection) {
    return selection.kind === 'InlineFragment';
}
function isIdValue(idObject) {
    return idObject &&
        idObject.type === 'id' &&
        typeof idObject.generated === 'boolean';
}
function toIdValue(idConfig, generated) {
    if (generated === void 0) { generated = false; }
    return Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({ type: 'id', generated: generated }, (typeof idConfig === 'string'
        ? { id: idConfig, typename: undefined }
        : idConfig));
}
function isJsonValue(jsonObject) {
    return (jsonObject != null &&
        typeof jsonObject === 'object' &&
        jsonObject.type === 'json');
}
function defaultValueFromVariable(node) {
    throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_1__["InvariantError"]("Variable nodes are not supported by valueFromNode");
}
function valueFromNode(node, onVariable) {
    if (onVariable === void 0) { onVariable = defaultValueFromVariable; }
    switch (node.kind) {
        case 'Variable':
            return onVariable(node);
        case 'NullValue':
            return null;
        case 'IntValue':
            return parseInt(node.value, 10);
        case 'FloatValue':
            return parseFloat(node.value);
        case 'ListValue':
            return node.values.map(function (v) { return valueFromNode(v, onVariable); });
        case 'ObjectValue': {
            var value = {};
            for (var _i = 0, _a = node.fields; _i < _a.length; _i++) {
                var field = _a[_i];
                value[field.name.value] = valueFromNode(field.value, onVariable);
            }
            return value;
        }
        default:
            return node.value;
    }
}

function getDirectiveInfoFromField(field, variables) {
    if (field.directives && field.directives.length) {
        var directiveObj_1 = {};
        field.directives.forEach(function (directive) {
            directiveObj_1[directive.name.value] = argumentsObjectFromField(directive, variables);
        });
        return directiveObj_1;
    }
    return null;
}
function shouldInclude(selection, variables) {
    if (variables === void 0) { variables = {}; }
    return getInclusionDirectives(selection.directives).every(function (_a) {
        var directive = _a.directive, ifArgument = _a.ifArgument;
        var evaledValue = false;
        if (ifArgument.value.kind === 'Variable') {
            evaledValue = variables[ifArgument.value.name.value];
             false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(evaledValue !== void 0, "Invalid variable referenced in @" + directive.name.value + " directive.");
        }
        else {
            evaledValue = ifArgument.value.value;
        }
        return directive.name.value === 'skip' ? !evaledValue : evaledValue;
    });
}
function getDirectiveNames(doc) {
    var names = [];
    Object(graphql_language_visitor__WEBPACK_IMPORTED_MODULE_0__["visit"])(doc, {
        Directive: function (node) {
            names.push(node.name.value);
        },
    });
    return names;
}
function hasDirectives(names, doc) {
    return getDirectiveNames(doc).some(function (name) { return names.indexOf(name) > -1; });
}
function hasClientExports(document) {
    return (document &&
        hasDirectives(['client'], document) &&
        hasDirectives(['export'], document));
}
function isInclusionDirective(_a) {
    var value = _a.name.value;
    return value === 'skip' || value === 'include';
}
function getInclusionDirectives(directives) {
    return directives ? directives.filter(isInclusionDirective).map(function (directive) {
        var directiveArguments = directive.arguments;
        var directiveName = directive.name.value;
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(directiveArguments && directiveArguments.length === 1, "Incorrect number of arguments for the @" + directiveName + " directive.");
        var ifArgument = directiveArguments[0];
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(ifArgument.name && ifArgument.name.value === 'if', "Invalid argument for the @" + directiveName + " directive.");
        var ifValue = ifArgument.value;
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(ifValue &&
            (ifValue.kind === 'Variable' || ifValue.kind === 'BooleanValue'), "Argument for the @" + directiveName + " directive must be a variable or a boolean value.");
        return { directive: directive, ifArgument: ifArgument };
    }) : [];
}

function getFragmentQueryDocument(document, fragmentName) {
    var actualFragmentName = fragmentName;
    var fragments = [];
    document.definitions.forEach(function (definition) {
        if (definition.kind === 'OperationDefinition') {
            throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_1__["InvariantError"]("Found a " + definition.operation + " operation" + (definition.name ? " named '" + definition.name.value + "'" : '') + ". " +
                'No operations are allowed when using a fragment as a query. Only fragments are allowed.');
        }
        if (definition.kind === 'FragmentDefinition') {
            fragments.push(definition);
        }
    });
    if (typeof actualFragmentName === 'undefined') {
         false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(fragments.length === 1, "Found " + fragments.length + " fragments. `fragmentName` must be provided when there is not exactly 1 fragment.");
        actualFragmentName = fragments[0].name.value;
    }
    var query = Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({}, document), { definitions: Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__spreadArrays"])([
            {
                kind: 'OperationDefinition',
                operation: 'query',
                selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                        {
                            kind: 'FragmentSpread',
                            name: {
                                kind: 'Name',
                                value: actualFragmentName,
                            },
                        },
                    ],
                },
            }
        ], document.definitions) });
    return query;
}

function assign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        if (typeof source === 'undefined' || source === null) {
            return;
        }
        Object.keys(source).forEach(function (key) {
            target[key] = source[key];
        });
    });
    return target;
}

function getMutationDefinition(doc) {
    checkDocument(doc);
    var mutationDef = doc.definitions.filter(function (definition) {
        return definition.kind === 'OperationDefinition' &&
            definition.operation === 'mutation';
    })[0];
     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(mutationDef, 'Must contain a mutation definition.');
    return mutationDef;
}
function checkDocument(doc) {
     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(doc && doc.kind === 'Document', "Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a \"gql\" tag? http://docs.apollostack.com/apollo-client/core.html#gql");
    var operations = doc.definitions
        .filter(function (d) { return d.kind !== 'FragmentDefinition'; })
        .map(function (definition) {
        if (definition.kind !== 'OperationDefinition') {
            throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_1__["InvariantError"]("Schema type definitions not allowed in queries. Found: \"" + definition.kind + "\"");
        }
        return definition;
    });
     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(operations.length <= 1, "Ambiguous GraphQL document: contains " + operations.length + " operations");
    return doc;
}
function getOperationDefinition(doc) {
    checkDocument(doc);
    return doc.definitions.filter(function (definition) { return definition.kind === 'OperationDefinition'; })[0];
}
function getOperationDefinitionOrDie(document) {
    var def = getOperationDefinition(document);
     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(def, "GraphQL document is missing an operation");
    return def;
}
function getOperationName(doc) {
    return (doc.definitions
        .filter(function (definition) {
        return definition.kind === 'OperationDefinition' && definition.name;
    })
        .map(function (x) { return x.name.value; })[0] || null);
}
function getFragmentDefinitions(doc) {
    return doc.definitions.filter(function (definition) { return definition.kind === 'FragmentDefinition'; });
}
function getQueryDefinition(doc) {
    var queryDef = getOperationDefinition(doc);
     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(queryDef && queryDef.operation === 'query', 'Must contain a query definition.');
    return queryDef;
}
function getFragmentDefinition(doc) {
     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(doc.kind === 'Document', "Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a \"gql\" tag? http://docs.apollostack.com/apollo-client/core.html#gql");
     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(doc.definitions.length <= 1, 'Fragment must have exactly one definition.');
    var fragmentDef = doc.definitions[0];
     false ? undefined : Object(ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"])(fragmentDef.kind === 'FragmentDefinition', 'Must be a fragment definition.');
    return fragmentDef;
}
function getMainDefinition(queryDoc) {
    checkDocument(queryDoc);
    var fragmentDefinition;
    for (var _i = 0, _a = queryDoc.definitions; _i < _a.length; _i++) {
        var definition = _a[_i];
        if (definition.kind === 'OperationDefinition') {
            var operation = definition.operation;
            if (operation === 'query' ||
                operation === 'mutation' ||
                operation === 'subscription') {
                return definition;
            }
        }
        if (definition.kind === 'FragmentDefinition' && !fragmentDefinition) {
            fragmentDefinition = definition;
        }
    }
    if (fragmentDefinition) {
        return fragmentDefinition;
    }
    throw  false ? undefined : new ts_invariant__WEBPACK_IMPORTED_MODULE_1__["InvariantError"]('Expected a parsed GraphQL query with a query, mutation, subscription, or a fragment.');
}
function createFragmentMap(fragments) {
    if (fragments === void 0) { fragments = []; }
    var symTable = {};
    fragments.forEach(function (fragment) {
        symTable[fragment.name.value] = fragment;
    });
    return symTable;
}
function getDefaultValues(definition) {
    if (definition &&
        definition.variableDefinitions &&
        definition.variableDefinitions.length) {
        var defaultValues = definition.variableDefinitions
            .filter(function (_a) {
            var defaultValue = _a.defaultValue;
            return defaultValue;
        })
            .map(function (_a) {
            var variable = _a.variable, defaultValue = _a.defaultValue;
            var defaultValueObj = {};
            valueToObjectRepresentation(defaultValueObj, variable.name, defaultValue);
            return defaultValueObj;
        });
        return assign.apply(void 0, Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__spreadArrays"])([{}], defaultValues));
    }
    return {};
}
function variablesInOperation(operation) {
    var names = new Set();
    if (operation.variableDefinitions) {
        for (var _i = 0, _a = operation.variableDefinitions; _i < _a.length; _i++) {
            var definition = _a[_i];
            names.add(definition.variable.name.value);
        }
    }
    return names;
}

function filterInPlace(array, test, context) {
    var target = 0;
    array.forEach(function (elem, i) {
        if (test.call(this, elem, i, array)) {
            array[target++] = elem;
        }
    }, context);
    array.length = target;
    return array;
}

var TYPENAME_FIELD = {
    kind: 'Field',
    name: {
        kind: 'Name',
        value: '__typename',
    },
};
function isEmpty(op, fragments) {
    return op.selectionSet.selections.every(function (selection) {
        return selection.kind === 'FragmentSpread' &&
            isEmpty(fragments[selection.name.value], fragments);
    });
}
function nullIfDocIsEmpty(doc) {
    return isEmpty(getOperationDefinition(doc) || getFragmentDefinition(doc), createFragmentMap(getFragmentDefinitions(doc)))
        ? null
        : doc;
}
function getDirectiveMatcher(directives) {
    return function directiveMatcher(directive) {
        return directives.some(function (dir) {
            return (dir.name && dir.name === directive.name.value) ||
                (dir.test && dir.test(directive));
        });
    };
}
function removeDirectivesFromDocument(directives, doc) {
    var variablesInUse = Object.create(null);
    var variablesToRemove = [];
    var fragmentSpreadsInUse = Object.create(null);
    var fragmentSpreadsToRemove = [];
    var modifiedDoc = nullIfDocIsEmpty(Object(graphql_language_visitor__WEBPACK_IMPORTED_MODULE_0__["visit"])(doc, {
        Variable: {
            enter: function (node, _key, parent) {
                if (parent.kind !== 'VariableDefinition') {
                    variablesInUse[node.name.value] = true;
                }
            },
        },
        Field: {
            enter: function (node) {
                if (directives && node.directives) {
                    var shouldRemoveField = directives.some(function (directive) { return directive.remove; });
                    if (shouldRemoveField &&
                        node.directives &&
                        node.directives.some(getDirectiveMatcher(directives))) {
                        if (node.arguments) {
                            node.arguments.forEach(function (arg) {
                                if (arg.value.kind === 'Variable') {
                                    variablesToRemove.push({
                                        name: arg.value.name.value,
                                    });
                                }
                            });
                        }
                        if (node.selectionSet) {
                            getAllFragmentSpreadsFromSelectionSet(node.selectionSet).forEach(function (frag) {
                                fragmentSpreadsToRemove.push({
                                    name: frag.name.value,
                                });
                            });
                        }
                        return null;
                    }
                }
            },
        },
        FragmentSpread: {
            enter: function (node) {
                fragmentSpreadsInUse[node.name.value] = true;
            },
        },
        Directive: {
            enter: function (node) {
                if (getDirectiveMatcher(directives)(node)) {
                    return null;
                }
            },
        },
    }));
    if (modifiedDoc &&
        filterInPlace(variablesToRemove, function (v) { return !variablesInUse[v.name]; }).length) {
        modifiedDoc = removeArgumentsFromDocument(variablesToRemove, modifiedDoc);
    }
    if (modifiedDoc &&
        filterInPlace(fragmentSpreadsToRemove, function (fs) { return !fragmentSpreadsInUse[fs.name]; })
            .length) {
        modifiedDoc = removeFragmentSpreadFromDocument(fragmentSpreadsToRemove, modifiedDoc);
    }
    return modifiedDoc;
}
function addTypenameToDocument(doc) {
    return Object(graphql_language_visitor__WEBPACK_IMPORTED_MODULE_0__["visit"])(checkDocument(doc), {
        SelectionSet: {
            enter: function (node, _key, parent) {
                if (parent &&
                    parent.kind === 'OperationDefinition') {
                    return;
                }
                var selections = node.selections;
                if (!selections) {
                    return;
                }
                var skip = selections.some(function (selection) {
                    return (isField(selection) &&
                        (selection.name.value === '__typename' ||
                            selection.name.value.lastIndexOf('__', 0) === 0));
                });
                if (skip) {
                    return;
                }
                var field = parent;
                if (isField(field) &&
                    field.directives &&
                    field.directives.some(function (d) { return d.name.value === 'export'; })) {
                    return;
                }
                return Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({}, node), { selections: Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__spreadArrays"])(selections, [TYPENAME_FIELD]) });
            },
        },
    });
}
var connectionRemoveConfig = {
    test: function (directive) {
        var willRemove = directive.name.value === 'connection';
        if (willRemove) {
            if (!directive.arguments ||
                !directive.arguments.some(function (arg) { return arg.name.value === 'key'; })) {
                 false || ts_invariant__WEBPACK_IMPORTED_MODULE_1__["invariant"].warn('Removing an @connection directive even though it does not have a key. ' +
                    'You may want to use the key parameter to specify a store key.');
            }
        }
        return willRemove;
    },
};
function removeConnectionDirectiveFromDocument(doc) {
    return removeDirectivesFromDocument([connectionRemoveConfig], checkDocument(doc));
}
function hasDirectivesInSelectionSet(directives, selectionSet, nestedCheck) {
    if (nestedCheck === void 0) { nestedCheck = true; }
    return (selectionSet &&
        selectionSet.selections &&
        selectionSet.selections.some(function (selection) {
            return hasDirectivesInSelection(directives, selection, nestedCheck);
        }));
}
function hasDirectivesInSelection(directives, selection, nestedCheck) {
    if (nestedCheck === void 0) { nestedCheck = true; }
    if (!isField(selection)) {
        return true;
    }
    if (!selection.directives) {
        return false;
    }
    return (selection.directives.some(getDirectiveMatcher(directives)) ||
        (nestedCheck &&
            hasDirectivesInSelectionSet(directives, selection.selectionSet, nestedCheck)));
}
function getDirectivesFromDocument(directives, doc) {
    checkDocument(doc);
    var parentPath;
    return nullIfDocIsEmpty(Object(graphql_language_visitor__WEBPACK_IMPORTED_MODULE_0__["visit"])(doc, {
        SelectionSet: {
            enter: function (node, _key, _parent, path) {
                var currentPath = path.join('-');
                if (!parentPath ||
                    currentPath === parentPath ||
                    !currentPath.startsWith(parentPath)) {
                    if (node.selections) {
                        var selectionsWithDirectives = node.selections.filter(function (selection) { return hasDirectivesInSelection(directives, selection); });
                        if (hasDirectivesInSelectionSet(directives, node, false)) {
                            parentPath = currentPath;
                        }
                        return Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({}, node), { selections: selectionsWithDirectives });
                    }
                    else {
                        return null;
                    }
                }
            },
        },
    }));
}
function getArgumentMatcher(config) {
    return function argumentMatcher(argument) {
        return config.some(function (aConfig) {
            return argument.value &&
                argument.value.kind === 'Variable' &&
                argument.value.name &&
                (aConfig.name === argument.value.name.value ||
                    (aConfig.test && aConfig.test(argument)));
        });
    };
}
function removeArgumentsFromDocument(config, doc) {
    var argMatcher = getArgumentMatcher(config);
    return nullIfDocIsEmpty(Object(graphql_language_visitor__WEBPACK_IMPORTED_MODULE_0__["visit"])(doc, {
        OperationDefinition: {
            enter: function (node) {
                return Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({}, node), { variableDefinitions: node.variableDefinitions.filter(function (varDef) {
                        return !config.some(function (arg) { return arg.name === varDef.variable.name.value; });
                    }) });
            },
        },
        Field: {
            enter: function (node) {
                var shouldRemoveField = config.some(function (argConfig) { return argConfig.remove; });
                if (shouldRemoveField) {
                    var argMatchCount_1 = 0;
                    node.arguments.forEach(function (arg) {
                        if (argMatcher(arg)) {
                            argMatchCount_1 += 1;
                        }
                    });
                    if (argMatchCount_1 === 1) {
                        return null;
                    }
                }
            },
        },
        Argument: {
            enter: function (node) {
                if (argMatcher(node)) {
                    return null;
                }
            },
        },
    }));
}
function removeFragmentSpreadFromDocument(config, doc) {
    function enter(node) {
        if (config.some(function (def) { return def.name === node.name.value; })) {
            return null;
        }
    }
    return nullIfDocIsEmpty(Object(graphql_language_visitor__WEBPACK_IMPORTED_MODULE_0__["visit"])(doc, {
        FragmentSpread: { enter: enter },
        FragmentDefinition: { enter: enter },
    }));
}
function getAllFragmentSpreadsFromSelectionSet(selectionSet) {
    var allFragments = [];
    selectionSet.selections.forEach(function (selection) {
        if ((isField(selection) || isInlineFragment(selection)) &&
            selection.selectionSet) {
            getAllFragmentSpreadsFromSelectionSet(selection.selectionSet).forEach(function (frag) { return allFragments.push(frag); });
        }
        else if (selection.kind === 'FragmentSpread') {
            allFragments.push(selection);
        }
    });
    return allFragments;
}
function buildQueryFromSelectionSet(document) {
    var definition = getMainDefinition(document);
    var definitionOperation = definition.operation;
    if (definitionOperation === 'query') {
        return document;
    }
    var modifiedDoc = Object(graphql_language_visitor__WEBPACK_IMPORTED_MODULE_0__["visit"])(document, {
        OperationDefinition: {
            enter: function (node) {
                return Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])(Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({}, node), { operation: 'query' });
            },
        },
    });
    return modifiedDoc;
}
function removeClientSetsFromDocument(document) {
    checkDocument(document);
    var modifiedDoc = removeDirectivesFromDocument([
        {
            test: function (directive) { return directive.name.value === 'client'; },
            remove: true,
        },
    ], document);
    if (modifiedDoc) {
        modifiedDoc = Object(graphql_language_visitor__WEBPACK_IMPORTED_MODULE_0__["visit"])(modifiedDoc, {
            FragmentDefinition: {
                enter: function (node) {
                    if (node.selectionSet) {
                        var isTypenameOnly = node.selectionSet.selections.every(function (selection) {
                            return isField(selection) && selection.name.value === '__typename';
                        });
                        if (isTypenameOnly) {
                            return null;
                        }
                    }
                },
            },
        });
    }
    return modifiedDoc;
}

var canUseWeakMap = typeof WeakMap === 'function' && !(typeof navigator === 'object' &&
    navigator.product === 'ReactNative');

var toString = Object.prototype.toString;
function cloneDeep(value) {
    return cloneDeepHelper(value, new Map());
}
function cloneDeepHelper(val, seen) {
    switch (toString.call(val)) {
        case "[object Array]": {
            if (seen.has(val))
                return seen.get(val);
            var copy_1 = val.slice(0);
            seen.set(val, copy_1);
            copy_1.forEach(function (child, i) {
                copy_1[i] = cloneDeepHelper(child, seen);
            });
            return copy_1;
        }
        case "[object Object]": {
            if (seen.has(val))
                return seen.get(val);
            var copy_2 = Object.create(Object.getPrototypeOf(val));
            seen.set(val, copy_2);
            Object.keys(val).forEach(function (key) {
                copy_2[key] = cloneDeepHelper(val[key], seen);
            });
            return copy_2;
        }
        default:
            return val;
    }
}

function getEnv() {
    if (typeof process !== 'undefined' && "development") {
        return "development";
    }
    return 'development';
}
function isEnv(env) {
    return getEnv() === env;
}
function isProduction() {
    return isEnv('production') === true;
}
function isDevelopment() {
    return isEnv('development') === true;
}
function isTest() {
    return isEnv('test') === true;
}

function tryFunctionOrLogError(f) {
    try {
        return f();
    }
    catch (e) {
        if (console.error) {
            console.error(e);
        }
    }
}
function graphQLResultHasError(result) {
    return result.errors && result.errors.length;
}

function deepFreeze(o) {
    Object.freeze(o);
    Object.getOwnPropertyNames(o).forEach(function (prop) {
        if (o[prop] !== null &&
            (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
            !Object.isFrozen(o[prop])) {
            deepFreeze(o[prop]);
        }
    });
    return o;
}
function maybeDeepFreeze(obj) {
    if (isDevelopment() || isTest()) {
        var symbolIsPolyfilled = typeof Symbol === 'function' && typeof Symbol('') === 'string';
        if (!symbolIsPolyfilled) {
            return deepFreeze(obj);
        }
    }
    return obj;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
function mergeDeep() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i] = arguments[_i];
    }
    return mergeDeepArray(sources);
}
function mergeDeepArray(sources) {
    var target = sources[0] || {};
    var count = sources.length;
    if (count > 1) {
        var pastCopies = [];
        target = shallowCopyForMerge(target, pastCopies);
        for (var i = 1; i < count; ++i) {
            target = mergeHelper(target, sources[i], pastCopies);
        }
    }
    return target;
}
function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
function mergeHelper(target, source, pastCopies) {
    if (isObject(source) && isObject(target)) {
        if (Object.isExtensible && !Object.isExtensible(target)) {
            target = shallowCopyForMerge(target, pastCopies);
        }
        Object.keys(source).forEach(function (sourceKey) {
            var sourceValue = source[sourceKey];
            if (hasOwnProperty.call(target, sourceKey)) {
                var targetValue = target[sourceKey];
                if (sourceValue !== targetValue) {
                    target[sourceKey] = mergeHelper(shallowCopyForMerge(targetValue, pastCopies), sourceValue, pastCopies);
                }
            }
            else {
                target[sourceKey] = sourceValue;
            }
        });
        return target;
    }
    return source;
}
function shallowCopyForMerge(value, pastCopies) {
    if (value !== null &&
        typeof value === 'object' &&
        pastCopies.indexOf(value) < 0) {
        if (Array.isArray(value)) {
            value = value.slice(0);
        }
        else {
            value = Object(tslib__WEBPACK_IMPORTED_MODULE_2__["__assign"])({ __proto__: Object.getPrototypeOf(value) }, value);
        }
        pastCopies.push(value);
    }
    return value;
}

var haveWarned = Object.create({});
function warnOnceInDevelopment(msg, type) {
    if (type === void 0) { type = 'warn'; }
    if (!isProduction() && !haveWarned[msg]) {
        if (!isTest()) {
            haveWarned[msg] = true;
        }
        if (type === 'error') {
            console.error(msg);
        }
        else {
            console.warn(msg);
        }
    }
}

function stripSymbols(data) {
    return JSON.parse(JSON.stringify(data));
}


//# sourceMappingURL=bundle.esm.js.map

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/optimism/lib/bundle.esm.js":
/*!*************************************************!*\
  !*** ./node_modules/optimism/lib/bundle.esm.js ***!
  \*************************************************/
/*! exports provided: asyncFromGen, bindContext, noContext, setTimeout, KeyTrie, defaultMakeCacheKey, wrap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KeyTrie", function() { return KeyTrie; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultMakeCacheKey", function() { return defaultMakeCacheKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wrap", function() { return wrap; });
/* harmony import */ var _wry_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wry/context */ "./node_modules/@wry/context/lib/context.esm.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "asyncFromGen", function() { return _wry_context__WEBPACK_IMPORTED_MODULE_0__["asyncFromGen"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "bindContext", function() { return _wry_context__WEBPACK_IMPORTED_MODULE_0__["bind"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "noContext", function() { return _wry_context__WEBPACK_IMPORTED_MODULE_0__["noContext"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setTimeout", function() { return _wry_context__WEBPACK_IMPORTED_MODULE_0__["setTimeout"]; });




function defaultDispose() { }
var Cache = /** @class */ (function () {
    function Cache(max, dispose) {
        if (max === void 0) { max = Infinity; }
        if (dispose === void 0) { dispose = defaultDispose; }
        this.max = max;
        this.dispose = dispose;
        this.map = new Map();
        this.newest = null;
        this.oldest = null;
    }
    Cache.prototype.has = function (key) {
        return this.map.has(key);
    };
    Cache.prototype.get = function (key) {
        var entry = this.getEntry(key);
        return entry && entry.value;
    };
    Cache.prototype.getEntry = function (key) {
        var entry = this.map.get(key);
        if (entry && entry !== this.newest) {
            var older = entry.older, newer = entry.newer;
            if (newer) {
                newer.older = older;
            }
            if (older) {
                older.newer = newer;
            }
            entry.older = this.newest;
            entry.older.newer = entry;
            entry.newer = null;
            this.newest = entry;
            if (entry === this.oldest) {
                this.oldest = newer;
            }
        }
        return entry;
    };
    Cache.prototype.set = function (key, value) {
        var entry = this.getEntry(key);
        if (entry) {
            return entry.value = value;
        }
        entry = {
            key: key,
            value: value,
            newer: null,
            older: this.newest
        };
        if (this.newest) {
            this.newest.newer = entry;
        }
        this.newest = entry;
        this.oldest = this.oldest || entry;
        this.map.set(key, entry);
        return entry.value;
    };
    Cache.prototype.clean = function () {
        while (this.oldest && this.map.size > this.max) {
            this.delete(this.oldest.key);
        }
    };
    Cache.prototype.delete = function (key) {
        var entry = this.map.get(key);
        if (entry) {
            if (entry === this.newest) {
                this.newest = entry.older;
            }
            if (entry === this.oldest) {
                this.oldest = entry.newer;
            }
            if (entry.newer) {
                entry.newer.older = entry.older;
            }
            if (entry.older) {
                entry.older.newer = entry.newer;
            }
            this.map.delete(key);
            this.dispose(entry.value, key);
            return true;
        }
        return false;
    };
    return Cache;
}());

var parentEntrySlot = new _wry_context__WEBPACK_IMPORTED_MODULE_0__["Slot"]();

var reusableEmptyArray = [];
var emptySetPool = [];
var POOL_TARGET_SIZE = 100;
// Since this package might be used browsers, we should avoid using the
// Node built-in assert module.
function assert(condition, optionalMessage) {
    if (!condition) {
        throw new Error(optionalMessage || "assertion failure");
    }
}
function valueIs(a, b) {
    var len = a.length;
    return (
    // Unknown values are not equal to each other.
    len > 0 &&
        // Both values must be ordinary (or both exceptional) to be equal.
        len === b.length &&
        // The underlying value or exception must be the same.
        a[len - 1] === b[len - 1]);
}
function valueGet(value) {
    switch (value.length) {
        case 0: throw new Error("unknown value");
        case 1: return value[0];
        case 2: throw value[1];
    }
}
function valueCopy(value) {
    return value.slice(0);
}
var Entry = /** @class */ (function () {
    function Entry(fn, args) {
        this.fn = fn;
        this.args = args;
        this.parents = new Set();
        this.childValues = new Map();
        // When this Entry has children that are dirty, this property becomes
        // a Set containing other Entry objects, borrowed from emptySetPool.
        // When the set becomes empty, it gets recycled back to emptySetPool.
        this.dirtyChildren = null;
        this.dirty = true;
        this.recomputing = false;
        this.value = [];
        ++Entry.count;
    }
    // This is the most important method of the Entry API, because it
    // determines whether the cached this.value can be returned immediately,
    // or must be recomputed. The overall performance of the caching system
    // depends on the truth of the following observations: (1) this.dirty is
    // usually false, (2) this.dirtyChildren is usually null/empty, and thus
    // (3) valueGet(this.value) is usually returned without recomputation.
    Entry.prototype.recompute = function () {
        assert(!this.recomputing, "already recomputing");
        if (!rememberParent(this) && maybeReportOrphan(this)) {
            // The recipient of the entry.reportOrphan callback decided to dispose
            // of this orphan entry by calling entry.dispose(), so we don't need to
            // (and should not) proceed with the recomputation.
            return void 0;
        }
        return mightBeDirty(this)
            ? reallyRecompute(this)
            : valueGet(this.value);
    };
    Entry.prototype.setDirty = function () {
        if (this.dirty)
            return;
        this.dirty = true;
        this.value.length = 0;
        reportDirty(this);
        // We can go ahead and unsubscribe here, since any further dirty
        // notifications we receive will be redundant, and unsubscribing may
        // free up some resources, e.g. file watchers.
        maybeUnsubscribe(this);
    };
    Entry.prototype.dispose = function () {
        var _this = this;
        forgetChildren(this).forEach(maybeReportOrphan);
        maybeUnsubscribe(this);
        // Because this entry has been kicked out of the cache (in index.js),
        // we've lost the ability to find out if/when this entry becomes dirty,
        // whether that happens through a subscription, because of a direct call
        // to entry.setDirty(), or because one of its children becomes dirty.
        // Because of this loss of future information, we have to assume the
        // worst (that this entry might have become dirty very soon), so we must
        // immediately mark this entry's parents as dirty. Normally we could
        // just call entry.setDirty() rather than calling parent.setDirty() for
        // each parent, but that would leave this entry in parent.childValues
        // and parent.dirtyChildren, which would prevent the child from being
        // truly forgotten.
        this.parents.forEach(function (parent) {
            parent.setDirty();
            forgetChild(parent, _this);
        });
    };
    Entry.count = 0;
    return Entry;
}());
function rememberParent(child) {
    var parent = parentEntrySlot.getValue();
    if (parent) {
        child.parents.add(parent);
        if (!parent.childValues.has(child)) {
            parent.childValues.set(child, []);
        }
        if (mightBeDirty(child)) {
            reportDirtyChild(parent, child);
        }
        else {
            reportCleanChild(parent, child);
        }
        return parent;
    }
}
function reallyRecompute(entry) {
    // Since this recomputation is likely to re-remember some of this
    // entry's children, we forget our children here but do not call
    // maybeReportOrphan until after the recomputation finishes.
    var originalChildren = forgetChildren(entry);
    // Set entry as the parent entry while calling recomputeNewValue(entry).
    parentEntrySlot.withValue(entry, recomputeNewValue, [entry]);
    if (maybeSubscribe(entry)) {
        // If we successfully recomputed entry.value and did not fail to
        // (re)subscribe, then this Entry is no longer explicitly dirty.
        setClean(entry);
    }
    // Now that we've had a chance to re-remember any children that were
    // involved in the recomputation, we can safely report any orphan
    // children that remain.
    originalChildren.forEach(maybeReportOrphan);
    return valueGet(entry.value);
}
function recomputeNewValue(entry) {
    entry.recomputing = true;
    // Set entry.value as unknown.
    entry.value.length = 0;
    try {
        // If entry.fn succeeds, entry.value will become a normal Value.
        entry.value[0] = entry.fn.apply(null, entry.args);
    }
    catch (e) {
        // If entry.fn throws, entry.value will become exceptional.
        entry.value[1] = e;
    }
    // Either way, this line is always reached.
    entry.recomputing = false;
}
function mightBeDirty(entry) {
    return entry.dirty || !!(entry.dirtyChildren && entry.dirtyChildren.size);
}
function setClean(entry) {
    entry.dirty = false;
    if (mightBeDirty(entry)) {
        // This Entry may still have dirty children, in which case we can't
        // let our parents know we're clean just yet.
        return;
    }
    reportClean(entry);
}
function reportDirty(child) {
    child.parents.forEach(function (parent) { return reportDirtyChild(parent, child); });
}
function reportClean(child) {
    child.parents.forEach(function (parent) { return reportCleanChild(parent, child); });
}
// Let a parent Entry know that one of its children may be dirty.
function reportDirtyChild(parent, child) {
    // Must have called rememberParent(child) before calling
    // reportDirtyChild(parent, child).
    assert(parent.childValues.has(child));
    assert(mightBeDirty(child));
    if (!parent.dirtyChildren) {
        parent.dirtyChildren = emptySetPool.pop() || new Set;
    }
    else if (parent.dirtyChildren.has(child)) {
        // If we already know this child is dirty, then we must have already
        // informed our own parents that we are dirty, so we can terminate
        // the recursion early.
        return;
    }
    parent.dirtyChildren.add(child);
    reportDirty(parent);
}
// Let a parent Entry know that one of its children is no longer dirty.
function reportCleanChild(parent, child) {
    // Must have called rememberChild(child) before calling
    // reportCleanChild(parent, child).
    assert(parent.childValues.has(child));
    assert(!mightBeDirty(child));
    var childValue = parent.childValues.get(child);
    if (childValue.length === 0) {
        parent.childValues.set(child, valueCopy(child.value));
    }
    else if (!valueIs(childValue, child.value)) {
        parent.setDirty();
    }
    removeDirtyChild(parent, child);
    if (mightBeDirty(parent)) {
        return;
    }
    reportClean(parent);
}
function removeDirtyChild(parent, child) {
    var dc = parent.dirtyChildren;
    if (dc) {
        dc.delete(child);
        if (dc.size === 0) {
            if (emptySetPool.length < POOL_TARGET_SIZE) {
                emptySetPool.push(dc);
            }
            parent.dirtyChildren = null;
        }
    }
}
// If the given entry has a reportOrphan method, and no remaining parents,
// call entry.reportOrphan and return true iff it returns true. The
// reportOrphan function should return true to indicate entry.dispose()
// has been called, and the entry has been removed from any other caches
// (see index.js for the only current example).
function maybeReportOrphan(entry) {
    return entry.parents.size === 0 &&
        typeof entry.reportOrphan === "function" &&
        entry.reportOrphan() === true;
}
// Removes all children from this entry and returns an array of the
// removed children.
function forgetChildren(parent) {
    var children = reusableEmptyArray;
    if (parent.childValues.size > 0) {
        children = [];
        parent.childValues.forEach(function (_value, child) {
            forgetChild(parent, child);
            children.push(child);
        });
    }
    // After we forget all our children, this.dirtyChildren must be empty
    // and therefore must have been reset to null.
    assert(parent.dirtyChildren === null);
    return children;
}
function forgetChild(parent, child) {
    child.parents.delete(parent);
    parent.childValues.delete(child);
    removeDirtyChild(parent, child);
}
function maybeSubscribe(entry) {
    if (typeof entry.subscribe === "function") {
        try {
            maybeUnsubscribe(entry); // Prevent double subscriptions.
            entry.unsubscribe = entry.subscribe.apply(null, entry.args);
        }
        catch (e) {
            // If this Entry has a subscribe function and it threw an exception
            // (or an unsubscribe function it previously returned now throws),
            // return false to indicate that we were not able to subscribe (or
            // unsubscribe), and this Entry should remain dirty.
            entry.setDirty();
            return false;
        }
    }
    // Returning true indicates either that there was no entry.subscribe
    // function or that it succeeded.
    return true;
}
function maybeUnsubscribe(entry) {
    var unsubscribe = entry.unsubscribe;
    if (typeof unsubscribe === "function") {
        entry.unsubscribe = void 0;
        unsubscribe();
    }
}

// A trie data structure that holds object keys weakly, yet can also hold
// non-object keys, unlike the native `WeakMap`.
var KeyTrie = /** @class */ (function () {
    function KeyTrie(weakness) {
        this.weakness = weakness;
    }
    KeyTrie.prototype.lookup = function () {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i] = arguments[_i];
        }
        return this.lookupArray(array);
    };
    KeyTrie.prototype.lookupArray = function (array) {
        var node = this;
        array.forEach(function (key) { return node = node.getChildTrie(key); });
        return node.data || (node.data = Object.create(null));
    };
    KeyTrie.prototype.getChildTrie = function (key) {
        var map = this.weakness && isObjRef(key)
            ? this.weak || (this.weak = new WeakMap())
            : this.strong || (this.strong = new Map());
        var child = map.get(key);
        if (!child)
            map.set(key, child = new KeyTrie(this.weakness));
        return child;
    };
    return KeyTrie;
}());
function isObjRef(value) {
    switch (typeof value) {
        case "object":
            if (value === null)
                break;
        // Fall through to return true...
        case "function":
            return true;
    }
    return false;
}

// The defaultMakeCacheKey function is remarkably powerful, because it gives
// a unique object for any shallow-identical list of arguments. If you need
// to implement a custom makeCacheKey function, you may find it helpful to
// delegate the final work to defaultMakeCacheKey, which is why we export it
// here. However, you may want to avoid defaultMakeCacheKey if your runtime
// does not support WeakMap, or you have the ability to return a string key.
// In those cases, just write your own custom makeCacheKey functions.
var keyTrie = new KeyTrie(typeof WeakMap === "function");
function defaultMakeCacheKey() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return keyTrie.lookupArray(args);
}
var caches = new Set();
function wrap(originalFunction, options) {
    if (options === void 0) { options = Object.create(null); }
    var cache = new Cache(options.max || Math.pow(2, 16), function (entry) { return entry.dispose(); });
    var disposable = !!options.disposable;
    var makeCacheKey = options.makeCacheKey || defaultMakeCacheKey;
    function optimistic() {
        if (disposable && !parentEntrySlot.hasValue()) {
            // If there's no current parent computation, and this wrapped
            // function is disposable (meaning we don't care about entry.value,
            // just dependency tracking), then we can short-cut everything else
            // in this function, because entry.recompute() is going to recycle
            // the entry object without recomputing anything, anyway.
            return void 0;
        }
        var key = makeCacheKey.apply(null, arguments);
        if (key === void 0) {
            return originalFunction.apply(null, arguments);
        }
        var args = Array.prototype.slice.call(arguments);
        var entry = cache.get(key);
        if (entry) {
            entry.args = args;
        }
        else {
            entry = new Entry(originalFunction, args);
            cache.set(key, entry);
            entry.subscribe = options.subscribe;
            if (disposable) {
                entry.reportOrphan = function () { return cache.delete(key); };
            }
        }
        var value = entry.recompute();
        // Move this entry to the front of the least-recently used queue,
        // since we just finished computing its value.
        cache.set(key, entry);
        caches.add(cache);
        // Clean up any excess entries in the cache, but only if there is no
        // active parent entry, meaning we're not in the middle of a larger
        // computation that might be flummoxed by the cleaning.
        if (!parentEntrySlot.hasValue()) {
            caches.forEach(function (cache) { return cache.clean(); });
            caches.clear();
        }
        // If options.disposable is truthy, the caller of wrap is telling us
        // they don't care about the result of entry.recompute(), so we should
        // avoid returning the value, so it won't be accidentally used.
        return disposable ? void 0 : value;
    }
    optimistic.dirty = function () {
        var key = makeCacheKey.apply(null, arguments);
        var child = key !== void 0 && cache.get(key);
        if (child) {
            child.setDirty();
        }
    };
    return optimistic;
}


//# sourceMappingURL=bundle.esm.js.map


/***/ }),

/***/ "./node_modules/symbol-observable/es/index.js":
/*!****************************************************!*\
  !*** ./node_modules/symbol-observable/es/index.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global, module) {/* harmony import */ var _ponyfill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ponyfill.js */ "./node_modules/symbol-observable/es/ponyfill.js");
/* global window */


var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {}

var result = Object(_ponyfill_js__WEBPACK_IMPORTED_MODULE_0__["default"])(root);
/* harmony default export */ __webpack_exports__["default"] = (result);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../next/dist/compiled/webpack/global.js */ "./node_modules/next/dist/compiled/webpack/global.js"), __webpack_require__(/*! ./../../next/dist/compiled/webpack/harmony-module.js */ "./node_modules/next/dist/compiled/webpack/harmony-module.js")(module)))

/***/ }),

/***/ "./node_modules/symbol-observable/es/ponyfill.js":
/*!*******************************************************!*\
  !*** ./node_modules/symbol-observable/es/ponyfill.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return symbolObservablePonyfill; });
function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};


/***/ }),

/***/ "./node_modules/ts-invariant/lib/invariant.esm.js":
/*!********************************************************!*\
  !*** ./node_modules/ts-invariant/lib/invariant.esm.js ***!
  \********************************************************/
/*! exports provided: default, InvariantError, invariant, process */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvariantError", function() { return InvariantError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "invariant", function() { return invariant; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "process", function() { return processStub; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");


var genericMessage = "Invariant Violation";
var _a = Object.setPrototypeOf, setPrototypeOf = _a === void 0 ? function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
} : _a;
var InvariantError = /** @class */ (function (_super) {
    Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"])(InvariantError, _super);
    function InvariantError(message) {
        if (message === void 0) { message = genericMessage; }
        var _this = _super.call(this, typeof message === "number"
            ? genericMessage + ": " + message + " (see https://github.com/apollographql/invariant-packages)"
            : message) || this;
        _this.framesToPop = 1;
        _this.name = genericMessage;
        setPrototypeOf(_this, InvariantError.prototype);
        return _this;
    }
    return InvariantError;
}(Error));
function invariant(condition, message) {
    if (!condition) {
        throw new InvariantError(message);
    }
}
function wrapConsoleMethod(method) {
    return function () {
        return console[method].apply(console, arguments);
    };
}
(function (invariant) {
    invariant.warn = wrapConsoleMethod("warn");
    invariant.error = wrapConsoleMethod("error");
})(invariant || (invariant = {}));
// Code that uses ts-invariant with rollup-plugin-invariant may want to
// import this process stub to avoid errors evaluating process.env.NODE_ENV.
// However, because most ESM-to-CJS compilers will rewrite the process import
// as tsInvariant.process, which prevents proper replacement by minifiers, we
// also attempt to define the stub globally when it is not already defined.
var processStub = { env: {} };
if (typeof process === "object") {
    processStub = process;
}
else
    try {
        // Using Function to evaluate this assignment in global scope also escapes
        // the strict mode of the current module, thereby allowing the assignment.
        // Inspired by https://github.com/facebook/regenerator/pull/369.
        Function("stub", "process = stub")(processStub);
    }
    catch (atLeastWeTried) {
        // The assignment can fail if a Content Security Policy heavy-handedly
        // forbids Function usage. In those environments, developers should take
        // extra care to replace process.env.NODE_ENV in their production builds,
        // or define an appropriate global.process polyfill.
    }
var invariant$1 = invariant;

/* harmony default export */ __webpack_exports__["default"] = (invariant$1);

//# sourceMappingURL=invariant.esm.js.map

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/zen-observable-ts/lib/bundle.esm.js":
/*!**********************************************************!*\
  !*** ./node_modules/zen-observable-ts/lib/bundle.esm.js ***!
  \**********************************************************/
/*! exports provided: default, Observable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Observable", function() { return Observable; });
/* harmony import */ var zen_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zen-observable */ "./node_modules/zen-observable/index.js");
/* harmony import */ var zen_observable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(zen_observable__WEBPACK_IMPORTED_MODULE_0__);


var Observable = zen_observable__WEBPACK_IMPORTED_MODULE_0___default.a;

/* harmony default export */ __webpack_exports__["default"] = (Observable);

//# sourceMappingURL=bundle.esm.js.map


/***/ }),

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Layout */ "./components/Layout.js");
/* harmony import */ var _components_Product__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/Product */ "./components/Product.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/index.js");
/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @apollo/client */ "./node_modules/@apollo/client/index.js");
/* harmony import */ var apollo_boost__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! apollo-boost */ "./node_modules/apollo-boost/lib/bundle.esm.js");





var _jsxFileName = "C:\\Users\\coolv\\OneDrive\\Desktop\\Plantisserie\\pages\\index.js",
    _this = undefined;

function _templateObject() {
  var data = Object(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["query{\n        products(first: 20) {\n            nodes {\n                id\n                databaseId\n                averageRating\n                slug\n                description\n                image {\n                    uri\n                    title\n                    srcSet\n                    sourceUrl\n                }\n            name\n            }\n        }\n}"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}






var PRODUCTS_QUERY = Object(_apollo_client__WEBPACK_IMPORTED_MODULE_7__["gql"])(_templateObject());

var Index = function Index(props) {
  var products = props.products;
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__["jsxDEV"])(_components_Layout__WEBPACK_IMPORTED_MODULE_4__["default"], {
    children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__["jsxDEV"])(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__["Container"], {
      children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__["jsxDEV"])(react_bootstrap__WEBPACK_IMPORTED_MODULE_6__["Row"], {
        className: "product-container",
        children: products.length ? products.map(function (product) {
          return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__["jsxDEV"])(_components_Product__WEBPACK_IMPORTED_MODULE_5__["default"], {
            product: product
          }, product.id, false, {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 50
          }, _this);
        }) : ''
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 37,
        columnNumber: 17
      }, _this)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 13
    }, _this)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 35,
    columnNumber: 9
  }, _this);
};

_c = Index;
Index.getInitialProps = /*#__PURE__*/Object(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
  var result;
  return C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return apollo_boost__WEBPACK_IMPORTED_MODULE_8__["default"].query({
            query: PRODUCTS_QUERY
          });

        case 2:
          result = _context.sent;
          return _context.abrupt("return", {
            products: result.data.products.nodes
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));
/* harmony default export */ __webpack_exports__["default"] = (Index);

var _c;

$RefreshReg$(_c, "Index");

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.i);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/next/dist/compiled/webpack/harmony-module.js */ "./node_modules/next/dist/compiled/webpack/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vbm9kZV9tb2R1bGVzL0B3cnkvY29udGV4dC9saWIvY29udGV4dC5lc20uanMiLCJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy9Ad3J5L2VxdWFsaXR5L2xpYi9lcXVhbGl0eS5lc20uanMiLCJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy9hcG9sbG8tYm9vc3QvbGliL2J1bmRsZS5lc20uanMiLCJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy9hcG9sbG8tY2FjaGUtaW5tZW1vcnkvbGliL2J1bmRsZS5lc20uanMiLCJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy9hcG9sbG8tY2FjaGUvbGliL2J1bmRsZS5lc20uanMiLCJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy9hcG9sbG8tY2xpZW50L2J1bmRsZS5lc20uanMiLCJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy9hcG9sbG8tbGluay1lcnJvci9saWIvYnVuZGxlLmVzbS5qcyIsIndlYnBhY2s6Ly9fTl9FLy4vbm9kZV9tb2R1bGVzL2Fwb2xsby1saW5rLWh0dHAtY29tbW9uL2xpYi9idW5kbGUuZXNtLmpzIiwid2VicGFjazovL19OX0UvLi9ub2RlX21vZHVsZXMvYXBvbGxvLWxpbmstaHR0cC9saWIvYnVuZGxlLmVzbS5qcyIsIndlYnBhY2s6Ly9fTl9FLy4vbm9kZV9tb2R1bGVzL2Fwb2xsby1saW5rL2xpYi9idW5kbGUuZXNtLmpzIiwid2VicGFjazovL19OX0UvLi9ub2RlX21vZHVsZXMvYXBvbGxvLXV0aWxpdGllcy9saWIvYnVuZGxlLmVzbS5qcyIsIndlYnBhY2s6Ly9fTl9FLy4vbm9kZV9tb2R1bGVzL29wdGltaXNtL2xpYi9idW5kbGUuZXNtLmpzIiwid2VicGFjazovL19OX0UvLi9ub2RlX21vZHVsZXMvc3ltYm9sLW9ic2VydmFibGUvZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy9zeW1ib2wtb2JzZXJ2YWJsZS9lcy9wb255ZmlsbC5qcyIsIndlYnBhY2s6Ly9fTl9FLy4vbm9kZV9tb2R1bGVzL3RzLWludmFyaWFudC9saWIvaW52YXJpYW50LmVzbS5qcyIsIndlYnBhY2s6Ly9fTl9FLy4vbm9kZV9tb2R1bGVzL3plbi1vYnNlcnZhYmxlLXRzL2xpYi9idW5kbGUuZXNtLmpzIiwid2VicGFjazovL19OX0UvLi9wYWdlcy9pbmRleC5qcyJdLCJuYW1lcyI6WyJQUk9EVUNUU19RVUVSWSIsImdxbCIsIkluZGV4IiwicHJvcHMiLCJwcm9kdWN0cyIsImxlbmd0aCIsIm1hcCIsInByb2R1Y3QiLCJpZCIsImdldEluaXRpYWxQcm9wcyIsImNsaWVudCIsInF1ZXJ5IiwicmVzdWx0IiwiZGF0YSIsIm5vZGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxXQUFXO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxJQUFJO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsaUNBQWlDO0FBQ2hGLGdEQUFnRCxrQ0FBa0M7QUFDbEY7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRThHO0FBQzlHOzs7Ozs7Ozs7Ozs7O0FDdE1BO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixjQUFjO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsY0FBYztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWUsb0VBQUssRUFBQztBQUNKO0FBQ2pCOzs7Ozs7Ozs7Ozs7O0FDaElBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWtDO0FBQ2dCO0FBQ3BCO0FBQ3VCO0FBQ3pCO0FBQzBCO0FBQ2hCO0FBQ007QUFDQTtBQUNBO0FBQ0M7QUFDSjs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsd0NBQXdDLEVBQUU7QUFDdkY7QUFDQTtBQUNBLDZDQUE2Qyx3Q0FBd0MsRUFBRTtBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHVCQUF1QjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0Msc0NBQXNDLEVBQUU7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QiwrQkFBK0I7QUFDNUQsNEVBQTRFLHdCQUF3QixFQUFFO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELDBCQUEwQjtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLHNCQUFzQixFQUFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUU4QztBQUM5Qzs7Ozs7Ozs7Ozs7OztBQzlkQTtBQUFBO0FBQUE7QUFDcUM7O0FBRXJDOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxDQUFDLFVBQVUsSUFBNkI7QUFDeEM7QUFDQSxDQUFDLE1BQU0sRUFFTjs7QUFFRCxhQUFhLDREQUFRO0FBQ04scUVBQU0sRUFBQzs7Ozs7Ozs7Ozs7Ozs7QUNsQnRCO0FBQUE7QUFBZTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNoQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFrQzs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxJQUFJLHVEQUFTO0FBQ2I7QUFDQSxpQ0FBaUMsMEJBQTBCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsOEJBQThCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlLDBFQUFXLEVBQUM7QUFDa0M7QUFDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQUE7QUFBQTtBQUFBO0FBQTJDOztBQUUzQyxpQkFBaUIscURBQWE7O0FBRWYseUVBQVUsRUFBQztBQUNKO0FBQ3RCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBLElBQU1BLGNBQWMsR0FBR0MsMERBQUgsbUJBQXBCOztBQW1CQSxJQUFNQyxLQUFLLEdBQUcsU0FBUkEsS0FBUSxDQUFFQyxLQUFGLEVBQWE7QUFBQSxNQUVmQyxRQUZlLEdBRUZELEtBRkUsQ0FFZkMsUUFGZTtBQUl2QixzQkFDSSxxRUFBQywwREFBRDtBQUFBLDJCQUNJLHFFQUFDLHlEQUFEO0FBQUEsNkJBQ0kscUVBQUMsbURBQUQ7QUFBSyxpQkFBUyxFQUFDLG1CQUFmO0FBQUEsa0JBQ01BLFFBQVEsQ0FBQ0MsTUFBVCxHQUNFRCxRQUFRLENBQUNFLEdBQVQsQ0FBYyxVQUFBQyxPQUFPO0FBQUEsOEJBQUkscUVBQUMsMkRBQUQ7QUFBNEIsbUJBQU8sRUFBR0E7QUFBdEMsYUFBZUEsT0FBTyxDQUFDQyxFQUF2QjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUFKO0FBQUEsU0FBckIsQ0FERixHQUVFO0FBSFI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURKO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFESjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBREo7QUFXSCxDQWZEOztLQUFNTixLO0FBaUJOQSxLQUFLLENBQUNPLGVBQU4saVRBQXdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQ0NDLG9EQUFNLENBQUNDLEtBQVAsQ0FBYztBQUFFQSxpQkFBSyxFQUFFWDtBQUFULFdBQWQsQ0FERDs7QUFBQTtBQUNkWSxnQkFEYztBQUFBLDJDQUViO0FBQ0hSLG9CQUFRLEVBQUVRLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZVCxRQUFaLENBQXFCVTtBQUQ1QixXQUZhOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQXhCO0FBT2VaLG9FQUFmIiwiZmlsZSI6InN0YXRpYy93ZWJwYWNrL3BhZ2VzL2luZGV4LmQzZDc1Y2Y0NDY0OTAwYjE5ZDlkLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGN1cnJlbnRDb250ZXh0IHZhcmlhYmxlIHdpbGwgb25seSBiZSB1c2VkIGlmIHRoZSBtYWtlU2xvdENsYXNzXHJcbi8vIGZ1bmN0aW9uIGlzIGNhbGxlZCwgd2hpY2ggaGFwcGVucyBvbmx5IGlmIHRoaXMgaXMgdGhlIGZpcnN0IGNvcHkgb2YgdGhlXHJcbi8vIEB3cnkvY29udGV4dCBwYWNrYWdlIHRvIGJlIGltcG9ydGVkLlxyXG52YXIgY3VycmVudENvbnRleHQgPSBudWxsO1xyXG4vLyBUaGlzIHVuaXF1ZSBpbnRlcm5hbCBvYmplY3QgaXMgdXNlZCB0byBkZW5vdGUgdGhlIGFic2VuY2Ugb2YgYSB2YWx1ZVxyXG4vLyBmb3IgYSBnaXZlbiBTbG90LCBhbmQgaXMgbmV2ZXIgZXhwb3NlZCB0byBvdXRzaWRlIGNvZGUuXHJcbnZhciBNSVNTSU5HX1ZBTFVFID0ge307XHJcbnZhciBpZENvdW50ZXIgPSAxO1xyXG4vLyBBbHRob3VnaCB3ZSBjYW4ndCBkbyBhbnl0aGluZyBhYm91dCB0aGUgY29zdCBvZiBkdXBsaWNhdGVkIGNvZGUgZnJvbVxyXG4vLyBhY2NpZGVudGFsbHkgYnVuZGxpbmcgbXVsdGlwbGUgY29waWVzIG9mIHRoZSBAd3J5L2NvbnRleHQgcGFja2FnZSwgd2UgY2FuXHJcbi8vIGF2b2lkIGNyZWF0aW5nIHRoZSBTbG90IGNsYXNzIG1vcmUgdGhhbiBvbmNlIHVzaW5nIG1ha2VTbG90Q2xhc3MuXHJcbnZhciBtYWtlU2xvdENsYXNzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU2xvdCgpIHtcclxuICAgICAgICAvLyBJZiB5b3UgaGF2ZSBhIFNsb3Qgb2JqZWN0LCB5b3UgY2FuIGZpbmQgb3V0IGl0cyBzbG90LmlkLCBidXQgeW91IGNhbm5vdFxyXG4gICAgICAgIC8vIGd1ZXNzIHRoZSBzbG90LmlkIG9mIGEgU2xvdCB5b3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8sIHRoYW5rcyB0byB0aGVcclxuICAgICAgICAvLyByYW5kb21pemVkIHN1ZmZpeC5cclxuICAgICAgICB0aGlzLmlkID0gW1xyXG4gICAgICAgICAgICBcInNsb3RcIixcclxuICAgICAgICAgICAgaWRDb3VudGVyKyssXHJcbiAgICAgICAgICAgIERhdGUubm93KCksXHJcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpLFxyXG4gICAgICAgIF0uam9pbihcIjpcIik7XHJcbiAgICB9XHJcbiAgICBTbG90LnByb3RvdHlwZS5oYXNWYWx1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBjb250ZXh0XzEgPSBjdXJyZW50Q29udGV4dDsgY29udGV4dF8xOyBjb250ZXh0XzEgPSBjb250ZXh0XzEucGFyZW50KSB7XHJcbiAgICAgICAgICAgIC8vIFdlIHVzZSB0aGUgU2xvdCBvYmplY3QgaXNlbGYgYXMgYSBrZXkgdG8gaXRzIHZhbHVlLCB3aGljaCBtZWFucyB0aGVcclxuICAgICAgICAgICAgLy8gdmFsdWUgY2Fubm90IGJlIG9idGFpbmVkIHdpdGhvdXQgYSByZWZlcmVuY2UgdG8gdGhlIFNsb3Qgb2JqZWN0LlxyXG4gICAgICAgICAgICBpZiAodGhpcy5pZCBpbiBjb250ZXh0XzEuc2xvdHMpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGNvbnRleHRfMS5zbG90c1t0aGlzLmlkXTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gTUlTU0lOR19WQUxVRSlcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGlmIChjb250ZXh0XzEgIT09IGN1cnJlbnRDb250ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2FjaGUgdGhlIHZhbHVlIGluIGN1cnJlbnRDb250ZXh0LnNsb3RzIHNvIHRoZSBuZXh0IGxvb2t1cCB3aWxsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmUgZmFzdGVyLiBUaGlzIGNhY2hpbmcgaXMgc2FmZSBiZWNhdXNlIHRoZSB0cmVlIG9mIGNvbnRleHRzIGFuZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSB2YWx1ZXMgb2YgdGhlIHNsb3RzIGFyZSBsb2dpY2FsbHkgaW1tdXRhYmxlLlxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRDb250ZXh0LnNsb3RzW3RoaXMuaWRdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudENvbnRleHQpIHtcclxuICAgICAgICAgICAgLy8gSWYgYSB2YWx1ZSB3YXMgbm90IGZvdW5kIGZvciB0aGlzIFNsb3QsIGl0J3MgbmV2ZXIgZ29pbmcgdG8gYmUgZm91bmRcclxuICAgICAgICAgICAgLy8gbm8gbWF0dGVyIGhvdyBtYW55IHRpbWVzIHdlIGxvb2sgaXQgdXAsIHNvIHdlIG1pZ2h0IGFzIHdlbGwgY2FjaGVcclxuICAgICAgICAgICAgLy8gdGhlIGFic2VuY2Ugb2YgdGhlIHZhbHVlLCB0b28uXHJcbiAgICAgICAgICAgIGN1cnJlbnRDb250ZXh0LnNsb3RzW3RoaXMuaWRdID0gTUlTU0lOR19WQUxVRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIFNsb3QucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1ZhbHVlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRDb250ZXh0LnNsb3RzW3RoaXMuaWRdO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBTbG90LnByb3RvdHlwZS53aXRoVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUsIGNhbGxiYWNrLCBcclxuICAgIC8vIEdpdmVuIHRoZSBwcmV2YWxlbmNlIG9mIGFycm93IGZ1bmN0aW9ucywgc3BlY2lmeWluZyBhcmd1bWVudHMgaXMgbGlrZWx5XHJcbiAgICAvLyB0byBiZSBtdWNoIG1vcmUgY29tbW9uIHRoYW4gc3BlY2lmeWluZyBgdGhpc2AsIGhlbmNlIHRoaXMgb3JkZXJpbmc6XHJcbiAgICBhcmdzLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIHZhciBzbG90cyA9IChfYSA9IHtcclxuICAgICAgICAgICAgICAgIF9fcHJvdG9fXzogbnVsbFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBfYVt0aGlzLmlkXSA9IHZhbHVlLFxyXG4gICAgICAgICAgICBfYSk7XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IGN1cnJlbnRDb250ZXh0O1xyXG4gICAgICAgIGN1cnJlbnRDb250ZXh0ID0geyBwYXJlbnQ6IHBhcmVudCwgc2xvdHM6IHNsb3RzIH07XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5IGFsbG93cyB0aGUgYXJndW1lbnRzIGFycmF5IGFyZ3VtZW50IHRvIGJlXHJcbiAgICAgICAgICAgIC8vIG9taXR0ZWQgb3IgdW5kZWZpbmVkLCBzbyBhcmdzISBpcyBmaW5lIGhlcmUuXHJcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh0aGlzQXJnLCBhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDb250ZXh0ID0gcGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvLyBDYXB0dXJlIHRoZSBjdXJyZW50IGNvbnRleHQgYW5kIHdyYXAgYSBjYWxsYmFjayBmdW5jdGlvbiBzbyB0aGF0IGl0XHJcbiAgICAvLyByZWVzdGFibGlzaGVzIHRoZSBjYXB0dXJlZCBjb250ZXh0IHdoZW4gY2FsbGVkLlxyXG4gICAgU2xvdC5iaW5kID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGNvbnRleHQgPSBjdXJyZW50Q29udGV4dDtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgc2F2ZWQgPSBjdXJyZW50Q29udGV4dDtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvbnRleHQgPSBzYXZlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgLy8gSW1tZWRpYXRlbHkgcnVuIGEgY2FsbGJhY2sgZnVuY3Rpb24gd2l0aG91dCBhbnkgY2FwdHVyZWQgY29udGV4dC5cclxuICAgIFNsb3Qubm9Db250ZXh0ID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBcclxuICAgIC8vIEdpdmVuIHRoZSBwcmV2YWxlbmNlIG9mIGFycm93IGZ1bmN0aW9ucywgc3BlY2lmeWluZyBhcmd1bWVudHMgaXMgbGlrZWx5XHJcbiAgICAvLyB0byBiZSBtdWNoIG1vcmUgY29tbW9uIHRoYW4gc3BlY2lmeWluZyBgdGhpc2AsIGhlbmNlIHRoaXMgb3JkZXJpbmc6XHJcbiAgICBhcmdzLCB0aGlzQXJnKSB7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRDb250ZXh0KSB7XHJcbiAgICAgICAgICAgIHZhciBzYXZlZCA9IGN1cnJlbnRDb250ZXh0O1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvbnRleHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgLy8gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5IGFsbG93cyB0aGUgYXJndW1lbnRzIGFycmF5IGFyZ3VtZW50IHRvIGJlXHJcbiAgICAgICAgICAgICAgICAvLyBvbWl0dGVkIG9yIHVuZGVmaW5lZCwgc28gYXJncyEgaXMgZmluZSBoZXJlLlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudENvbnRleHQgPSBzYXZlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gU2xvdDtcclxufSgpKTsgfTtcclxuLy8gV2Ugc3RvcmUgYSBzaW5nbGUgZ2xvYmFsIGltcGxlbWVudGF0aW9uIG9mIHRoZSBTbG90IGNsYXNzIGFzIGEgcGVybWFuZW50XHJcbi8vIG5vbi1lbnVtZXJhYmxlIHN5bWJvbCBwcm9wZXJ0eSBvZiB0aGUgQXJyYXkgY29uc3RydWN0b3IuIFRoaXMgb2JmdXNjYXRpb25cclxuLy8gZG9lcyBub3RoaW5nIHRvIHByZXZlbnQgYWNjZXNzIHRvIHRoZSBTbG90IGNsYXNzLCBidXQgYXQgbGVhc3QgaXQgZW5zdXJlc1xyXG4vLyB0aGUgaW1wbGVtZW50YXRpb24gKGkuZS4gY3VycmVudENvbnRleHQpIGNhbm5vdCBiZSB0YW1wZXJlZCB3aXRoLCBhbmQgYWxsXHJcbi8vIGNvcGllcyBvZiB0aGUgQHdyeS9jb250ZXh0IHBhY2thZ2UgKGhvcGVmdWxseSBqdXN0IG9uZSkgd2lsbCBzaGFyZSB0aGVcclxuLy8gc2FtZSBTbG90IGltcGxlbWVudGF0aW9uLiBTaW5jZSB0aGUgZmlyc3QgY29weSBvZiB0aGUgQHdyeS9jb250ZXh0IHBhY2thZ2VcclxuLy8gdG8gYmUgaW1wb3J0ZWQgd2lucywgdGhpcyB0ZWNobmlxdWUgaW1wb3NlcyBhIHZlcnkgaGlnaCBjb3N0IGZvciBhbnlcclxuLy8gZnV0dXJlIGJyZWFraW5nIGNoYW5nZXMgdG8gdGhlIFNsb3QgY2xhc3MuXHJcbnZhciBnbG9iYWxLZXkgPSBcIkB3cnkvY29udGV4dDpTbG90XCI7XHJcbnZhciBob3N0ID0gQXJyYXk7XHJcbnZhciBTbG90ID0gaG9zdFtnbG9iYWxLZXldIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBTbG90ID0gbWFrZVNsb3RDbGFzcygpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaG9zdCwgZ2xvYmFsS2V5LCB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBob3N0W2dsb2JhbEtleV0gPSBTbG90LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgcmV0dXJuIFNsb3Q7XHJcbiAgICB9XHJcbn0oKTtcblxudmFyIGJpbmQgPSBTbG90LmJpbmQsIG5vQ29udGV4dCA9IFNsb3Qubm9Db250ZXh0O1xyXG5mdW5jdGlvbiBzZXRUaW1lb3V0V2l0aENvbnRleHQoY2FsbGJhY2ssIGRlbGF5KSB7XHJcbiAgICByZXR1cm4gc2V0VGltZW91dChiaW5kKGNhbGxiYWNrKSwgZGVsYXkpO1xyXG59XHJcbi8vIFR1cm4gYW55IGdlbmVyYXRvciBmdW5jdGlvbiBpbnRvIGFuIGFzeW5jIGZ1bmN0aW9uICh1c2luZyB5aWVsZCBpbnN0ZWFkXHJcbi8vIG9mIGF3YWl0KSwgd2l0aCBjb250ZXh0IGF1dG9tYXRpY2FsbHkgcHJlc2VydmVkIGFjcm9zcyB5aWVsZHMuXHJcbmZ1bmN0aW9uIGFzeW5jRnJvbUdlbihnZW5Gbikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZ2VuID0gZ2VuRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB2YXIgYm91bmROZXh0ID0gYmluZChnZW4ubmV4dCk7XHJcbiAgICAgICAgdmFyIGJvdW5kVGhyb3cgPSBiaW5kKGdlbi50aHJvdyk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJndW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG1ldGhvZC5jYWxsKGdlbiwgYXJndW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IHJlc3VsdC5kb25lID8gcmVzb2x2ZSA6IGludm9rZU5leHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNQcm9taXNlTGlrZShyZXN1bHQudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnZhbHVlLnRoZW4obmV4dCwgcmVzdWx0LmRvbmUgPyByZWplY3QgOiBpbnZva2VUaHJvdyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0KHJlc3VsdC52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGludm9rZU5leHQgPSBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIGludm9rZShib3VuZE5leHQsIHZhbHVlKTsgfTtcclxuICAgICAgICAgICAgdmFyIGludm9rZVRocm93ID0gZnVuY3Rpb24gKGVycm9yKSB7IHJldHVybiBpbnZva2UoYm91bmRUaHJvdywgZXJyb3IpOyB9O1xyXG4gICAgICAgICAgICBpbnZva2VOZXh0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGlzUHJvbWlzZUxpa2UodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xyXG59XHJcbi8vIElmIHlvdSB1c2UgdGhlIGZpYmVycyBucG0gcGFja2FnZSB0byBpbXBsZW1lbnQgY29yb3V0aW5lcyBpbiBOb2RlLmpzLFxyXG4vLyB5b3Ugc2hvdWxkIGNhbGwgdGhpcyBmdW5jdGlvbiBhdCBsZWFzdCBvbmNlIHRvIGVuc3VyZSBjb250ZXh0IG1hbmFnZW1lbnRcclxuLy8gcmVtYWlucyBjb2hlcmVudCBhY3Jvc3MgYW55IHlpZWxkcy5cclxudmFyIHdyYXBwZWRGaWJlcnMgPSBbXTtcclxuZnVuY3Rpb24gd3JhcFlpZWxkaW5nRmliZXJNZXRob2RzKEZpYmVyKSB7XHJcbiAgICAvLyBUaGVyZSBjYW4gYmUgb25seSBvbmUgaW1wbGVtZW50YXRpb24gb2YgRmliZXIgcGVyIHByb2Nlc3MsIHNvIHRoaXMgYXJyYXlcclxuICAgIC8vIHNob3VsZCBuZXZlciBncm93IGxvbmdlciB0aGFuIG9uZSBlbGVtZW50LlxyXG4gICAgaWYgKHdyYXBwZWRGaWJlcnMuaW5kZXhPZihGaWJlcikgPCAwKSB7XHJcbiAgICAgICAgdmFyIHdyYXAgPSBmdW5jdGlvbiAob2JqLCBtZXRob2QpIHtcclxuICAgICAgICAgICAgdmFyIGZuID0gb2JqW21ldGhvZF07XHJcbiAgICAgICAgICAgIG9ialttZXRob2RdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vQ29udGV4dChmbiwgYXJndW1lbnRzLCB0aGlzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFRoZXNlIG1ldGhvZHMgY2FuIHlpZWxkLCBhY2NvcmRpbmcgdG9cclxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbGF2ZXJkZXQvbm9kZS1maWJlcnMvYmxvYi9kZGViZWQ5YjhhZTM4ODNlNTdmODIyZTIxMDhlNjk0M2U1YzhkMmE4L2ZpYmVycy5qcyNMOTctTDEwMFxyXG4gICAgICAgIHdyYXAoRmliZXIsIFwieWllbGRcIik7XHJcbiAgICAgICAgd3JhcChGaWJlci5wcm90b3R5cGUsIFwicnVuXCIpO1xyXG4gICAgICAgIHdyYXAoRmliZXIucHJvdG90eXBlLCBcInRocm93SW50b1wiKTtcclxuICAgICAgICB3cmFwcGVkRmliZXJzLnB1c2goRmliZXIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIEZpYmVyO1xyXG59XG5cbmV4cG9ydCB7IFNsb3QsIGFzeW5jRnJvbUdlbiwgYmluZCwgbm9Db250ZXh0LCBzZXRUaW1lb3V0V2l0aENvbnRleHQgYXMgc2V0VGltZW91dCwgd3JhcFlpZWxkaW5nRmliZXJNZXRob2RzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb250ZXh0LmVzbS5qcy5tYXBcbiIsInZhciBfYSA9IE9iamVjdC5wcm90b3R5cGUsIHRvU3RyaW5nID0gX2EudG9TdHJpbmcsIGhhc093blByb3BlcnR5ID0gX2EuaGFzT3duUHJvcGVydHk7XHJcbnZhciBwcmV2aW91c0NvbXBhcmlzb25zID0gbmV3IE1hcCgpO1xyXG4vKipcclxuICogUGVyZm9ybXMgYSBkZWVwIGVxdWFsaXR5IGNoZWNrIG9uIHR3byBKYXZhU2NyaXB0IHZhbHVlcywgdG9sZXJhdGluZyBjeWNsZXMuXHJcbiAqL1xyXG5mdW5jdGlvbiBlcXVhbChhLCBiKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBjaGVjayhhLCBiKTtcclxuICAgIH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHByZXZpb3VzQ29tcGFyaXNvbnMuY2xlYXIoKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjaGVjayhhLCBiKSB7XHJcbiAgICAvLyBJZiB0aGUgdHdvIHZhbHVlcyBhcmUgc3RyaWN0bHkgZXF1YWwsIG91ciBqb2IgaXMgZWFzeS5cclxuICAgIGlmIChhID09PSBiKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAvLyBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nIHJldHVybnMgYSByZXByZXNlbnRhdGlvbiBvZiB0aGUgcnVudGltZSB0eXBlIG9mXHJcbiAgICAvLyB0aGUgZ2l2ZW4gdmFsdWUgdGhhdCBpcyBjb25zaWRlcmFibHkgbW9yZSBwcmVjaXNlIHRoYW4gdHlwZW9mLlxyXG4gICAgdmFyIGFUYWcgPSB0b1N0cmluZy5jYWxsKGEpO1xyXG4gICAgdmFyIGJUYWcgPSB0b1N0cmluZy5jYWxsKGIpO1xyXG4gICAgLy8gSWYgdGhlIHJ1bnRpbWUgdHlwZXMgb2YgYSBhbmQgYiBhcmUgZGlmZmVyZW50LCB0aGV5IGNvdWxkIG1heWJlIGJlIGVxdWFsXHJcbiAgICAvLyB1bmRlciBzb21lIGludGVycHJldGF0aW9uIG9mIGVxdWFsaXR5LCBidXQgZm9yIHNpbXBsaWNpdHkgYW5kIHBlcmZvcm1hbmNlXHJcbiAgICAvLyB3ZSBqdXN0IHJldHVybiBmYWxzZSBpbnN0ZWFkLlxyXG4gICAgaWYgKGFUYWcgIT09IGJUYWcpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKGFUYWcpIHtcclxuICAgICAgICBjYXNlICdbb2JqZWN0IEFycmF5XSc6XHJcbiAgICAgICAgICAgIC8vIEFycmF5cyBhcmUgYSBsb3QgbGlrZSBvdGhlciBvYmplY3RzLCBidXQgd2UgY2FuIGNoZWFwbHkgY29tcGFyZSB0aGVpclxyXG4gICAgICAgICAgICAvLyBsZW5ndGhzIGFzIGEgc2hvcnQtY3V0IGJlZm9yZSBjb21wYXJpbmcgdGhlaXIgZWxlbWVudHMuXHJcbiAgICAgICAgICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgLy8gRmFsbCB0aHJvdWdoIHRvIG9iamVjdCBjYXNlLi4uXHJcbiAgICAgICAgY2FzZSAnW29iamVjdCBPYmplY3RdJzoge1xyXG4gICAgICAgICAgICBpZiAocHJldmlvdXNseUNvbXBhcmVkKGEsIGIpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHZhciBhS2V5cyA9IE9iamVjdC5rZXlzKGEpO1xyXG4gICAgICAgICAgICB2YXIgYktleXMgPSBPYmplY3Qua2V5cyhiKTtcclxuICAgICAgICAgICAgLy8gSWYgYGFgIGFuZCBgYmAgaGF2ZSBhIGRpZmZlcmVudCBudW1iZXIgb2YgZW51bWVyYWJsZSBrZXlzLCB0aGV5XHJcbiAgICAgICAgICAgIC8vIG11c3QgYmUgZGlmZmVyZW50LlxyXG4gICAgICAgICAgICB2YXIga2V5Q291bnQgPSBhS2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmIChrZXlDb3VudCAhPT0gYktleXMubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAvLyBOb3cgbWFrZSBzdXJlIHRoZXkgaGF2ZSB0aGUgc2FtZSBrZXlzLlxyXG4gICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IGtleUNvdW50OyArK2spIHtcclxuICAgICAgICAgICAgICAgIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChiLCBhS2V5c1trXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gRmluYWxseSwgY2hlY2sgZGVlcCBlcXVhbGl0eSBvZiBhbGwgY2hpbGQgcHJvcGVydGllcy5cclxuICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBrZXlDb3VudDsgKytrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gYUtleXNba107XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoZWNrKGFba2V5XSwgYltrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSAnW29iamVjdCBFcnJvcl0nOlxyXG4gICAgICAgICAgICByZXR1cm4gYS5uYW1lID09PSBiLm5hbWUgJiYgYS5tZXNzYWdlID09PSBiLm1lc3NhZ2U7XHJcbiAgICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcclxuICAgICAgICAgICAgLy8gSGFuZGxlIE5hTiwgd2hpY2ggaXMgIT09IGl0c2VsZi5cclxuICAgICAgICAgICAgaWYgKGEgIT09IGEpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYiAhPT0gYjtcclxuICAgICAgICAvLyBGYWxsIHRocm91Z2ggdG8gc2hhcmVkICthID09PSArYiBjYXNlLi4uXHJcbiAgICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XHJcbiAgICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XHJcbiAgICAgICAgICAgIHJldHVybiArYSA9PT0gK2I7XHJcbiAgICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcclxuICAgICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxyXG4gICAgICAgICAgICByZXR1cm4gYSA9PSBcIlwiICsgYjtcclxuICAgICAgICBjYXNlICdbb2JqZWN0IE1hcF0nOlxyXG4gICAgICAgIGNhc2UgJ1tvYmplY3QgU2V0XSc6IHtcclxuICAgICAgICAgICAgaWYgKGEuc2l6ZSAhPT0gYi5zaXplKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAocHJldmlvdXNseUNvbXBhcmVkKGEsIGIpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHZhciBhSXRlcmF0b3IgPSBhLmVudHJpZXMoKTtcclxuICAgICAgICAgICAgdmFyIGlzTWFwID0gYVRhZyA9PT0gJ1tvYmplY3QgTWFwXSc7XHJcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5mbyA9IGFJdGVyYXRvci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5mby5kb25lKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgYSBpbnN0YW5jZW9mIFNldCwgYVZhbHVlID09PSBhS2V5LlxyXG4gICAgICAgICAgICAgICAgdmFyIF9hID0gaW5mby52YWx1ZSwgYUtleSA9IF9hWzBdLCBhVmFsdWUgPSBfYVsxXTtcclxuICAgICAgICAgICAgICAgIC8vIFNvIHRoaXMgd29ya3MgdGhlIHNhbWUgd2F5IGZvciBib3RoIFNldCBhbmQgTWFwLlxyXG4gICAgICAgICAgICAgICAgaWYgKCFiLmhhcyhhS2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIEhvd2V2ZXIsIHdlIGNhcmUgYWJvdXQgZGVlcCBlcXVhbGl0eSBvZiB2YWx1ZXMgb25seSB3aGVuIGRlYWxpbmdcclxuICAgICAgICAgICAgICAgIC8vIHdpdGggTWFwIHN0cnVjdHVyZXMuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNNYXAgJiYgIWNoZWNrKGFWYWx1ZSwgYi5nZXQoYUtleSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIE90aGVyd2lzZSB0aGUgdmFsdWVzIGFyZSBub3QgZXF1YWwuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuZnVuY3Rpb24gcHJldmlvdXNseUNvbXBhcmVkKGEsIGIpIHtcclxuICAgIC8vIFRob3VnaCBjeWNsaWMgcmVmZXJlbmNlcyBjYW4gbWFrZSBhbiBvYmplY3QgZ3JhcGggYXBwZWFyIGluZmluaXRlIGZyb20gdGhlXHJcbiAgICAvLyBwZXJzcGVjdGl2ZSBvZiBhIGRlcHRoLWZpcnN0IHRyYXZlcnNhbCwgdGhlIGdyYXBoIHN0aWxsIGNvbnRhaW5zIGEgZmluaXRlXHJcbiAgICAvLyBudW1iZXIgb2YgZGlzdGluY3Qgb2JqZWN0IHJlZmVyZW5jZXMuIFdlIHVzZSB0aGUgcHJldmlvdXNDb21wYXJpc29ucyBjYWNoZVxyXG4gICAgLy8gdG8gYXZvaWQgY29tcGFyaW5nIHRoZSBzYW1lIHBhaXIgb2Ygb2JqZWN0IHJlZmVyZW5jZXMgbW9yZSB0aGFuIG9uY2UsIHdoaWNoXHJcbiAgICAvLyBndWFyYW50ZWVzIHRlcm1pbmF0aW9uIChldmVuIGlmIHdlIGVuZCB1cCBjb21wYXJpbmcgZXZlcnkgb2JqZWN0IGluIG9uZVxyXG4gICAgLy8gZ3JhcGggdG8gZXZlcnkgb2JqZWN0IGluIHRoZSBvdGhlciBncmFwaCwgd2hpY2ggaXMgZXh0cmVtZWx5IHVubGlrZWx5KSxcclxuICAgIC8vIHdoaWxlIHN0aWxsIGFsbG93aW5nIHdlaXJkIGlzb21vcnBoaWMgc3RydWN0dXJlcyAobGlrZSByaW5ncyB3aXRoIGRpZmZlcmVudFxyXG4gICAgLy8gbGVuZ3RocykgYSBjaGFuY2UgdG8gcGFzcyB0aGUgZXF1YWxpdHkgdGVzdC5cclxuICAgIHZhciBiU2V0ID0gcHJldmlvdXNDb21wYXJpc29ucy5nZXQoYSk7XHJcbiAgICBpZiAoYlNldCkge1xyXG4gICAgICAgIC8vIFJldHVybiB0cnVlIGhlcmUgYmVjYXVzZSB3ZSBjYW4gYmUgc3VyZSBmYWxzZSB3aWxsIGJlIHJldHVybmVkIHNvbWV3aGVyZVxyXG4gICAgICAgIC8vIGVsc2UgaWYgdGhlIG9iamVjdHMgYXJlIG5vdCBlcXVpdmFsZW50LlxyXG4gICAgICAgIGlmIChiU2V0LmhhcyhiKSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBwcmV2aW91c0NvbXBhcmlzb25zLnNldChhLCBiU2V0ID0gbmV3IFNldCk7XHJcbiAgICB9XHJcbiAgICBiU2V0LmFkZChiKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxuXG5leHBvcnQgZGVmYXVsdCBlcXVhbDtcbmV4cG9ydCB7IGVxdWFsIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lcXVhbGl0eS5lc20uanMubWFwXG4iLCJpbXBvcnQgeyBfX2V4dGVuZHMgfSBmcm9tICd0c2xpYic7XG5pbXBvcnQgQXBvbGxvQ2xpZW50X19kZWZhdWx0IGZyb20gJ2Fwb2xsby1jbGllbnQnO1xuZXhwb3J0ICogZnJvbSAnYXBvbGxvLWNsaWVudCc7XG5pbXBvcnQgeyBBcG9sbG9MaW5rLCBPYnNlcnZhYmxlIH0gZnJvbSAnYXBvbGxvLWxpbmsnO1xuZXhwb3J0ICogZnJvbSAnYXBvbGxvLWxpbmsnO1xuaW1wb3J0IHsgSW5NZW1vcnlDYWNoZSB9IGZyb20gJ2Fwb2xsby1jYWNoZS1pbm1lbW9yeSc7XG5leHBvcnQgKiBmcm9tICdhcG9sbG8tY2FjaGUtaW5tZW1vcnknO1xuaW1wb3J0IHsgSHR0cExpbmsgfSBmcm9tICdhcG9sbG8tbGluay1odHRwJztcbmV4cG9ydCB7IEh0dHBMaW5rIH0gZnJvbSAnYXBvbGxvLWxpbmstaHR0cCc7XG5pbXBvcnQgeyBvbkVycm9yIH0gZnJvbSAnYXBvbGxvLWxpbmstZXJyb3InO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBncWwgfSBmcm9tICdncmFwaHFsLXRhZyc7XG5pbXBvcnQgeyBpbnZhcmlhbnQgfSBmcm9tICd0cy1pbnZhcmlhbnQnO1xuXG52YXIgUFJFU0VUX0NPTkZJR19LRVlTID0gW1xuICAgICdyZXF1ZXN0JyxcbiAgICAndXJpJyxcbiAgICAnY3JlZGVudGlhbHMnLFxuICAgICdoZWFkZXJzJyxcbiAgICAnZmV0Y2gnLFxuICAgICdmZXRjaE9wdGlvbnMnLFxuICAgICdjbGllbnRTdGF0ZScsXG4gICAgJ29uRXJyb3InLFxuICAgICdjYWNoZVJlZGlyZWN0cycsXG4gICAgJ2NhY2hlJyxcbiAgICAnbmFtZScsXG4gICAgJ3ZlcnNpb24nLFxuICAgICdyZXNvbHZlcnMnLFxuICAgICd0eXBlRGVmcycsXG4gICAgJ2ZyYWdtZW50TWF0Y2hlcicsXG5dO1xudmFyIERlZmF1bHRDbGllbnQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhEZWZhdWx0Q2xpZW50LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIERlZmF1bHRDbGllbnQoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcgPT09IHZvaWQgMCkgeyBjb25maWcgPSB7fTsgfVxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgZGlmZiA9IE9iamVjdC5rZXlzKGNvbmZpZykuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIFBSRVNFVF9DT05GSUdfS0VZUy5pbmRleE9mKGtleSkgPT09IC0xOyB9KTtcbiAgICAgICAgICAgIGlmIChkaWZmLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgfHwgaW52YXJpYW50Lndhcm4oJ0Fwb2xsb0Jvb3N0IHdhcyBpbml0aWFsaXplZCB3aXRoIHVuc3VwcG9ydGVkIG9wdGlvbnM6ICcgK1xuICAgICAgICAgICAgICAgICAgICAoXCJcIiArIGRpZmYuam9pbignICcpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcXVlc3QgPSBjb25maWcucmVxdWVzdCwgdXJpID0gY29uZmlnLnVyaSwgY3JlZGVudGlhbHMgPSBjb25maWcuY3JlZGVudGlhbHMsIGhlYWRlcnMgPSBjb25maWcuaGVhZGVycywgZmV0Y2ggPSBjb25maWcuZmV0Y2gsIGZldGNoT3B0aW9ucyA9IGNvbmZpZy5mZXRjaE9wdGlvbnMsIGNsaWVudFN0YXRlID0gY29uZmlnLmNsaWVudFN0YXRlLCBjYWNoZVJlZGlyZWN0cyA9IGNvbmZpZy5jYWNoZVJlZGlyZWN0cywgZXJyb3JDYWxsYmFjayA9IGNvbmZpZy5vbkVycm9yLCBuYW1lID0gY29uZmlnLm5hbWUsIHZlcnNpb24gPSBjb25maWcudmVyc2lvbiwgcmVzb2x2ZXJzID0gY29uZmlnLnJlc29sdmVycywgdHlwZURlZnMgPSBjb25maWcudHlwZURlZnMsIGZyYWdtZW50TWF0Y2hlciA9IGNvbmZpZy5mcmFnbWVudE1hdGNoZXI7XG4gICAgICAgIHZhciBjYWNoZSA9IGNvbmZpZy5jYWNoZTtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KCFjYWNoZSB8fCAhY2FjaGVSZWRpcmVjdHMsIDEpIDogaW52YXJpYW50KCFjYWNoZSB8fCAhY2FjaGVSZWRpcmVjdHMsICdJbmNvbXBhdGlibGUgY2FjaGUgY29uZmlndXJhdGlvbi4gV2hlbiBub3QgcHJvdmlkaW5nIGBjYWNoZWAsICcgK1xuICAgICAgICAgICAgJ2NvbmZpZ3VyZSB0aGUgcHJvdmlkZWQgaW5zdGFuY2Ugd2l0aCBgY2FjaGVSZWRpcmVjdHNgIGluc3RlYWQuJyk7XG4gICAgICAgIGlmICghY2FjaGUpIHtcbiAgICAgICAgICAgIGNhY2hlID0gY2FjaGVSZWRpcmVjdHNcbiAgICAgICAgICAgICAgICA/IG5ldyBJbk1lbW9yeUNhY2hlKHsgY2FjaGVSZWRpcmVjdHM6IGNhY2hlUmVkaXJlY3RzIH0pXG4gICAgICAgICAgICAgICAgOiBuZXcgSW5NZW1vcnlDYWNoZSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvckxpbmsgPSBlcnJvckNhbGxiYWNrXG4gICAgICAgICAgICA/IG9uRXJyb3IoZXJyb3JDYWxsYmFjaylcbiAgICAgICAgICAgIDogb25FcnJvcihmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICB2YXIgZ3JhcGhRTEVycm9ycyA9IF9hLmdyYXBoUUxFcnJvcnMsIG5ldHdvcmtFcnJvciA9IF9hLm5ldHdvcmtFcnJvcjtcbiAgICAgICAgICAgICAgICBpZiAoZ3JhcGhRTEVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICBncmFwaFFMRXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IF9hLm1lc3NhZ2UsIGxvY2F0aW9ucyA9IF9hLmxvY2F0aW9ucywgcGF0aCA9IF9hLnBhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiIHx8IGludmFyaWFudC53YXJuKFwiW0dyYXBoUUwgZXJyb3JdOiBNZXNzYWdlOiBcIiArIG1lc3NhZ2UgKyBcIiwgTG9jYXRpb246IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAobG9jYXRpb25zICsgXCIsIFBhdGg6IFwiICsgcGF0aCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5ldHdvcmtFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgfHwgaW52YXJpYW50Lndhcm4oXCJbTmV0d29yayBlcnJvcl06IFwiICsgbmV0d29ya0Vycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgdmFyIHJlcXVlc3RIYW5kbGVyID0gcmVxdWVzdFxuICAgICAgICAgICAgPyBuZXcgQXBvbGxvTGluayhmdW5jdGlvbiAob3BlcmF0aW9uLCBmb3J3YXJkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFuZGxlO1xuICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUob3BlcmF0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKG9wZXIpIHsgcmV0dXJuIHJlcXVlc3Qob3Blcik7IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGUgPSBmb3J3YXJkKG9wZXJhdGlvbikuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0OiBvYnNlcnZlci5uZXh0LmJpbmQob2JzZXJ2ZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBvYnNlcnZlci5lcnJvci5iaW5kKG9ic2VydmVyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogb2JzZXJ2ZXIuY29tcGxldGUuYmluZChvYnNlcnZlciksXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChvYnNlcnZlci5lcnJvci5iaW5kKG9ic2VydmVyKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICAgICAgdmFyIGh0dHBMaW5rID0gbmV3IEh0dHBMaW5rKHtcbiAgICAgICAgICAgIHVyaTogdXJpIHx8ICcvZ3JhcGhxbCcsXG4gICAgICAgICAgICBmZXRjaDogZmV0Y2gsXG4gICAgICAgICAgICBmZXRjaE9wdGlvbnM6IGZldGNoT3B0aW9ucyB8fCB7fSxcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBjcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nLFxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyB8fCB7fSxcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBsaW5rID0gQXBvbGxvTGluay5mcm9tKFtlcnJvckxpbmssIHJlcXVlc3RIYW5kbGVyLCBodHRwTGlua10uZmlsdGVyKGZ1bmN0aW9uICh4KSB7IHJldHVybiAhIXg7IH0pKTtcbiAgICAgICAgdmFyIGFjdGl2ZVJlc29sdmVycyA9IHJlc29sdmVycztcbiAgICAgICAgdmFyIGFjdGl2ZVR5cGVEZWZzID0gdHlwZURlZnM7XG4gICAgICAgIHZhciBhY3RpdmVGcmFnbWVudE1hdGNoZXIgPSBmcmFnbWVudE1hdGNoZXI7XG4gICAgICAgIGlmIChjbGllbnRTdGF0ZSkge1xuICAgICAgICAgICAgaWYgKGNsaWVudFN0YXRlLmRlZmF1bHRzKSB7XG4gICAgICAgICAgICAgICAgY2FjaGUud3JpdGVEYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY2xpZW50U3RhdGUuZGVmYXVsdHMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY3RpdmVSZXNvbHZlcnMgPSBjbGllbnRTdGF0ZS5yZXNvbHZlcnM7XG4gICAgICAgICAgICBhY3RpdmVUeXBlRGVmcyA9IGNsaWVudFN0YXRlLnR5cGVEZWZzO1xuICAgICAgICAgICAgYWN0aXZlRnJhZ21lbnRNYXRjaGVyID0gY2xpZW50U3RhdGUuZnJhZ21lbnRNYXRjaGVyO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywge1xuICAgICAgICAgICAgY2FjaGU6IGNhY2hlLFxuICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICB2ZXJzaW9uOiB2ZXJzaW9uLFxuICAgICAgICAgICAgcmVzb2x2ZXJzOiBhY3RpdmVSZXNvbHZlcnMsXG4gICAgICAgICAgICB0eXBlRGVmczogYWN0aXZlVHlwZURlZnMsXG4gICAgICAgICAgICBmcmFnbWVudE1hdGNoZXI6IGFjdGl2ZUZyYWdtZW50TWF0Y2hlcixcbiAgICAgICAgfSkgfHwgdGhpcztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gRGVmYXVsdENsaWVudDtcbn0oQXBvbGxvQ2xpZW50X19kZWZhdWx0KSk7XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRDbGllbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idW5kbGUuZXNtLmpzLm1hcFxuIiwiaW1wb3J0IHsgX19hc3NpZ24sIF9fZXh0ZW5kcyB9IGZyb20gJ3RzbGliJztcbmltcG9ydCB7IEFwb2xsb0NhY2hlIH0gZnJvbSAnYXBvbGxvLWNhY2hlJztcbmltcG9ydCB7IGlzVGVzdCwgZ2V0UXVlcnlEZWZpbml0aW9uLCBhc3NpZ24sIGdldERlZmF1bHRWYWx1ZXMsIGlzRXF1YWwsIGdldE1haW5EZWZpbml0aW9uLCBnZXRGcmFnbWVudERlZmluaXRpb25zLCBjcmVhdGVGcmFnbWVudE1hcCwgc2hvdWxkSW5jbHVkZSwgaXNGaWVsZCwgcmVzdWx0S2V5TmFtZUZyb21GaWVsZCwgaXNJbmxpbmVGcmFnbWVudCwgbWVyZ2VEZWVwQXJyYXksIGFyZ3VtZW50c09iamVjdEZyb21GaWVsZCwgZ2V0RGlyZWN0aXZlSW5mb0Zyb21GaWVsZCwgbWF5YmVEZWVwRnJlZXplLCBpc0lkVmFsdWUsIGdldFN0b3JlS2V5TmFtZSwgdG9JZFZhbHVlLCBpc0pzb25WYWx1ZSwgY2FuVXNlV2Vha01hcCwgZ2V0T3BlcmF0aW9uRGVmaW5pdGlvbiwgaXNQcm9kdWN0aW9uLCBzdG9yZUtleU5hbWVGcm9tRmllbGQsIGFkZFR5cGVuYW1lVG9Eb2N1bWVudCB9IGZyb20gJ2Fwb2xsby11dGlsaXRpZXMnO1xuaW1wb3J0IHsgd3JhcCwgS2V5VHJpZSB9IGZyb20gJ29wdGltaXNtJztcbmltcG9ydCB7IGludmFyaWFudCwgSW52YXJpYW50RXJyb3IgfSBmcm9tICd0cy1pbnZhcmlhbnQnO1xuXG52YXIgaGF2ZVdhcm5lZCA9IGZhbHNlO1xuZnVuY3Rpb24gc2hvdWxkV2FybigpIHtcbiAgICB2YXIgYW5zd2VyID0gIWhhdmVXYXJuZWQ7XG4gICAgaWYgKCFpc1Rlc3QoKSkge1xuICAgICAgICBoYXZlV2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGFuc3dlcjtcbn1cbnZhciBIZXVyaXN0aWNGcmFnbWVudE1hdGNoZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEhldXJpc3RpY0ZyYWdtZW50TWF0Y2hlcigpIHtcbiAgICB9XG4gICAgSGV1cmlzdGljRnJhZ21lbnRNYXRjaGVyLnByb3RvdHlwZS5lbnN1cmVSZWFkeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH07XG4gICAgSGV1cmlzdGljRnJhZ21lbnRNYXRjaGVyLnByb3RvdHlwZS5jYW5CeXBhc3NJbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIEhldXJpc3RpY0ZyYWdtZW50TWF0Y2hlci5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbiAoaWRWYWx1ZSwgdHlwZUNvbmRpdGlvbiwgY29udGV4dCkge1xuICAgICAgICB2YXIgb2JqID0gY29udGV4dC5zdG9yZS5nZXQoaWRWYWx1ZS5pZCk7XG4gICAgICAgIHZhciBpc1Jvb3RRdWVyeSA9IGlkVmFsdWUuaWQgPT09ICdST09UX1FVRVJZJztcbiAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBpc1Jvb3RRdWVyeTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgX2EgPSBvYmouX190eXBlbmFtZSwgX190eXBlbmFtZSA9IF9hID09PSB2b2lkIDAgPyBpc1Jvb3RRdWVyeSAmJiAnUXVlcnknIDogX2E7XG4gICAgICAgIGlmICghX190eXBlbmFtZSkge1xuICAgICAgICAgICAgaWYgKHNob3VsZFdhcm4oKSkge1xuICAgICAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiB8fCBpbnZhcmlhbnQud2FybihcIllvdSdyZSB1c2luZyBmcmFnbWVudHMgaW4geW91ciBxdWVyaWVzLCBidXQgZWl0aGVyIGRvbid0IGhhdmUgdGhlIGFkZFR5cGVuYW1lOlxcbiAgdHJ1ZSBvcHRpb24gc2V0IGluIEFwb2xsbyBDbGllbnQsIG9yIHlvdSBhcmUgdHJ5aW5nIHRvIHdyaXRlIGEgZnJhZ21lbnQgdG8gdGhlIHN0b3JlIHdpdGhvdXQgdGhlIF9fdHlwZW5hbWUuXFxuICAgUGxlYXNlIHR1cm4gb24gdGhlIGFkZFR5cGVuYW1lIG9wdGlvbiBhbmQgaW5jbHVkZSBfX3R5cGVuYW1lIHdoZW4gd3JpdGluZyBmcmFnbWVudHMgc28gdGhhdCBBcG9sbG8gQ2xpZW50XFxuICAgY2FuIGFjY3VyYXRlbHkgbWF0Y2ggZnJhZ21lbnRzLlwiKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgfHwgaW52YXJpYW50Lndhcm4oJ0NvdWxkIG5vdCBmaW5kIF9fdHlwZW5hbWUgb24gRnJhZ21lbnQgJywgdHlwZUNvbmRpdGlvbiwgb2JqKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgfHwgaW52YXJpYW50Lndhcm4oXCJERVBSRUNBVElPTiBXQVJOSU5HOiB1c2luZyBmcmFnbWVudHMgd2l0aG91dCBfX3R5cGVuYW1lIGlzIHVuc3VwcG9ydGVkIGJlaGF2aW9yIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJhbmQgd2lsbCBiZSByZW1vdmVkIGluIGZ1dHVyZSB2ZXJzaW9ucyBvZiBBcG9sbG8gY2xpZW50LiBZb3Ugc2hvdWxkIGZpeCB0aGlzIGFuZCBzZXQgYWRkVHlwZW5hbWUgdG8gdHJ1ZSBub3cuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICdoZXVyaXN0aWMnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfX3R5cGVuYW1lID09PSB0eXBlQ29uZGl0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hvdWxkV2FybigpKSB7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgfHwgaW52YXJpYW50LmVycm9yKCdZb3UgYXJlIHVzaW5nIHRoZSBzaW1wbGUgKGhldXJpc3RpYykgZnJhZ21lbnQgbWF0Y2hlciwgYnV0IHlvdXIgJyArXG4gICAgICAgICAgICAgICAgJ3F1ZXJpZXMgY29udGFpbiB1bmlvbiBvciBpbnRlcmZhY2UgdHlwZXMuIEFwb2xsbyBDbGllbnQgd2lsbCBub3QgYmUgJyArXG4gICAgICAgICAgICAgICAgJ2FibGUgdG8gYWNjdXJhdGVseSBtYXAgZnJhZ21lbnRzLiBUbyBtYWtlIHRoaXMgZXJyb3IgZ28gYXdheSwgdXNlICcgK1xuICAgICAgICAgICAgICAgICd0aGUgYEludHJvc3BlY3Rpb25GcmFnbWVudE1hdGNoZXJgIGFzIGRlc2NyaWJlZCBpbiB0aGUgZG9jczogJyArXG4gICAgICAgICAgICAgICAgJ2h0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2RvY3MvcmVhY3QvYWR2YW5jZWQvZnJhZ21lbnRzLmh0bWwjZnJhZ21lbnQtbWF0Y2hlcicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnaGV1cmlzdGljJztcbiAgICB9O1xuICAgIHJldHVybiBIZXVyaXN0aWNGcmFnbWVudE1hdGNoZXI7XG59KCkpO1xudmFyIEludHJvc3BlY3Rpb25GcmFnbWVudE1hdGNoZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEludHJvc3BlY3Rpb25GcmFnbWVudE1hdGNoZXIob3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmludHJvc3BlY3Rpb25RdWVyeVJlc3VsdERhdGEpIHtcbiAgICAgICAgICAgIHRoaXMucG9zc2libGVUeXBlc01hcCA9IHRoaXMucGFyc2VJbnRyb3NwZWN0aW9uUmVzdWx0KG9wdGlvbnMuaW50cm9zcGVjdGlvblF1ZXJ5UmVzdWx0RGF0YSk7XG4gICAgICAgICAgICB0aGlzLmlzUmVhZHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc1JlYWR5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXRjaCA9IHRoaXMubWF0Y2guYmluZCh0aGlzKTtcbiAgICB9XG4gICAgSW50cm9zcGVjdGlvbkZyYWdtZW50TWF0Y2hlci5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbiAoaWRWYWx1ZSwgdHlwZUNvbmRpdGlvbiwgY29udGV4dCkge1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQodGhpcy5pc1JlYWR5LCAxKSA6IGludmFyaWFudCh0aGlzLmlzUmVhZHksICdGcmFnbWVudE1hdGNoZXIubWF0Y2goKSB3YXMgY2FsbGVkIGJlZm9yZSBGcmFnbWVudE1hdGNoZXIuaW5pdCgpJyk7XG4gICAgICAgIHZhciBvYmogPSBjb250ZXh0LnN0b3JlLmdldChpZFZhbHVlLmlkKTtcbiAgICAgICAgdmFyIGlzUm9vdFF1ZXJ5ID0gaWRWYWx1ZS5pZCA9PT0gJ1JPT1RfUVVFUlknO1xuICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgcmV0dXJuIGlzUm9vdFF1ZXJ5O1xuICAgICAgICB9XG4gICAgICAgIHZhciBfYSA9IG9iai5fX3R5cGVuYW1lLCBfX3R5cGVuYW1lID0gX2EgPT09IHZvaWQgMCA/IGlzUm9vdFF1ZXJ5ICYmICdRdWVyeScgOiBfYTtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KF9fdHlwZW5hbWUsIDIpIDogaW52YXJpYW50KF9fdHlwZW5hbWUsIFwiQ2Fubm90IG1hdGNoIGZyYWdtZW50IGJlY2F1c2UgX190eXBlbmFtZSBwcm9wZXJ0eSBpcyBtaXNzaW5nOiBcIiArIEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICAgICAgICBpZiAoX190eXBlbmFtZSA9PT0gdHlwZUNvbmRpdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGltcGxlbWVudGluZ1R5cGVzID0gdGhpcy5wb3NzaWJsZVR5cGVzTWFwW3R5cGVDb25kaXRpb25dO1xuICAgICAgICBpZiAoX190eXBlbmFtZSAmJlxuICAgICAgICAgICAgaW1wbGVtZW50aW5nVHlwZXMgJiZcbiAgICAgICAgICAgIGltcGxlbWVudGluZ1R5cGVzLmluZGV4T2YoX190eXBlbmFtZSkgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgSW50cm9zcGVjdGlvbkZyYWdtZW50TWF0Y2hlci5wcm90b3R5cGUucGFyc2VJbnRyb3NwZWN0aW9uUmVzdWx0ID0gZnVuY3Rpb24gKGludHJvc3BlY3Rpb25SZXN1bHREYXRhKSB7XG4gICAgICAgIHZhciB0eXBlTWFwID0ge307XG4gICAgICAgIGludHJvc3BlY3Rpb25SZXN1bHREYXRhLl9fc2NoZW1hLnR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlLmtpbmQgPT09ICdVTklPTicgfHwgdHlwZS5raW5kID09PSAnSU5URVJGQUNFJykge1xuICAgICAgICAgICAgICAgIHR5cGVNYXBbdHlwZS5uYW1lXSA9IHR5cGUucG9zc2libGVUeXBlcy5tYXAoZnVuY3Rpb24gKGltcGxlbWVudGluZ1R5cGUpIHsgcmV0dXJuIGltcGxlbWVudGluZ1R5cGUubmFtZTsgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHlwZU1hcDtcbiAgICB9O1xuICAgIHJldHVybiBJbnRyb3NwZWN0aW9uRnJhZ21lbnRNYXRjaGVyO1xufSgpKTtcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgRGVwVHJhY2tpbmdDYWNoZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRGVwVHJhY2tpbmdDYWNoZShkYXRhKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChkYXRhID09PSB2b2lkIDApIHsgZGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7IH1cbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5kZXBlbmQgPSB3cmFwKGZ1bmN0aW9uIChkYXRhSWQpIHsgcmV0dXJuIF90aGlzLmRhdGFbZGF0YUlkXTsgfSwge1xuICAgICAgICAgICAgZGlzcG9zYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIG1ha2VDYWNoZUtleTogZnVuY3Rpb24gKGRhdGFJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRhSWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgRGVwVHJhY2tpbmdDYWNoZS5wcm90b3R5cGUudG9PYmplY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgfTtcbiAgICBEZXBUcmFja2luZ0NhY2hlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoZGF0YUlkKSB7XG4gICAgICAgIHRoaXMuZGVwZW5kKGRhdGFJZCk7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbZGF0YUlkXTtcbiAgICB9O1xuICAgIERlcFRyYWNraW5nQ2FjaGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChkYXRhSWQsIHZhbHVlKSB7XG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuZGF0YVtkYXRhSWRdO1xuICAgICAgICBpZiAodmFsdWUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFbZGF0YUlkXSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5kZXBlbmQuZGlydHkoZGF0YUlkKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgRGVwVHJhY2tpbmdDYWNoZS5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGRhdGFJZCkge1xuICAgICAgICBpZiAoaGFzT3duLmNhbGwodGhpcy5kYXRhLCBkYXRhSWQpKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5kYXRhW2RhdGFJZF07XG4gICAgICAgICAgICB0aGlzLmRlcGVuZC5kaXJ0eShkYXRhSWQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBEZXBUcmFja2luZ0NhY2hlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlKG51bGwpO1xuICAgIH07XG4gICAgRGVwVHJhY2tpbmdDYWNoZS5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChuZXdEYXRhKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhuZXdEYXRhKS5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhSWQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZXQoZGF0YUlkLCBuZXdEYXRhW2RhdGFJZF0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGEpLmZvckVhY2goZnVuY3Rpb24gKGRhdGFJZCkge1xuICAgICAgICAgICAgICAgIGlmICghaGFzT3duLmNhbGwobmV3RGF0YSwgZGF0YUlkKSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5kZWxldGUoZGF0YUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YSkuZm9yRWFjaChmdW5jdGlvbiAoZGF0YUlkKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZGVsZXRlKGRhdGFJZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIERlcFRyYWNraW5nQ2FjaGU7XG59KCkpO1xuZnVuY3Rpb24gZGVmYXVsdE5vcm1hbGl6ZWRDYWNoZUZhY3Rvcnkoc2VlZCkge1xuICAgIHJldHVybiBuZXcgRGVwVHJhY2tpbmdDYWNoZShzZWVkKTtcbn1cblxudmFyIFN0b3JlUmVhZGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdG9yZVJlYWRlcihfYSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgX2IgPSBfYSA9PT0gdm9pZCAwID8ge30gOiBfYSwgX2MgPSBfYi5jYWNoZUtleVJvb3QsIGNhY2hlS2V5Um9vdCA9IF9jID09PSB2b2lkIDAgPyBuZXcgS2V5VHJpZShjYW5Vc2VXZWFrTWFwKSA6IF9jLCBfZCA9IF9iLmZyZWV6ZVJlc3VsdHMsIGZyZWV6ZVJlc3VsdHMgPSBfZCA9PT0gdm9pZCAwID8gZmFsc2UgOiBfZDtcbiAgICAgICAgdmFyIF9lID0gdGhpcywgZXhlY3V0ZVN0b3JlUXVlcnkgPSBfZS5leGVjdXRlU3RvcmVRdWVyeSwgZXhlY3V0ZVNlbGVjdGlvblNldCA9IF9lLmV4ZWN1dGVTZWxlY3Rpb25TZXQsIGV4ZWN1dGVTdWJTZWxlY3RlZEFycmF5ID0gX2UuZXhlY3V0ZVN1YlNlbGVjdGVkQXJyYXk7XG4gICAgICAgIHRoaXMuZnJlZXplUmVzdWx0cyA9IGZyZWV6ZVJlc3VsdHM7XG4gICAgICAgIHRoaXMuZXhlY3V0ZVN0b3JlUXVlcnkgPSB3cmFwKGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhlY3V0ZVN0b3JlUXVlcnkuY2FsbChfdGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIG1ha2VDYWNoZUtleTogZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gX2EucXVlcnksIHJvb3RWYWx1ZSA9IF9hLnJvb3RWYWx1ZSwgY29udGV4dFZhbHVlID0gX2EuY29udGV4dFZhbHVlLCB2YXJpYWJsZVZhbHVlcyA9IF9hLnZhcmlhYmxlVmFsdWVzLCBmcmFnbWVudE1hdGNoZXIgPSBfYS5mcmFnbWVudE1hdGNoZXI7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHRWYWx1ZS5zdG9yZSBpbnN0YW5jZW9mIERlcFRyYWNraW5nQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlS2V5Um9vdC5sb29rdXAoY29udGV4dFZhbHVlLnN0b3JlLCBxdWVyeSwgZnJhZ21lbnRNYXRjaGVyLCBKU09OLnN0cmluZ2lmeSh2YXJpYWJsZVZhbHVlcyksIHJvb3RWYWx1ZS5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5leGVjdXRlU2VsZWN0aW9uU2V0ID0gd3JhcChmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIGV4ZWN1dGVTZWxlY3Rpb25TZXQuY2FsbChfdGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIG1ha2VDYWNoZUtleTogZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGlvblNldCA9IF9hLnNlbGVjdGlvblNldCwgcm9vdFZhbHVlID0gX2Eucm9vdFZhbHVlLCBleGVjQ29udGV4dCA9IF9hLmV4ZWNDb250ZXh0O1xuICAgICAgICAgICAgICAgIGlmIChleGVjQ29udGV4dC5jb250ZXh0VmFsdWUuc3RvcmUgaW5zdGFuY2VvZiBEZXBUcmFja2luZ0NhY2hlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZUtleVJvb3QubG9va3VwKGV4ZWNDb250ZXh0LmNvbnRleHRWYWx1ZS5zdG9yZSwgc2VsZWN0aW9uU2V0LCBleGVjQ29udGV4dC5mcmFnbWVudE1hdGNoZXIsIEpTT04uc3RyaW5naWZ5KGV4ZWNDb250ZXh0LnZhcmlhYmxlVmFsdWVzKSwgcm9vdFZhbHVlLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmV4ZWN1dGVTdWJTZWxlY3RlZEFycmF5ID0gd3JhcChmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIGV4ZWN1dGVTdWJTZWxlY3RlZEFycmF5LmNhbGwoX3RoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBtYWtlQ2FjaGVLZXk6IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IF9hLmZpZWxkLCBhcnJheSA9IF9hLmFycmF5LCBleGVjQ29udGV4dCA9IF9hLmV4ZWNDb250ZXh0O1xuICAgICAgICAgICAgICAgIGlmIChleGVjQ29udGV4dC5jb250ZXh0VmFsdWUuc3RvcmUgaW5zdGFuY2VvZiBEZXBUcmFja2luZ0NhY2hlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZUtleVJvb3QubG9va3VwKGV4ZWNDb250ZXh0LmNvbnRleHRWYWx1ZS5zdG9yZSwgZmllbGQsIGFycmF5LCBKU09OLnN0cmluZ2lmeShleGVjQ29udGV4dC52YXJpYWJsZVZhbHVlcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFN0b3JlUmVhZGVyLnByb3RvdHlwZS5yZWFkUXVlcnlGcm9tU3RvcmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWZmUXVlcnlBZ2FpbnN0U3RvcmUoX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7IHJldHVyblBhcnRpYWxEYXRhOiBmYWxzZSB9KSkucmVzdWx0O1xuICAgIH07XG4gICAgU3RvcmVSZWFkZXIucHJvdG90eXBlLmRpZmZRdWVyeUFnYWluc3RTdG9yZSA9IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgc3RvcmUgPSBfYS5zdG9yZSwgcXVlcnkgPSBfYS5xdWVyeSwgdmFyaWFibGVzID0gX2EudmFyaWFibGVzLCBwcmV2aW91c1Jlc3VsdCA9IF9hLnByZXZpb3VzUmVzdWx0LCBfYiA9IF9hLnJldHVyblBhcnRpYWxEYXRhLCByZXR1cm5QYXJ0aWFsRGF0YSA9IF9iID09PSB2b2lkIDAgPyB0cnVlIDogX2IsIF9jID0gX2Eucm9vdElkLCByb290SWQgPSBfYyA9PT0gdm9pZCAwID8gJ1JPT1RfUVVFUlknIDogX2MsIGZyYWdtZW50TWF0Y2hlckZ1bmN0aW9uID0gX2EuZnJhZ21lbnRNYXRjaGVyRnVuY3Rpb24sIGNvbmZpZyA9IF9hLmNvbmZpZztcbiAgICAgICAgdmFyIHF1ZXJ5RGVmaW5pdGlvbiA9IGdldFF1ZXJ5RGVmaW5pdGlvbihxdWVyeSk7XG4gICAgICAgIHZhcmlhYmxlcyA9IGFzc2lnbih7fSwgZ2V0RGVmYXVsdFZhbHVlcyhxdWVyeURlZmluaXRpb24pLCB2YXJpYWJsZXMpO1xuICAgICAgICB2YXIgY29udGV4dCA9IHtcbiAgICAgICAgICAgIHN0b3JlOiBzdG9yZSxcbiAgICAgICAgICAgIGRhdGFJZEZyb21PYmplY3Q6IGNvbmZpZyAmJiBjb25maWcuZGF0YUlkRnJvbU9iamVjdCxcbiAgICAgICAgICAgIGNhY2hlUmVkaXJlY3RzOiAoY29uZmlnICYmIGNvbmZpZy5jYWNoZVJlZGlyZWN0cykgfHwge30sXG4gICAgICAgIH07XG4gICAgICAgIHZhciBleGVjUmVzdWx0ID0gdGhpcy5leGVjdXRlU3RvcmVRdWVyeSh7XG4gICAgICAgICAgICBxdWVyeTogcXVlcnksXG4gICAgICAgICAgICByb290VmFsdWU6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaWQnLFxuICAgICAgICAgICAgICAgIGlkOiByb290SWQsXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIHR5cGVuYW1lOiAnUXVlcnknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRleHRWYWx1ZTogY29udGV4dCxcbiAgICAgICAgICAgIHZhcmlhYmxlVmFsdWVzOiB2YXJpYWJsZXMsXG4gICAgICAgICAgICBmcmFnbWVudE1hdGNoZXI6IGZyYWdtZW50TWF0Y2hlckZ1bmN0aW9uLFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGhhc01pc3NpbmdGaWVsZHMgPSBleGVjUmVzdWx0Lm1pc3NpbmcgJiYgZXhlY1Jlc3VsdC5taXNzaW5nLmxlbmd0aCA+IDA7XG4gICAgICAgIGlmIChoYXNNaXNzaW5nRmllbGRzICYmICFyZXR1cm5QYXJ0aWFsRGF0YSkge1xuICAgICAgICAgICAgZXhlY1Jlc3VsdC5taXNzaW5nLmZvckVhY2goZnVuY3Rpb24gKGluZm8pIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5mby50b2xlcmFibGUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aHJvdyBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBuZXcgSW52YXJpYW50RXJyb3IoOCkgOiBuZXcgSW52YXJpYW50RXJyb3IoXCJDYW4ndCBmaW5kIGZpZWxkIFwiICsgaW5mby5maWVsZE5hbWUgKyBcIiBvbiBvYmplY3QgXCIgKyBKU09OLnN0cmluZ2lmeShpbmZvLm9iamVjdCwgbnVsbCwgMikgKyBcIi5cIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJldmlvdXNSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChpc0VxdWFsKHByZXZpb3VzUmVzdWx0LCBleGVjUmVzdWx0LnJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICBleGVjUmVzdWx0LnJlc3VsdCA9IHByZXZpb3VzUmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN1bHQ6IGV4ZWNSZXN1bHQucmVzdWx0LFxuICAgICAgICAgICAgY29tcGxldGU6ICFoYXNNaXNzaW5nRmllbGRzLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgU3RvcmVSZWFkZXIucHJvdG90eXBlLmV4ZWN1dGVTdG9yZVF1ZXJ5ID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBxdWVyeSA9IF9hLnF1ZXJ5LCByb290VmFsdWUgPSBfYS5yb290VmFsdWUsIGNvbnRleHRWYWx1ZSA9IF9hLmNvbnRleHRWYWx1ZSwgdmFyaWFibGVWYWx1ZXMgPSBfYS52YXJpYWJsZVZhbHVlcywgX2IgPSBfYS5mcmFnbWVudE1hdGNoZXIsIGZyYWdtZW50TWF0Y2hlciA9IF9iID09PSB2b2lkIDAgPyBkZWZhdWx0RnJhZ21lbnRNYXRjaGVyIDogX2I7XG4gICAgICAgIHZhciBtYWluRGVmaW5pdGlvbiA9IGdldE1haW5EZWZpbml0aW9uKHF1ZXJ5KTtcbiAgICAgICAgdmFyIGZyYWdtZW50cyA9IGdldEZyYWdtZW50RGVmaW5pdGlvbnMocXVlcnkpO1xuICAgICAgICB2YXIgZnJhZ21lbnRNYXAgPSBjcmVhdGVGcmFnbWVudE1hcChmcmFnbWVudHMpO1xuICAgICAgICB2YXIgZXhlY0NvbnRleHQgPSB7XG4gICAgICAgICAgICBxdWVyeTogcXVlcnksXG4gICAgICAgICAgICBmcmFnbWVudE1hcDogZnJhZ21lbnRNYXAsXG4gICAgICAgICAgICBjb250ZXh0VmFsdWU6IGNvbnRleHRWYWx1ZSxcbiAgICAgICAgICAgIHZhcmlhYmxlVmFsdWVzOiB2YXJpYWJsZVZhbHVlcyxcbiAgICAgICAgICAgIGZyYWdtZW50TWF0Y2hlcjogZnJhZ21lbnRNYXRjaGVyLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5leGVjdXRlU2VsZWN0aW9uU2V0KHtcbiAgICAgICAgICAgIHNlbGVjdGlvblNldDogbWFpbkRlZmluaXRpb24uc2VsZWN0aW9uU2V0LFxuICAgICAgICAgICAgcm9vdFZhbHVlOiByb290VmFsdWUsXG4gICAgICAgICAgICBleGVjQ29udGV4dDogZXhlY0NvbnRleHQsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU3RvcmVSZWFkZXIucHJvdG90eXBlLmV4ZWN1dGVTZWxlY3Rpb25TZXQgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHNlbGVjdGlvblNldCA9IF9hLnNlbGVjdGlvblNldCwgcm9vdFZhbHVlID0gX2Eucm9vdFZhbHVlLCBleGVjQ29udGV4dCA9IF9hLmV4ZWNDb250ZXh0O1xuICAgICAgICB2YXIgZnJhZ21lbnRNYXAgPSBleGVjQ29udGV4dC5mcmFnbWVudE1hcCwgY29udGV4dFZhbHVlID0gZXhlY0NvbnRleHQuY29udGV4dFZhbHVlLCB2YXJpYWJsZXMgPSBleGVjQ29udGV4dC52YXJpYWJsZVZhbHVlcztcbiAgICAgICAgdmFyIGZpbmFsUmVzdWx0ID0geyByZXN1bHQ6IG51bGwgfTtcbiAgICAgICAgdmFyIG9iamVjdHNUb01lcmdlID0gW107XG4gICAgICAgIHZhciBvYmplY3QgPSBjb250ZXh0VmFsdWUuc3RvcmUuZ2V0KHJvb3RWYWx1ZS5pZCk7XG4gICAgICAgIHZhciB0eXBlbmFtZSA9IChvYmplY3QgJiYgb2JqZWN0Ll9fdHlwZW5hbWUpIHx8XG4gICAgICAgICAgICAocm9vdFZhbHVlLmlkID09PSAnUk9PVF9RVUVSWScgJiYgJ1F1ZXJ5JykgfHxcbiAgICAgICAgICAgIHZvaWQgMDtcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlTWlzc2luZyhyZXN1bHQpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQubWlzc2luZykge1xuICAgICAgICAgICAgICAgIGZpbmFsUmVzdWx0Lm1pc3NpbmcgPSBmaW5hbFJlc3VsdC5taXNzaW5nIHx8IFtdO1xuICAgICAgICAgICAgICAgIChfYSA9IGZpbmFsUmVzdWx0Lm1pc3NpbmcpLnB1c2guYXBwbHkoX2EsIHJlc3VsdC5taXNzaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQucmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIHNlbGVjdGlvblNldC5zZWxlY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKHNlbGVjdGlvbikge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgaWYgKCFzaG91bGRJbmNsdWRlKHNlbGVjdGlvbiwgdmFyaWFibGVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc0ZpZWxkKHNlbGVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRSZXN1bHQgPSBoYW5kbGVNaXNzaW5nKF90aGlzLmV4ZWN1dGVGaWVsZChvYmplY3QsIHR5cGVuYW1lLCBzZWxlY3Rpb24sIGV4ZWNDb250ZXh0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZFJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0c1RvTWVyZ2UucHVzaCgoX2EgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hW3Jlc3VsdEtleU5hbWVGcm9tRmllbGQoc2VsZWN0aW9uKV0gPSBmaWVsZFJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGZyYWdtZW50ID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGlmIChpc0lubGluZUZyYWdtZW50KHNlbGVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudCA9IGZyYWdtZW50TWFwW3NlbGVjdGlvbi5uYW1lLnZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmcmFnbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gbmV3IEludmFyaWFudEVycm9yKDkpIDogbmV3IEludmFyaWFudEVycm9yKFwiTm8gZnJhZ21lbnQgbmFtZWQgXCIgKyBzZWxlY3Rpb24ubmFtZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHR5cGVDb25kaXRpb24gPSBmcmFnbWVudC50eXBlQ29uZGl0aW9uICYmIGZyYWdtZW50LnR5cGVDb25kaXRpb24ubmFtZS52YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSAhdHlwZUNvbmRpdGlvbiB8fFxuICAgICAgICAgICAgICAgICAgICBleGVjQ29udGV4dC5mcmFnbWVudE1hdGNoZXIocm9vdFZhbHVlLCB0eXBlQ29uZGl0aW9uLCBjb250ZXh0VmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnJhZ21lbnRFeGVjUmVzdWx0ID0gX3RoaXMuZXhlY3V0ZVNlbGVjdGlvblNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25TZXQ6IGZyYWdtZW50LnNlbGVjdGlvblNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RWYWx1ZTogcm9vdFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhlY0NvbnRleHQ6IGV4ZWNDb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoID09PSAnaGV1cmlzdGljJyAmJiBmcmFnbWVudEV4ZWNSZXN1bHQubWlzc2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRFeGVjUmVzdWx0ID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGZyYWdtZW50RXhlY1Jlc3VsdCksIHsgbWlzc2luZzogZnJhZ21lbnRFeGVjUmVzdWx0Lm1pc3NpbmcubWFwKGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgaW5mbyksIHsgdG9sZXJhYmxlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdHNUb01lcmdlLnB1c2goaGFuZGxlTWlzc2luZyhmcmFnbWVudEV4ZWNSZXN1bHQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmaW5hbFJlc3VsdC5yZXN1bHQgPSBtZXJnZURlZXBBcnJheShvYmplY3RzVG9NZXJnZSk7XG4gICAgICAgIGlmICh0aGlzLmZyZWV6ZVJlc3VsdHMgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShmaW5hbFJlc3VsdC5yZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaW5hbFJlc3VsdDtcbiAgICB9O1xuICAgIFN0b3JlUmVhZGVyLnByb3RvdHlwZS5leGVjdXRlRmllbGQgPSBmdW5jdGlvbiAob2JqZWN0LCB0eXBlbmFtZSwgZmllbGQsIGV4ZWNDb250ZXh0KSB7XG4gICAgICAgIHZhciB2YXJpYWJsZXMgPSBleGVjQ29udGV4dC52YXJpYWJsZVZhbHVlcywgY29udGV4dFZhbHVlID0gZXhlY0NvbnRleHQuY29udGV4dFZhbHVlO1xuICAgICAgICB2YXIgZmllbGROYW1lID0gZmllbGQubmFtZS52YWx1ZTtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHNPYmplY3RGcm9tRmllbGQoZmllbGQsIHZhcmlhYmxlcyk7XG4gICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgcmVzdWx0S2V5OiByZXN1bHRLZXlOYW1lRnJvbUZpZWxkKGZpZWxkKSxcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IGdldERpcmVjdGl2ZUluZm9Gcm9tRmllbGQoZmllbGQsIHZhcmlhYmxlcyksXG4gICAgICAgIH07XG4gICAgICAgIHZhciByZWFkU3RvcmVSZXN1bHQgPSByZWFkU3RvcmVSZXNvbHZlcihvYmplY3QsIHR5cGVuYW1lLCBmaWVsZE5hbWUsIGFyZ3MsIGNvbnRleHRWYWx1ZSwgaW5mbyk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJlYWRTdG9yZVJlc3VsdC5yZXN1bHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21iaW5lRXhlY1Jlc3VsdHMocmVhZFN0b3JlUmVzdWx0LCB0aGlzLmV4ZWN1dGVTdWJTZWxlY3RlZEFycmF5KHtcbiAgICAgICAgICAgICAgICBmaWVsZDogZmllbGQsXG4gICAgICAgICAgICAgICAgYXJyYXk6IHJlYWRTdG9yZVJlc3VsdC5yZXN1bHQsXG4gICAgICAgICAgICAgICAgZXhlY0NvbnRleHQ6IGV4ZWNDb250ZXh0LFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZmllbGQuc2VsZWN0aW9uU2V0KSB7XG4gICAgICAgICAgICBhc3NlcnRTZWxlY3Rpb25TZXRGb3JJZFZhbHVlKGZpZWxkLCByZWFkU3RvcmVSZXN1bHQucmVzdWx0KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmZyZWV6ZVJlc3VsdHMgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIG1heWJlRGVlcEZyZWV6ZShyZWFkU3RvcmVSZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlYWRTdG9yZVJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVhZFN0b3JlUmVzdWx0LnJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVhZFN0b3JlUmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNvbWJpbmVFeGVjUmVzdWx0cyhyZWFkU3RvcmVSZXN1bHQsIHRoaXMuZXhlY3V0ZVNlbGVjdGlvblNldCh7XG4gICAgICAgICAgICBzZWxlY3Rpb25TZXQ6IGZpZWxkLnNlbGVjdGlvblNldCxcbiAgICAgICAgICAgIHJvb3RWYWx1ZTogcmVhZFN0b3JlUmVzdWx0LnJlc3VsdCxcbiAgICAgICAgICAgIGV4ZWNDb250ZXh0OiBleGVjQ29udGV4dCxcbiAgICAgICAgfSkpO1xuICAgIH07XG4gICAgU3RvcmVSZWFkZXIucHJvdG90eXBlLmNvbWJpbmVFeGVjUmVzdWx0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV4ZWNSZXN1bHRzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBleGVjUmVzdWx0c1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtaXNzaW5nO1xuICAgICAgICBleGVjUmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChleGVjUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZXhlY1Jlc3VsdC5taXNzaW5nKSB7XG4gICAgICAgICAgICAgICAgbWlzc2luZyA9IG1pc3NpbmcgfHwgW107XG4gICAgICAgICAgICAgICAgbWlzc2luZy5wdXNoLmFwcGx5KG1pc3NpbmcsIGV4ZWNSZXN1bHQubWlzc2luZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdWx0OiBleGVjUmVzdWx0cy5wb3AoKS5yZXN1bHQsXG4gICAgICAgICAgICBtaXNzaW5nOiBtaXNzaW5nLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgU3RvcmVSZWFkZXIucHJvdG90eXBlLmV4ZWN1dGVTdWJTZWxlY3RlZEFycmF5ID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBmaWVsZCA9IF9hLmZpZWxkLCBhcnJheSA9IF9hLmFycmF5LCBleGVjQ29udGV4dCA9IF9hLmV4ZWNDb250ZXh0O1xuICAgICAgICB2YXIgbWlzc2luZztcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlTWlzc2luZyhjaGlsZFJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGNoaWxkUmVzdWx0Lm1pc3NpbmcpIHtcbiAgICAgICAgICAgICAgICBtaXNzaW5nID0gbWlzc2luZyB8fCBbXTtcbiAgICAgICAgICAgICAgICBtaXNzaW5nLnB1c2guYXBwbHkobWlzc2luZywgY2hpbGRSZXN1bHQubWlzc2luZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hpbGRSZXN1bHQucmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGFycmF5ID0gYXJyYXkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlTWlzc2luZyhfdGhpcy5leGVjdXRlU3ViU2VsZWN0ZWRBcnJheSh7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkOiBmaWVsZCxcbiAgICAgICAgICAgICAgICAgICAgYXJyYXk6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIGV4ZWNDb250ZXh0OiBleGVjQ29udGV4dCxcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmllbGQuc2VsZWN0aW9uU2V0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZU1pc3NpbmcoX3RoaXMuZXhlY3V0ZVNlbGVjdGlvblNldCh7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblNldDogZmllbGQuc2VsZWN0aW9uU2V0LFxuICAgICAgICAgICAgICAgICAgICByb290VmFsdWU6IGl0ZW0sXG4gICAgICAgICAgICAgICAgICAgIGV4ZWNDb250ZXh0OiBleGVjQ29udGV4dCxcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhc3NlcnRTZWxlY3Rpb25TZXRGb3JJZFZhbHVlKGZpZWxkLCBpdGVtKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMuZnJlZXplUmVzdWx0cyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBPYmplY3QuZnJlZXplKGFycmF5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyByZXN1bHQ6IGFycmF5LCBtaXNzaW5nOiBtaXNzaW5nIH07XG4gICAgfTtcbiAgICByZXR1cm4gU3RvcmVSZWFkZXI7XG59KCkpO1xuZnVuY3Rpb24gYXNzZXJ0U2VsZWN0aW9uU2V0Rm9ySWRWYWx1ZShmaWVsZCwgdmFsdWUpIHtcbiAgICBpZiAoIWZpZWxkLnNlbGVjdGlvblNldCAmJiBpc0lkVmFsdWUodmFsdWUpKSB7XG4gICAgICAgIHRocm93IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IG5ldyBJbnZhcmlhbnRFcnJvcigxMCkgOiBuZXcgSW52YXJpYW50RXJyb3IoXCJNaXNzaW5nIHNlbGVjdGlvbiBzZXQgZm9yIG9iamVjdCBvZiB0eXBlIFwiICsgdmFsdWUudHlwZW5hbWUgKyBcIiByZXR1cm5lZCBmb3IgcXVlcnkgZmllbGQgXCIgKyBmaWVsZC5uYW1lLnZhbHVlKTtcbiAgICB9XG59XG5mdW5jdGlvbiBkZWZhdWx0RnJhZ21lbnRNYXRjaGVyKCkge1xuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gYXNzZXJ0SWRWYWx1ZShpZFZhbHVlKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGlzSWRWYWx1ZShpZFZhbHVlKSwgMTEpIDogaW52YXJpYW50KGlzSWRWYWx1ZShpZFZhbHVlKSwgXCJFbmNvdW50ZXJlZCBhIHN1Yi1zZWxlY3Rpb24gb24gdGhlIHF1ZXJ5LCBidXQgdGhlIHN0b3JlIGRvZXNuJ3QgaGF2ZSBhbiBvYmplY3QgcmVmZXJlbmNlLiBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW4gZHVyaW5nIG5vcm1hbCB1c2UgdW5sZXNzIHlvdSBoYXZlIGN1c3RvbSBjb2RlIHRoYXQgaXMgZGlyZWN0bHkgbWFuaXB1bGF0aW5nIHRoZSBzdG9yZTsgcGxlYXNlIGZpbGUgYW4gaXNzdWUuXCIpO1xufVxuZnVuY3Rpb24gcmVhZFN0b3JlUmVzb2x2ZXIob2JqZWN0LCB0eXBlbmFtZSwgZmllbGROYW1lLCBhcmdzLCBjb250ZXh0LCBfYSkge1xuICAgIHZhciByZXN1bHRLZXkgPSBfYS5yZXN1bHRLZXksIGRpcmVjdGl2ZXMgPSBfYS5kaXJlY3RpdmVzO1xuICAgIHZhciBzdG9yZUtleU5hbWUgPSBmaWVsZE5hbWU7XG4gICAgaWYgKGFyZ3MgfHwgZGlyZWN0aXZlcykge1xuICAgICAgICBzdG9yZUtleU5hbWUgPSBnZXRTdG9yZUtleU5hbWUoc3RvcmVLZXlOYW1lLCBhcmdzLCBkaXJlY3RpdmVzKTtcbiAgICB9XG4gICAgdmFyIGZpZWxkVmFsdWUgPSB2b2lkIDA7XG4gICAgaWYgKG9iamVjdCkge1xuICAgICAgICBmaWVsZFZhbHVlID0gb2JqZWN0W3N0b3JlS2V5TmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgZmllbGRWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgIGNvbnRleHQuY2FjaGVSZWRpcmVjdHMgJiZcbiAgICAgICAgICAgIHR5cGVvZiB0eXBlbmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gY29udGV4dC5jYWNoZVJlZGlyZWN0c1t0eXBlbmFtZV07XG4gICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNvbHZlciA9IHR5cGVbZmllbGROYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRWYWx1ZSA9IHJlc29sdmVyKG9iamVjdCwgYXJncywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Q2FjaGVLZXk6IGZ1bmN0aW9uIChzdG9yZU9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IGNvbnRleHQuZGF0YUlkRnJvbU9iamVjdChzdG9yZU9iaik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlkICYmIHRvSWRWYWx1ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW5hbWU6IHN0b3JlT2JqLl9fdHlwZW5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmaWVsZFZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdWx0OiBmaWVsZFZhbHVlLFxuICAgICAgICAgICAgbWlzc2luZzogW3tcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogc3RvcmVLZXlOYW1lLFxuICAgICAgICAgICAgICAgICAgICB0b2xlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoaXNKc29uVmFsdWUoZmllbGRWYWx1ZSkpIHtcbiAgICAgICAgZmllbGRWYWx1ZSA9IGZpZWxkVmFsdWUuanNvbjtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdWx0OiBmaWVsZFZhbHVlLFxuICAgIH07XG59XG5cbnZhciBPYmplY3RDYWNoZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gT2JqZWN0Q2FjaGUoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YSA9PT0gdm9pZCAwKSB7IGRhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpOyB9XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuICAgIE9iamVjdENhY2hlLnByb3RvdHlwZS50b09iamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICB9O1xuICAgIE9iamVjdENhY2hlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoZGF0YUlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbZGF0YUlkXTtcbiAgICB9O1xuICAgIE9iamVjdENhY2hlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoZGF0YUlkLCB2YWx1ZSkge1xuICAgICAgICB0aGlzLmRhdGFbZGF0YUlkXSA9IHZhbHVlO1xuICAgIH07XG4gICAgT2JqZWN0Q2FjaGUucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChkYXRhSWQpIHtcbiAgICAgICAgdGhpcy5kYXRhW2RhdGFJZF0gPSB2b2lkIDA7XG4gICAgfTtcbiAgICBPYmplY3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfTtcbiAgICBPYmplY3RDYWNoZS5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IG5ld0RhdGEgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB9O1xuICAgIHJldHVybiBPYmplY3RDYWNoZTtcbn0oKSk7XG5mdW5jdGlvbiBkZWZhdWx0Tm9ybWFsaXplZENhY2hlRmFjdG9yeSQxKHNlZWQpIHtcbiAgICByZXR1cm4gbmV3IE9iamVjdENhY2hlKHNlZWQpO1xufVxuXG52YXIgV3JpdGVFcnJvciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFdyaXRlRXJyb3IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gV3JpdGVFcnJvcigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnR5cGUgPSAnV3JpdGVFcnJvcic7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFdyaXRlRXJyb3I7XG59KEVycm9yKSk7XG5mdW5jdGlvbiBlbmhhbmNlRXJyb3JXaXRoRG9jdW1lbnQoZXJyb3IsIGRvY3VtZW50KSB7XG4gICAgdmFyIGVuaGFuY2VkRXJyb3IgPSBuZXcgV3JpdGVFcnJvcihcIkVycm9yIHdyaXRpbmcgcmVzdWx0IHRvIHN0b3JlIGZvciBxdWVyeTpcXG4gXCIgKyBKU09OLnN0cmluZ2lmeShkb2N1bWVudCkpO1xuICAgIGVuaGFuY2VkRXJyb3IubWVzc2FnZSArPSAnXFxuJyArIGVycm9yLm1lc3NhZ2U7XG4gICAgZW5oYW5jZWRFcnJvci5zdGFjayA9IGVycm9yLnN0YWNrO1xuICAgIHJldHVybiBlbmhhbmNlZEVycm9yO1xufVxudmFyIFN0b3JlV3JpdGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdG9yZVdyaXRlcigpIHtcbiAgICB9XG4gICAgU3RvcmVXcml0ZXIucHJvdG90eXBlLndyaXRlUXVlcnlUb1N0b3JlID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBxdWVyeSA9IF9hLnF1ZXJ5LCByZXN1bHQgPSBfYS5yZXN1bHQsIF9iID0gX2Euc3RvcmUsIHN0b3JlID0gX2IgPT09IHZvaWQgMCA/IGRlZmF1bHROb3JtYWxpemVkQ2FjaGVGYWN0b3J5KCkgOiBfYiwgdmFyaWFibGVzID0gX2EudmFyaWFibGVzLCBkYXRhSWRGcm9tT2JqZWN0ID0gX2EuZGF0YUlkRnJvbU9iamVjdCwgZnJhZ21lbnRNYXRjaGVyRnVuY3Rpb24gPSBfYS5mcmFnbWVudE1hdGNoZXJGdW5jdGlvbjtcbiAgICAgICAgcmV0dXJuIHRoaXMud3JpdGVSZXN1bHRUb1N0b3JlKHtcbiAgICAgICAgICAgIGRhdGFJZDogJ1JPT1RfUVVFUlknLFxuICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICBkb2N1bWVudDogcXVlcnksXG4gICAgICAgICAgICBzdG9yZTogc3RvcmUsXG4gICAgICAgICAgICB2YXJpYWJsZXM6IHZhcmlhYmxlcyxcbiAgICAgICAgICAgIGRhdGFJZEZyb21PYmplY3Q6IGRhdGFJZEZyb21PYmplY3QsXG4gICAgICAgICAgICBmcmFnbWVudE1hdGNoZXJGdW5jdGlvbjogZnJhZ21lbnRNYXRjaGVyRnVuY3Rpb24sXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU3RvcmVXcml0ZXIucHJvdG90eXBlLndyaXRlUmVzdWx0VG9TdG9yZSA9IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgZGF0YUlkID0gX2EuZGF0YUlkLCByZXN1bHQgPSBfYS5yZXN1bHQsIGRvY3VtZW50ID0gX2EuZG9jdW1lbnQsIF9iID0gX2Euc3RvcmUsIHN0b3JlID0gX2IgPT09IHZvaWQgMCA/IGRlZmF1bHROb3JtYWxpemVkQ2FjaGVGYWN0b3J5KCkgOiBfYiwgdmFyaWFibGVzID0gX2EudmFyaWFibGVzLCBkYXRhSWRGcm9tT2JqZWN0ID0gX2EuZGF0YUlkRnJvbU9iamVjdCwgZnJhZ21lbnRNYXRjaGVyRnVuY3Rpb24gPSBfYS5mcmFnbWVudE1hdGNoZXJGdW5jdGlvbjtcbiAgICAgICAgdmFyIG9wZXJhdGlvbkRlZmluaXRpb24gPSBnZXRPcGVyYXRpb25EZWZpbml0aW9uKGRvY3VtZW50KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndyaXRlU2VsZWN0aW9uU2V0VG9TdG9yZSh7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgZGF0YUlkOiBkYXRhSWQsXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uU2V0OiBvcGVyYXRpb25EZWZpbml0aW9uLnNlbGVjdGlvblNldCxcbiAgICAgICAgICAgICAgICBjb250ZXh0OiB7XG4gICAgICAgICAgICAgICAgICAgIHN0b3JlOiBzdG9yZSxcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc2VkRGF0YToge30sXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlczogYXNzaWduKHt9LCBnZXREZWZhdWx0VmFsdWVzKG9wZXJhdGlvbkRlZmluaXRpb24pLCB2YXJpYWJsZXMpLFxuICAgICAgICAgICAgICAgICAgICBkYXRhSWRGcm9tT2JqZWN0OiBkYXRhSWRGcm9tT2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudE1hcDogY3JlYXRlRnJhZ21lbnRNYXAoZ2V0RnJhZ21lbnREZWZpbml0aW9ucyhkb2N1bWVudCkpLFxuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudE1hdGNoZXJGdW5jdGlvbjogZnJhZ21lbnRNYXRjaGVyRnVuY3Rpb24sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBlbmhhbmNlRXJyb3JXaXRoRG9jdW1lbnQoZSwgZG9jdW1lbnQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdG9yZVdyaXRlci5wcm90b3R5cGUud3JpdGVTZWxlY3Rpb25TZXRUb1N0b3JlID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciByZXN1bHQgPSBfYS5yZXN1bHQsIGRhdGFJZCA9IF9hLmRhdGFJZCwgc2VsZWN0aW9uU2V0ID0gX2Euc2VsZWN0aW9uU2V0LCBjb250ZXh0ID0gX2EuY29udGV4dDtcbiAgICAgICAgdmFyIHZhcmlhYmxlcyA9IGNvbnRleHQudmFyaWFibGVzLCBzdG9yZSA9IGNvbnRleHQuc3RvcmUsIGZyYWdtZW50TWFwID0gY29udGV4dC5mcmFnbWVudE1hcDtcbiAgICAgICAgc2VsZWN0aW9uU2V0LnNlbGVjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICBpZiAoIXNob3VsZEluY2x1ZGUoc2VsZWN0aW9uLCB2YXJpYWJsZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzRmllbGQoc2VsZWN0aW9uKSkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHRGaWVsZEtleSA9IHJlc3VsdEtleU5hbWVGcm9tRmllbGQoc2VsZWN0aW9uKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHRbcmVzdWx0RmllbGRLZXldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLndyaXRlRmllbGRUb1N0b3JlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFJZDogZGF0YUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IHNlbGVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzRGVmZXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXNDbGllbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbi5kaXJlY3RpdmVzICYmIHNlbGVjdGlvbi5kaXJlY3RpdmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWZlcmVkID0gc2VsZWN0aW9uLmRpcmVjdGl2ZXMuc29tZShmdW5jdGlvbiAoZGlyZWN0aXZlKSB7IHJldHVybiBkaXJlY3RpdmUubmFtZSAmJiBkaXJlY3RpdmUubmFtZS52YWx1ZSA9PT0gJ2RlZmVyJzsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc0NsaWVudCA9IHNlbGVjdGlvbi5kaXJlY3RpdmVzLnNvbWUoZnVuY3Rpb24gKGRpcmVjdGl2ZSkgeyByZXR1cm4gZGlyZWN0aXZlLm5hbWUgJiYgZGlyZWN0aXZlLm5hbWUudmFsdWUgPT09ICdjbGllbnQnOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRGVmZXJlZCAmJiAhaXNDbGllbnQgJiYgY29udGV4dC5mcmFnbWVudE1hdGNoZXJGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiIHx8IGludmFyaWFudC53YXJuKFwiTWlzc2luZyBmaWVsZCBcIiArIHJlc3VsdEZpZWxkS2V5ICsgXCIgaW4gXCIgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQsIG51bGwsIDIpLnN1YnN0cmluZygwLCAxMDApKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBmcmFnbWVudCA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICBpZiAoaXNJbmxpbmVGcmFnbWVudChzZWxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyYWdtZW50ID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnQgPSAoZnJhZ21lbnRNYXAgfHwge30pW3NlbGVjdGlvbi5uYW1lLnZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZyYWdtZW50LCAzKSA6IGludmFyaWFudChmcmFnbWVudCwgXCJObyBmcmFnbWVudCBuYW1lZCBcIiArIHNlbGVjdGlvbi5uYW1lLnZhbHVlICsgXCIuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQuZnJhZ21lbnRNYXRjaGVyRnVuY3Rpb24gJiYgZnJhZ21lbnQudHlwZUNvbmRpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBkYXRhSWQgfHwgJ3NlbGYnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWRWYWx1ZSA9IHRvSWRWYWx1ZSh7IGlkOiBpZCwgdHlwZW5hbWU6IHVuZGVmaW5lZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZha2VDb250ZXh0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmU6IG5ldyBPYmplY3RDYWNoZSgoX2EgPSB7fSwgX2FbaWRdID0gcmVzdWx0LCBfYSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVSZWRpcmVjdHM6IHt9LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBjb250ZXh0LmZyYWdtZW50TWF0Y2hlckZ1bmN0aW9uKGlkVmFsdWUsIGZyYWdtZW50LnR5cGVDb25kaXRpb24ubmFtZS52YWx1ZSwgZmFrZUNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzUHJvZHVjdGlvbigpICYmIG1hdGNoID09PSAnaGV1cmlzdGljJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiIHx8IGludmFyaWFudC5lcnJvcignV0FSTklORzogaGV1cmlzdGljIGZyYWdtZW50IG1hdGNoaW5nIGdvaW5nIG9uIScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgPSAhIW1hdGNoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy53cml0ZVNlbGVjdGlvblNldFRvU3RvcmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25TZXQ6IGZyYWdtZW50LnNlbGVjdGlvblNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFJZDogZGF0YUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN0b3JlO1xuICAgIH07XG4gICAgU3RvcmVXcml0ZXIucHJvdG90eXBlLndyaXRlRmllbGRUb1N0b3JlID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBfYjtcbiAgICAgICAgdmFyIGZpZWxkID0gX2EuZmllbGQsIHZhbHVlID0gX2EudmFsdWUsIGRhdGFJZCA9IF9hLmRhdGFJZCwgY29udGV4dCA9IF9hLmNvbnRleHQ7XG4gICAgICAgIHZhciB2YXJpYWJsZXMgPSBjb250ZXh0LnZhcmlhYmxlcywgZGF0YUlkRnJvbU9iamVjdCA9IGNvbnRleHQuZGF0YUlkRnJvbU9iamVjdCwgc3RvcmUgPSBjb250ZXh0LnN0b3JlO1xuICAgICAgICB2YXIgc3RvcmVWYWx1ZTtcbiAgICAgICAgdmFyIHN0b3JlT2JqZWN0O1xuICAgICAgICB2YXIgc3RvcmVGaWVsZE5hbWUgPSBzdG9yZUtleU5hbWVGcm9tRmllbGQoZmllbGQsIHZhcmlhYmxlcyk7XG4gICAgICAgIGlmICghZmllbGQuc2VsZWN0aW9uU2V0IHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICBzdG9yZVZhbHVlID1cbiAgICAgICAgICAgICAgICB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgICAgICAgICAgICAgP1xuICAgICAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnanNvbicsIGpzb246IHZhbHVlIH1cbiAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciBnZW5lcmF0ZWRJZCA9IGRhdGFJZCArIFwiLlwiICsgc3RvcmVGaWVsZE5hbWU7XG4gICAgICAgICAgICBzdG9yZVZhbHVlID0gdGhpcy5wcm9jZXNzQXJyYXlWYWx1ZSh2YWx1ZSwgZ2VuZXJhdGVkSWQsIGZpZWxkLnNlbGVjdGlvblNldCwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgdmFsdWVEYXRhSWQgPSBkYXRhSWQgKyBcIi5cIiArIHN0b3JlRmllbGROYW1lO1xuICAgICAgICAgICAgdmFyIGdlbmVyYXRlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAoIWlzR2VuZXJhdGVkSWQodmFsdWVEYXRhSWQpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVEYXRhSWQgPSAnJCcgKyB2YWx1ZURhdGFJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhSWRGcm9tT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbWFudGljSWQgPSBkYXRhSWRGcm9tT2JqZWN0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoIXNlbWFudGljSWQgfHwgIWlzR2VuZXJhdGVkSWQoc2VtYW50aWNJZCksIDQpIDogaW52YXJpYW50KCFzZW1hbnRpY0lkIHx8ICFpc0dlbmVyYXRlZElkKHNlbWFudGljSWQpLCAnSURzIHJldHVybmVkIGJ5IGRhdGFJZEZyb21PYmplY3QgY2Fubm90IGJlZ2luIHdpdGggdGhlIFwiJFwiIGNoYXJhY3Rlci4nKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VtYW50aWNJZCB8fFxuICAgICAgICAgICAgICAgICAgICAodHlwZW9mIHNlbWFudGljSWQgPT09ICdudW1iZXInICYmIHNlbWFudGljSWQgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlRGF0YUlkID0gc2VtYW50aWNJZDtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc0RhdGFQcm9jZXNzZWQodmFsdWVEYXRhSWQsIGZpZWxkLCBjb250ZXh0LnByb2Nlc3NlZERhdGEpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53cml0ZVNlbGVjdGlvblNldFRvU3RvcmUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhSWQ6IHZhbHVlRGF0YUlkLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25TZXQ6IGZpZWxkLnNlbGVjdGlvblNldCxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0eXBlbmFtZSA9IHZhbHVlLl9fdHlwZW5hbWU7XG4gICAgICAgICAgICBzdG9yZVZhbHVlID0gdG9JZFZhbHVlKHsgaWQ6IHZhbHVlRGF0YUlkLCB0eXBlbmFtZTogdHlwZW5hbWUgfSwgZ2VuZXJhdGVkKTtcbiAgICAgICAgICAgIHN0b3JlT2JqZWN0ID0gc3RvcmUuZ2V0KGRhdGFJZCk7XG4gICAgICAgICAgICB2YXIgZXNjYXBlZElkID0gc3RvcmVPYmplY3QgJiYgc3RvcmVPYmplY3Rbc3RvcmVGaWVsZE5hbWVdO1xuICAgICAgICAgICAgaWYgKGVzY2FwZWRJZCAhPT0gc3RvcmVWYWx1ZSAmJiBpc0lkVmFsdWUoZXNjYXBlZElkKSkge1xuICAgICAgICAgICAgICAgIHZhciBoYWRUeXBlbmFtZSA9IGVzY2FwZWRJZC50eXBlbmFtZSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBoYXNUeXBlbmFtZSA9IHR5cGVuYW1lICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGVuYW1lQ2hhbmdlZCA9IGhhZFR5cGVuYW1lICYmIGhhc1R5cGVuYW1lICYmIGVzY2FwZWRJZC50eXBlbmFtZSAhPT0gdHlwZW5hbWU7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KCFnZW5lcmF0ZWQgfHwgZXNjYXBlZElkLmdlbmVyYXRlZCB8fCB0eXBlbmFtZUNoYW5nZWQsIDUpIDogaW52YXJpYW50KCFnZW5lcmF0ZWQgfHwgZXNjYXBlZElkLmdlbmVyYXRlZCB8fCB0eXBlbmFtZUNoYW5nZWQsIFwiU3RvcmUgZXJyb3I6IHRoZSBhcHBsaWNhdGlvbiBhdHRlbXB0ZWQgdG8gd3JpdGUgYW4gb2JqZWN0IHdpdGggbm8gcHJvdmlkZWQgaWQgYnV0IHRoZSBzdG9yZSBhbHJlYWR5IGNvbnRhaW5zIGFuIGlkIG9mIFwiICsgZXNjYXBlZElkLmlkICsgXCIgZm9yIHRoaXMgb2JqZWN0LiBUaGUgc2VsZWN0aW9uU2V0IHRoYXQgd2FzIHRyeWluZyB0byBiZSB3cml0dGVuIGlzOlxcblwiICsgSlNPTi5zdHJpbmdpZnkoZmllbGQpKTtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoIWhhZFR5cGVuYW1lIHx8IGhhc1R5cGVuYW1lLCA2KSA6IGludmFyaWFudCghaGFkVHlwZW5hbWUgfHwgaGFzVHlwZW5hbWUsIFwiU3RvcmUgZXJyb3I6IHRoZSBhcHBsaWNhdGlvbiBhdHRlbXB0ZWQgdG8gd3JpdGUgYW4gb2JqZWN0IHdpdGggbm8gcHJvdmlkZWQgdHlwZW5hbWUgYnV0IHRoZSBzdG9yZSBhbHJlYWR5IGNvbnRhaW5zIGFuIG9iamVjdCB3aXRoIHR5cGVuYW1lIG9mIFwiICsgZXNjYXBlZElkLnR5cGVuYW1lICsgXCIgZm9yIHRoZSBvYmplY3Qgb2YgaWQgXCIgKyBlc2NhcGVkSWQuaWQgKyBcIi4gVGhlIHNlbGVjdGlvblNldCB0aGF0IHdhcyB0cnlpbmcgdG8gYmUgd3JpdHRlbiBpczpcXG5cIiArIEpTT04uc3RyaW5naWZ5KGZpZWxkKSk7XG4gICAgICAgICAgICAgICAgaWYgKGVzY2FwZWRJZC5nZW5lcmF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVuYW1lQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFnZW5lcmF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZS5kZWxldGUoZXNjYXBlZElkLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlV2l0aEdlbmVyYXRlZChlc2NhcGVkSWQuaWQsIHN0b3JlVmFsdWUuaWQsIHN0b3JlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdG9yZU9iamVjdCA9IHN0b3JlLmdldChkYXRhSWQpO1xuICAgICAgICBpZiAoIXN0b3JlT2JqZWN0IHx8ICFpc0VxdWFsKHN0b3JlVmFsdWUsIHN0b3JlT2JqZWN0W3N0b3JlRmllbGROYW1lXSkpIHtcbiAgICAgICAgICAgIHN0b3JlLnNldChkYXRhSWQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBzdG9yZU9iamVjdCksIChfYiA9IHt9LCBfYltzdG9yZUZpZWxkTmFtZV0gPSBzdG9yZVZhbHVlLCBfYikpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3RvcmVXcml0ZXIucHJvdG90eXBlLnByb2Nlc3NBcnJheVZhbHVlID0gZnVuY3Rpb24gKHZhbHVlLCBnZW5lcmF0ZWRJZCwgc2VsZWN0aW9uU2V0LCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiB2YWx1ZS5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGl0ZW1EYXRhSWQgPSBnZW5lcmF0ZWRJZCArIFwiLlwiICsgaW5kZXg7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5wcm9jZXNzQXJyYXlWYWx1ZShpdGVtLCBpdGVtRGF0YUlkLCBzZWxlY3Rpb25TZXQsIGNvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGdlbmVyYXRlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAoY29udGV4dC5kYXRhSWRGcm9tT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbWFudGljSWQgPSBjb250ZXh0LmRhdGFJZEZyb21PYmplY3QoaXRlbSk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbWFudGljSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbURhdGFJZCA9IHNlbWFudGljSWQ7XG4gICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNEYXRhUHJvY2Vzc2VkKGl0ZW1EYXRhSWQsIHNlbGVjdGlvblNldCwgY29udGV4dC5wcm9jZXNzZWREYXRhKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLndyaXRlU2VsZWN0aW9uU2V0VG9TdG9yZSh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFJZDogaXRlbURhdGFJZCxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBpdGVtLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25TZXQ6IHNlbGVjdGlvblNldCxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0b0lkVmFsdWUoeyBpZDogaXRlbURhdGFJZCwgdHlwZW5hbWU6IGl0ZW0uX190eXBlbmFtZSB9LCBnZW5lcmF0ZWQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBTdG9yZVdyaXRlcjtcbn0oKSk7XG5mdW5jdGlvbiBpc0dlbmVyYXRlZElkKGlkKSB7XG4gICAgcmV0dXJuIGlkWzBdID09PSAnJCc7XG59XG5mdW5jdGlvbiBtZXJnZVdpdGhHZW5lcmF0ZWQoZ2VuZXJhdGVkS2V5LCByZWFsS2V5LCBjYWNoZSkge1xuICAgIGlmIChnZW5lcmF0ZWRLZXkgPT09IHJlYWxLZXkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgZ2VuZXJhdGVkID0gY2FjaGUuZ2V0KGdlbmVyYXRlZEtleSk7XG4gICAgdmFyIHJlYWwgPSBjYWNoZS5nZXQocmVhbEtleSk7XG4gICAgdmFyIG1hZGVDaGFuZ2VzID0gZmFsc2U7XG4gICAgT2JqZWN0LmtleXMoZ2VuZXJhdGVkKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gZ2VuZXJhdGVkW2tleV07XG4gICAgICAgIHZhciByZWFsVmFsdWUgPSByZWFsW2tleV07XG4gICAgICAgIGlmIChpc0lkVmFsdWUodmFsdWUpICYmXG4gICAgICAgICAgICBpc0dlbmVyYXRlZElkKHZhbHVlLmlkKSAmJlxuICAgICAgICAgICAgaXNJZFZhbHVlKHJlYWxWYWx1ZSkgJiZcbiAgICAgICAgICAgICFpc0VxdWFsKHZhbHVlLCByZWFsVmFsdWUpICYmXG4gICAgICAgICAgICBtZXJnZVdpdGhHZW5lcmF0ZWQodmFsdWUuaWQsIHJlYWxWYWx1ZS5pZCwgY2FjaGUpKSB7XG4gICAgICAgICAgICBtYWRlQ2hhbmdlcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjYWNoZS5kZWxldGUoZ2VuZXJhdGVkS2V5KTtcbiAgICB2YXIgbmV3UmVhbFZhbHVlID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGdlbmVyYXRlZCksIHJlYWwpO1xuICAgIGlmIChpc0VxdWFsKG5ld1JlYWxWYWx1ZSwgcmVhbCkpIHtcbiAgICAgICAgcmV0dXJuIG1hZGVDaGFuZ2VzO1xuICAgIH1cbiAgICBjYWNoZS5zZXQocmVhbEtleSwgbmV3UmVhbFZhbHVlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGlzRGF0YVByb2Nlc3NlZChkYXRhSWQsIGZpZWxkLCBwcm9jZXNzZWREYXRhKSB7XG4gICAgaWYgKCFwcm9jZXNzZWREYXRhKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHByb2Nlc3NlZERhdGFbZGF0YUlkXSkge1xuICAgICAgICBpZiAocHJvY2Vzc2VkRGF0YVtkYXRhSWRdLmluZGV4T2YoZmllbGQpID49IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcHJvY2Vzc2VkRGF0YVtkYXRhSWRdLnB1c2goZmllbGQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcm9jZXNzZWREYXRhW2RhdGFJZF0gPSBbZmllbGRdO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbnZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgIGZyYWdtZW50TWF0Y2hlcjogbmV3IEhldXJpc3RpY0ZyYWdtZW50TWF0Y2hlcigpLFxuICAgIGRhdGFJZEZyb21PYmplY3Q6IGRlZmF1bHREYXRhSWRGcm9tT2JqZWN0LFxuICAgIGFkZFR5cGVuYW1lOiB0cnVlLFxuICAgIHJlc3VsdENhY2hpbmc6IHRydWUsXG4gICAgZnJlZXplUmVzdWx0czogZmFsc2UsXG59O1xuZnVuY3Rpb24gZGVmYXVsdERhdGFJZEZyb21PYmplY3QocmVzdWx0KSB7XG4gICAgaWYgKHJlc3VsdC5fX3R5cGVuYW1lKSB7XG4gICAgICAgIGlmIChyZXN1bHQuaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5fX3R5cGVuYW1lICsgXCI6XCIgKyByZXN1bHQuaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdC5faWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5fX3R5cGVuYW1lICsgXCI6XCIgKyByZXN1bHQuX2lkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxudmFyIGhhc093biQxID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBPcHRpbWlzdGljQ2FjaGVMYXllciA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE9wdGltaXN0aWNDYWNoZUxheWVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE9wdGltaXN0aWNDYWNoZUxheWVyKG9wdGltaXN0aWNJZCwgcGFyZW50LCB0cmFuc2FjdGlvbikge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBPYmplY3QuY3JlYXRlKG51bGwpKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5vcHRpbWlzdGljSWQgPSBvcHRpbWlzdGljSWQ7XG4gICAgICAgIF90aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgX3RoaXMudHJhbnNhY3Rpb24gPSB0cmFuc2FjdGlvbjtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBPcHRpbWlzdGljQ2FjaGVMYXllci5wcm90b3R5cGUudG9PYmplY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdGhpcy5wYXJlbnQudG9PYmplY3QoKSksIHRoaXMuZGF0YSk7XG4gICAgfTtcbiAgICBPcHRpbWlzdGljQ2FjaGVMYXllci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGRhdGFJZCkge1xuICAgICAgICByZXR1cm4gaGFzT3duJDEuY2FsbCh0aGlzLmRhdGEsIGRhdGFJZClcbiAgICAgICAgICAgID8gdGhpcy5kYXRhW2RhdGFJZF1cbiAgICAgICAgICAgIDogdGhpcy5wYXJlbnQuZ2V0KGRhdGFJZCk7XG4gICAgfTtcbiAgICByZXR1cm4gT3B0aW1pc3RpY0NhY2hlTGF5ZXI7XG59KE9iamVjdENhY2hlKSk7XG52YXIgSW5NZW1vcnlDYWNoZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEluTWVtb3J5Q2FjaGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gSW5NZW1vcnlDYWNoZShjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZyA9PT0gdm9pZCAwKSB7IGNvbmZpZyA9IHt9OyB9XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLndhdGNoZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIF90aGlzLnR5cGVuYW1lRG9jdW1lbnRDYWNoZSA9IG5ldyBNYXAoKTtcbiAgICAgICAgX3RoaXMuY2FjaGVLZXlSb290ID0gbmV3IEtleVRyaWUoY2FuVXNlV2Vha01hcCk7XG4gICAgICAgIF90aGlzLnNpbGVuY2VCcm9hZGNhc3QgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuY29uZmlnID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGRlZmF1bHRDb25maWcpLCBjb25maWcpO1xuICAgICAgICBpZiAoX3RoaXMuY29uZmlnLmN1c3RvbVJlc29sdmVycykge1xuICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiIHx8IGludmFyaWFudC53YXJuKCdjdXN0b21SZXNvbHZlcnMgaGF2ZSBiZWVuIHJlbmFtZWQgdG8gY2FjaGVSZWRpcmVjdHMuIFBsZWFzZSB1cGRhdGUgeW91ciBjb25maWcgYXMgd2Ugd2lsbCBiZSBkZXByZWNhdGluZyBjdXN0b21SZXNvbHZlcnMgaW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvbi4nKTtcbiAgICAgICAgICAgIF90aGlzLmNvbmZpZy5jYWNoZVJlZGlyZWN0cyA9IF90aGlzLmNvbmZpZy5jdXN0b21SZXNvbHZlcnM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF90aGlzLmNvbmZpZy5jYWNoZVJlc29sdmVycykge1xuICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiIHx8IGludmFyaWFudC53YXJuKCdjYWNoZVJlc29sdmVycyBoYXZlIGJlZW4gcmVuYW1lZCB0byBjYWNoZVJlZGlyZWN0cy4gUGxlYXNlIHVwZGF0ZSB5b3VyIGNvbmZpZyBhcyB3ZSB3aWxsIGJlIGRlcHJlY2F0aW5nIGNhY2hlUmVzb2x2ZXJzIGluIHRoZSBuZXh0IG1ham9yIHZlcnNpb24uJyk7XG4gICAgICAgICAgICBfdGhpcy5jb25maWcuY2FjaGVSZWRpcmVjdHMgPSBfdGhpcy5jb25maWcuY2FjaGVSZXNvbHZlcnM7XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMuYWRkVHlwZW5hbWUgPSAhIV90aGlzLmNvbmZpZy5hZGRUeXBlbmFtZTtcbiAgICAgICAgX3RoaXMuZGF0YSA9IF90aGlzLmNvbmZpZy5yZXN1bHRDYWNoaW5nXG4gICAgICAgICAgICA/IG5ldyBEZXBUcmFja2luZ0NhY2hlKClcbiAgICAgICAgICAgIDogbmV3IE9iamVjdENhY2hlKCk7XG4gICAgICAgIF90aGlzLm9wdGltaXN0aWNEYXRhID0gX3RoaXMuZGF0YTtcbiAgICAgICAgX3RoaXMuc3RvcmVXcml0ZXIgPSBuZXcgU3RvcmVXcml0ZXIoKTtcbiAgICAgICAgX3RoaXMuc3RvcmVSZWFkZXIgPSBuZXcgU3RvcmVSZWFkZXIoe1xuICAgICAgICAgICAgY2FjaGVLZXlSb290OiBfdGhpcy5jYWNoZUtleVJvb3QsXG4gICAgICAgICAgICBmcmVlemVSZXN1bHRzOiBjb25maWcuZnJlZXplUmVzdWx0cyxcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBjYWNoZSA9IF90aGlzO1xuICAgICAgICB2YXIgbWF5YmVCcm9hZGNhc3RXYXRjaCA9IGNhY2hlLm1heWJlQnJvYWRjYXN0V2F0Y2g7XG4gICAgICAgIF90aGlzLm1heWJlQnJvYWRjYXN0V2F0Y2ggPSB3cmFwKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF5YmVCcm9hZGNhc3RXYXRjaC5jYWxsKF90aGlzLCBjKTtcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgbWFrZUNhY2hlS2V5OiBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgICAgIGlmIChjLm9wdGltaXN0aWMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYy5wcmV2aW91c1Jlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjYWNoZS5kYXRhIGluc3RhbmNlb2YgRGVwVHJhY2tpbmdDYWNoZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGUuY2FjaGVLZXlSb290Lmxvb2t1cChjLnF1ZXJ5LCBKU09OLnN0cmluZ2lmeShjLnZhcmlhYmxlcykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgSW5NZW1vcnlDYWNoZS5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhKVxuICAgICAgICAgICAgdGhpcy5kYXRhLnJlcGxhY2UoZGF0YSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgSW5NZW1vcnlDYWNoZS5wcm90b3R5cGUuZXh0cmFjdCA9IGZ1bmN0aW9uIChvcHRpbWlzdGljKSB7XG4gICAgICAgIGlmIChvcHRpbWlzdGljID09PSB2b2lkIDApIHsgb3B0aW1pc3RpYyA9IGZhbHNlOyB9XG4gICAgICAgIHJldHVybiAob3B0aW1pc3RpYyA/IHRoaXMub3B0aW1pc3RpY0RhdGEgOiB0aGlzLmRhdGEpLnRvT2JqZWN0KCk7XG4gICAgfTtcbiAgICBJbk1lbW9yeUNhY2hlLnByb3RvdHlwZS5yZWFkID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnJvb3RJZCA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgICAgIHR5cGVvZiB0aGlzLmRhdGEuZ2V0KG9wdGlvbnMucm9vdElkKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmcmFnbWVudE1hdGNoZXIgPSB0aGlzLmNvbmZpZy5mcmFnbWVudE1hdGNoZXI7XG4gICAgICAgIHZhciBmcmFnbWVudE1hdGNoZXJGdW5jdGlvbiA9IGZyYWdtZW50TWF0Y2hlciAmJiBmcmFnbWVudE1hdGNoZXIubWF0Y2g7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlUmVhZGVyLnJlYWRRdWVyeUZyb21TdG9yZSh7XG4gICAgICAgICAgICBzdG9yZTogb3B0aW9ucy5vcHRpbWlzdGljID8gdGhpcy5vcHRpbWlzdGljRGF0YSA6IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIHF1ZXJ5OiB0aGlzLnRyYW5zZm9ybURvY3VtZW50KG9wdGlvbnMucXVlcnkpLFxuICAgICAgICAgICAgdmFyaWFibGVzOiBvcHRpb25zLnZhcmlhYmxlcyxcbiAgICAgICAgICAgIHJvb3RJZDogb3B0aW9ucy5yb290SWQsXG4gICAgICAgICAgICBmcmFnbWVudE1hdGNoZXJGdW5jdGlvbjogZnJhZ21lbnRNYXRjaGVyRnVuY3Rpb24sXG4gICAgICAgICAgICBwcmV2aW91c1Jlc3VsdDogb3B0aW9ucy5wcmV2aW91c1Jlc3VsdCxcbiAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICAgIH0pIHx8IG51bGw7XG4gICAgfTtcbiAgICBJbk1lbW9yeUNhY2hlLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uICh3cml0ZSkge1xuICAgICAgICB2YXIgZnJhZ21lbnRNYXRjaGVyID0gdGhpcy5jb25maWcuZnJhZ21lbnRNYXRjaGVyO1xuICAgICAgICB2YXIgZnJhZ21lbnRNYXRjaGVyRnVuY3Rpb24gPSBmcmFnbWVudE1hdGNoZXIgJiYgZnJhZ21lbnRNYXRjaGVyLm1hdGNoO1xuICAgICAgICB0aGlzLnN0b3JlV3JpdGVyLndyaXRlUmVzdWx0VG9TdG9yZSh7XG4gICAgICAgICAgICBkYXRhSWQ6IHdyaXRlLmRhdGFJZCxcbiAgICAgICAgICAgIHJlc3VsdDogd3JpdGUucmVzdWx0LFxuICAgICAgICAgICAgdmFyaWFibGVzOiB3cml0ZS52YXJpYWJsZXMsXG4gICAgICAgICAgICBkb2N1bWVudDogdGhpcy50cmFuc2Zvcm1Eb2N1bWVudCh3cml0ZS5xdWVyeSksXG4gICAgICAgICAgICBzdG9yZTogdGhpcy5kYXRhLFxuICAgICAgICAgICAgZGF0YUlkRnJvbU9iamVjdDogdGhpcy5jb25maWcuZGF0YUlkRnJvbU9iamVjdCxcbiAgICAgICAgICAgIGZyYWdtZW50TWF0Y2hlckZ1bmN0aW9uOiBmcmFnbWVudE1hdGNoZXJGdW5jdGlvbixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0V2F0Y2hlcygpO1xuICAgIH07XG4gICAgSW5NZW1vcnlDYWNoZS5wcm90b3R5cGUuZGlmZiA9IGZ1bmN0aW9uIChxdWVyeSkge1xuICAgICAgICB2YXIgZnJhZ21lbnRNYXRjaGVyID0gdGhpcy5jb25maWcuZnJhZ21lbnRNYXRjaGVyO1xuICAgICAgICB2YXIgZnJhZ21lbnRNYXRjaGVyRnVuY3Rpb24gPSBmcmFnbWVudE1hdGNoZXIgJiYgZnJhZ21lbnRNYXRjaGVyLm1hdGNoO1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVJlYWRlci5kaWZmUXVlcnlBZ2FpbnN0U3RvcmUoe1xuICAgICAgICAgICAgc3RvcmU6IHF1ZXJ5Lm9wdGltaXN0aWMgPyB0aGlzLm9wdGltaXN0aWNEYXRhIDogdGhpcy5kYXRhLFxuICAgICAgICAgICAgcXVlcnk6IHRoaXMudHJhbnNmb3JtRG9jdW1lbnQocXVlcnkucXVlcnkpLFxuICAgICAgICAgICAgdmFyaWFibGVzOiBxdWVyeS52YXJpYWJsZXMsXG4gICAgICAgICAgICByZXR1cm5QYXJ0aWFsRGF0YTogcXVlcnkucmV0dXJuUGFydGlhbERhdGEsXG4gICAgICAgICAgICBwcmV2aW91c1Jlc3VsdDogcXVlcnkucHJldmlvdXNSZXN1bHQsXG4gICAgICAgICAgICBmcmFnbWVudE1hdGNoZXJGdW5jdGlvbjogZnJhZ21lbnRNYXRjaGVyRnVuY3Rpb24sXG4gICAgICAgICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEluTWVtb3J5Q2FjaGUucHJvdG90eXBlLndhdGNoID0gZnVuY3Rpb24gKHdhdGNoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMud2F0Y2hlcy5hZGQod2F0Y2gpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMud2F0Y2hlcy5kZWxldGUod2F0Y2gpO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgSW5NZW1vcnlDYWNoZS5wcm90b3R5cGUuZXZpY3QgPSBmdW5jdGlvbiAocXVlcnkpIHtcbiAgICAgICAgdGhyb3cgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gbmV3IEludmFyaWFudEVycm9yKDcpIDogbmV3IEludmFyaWFudEVycm9yKFwiZXZpY3Rpb24gaXMgbm90IGltcGxlbWVudGVkIG9uIEluTWVtb3J5IENhY2hlXCIpO1xuICAgIH07XG4gICAgSW5NZW1vcnlDYWNoZS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZGF0YS5jbGVhcigpO1xuICAgICAgICB0aGlzLmJyb2FkY2FzdFdhdGNoZXMoKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH07XG4gICAgSW5NZW1vcnlDYWNoZS5wcm90b3R5cGUucmVtb3ZlT3B0aW1pc3RpYyA9IGZ1bmN0aW9uIChpZFRvUmVtb3ZlKSB7XG4gICAgICAgIHZhciB0b1JlYXBwbHkgPSBbXTtcbiAgICAgICAgdmFyIHJlbW92ZWRDb3VudCA9IDA7XG4gICAgICAgIHZhciBsYXllciA9IHRoaXMub3B0aW1pc3RpY0RhdGE7XG4gICAgICAgIHdoaWxlIChsYXllciBpbnN0YW5jZW9mIE9wdGltaXN0aWNDYWNoZUxheWVyKSB7XG4gICAgICAgICAgICBpZiAobGF5ZXIub3B0aW1pc3RpY0lkID09PSBpZFRvUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgKytyZW1vdmVkQ291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b1JlYXBwbHkucHVzaChsYXllcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXllciA9IGxheWVyLnBhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVtb3ZlZENvdW50ID4gMCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpbWlzdGljRGF0YSA9IGxheWVyO1xuICAgICAgICAgICAgd2hpbGUgKHRvUmVhcHBseS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxheWVyXzEgPSB0b1JlYXBwbHkucG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wZXJmb3JtVHJhbnNhY3Rpb24obGF5ZXJfMS50cmFuc2FjdGlvbiwgbGF5ZXJfMS5vcHRpbWlzdGljSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5icm9hZGNhc3RXYXRjaGVzKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEluTWVtb3J5Q2FjaGUucHJvdG90eXBlLnBlcmZvcm1UcmFuc2FjdGlvbiA9IGZ1bmN0aW9uICh0cmFuc2FjdGlvbiwgb3B0aW1pc3RpY0lkKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMsIGRhdGEgPSBfYS5kYXRhLCBzaWxlbmNlQnJvYWRjYXN0ID0gX2Euc2lsZW5jZUJyb2FkY2FzdDtcbiAgICAgICAgdGhpcy5zaWxlbmNlQnJvYWRjYXN0ID0gdHJ1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpbWlzdGljSWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLm9wdGltaXN0aWNEYXRhID0gbmV3IE9wdGltaXN0aWNDYWNoZUxheWVyKG9wdGltaXN0aWNJZCwgdGhpcy5vcHRpbWlzdGljRGF0YSwgdHJhbnNhY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbih0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMuc2lsZW5jZUJyb2FkY2FzdCA9IHNpbGVuY2VCcm9hZGNhc3Q7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0V2F0Y2hlcygpO1xuICAgIH07XG4gICAgSW5NZW1vcnlDYWNoZS5wcm90b3R5cGUucmVjb3JkT3B0aW1pc3RpY1RyYW5zYWN0aW9uID0gZnVuY3Rpb24gKHRyYW5zYWN0aW9uLCBpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wZXJmb3JtVHJhbnNhY3Rpb24odHJhbnNhY3Rpb24sIGlkKTtcbiAgICB9O1xuICAgIEluTWVtb3J5Q2FjaGUucHJvdG90eXBlLnRyYW5zZm9ybURvY3VtZW50ID0gZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmFkZFR5cGVuYW1lKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy50eXBlbmFtZURvY3VtZW50Q2FjaGUuZ2V0KGRvY3VtZW50KTtcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYWRkVHlwZW5hbWVUb0RvY3VtZW50KGRvY3VtZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGVuYW1lRG9jdW1lbnRDYWNoZS5zZXQoZG9jdW1lbnQsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgdGhpcy50eXBlbmFtZURvY3VtZW50Q2FjaGUuc2V0KHJlc3VsdCwgcmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvY3VtZW50O1xuICAgIH07XG4gICAgSW5NZW1vcnlDYWNoZS5wcm90b3R5cGUuYnJvYWRjYXN0V2F0Y2hlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLnNpbGVuY2VCcm9hZGNhc3QpIHtcbiAgICAgICAgICAgIHRoaXMud2F0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7IHJldHVybiBfdGhpcy5tYXliZUJyb2FkY2FzdFdhdGNoKGMpOyB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSW5NZW1vcnlDYWNoZS5wcm90b3R5cGUubWF5YmVCcm9hZGNhc3RXYXRjaCA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGMuY2FsbGJhY2sodGhpcy5kaWZmKHtcbiAgICAgICAgICAgIHF1ZXJ5OiBjLnF1ZXJ5LFxuICAgICAgICAgICAgdmFyaWFibGVzOiBjLnZhcmlhYmxlcyxcbiAgICAgICAgICAgIHByZXZpb3VzUmVzdWx0OiBjLnByZXZpb3VzUmVzdWx0ICYmIGMucHJldmlvdXNSZXN1bHQoKSxcbiAgICAgICAgICAgIG9wdGltaXN0aWM6IGMub3B0aW1pc3RpYyxcbiAgICAgICAgfSkpO1xuICAgIH07XG4gICAgcmV0dXJuIEluTWVtb3J5Q2FjaGU7XG59KEFwb2xsb0NhY2hlKSk7XG5cbmV4cG9ydCB7IEhldXJpc3RpY0ZyYWdtZW50TWF0Y2hlciwgSW5NZW1vcnlDYWNoZSwgSW50cm9zcGVjdGlvbkZyYWdtZW50TWF0Y2hlciwgT2JqZWN0Q2FjaGUsIFN0b3JlUmVhZGVyLCBTdG9yZVdyaXRlciwgV3JpdGVFcnJvciwgYXNzZXJ0SWRWYWx1ZSwgZGVmYXVsdERhdGFJZEZyb21PYmplY3QsIGRlZmF1bHROb3JtYWxpemVkQ2FjaGVGYWN0b3J5JDEgYXMgZGVmYXVsdE5vcm1hbGl6ZWRDYWNoZUZhY3RvcnksIGVuaGFuY2VFcnJvcldpdGhEb2N1bWVudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVuZGxlLmVzbS5qcy5tYXBcbiIsImltcG9ydCB7IGdldEZyYWdtZW50UXVlcnlEb2N1bWVudCB9IGZyb20gJ2Fwb2xsby11dGlsaXRpZXMnO1xuXG5mdW5jdGlvbiBxdWVyeUZyb21Qb2pvKG9iaikge1xuICAgIHZhciBvcCA9IHtcbiAgICAgICAga2luZDogJ09wZXJhdGlvbkRlZmluaXRpb24nLFxuICAgICAgICBvcGVyYXRpb246ICdxdWVyeScsXG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgIGtpbmQ6ICdOYW1lJyxcbiAgICAgICAgICAgIHZhbHVlOiAnR2VuZXJhdGVkQ2xpZW50UXVlcnknLFxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3Rpb25TZXQ6IHNlbGVjdGlvblNldEZyb21PYmoob2JqKSxcbiAgICB9O1xuICAgIHZhciBvdXQgPSB7XG4gICAgICAgIGtpbmQ6ICdEb2N1bWVudCcsXG4gICAgICAgIGRlZmluaXRpb25zOiBbb3BdLFxuICAgIH07XG4gICAgcmV0dXJuIG91dDtcbn1cbmZ1bmN0aW9uIGZyYWdtZW50RnJvbVBvam8ob2JqLCB0eXBlbmFtZSkge1xuICAgIHZhciBmcmFnID0ge1xuICAgICAgICBraW5kOiAnRnJhZ21lbnREZWZpbml0aW9uJyxcbiAgICAgICAgdHlwZUNvbmRpdGlvbjoge1xuICAgICAgICAgICAga2luZDogJ05hbWVkVHlwZScsXG4gICAgICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICAgICAga2luZDogJ05hbWUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB0eXBlbmFtZSB8fCAnX19GYWtlVHlwZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICBraW5kOiAnTmFtZScsXG4gICAgICAgICAgICB2YWx1ZTogJ0dlbmVyYXRlZENsaWVudFF1ZXJ5JyxcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0aW9uU2V0OiBzZWxlY3Rpb25TZXRGcm9tT2JqKG9iaiksXG4gICAgfTtcbiAgICB2YXIgb3V0ID0ge1xuICAgICAgICBraW5kOiAnRG9jdW1lbnQnLFxuICAgICAgICBkZWZpbml0aW9uczogW2ZyYWddLFxuICAgIH07XG4gICAgcmV0dXJuIG91dDtcbn1cbmZ1bmN0aW9uIHNlbGVjdGlvblNldEZyb21PYmoob2JqKSB7XG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdudW1iZXInIHx8XG4gICAgICAgIHR5cGVvZiBvYmogPT09ICdib29sZWFuJyB8fFxuICAgICAgICB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyB8fFxuICAgICAgICB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICBvYmogPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvblNldEZyb21PYmoob2JqWzBdKTtcbiAgICB9XG4gICAgdmFyIHNlbGVjdGlvbnMgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgbmVzdGVkU2VsU2V0ID0gc2VsZWN0aW9uU2V0RnJvbU9iaihvYmpba2V5XSk7XG4gICAgICAgIHZhciBmaWVsZCA9IHtcbiAgICAgICAgICAgIGtpbmQ6ICdGaWVsZCcsXG4gICAgICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICAgICAga2luZDogJ05hbWUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBrZXksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0aW9uU2V0OiBuZXN0ZWRTZWxTZXQgfHwgdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgICAgICBzZWxlY3Rpb25zLnB1c2goZmllbGQpO1xuICAgIH0pO1xuICAgIHZhciBzZWxlY3Rpb25TZXQgPSB7XG4gICAgICAgIGtpbmQ6ICdTZWxlY3Rpb25TZXQnLFxuICAgICAgICBzZWxlY3Rpb25zOiBzZWxlY3Rpb25zLFxuICAgIH07XG4gICAgcmV0dXJuIHNlbGVjdGlvblNldDtcbn1cbnZhciBqdXN0VHlwZW5hbWVRdWVyeSA9IHtcbiAgICBraW5kOiAnRG9jdW1lbnQnLFxuICAgIGRlZmluaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGtpbmQ6ICdPcGVyYXRpb25EZWZpbml0aW9uJyxcbiAgICAgICAgICAgIG9wZXJhdGlvbjogJ3F1ZXJ5JyxcbiAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICB2YXJpYWJsZURlZmluaXRpb25zOiBudWxsLFxuICAgICAgICAgICAgZGlyZWN0aXZlczogW10sXG4gICAgICAgICAgICBzZWxlY3Rpb25TZXQ6IHtcbiAgICAgICAgICAgICAgICBraW5kOiAnU2VsZWN0aW9uU2V0JyxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6ICdGaWVsZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGlhczogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnTmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICdfX3R5cGVuYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25TZXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgXSxcbn07XG5cbnZhciBBcG9sbG9DYWNoZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQXBvbGxvQ2FjaGUoKSB7XG4gICAgfVxuICAgIEFwb2xsb0NhY2hlLnByb3RvdHlwZS50cmFuc2Zvcm1Eb2N1bWVudCA9IGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQ7XG4gICAgfTtcbiAgICBBcG9sbG9DYWNoZS5wcm90b3R5cGUudHJhbnNmb3JtRm9yTGluayA9IGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQ7XG4gICAgfTtcbiAgICBBcG9sbG9DYWNoZS5wcm90b3R5cGUucmVhZFF1ZXJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMsIG9wdGltaXN0aWMpIHtcbiAgICAgICAgaWYgKG9wdGltaXN0aWMgPT09IHZvaWQgMCkgeyBvcHRpbWlzdGljID0gZmFsc2U7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZCh7XG4gICAgICAgICAgICBxdWVyeTogb3B0aW9ucy5xdWVyeSxcbiAgICAgICAgICAgIHZhcmlhYmxlczogb3B0aW9ucy52YXJpYWJsZXMsXG4gICAgICAgICAgICBvcHRpbWlzdGljOiBvcHRpbWlzdGljLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEFwb2xsb0NhY2hlLnByb3RvdHlwZS5yZWFkRnJhZ21lbnQgPSBmdW5jdGlvbiAob3B0aW9ucywgb3B0aW1pc3RpYykge1xuICAgICAgICBpZiAob3B0aW1pc3RpYyA9PT0gdm9pZCAwKSB7IG9wdGltaXN0aWMgPSBmYWxzZTsgfVxuICAgICAgICByZXR1cm4gdGhpcy5yZWFkKHtcbiAgICAgICAgICAgIHF1ZXJ5OiBnZXRGcmFnbWVudFF1ZXJ5RG9jdW1lbnQob3B0aW9ucy5mcmFnbWVudCwgb3B0aW9ucy5mcmFnbWVudE5hbWUpLFxuICAgICAgICAgICAgdmFyaWFibGVzOiBvcHRpb25zLnZhcmlhYmxlcyxcbiAgICAgICAgICAgIHJvb3RJZDogb3B0aW9ucy5pZCxcbiAgICAgICAgICAgIG9wdGltaXN0aWM6IG9wdGltaXN0aWMsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQXBvbGxvQ2FjaGUucHJvdG90eXBlLndyaXRlUXVlcnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLndyaXRlKHtcbiAgICAgICAgICAgIGRhdGFJZDogJ1JPT1RfUVVFUlknLFxuICAgICAgICAgICAgcmVzdWx0OiBvcHRpb25zLmRhdGEsXG4gICAgICAgICAgICBxdWVyeTogb3B0aW9ucy5xdWVyeSxcbiAgICAgICAgICAgIHZhcmlhYmxlczogb3B0aW9ucy52YXJpYWJsZXMsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQXBvbGxvQ2FjaGUucHJvdG90eXBlLndyaXRlRnJhZ21lbnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLndyaXRlKHtcbiAgICAgICAgICAgIGRhdGFJZDogb3B0aW9ucy5pZCxcbiAgICAgICAgICAgIHJlc3VsdDogb3B0aW9ucy5kYXRhLFxuICAgICAgICAgICAgdmFyaWFibGVzOiBvcHRpb25zLnZhcmlhYmxlcyxcbiAgICAgICAgICAgIHF1ZXJ5OiBnZXRGcmFnbWVudFF1ZXJ5RG9jdW1lbnQob3B0aW9ucy5mcmFnbWVudCwgb3B0aW9ucy5mcmFnbWVudE5hbWUpLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEFwb2xsb0NhY2hlLnByb3RvdHlwZS53cml0ZURhdGEgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGlkID0gX2EuaWQsIGRhdGEgPSBfYS5kYXRhO1xuICAgICAgICBpZiAodHlwZW9mIGlkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFyIHR5cGVuYW1lUmVzdWx0ID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdHlwZW5hbWVSZXN1bHQgPSB0aGlzLnJlYWQoe1xuICAgICAgICAgICAgICAgICAgICByb290SWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICBvcHRpbWlzdGljOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgcXVlcnk6IGp1c3RUeXBlbmFtZVF1ZXJ5LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBfX3R5cGVuYW1lID0gKHR5cGVuYW1lUmVzdWx0ICYmIHR5cGVuYW1lUmVzdWx0Ll9fdHlwZW5hbWUpIHx8ICdfX0NsaWVudERhdGEnO1xuICAgICAgICAgICAgdmFyIGRhdGFUb1dyaXRlID0gT2JqZWN0LmFzc2lnbih7IF9fdHlwZW5hbWU6IF9fdHlwZW5hbWUgfSwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLndyaXRlRnJhZ21lbnQoe1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICBmcmFnbWVudDogZnJhZ21lbnRGcm9tUG9qbyhkYXRhVG9Xcml0ZSwgX190eXBlbmFtZSksXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVRvV3JpdGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud3JpdGVRdWVyeSh7IHF1ZXJ5OiBxdWVyeUZyb21Qb2pvKGRhdGEpLCBkYXRhOiBkYXRhIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gQXBvbGxvQ2FjaGU7XG59KCkpO1xuXG52YXIgQ2FjaGU7XG4oZnVuY3Rpb24gKENhY2hlKSB7XG59KShDYWNoZSB8fCAoQ2FjaGUgPSB7fSkpO1xuXG5leHBvcnQgeyBBcG9sbG9DYWNoZSwgQ2FjaGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bmRsZS5lc20uanMubWFwXG4iLCJpbXBvcnQgeyBfX2V4dGVuZHMsIF9fYXNzaWduLCBfX2F3YWl0ZXIsIF9fZ2VuZXJhdG9yIH0gZnJvbSAndHNsaWInO1xuaW1wb3J0IHsgZ2V0T3BlcmF0aW9uRGVmaW5pdGlvbiwgaXNFcXVhbCwgdHJ5RnVuY3Rpb25PckxvZ0Vycm9yLCBjbG9uZURlZXAsIG1lcmdlRGVlcCwgaGFzRGlyZWN0aXZlcywgcmVtb3ZlQ2xpZW50U2V0c0Zyb21Eb2N1bWVudCwgYnVpbGRRdWVyeUZyb21TZWxlY3Rpb25TZXQsIGdldE1haW5EZWZpbml0aW9uLCBnZXRGcmFnbWVudERlZmluaXRpb25zLCBjcmVhdGVGcmFnbWVudE1hcCwgbWVyZ2VEZWVwQXJyYXksIHJlc3VsdEtleU5hbWVGcm9tRmllbGQsIGFyZ3VtZW50c09iamVjdEZyb21GaWVsZCwgc2hvdWxkSW5jbHVkZSwgaXNGaWVsZCwgaXNJbmxpbmVGcmFnbWVudCwgY2FuVXNlV2Vha01hcCwgZ3JhcGhRTFJlc3VsdEhhc0Vycm9yLCByZW1vdmVDb25uZWN0aW9uRGlyZWN0aXZlRnJvbURvY3VtZW50LCBoYXNDbGllbnRFeHBvcnRzLCBnZXREZWZhdWx0VmFsdWVzLCBnZXRPcGVyYXRpb25OYW1lIH0gZnJvbSAnYXBvbGxvLXV0aWxpdGllcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIGFzIE9ic2VydmFibGUkMSwgZXhlY3V0ZSwgQXBvbGxvTGluayB9IGZyb20gJ2Fwb2xsby1saW5rJztcbmltcG9ydCAkJG9ic2VydmFibGUgZnJvbSAnc3ltYm9sLW9ic2VydmFibGUnO1xuaW1wb3J0IHsgSW52YXJpYW50RXJyb3IsIGludmFyaWFudCB9IGZyb20gJ3RzLWludmFyaWFudCc7XG5pbXBvcnQgeyB2aXNpdCwgQlJFQUsgfSBmcm9tICdncmFwaHFsL2xhbmd1YWdlL3Zpc2l0b3InO1xuXG52YXIgTmV0d29ya1N0YXR1cztcbihmdW5jdGlvbiAoTmV0d29ya1N0YXR1cykge1xuICAgIE5ldHdvcmtTdGF0dXNbTmV0d29ya1N0YXR1c1tcImxvYWRpbmdcIl0gPSAxXSA9IFwibG9hZGluZ1wiO1xuICAgIE5ldHdvcmtTdGF0dXNbTmV0d29ya1N0YXR1c1tcInNldFZhcmlhYmxlc1wiXSA9IDJdID0gXCJzZXRWYXJpYWJsZXNcIjtcbiAgICBOZXR3b3JrU3RhdHVzW05ldHdvcmtTdGF0dXNbXCJmZXRjaE1vcmVcIl0gPSAzXSA9IFwiZmV0Y2hNb3JlXCI7XG4gICAgTmV0d29ya1N0YXR1c1tOZXR3b3JrU3RhdHVzW1wicmVmZXRjaFwiXSA9IDRdID0gXCJyZWZldGNoXCI7XG4gICAgTmV0d29ya1N0YXR1c1tOZXR3b3JrU3RhdHVzW1wicG9sbFwiXSA9IDZdID0gXCJwb2xsXCI7XG4gICAgTmV0d29ya1N0YXR1c1tOZXR3b3JrU3RhdHVzW1wicmVhZHlcIl0gPSA3XSA9IFwicmVhZHlcIjtcbiAgICBOZXR3b3JrU3RhdHVzW05ldHdvcmtTdGF0dXNbXCJlcnJvclwiXSA9IDhdID0gXCJlcnJvclwiO1xufSkoTmV0d29ya1N0YXR1cyB8fCAoTmV0d29ya1N0YXR1cyA9IHt9KSk7XG5mdW5jdGlvbiBpc05ldHdvcmtSZXF1ZXN0SW5GbGlnaHQobmV0d29ya1N0YXR1cykge1xuICAgIHJldHVybiBuZXR3b3JrU3RhdHVzIDwgNztcbn1cblxudmFyIE9ic2VydmFibGUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhPYnNlcnZhYmxlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE9ic2VydmFibGUoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgT2JzZXJ2YWJsZS5wcm90b3R5cGVbJCRvYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlLnByb3RvdHlwZVsnQEBvYnNlcnZhYmxlJ10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgcmV0dXJuIE9ic2VydmFibGU7XG59KE9ic2VydmFibGUkMSkpO1xuXG5mdW5jdGlvbiBpc05vbkVtcHR5QXJyYXkodmFsdWUpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID4gMDtcbn1cblxuZnVuY3Rpb24gaXNBcG9sbG9FcnJvcihlcnIpIHtcbiAgICByZXR1cm4gZXJyLmhhc093blByb3BlcnR5KCdncmFwaFFMRXJyb3JzJyk7XG59XG52YXIgZ2VuZXJhdGVFcnJvck1lc3NhZ2UgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSAnJztcbiAgICBpZiAoaXNOb25FbXB0eUFycmF5KGVyci5ncmFwaFFMRXJyb3JzKSkge1xuICAgICAgICBlcnIuZ3JhcGhRTEVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uIChncmFwaFFMRXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBncmFwaFFMRXJyb3JcbiAgICAgICAgICAgICAgICA/IGdyYXBoUUxFcnJvci5tZXNzYWdlXG4gICAgICAgICAgICAgICAgOiAnRXJyb3IgbWVzc2FnZSBub3QgZm91bmQuJztcbiAgICAgICAgICAgIG1lc3NhZ2UgKz0gXCJHcmFwaFFMIGVycm9yOiBcIiArIGVycm9yTWVzc2FnZSArIFwiXFxuXCI7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZXJyLm5ldHdvcmtFcnJvcikge1xuICAgICAgICBtZXNzYWdlICs9ICdOZXR3b3JrIGVycm9yOiAnICsgZXJyLm5ldHdvcmtFcnJvci5tZXNzYWdlICsgJ1xcbic7XG4gICAgfVxuICAgIG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoL1xcbiQvLCAnJyk7XG4gICAgcmV0dXJuIG1lc3NhZ2U7XG59O1xudmFyIEFwb2xsb0Vycm9yID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQXBvbGxvRXJyb3IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXBvbGxvRXJyb3IoX2EpIHtcbiAgICAgICAgdmFyIGdyYXBoUUxFcnJvcnMgPSBfYS5ncmFwaFFMRXJyb3JzLCBuZXR3b3JrRXJyb3IgPSBfYS5uZXR3b3JrRXJyb3IsIGVycm9yTWVzc2FnZSA9IF9hLmVycm9yTWVzc2FnZSwgZXh0cmFJbmZvID0gX2EuZXh0cmFJbmZvO1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBlcnJvck1lc3NhZ2UpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmdyYXBoUUxFcnJvcnMgPSBncmFwaFFMRXJyb3JzIHx8IFtdO1xuICAgICAgICBfdGhpcy5uZXR3b3JrRXJyb3IgPSBuZXR3b3JrRXJyb3IgfHwgbnVsbDtcbiAgICAgICAgaWYgKCFlcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgICAgIF90aGlzLm1lc3NhZ2UgPSBnZW5lcmF0ZUVycm9yTWVzc2FnZShfdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBfdGhpcy5tZXNzYWdlID0gZXJyb3JNZXNzYWdlO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzLmV4dHJhSW5mbyA9IGV4dHJhSW5mbztcbiAgICAgICAgX3RoaXMuX19wcm90b19fID0gQXBvbGxvRXJyb3IucHJvdG90eXBlO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBBcG9sbG9FcnJvcjtcbn0oRXJyb3IpKTtcblxudmFyIEZldGNoVHlwZTtcbihmdW5jdGlvbiAoRmV0Y2hUeXBlKSB7XG4gICAgRmV0Y2hUeXBlW0ZldGNoVHlwZVtcIm5vcm1hbFwiXSA9IDFdID0gXCJub3JtYWxcIjtcbiAgICBGZXRjaFR5cGVbRmV0Y2hUeXBlW1wicmVmZXRjaFwiXSA9IDJdID0gXCJyZWZldGNoXCI7XG4gICAgRmV0Y2hUeXBlW0ZldGNoVHlwZVtcInBvbGxcIl0gPSAzXSA9IFwicG9sbFwiO1xufSkoRmV0Y2hUeXBlIHx8IChGZXRjaFR5cGUgPSB7fSkpO1xuXG52YXIgaGFzRXJyb3IgPSBmdW5jdGlvbiAoc3RvcmVWYWx1ZSwgcG9saWN5KSB7XG4gICAgaWYgKHBvbGljeSA9PT0gdm9pZCAwKSB7IHBvbGljeSA9ICdub25lJzsgfVxuICAgIHJldHVybiBzdG9yZVZhbHVlICYmIChzdG9yZVZhbHVlLm5ldHdvcmtFcnJvciB8fFxuICAgICAgICAocG9saWN5ID09PSAnbm9uZScgJiYgaXNOb25FbXB0eUFycmF5KHN0b3JlVmFsdWUuZ3JhcGhRTEVycm9ycykpKTtcbn07XG52YXIgT2JzZXJ2YWJsZVF1ZXJ5ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoT2JzZXJ2YWJsZVF1ZXJ5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE9ic2VydmFibGVRdWVyeShfYSkge1xuICAgICAgICB2YXIgcXVlcnlNYW5hZ2VyID0gX2EucXVlcnlNYW5hZ2VyLCBvcHRpb25zID0gX2Eub3B0aW9ucywgX2IgPSBfYS5zaG91bGRTdWJzY3JpYmUsIHNob3VsZFN1YnNjcmliZSA9IF9iID09PSB2b2lkIDAgPyB0cnVlIDogX2I7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLm9uU3Vic2NyaWJlKG9ic2VydmVyKTtcbiAgICAgICAgfSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMub2JzZXJ2ZXJzID0gbmV3IFNldCgpO1xuICAgICAgICBfdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IFNldCgpO1xuICAgICAgICBfdGhpcy5pc1Rvcm5Eb3duID0gZmFsc2U7XG4gICAgICAgIF90aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICBfdGhpcy52YXJpYWJsZXMgPSBvcHRpb25zLnZhcmlhYmxlcyB8fCB7fTtcbiAgICAgICAgX3RoaXMucXVlcnlJZCA9IHF1ZXJ5TWFuYWdlci5nZW5lcmF0ZVF1ZXJ5SWQoKTtcbiAgICAgICAgX3RoaXMuc2hvdWxkU3Vic2NyaWJlID0gc2hvdWxkU3Vic2NyaWJlO1xuICAgICAgICB2YXIgb3BEZWYgPSBnZXRPcGVyYXRpb25EZWZpbml0aW9uKG9wdGlvbnMucXVlcnkpO1xuICAgICAgICBfdGhpcy5xdWVyeU5hbWUgPSBvcERlZiAmJiBvcERlZi5uYW1lICYmIG9wRGVmLm5hbWUudmFsdWU7XG4gICAgICAgIF90aGlzLnF1ZXJ5TWFuYWdlciA9IHF1ZXJ5TWFuYWdlcjtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlUXVlcnkucHJvdG90eXBlLnJlc3VsdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHZhciBvYnNlcnZlciA9IHtcbiAgICAgICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMub2JzZXJ2ZXJzLmRlbGV0ZShvYnNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghX3RoaXMub2JzZXJ2ZXJzLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnF1ZXJ5TWFuYWdlci5yZW1vdmVRdWVyeShfdGhpcy5xdWVyeUlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiByZWplY3QsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IF90aGlzLnN1YnNjcmliZShvYnNlcnZlcik7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZVF1ZXJ5LnByb3RvdHlwZS5jdXJyZW50UmVzdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5nZXRDdXJyZW50UmVzdWx0KCk7XG4gICAgICAgIGlmIChyZXN1bHQuZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXN1bHQuZGF0YSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlUXVlcnkucHJvdG90eXBlLmdldEN1cnJlbnRSZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVG9ybkRvd24pIHtcbiAgICAgICAgICAgIHZhciBsYXN0UmVzdWx0ID0gdGhpcy5sYXN0UmVzdWx0O1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkYXRhOiAhdGhpcy5sYXN0RXJyb3IgJiYgbGFzdFJlc3VsdCAmJiBsYXN0UmVzdWx0LmRhdGEgfHwgdm9pZCAwLFxuICAgICAgICAgICAgICAgIGVycm9yOiB0aGlzLmxhc3RFcnJvcixcbiAgICAgICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBuZXR3b3JrU3RhdHVzOiBOZXR3b3JrU3RhdHVzLmVycm9yLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgX2EgPSB0aGlzLnF1ZXJ5TWFuYWdlci5nZXRDdXJyZW50UXVlcnlSZXN1bHQodGhpcyksIGRhdGEgPSBfYS5kYXRhLCBwYXJ0aWFsID0gX2EucGFydGlhbDtcbiAgICAgICAgdmFyIHF1ZXJ5U3RvcmVWYWx1ZSA9IHRoaXMucXVlcnlNYW5hZ2VyLnF1ZXJ5U3RvcmUuZ2V0KHRoaXMucXVlcnlJZCk7XG4gICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgIHZhciBmZXRjaFBvbGljeSA9IHRoaXMub3B0aW9ucy5mZXRjaFBvbGljeTtcbiAgICAgICAgdmFyIGlzTmV0d29ya0ZldGNoUG9saWN5ID0gZmV0Y2hQb2xpY3kgPT09ICduZXR3b3JrLW9ubHknIHx8XG4gICAgICAgICAgICBmZXRjaFBvbGljeSA9PT0gJ25vLWNhY2hlJztcbiAgICAgICAgaWYgKHF1ZXJ5U3RvcmVWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIG5ldHdvcmtTdGF0dXMgPSBxdWVyeVN0b3JlVmFsdWUubmV0d29ya1N0YXR1cztcbiAgICAgICAgICAgIGlmIChoYXNFcnJvcihxdWVyeVN0b3JlVmFsdWUsIHRoaXMub3B0aW9ucy5lcnJvclBvbGljeSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB2b2lkIDAsXG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBuZXR3b3JrU3RhdHVzOiBuZXR3b3JrU3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogbmV3IEFwb2xsb0Vycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoUUxFcnJvcnM6IHF1ZXJ5U3RvcmVWYWx1ZS5ncmFwaFFMRXJyb3JzLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV0d29ya0Vycm9yOiBxdWVyeVN0b3JlVmFsdWUubmV0d29ya0Vycm9yLFxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHF1ZXJ5U3RvcmVWYWx1ZS52YXJpYWJsZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMudmFyaWFibGVzID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHRoaXMub3B0aW9ucy52YXJpYWJsZXMpLCBxdWVyeVN0b3JlVmFsdWUudmFyaWFibGVzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IHRoaXMub3B0aW9ucy52YXJpYWJsZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBsb2FkaW5nOiBpc05ldHdvcmtSZXF1ZXN0SW5GbGlnaHQobmV0d29ya1N0YXR1cyksXG4gICAgICAgICAgICAgICAgbmV0d29ya1N0YXR1czogbmV0d29ya1N0YXR1cyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAocXVlcnlTdG9yZVZhbHVlLmdyYXBoUUxFcnJvcnMgJiYgdGhpcy5vcHRpb25zLmVycm9yUG9saWN5ID09PSAnYWxsJykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvcnMgPSBxdWVyeVN0b3JlVmFsdWUuZ3JhcGhRTEVycm9ycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsb2FkaW5nID0gaXNOZXR3b3JrRmV0Y2hQb2xpY3kgfHxcbiAgICAgICAgICAgICAgICAocGFydGlhbCAmJiBmZXRjaFBvbGljeSAhPT0gJ2NhY2hlLW9ubHknKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIGxvYWRpbmc6IGxvYWRpbmcsXG4gICAgICAgICAgICAgICAgbmV0d29ya1N0YXR1czogbG9hZGluZyA/IE5ldHdvcmtTdGF0dXMubG9hZGluZyA6IE5ldHdvcmtTdGF0dXMucmVhZHksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICghcGFydGlhbCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMYXN0UmVzdWx0KF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXN1bHQpLCB7IHN0YWxlOiBmYWxzZSB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXN1bHQpLCB7IHBhcnRpYWw6IHBhcnRpYWwgfSk7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlUXVlcnkucHJvdG90eXBlLmlzRGlmZmVyZW50RnJvbUxhc3RSZXN1bHQgPSBmdW5jdGlvbiAobmV3UmVzdWx0KSB7XG4gICAgICAgIHZhciBzbmFwc2hvdCA9IHRoaXMubGFzdFJlc3VsdFNuYXBzaG90O1xuICAgICAgICByZXR1cm4gIShzbmFwc2hvdCAmJlxuICAgICAgICAgICAgbmV3UmVzdWx0ICYmXG4gICAgICAgICAgICBzbmFwc2hvdC5uZXR3b3JrU3RhdHVzID09PSBuZXdSZXN1bHQubmV0d29ya1N0YXR1cyAmJlxuICAgICAgICAgICAgc25hcHNob3Quc3RhbGUgPT09IG5ld1Jlc3VsdC5zdGFsZSAmJlxuICAgICAgICAgICAgaXNFcXVhbChzbmFwc2hvdC5kYXRhLCBuZXdSZXN1bHQuZGF0YSkpO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZVF1ZXJ5LnByb3RvdHlwZS5nZXRMYXN0UmVzdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXN0UmVzdWx0O1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZVF1ZXJ5LnByb3RvdHlwZS5nZXRMYXN0RXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhc3RFcnJvcjtcbiAgICB9O1xuICAgIE9ic2VydmFibGVRdWVyeS5wcm90b3R5cGUucmVzZXRMYXN0UmVzdWx0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMubGFzdFJlc3VsdDtcbiAgICAgICAgZGVsZXRlIHRoaXMubGFzdFJlc3VsdFNuYXBzaG90O1xuICAgICAgICBkZWxldGUgdGhpcy5sYXN0RXJyb3I7XG4gICAgICAgIHRoaXMuaXNUb3JuRG93biA9IGZhbHNlO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZVF1ZXJ5LnByb3RvdHlwZS5yZXNldFF1ZXJ5U3RvcmVFcnJvcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBxdWVyeVN0b3JlID0gdGhpcy5xdWVyeU1hbmFnZXIucXVlcnlTdG9yZS5nZXQodGhpcy5xdWVyeUlkKTtcbiAgICAgICAgaWYgKHF1ZXJ5U3RvcmUpIHtcbiAgICAgICAgICAgIHF1ZXJ5U3RvcmUubmV0d29ya0Vycm9yID0gbnVsbDtcbiAgICAgICAgICAgIHF1ZXJ5U3RvcmUuZ3JhcGhRTEVycm9ycyA9IFtdO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlUXVlcnkucHJvdG90eXBlLnJlZmV0Y2ggPSBmdW5jdGlvbiAodmFyaWFibGVzKSB7XG4gICAgICAgIHZhciBmZXRjaFBvbGljeSA9IHRoaXMub3B0aW9ucy5mZXRjaFBvbGljeTtcbiAgICAgICAgaWYgKGZldGNoUG9saWN5ID09PSAnY2FjaGUtb25seScpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBuZXcgSW52YXJpYW50RXJyb3IoMSkgOiBuZXcgSW52YXJpYW50RXJyb3IoJ2NhY2hlLW9ubHkgZmV0Y2hQb2xpY3kgb3B0aW9uIHNob3VsZCBub3QgYmUgdXNlZCB0b2dldGhlciB3aXRoIHF1ZXJ5IHJlZmV0Y2guJykpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmZXRjaFBvbGljeSAhPT0gJ25vLWNhY2hlJyAmJlxuICAgICAgICAgICAgZmV0Y2hQb2xpY3kgIT09ICdjYWNoZS1hbmQtbmV0d29yaycpIHtcbiAgICAgICAgICAgIGZldGNoUG9saWN5ID0gJ25ldHdvcmstb25seSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc0VxdWFsKHRoaXMudmFyaWFibGVzLCB2YXJpYWJsZXMpKSB7XG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCB0aGlzLnZhcmlhYmxlcyksIHZhcmlhYmxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc0VxdWFsKHRoaXMub3B0aW9ucy52YXJpYWJsZXMsIHRoaXMudmFyaWFibGVzKSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnZhcmlhYmxlcyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMudmFyaWFibGVzKSwgdGhpcy52YXJpYWJsZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXJ5TWFuYWdlci5mZXRjaFF1ZXJ5KHRoaXMucXVlcnlJZCwgX19hc3NpZ24oX19hc3NpZ24oe30sIHRoaXMub3B0aW9ucyksIHsgZmV0Y2hQb2xpY3k6IGZldGNoUG9saWN5IH0pLCBGZXRjaFR5cGUucmVmZXRjaCk7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlUXVlcnkucHJvdG90eXBlLmZldGNoTW9yZSA9IGZ1bmN0aW9uIChmZXRjaE1vcmVPcHRpb25zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChmZXRjaE1vcmVPcHRpb25zLnVwZGF0ZVF1ZXJ5LCAyKSA6IGludmFyaWFudChmZXRjaE1vcmVPcHRpb25zLnVwZGF0ZVF1ZXJ5LCAndXBkYXRlUXVlcnkgb3B0aW9uIGlzIHJlcXVpcmVkLiBUaGlzIGZ1bmN0aW9uIGRlZmluZXMgaG93IHRvIHVwZGF0ZSB0aGUgcXVlcnkgZGF0YSB3aXRoIHRoZSBuZXcgcmVzdWx0cy4nKTtcbiAgICAgICAgdmFyIGNvbWJpbmVkT3B0aW9ucyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCAoZmV0Y2hNb3JlT3B0aW9ucy5xdWVyeSA/IGZldGNoTW9yZU9wdGlvbnMgOiBfX2Fzc2lnbihfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdGhpcy5vcHRpb25zKSwgZmV0Y2hNb3JlT3B0aW9ucyksIHsgdmFyaWFibGVzOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdGhpcy52YXJpYWJsZXMpLCBmZXRjaE1vcmVPcHRpb25zLnZhcmlhYmxlcykgfSkpKSwgeyBmZXRjaFBvbGljeTogJ25ldHdvcmstb25seScgfSk7XG4gICAgICAgIHZhciBxaWQgPSB0aGlzLnF1ZXJ5TWFuYWdlci5nZW5lcmF0ZVF1ZXJ5SWQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVlcnlNYW5hZ2VyXG4gICAgICAgICAgICAuZmV0Y2hRdWVyeShxaWQsIGNvbWJpbmVkT3B0aW9ucywgRmV0Y2hUeXBlLm5vcm1hbCwgdGhpcy5xdWVyeUlkKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGZldGNoTW9yZVJlc3VsdCkge1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlUXVlcnkoZnVuY3Rpb24gKHByZXZpb3VzUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZldGNoTW9yZU9wdGlvbnMudXBkYXRlUXVlcnkocHJldmlvdXNSZXN1bHQsIHtcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2hNb3JlUmVzdWx0OiBmZXRjaE1vcmVSZXN1bHQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiBjb21iaW5lZE9wdGlvbnMudmFyaWFibGVzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfdGhpcy5xdWVyeU1hbmFnZXIuc3RvcFF1ZXJ5KHFpZCk7XG4gICAgICAgICAgICByZXR1cm4gZmV0Y2hNb3JlUmVzdWx0O1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIF90aGlzLnF1ZXJ5TWFuYWdlci5zdG9wUXVlcnkocWlkKTtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE9ic2VydmFibGVRdWVyeS5wcm90b3R5cGUuc3Vic2NyaWJlVG9Nb3JlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IHRoaXMucXVlcnlNYW5hZ2VyXG4gICAgICAgICAgICAuc3RhcnRHcmFwaFFMU3Vic2NyaXB0aW9uKHtcbiAgICAgICAgICAgIHF1ZXJ5OiBvcHRpb25zLmRvY3VtZW50LFxuICAgICAgICAgICAgdmFyaWFibGVzOiBvcHRpb25zLnZhcmlhYmxlcyxcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoe1xuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gKHN1YnNjcmlwdGlvbkRhdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgdXBkYXRlUXVlcnkgPSBvcHRpb25zLnVwZGF0ZVF1ZXJ5O1xuICAgICAgICAgICAgICAgIGlmICh1cGRhdGVRdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVRdWVyeShmdW5jdGlvbiAocHJldmlvdXMsIF9hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFyaWFibGVzID0gX2EudmFyaWFibGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZVF1ZXJ5KHByZXZpb3VzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uRGF0YTogc3Vic2NyaXB0aW9uRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZXM6IHZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5vbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMub25FcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiB8fCBpbnZhcmlhbnQuZXJyb3IoJ1VuaGFuZGxlZCBHcmFwaFFMIHN1YnNjcmlwdGlvbiBlcnJvcicsIGVycik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChzdWJzY3JpcHRpb24pO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLnN1YnNjcmlwdGlvbnMuZGVsZXRlKHN1YnNjcmlwdGlvbikpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuICAgIE9ic2VydmFibGVRdWVyeS5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIHZhciBvbGRGZXRjaFBvbGljeSA9IHRoaXMub3B0aW9ucy5mZXRjaFBvbGljeTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHRoaXMub3B0aW9ucyksIG9wdHMpO1xuICAgICAgICBpZiAob3B0cy5wb2xsSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRQb2xsaW5nKG9wdHMucG9sbEludGVydmFsKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRzLnBvbGxJbnRlcnZhbCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wUG9sbGluZygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmZXRjaFBvbGljeSA9IG9wdHMuZmV0Y2hQb2xpY3k7XG4gICAgICAgIHJldHVybiB0aGlzLnNldFZhcmlhYmxlcyh0aGlzLm9wdGlvbnMudmFyaWFibGVzLCBvbGRGZXRjaFBvbGljeSAhPT0gZmV0Y2hQb2xpY3kgJiYgKG9sZEZldGNoUG9saWN5ID09PSAnY2FjaGUtb25seScgfHxcbiAgICAgICAgICAgIG9sZEZldGNoUG9saWN5ID09PSAnc3RhbmRieScgfHxcbiAgICAgICAgICAgIGZldGNoUG9saWN5ID09PSAnbmV0d29yay1vbmx5JyksIG9wdHMuZmV0Y2hSZXN1bHRzKTtcbiAgICB9O1xuICAgIE9ic2VydmFibGVRdWVyeS5wcm90b3R5cGUuc2V0VmFyaWFibGVzID0gZnVuY3Rpb24gKHZhcmlhYmxlcywgdHJ5RmV0Y2gsIGZldGNoUmVzdWx0cykge1xuICAgICAgICBpZiAodHJ5RmV0Y2ggPT09IHZvaWQgMCkgeyB0cnlGZXRjaCA9IGZhbHNlOyB9XG4gICAgICAgIGlmIChmZXRjaFJlc3VsdHMgPT09IHZvaWQgMCkgeyBmZXRjaFJlc3VsdHMgPSB0cnVlOyB9XG4gICAgICAgIHRoaXMuaXNUb3JuRG93biA9IGZhbHNlO1xuICAgICAgICB2YXJpYWJsZXMgPSB2YXJpYWJsZXMgfHwgdGhpcy52YXJpYWJsZXM7XG4gICAgICAgIGlmICghdHJ5RmV0Y2ggJiYgaXNFcXVhbCh2YXJpYWJsZXMsIHRoaXMudmFyaWFibGVzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXJzLnNpemUgJiYgZmV0Y2hSZXN1bHRzXG4gICAgICAgICAgICAgICAgPyB0aGlzLnJlc3VsdCgpXG4gICAgICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IHRoaXMub3B0aW9ucy52YXJpYWJsZXMgPSB2YXJpYWJsZXM7XG4gICAgICAgIGlmICghdGhpcy5vYnNlcnZlcnMuc2l6ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXJ5TWFuYWdlci5mZXRjaFF1ZXJ5KHRoaXMucXVlcnlJZCwgdGhpcy5vcHRpb25zKTtcbiAgICB9O1xuICAgIE9ic2VydmFibGVRdWVyeS5wcm90b3R5cGUudXBkYXRlUXVlcnkgPSBmdW5jdGlvbiAobWFwRm4pIHtcbiAgICAgICAgdmFyIHF1ZXJ5TWFuYWdlciA9IHRoaXMucXVlcnlNYW5hZ2VyO1xuICAgICAgICB2YXIgX2EgPSBxdWVyeU1hbmFnZXIuZ2V0UXVlcnlXaXRoUHJldmlvdXNSZXN1bHQodGhpcy5xdWVyeUlkKSwgcHJldmlvdXNSZXN1bHQgPSBfYS5wcmV2aW91c1Jlc3VsdCwgdmFyaWFibGVzID0gX2EudmFyaWFibGVzLCBkb2N1bWVudCA9IF9hLmRvY3VtZW50O1xuICAgICAgICB2YXIgbmV3UmVzdWx0ID0gdHJ5RnVuY3Rpb25PckxvZ0Vycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXBGbihwcmV2aW91c1Jlc3VsdCwgeyB2YXJpYWJsZXM6IHZhcmlhYmxlcyB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChuZXdSZXN1bHQpIHtcbiAgICAgICAgICAgIHF1ZXJ5TWFuYWdlci5kYXRhU3RvcmUubWFya1VwZGF0ZVF1ZXJ5UmVzdWx0KGRvY3VtZW50LCB2YXJpYWJsZXMsIG5ld1Jlc3VsdCk7XG4gICAgICAgICAgICBxdWVyeU1hbmFnZXIuYnJvYWRjYXN0UXVlcmllcygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlUXVlcnkucHJvdG90eXBlLnN0b3BQb2xsaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnF1ZXJ5TWFuYWdlci5zdG9wUG9sbGluZ1F1ZXJ5KHRoaXMucXVlcnlJZCk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wb2xsSW50ZXJ2YWwgPSB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICBPYnNlcnZhYmxlUXVlcnkucHJvdG90eXBlLnN0YXJ0UG9sbGluZyA9IGZ1bmN0aW9uIChwb2xsSW50ZXJ2YWwpIHtcbiAgICAgICAgYXNzZXJ0Tm90Q2FjaGVGaXJzdE9yT25seSh0aGlzKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLnBvbGxJbnRlcnZhbCA9IHBvbGxJbnRlcnZhbDtcbiAgICAgICAgdGhpcy5xdWVyeU1hbmFnZXIuc3RhcnRQb2xsaW5nUXVlcnkodGhpcy5vcHRpb25zLCB0aGlzLnF1ZXJ5SWQpO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZVF1ZXJ5LnByb3RvdHlwZS51cGRhdGVMYXN0UmVzdWx0ID0gZnVuY3Rpb24gKG5ld1Jlc3VsdCkge1xuICAgICAgICB2YXIgcHJldmlvdXNSZXN1bHQgPSB0aGlzLmxhc3RSZXN1bHQ7XG4gICAgICAgIHRoaXMubGFzdFJlc3VsdCA9IG5ld1Jlc3VsdDtcbiAgICAgICAgdGhpcy5sYXN0UmVzdWx0U25hcHNob3QgPSB0aGlzLnF1ZXJ5TWFuYWdlci5hc3N1bWVJbW11dGFibGVSZXN1bHRzXG4gICAgICAgICAgICA/IG5ld1Jlc3VsdFxuICAgICAgICAgICAgOiBjbG9uZURlZXAobmV3UmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIHByZXZpb3VzUmVzdWx0O1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZVF1ZXJ5LnByb3RvdHlwZS5vblN1YnNjcmliZSA9IGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHN1Yk9ic2VydmVyID0gb2JzZXJ2ZXIuX3N1YnNjcmlwdGlvbi5fb2JzZXJ2ZXI7XG4gICAgICAgICAgICBpZiAoc3ViT2JzZXJ2ZXIgJiYgIXN1Yk9ic2VydmVyLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgc3ViT2JzZXJ2ZXIuZXJyb3IgPSBkZWZhdWx0U3Vic2NyaXB0aW9uT2JzZXJ2ZXJFcnJvckNhbGxiYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChfYSkgeyB9XG4gICAgICAgIHZhciBmaXJzdCA9ICF0aGlzLm9ic2VydmVycy5zaXplO1xuICAgICAgICB0aGlzLm9ic2VydmVycy5hZGQob2JzZXJ2ZXIpO1xuICAgICAgICBpZiAob2JzZXJ2ZXIubmV4dCAmJiB0aGlzLmxhc3RSZXN1bHQpXG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHRoaXMubGFzdFJlc3VsdCk7XG4gICAgICAgIGlmIChvYnNlcnZlci5lcnJvciAmJiB0aGlzLmxhc3RFcnJvcilcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKHRoaXMubGFzdEVycm9yKTtcbiAgICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgICAgICB0aGlzLnNldFVwUXVlcnkoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLm9ic2VydmVycy5kZWxldGUob2JzZXJ2ZXIpICYmICFfdGhpcy5vYnNlcnZlcnMuc2l6ZSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnRlYXJEb3duUXVlcnkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuICAgIE9ic2VydmFibGVRdWVyeS5wcm90b3R5cGUuc2V0VXBRdWVyeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIF9hID0gdGhpcywgcXVlcnlNYW5hZ2VyID0gX2EucXVlcnlNYW5hZ2VyLCBxdWVyeUlkID0gX2EucXVlcnlJZDtcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkU3Vic2NyaWJlKSB7XG4gICAgICAgICAgICBxdWVyeU1hbmFnZXIuYWRkT2JzZXJ2YWJsZVF1ZXJ5KHF1ZXJ5SWQsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucG9sbEludGVydmFsKSB7XG4gICAgICAgICAgICBhc3NlcnROb3RDYWNoZUZpcnN0T3JPbmx5KHRoaXMpO1xuICAgICAgICAgICAgcXVlcnlNYW5hZ2VyLnN0YXJ0UG9sbGluZ1F1ZXJ5KHRoaXMub3B0aW9ucywgcXVlcnlJZCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9uRXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZUxhc3RSZXN1bHQoX19hc3NpZ24oX19hc3NpZ24oe30sIF90aGlzLmxhc3RSZXN1bHQpLCB7IGVycm9yczogZXJyb3IuZ3JhcGhRTEVycm9ycywgbmV0d29ya1N0YXR1czogTmV0d29ya1N0YXR1cy5lcnJvciwgbG9hZGluZzogZmFsc2UgfSkpO1xuICAgICAgICAgICAgaXRlcmF0ZU9ic2VydmVyc1NhZmVseShfdGhpcy5vYnNlcnZlcnMsICdlcnJvcicsIF90aGlzLmxhc3RFcnJvciA9IGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgcXVlcnlNYW5hZ2VyLm9ic2VydmVRdWVyeShxdWVyeUlkLCB0aGlzLm9wdGlvbnMsIHtcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMubGFzdEVycm9yIHx8IF90aGlzLmlzRGlmZmVyZW50RnJvbUxhc3RSZXN1bHQocmVzdWx0KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJldmlvdXNSZXN1bHRfMSA9IF90aGlzLnVwZGF0ZUxhc3RSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hID0gX3RoaXMub3B0aW9ucywgcXVlcnlfMSA9IF9hLnF1ZXJ5LCB2YXJpYWJsZXMgPSBfYS52YXJpYWJsZXMsIGZldGNoUG9saWN5XzEgPSBfYS5mZXRjaFBvbGljeTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXJ5TWFuYWdlci50cmFuc2Zvcm0ocXVlcnlfMSkuaGFzQ2xpZW50RXhwb3J0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlNYW5hZ2VyLmdldExvY2FsU3RhdGUoKS5hZGRFeHBvcnRlZFZhcmlhYmxlcyhxdWVyeV8xLCB2YXJpYWJsZXMpLnRoZW4oZnVuY3Rpb24gKHZhcmlhYmxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmV2aW91c1ZhcmlhYmxlcyA9IF90aGlzLnZhcmlhYmxlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy52YXJpYWJsZXMgPSBfdGhpcy5vcHRpb25zLnZhcmlhYmxlcyA9IHZhcmlhYmxlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5sb2FkaW5nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZpb3VzUmVzdWx0XzEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hQb2xpY3lfMSAhPT0gJ2NhY2hlLW9ubHknICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5TWFuYWdlci50cmFuc2Zvcm0ocXVlcnlfMSkuc2VydmVyUXVlcnkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWlzRXF1YWwocHJldmlvdXNWYXJpYWJsZXMsIHZhcmlhYmxlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVmZXRjaCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0ZU9ic2VydmVyc1NhZmVseShfdGhpcy5vYnNlcnZlcnMsICduZXh0JywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGVPYnNlcnZlcnNTYWZlbHkoX3RoaXMub2JzZXJ2ZXJzLCAnbmV4dCcsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IG9uRXJyb3IsXG4gICAgICAgIH0pLmNhdGNoKG9uRXJyb3IpO1xuICAgIH07XG4gICAgT2JzZXJ2YWJsZVF1ZXJ5LnByb3RvdHlwZS50ZWFyRG93blF1ZXJ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcXVlcnlNYW5hZ2VyID0gdGhpcy5xdWVyeU1hbmFnZXI7XG4gICAgICAgIHRoaXMuaXNUb3JuRG93biA9IHRydWU7XG4gICAgICAgIHF1ZXJ5TWFuYWdlci5zdG9wUG9sbGluZ1F1ZXJ5KHRoaXMucXVlcnlJZCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzdWIpIHsgcmV0dXJuIHN1Yi51bnN1YnNjcmliZSgpOyB9KTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmNsZWFyKCk7XG4gICAgICAgIHF1ZXJ5TWFuYWdlci5yZW1vdmVPYnNlcnZhYmxlUXVlcnkodGhpcy5xdWVyeUlkKTtcbiAgICAgICAgcXVlcnlNYW5hZ2VyLnN0b3BRdWVyeSh0aGlzLnF1ZXJ5SWQpO1xuICAgICAgICB0aGlzLm9ic2VydmVycy5jbGVhcigpO1xuICAgIH07XG4gICAgcmV0dXJuIE9ic2VydmFibGVRdWVyeTtcbn0oT2JzZXJ2YWJsZSkpO1xuZnVuY3Rpb24gZGVmYXVsdFN1YnNjcmlwdGlvbk9ic2VydmVyRXJyb3JDYWxsYmFjayhlcnJvcikge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiB8fCBpbnZhcmlhbnQuZXJyb3IoJ1VuaGFuZGxlZCBlcnJvcicsIGVycm9yLm1lc3NhZ2UsIGVycm9yLnN0YWNrKTtcbn1cbmZ1bmN0aW9uIGl0ZXJhdGVPYnNlcnZlcnNTYWZlbHkob2JzZXJ2ZXJzLCBtZXRob2QsIGFyZ3VtZW50KSB7XG4gICAgdmFyIG9ic2VydmVyc1dpdGhNZXRob2QgPSBbXTtcbiAgICBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JzKSB7IHJldHVybiBvYnNbbWV0aG9kXSAmJiBvYnNlcnZlcnNXaXRoTWV0aG9kLnB1c2gob2JzKTsgfSk7XG4gICAgb2JzZXJ2ZXJzV2l0aE1ldGhvZC5mb3JFYWNoKGZ1bmN0aW9uIChvYnMpIHsgcmV0dXJuIG9ic1ttZXRob2RdKGFyZ3VtZW50KTsgfSk7XG59XG5mdW5jdGlvbiBhc3NlcnROb3RDYWNoZUZpcnN0T3JPbmx5KG9ic1F1ZXJ5KSB7XG4gICAgdmFyIGZldGNoUG9saWN5ID0gb2JzUXVlcnkub3B0aW9ucy5mZXRjaFBvbGljeTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmV0Y2hQb2xpY3kgIT09ICdjYWNoZS1maXJzdCcgJiYgZmV0Y2hQb2xpY3kgIT09ICdjYWNoZS1vbmx5JywgMykgOiBpbnZhcmlhbnQoZmV0Y2hQb2xpY3kgIT09ICdjYWNoZS1maXJzdCcgJiYgZmV0Y2hQb2xpY3kgIT09ICdjYWNoZS1vbmx5JywgJ1F1ZXJpZXMgdGhhdCBzcGVjaWZ5IHRoZSBjYWNoZS1maXJzdCBhbmQgY2FjaGUtb25seSBmZXRjaFBvbGljaWVzIGNhbm5vdCBhbHNvIGJlIHBvbGxpbmcgcXVlcmllcy4nKTtcbn1cblxudmFyIE11dGF0aW9uU3RvcmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE11dGF0aW9uU3RvcmUoKSB7XG4gICAgICAgIHRoaXMuc3RvcmUgPSB7fTtcbiAgICB9XG4gICAgTXV0YXRpb25TdG9yZS5wcm90b3R5cGUuZ2V0U3RvcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlO1xuICAgIH07XG4gICAgTXV0YXRpb25TdG9yZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG11dGF0aW9uSWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmVbbXV0YXRpb25JZF07XG4gICAgfTtcbiAgICBNdXRhdGlvblN0b3JlLnByb3RvdHlwZS5pbml0TXV0YXRpb24gPSBmdW5jdGlvbiAobXV0YXRpb25JZCwgbXV0YXRpb24sIHZhcmlhYmxlcykge1xuICAgICAgICB0aGlzLnN0b3JlW211dGF0aW9uSWRdID0ge1xuICAgICAgICAgICAgbXV0YXRpb246IG11dGF0aW9uLFxuICAgICAgICAgICAgdmFyaWFibGVzOiB2YXJpYWJsZXMgfHwge30sXG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBNdXRhdGlvblN0b3JlLnByb3RvdHlwZS5tYXJrTXV0YXRpb25FcnJvciA9IGZ1bmN0aW9uIChtdXRhdGlvbklkLCBlcnJvcikge1xuICAgICAgICB2YXIgbXV0YXRpb24gPSB0aGlzLnN0b3JlW211dGF0aW9uSWRdO1xuICAgICAgICBpZiAobXV0YXRpb24pIHtcbiAgICAgICAgICAgIG11dGF0aW9uLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIG11dGF0aW9uLmVycm9yID0gZXJyb3I7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE11dGF0aW9uU3RvcmUucHJvdG90eXBlLm1hcmtNdXRhdGlvblJlc3VsdCA9IGZ1bmN0aW9uIChtdXRhdGlvbklkKSB7XG4gICAgICAgIHZhciBtdXRhdGlvbiA9IHRoaXMuc3RvcmVbbXV0YXRpb25JZF07XG4gICAgICAgIGlmIChtdXRhdGlvbikge1xuICAgICAgICAgICAgbXV0YXRpb24ubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgbXV0YXRpb24uZXJyb3IgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBNdXRhdGlvblN0b3JlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIH07XG4gICAgcmV0dXJuIE11dGF0aW9uU3RvcmU7XG59KCkpO1xuXG52YXIgUXVlcnlTdG9yZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUXVlcnlTdG9yZSgpIHtcbiAgICAgICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIH1cbiAgICBRdWVyeVN0b3JlLnByb3RvdHlwZS5nZXRTdG9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmU7XG4gICAgfTtcbiAgICBRdWVyeVN0b3JlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAocXVlcnlJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yZVtxdWVyeUlkXTtcbiAgICB9O1xuICAgIFF1ZXJ5U3RvcmUucHJvdG90eXBlLmluaXRRdWVyeSA9IGZ1bmN0aW9uIChxdWVyeSkge1xuICAgICAgICB2YXIgcHJldmlvdXNRdWVyeSA9IHRoaXMuc3RvcmVbcXVlcnkucXVlcnlJZF07XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudCghcHJldmlvdXNRdWVyeSB8fFxuICAgICAgICAgICAgcHJldmlvdXNRdWVyeS5kb2N1bWVudCA9PT0gcXVlcnkuZG9jdW1lbnQgfHxcbiAgICAgICAgICAgIGlzRXF1YWwocHJldmlvdXNRdWVyeS5kb2N1bWVudCwgcXVlcnkuZG9jdW1lbnQpLCAxOSkgOiBpbnZhcmlhbnQoIXByZXZpb3VzUXVlcnkgfHxcbiAgICAgICAgICAgIHByZXZpb3VzUXVlcnkuZG9jdW1lbnQgPT09IHF1ZXJ5LmRvY3VtZW50IHx8XG4gICAgICAgICAgICBpc0VxdWFsKHByZXZpb3VzUXVlcnkuZG9jdW1lbnQsIHF1ZXJ5LmRvY3VtZW50KSwgJ0ludGVybmFsIEVycm9yOiBtYXkgbm90IHVwZGF0ZSBleGlzdGluZyBxdWVyeSBzdHJpbmcgaW4gc3RvcmUnKTtcbiAgICAgICAgdmFyIGlzU2V0VmFyaWFibGVzID0gZmFsc2U7XG4gICAgICAgIHZhciBwcmV2aW91c1ZhcmlhYmxlcyA9IG51bGw7XG4gICAgICAgIGlmIChxdWVyeS5zdG9yZVByZXZpb3VzVmFyaWFibGVzICYmXG4gICAgICAgICAgICBwcmV2aW91c1F1ZXJ5ICYmXG4gICAgICAgICAgICBwcmV2aW91c1F1ZXJ5Lm5ldHdvcmtTdGF0dXMgIT09IE5ldHdvcmtTdGF0dXMubG9hZGluZykge1xuICAgICAgICAgICAgaWYgKCFpc0VxdWFsKHByZXZpb3VzUXVlcnkudmFyaWFibGVzLCBxdWVyeS52YXJpYWJsZXMpKSB7XG4gICAgICAgICAgICAgICAgaXNTZXRWYXJpYWJsZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzVmFyaWFibGVzID0gcHJldmlvdXNRdWVyeS52YXJpYWJsZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5ldHdvcmtTdGF0dXM7XG4gICAgICAgIGlmIChpc1NldFZhcmlhYmxlcykge1xuICAgICAgICAgICAgbmV0d29ya1N0YXR1cyA9IE5ldHdvcmtTdGF0dXMuc2V0VmFyaWFibGVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHF1ZXJ5LmlzUG9sbCkge1xuICAgICAgICAgICAgbmV0d29ya1N0YXR1cyA9IE5ldHdvcmtTdGF0dXMucG9sbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChxdWVyeS5pc1JlZmV0Y2gpIHtcbiAgICAgICAgICAgIG5ldHdvcmtTdGF0dXMgPSBOZXR3b3JrU3RhdHVzLnJlZmV0Y2g7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBuZXR3b3JrU3RhdHVzID0gTmV0d29ya1N0YXR1cy5sb2FkaW5nO1xuICAgICAgICB9XG4gICAgICAgIHZhciBncmFwaFFMRXJyb3JzID0gW107XG4gICAgICAgIGlmIChwcmV2aW91c1F1ZXJ5ICYmIHByZXZpb3VzUXVlcnkuZ3JhcGhRTEVycm9ycykge1xuICAgICAgICAgICAgZ3JhcGhRTEVycm9ycyA9IHByZXZpb3VzUXVlcnkuZ3JhcGhRTEVycm9ycztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0b3JlW3F1ZXJ5LnF1ZXJ5SWRdID0ge1xuICAgICAgICAgICAgZG9jdW1lbnQ6IHF1ZXJ5LmRvY3VtZW50LFxuICAgICAgICAgICAgdmFyaWFibGVzOiBxdWVyeS52YXJpYWJsZXMsXG4gICAgICAgICAgICBwcmV2aW91c1ZhcmlhYmxlczogcHJldmlvdXNWYXJpYWJsZXMsXG4gICAgICAgICAgICBuZXR3b3JrRXJyb3I6IG51bGwsXG4gICAgICAgICAgICBncmFwaFFMRXJyb3JzOiBncmFwaFFMRXJyb3JzLFxuICAgICAgICAgICAgbmV0d29ya1N0YXR1czogbmV0d29ya1N0YXR1cyxcbiAgICAgICAgICAgIG1ldGFkYXRhOiBxdWVyeS5tZXRhZGF0YSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBxdWVyeS5mZXRjaE1vcmVGb3JRdWVyeUlkID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAgICAgdGhpcy5zdG9yZVtxdWVyeS5mZXRjaE1vcmVGb3JRdWVyeUlkXSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVtxdWVyeS5mZXRjaE1vcmVGb3JRdWVyeUlkXS5uZXR3b3JrU3RhdHVzID1cbiAgICAgICAgICAgICAgICBOZXR3b3JrU3RhdHVzLmZldGNoTW9yZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUXVlcnlTdG9yZS5wcm90b3R5cGUubWFya1F1ZXJ5UmVzdWx0ID0gZnVuY3Rpb24gKHF1ZXJ5SWQsIHJlc3VsdCwgZmV0Y2hNb3JlRm9yUXVlcnlJZCkge1xuICAgICAgICBpZiAoIXRoaXMuc3RvcmUgfHwgIXRoaXMuc3RvcmVbcXVlcnlJZF0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuc3RvcmVbcXVlcnlJZF0ubmV0d29ya0Vycm9yID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdG9yZVtxdWVyeUlkXS5ncmFwaFFMRXJyb3JzID0gaXNOb25FbXB0eUFycmF5KHJlc3VsdC5lcnJvcnMpID8gcmVzdWx0LmVycm9ycyA6IFtdO1xuICAgICAgICB0aGlzLnN0b3JlW3F1ZXJ5SWRdLnByZXZpb3VzVmFyaWFibGVzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdG9yZVtxdWVyeUlkXS5uZXR3b3JrU3RhdHVzID0gTmV0d29ya1N0YXR1cy5yZWFkeTtcbiAgICAgICAgaWYgKHR5cGVvZiBmZXRjaE1vcmVGb3JRdWVyeUlkID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAgICAgdGhpcy5zdG9yZVtmZXRjaE1vcmVGb3JRdWVyeUlkXSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVtmZXRjaE1vcmVGb3JRdWVyeUlkXS5uZXR3b3JrU3RhdHVzID0gTmV0d29ya1N0YXR1cy5yZWFkeTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUXVlcnlTdG9yZS5wcm90b3R5cGUubWFya1F1ZXJ5RXJyb3IgPSBmdW5jdGlvbiAocXVlcnlJZCwgZXJyb3IsIGZldGNoTW9yZUZvclF1ZXJ5SWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0b3JlIHx8ICF0aGlzLnN0b3JlW3F1ZXJ5SWRdKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLnN0b3JlW3F1ZXJ5SWRdLm5ldHdvcmtFcnJvciA9IGVycm9yO1xuICAgICAgICB0aGlzLnN0b3JlW3F1ZXJ5SWRdLm5ldHdvcmtTdGF0dXMgPSBOZXR3b3JrU3RhdHVzLmVycm9yO1xuICAgICAgICBpZiAodHlwZW9mIGZldGNoTW9yZUZvclF1ZXJ5SWQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLm1hcmtRdWVyeVJlc3VsdENsaWVudChmZXRjaE1vcmVGb3JRdWVyeUlkLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUXVlcnlTdG9yZS5wcm90b3R5cGUubWFya1F1ZXJ5UmVzdWx0Q2xpZW50ID0gZnVuY3Rpb24gKHF1ZXJ5SWQsIGNvbXBsZXRlKSB7XG4gICAgICAgIHZhciBzdG9yZVZhbHVlID0gdGhpcy5zdG9yZSAmJiB0aGlzLnN0b3JlW3F1ZXJ5SWRdO1xuICAgICAgICBpZiAoc3RvcmVWYWx1ZSkge1xuICAgICAgICAgICAgc3RvcmVWYWx1ZS5uZXR3b3JrRXJyb3IgPSBudWxsO1xuICAgICAgICAgICAgc3RvcmVWYWx1ZS5wcmV2aW91c1ZhcmlhYmxlcyA9IG51bGw7XG4gICAgICAgICAgICBpZiAoY29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICBzdG9yZVZhbHVlLm5ldHdvcmtTdGF0dXMgPSBOZXR3b3JrU3RhdHVzLnJlYWR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBRdWVyeVN0b3JlLnByb3RvdHlwZS5zdG9wUXVlcnkgPSBmdW5jdGlvbiAocXVlcnlJZCkge1xuICAgICAgICBkZWxldGUgdGhpcy5zdG9yZVtxdWVyeUlkXTtcbiAgICB9O1xuICAgIFF1ZXJ5U3RvcmUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKG9ic2VydmFibGVRdWVyeUlkcykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnN0b3JlKS5mb3JFYWNoKGZ1bmN0aW9uIChxdWVyeUlkKSB7XG4gICAgICAgICAgICBpZiAob2JzZXJ2YWJsZVF1ZXJ5SWRzLmluZGV4T2YocXVlcnlJZCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc3RvcFF1ZXJ5KHF1ZXJ5SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc3RvcmVbcXVlcnlJZF0ubmV0d29ya1N0YXR1cyA9IE5ldHdvcmtTdGF0dXMubG9hZGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gUXVlcnlTdG9yZTtcbn0oKSk7XG5cbmZ1bmN0aW9uIGNhcGl0YWxpemVGaXJzdExldHRlcihzdHIpIHtcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xufVxuXG52YXIgTG9jYWxTdGF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTG9jYWxTdGF0ZShfYSkge1xuICAgICAgICB2YXIgY2FjaGUgPSBfYS5jYWNoZSwgY2xpZW50ID0gX2EuY2xpZW50LCByZXNvbHZlcnMgPSBfYS5yZXNvbHZlcnMsIGZyYWdtZW50TWF0Y2hlciA9IF9hLmZyYWdtZW50TWF0Y2hlcjtcbiAgICAgICAgdGhpcy5jYWNoZSA9IGNhY2hlO1xuICAgICAgICBpZiAoY2xpZW50KSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzb2x2ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLmFkZFJlc29sdmVycyhyZXNvbHZlcnMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmcmFnbWVudE1hdGNoZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RnJhZ21lbnRNYXRjaGVyKGZyYWdtZW50TWF0Y2hlcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgTG9jYWxTdGF0ZS5wcm90b3R5cGUuYWRkUmVzb2x2ZXJzID0gZnVuY3Rpb24gKHJlc29sdmVycykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnJlc29sdmVycyA9IHRoaXMucmVzb2x2ZXJzIHx8IHt9O1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXNvbHZlcnMpKSB7XG4gICAgICAgICAgICByZXNvbHZlcnMuZm9yRWFjaChmdW5jdGlvbiAocmVzb2x2ZXJHcm91cCkge1xuICAgICAgICAgICAgICAgIF90aGlzLnJlc29sdmVycyA9IG1lcmdlRGVlcChfdGhpcy5yZXNvbHZlcnMsIHJlc29sdmVyR3JvdXApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVycyA9IG1lcmdlRGVlcCh0aGlzLnJlc29sdmVycywgcmVzb2x2ZXJzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTG9jYWxTdGF0ZS5wcm90b3R5cGUuc2V0UmVzb2x2ZXJzID0gZnVuY3Rpb24gKHJlc29sdmVycykge1xuICAgICAgICB0aGlzLnJlc29sdmVycyA9IHt9O1xuICAgICAgICB0aGlzLmFkZFJlc29sdmVycyhyZXNvbHZlcnMpO1xuICAgIH07XG4gICAgTG9jYWxTdGF0ZS5wcm90b3R5cGUuZ2V0UmVzb2x2ZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlcnMgfHwge307XG4gICAgfTtcbiAgICBMb2NhbFN0YXRlLnByb3RvdHlwZS5ydW5SZXNvbHZlcnMgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGRvY3VtZW50ID0gX2EuZG9jdW1lbnQsIHJlbW90ZVJlc3VsdCA9IF9hLnJlbW90ZVJlc3VsdCwgY29udGV4dCA9IF9hLmNvbnRleHQsIHZhcmlhYmxlcyA9IF9hLnZhcmlhYmxlcywgX2IgPSBfYS5vbmx5UnVuRm9yY2VkUmVzb2x2ZXJzLCBvbmx5UnVuRm9yY2VkUmVzb2x2ZXJzID0gX2IgPT09IHZvaWQgMCA/IGZhbHNlIDogX2I7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB0aGlzLnJlc29sdmVEb2N1bWVudChkb2N1bWVudCwgcmVtb3RlUmVzdWx0LmRhdGEsIGNvbnRleHQsIHZhcmlhYmxlcywgdGhpcy5mcmFnbWVudE1hdGNoZXIsIG9ubHlSdW5Gb3JjZWRSZXNvbHZlcnMpLnRoZW4oZnVuY3Rpb24gKGxvY2FsUmVzdWx0KSB7IHJldHVybiAoX19hc3NpZ24oX19hc3NpZ24oe30sIHJlbW90ZVJlc3VsdCksIHsgZGF0YTogbG9jYWxSZXN1bHQucmVzdWx0IH0pKTsgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHJlbW90ZVJlc3VsdF07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBMb2NhbFN0YXRlLnByb3RvdHlwZS5zZXRGcmFnbWVudE1hdGNoZXIgPSBmdW5jdGlvbiAoZnJhZ21lbnRNYXRjaGVyKSB7XG4gICAgICAgIHRoaXMuZnJhZ21lbnRNYXRjaGVyID0gZnJhZ21lbnRNYXRjaGVyO1xuICAgIH07XG4gICAgTG9jYWxTdGF0ZS5wcm90b3R5cGUuZ2V0RnJhZ21lbnRNYXRjaGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mcmFnbWVudE1hdGNoZXI7XG4gICAgfTtcbiAgICBMb2NhbFN0YXRlLnByb3RvdHlwZS5jbGllbnRRdWVyeSA9IGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgICAgICBpZiAoaGFzRGlyZWN0aXZlcyhbJ2NsaWVudCddLCBkb2N1bWVudCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc29sdmVycykge1xuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiB8fCBpbnZhcmlhbnQud2FybignRm91bmQgQGNsaWVudCBkaXJlY3RpdmVzIGluIGEgcXVlcnkgYnV0IG5vIEFwb2xsb0NsaWVudCByZXNvbHZlcnMgJyArXG4gICAgICAgICAgICAgICAgJ3dlcmUgc3BlY2lmaWVkLiBUaGlzIG1lYW5zIEFwb2xsb0NsaWVudCBsb2NhbCByZXNvbHZlciBoYW5kbGluZyAnICtcbiAgICAgICAgICAgICAgICAnaGFzIGJlZW4gZGlzYWJsZWQsIGFuZCBAY2xpZW50IGRpcmVjdGl2ZXMgd2lsbCBiZSBwYXNzZWQgdGhyb3VnaCAnICtcbiAgICAgICAgICAgICAgICAndG8geW91ciBsaW5rIGNoYWluLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgTG9jYWxTdGF0ZS5wcm90b3R5cGUuc2VydmVyUXVlcnkgPSBmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZXJzID8gcmVtb3ZlQ2xpZW50U2V0c0Zyb21Eb2N1bWVudChkb2N1bWVudCkgOiBkb2N1bWVudDtcbiAgICB9O1xuICAgIExvY2FsU3RhdGUucHJvdG90eXBlLnByZXBhcmVDb250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgeyBjb250ZXh0ID0ge307IH1cbiAgICAgICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZTtcbiAgICAgICAgdmFyIG5ld0NvbnRleHQgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY29udGV4dCksIHsgY2FjaGU6IGNhY2hlLCBnZXRDYWNoZUtleTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIGlmIChjYWNoZS5jb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlLmNvbmZpZy5kYXRhSWRGcm9tT2JqZWN0KG9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZmFsc2UsIDYpIDogaW52YXJpYW50KGZhbHNlLCAnVG8gdXNlIGNvbnRleHQuZ2V0Q2FjaGVLZXksIHlvdSBuZWVkIHRvIHVzZSBhIGNhY2hlIHRoYXQgaGFzICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2EgY29uZmlndXJhYmxlIGRhdGFJZEZyb21PYmplY3QsIGxpa2UgYXBvbGxvLWNhY2hlLWlubWVtb3J5LicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gfSk7XG4gICAgICAgIHJldHVybiBuZXdDb250ZXh0O1xuICAgIH07XG4gICAgTG9jYWxTdGF0ZS5wcm90b3R5cGUuYWRkRXhwb3J0ZWRWYXJpYWJsZXMgPSBmdW5jdGlvbiAoZG9jdW1lbnQsIHZhcmlhYmxlcywgY29udGV4dCkge1xuICAgICAgICBpZiAodmFyaWFibGVzID09PSB2b2lkIDApIHsgdmFyaWFibGVzID0ge307IH1cbiAgICAgICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgeyBjb250ZXh0ID0ge307IH1cbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHRoaXMucmVzb2x2ZURvY3VtZW50KGRvY3VtZW50LCB0aGlzLmJ1aWxkUm9vdFZhbHVlRnJvbUNhY2hlKGRvY3VtZW50LCB2YXJpYWJsZXMpIHx8IHt9LCB0aGlzLnByZXBhcmVDb250ZXh0KGNvbnRleHQpLCB2YXJpYWJsZXMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHsgcmV0dXJuIChfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdmFyaWFibGVzKSwgZGF0YS5leHBvcnRlZFZhcmlhYmxlcykpOyB9KV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBbMiwgX19hc3NpZ24oe30sIHZhcmlhYmxlcyldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTG9jYWxTdGF0ZS5wcm90b3R5cGUuc2hvdWxkRm9yY2VSZXNvbHZlcnMgPSBmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICAgICAgdmFyIGZvcmNlUmVzb2x2ZXJzID0gZmFsc2U7XG4gICAgICAgIHZpc2l0KGRvY3VtZW50LCB7XG4gICAgICAgICAgICBEaXJlY3RpdmU6IHtcbiAgICAgICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubmFtZS52YWx1ZSA9PT0gJ2NsaWVudCcgJiYgbm9kZS5hcmd1bWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlUmVzb2x2ZXJzID0gbm9kZS5hcmd1bWVudHMuc29tZShmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZy5uYW1lLnZhbHVlID09PSAnYWx3YXlzJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmcudmFsdWUua2luZCA9PT0gJ0Jvb2xlYW5WYWx1ZScgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnLnZhbHVlLnZhbHVlID09PSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm9yY2VSZXNvbHZlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQlJFQUs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmb3JjZVJlc29sdmVycztcbiAgICB9O1xuICAgIExvY2FsU3RhdGUucHJvdG90eXBlLmJ1aWxkUm9vdFZhbHVlRnJvbUNhY2hlID0gZnVuY3Rpb24gKGRvY3VtZW50LCB2YXJpYWJsZXMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuZGlmZih7XG4gICAgICAgICAgICBxdWVyeTogYnVpbGRRdWVyeUZyb21TZWxlY3Rpb25TZXQoZG9jdW1lbnQpLFxuICAgICAgICAgICAgdmFyaWFibGVzOiB2YXJpYWJsZXMsXG4gICAgICAgICAgICByZXR1cm5QYXJ0aWFsRGF0YTogdHJ1ZSxcbiAgICAgICAgICAgIG9wdGltaXN0aWM6IGZhbHNlLFxuICAgICAgICB9KS5yZXN1bHQ7XG4gICAgfTtcbiAgICBMb2NhbFN0YXRlLnByb3RvdHlwZS5yZXNvbHZlRG9jdW1lbnQgPSBmdW5jdGlvbiAoZG9jdW1lbnQsIHJvb3RWYWx1ZSwgY29udGV4dCwgdmFyaWFibGVzLCBmcmFnbWVudE1hdGNoZXIsIG9ubHlSdW5Gb3JjZWRSZXNvbHZlcnMpIHtcbiAgICAgICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgeyBjb250ZXh0ID0ge307IH1cbiAgICAgICAgaWYgKHZhcmlhYmxlcyA9PT0gdm9pZCAwKSB7IHZhcmlhYmxlcyA9IHt9OyB9XG4gICAgICAgIGlmIChmcmFnbWVudE1hdGNoZXIgPT09IHZvaWQgMCkgeyBmcmFnbWVudE1hdGNoZXIgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9OyB9XG4gICAgICAgIGlmIChvbmx5UnVuRm9yY2VkUmVzb2x2ZXJzID09PSB2b2lkIDApIHsgb25seVJ1bkZvcmNlZFJlc29sdmVycyA9IGZhbHNlOyB9XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtYWluRGVmaW5pdGlvbiwgZnJhZ21lbnRzLCBmcmFnbWVudE1hcCwgZGVmaW5pdGlvbk9wZXJhdGlvbiwgZGVmYXVsdE9wZXJhdGlvblR5cGUsIF9hLCBjYWNoZSwgY2xpZW50LCBleGVjQ29udGV4dDtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICAgICAgICBtYWluRGVmaW5pdGlvbiA9IGdldE1haW5EZWZpbml0aW9uKGRvY3VtZW50KTtcbiAgICAgICAgICAgICAgICBmcmFnbWVudHMgPSBnZXRGcmFnbWVudERlZmluaXRpb25zKGRvY3VtZW50KTtcbiAgICAgICAgICAgICAgICBmcmFnbWVudE1hcCA9IGNyZWF0ZUZyYWdtZW50TWFwKGZyYWdtZW50cyk7XG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbk9wZXJhdGlvbiA9IG1haW5EZWZpbml0aW9uXG4gICAgICAgICAgICAgICAgICAgIC5vcGVyYXRpb247XG4gICAgICAgICAgICAgICAgZGVmYXVsdE9wZXJhdGlvblR5cGUgPSBkZWZpbml0aW9uT3BlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgID8gY2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGRlZmluaXRpb25PcGVyYXRpb24pXG4gICAgICAgICAgICAgICAgICAgIDogJ1F1ZXJ5JztcbiAgICAgICAgICAgICAgICBfYSA9IHRoaXMsIGNhY2hlID0gX2EuY2FjaGUsIGNsaWVudCA9IF9hLmNsaWVudDtcbiAgICAgICAgICAgICAgICBleGVjQ29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRNYXA6IGZyYWdtZW50TWFwLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY29udGV4dCksIHsgY2FjaGU6IGNhY2hlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50OiBjbGllbnQgfSksXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlczogdmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudE1hdGNoZXI6IGZyYWdtZW50TWF0Y2hlcixcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdE9wZXJhdGlvblR5cGU6IGRlZmF1bHRPcGVyYXRpb25UeXBlLFxuICAgICAgICAgICAgICAgICAgICBleHBvcnRlZFZhcmlhYmxlczoge30sXG4gICAgICAgICAgICAgICAgICAgIG9ubHlSdW5Gb3JjZWRSZXNvbHZlcnM6IG9ubHlSdW5Gb3JjZWRSZXNvbHZlcnMsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHRoaXMucmVzb2x2ZVNlbGVjdGlvblNldChtYWluRGVmaW5pdGlvbi5zZWxlY3Rpb25TZXQsIHJvb3RWYWx1ZSwgZXhlY0NvbnRleHQpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkgeyByZXR1cm4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3J0ZWRWYXJpYWJsZXM6IGV4ZWNDb250ZXh0LmV4cG9ydGVkVmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICB9KTsgfSldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTG9jYWxTdGF0ZS5wcm90b3R5cGUucmVzb2x2ZVNlbGVjdGlvblNldCA9IGZ1bmN0aW9uIChzZWxlY3Rpb25TZXQsIHJvb3RWYWx1ZSwgZXhlY0NvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGZyYWdtZW50TWFwLCBjb250ZXh0LCB2YXJpYWJsZXMsIHJlc3VsdHNUb01lcmdlLCBleGVjdXRlO1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBmcmFnbWVudE1hcCA9IGV4ZWNDb250ZXh0LmZyYWdtZW50TWFwLCBjb250ZXh0ID0gZXhlY0NvbnRleHQuY29udGV4dCwgdmFyaWFibGVzID0gZXhlY0NvbnRleHQudmFyaWFibGVzO1xuICAgICAgICAgICAgICAgIHJlc3VsdHNUb01lcmdlID0gW3Jvb3RWYWx1ZV07XG4gICAgICAgICAgICAgICAgZXhlY3V0ZSA9IGZ1bmN0aW9uIChzZWxlY3Rpb24pIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyYWdtZW50LCB0eXBlQ29uZGl0aW9uO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNob3VsZEluY2x1ZGUoc2VsZWN0aW9uLCB2YXJpYWJsZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0ZpZWxkKHNlbGVjdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHRoaXMucmVzb2x2ZUZpZWxkKHNlbGVjdGlvbiwgcm9vdFZhbHVlLCBleGVjQ29udGV4dCkudGhlbihmdW5jdGlvbiAoZmllbGRSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGRSZXN1bHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1RvTWVyZ2UucHVzaCgoX2EgPSB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2FbcmVzdWx0S2V5TmFtZUZyb21GaWVsZChzZWxlY3Rpb24pXSA9IGZpZWxkUmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNJbmxpbmVGcmFnbWVudChzZWxlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnQgPSBzZWxlY3Rpb247XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFnbWVudCA9IGZyYWdtZW50TWFwW3NlbGVjdGlvbi5uYW1lLnZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZnJhZ21lbnQsIDcpIDogaW52YXJpYW50KGZyYWdtZW50LCBcIk5vIGZyYWdtZW50IG5hbWVkIFwiICsgc2VsZWN0aW9uLm5hbWUudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZyYWdtZW50ICYmIGZyYWdtZW50LnR5cGVDb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlQ29uZGl0aW9uID0gZnJhZ21lbnQudHlwZUNvbmRpdGlvbi5uYW1lLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGVjQ29udGV4dC5mcmFnbWVudE1hdGNoZXIocm9vdFZhbHVlLCB0eXBlQ29uZGl0aW9uLCBjb250ZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIsIHRoaXMucmVzb2x2ZVNlbGVjdGlvblNldChmcmFnbWVudC5zZWxlY3Rpb25TZXQsIHJvb3RWYWx1ZSwgZXhlY0NvbnRleHQpLnRoZW4oZnVuY3Rpb24gKGZyYWdtZW50UmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1RvTWVyZ2UucHVzaChmcmFnbWVudFJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7IH07XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCBQcm9taXNlLmFsbChzZWxlY3Rpb25TZXQuc2VsZWN0aW9ucy5tYXAoZXhlY3V0ZSkpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1lcmdlRGVlcEFycmF5KHJlc3VsdHNUb01lcmdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTG9jYWxTdGF0ZS5wcm90b3R5cGUucmVzb2x2ZUZpZWxkID0gZnVuY3Rpb24gKGZpZWxkLCByb290VmFsdWUsIGV4ZWNDb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB2YXJpYWJsZXMsIGZpZWxkTmFtZSwgYWxpYXNlZEZpZWxkTmFtZSwgYWxpYXNVc2VkLCBkZWZhdWx0UmVzdWx0LCByZXN1bHRQcm9taXNlLCByZXNvbHZlclR5cGUsIHJlc29sdmVyTWFwLCByZXNvbHZlO1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICB2YXJpYWJsZXMgPSBleGVjQ29udGV4dC52YXJpYWJsZXM7XG4gICAgICAgICAgICAgICAgZmllbGROYW1lID0gZmllbGQubmFtZS52YWx1ZTtcbiAgICAgICAgICAgICAgICBhbGlhc2VkRmllbGROYW1lID0gcmVzdWx0S2V5TmFtZUZyb21GaWVsZChmaWVsZCk7XG4gICAgICAgICAgICAgICAgYWxpYXNVc2VkID0gZmllbGROYW1lICE9PSBhbGlhc2VkRmllbGROYW1lO1xuICAgICAgICAgICAgICAgIGRlZmF1bHRSZXN1bHQgPSByb290VmFsdWVbYWxpYXNlZEZpZWxkTmFtZV0gfHwgcm9vdFZhbHVlW2ZpZWxkTmFtZV07XG4gICAgICAgICAgICAgICAgcmVzdWx0UHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShkZWZhdWx0UmVzdWx0KTtcbiAgICAgICAgICAgICAgICBpZiAoIWV4ZWNDb250ZXh0Lm9ubHlSdW5Gb3JjZWRSZXNvbHZlcnMgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG91bGRGb3JjZVJlc29sdmVycyhmaWVsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZXJUeXBlID0gcm9vdFZhbHVlLl9fdHlwZW5hbWUgfHwgZXhlY0NvbnRleHQuZGVmYXVsdE9wZXJhdGlvblR5cGU7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVyTWFwID0gdGhpcy5yZXNvbHZlcnMgJiYgdGhpcy5yZXNvbHZlcnNbcmVzb2x2ZXJUeXBlXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc29sdmVyTWFwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlID0gcmVzb2x2ZXJNYXBbYWxpYXNVc2VkID8gZmllbGROYW1lIDogYWxpYXNlZEZpZWxkTmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUocmVzb2x2ZShyb290VmFsdWUsIGFyZ3VtZW50c09iamVjdEZyb21GaWVsZChmaWVsZCwgdmFyaWFibGVzKSwgZXhlY0NvbnRleHQuY29udGV4dCwgeyBmaWVsZDogZmllbGQsIGZyYWdtZW50TWFwOiBleGVjQ29udGV4dC5mcmFnbWVudE1hcCB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyLCByZXN1bHRQcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdm9pZCAwKSB7IHJlc3VsdCA9IGRlZmF1bHRSZXN1bHQ7IH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC5kaXJlY3RpdmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuZGlyZWN0aXZlcy5mb3JFYWNoKGZ1bmN0aW9uIChkaXJlY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZS5uYW1lLnZhbHVlID09PSAnZXhwb3J0JyAmJiBkaXJlY3RpdmUuYXJndW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmUuYXJndW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmcubmFtZS52YWx1ZSA9PT0gJ2FzJyAmJiBhcmcudmFsdWUua2luZCA9PT0gJ1N0cmluZ1ZhbHVlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGVjQ29udGV4dC5leHBvcnRlZFZhcmlhYmxlc1thcmcudmFsdWUudmFsdWVdID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZpZWxkLnNlbGVjdGlvblNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZXNvbHZlU3ViU2VsZWN0ZWRBcnJheShmaWVsZCwgcmVzdWx0LCBleGVjQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGQuc2VsZWN0aW9uU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnJlc29sdmVTZWxlY3Rpb25TZXQoZmllbGQuc2VsZWN0aW9uU2V0LCByZXN1bHQsIGV4ZWNDb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgTG9jYWxTdGF0ZS5wcm90b3R5cGUucmVzb2x2ZVN1YlNlbGVjdGVkQXJyYXkgPSBmdW5jdGlvbiAoZmllbGQsIHJlc3VsdCwgZXhlY0NvbnRleHQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHJlc3VsdC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpdGVtID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZXNvbHZlU3ViU2VsZWN0ZWRBcnJheShmaWVsZCwgaXRlbSwgZXhlY0NvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZpZWxkLnNlbGVjdGlvblNldCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZXNvbHZlU2VsZWN0aW9uU2V0KGZpZWxkLnNlbGVjdGlvblNldCwgaXRlbSwgZXhlY0NvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfTtcbiAgICByZXR1cm4gTG9jYWxTdGF0ZTtcbn0oKSk7XG5cbmZ1bmN0aW9uIG11bHRpcGxleChpbm5lcikge1xuICAgIHZhciBvYnNlcnZlcnMgPSBuZXcgU2V0KCk7XG4gICAgdmFyIHN1YiA9IG51bGw7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICBvYnNlcnZlcnMuYWRkKG9ic2VydmVyKTtcbiAgICAgICAgc3ViID0gc3ViIHx8IGlubmVyLnN1YnNjcmliZSh7XG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JzKSB7IHJldHVybiBvYnMubmV4dCAmJiBvYnMubmV4dCh2YWx1ZSk7IH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JzKSB7IHJldHVybiBvYnMuZXJyb3IgJiYgb2JzLmVycm9yKGVycm9yKTsgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JzKSB7IHJldHVybiBvYnMuY29tcGxldGUgJiYgb2JzLmNvbXBsZXRlKCk7IH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAob2JzZXJ2ZXJzLmRlbGV0ZShvYnNlcnZlcikgJiYgIW9ic2VydmVycy5zaXplICYmIHN1Yikge1xuICAgICAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIHN1YiA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBhc3luY01hcChvYnNlcnZhYmxlLCBtYXBGbikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgdmFyIG5leHQgPSBvYnNlcnZlci5uZXh0LCBlcnJvciA9IG9ic2VydmVyLmVycm9yLCBjb21wbGV0ZSA9IG9ic2VydmVyLmNvbXBsZXRlO1xuICAgICAgICB2YXIgYWN0aXZlTmV4dENvdW50ID0gMDtcbiAgICAgICAgdmFyIGNvbXBsZXRlZCA9IGZhbHNlO1xuICAgICAgICB2YXIgaGFuZGxlciA9IHtcbiAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICsrYWN0aXZlTmV4dENvdW50O1xuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUobWFwRm4odmFsdWUpKTtcbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgLS1hY3RpdmVOZXh0Q291bnQ7XG4gICAgICAgICAgICAgICAgICAgIG5leHQgJiYgbmV4dC5jYWxsKG9ic2VydmVyLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWQgJiYgaGFuZGxlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIC0tYWN0aXZlTmV4dENvdW50O1xuICAgICAgICAgICAgICAgICAgICBlcnJvciAmJiBlcnJvci5jYWxsKG9ic2VydmVyLCBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlcnJvciAmJiBlcnJvci5jYWxsKG9ic2VydmVyLCBlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKCFhY3RpdmVOZXh0Q291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGUgJiYgY29tcGxldGUuY2FsbChvYnNlcnZlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHN1YiA9IG9ic2VydmFibGUuc3Vic2NyaWJlKGhhbmRsZXIpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gc3ViLnVuc3Vic2NyaWJlKCk7IH07XG4gICAgfSk7XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgUXVlcnlNYW5hZ2VyID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBRdWVyeU1hbmFnZXIoX2EpIHtcbiAgICAgICAgdmFyIGxpbmsgPSBfYS5saW5rLCBfYiA9IF9hLnF1ZXJ5RGVkdXBsaWNhdGlvbiwgcXVlcnlEZWR1cGxpY2F0aW9uID0gX2IgPT09IHZvaWQgMCA/IGZhbHNlIDogX2IsIHN0b3JlID0gX2Euc3RvcmUsIF9jID0gX2Eub25Ccm9hZGNhc3QsIG9uQnJvYWRjYXN0ID0gX2MgPT09IHZvaWQgMCA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSA6IF9jLCBfZCA9IF9hLnNzck1vZGUsIHNzck1vZGUgPSBfZCA9PT0gdm9pZCAwID8gZmFsc2UgOiBfZCwgX2UgPSBfYS5jbGllbnRBd2FyZW5lc3MsIGNsaWVudEF3YXJlbmVzcyA9IF9lID09PSB2b2lkIDAgPyB7fSA6IF9lLCBsb2NhbFN0YXRlID0gX2EubG9jYWxTdGF0ZSwgYXNzdW1lSW1tdXRhYmxlUmVzdWx0cyA9IF9hLmFzc3VtZUltbXV0YWJsZVJlc3VsdHM7XG4gICAgICAgIHRoaXMubXV0YXRpb25TdG9yZSA9IG5ldyBNdXRhdGlvblN0b3JlKCk7XG4gICAgICAgIHRoaXMucXVlcnlTdG9yZSA9IG5ldyBRdWVyeVN0b3JlKCk7XG4gICAgICAgIHRoaXMuY2xpZW50QXdhcmVuZXNzID0ge307XG4gICAgICAgIHRoaXMuaWRDb3VudGVyID0gMTtcbiAgICAgICAgdGhpcy5xdWVyaWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmZldGNoUXVlcnlSZWplY3RGbnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtQ2FjaGUgPSBuZXcgKGNhblVzZVdlYWtNYXAgPyBXZWFrTWFwIDogTWFwKSgpO1xuICAgICAgICB0aGlzLmluRmxpZ2h0TGlua09ic2VydmFibGVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnBvbGxpbmdJbmZvQnlRdWVyeUlkID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLmxpbmsgPSBsaW5rO1xuICAgICAgICB0aGlzLnF1ZXJ5RGVkdXBsaWNhdGlvbiA9IHF1ZXJ5RGVkdXBsaWNhdGlvbjtcbiAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSBzdG9yZTtcbiAgICAgICAgdGhpcy5vbkJyb2FkY2FzdCA9IG9uQnJvYWRjYXN0O1xuICAgICAgICB0aGlzLmNsaWVudEF3YXJlbmVzcyA9IGNsaWVudEF3YXJlbmVzcztcbiAgICAgICAgdGhpcy5sb2NhbFN0YXRlID0gbG9jYWxTdGF0ZSB8fCBuZXcgTG9jYWxTdGF0ZSh7IGNhY2hlOiBzdG9yZS5nZXRDYWNoZSgpIH0pO1xuICAgICAgICB0aGlzLnNzck1vZGUgPSBzc3JNb2RlO1xuICAgICAgICB0aGlzLmFzc3VtZUltbXV0YWJsZVJlc3VsdHMgPSAhIWFzc3VtZUltbXV0YWJsZVJlc3VsdHM7XG4gICAgfVxuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5xdWVyaWVzLmZvckVhY2goZnVuY3Rpb24gKF9pbmZvLCBxdWVyeUlkKSB7XG4gICAgICAgICAgICBfdGhpcy5zdG9wUXVlcnlOb0Jyb2FkY2FzdChxdWVyeUlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmV0Y2hRdWVyeVJlamVjdEZucy5mb3JFYWNoKGZ1bmN0aW9uIChyZWplY3QpIHtcbiAgICAgICAgICAgIHJlamVjdChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBuZXcgSW52YXJpYW50RXJyb3IoOCkgOiBuZXcgSW52YXJpYW50RXJyb3IoJ1F1ZXJ5TWFuYWdlciBzdG9wcGVkIHdoaWxlIHF1ZXJ5IHdhcyBpbiBmbGlnaHQnKSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5tdXRhdGUgPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIG11dGF0aW9uID0gX2EubXV0YXRpb24sIHZhcmlhYmxlcyA9IF9hLnZhcmlhYmxlcywgb3B0aW1pc3RpY1Jlc3BvbnNlID0gX2Eub3B0aW1pc3RpY1Jlc3BvbnNlLCB1cGRhdGVRdWVyaWVzQnlOYW1lID0gX2EudXBkYXRlUXVlcmllcywgX2IgPSBfYS5yZWZldGNoUXVlcmllcywgcmVmZXRjaFF1ZXJpZXMgPSBfYiA9PT0gdm9pZCAwID8gW10gOiBfYiwgX2MgPSBfYS5hd2FpdFJlZmV0Y2hRdWVyaWVzLCBhd2FpdFJlZmV0Y2hRdWVyaWVzID0gX2MgPT09IHZvaWQgMCA/IGZhbHNlIDogX2MsIHVwZGF0ZVdpdGhQcm94eUZuID0gX2EudXBkYXRlLCBfZCA9IF9hLmVycm9yUG9saWN5LCBlcnJvclBvbGljeSA9IF9kID09PSB2b2lkIDAgPyAnbm9uZScgOiBfZCwgZmV0Y2hQb2xpY3kgPSBfYS5mZXRjaFBvbGljeSwgX2UgPSBfYS5jb250ZXh0LCBjb250ZXh0ID0gX2UgPT09IHZvaWQgMCA/IHt9IDogX2U7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtdXRhdGlvbklkLCBnZW5lcmF0ZVVwZGF0ZVF1ZXJpZXNJbmZvLCBzZWxmO1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2YpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9mLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChtdXRhdGlvbiwgOSkgOiBpbnZhcmlhbnQobXV0YXRpb24sICdtdXRhdGlvbiBvcHRpb24gaXMgcmVxdWlyZWQuIFlvdSBtdXN0IHNwZWNpZnkgeW91ciBHcmFwaFFMIGRvY3VtZW50IGluIHRoZSBtdXRhdGlvbiBvcHRpb24uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoIWZldGNoUG9saWN5IHx8IGZldGNoUG9saWN5ID09PSAnbm8tY2FjaGUnLCAxMCkgOiBpbnZhcmlhbnQoIWZldGNoUG9saWN5IHx8IGZldGNoUG9saWN5ID09PSAnbm8tY2FjaGUnLCBcIk11dGF0aW9ucyBvbmx5IHN1cHBvcnQgYSAnbm8tY2FjaGUnIGZldGNoUG9saWN5LiBJZiB5b3UgZG9uJ3Qgd2FudCB0byBkaXNhYmxlIHRoZSBjYWNoZSwgcmVtb3ZlIHlvdXIgZmV0Y2hQb2xpY3kgc2V0dGluZyB0byBwcm9jZWVkIHdpdGggdGhlIGRlZmF1bHQgbXV0YXRpb24gYmVoYXZpb3IuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbXV0YXRpb25JZCA9IHRoaXMuZ2VuZXJhdGVRdWVyeUlkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtdXRhdGlvbiA9IHRoaXMudHJhbnNmb3JtKG11dGF0aW9uKS5kb2N1bWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0UXVlcnkobXV0YXRpb25JZCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKHsgZG9jdW1lbnQ6IG11dGF0aW9uIH0pOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlcyA9IHRoaXMuZ2V0VmFyaWFibGVzKG11dGF0aW9uLCB2YXJpYWJsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyYW5zZm9ybShtdXRhdGlvbikuaGFzQ2xpZW50RXhwb3J0cykgcmV0dXJuIFszLCAyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCwgdGhpcy5sb2NhbFN0YXRlLmFkZEV4cG9ydGVkVmFyaWFibGVzKG11dGF0aW9uLCB2YXJpYWJsZXMsIGNvbnRleHQpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzID0gX2Yuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2YubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVVwZGF0ZVF1ZXJpZXNJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodXBkYXRlUXVlcmllc0J5TmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5xdWVyaWVzLmZvckVhY2goZnVuY3Rpb24gKF9hLCBxdWVyeUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JzZXJ2YWJsZVF1ZXJ5ID0gX2Eub2JzZXJ2YWJsZVF1ZXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9ic2VydmFibGVRdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWVyeU5hbWUgPSBvYnNlcnZhYmxlUXVlcnkucXVlcnlOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWVyeU5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzT3duUHJvcGVydHkuY2FsbCh1cGRhdGVRdWVyaWVzQnlOYW1lLCBxdWVyeU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldFtxdWVyeUlkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZXI6IHVwZGF0ZVF1ZXJpZXNCeU5hbWVbcXVlcnlOYW1lXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBfdGhpcy5xdWVyeVN0b3JlLmdldChxdWVyeUlkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubXV0YXRpb25TdG9yZS5pbml0TXV0YXRpb24obXV0YXRpb25JZCwgbXV0YXRpb24sIHZhcmlhYmxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFTdG9yZS5tYXJrTXV0YXRpb25Jbml0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdXRhdGlvbklkOiBtdXRhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50OiBtdXRhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZXM6IHZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVRdWVyaWVzOiBnZW5lcmF0ZVVwZGF0ZVF1ZXJpZXNJbmZvKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlOiB1cGRhdGVXaXRoUHJveHlGbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpbWlzdGljUmVzcG9uc2U6IG9wdGltaXN0aWNSZXNwb25zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5icm9hZGNhc3RRdWVyaWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RvcmVSZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nZXRPYnNlcnZhYmxlRnJvbUxpbmsobXV0YXRpb24sIF9fYXNzaWduKF9fYXNzaWduKHt9LCBjb250ZXh0KSwgeyBvcHRpbWlzdGljUmVzcG9uc2U6IG9wdGltaXN0aWNSZXNwb25zZSB9KSwgdmFyaWFibGVzLCBmYWxzZSkuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ3JhcGhRTFJlc3VsdEhhc0Vycm9yKHJlc3VsdCkgJiYgZXJyb3JQb2xpY3kgPT09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBBcG9sbG9FcnJvcih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFwaFFMRXJyb3JzOiByZXN1bHQuZXJyb3JzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm11dGF0aW9uU3RvcmUubWFya011dGF0aW9uUmVzdWx0KG11dGF0aW9uSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmZXRjaFBvbGljeSAhPT0gJ25vLWNhY2hlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmRhdGFTdG9yZS5tYXJrTXV0YXRpb25SZXN1bHQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXV0YXRpb25JZDogbXV0YXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQ6IG11dGF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiB2YXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVRdWVyaWVzOiBnZW5lcmF0ZVVwZGF0ZVF1ZXJpZXNJbmZvKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU6IHVwZGF0ZVdpdGhQcm94eUZuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm11dGF0aW9uU3RvcmUubWFya011dGF0aW9uRXJyb3IobXV0YXRpb25JZCwgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmRhdGFTdG9yZS5tYXJrTXV0YXRpb25Db21wbGV0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG11dGF0aW9uSWQ6IG11dGF0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGltaXN0aWNSZXNwb25zZTogb3B0aW1pc3RpY1Jlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYnJvYWRjYXN0UXVlcmllcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0UXVlcnkobXV0YXRpb25JZCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKHsgZG9jdW1lbnQ6IG51bGwgfSk7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgQXBvbGxvRXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXR3b3JrRXJyb3I6IGVycixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tdXRhdGlvblN0b3JlLm1hcmtNdXRhdGlvbkVycm9yKG11dGF0aW9uSWQsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5kYXRhU3RvcmUubWFya011dGF0aW9uQ29tcGxldGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdXRhdGlvbklkOiBtdXRhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpbWlzdGljUmVzcG9uc2U6IG9wdGltaXN0aWNSZXNwb25zZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmJyb2FkY2FzdFF1ZXJpZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlZmV0Y2hRdWVyaWVzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmV0Y2hRdWVyaWVzID0gcmVmZXRjaFF1ZXJpZXMoc3RvcmVSZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVmZXRjaFF1ZXJ5UHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOb25FbXB0eUFycmF5KHJlZmV0Y2hRdWVyaWVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWZldGNoUXVlcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChyZWZldGNoUXVlcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVmZXRjaFF1ZXJ5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucXVlcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JzZXJ2YWJsZVF1ZXJ5ID0gX2Eub2JzZXJ2YWJsZVF1ZXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JzZXJ2YWJsZVF1ZXJ5ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZhYmxlUXVlcnkucXVlcnlOYW1lID09PSByZWZldGNoUXVlcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmV0Y2hRdWVyeVByb21pc2VzLnB1c2gob2JzZXJ2YWJsZVF1ZXJ5LnJlZmV0Y2goKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWVyeU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiByZWZldGNoUXVlcnkucXVlcnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlczogcmVmZXRjaFF1ZXJ5LnZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hQb2xpY3k6ICduZXR3b3JrLW9ubHknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlZmV0Y2hRdWVyeS5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5T3B0aW9ucy5jb250ZXh0ID0gcmVmZXRjaFF1ZXJ5LmNvbnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZmV0Y2hRdWVyeVByb21pc2VzLnB1c2goc2VsZi5xdWVyeShxdWVyeU9wdGlvbnMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGF3YWl0UmVmZXRjaFF1ZXJpZXMgPyByZWZldGNoUXVlcnlQcm9taXNlcyA6IFtdKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRRdWVyeShtdXRhdGlvbklkLCBmdW5jdGlvbiAoKSB7IHJldHVybiAoeyBkb2N1bWVudDogbnVsbCB9KTsgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvclBvbGljeSA9PT0gJ2lnbm9yZScgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlUmVzdWx0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFwaFFMUmVzdWx0SGFzRXJyb3Ioc3RvcmVSZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc3RvcmVSZXN1bHQuZXJyb3JzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoc3RvcmVSZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUuZmV0Y2hRdWVyeSA9IGZ1bmN0aW9uIChxdWVyeUlkLCBvcHRpb25zLCBmZXRjaFR5cGUsIGZldGNoTW9yZUZvclF1ZXJ5SWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9hLCBtZXRhZGF0YSwgX2IsIGZldGNoUG9saWN5LCBfYywgY29udGV4dCwgcXVlcnksIHZhcmlhYmxlcywgc3RvcmVSZXN1bHQsIGlzTmV0d29ya09ubHksIG5lZWRUb0ZldGNoLCBfZCwgY29tcGxldGUsIHJlc3VsdCwgc2hvdWxkRmV0Y2gsIHJlcXVlc3RJZCwgY2FuY2VsLCBuZXR3b3JrUmVzdWx0O1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2UpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9lLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hID0gb3B0aW9ucy5tZXRhZGF0YSwgbWV0YWRhdGEgPSBfYSA9PT0gdm9pZCAwID8gbnVsbCA6IF9hLCBfYiA9IG9wdGlvbnMuZmV0Y2hQb2xpY3ksIGZldGNoUG9saWN5ID0gX2IgPT09IHZvaWQgMCA/ICdjYWNoZS1maXJzdCcgOiBfYiwgX2MgPSBvcHRpb25zLmNvbnRleHQsIGNvbnRleHQgPSBfYyA9PT0gdm9pZCAwID8ge30gOiBfYztcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5ID0gdGhpcy50cmFuc2Zvcm0ob3B0aW9ucy5xdWVyeSkuZG9jdW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZXMgPSB0aGlzLmdldFZhcmlhYmxlcyhxdWVyeSwgb3B0aW9ucy52YXJpYWJsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRyYW5zZm9ybShxdWVyeSkuaGFzQ2xpZW50RXhwb3J0cykgcmV0dXJuIFszLCAyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCwgdGhpcy5sb2NhbFN0YXRlLmFkZEV4cG9ydGVkVmFyaWFibGVzKHF1ZXJ5LCB2YXJpYWJsZXMsIGNvbnRleHQpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzID0gX2Uuc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2UubGFiZWwgPSAyO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7IHZhcmlhYmxlczogdmFyaWFibGVzIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXR3b3JrT25seSA9IGZldGNoUG9saWN5ID09PSAnbmV0d29yay1vbmx5JyB8fCBmZXRjaFBvbGljeSA9PT0gJ25vLWNhY2hlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG5lZWRUb0ZldGNoID0gaXNOZXR3b3JrT25seTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNOZXR3b3JrT25seSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kID0gdGhpcy5kYXRhU3RvcmUuZ2V0Q2FjaGUoKS5kaWZmKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZXM6IHZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuUGFydGlhbERhdGE6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGltaXN0aWM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLCBjb21wbGV0ZSA9IF9kLmNvbXBsZXRlLCByZXN1bHQgPSBfZC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmVlZFRvRmV0Y2ggPSAhY29tcGxldGUgfHwgZmV0Y2hQb2xpY3kgPT09ICdjYWNoZS1hbmQtbmV0d29yayc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRGZXRjaCA9IG5lZWRUb0ZldGNoICYmIGZldGNoUG9saWN5ICE9PSAnY2FjaGUtb25seScgJiYgZmV0Y2hQb2xpY3kgIT09ICdzdGFuZGJ5JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNEaXJlY3RpdmVzKFsnbGl2ZSddLCBxdWVyeSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkRmV0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdElkID0gdGhpcy5pZENvdW50ZXIrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbCA9IGZldGNoUG9saWN5ICE9PSAnbm8tY2FjaGUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLnVwZGF0ZVF1ZXJ5V2F0Y2gocXVlcnlJZCwgcXVlcnksIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFF1ZXJ5KHF1ZXJ5SWQsIGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQ6IHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RSZXF1ZXN0SWQ6IHJlcXVlc3RJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWw6IGNhbmNlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZShmZXRjaE1vcmVGb3JRdWVyeUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnlTdG9yZS5pbml0UXVlcnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SWQ6IHF1ZXJ5SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQ6IHF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlUHJldmlvdXNWYXJpYWJsZXM6IHNob3VsZEZldGNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlczogdmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUG9sbDogZmV0Y2hUeXBlID09PSBGZXRjaFR5cGUucG9sbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1JlZmV0Y2g6IGZldGNoVHlwZSA9PT0gRmV0Y2hUeXBlLnJlZmV0Y2gsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGE6IG1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoTW9yZUZvclF1ZXJ5SWQ6IGZldGNoTW9yZUZvclF1ZXJ5SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnJvYWRjYXN0UXVlcmllcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNob3VsZEZldGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV0d29ya1Jlc3VsdCA9IHRoaXMuZmV0Y2hSZXF1ZXN0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdElkOiByZXF1ZXN0SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5SWQ6IHF1ZXJ5SWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50OiBxdWVyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hNb3JlRm9yUXVlcnlJZDogZmV0Y2hNb3JlRm9yUXVlcnlJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXBvbGxvRXJyb3IoZXJyb3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0SWQgPj0gX3RoaXMuZ2V0UXVlcnkocXVlcnlJZCkubGFzdFJlcXVlc3RJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnF1ZXJ5U3RvcmUubWFya1F1ZXJ5RXJyb3IocXVlcnlJZCwgZXJyb3IsIGZldGNoTW9yZUZvclF1ZXJ5SWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmludmFsaWRhdGUocXVlcnlJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW52YWxpZGF0ZShmZXRjaE1vcmVGb3JRdWVyeUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5icm9hZGNhc3RRdWVyaWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXBvbGxvRXJyb3IoeyBuZXR3b3JrRXJyb3I6IGVycm9yIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZldGNoUG9saWN5ICE9PSAnY2FjaGUtYW5kLW5ldHdvcmsnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiwgbmV0d29ya1Jlc3VsdF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldHdvcmtSZXN1bHQuY2F0Y2goZnVuY3Rpb24gKCkgeyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucXVlcnlTdG9yZS5tYXJrUXVlcnlSZXN1bHRDbGllbnQocXVlcnlJZCwgIXNob3VsZEZldGNoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZShxdWVyeUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZShmZXRjaE1vcmVGb3JRdWVyeUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybShxdWVyeSkuaGFzRm9yY2VkUmVzb2x2ZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB0aGlzLmxvY2FsU3RhdGUucnVuUmVzb2x2ZXJzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50OiBxdWVyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW90ZVJlc3VsdDogeyBkYXRhOiBzdG9yZVJlc3VsdCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlczogdmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25seVJ1bkZvcmNlZFJlc29sdmVyczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5tYXJrUXVlcnlSZXN1bHQocXVlcnlJZCwgcmVzdWx0LCBvcHRpb25zLCBmZXRjaE1vcmVGb3JRdWVyeUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmJyb2FkY2FzdFF1ZXJpZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnJvYWRjYXN0UXVlcmllcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyLCB7IGRhdGE6IHN0b3JlUmVzdWx0IH1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUubWFya1F1ZXJ5UmVzdWx0ID0gZnVuY3Rpb24gKHF1ZXJ5SWQsIHJlc3VsdCwgX2EsIGZldGNoTW9yZUZvclF1ZXJ5SWQpIHtcbiAgICAgICAgdmFyIGZldGNoUG9saWN5ID0gX2EuZmV0Y2hQb2xpY3ksIHZhcmlhYmxlcyA9IF9hLnZhcmlhYmxlcywgZXJyb3JQb2xpY3kgPSBfYS5lcnJvclBvbGljeTtcbiAgICAgICAgaWYgKGZldGNoUG9saWN5ID09PSAnbm8tY2FjaGUnKSB7XG4gICAgICAgICAgICB0aGlzLnNldFF1ZXJ5KHF1ZXJ5SWQsIGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7XG4gICAgICAgICAgICAgICAgbmV3RGF0YTogeyByZXN1bHQ6IHJlc3VsdC5kYXRhLCBjb21wbGV0ZTogdHJ1ZSB9LFxuICAgICAgICAgICAgfSk7IH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYXRhU3RvcmUubWFya1F1ZXJ5UmVzdWx0KHJlc3VsdCwgdGhpcy5nZXRRdWVyeShxdWVyeUlkKS5kb2N1bWVudCwgdmFyaWFibGVzLCBmZXRjaE1vcmVGb3JRdWVyeUlkLCBlcnJvclBvbGljeSA9PT0gJ2lnbm9yZScgfHwgZXJyb3JQb2xpY3kgPT09ICdhbGwnKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5xdWVyeUxpc3RlbmVyRm9yT2JzZXJ2ZXIgPSBmdW5jdGlvbiAocXVlcnlJZCwgb3B0aW9ucywgb2JzZXJ2ZXIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJndW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChvYnNlcnZlclttZXRob2RdKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXJbbWV0aG9kXShhcmd1bWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiB8fCBpbnZhcmlhbnQuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobWV0aG9kID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiIHx8IGludmFyaWFudC5lcnJvcihhcmd1bWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChxdWVyeVN0b3JlVmFsdWUsIG5ld0RhdGEpIHtcbiAgICAgICAgICAgIF90aGlzLmludmFsaWRhdGUocXVlcnlJZCwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKCFxdWVyeVN0b3JlVmFsdWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIF9hID0gX3RoaXMuZ2V0UXVlcnkocXVlcnlJZCksIG9ic2VydmFibGVRdWVyeSA9IF9hLm9ic2VydmFibGVRdWVyeSwgZG9jdW1lbnQgPSBfYS5kb2N1bWVudDtcbiAgICAgICAgICAgIHZhciBmZXRjaFBvbGljeSA9IG9ic2VydmFibGVRdWVyeVxuICAgICAgICAgICAgICAgID8gb2JzZXJ2YWJsZVF1ZXJ5Lm9wdGlvbnMuZmV0Y2hQb2xpY3lcbiAgICAgICAgICAgICAgICA6IG9wdGlvbnMuZmV0Y2hQb2xpY3k7XG4gICAgICAgICAgICBpZiAoZmV0Y2hQb2xpY3kgPT09ICdzdGFuZGJ5JylcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB2YXIgbG9hZGluZyA9IGlzTmV0d29ya1JlcXVlc3RJbkZsaWdodChxdWVyeVN0b3JlVmFsdWUubmV0d29ya1N0YXR1cyk7XG4gICAgICAgICAgICB2YXIgbGFzdFJlc3VsdCA9IG9ic2VydmFibGVRdWVyeSAmJiBvYnNlcnZhYmxlUXVlcnkuZ2V0TGFzdFJlc3VsdCgpO1xuICAgICAgICAgICAgdmFyIG5ldHdvcmtTdGF0dXNDaGFuZ2VkID0gISEobGFzdFJlc3VsdCAmJlxuICAgICAgICAgICAgICAgIGxhc3RSZXN1bHQubmV0d29ya1N0YXR1cyAhPT0gcXVlcnlTdG9yZVZhbHVlLm5ldHdvcmtTdGF0dXMpO1xuICAgICAgICAgICAgdmFyIHNob3VsZE5vdGlmeUlmTG9hZGluZyA9IG9wdGlvbnMucmV0dXJuUGFydGlhbERhdGEgfHxcbiAgICAgICAgICAgICAgICAoIW5ld0RhdGEgJiYgcXVlcnlTdG9yZVZhbHVlLnByZXZpb3VzVmFyaWFibGVzKSB8fFxuICAgICAgICAgICAgICAgIChuZXR3b3JrU3RhdHVzQ2hhbmdlZCAmJiBvcHRpb25zLm5vdGlmeU9uTmV0d29ya1N0YXR1c0NoYW5nZSkgfHxcbiAgICAgICAgICAgICAgICBmZXRjaFBvbGljeSA9PT0gJ2NhY2hlLW9ubHknIHx8XG4gICAgICAgICAgICAgICAgZmV0Y2hQb2xpY3kgPT09ICdjYWNoZS1hbmQtbmV0d29yayc7XG4gICAgICAgICAgICBpZiAobG9hZGluZyAmJiAhc2hvdWxkTm90aWZ5SWZMb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGhhc0dyYXBoUUxFcnJvcnMgPSBpc05vbkVtcHR5QXJyYXkocXVlcnlTdG9yZVZhbHVlLmdyYXBoUUxFcnJvcnMpO1xuICAgICAgICAgICAgdmFyIGVycm9yUG9saWN5ID0gb2JzZXJ2YWJsZVF1ZXJ5XG4gICAgICAgICAgICAgICAgJiYgb2JzZXJ2YWJsZVF1ZXJ5Lm9wdGlvbnMuZXJyb3JQb2xpY3lcbiAgICAgICAgICAgICAgICB8fCBvcHRpb25zLmVycm9yUG9saWN5XG4gICAgICAgICAgICAgICAgfHwgJ25vbmUnO1xuICAgICAgICAgICAgaWYgKGVycm9yUG9saWN5ID09PSAnbm9uZScgJiYgaGFzR3JhcGhRTEVycm9ycyB8fCBxdWVyeVN0b3JlVmFsdWUubmV0d29ya0Vycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGludm9rZSgnZXJyb3InLCBuZXcgQXBvbGxvRXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICBncmFwaFFMRXJyb3JzOiBxdWVyeVN0b3JlVmFsdWUuZ3JhcGhRTEVycm9ycyxcbiAgICAgICAgICAgICAgICAgICAgbmV0d29ya0Vycm9yOiBxdWVyeVN0b3JlVmFsdWUubmV0d29ya0Vycm9yLFxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgdmFyIGlzTWlzc2luZyA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICBpZiAobmV3RGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmV0Y2hQb2xpY3kgIT09ICduby1jYWNoZScgJiYgZmV0Y2hQb2xpY3kgIT09ICduZXR3b3JrLW9ubHknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zZXRRdWVyeShxdWVyeUlkLCBmdW5jdGlvbiAoKSB7IHJldHVybiAoeyBuZXdEYXRhOiBudWxsIH0pOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gbmV3RGF0YS5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIGlzTWlzc2luZyA9ICFuZXdEYXRhLmNvbXBsZXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RFcnJvciA9IG9ic2VydmFibGVRdWVyeSAmJiBvYnNlcnZhYmxlUXVlcnkuZ2V0TGFzdEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvclN0YXR1c0NoYW5nZWQgPSBlcnJvclBvbGljeSAhPT0gJ25vbmUnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAobGFzdEVycm9yICYmIGxhc3RFcnJvci5ncmFwaFFMRXJyb3JzKSAhPT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeVN0b3JlVmFsdWUuZ3JhcGhRTEVycm9ycztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RSZXN1bHQgJiYgbGFzdFJlc3VsdC5kYXRhICYmICFlcnJvclN0YXR1c0NoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSBsYXN0UmVzdWx0LmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc01pc3NpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaWZmUmVzdWx0ID0gX3RoaXMuZGF0YVN0b3JlLmdldENhY2hlKCkuZGlmZih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnk6IGRvY3VtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlczogcXVlcnlTdG9yZVZhbHVlLnByZXZpb3VzVmFyaWFibGVzIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5U3RvcmVWYWx1ZS52YXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuUGFydGlhbERhdGE6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW1pc3RpYzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGRpZmZSZXN1bHQucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNNaXNzaW5nID0gIWRpZmZSZXN1bHQuY29tcGxldGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHN0YWxlID0gaXNNaXNzaW5nICYmICEob3B0aW9ucy5yZXR1cm5QYXJ0aWFsRGF0YSB8fFxuICAgICAgICAgICAgICAgICAgICBmZXRjaFBvbGljeSA9PT0gJ2NhY2hlLW9ubHknKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0RnJvbVN0b3JlID0ge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBzdGFsZSA/IGxhc3RSZXN1bHQgJiYgbGFzdFJlc3VsdC5kYXRhIDogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZzogbG9hZGluZyxcbiAgICAgICAgICAgICAgICAgICAgbmV0d29ya1N0YXR1czogcXVlcnlTdG9yZVZhbHVlLm5ldHdvcmtTdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIHN0YWxlOiBzdGFsZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChlcnJvclBvbGljeSA9PT0gJ2FsbCcgJiYgaGFzR3JhcGhRTEVycm9ycykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRGcm9tU3RvcmUuZXJyb3JzID0gcXVlcnlTdG9yZVZhbHVlLmdyYXBoUUxFcnJvcnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGludm9rZSgnbmV4dCcsIHJlc3VsdEZyb21TdG9yZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAobmV0d29ya0Vycm9yKSB7XG4gICAgICAgICAgICAgICAgaW52b2tlKCdlcnJvcicsIG5ldyBBcG9sbG9FcnJvcih7IG5ldHdvcmtFcnJvcjogbmV0d29ya0Vycm9yIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUudHJhbnNmb3JtID0gZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgICAgIHZhciB0cmFuc2Zvcm1DYWNoZSA9IHRoaXMudHJhbnNmb3JtQ2FjaGU7XG4gICAgICAgIGlmICghdHJhbnNmb3JtQ2FjaGUuaGFzKGRvY3VtZW50KSkge1xuICAgICAgICAgICAgdmFyIGNhY2hlID0gdGhpcy5kYXRhU3RvcmUuZ2V0Q2FjaGUoKTtcbiAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1lZCA9IGNhY2hlLnRyYW5zZm9ybURvY3VtZW50KGRvY3VtZW50KTtcbiAgICAgICAgICAgIHZhciBmb3JMaW5rID0gcmVtb3ZlQ29ubmVjdGlvbkRpcmVjdGl2ZUZyb21Eb2N1bWVudChjYWNoZS50cmFuc2Zvcm1Gb3JMaW5rKHRyYW5zZm9ybWVkKSk7XG4gICAgICAgICAgICB2YXIgY2xpZW50UXVlcnkgPSB0aGlzLmxvY2FsU3RhdGUuY2xpZW50UXVlcnkodHJhbnNmb3JtZWQpO1xuICAgICAgICAgICAgdmFyIHNlcnZlclF1ZXJ5ID0gdGhpcy5sb2NhbFN0YXRlLnNlcnZlclF1ZXJ5KGZvckxpbmspO1xuICAgICAgICAgICAgdmFyIGNhY2hlRW50cnlfMSA9IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudDogdHJhbnNmb3JtZWQsXG4gICAgICAgICAgICAgICAgaGFzQ2xpZW50RXhwb3J0czogaGFzQ2xpZW50RXhwb3J0cyh0cmFuc2Zvcm1lZCksXG4gICAgICAgICAgICAgICAgaGFzRm9yY2VkUmVzb2x2ZXJzOiB0aGlzLmxvY2FsU3RhdGUuc2hvdWxkRm9yY2VSZXNvbHZlcnModHJhbnNmb3JtZWQpLFxuICAgICAgICAgICAgICAgIGNsaWVudFF1ZXJ5OiBjbGllbnRRdWVyeSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXJRdWVyeTogc2VydmVyUXVlcnksXG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhcnM6IGdldERlZmF1bHRWYWx1ZXMoZ2V0T3BlcmF0aW9uRGVmaW5pdGlvbih0cmFuc2Zvcm1lZCkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBhZGQgPSBmdW5jdGlvbiAoZG9jKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvYyAmJiAhdHJhbnNmb3JtQ2FjaGUuaGFzKGRvYykpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtQ2FjaGUuc2V0KGRvYywgY2FjaGVFbnRyeV8xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRkKGRvY3VtZW50KTtcbiAgICAgICAgICAgIGFkZCh0cmFuc2Zvcm1lZCk7XG4gICAgICAgICAgICBhZGQoY2xpZW50UXVlcnkpO1xuICAgICAgICAgICAgYWRkKHNlcnZlclF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtQ2FjaGUuZ2V0KGRvY3VtZW50KTtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUuZ2V0VmFyaWFibGVzID0gZnVuY3Rpb24gKGRvY3VtZW50LCB2YXJpYWJsZXMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0aGlzLnRyYW5zZm9ybShkb2N1bWVudCkuZGVmYXVsdFZhcnMpLCB2YXJpYWJsZXMpO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS53YXRjaFF1ZXJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMsIHNob3VsZFN1YnNjcmliZSkge1xuICAgICAgICBpZiAoc2hvdWxkU3Vic2NyaWJlID09PSB2b2lkIDApIHsgc2hvdWxkU3Vic2NyaWJlID0gdHJ1ZTsgfVxuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQob3B0aW9ucy5mZXRjaFBvbGljeSAhPT0gJ3N0YW5kYnknLCAxMSkgOiBpbnZhcmlhbnQob3B0aW9ucy5mZXRjaFBvbGljeSAhPT0gJ3N0YW5kYnknLCAnY2xpZW50LndhdGNoUXVlcnkgY2Fubm90IGJlIGNhbGxlZCB3aXRoIGZldGNoUG9saWN5IHNldCB0byBcInN0YW5kYnlcIicpO1xuICAgICAgICBvcHRpb25zLnZhcmlhYmxlcyA9IHRoaXMuZ2V0VmFyaWFibGVzKG9wdGlvbnMucXVlcnksIG9wdGlvbnMudmFyaWFibGVzKTtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm5vdGlmeU9uTmV0d29ya1N0YXR1c0NoYW5nZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIG9wdGlvbnMubm90aWZ5T25OZXR3b3JrU3RhdHVzQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRyYW5zZm9ybWVkT3B0aW9ucyA9IF9fYXNzaWduKHt9LCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlUXVlcnkoe1xuICAgICAgICAgICAgcXVlcnlNYW5hZ2VyOiB0aGlzLFxuICAgICAgICAgICAgb3B0aW9uczogdHJhbnNmb3JtZWRPcHRpb25zLFxuICAgICAgICAgICAgc2hvdWxkU3Vic2NyaWJlOiBzaG91bGRTdWJzY3JpYmUsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChvcHRpb25zLnF1ZXJ5LCAxMikgOiBpbnZhcmlhbnQob3B0aW9ucy5xdWVyeSwgJ3F1ZXJ5IG9wdGlvbiBpcyByZXF1aXJlZC4gWW91IG11c3Qgc3BlY2lmeSB5b3VyIEdyYXBoUUwgZG9jdW1lbnQgJyArXG4gICAgICAgICAgICAnaW4gdGhlIHF1ZXJ5IG9wdGlvbi4nKTtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KG9wdGlvbnMucXVlcnkua2luZCA9PT0gJ0RvY3VtZW50JywgMTMpIDogaW52YXJpYW50KG9wdGlvbnMucXVlcnkua2luZCA9PT0gJ0RvY3VtZW50JywgJ1lvdSBtdXN0IHdyYXAgdGhlIHF1ZXJ5IHN0cmluZyBpbiBhIFwiZ3FsXCIgdGFnLicpO1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoIW9wdGlvbnMucmV0dXJuUGFydGlhbERhdGEsIDE0KSA6IGludmFyaWFudCghb3B0aW9ucy5yZXR1cm5QYXJ0aWFsRGF0YSwgJ3JldHVyblBhcnRpYWxEYXRhIG9wdGlvbiBvbmx5IHN1cHBvcnRlZCBvbiB3YXRjaFF1ZXJ5LicpO1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoIW9wdGlvbnMucG9sbEludGVydmFsLCAxNSkgOiBpbnZhcmlhbnQoIW9wdGlvbnMucG9sbEludGVydmFsLCAncG9sbEludGVydmFsIG9wdGlvbiBvbmx5IHN1cHBvcnRlZCBvbiB3YXRjaFF1ZXJ5LicpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIHdhdGNoZWRRdWVyeSA9IF90aGlzLndhdGNoUXVlcnkob3B0aW9ucywgZmFsc2UpO1xuICAgICAgICAgICAgX3RoaXMuZmV0Y2hRdWVyeVJlamVjdEZucy5zZXQoXCJxdWVyeTpcIiArIHdhdGNoZWRRdWVyeS5xdWVyeUlkLCByZWplY3QpO1xuICAgICAgICAgICAgd2F0Y2hlZFF1ZXJ5XG4gICAgICAgICAgICAgICAgLnJlc3VsdCgpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZmV0Y2hRdWVyeVJlamVjdEZucy5kZWxldGUoXCJxdWVyeTpcIiArIHdhdGNoZWRRdWVyeS5xdWVyeUlkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUuZ2VuZXJhdGVRdWVyeUlkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMuaWRDb3VudGVyKyspO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5zdG9wUXVlcnlJblN0b3JlID0gZnVuY3Rpb24gKHF1ZXJ5SWQpIHtcbiAgICAgICAgdGhpcy5zdG9wUXVlcnlJblN0b3JlTm9Ccm9hZGNhc3QocXVlcnlJZCk7XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0UXVlcmllcygpO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5zdG9wUXVlcnlJblN0b3JlTm9Ccm9hZGNhc3QgPSBmdW5jdGlvbiAocXVlcnlJZCkge1xuICAgICAgICB0aGlzLnN0b3BQb2xsaW5nUXVlcnkocXVlcnlJZCk7XG4gICAgICAgIHRoaXMucXVlcnlTdG9yZS5zdG9wUXVlcnkocXVlcnlJZCk7XG4gICAgICAgIHRoaXMuaW52YWxpZGF0ZShxdWVyeUlkKTtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUuYWRkUXVlcnlMaXN0ZW5lciA9IGZ1bmN0aW9uIChxdWVyeUlkLCBsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLnNldFF1ZXJ5KHF1ZXJ5SWQsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IF9hLmxpc3RlbmVycztcbiAgICAgICAgICAgIGxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHsgaW52YWxpZGF0ZWQ6IGZhbHNlIH07XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGVRdWVyeVdhdGNoID0gZnVuY3Rpb24gKHF1ZXJ5SWQsIGRvY3VtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjYW5jZWwgPSB0aGlzLmdldFF1ZXJ5KHF1ZXJ5SWQpLmNhbmNlbDtcbiAgICAgICAgaWYgKGNhbmNlbClcbiAgICAgICAgICAgIGNhbmNlbCgpO1xuICAgICAgICB2YXIgcHJldmlvdXNSZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJldmlvdXNSZXN1bHQgPSBudWxsO1xuICAgICAgICAgICAgdmFyIG9ic2VydmFibGVRdWVyeSA9IF90aGlzLmdldFF1ZXJ5KHF1ZXJ5SWQpLm9ic2VydmFibGVRdWVyeTtcbiAgICAgICAgICAgIGlmIChvYnNlcnZhYmxlUXVlcnkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdFJlc3VsdCA9IG9ic2VydmFibGVRdWVyeS5nZXRMYXN0UmVzdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNSZXN1bHQgPSBsYXN0UmVzdWx0LmRhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByZXZpb3VzUmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhU3RvcmUuZ2V0Q2FjaGUoKS53YXRjaCh7XG4gICAgICAgICAgICBxdWVyeTogZG9jdW1lbnQsXG4gICAgICAgICAgICB2YXJpYWJsZXM6IG9wdGlvbnMudmFyaWFibGVzLFxuICAgICAgICAgICAgb3B0aW1pc3RpYzogdHJ1ZSxcbiAgICAgICAgICAgIHByZXZpb3VzUmVzdWx0OiBwcmV2aW91c1Jlc3VsdCxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAobmV3RGF0YSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnNldFF1ZXJ5KHF1ZXJ5SWQsIGZ1bmN0aW9uICgpIHsgcmV0dXJuICh7IGludmFsaWRhdGVkOiB0cnVlLCBuZXdEYXRhOiBuZXdEYXRhIH0pOyB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5hZGRPYnNlcnZhYmxlUXVlcnkgPSBmdW5jdGlvbiAocXVlcnlJZCwgb2JzZXJ2YWJsZVF1ZXJ5KSB7XG4gICAgICAgIHRoaXMuc2V0UXVlcnkocXVlcnlJZCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKHsgb2JzZXJ2YWJsZVF1ZXJ5OiBvYnNlcnZhYmxlUXVlcnkgfSk7IH0pO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVPYnNlcnZhYmxlUXVlcnkgPSBmdW5jdGlvbiAocXVlcnlJZCkge1xuICAgICAgICB2YXIgY2FuY2VsID0gdGhpcy5nZXRRdWVyeShxdWVyeUlkKS5jYW5jZWw7XG4gICAgICAgIHRoaXMuc2V0UXVlcnkocXVlcnlJZCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKHsgb2JzZXJ2YWJsZVF1ZXJ5OiBudWxsIH0pOyB9KTtcbiAgICAgICAgaWYgKGNhbmNlbClcbiAgICAgICAgICAgIGNhbmNlbCgpO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5jbGVhclN0b3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmZldGNoUXVlcnlSZWplY3RGbnMuZm9yRWFjaChmdW5jdGlvbiAocmVqZWN0KSB7XG4gICAgICAgICAgICByZWplY3QocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gbmV3IEludmFyaWFudEVycm9yKDE2KSA6IG5ldyBJbnZhcmlhbnRFcnJvcignU3RvcmUgcmVzZXQgd2hpbGUgcXVlcnkgd2FzIGluIGZsaWdodCAobm90IGNvbXBsZXRlZCBpbiBsaW5rIGNoYWluKScpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciByZXNldElkcyA9IFtdO1xuICAgICAgICB0aGlzLnF1ZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoX2EsIHF1ZXJ5SWQpIHtcbiAgICAgICAgICAgIHZhciBvYnNlcnZhYmxlUXVlcnkgPSBfYS5vYnNlcnZhYmxlUXVlcnk7XG4gICAgICAgICAgICBpZiAob2JzZXJ2YWJsZVF1ZXJ5KVxuICAgICAgICAgICAgICAgIHJlc2V0SWRzLnB1c2gocXVlcnlJZCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnF1ZXJ5U3RvcmUucmVzZXQocmVzZXRJZHMpO1xuICAgICAgICB0aGlzLm11dGF0aW9uU3RvcmUucmVzZXQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVN0b3JlLnJlc2V0KCk7XG4gICAgfTtcbiAgICBRdWVyeU1hbmFnZXIucHJvdG90eXBlLnJlc2V0U3RvcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiB0aGlzLmNsZWFyU3RvcmUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5yZUZldGNoT2JzZXJ2YWJsZVF1ZXJpZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBRdWVyeU1hbmFnZXIucHJvdG90eXBlLnJlRmV0Y2hPYnNlcnZhYmxlUXVlcmllcyA9IGZ1bmN0aW9uIChpbmNsdWRlU3RhbmRieSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoaW5jbHVkZVN0YW5kYnkgPT09IHZvaWQgMCkgeyBpbmNsdWRlU3RhbmRieSA9IGZhbHNlOyB9XG4gICAgICAgIHZhciBvYnNlcnZhYmxlUXVlcnlQcm9taXNlcyA9IFtdO1xuICAgICAgICB0aGlzLnF1ZXJpZXMuZm9yRWFjaChmdW5jdGlvbiAoX2EsIHF1ZXJ5SWQpIHtcbiAgICAgICAgICAgIHZhciBvYnNlcnZhYmxlUXVlcnkgPSBfYS5vYnNlcnZhYmxlUXVlcnk7XG4gICAgICAgICAgICBpZiAob2JzZXJ2YWJsZVF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgdmFyIGZldGNoUG9saWN5ID0gb2JzZXJ2YWJsZVF1ZXJ5Lm9wdGlvbnMuZmV0Y2hQb2xpY3k7XG4gICAgICAgICAgICAgICAgb2JzZXJ2YWJsZVF1ZXJ5LnJlc2V0TGFzdFJlc3VsdHMoKTtcbiAgICAgICAgICAgICAgICBpZiAoZmV0Y2hQb2xpY3kgIT09ICdjYWNoZS1vbmx5JyAmJlxuICAgICAgICAgICAgICAgICAgICAoaW5jbHVkZVN0YW5kYnkgfHwgZmV0Y2hQb2xpY3kgIT09ICdzdGFuZGJ5JykpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YWJsZVF1ZXJ5UHJvbWlzZXMucHVzaChvYnNlcnZhYmxlUXVlcnkucmVmZXRjaCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0UXVlcnkocXVlcnlJZCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gKHsgbmV3RGF0YTogbnVsbCB9KTsgfSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuaW52YWxpZGF0ZShxdWVyeUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYnJvYWRjYXN0UXVlcmllcygpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwob2JzZXJ2YWJsZVF1ZXJ5UHJvbWlzZXMpO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5vYnNlcnZlUXVlcnkgPSBmdW5jdGlvbiAocXVlcnlJZCwgb3B0aW9ucywgb2JzZXJ2ZXIpIHtcbiAgICAgICAgdGhpcy5hZGRRdWVyeUxpc3RlbmVyKHF1ZXJ5SWQsIHRoaXMucXVlcnlMaXN0ZW5lckZvck9ic2VydmVyKHF1ZXJ5SWQsIG9wdGlvbnMsIG9ic2VydmVyKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmZldGNoUXVlcnkocXVlcnlJZCwgb3B0aW9ucyk7XG4gICAgfTtcbiAgICBRdWVyeU1hbmFnZXIucHJvdG90eXBlLnN0YXJ0UXVlcnkgPSBmdW5jdGlvbiAocXVlcnlJZCwgb3B0aW9ucywgbGlzdGVuZXIpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiIHx8IGludmFyaWFudC53YXJuKFwiVGhlIFF1ZXJ5TWFuYWdlci5zdGFydFF1ZXJ5IG1ldGhvZCBoYXMgYmVlbiBkZXByZWNhdGVkXCIpO1xuICAgICAgICB0aGlzLmFkZFF1ZXJ5TGlzdGVuZXIocXVlcnlJZCwgbGlzdGVuZXIpO1xuICAgICAgICB0aGlzLmZldGNoUXVlcnkocXVlcnlJZCwgb3B0aW9ucylcbiAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQ7IH0pO1xuICAgICAgICByZXR1cm4gcXVlcnlJZDtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUuc3RhcnRHcmFwaFFMU3Vic2NyaXB0aW9uID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBxdWVyeSA9IF9hLnF1ZXJ5LCBmZXRjaFBvbGljeSA9IF9hLmZldGNoUG9saWN5LCB2YXJpYWJsZXMgPSBfYS52YXJpYWJsZXM7XG4gICAgICAgIHF1ZXJ5ID0gdGhpcy50cmFuc2Zvcm0ocXVlcnkpLmRvY3VtZW50O1xuICAgICAgICB2YXJpYWJsZXMgPSB0aGlzLmdldFZhcmlhYmxlcyhxdWVyeSwgdmFyaWFibGVzKTtcbiAgICAgICAgdmFyIG1ha2VPYnNlcnZhYmxlID0gZnVuY3Rpb24gKHZhcmlhYmxlcykge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLmdldE9ic2VydmFibGVGcm9tTGluayhxdWVyeSwge30sIHZhcmlhYmxlcywgZmFsc2UpLm1hcChmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFmZXRjaFBvbGljeSB8fCBmZXRjaFBvbGljeSAhPT0gJ25vLWNhY2hlJykge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5kYXRhU3RvcmUubWFya1N1YnNjcmlwdGlvblJlc3VsdChyZXN1bHQsIHF1ZXJ5LCB2YXJpYWJsZXMpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5icm9hZGNhc3RRdWVyaWVzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChncmFwaFFMUmVzdWx0SGFzRXJyb3IocmVzdWx0KSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgQXBvbGxvRXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhRTEVycm9yczogcmVzdWx0LmVycm9ycyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNmb3JtKHF1ZXJ5KS5oYXNDbGllbnRFeHBvcnRzKSB7XG4gICAgICAgICAgICB2YXIgb2JzZXJ2YWJsZVByb21pc2VfMSA9IHRoaXMubG9jYWxTdGF0ZS5hZGRFeHBvcnRlZFZhcmlhYmxlcyhxdWVyeSwgdmFyaWFibGVzKS50aGVuKG1ha2VPYnNlcnZhYmxlKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3ViID0gbnVsbDtcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlUHJvbWlzZV8xLnRoZW4oZnVuY3Rpb24gKG9ic2VydmFibGUpIHsgcmV0dXJuIHN1YiA9IG9ic2VydmFibGUuc3Vic2NyaWJlKG9ic2VydmVyKTsgfSwgb2JzZXJ2ZXIuZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBzdWIgJiYgc3ViLnVuc3Vic2NyaWJlKCk7IH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFrZU9ic2VydmFibGUodmFyaWFibGVzKTtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUuc3RvcFF1ZXJ5ID0gZnVuY3Rpb24gKHF1ZXJ5SWQpIHtcbiAgICAgICAgdGhpcy5zdG9wUXVlcnlOb0Jyb2FkY2FzdChxdWVyeUlkKTtcbiAgICAgICAgdGhpcy5icm9hZGNhc3RRdWVyaWVzKCk7XG4gICAgfTtcbiAgICBRdWVyeU1hbmFnZXIucHJvdG90eXBlLnN0b3BRdWVyeU5vQnJvYWRjYXN0ID0gZnVuY3Rpb24gKHF1ZXJ5SWQpIHtcbiAgICAgICAgdGhpcy5zdG9wUXVlcnlJblN0b3JlTm9Ccm9hZGNhc3QocXVlcnlJZCk7XG4gICAgICAgIHRoaXMucmVtb3ZlUXVlcnkocXVlcnlJZCk7XG4gICAgfTtcbiAgICBRdWVyeU1hbmFnZXIucHJvdG90eXBlLnJlbW92ZVF1ZXJ5ID0gZnVuY3Rpb24gKHF1ZXJ5SWQpIHtcbiAgICAgICAgdGhpcy5mZXRjaFF1ZXJ5UmVqZWN0Rm5zLmRlbGV0ZShcInF1ZXJ5OlwiICsgcXVlcnlJZCk7XG4gICAgICAgIHRoaXMuZmV0Y2hRdWVyeVJlamVjdEZucy5kZWxldGUoXCJmZXRjaFJlcXVlc3Q6XCIgKyBxdWVyeUlkKTtcbiAgICAgICAgdGhpcy5nZXRRdWVyeShxdWVyeUlkKS5zdWJzY3JpcHRpb25zLmZvckVhY2goZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHgudW5zdWJzY3JpYmUoKTsgfSk7XG4gICAgICAgIHRoaXMucXVlcmllcy5kZWxldGUocXVlcnlJZCk7XG4gICAgfTtcbiAgICBRdWVyeU1hbmFnZXIucHJvdG90eXBlLmdldEN1cnJlbnRRdWVyeVJlc3VsdCA9IGZ1bmN0aW9uIChvYnNlcnZhYmxlUXVlcnksIG9wdGltaXN0aWMpIHtcbiAgICAgICAgaWYgKG9wdGltaXN0aWMgPT09IHZvaWQgMCkgeyBvcHRpbWlzdGljID0gdHJ1ZTsgfVxuICAgICAgICB2YXIgX2EgPSBvYnNlcnZhYmxlUXVlcnkub3B0aW9ucywgdmFyaWFibGVzID0gX2EudmFyaWFibGVzLCBxdWVyeSA9IF9hLnF1ZXJ5LCBmZXRjaFBvbGljeSA9IF9hLmZldGNoUG9saWN5LCByZXR1cm5QYXJ0aWFsRGF0YSA9IF9hLnJldHVyblBhcnRpYWxEYXRhO1xuICAgICAgICB2YXIgbGFzdFJlc3VsdCA9IG9ic2VydmFibGVRdWVyeS5nZXRMYXN0UmVzdWx0KCk7XG4gICAgICAgIHZhciBuZXdEYXRhID0gdGhpcy5nZXRRdWVyeShvYnNlcnZhYmxlUXVlcnkucXVlcnlJZCkubmV3RGF0YTtcbiAgICAgICAgaWYgKG5ld0RhdGEgJiYgbmV3RGF0YS5jb21wbGV0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogbmV3RGF0YS5yZXN1bHQsIHBhcnRpYWw6IGZhbHNlIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZldGNoUG9saWN5ID09PSAnbm8tY2FjaGUnIHx8IGZldGNoUG9saWN5ID09PSAnbmV0d29yay1vbmx5Jykge1xuICAgICAgICAgICAgcmV0dXJuIHsgZGF0YTogdW5kZWZpbmVkLCBwYXJ0aWFsOiBmYWxzZSB9O1xuICAgICAgICB9XG4gICAgICAgIHZhciBfYiA9IHRoaXMuZGF0YVN0b3JlLmdldENhY2hlKCkuZGlmZih7XG4gICAgICAgICAgICBxdWVyeTogcXVlcnksXG4gICAgICAgICAgICB2YXJpYWJsZXM6IHZhcmlhYmxlcyxcbiAgICAgICAgICAgIHByZXZpb3VzUmVzdWx0OiBsYXN0UmVzdWx0ID8gbGFzdFJlc3VsdC5kYXRhIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgcmV0dXJuUGFydGlhbERhdGE6IHRydWUsXG4gICAgICAgICAgICBvcHRpbWlzdGljOiBvcHRpbWlzdGljLFxuICAgICAgICB9KSwgcmVzdWx0ID0gX2IucmVzdWx0LCBjb21wbGV0ZSA9IF9iLmNvbXBsZXRlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGF0YTogKGNvbXBsZXRlIHx8IHJldHVyblBhcnRpYWxEYXRhKSA/IHJlc3VsdCA6IHZvaWQgMCxcbiAgICAgICAgICAgIHBhcnRpYWw6ICFjb21wbGV0ZSxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUuZ2V0UXVlcnlXaXRoUHJldmlvdXNSZXN1bHQgPSBmdW5jdGlvbiAocXVlcnlJZE9yT2JzZXJ2YWJsZSkge1xuICAgICAgICB2YXIgb2JzZXJ2YWJsZVF1ZXJ5O1xuICAgICAgICBpZiAodHlwZW9mIHF1ZXJ5SWRPck9ic2VydmFibGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YXIgZm91bmRPYnNlcnZlYWJsZVF1ZXJ5ID0gdGhpcy5nZXRRdWVyeShxdWVyeUlkT3JPYnNlcnZhYmxlKS5vYnNlcnZhYmxlUXVlcnk7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZm91bmRPYnNlcnZlYWJsZVF1ZXJ5LCAxNykgOiBpbnZhcmlhbnQoZm91bmRPYnNlcnZlYWJsZVF1ZXJ5LCBcIk9ic2VydmFibGVRdWVyeSB3aXRoIHRoaXMgaWQgZG9lc24ndCBleGlzdDogXCIgKyBxdWVyeUlkT3JPYnNlcnZhYmxlKTtcbiAgICAgICAgICAgIG9ic2VydmFibGVRdWVyeSA9IGZvdW5kT2JzZXJ2ZWFibGVRdWVyeTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9ic2VydmFibGVRdWVyeSA9IHF1ZXJ5SWRPck9ic2VydmFibGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIF9hID0gb2JzZXJ2YWJsZVF1ZXJ5Lm9wdGlvbnMsIHZhcmlhYmxlcyA9IF9hLnZhcmlhYmxlcywgcXVlcnkgPSBfYS5xdWVyeTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByZXZpb3VzUmVzdWx0OiB0aGlzLmdldEN1cnJlbnRRdWVyeVJlc3VsdChvYnNlcnZhYmxlUXVlcnksIGZhbHNlKS5kYXRhLFxuICAgICAgICAgICAgdmFyaWFibGVzOiB2YXJpYWJsZXMsXG4gICAgICAgICAgICBkb2N1bWVudDogcXVlcnksXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBRdWVyeU1hbmFnZXIucHJvdG90eXBlLmJyb2FkY2FzdFF1ZXJpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMub25Ccm9hZGNhc3QoKTtcbiAgICAgICAgdGhpcy5xdWVyaWVzLmZvckVhY2goZnVuY3Rpb24gKGluZm8sIGlkKSB7XG4gICAgICAgICAgICBpZiAoaW5mby5pbnZhbGlkYXRlZCkge1xuICAgICAgICAgICAgICAgIGluZm8ubGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIoX3RoaXMucXVlcnlTdG9yZS5nZXQoaWQpLCBpbmZvLm5ld0RhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5nZXRMb2NhbFN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbFN0YXRlO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5nZXRPYnNlcnZhYmxlRnJvbUxpbmsgPSBmdW5jdGlvbiAocXVlcnksIGNvbnRleHQsIHZhcmlhYmxlcywgZGVkdXBsaWNhdGlvbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoZGVkdXBsaWNhdGlvbiA9PT0gdm9pZCAwKSB7IGRlZHVwbGljYXRpb24gPSB0aGlzLnF1ZXJ5RGVkdXBsaWNhdGlvbjsgfVxuICAgICAgICB2YXIgb2JzZXJ2YWJsZTtcbiAgICAgICAgdmFyIHNlcnZlclF1ZXJ5ID0gdGhpcy50cmFuc2Zvcm0ocXVlcnkpLnNlcnZlclF1ZXJ5O1xuICAgICAgICBpZiAoc2VydmVyUXVlcnkpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IHRoaXMsIGluRmxpZ2h0TGlua09ic2VydmFibGVzXzEgPSBfYS5pbkZsaWdodExpbmtPYnNlcnZhYmxlcywgbGluayA9IF9hLmxpbms7XG4gICAgICAgICAgICB2YXIgb3BlcmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHF1ZXJ5OiBzZXJ2ZXJRdWVyeSxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZXM6IHZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25OYW1lOiBnZXRPcGVyYXRpb25OYW1lKHNlcnZlclF1ZXJ5KSB8fCB2b2lkIDAsXG4gICAgICAgICAgICAgICAgY29udGV4dDogdGhpcy5wcmVwYXJlQ29udGV4dChfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY29udGV4dCksIHsgZm9yY2VGZXRjaDogIWRlZHVwbGljYXRpb24gfSkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnRleHQgPSBvcGVyYXRpb24uY29udGV4dDtcbiAgICAgICAgICAgIGlmIChkZWR1cGxpY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJ5VmFyaWFibGVzXzEgPSBpbkZsaWdodExpbmtPYnNlcnZhYmxlc18xLmdldChzZXJ2ZXJRdWVyeSkgfHwgbmV3IE1hcCgpO1xuICAgICAgICAgICAgICAgIGluRmxpZ2h0TGlua09ic2VydmFibGVzXzEuc2V0KHNlcnZlclF1ZXJ5LCBieVZhcmlhYmxlc18xKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFySnNvbl8xID0gSlNPTi5zdHJpbmdpZnkodmFyaWFibGVzKTtcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlID0gYnlWYXJpYWJsZXNfMS5nZXQodmFySnNvbl8xKTtcbiAgICAgICAgICAgICAgICBpZiAoIW9ic2VydmFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgYnlWYXJpYWJsZXNfMS5zZXQodmFySnNvbl8xLCBvYnNlcnZhYmxlID0gbXVsdGlwbGV4KGV4ZWN1dGUobGluaywgb3BlcmF0aW9uKSkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ5VmFyaWFibGVzXzEuZGVsZXRlKHZhckpzb25fMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJ5VmFyaWFibGVzXzEuc2l6ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbkZsaWdodExpbmtPYnNlcnZhYmxlc18xLmRlbGV0ZShzZXJ2ZXJRdWVyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhbnVwU3ViXzEudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNsZWFudXBTdWJfMSA9IG9ic2VydmFibGUuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQ6IGNsZWFudXAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogY2xlYW51cCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBjbGVhbnVwLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlID0gbXVsdGlwbGV4KGV4ZWN1dGUobGluaywgb3BlcmF0aW9uKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZhYmxlID0gT2JzZXJ2YWJsZS5vZih7IGRhdGE6IHt9IH0pO1xuICAgICAgICAgICAgY29udGV4dCA9IHRoaXMucHJlcGFyZUNvbnRleHQoY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNsaWVudFF1ZXJ5ID0gdGhpcy50cmFuc2Zvcm0ocXVlcnkpLmNsaWVudFF1ZXJ5O1xuICAgICAgICBpZiAoY2xpZW50UXVlcnkpIHtcbiAgICAgICAgICAgIG9ic2VydmFibGUgPSBhc3luY01hcChvYnNlcnZhYmxlLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmxvY2FsU3RhdGUucnVuUmVzb2x2ZXJzKHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQ6IGNsaWVudFF1ZXJ5LFxuICAgICAgICAgICAgICAgICAgICByZW1vdGVSZXN1bHQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiB2YXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUuZmV0Y2hSZXF1ZXN0ID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciByZXF1ZXN0SWQgPSBfYS5yZXF1ZXN0SWQsIHF1ZXJ5SWQgPSBfYS5xdWVyeUlkLCBkb2N1bWVudCA9IF9hLmRvY3VtZW50LCBvcHRpb25zID0gX2Eub3B0aW9ucywgZmV0Y2hNb3JlRm9yUXVlcnlJZCA9IF9hLmZldGNoTW9yZUZvclF1ZXJ5SWQ7XG4gICAgICAgIHZhciB2YXJpYWJsZXMgPSBvcHRpb25zLnZhcmlhYmxlcywgX2IgPSBvcHRpb25zLmVycm9yUG9saWN5LCBlcnJvclBvbGljeSA9IF9iID09PSB2b2lkIDAgPyAnbm9uZScgOiBfYiwgZmV0Y2hQb2xpY3kgPSBvcHRpb25zLmZldGNoUG9saWN5O1xuICAgICAgICB2YXIgcmVzdWx0RnJvbVN0b3JlO1xuICAgICAgICB2YXIgZXJyb3JzRnJvbVN0b3JlO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIG9ic2VydmFibGUgPSBfdGhpcy5nZXRPYnNlcnZhYmxlRnJvbUxpbmsoZG9jdW1lbnQsIG9wdGlvbnMuY29udGV4dCwgdmFyaWFibGVzKTtcbiAgICAgICAgICAgIHZhciBmcXJmSWQgPSBcImZldGNoUmVxdWVzdDpcIiArIHF1ZXJ5SWQ7XG4gICAgICAgICAgICBfdGhpcy5mZXRjaFF1ZXJ5UmVqZWN0Rm5zLnNldChmcXJmSWQsIHJlamVjdCk7XG4gICAgICAgICAgICB2YXIgY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5mZXRjaFF1ZXJ5UmVqZWN0Rm5zLmRlbGV0ZShmcXJmSWQpO1xuICAgICAgICAgICAgICAgIF90aGlzLnNldFF1ZXJ5KHF1ZXJ5SWQsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3Vic2NyaXB0aW9ucyA9IF9hLnN1YnNjcmlwdGlvbnM7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbnMuZGVsZXRlKHN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHN1YnNjcmlwdGlvbiA9IG9ic2VydmFibGUubWFwKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdElkID49IF90aGlzLmdldFF1ZXJ5KHF1ZXJ5SWQpLmxhc3RSZXF1ZXN0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubWFya1F1ZXJ5UmVzdWx0KHF1ZXJ5SWQsIHJlc3VsdCwgb3B0aW9ucywgZmV0Y2hNb3JlRm9yUXVlcnlJZCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnF1ZXJ5U3RvcmUubWFya1F1ZXJ5UmVzdWx0KHF1ZXJ5SWQsIHJlc3VsdCwgZmV0Y2hNb3JlRm9yUXVlcnlJZCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmludmFsaWRhdGUocXVlcnlJZCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmludmFsaWRhdGUoZmV0Y2hNb3JlRm9yUXVlcnlJZCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmJyb2FkY2FzdFF1ZXJpZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yUG9saWN5ID09PSAnbm9uZScgJiYgaXNOb25FbXB0eUFycmF5KHJlc3VsdC5lcnJvcnMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3IEFwb2xsb0Vycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoUUxFcnJvcnM6IHJlc3VsdC5lcnJvcnMsXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yUG9saWN5ID09PSAnYWxsJykge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcnNGcm9tU3RvcmUgPSByZXN1bHQuZXJyb3JzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZmV0Y2hNb3JlRm9yUXVlcnlJZCB8fCBmZXRjaFBvbGljeSA9PT0gJ25vLWNhY2hlJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRGcm9tU3RvcmUgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfYSA9IF90aGlzLmRhdGFTdG9yZS5nZXRDYWNoZSgpLmRpZmYoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiB2YXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeTogZG9jdW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpbWlzdGljOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblBhcnRpYWxEYXRhOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KSwgcmVzdWx0XzEgPSBfYS5yZXN1bHQsIGNvbXBsZXRlID0gX2EuY29tcGxldGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZSB8fCBvcHRpb25zLnJldHVyblBhcnRpYWxEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRGcm9tU3RvcmUgPSByZXN1bHRfMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnN1YnNjcmliZSh7XG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVzdWx0RnJvbVN0b3JlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiBlcnJvcnNGcm9tU3RvcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldHdvcmtTdGF0dXM6IE5ldHdvcmtTdGF0dXMucmVhZHksXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF90aGlzLnNldFF1ZXJ5KHF1ZXJ5SWQsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHZhciBzdWJzY3JpcHRpb25zID0gX2Euc3Vic2NyaXB0aW9ucztcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChzdWJzY3JpcHRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5nZXRRdWVyeSA9IGZ1bmN0aW9uIChxdWVyeUlkKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5xdWVyaWVzLmdldChxdWVyeUlkKSB8fCB7XG4gICAgICAgICAgICBsaXN0ZW5lcnM6IG5ldyBTZXQoKSxcbiAgICAgICAgICAgIGludmFsaWRhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGRvY3VtZW50OiBudWxsLFxuICAgICAgICAgICAgbmV3RGF0YTogbnVsbCxcbiAgICAgICAgICAgIGxhc3RSZXF1ZXN0SWQ6IDEsXG4gICAgICAgICAgICBvYnNlcnZhYmxlUXVlcnk6IG51bGwsXG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zOiBuZXcgU2V0KCksXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5zZXRRdWVyeSA9IGZ1bmN0aW9uIChxdWVyeUlkLCB1cGRhdGVyKSB7XG4gICAgICAgIHZhciBwcmV2ID0gdGhpcy5nZXRRdWVyeShxdWVyeUlkKTtcbiAgICAgICAgdmFyIG5ld0luZm8gPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcHJldiksIHVwZGF0ZXIocHJldikpO1xuICAgICAgICB0aGlzLnF1ZXJpZXMuc2V0KHF1ZXJ5SWQsIG5ld0luZm8pO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5pbnZhbGlkYXRlID0gZnVuY3Rpb24gKHF1ZXJ5SWQsIGludmFsaWRhdGVkKSB7XG4gICAgICAgIGlmIChpbnZhbGlkYXRlZCA9PT0gdm9pZCAwKSB7IGludmFsaWRhdGVkID0gdHJ1ZTsgfVxuICAgICAgICBpZiAocXVlcnlJZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRRdWVyeShxdWVyeUlkLCBmdW5jdGlvbiAoKSB7IHJldHVybiAoeyBpbnZhbGlkYXRlZDogaW52YWxpZGF0ZWQgfSk7IH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBRdWVyeU1hbmFnZXIucHJvdG90eXBlLnByZXBhcmVDb250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICAgICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgeyBjb250ZXh0ID0ge307IH1cbiAgICAgICAgdmFyIG5ld0NvbnRleHQgPSB0aGlzLmxvY2FsU3RhdGUucHJlcGFyZUNvbnRleHQoY29udGV4dCk7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgbmV3Q29udGV4dCksIHsgY2xpZW50QXdhcmVuZXNzOiB0aGlzLmNsaWVudEF3YXJlbmVzcyB9KTtcbiAgICB9O1xuICAgIFF1ZXJ5TWFuYWdlci5wcm90b3R5cGUuY2hlY2tJbkZsaWdodCA9IGZ1bmN0aW9uIChxdWVyeUlkKSB7XG4gICAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcnlTdG9yZS5nZXQocXVlcnlJZCk7XG4gICAgICAgIHJldHVybiAocXVlcnkgJiZcbiAgICAgICAgICAgIHF1ZXJ5Lm5ldHdvcmtTdGF0dXMgIT09IE5ldHdvcmtTdGF0dXMucmVhZHkgJiZcbiAgICAgICAgICAgIHF1ZXJ5Lm5ldHdvcmtTdGF0dXMgIT09IE5ldHdvcmtTdGF0dXMuZXJyb3IpO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5zdGFydFBvbGxpbmdRdWVyeSA9IGZ1bmN0aW9uIChvcHRpb25zLCBxdWVyeUlkLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgcG9sbEludGVydmFsID0gb3B0aW9ucy5wb2xsSW50ZXJ2YWw7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChwb2xsSW50ZXJ2YWwsIDE4KSA6IGludmFyaWFudChwb2xsSW50ZXJ2YWwsICdBdHRlbXB0ZWQgdG8gc3RhcnQgYSBwb2xsaW5nIHF1ZXJ5IHdpdGhvdXQgYSBwb2xsaW5nIGludGVydmFsLicpO1xuICAgICAgICBpZiAoIXRoaXMuc3NyTW9kZSkge1xuICAgICAgICAgICAgdmFyIGluZm8gPSB0aGlzLnBvbGxpbmdJbmZvQnlRdWVyeUlkLmdldChxdWVyeUlkKTtcbiAgICAgICAgICAgIGlmICghaW5mbykge1xuICAgICAgICAgICAgICAgIHRoaXMucG9sbGluZ0luZm9CeVF1ZXJ5SWQuc2V0KHF1ZXJ5SWQsIChpbmZvID0ge30pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluZm8uaW50ZXJ2YWwgPSBwb2xsSW50ZXJ2YWw7XG4gICAgICAgICAgICBpbmZvLm9wdGlvbnMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHsgZmV0Y2hQb2xpY3k6ICduZXR3b3JrLW9ubHknIH0pO1xuICAgICAgICAgICAgdmFyIG1heWJlRmV0Y2hfMSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5mbyA9IF90aGlzLnBvbGxpbmdJbmZvQnlRdWVyeUlkLmdldChxdWVyeUlkKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3RoaXMuY2hlY2tJbkZsaWdodChxdWVyeUlkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9sbF8xKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5mZXRjaFF1ZXJ5KHF1ZXJ5SWQsIGluZm8ub3B0aW9ucywgRmV0Y2hUeXBlLnBvbGwpLnRoZW4ocG9sbF8xLCBwb2xsXzEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBwb2xsXzEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZm8gPSBfdGhpcy5wb2xsaW5nSW5mb0J5UXVlcnlJZC5nZXQocXVlcnlJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGluZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGluZm8udGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgIGluZm8udGltZW91dCA9IHNldFRpbWVvdXQobWF5YmVGZXRjaF8xLCBpbmZvLmludGVydmFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRRdWVyeUxpc3RlbmVyKHF1ZXJ5SWQsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvbGxfMSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBxdWVyeUlkO1xuICAgIH07XG4gICAgUXVlcnlNYW5hZ2VyLnByb3RvdHlwZS5zdG9wUG9sbGluZ1F1ZXJ5ID0gZnVuY3Rpb24gKHF1ZXJ5SWQpIHtcbiAgICAgICAgdGhpcy5wb2xsaW5nSW5mb0J5UXVlcnlJZC5kZWxldGUocXVlcnlJZCk7XG4gICAgfTtcbiAgICByZXR1cm4gUXVlcnlNYW5hZ2VyO1xufSgpKTtcblxudmFyIERhdGFTdG9yZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRGF0YVN0b3JlKGluaXRpYWxDYWNoZSkge1xuICAgICAgICB0aGlzLmNhY2hlID0gaW5pdGlhbENhY2hlO1xuICAgIH1cbiAgICBEYXRhU3RvcmUucHJvdG90eXBlLmdldENhY2hlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZTtcbiAgICB9O1xuICAgIERhdGFTdG9yZS5wcm90b3R5cGUubWFya1F1ZXJ5UmVzdWx0ID0gZnVuY3Rpb24gKHJlc3VsdCwgZG9jdW1lbnQsIHZhcmlhYmxlcywgZmV0Y2hNb3JlRm9yUXVlcnlJZCwgaWdub3JlRXJyb3JzKSB7XG4gICAgICAgIGlmIChpZ25vcmVFcnJvcnMgPT09IHZvaWQgMCkgeyBpZ25vcmVFcnJvcnMgPSBmYWxzZTsgfVxuICAgICAgICB2YXIgd3JpdGVXaXRoRXJyb3JzID0gIWdyYXBoUUxSZXN1bHRIYXNFcnJvcihyZXN1bHQpO1xuICAgICAgICBpZiAoaWdub3JlRXJyb3JzICYmIGdyYXBoUUxSZXN1bHRIYXNFcnJvcihyZXN1bHQpICYmIHJlc3VsdC5kYXRhKSB7XG4gICAgICAgICAgICB3cml0ZVdpdGhFcnJvcnMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZmV0Y2hNb3JlRm9yUXVlcnlJZCAmJiB3cml0ZVdpdGhFcnJvcnMpIHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGUud3JpdGUoe1xuICAgICAgICAgICAgICAgIHJlc3VsdDogcmVzdWx0LmRhdGEsXG4gICAgICAgICAgICAgICAgZGF0YUlkOiAnUk9PVF9RVUVSWScsXG4gICAgICAgICAgICAgICAgcXVlcnk6IGRvY3VtZW50LFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlczogdmFyaWFibGVzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIERhdGFTdG9yZS5wcm90b3R5cGUubWFya1N1YnNjcmlwdGlvblJlc3VsdCA9IGZ1bmN0aW9uIChyZXN1bHQsIGRvY3VtZW50LCB2YXJpYWJsZXMpIHtcbiAgICAgICAgaWYgKCFncmFwaFFMUmVzdWx0SGFzRXJyb3IocmVzdWx0KSkge1xuICAgICAgICAgICAgdGhpcy5jYWNoZS53cml0ZSh7XG4gICAgICAgICAgICAgICAgcmVzdWx0OiByZXN1bHQuZGF0YSxcbiAgICAgICAgICAgICAgICBkYXRhSWQ6ICdST09UX1NVQlNDUklQVElPTicsXG4gICAgICAgICAgICAgICAgcXVlcnk6IGRvY3VtZW50LFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlczogdmFyaWFibGVzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIERhdGFTdG9yZS5wcm90b3R5cGUubWFya011dGF0aW9uSW5pdCA9IGZ1bmN0aW9uIChtdXRhdGlvbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAobXV0YXRpb24ub3B0aW1pc3RpY1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW1pc3RpY18xO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBtdXRhdGlvbi5vcHRpbWlzdGljUmVzcG9uc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBvcHRpbWlzdGljXzEgPSBtdXRhdGlvbi5vcHRpbWlzdGljUmVzcG9uc2UobXV0YXRpb24udmFyaWFibGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wdGltaXN0aWNfMSA9IG11dGF0aW9uLm9wdGltaXN0aWNSZXNwb25zZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FjaGUucmVjb3JkT3B0aW1pc3RpY1RyYW5zYWN0aW9uKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9yaWcgPSBfdGhpcy5jYWNoZTtcbiAgICAgICAgICAgICAgICBfdGhpcy5jYWNoZSA9IGM7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubWFya011dGF0aW9uUmVzdWx0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG11dGF0aW9uSWQ6IG11dGF0aW9uLm11dGF0aW9uSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHsgZGF0YTogb3B0aW1pc3RpY18xIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudDogbXV0YXRpb24uZG9jdW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZXM6IG11dGF0aW9uLnZhcmlhYmxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVF1ZXJpZXM6IG11dGF0aW9uLnVwZGF0ZVF1ZXJpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGU6IG11dGF0aW9uLnVwZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jYWNoZSA9IG9yaWc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgbXV0YXRpb24ubXV0YXRpb25JZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIERhdGFTdG9yZS5wcm90b3R5cGUubWFya011dGF0aW9uUmVzdWx0ID0gZnVuY3Rpb24gKG11dGF0aW9uKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghZ3JhcGhRTFJlc3VsdEhhc0Vycm9yKG11dGF0aW9uLnJlc3VsdCkpIHtcbiAgICAgICAgICAgIHZhciBjYWNoZVdyaXRlc18xID0gW3tcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBtdXRhdGlvbi5yZXN1bHQuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YUlkOiAnUk9PVF9NVVRBVElPTicsXG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBtdXRhdGlvbi5kb2N1bWVudCxcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiBtdXRhdGlvbi52YXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgfV07XG4gICAgICAgICAgICB2YXIgdXBkYXRlUXVlcmllc18xID0gbXV0YXRpb24udXBkYXRlUXVlcmllcztcbiAgICAgICAgICAgIGlmICh1cGRhdGVRdWVyaWVzXzEpIHtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh1cGRhdGVRdWVyaWVzXzEpLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfYSA9IHVwZGF0ZVF1ZXJpZXNfMVtpZF0sIHF1ZXJ5ID0gX2EucXVlcnksIHVwZGF0ZXIgPSBfYS51cGRhdGVyO1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2IgPSBfdGhpcy5jYWNoZS5kaWZmKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBxdWVyeS5kb2N1bWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlczogcXVlcnkudmFyaWFibGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuUGFydGlhbERhdGE6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpbWlzdGljOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgfSksIGN1cnJlbnRRdWVyeVJlc3VsdCA9IF9iLnJlc3VsdCwgY29tcGxldGUgPSBfYi5jb21wbGV0ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dFF1ZXJ5UmVzdWx0ID0gdHJ5RnVuY3Rpb25PckxvZ0Vycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlcihjdXJyZW50UXVlcnlSZXN1bHQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXV0YXRpb25SZXN1bHQ6IG11dGF0aW9uLnJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnlOYW1lOiBnZXRPcGVyYXRpb25OYW1lKHF1ZXJ5LmRvY3VtZW50KSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5VmFyaWFibGVzOiBxdWVyeS52YXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0UXVlcnlSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZVdyaXRlc18xLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IG5leHRRdWVyeVJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUlkOiAnUk9PVF9RVUVSWScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBxdWVyeS5kb2N1bWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiBxdWVyeS52YXJpYWJsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FjaGUucGVyZm9ybVRyYW5zYWN0aW9uKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgY2FjaGVXcml0ZXNfMS5mb3JFYWNoKGZ1bmN0aW9uICh3cml0ZSkgeyByZXR1cm4gYy53cml0ZSh3cml0ZSk7IH0pO1xuICAgICAgICAgICAgICAgIHZhciB1cGRhdGUgPSBtdXRhdGlvbi51cGRhdGU7XG4gICAgICAgICAgICAgICAgaWYgKHVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnlGdW5jdGlvbk9yTG9nRXJyb3IoZnVuY3Rpb24gKCkgeyByZXR1cm4gdXBkYXRlKGMsIG11dGF0aW9uLnJlc3VsdCk7IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBEYXRhU3RvcmUucHJvdG90eXBlLm1hcmtNdXRhdGlvbkNvbXBsZXRlID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBtdXRhdGlvbklkID0gX2EubXV0YXRpb25JZCwgb3B0aW1pc3RpY1Jlc3BvbnNlID0gX2Eub3B0aW1pc3RpY1Jlc3BvbnNlO1xuICAgICAgICBpZiAob3B0aW1pc3RpY1Jlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlLnJlbW92ZU9wdGltaXN0aWMobXV0YXRpb25JZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIERhdGFTdG9yZS5wcm90b3R5cGUubWFya1VwZGF0ZVF1ZXJ5UmVzdWx0ID0gZnVuY3Rpb24gKGRvY3VtZW50LCB2YXJpYWJsZXMsIG5ld1Jlc3VsdCkge1xuICAgICAgICB0aGlzLmNhY2hlLndyaXRlKHtcbiAgICAgICAgICAgIHJlc3VsdDogbmV3UmVzdWx0LFxuICAgICAgICAgICAgZGF0YUlkOiAnUk9PVF9RVUVSWScsXG4gICAgICAgICAgICB2YXJpYWJsZXM6IHZhcmlhYmxlcyxcbiAgICAgICAgICAgIHF1ZXJ5OiBkb2N1bWVudCxcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBEYXRhU3RvcmUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS5yZXNldCgpO1xuICAgIH07XG4gICAgcmV0dXJuIERhdGFTdG9yZTtcbn0oKSk7XG5cbnZhciB2ZXJzaW9uID0gXCIyLjYuMTBcIjtcblxudmFyIGhhc1N1Z2dlc3RlZERldnRvb2xzID0gZmFsc2U7XG52YXIgQXBvbGxvQ2xpZW50ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBcG9sbG9DbGllbnQob3B0aW9ucykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmRlZmF1bHRPcHRpb25zID0ge307XG4gICAgICAgIHRoaXMucmVzZXRTdG9yZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLmNsZWFyU3RvcmVDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdmFyIGNhY2hlID0gb3B0aW9ucy5jYWNoZSwgX2EgPSBvcHRpb25zLnNzck1vZGUsIHNzck1vZGUgPSBfYSA9PT0gdm9pZCAwID8gZmFsc2UgOiBfYSwgX2IgPSBvcHRpb25zLnNzckZvcmNlRmV0Y2hEZWxheSwgc3NyRm9yY2VGZXRjaERlbGF5ID0gX2IgPT09IHZvaWQgMCA/IDAgOiBfYiwgY29ubmVjdFRvRGV2VG9vbHMgPSBvcHRpb25zLmNvbm5lY3RUb0RldlRvb2xzLCBfYyA9IG9wdGlvbnMucXVlcnlEZWR1cGxpY2F0aW9uLCBxdWVyeURlZHVwbGljYXRpb24gPSBfYyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9jLCBkZWZhdWx0T3B0aW9ucyA9IG9wdGlvbnMuZGVmYXVsdE9wdGlvbnMsIF9kID0gb3B0aW9ucy5hc3N1bWVJbW11dGFibGVSZXN1bHRzLCBhc3N1bWVJbW11dGFibGVSZXN1bHRzID0gX2QgPT09IHZvaWQgMCA/IGZhbHNlIDogX2QsIHJlc29sdmVycyA9IG9wdGlvbnMucmVzb2x2ZXJzLCB0eXBlRGVmcyA9IG9wdGlvbnMudHlwZURlZnMsIGZyYWdtZW50TWF0Y2hlciA9IG9wdGlvbnMuZnJhZ21lbnRNYXRjaGVyLCBjbGllbnRBd2FyZW5lc3NOYW1lID0gb3B0aW9ucy5uYW1lLCBjbGllbnRBd2FyZW5lc3NWZXJzaW9uID0gb3B0aW9ucy52ZXJzaW9uO1xuICAgICAgICB2YXIgbGluayA9IG9wdGlvbnMubGluaztcbiAgICAgICAgaWYgKCFsaW5rICYmIHJlc29sdmVycykge1xuICAgICAgICAgICAgbGluayA9IEFwb2xsb0xpbmsuZW1wdHkoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWxpbmsgfHwgIWNhY2hlKSB7XG4gICAgICAgICAgICB0aHJvdyBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBuZXcgSW52YXJpYW50RXJyb3IoNCkgOiBuZXcgSW52YXJpYW50RXJyb3IoXCJJbiBvcmRlciB0byBpbml0aWFsaXplIEFwb2xsbyBDbGllbnQsIHlvdSBtdXN0IHNwZWNpZnkgJ2xpbmsnIGFuZCAnY2FjaGUnIHByb3BlcnRpZXMgaW4gdGhlIG9wdGlvbnMgb2JqZWN0LlxcblwiICtcbiAgICAgICAgICAgICAgICBcIlRoZXNlIG9wdGlvbnMgYXJlIHBhcnQgb2YgdGhlIHVwZ3JhZGUgcmVxdWlyZW1lbnRzIHdoZW4gbWlncmF0aW5nIGZyb20gQXBvbGxvIENsaWVudCAxLnggdG8gQXBvbGxvIENsaWVudCAyLnguXFxuXCIgK1xuICAgICAgICAgICAgICAgIFwiRm9yIG1vcmUgaW5mb3JtYXRpb24sIHBsZWFzZSB2aXNpdDogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vZG9jcy90dXRvcmlhbC9jbGllbnQuaHRtbCNhcG9sbG8tY2xpZW50LXNldHVwXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGluayA9IGxpbms7XG4gICAgICAgIHRoaXMuY2FjaGUgPSBjYWNoZTtcbiAgICAgICAgdGhpcy5zdG9yZSA9IG5ldyBEYXRhU3RvcmUoY2FjaGUpO1xuICAgICAgICB0aGlzLmRpc2FibGVOZXR3b3JrRmV0Y2hlcyA9IHNzck1vZGUgfHwgc3NyRm9yY2VGZXRjaERlbGF5ID4gMDtcbiAgICAgICAgdGhpcy5xdWVyeURlZHVwbGljYXRpb24gPSBxdWVyeURlZHVwbGljYXRpb247XG4gICAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucyB8fCB7fTtcbiAgICAgICAgdGhpcy50eXBlRGVmcyA9IHR5cGVEZWZzO1xuICAgICAgICBpZiAoc3NyRm9yY2VGZXRjaERlbGF5KSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIChfdGhpcy5kaXNhYmxlTmV0d29ya0ZldGNoZXMgPSBmYWxzZSk7IH0sIHNzckZvcmNlRmV0Y2hEZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53YXRjaFF1ZXJ5ID0gdGhpcy53YXRjaFF1ZXJ5LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucXVlcnkgPSB0aGlzLnF1ZXJ5LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubXV0YXRlID0gdGhpcy5tdXRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5yZXNldFN0b3JlID0gdGhpcy5yZXNldFN0b3JlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucmVGZXRjaE9ic2VydmFibGVRdWVyaWVzID0gdGhpcy5yZUZldGNoT2JzZXJ2YWJsZVF1ZXJpZXMuYmluZCh0aGlzKTtcbiAgICAgICAgdmFyIGRlZmF1bHRDb25uZWN0VG9EZXZUb29scyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiZcbiAgICAgICAgICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAhd2luZG93Ll9fQVBPTExPX0NMSUVOVF9fO1xuICAgICAgICBpZiAodHlwZW9mIGNvbm5lY3RUb0RldlRvb2xzID09PSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAgPyBkZWZhdWx0Q29ubmVjdFRvRGV2VG9vbHNcbiAgICAgICAgICAgIDogY29ubmVjdFRvRGV2VG9vbHMgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHdpbmRvdy5fX0FQT0xMT19DTElFTlRfXyA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoYXNTdWdnZXN0ZWREZXZ0b29scyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBoYXNTdWdnZXN0ZWREZXZ0b29scyA9IHRydWU7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQgJiZcbiAgICAgICAgICAgICAgICB3aW5kb3cudG9wID09PSB3aW5kb3cuc2VsZikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93Ll9fQVBPTExPX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnRG93bmxvYWQgdGhlIEFwb2xsbyBEZXZUb29scyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZm9yIGEgYmV0dGVyIGRldmVsb3BtZW50IGV4cGVyaWVuY2U6ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdodHRwczovL2Nocm9tZS5nb29nbGUuY29tL3dlYnN0b3JlL2RldGFpbC9hcG9sbG8tY2xpZW50LWRldmVsb3Blci10L2pka2tua2tiZWJiYXBpbGdvZWNjY2lnbGtmYm1ibmZtJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgdGhpcy5sb2NhbFN0YXRlID0gbmV3IExvY2FsU3RhdGUoe1xuICAgICAgICAgICAgY2FjaGU6IGNhY2hlLFxuICAgICAgICAgICAgY2xpZW50OiB0aGlzLFxuICAgICAgICAgICAgcmVzb2x2ZXJzOiByZXNvbHZlcnMsXG4gICAgICAgICAgICBmcmFnbWVudE1hdGNoZXI6IGZyYWdtZW50TWF0Y2hlcixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucXVlcnlNYW5hZ2VyID0gbmV3IFF1ZXJ5TWFuYWdlcih7XG4gICAgICAgICAgICBsaW5rOiB0aGlzLmxpbmssXG4gICAgICAgICAgICBzdG9yZTogdGhpcy5zdG9yZSxcbiAgICAgICAgICAgIHF1ZXJ5RGVkdXBsaWNhdGlvbjogcXVlcnlEZWR1cGxpY2F0aW9uLFxuICAgICAgICAgICAgc3NyTW9kZTogc3NyTW9kZSxcbiAgICAgICAgICAgIGNsaWVudEF3YXJlbmVzczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IGNsaWVudEF3YXJlbmVzc05hbWUsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogY2xpZW50QXdhcmVuZXNzVmVyc2lvbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2NhbFN0YXRlOiB0aGlzLmxvY2FsU3RhdGUsXG4gICAgICAgICAgICBhc3N1bWVJbW11dGFibGVSZXN1bHRzOiBhc3N1bWVJbW11dGFibGVSZXN1bHRzLFxuICAgICAgICAgICAgb25Ccm9hZGNhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuZGV2VG9vbHNIb29rQ2IpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGV2VG9vbHNIb29rQ2Ioe1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcmllczogX3RoaXMucXVlcnlNYW5hZ2VyLnF1ZXJ5U3RvcmUuZ2V0U3RvcmUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdXRhdGlvbnM6IF90aGlzLnF1ZXJ5TWFuYWdlci5tdXRhdGlvblN0b3JlLmdldFN0b3JlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVdpdGhPcHRpbWlzdGljUmVzdWx0czogX3RoaXMuY2FjaGUuZXh0cmFjdCh0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIEFwb2xsb0NsaWVudC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5xdWVyeU1hbmFnZXIuc3RvcCgpO1xuICAgIH07XG4gICAgQXBvbGxvQ2xpZW50LnByb3RvdHlwZS53YXRjaFF1ZXJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVmYXVsdE9wdGlvbnMud2F0Y2hRdWVyeSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRPcHRpb25zLndhdGNoUXVlcnkpLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlTmV0d29ya0ZldGNoZXMgJiZcbiAgICAgICAgICAgIChvcHRpb25zLmZldGNoUG9saWN5ID09PSAnbmV0d29yay1vbmx5JyB8fFxuICAgICAgICAgICAgICAgIG9wdGlvbnMuZmV0Y2hQb2xpY3kgPT09ICdjYWNoZS1hbmQtbmV0d29yaycpKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7IGZldGNoUG9saWN5OiAnY2FjaGUtZmlyc3QnIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXJ5TWFuYWdlci53YXRjaFF1ZXJ5KG9wdGlvbnMpO1xuICAgIH07XG4gICAgQXBvbGxvQ2xpZW50LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIGlmICh0aGlzLmRlZmF1bHRPcHRpb25zLnF1ZXJ5KSB7XG4gICAgICAgICAgICBvcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMucXVlcnkpLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQob3B0aW9ucy5mZXRjaFBvbGljeSAhPT0gJ2NhY2hlLWFuZC1uZXR3b3JrJywgNSkgOiBpbnZhcmlhbnQob3B0aW9ucy5mZXRjaFBvbGljeSAhPT0gJ2NhY2hlLWFuZC1uZXR3b3JrJywgJ1RoZSBjYWNoZS1hbmQtbmV0d29yayBmZXRjaFBvbGljeSBkb2VzIG5vdCB3b3JrIHdpdGggY2xpZW50LnF1ZXJ5LCBiZWNhdXNlICcgK1xuICAgICAgICAgICAgJ2NsaWVudC5xdWVyeSBjYW4gb25seSByZXR1cm4gYSBzaW5nbGUgcmVzdWx0LiBQbGVhc2UgdXNlIGNsaWVudC53YXRjaFF1ZXJ5ICcgK1xuICAgICAgICAgICAgJ3RvIHJlY2VpdmUgbXVsdGlwbGUgcmVzdWx0cyBmcm9tIHRoZSBjYWNoZSBhbmQgdGhlIG5ldHdvcmssIG9yIGNvbnNpZGVyICcgK1xuICAgICAgICAgICAgJ3VzaW5nIGEgZGlmZmVyZW50IGZldGNoUG9saWN5LCBzdWNoIGFzIGNhY2hlLWZpcnN0IG9yIG5ldHdvcmstb25seS4nKTtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZU5ldHdvcmtGZXRjaGVzICYmIG9wdGlvbnMuZmV0Y2hQb2xpY3kgPT09ICduZXR3b3JrLW9ubHknKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7IGZldGNoUG9saWN5OiAnY2FjaGUtZmlyc3QnIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXJ5TWFuYWdlci5xdWVyeShvcHRpb25zKTtcbiAgICB9O1xuICAgIEFwb2xsb0NsaWVudC5wcm90b3R5cGUubXV0YXRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVmYXVsdE9wdGlvbnMubXV0YXRlKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMubXV0YXRlKSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucXVlcnlNYW5hZ2VyLm11dGF0ZShvcHRpb25zKTtcbiAgICB9O1xuICAgIEFwb2xsb0NsaWVudC5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVlcnlNYW5hZ2VyLnN0YXJ0R3JhcGhRTFN1YnNjcmlwdGlvbihvcHRpb25zKTtcbiAgICB9O1xuICAgIEFwb2xsb0NsaWVudC5wcm90b3R5cGUucmVhZFF1ZXJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMsIG9wdGltaXN0aWMpIHtcbiAgICAgICAgaWYgKG9wdGltaXN0aWMgPT09IHZvaWQgMCkgeyBvcHRpbWlzdGljID0gZmFsc2U7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUucmVhZFF1ZXJ5KG9wdGlvbnMsIG9wdGltaXN0aWMpO1xuICAgIH07XG4gICAgQXBvbGxvQ2xpZW50LnByb3RvdHlwZS5yZWFkRnJhZ21lbnQgPSBmdW5jdGlvbiAob3B0aW9ucywgb3B0aW1pc3RpYykge1xuICAgICAgICBpZiAob3B0aW1pc3RpYyA9PT0gdm9pZCAwKSB7IG9wdGltaXN0aWMgPSBmYWxzZTsgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS5yZWFkRnJhZ21lbnQob3B0aW9ucywgb3B0aW1pc3RpYyk7XG4gICAgfTtcbiAgICBBcG9sbG9DbGllbnQucHJvdG90eXBlLndyaXRlUXVlcnkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5jYWNoZS53cml0ZVF1ZXJ5KG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnF1ZXJ5TWFuYWdlci5icm9hZGNhc3RRdWVyaWVzKCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBBcG9sbG9DbGllbnQucHJvdG90eXBlLndyaXRlRnJhZ21lbnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5jYWNoZS53cml0ZUZyYWdtZW50KG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnF1ZXJ5TWFuYWdlci5icm9hZGNhc3RRdWVyaWVzKCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgICBBcG9sbG9DbGllbnQucHJvdG90eXBlLndyaXRlRGF0YSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmNhY2hlLndyaXRlRGF0YShvcHRpb25zKTtcbiAgICAgICAgdGhpcy5xdWVyeU1hbmFnZXIuYnJvYWRjYXN0UXVlcmllcygpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgQXBvbGxvQ2xpZW50LnByb3RvdHlwZS5fX2FjdGlvbkhvb2tGb3JEZXZUb29scyA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB0aGlzLmRldlRvb2xzSG9va0NiID0gY2I7XG4gICAgfTtcbiAgICBBcG9sbG9DbGllbnQucHJvdG90eXBlLl9fcmVxdWVzdFJhdyA9IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgIHJldHVybiBleGVjdXRlKHRoaXMubGluaywgcGF5bG9hZCk7XG4gICAgfTtcbiAgICBBcG9sbG9DbGllbnQucHJvdG90eXBlLmluaXRRdWVyeU1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiB8fCBpbnZhcmlhbnQud2FybignQ2FsbGluZyB0aGUgaW5pdFF1ZXJ5TWFuYWdlciBtZXRob2QgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSwgJyArXG4gICAgICAgICAgICAnYW5kIGl0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIEFwb2xsb0NsaWVudCBpbiB2ZXJzaW9uIDMuMC4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVlcnlNYW5hZ2VyO1xuICAgIH07XG4gICAgQXBvbGxvQ2xpZW50LnByb3RvdHlwZS5yZXNldFN0b3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnF1ZXJ5TWFuYWdlci5jbGVhclN0b3JlKCk7IH0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiBQcm9taXNlLmFsbChfdGhpcy5yZXNldFN0b3JlQ2FsbGJhY2tzLm1hcChmdW5jdGlvbiAoZm4pIHsgcmV0dXJuIGZuKCk7IH0pKTsgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnJlRmV0Y2hPYnNlcnZhYmxlUXVlcmllcygpOyB9KTtcbiAgICB9O1xuICAgIEFwb2xsb0NsaWVudC5wcm90b3R5cGUuY2xlYXJTdG9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5xdWVyeU1hbmFnZXIuY2xlYXJTdG9yZSgpOyB9KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkgeyByZXR1cm4gUHJvbWlzZS5hbGwoX3RoaXMuY2xlYXJTdG9yZUNhbGxiYWNrcy5tYXAoZnVuY3Rpb24gKGZuKSB7IHJldHVybiBmbigpOyB9KSk7IH0pO1xuICAgIH07XG4gICAgQXBvbGxvQ2xpZW50LnByb3RvdHlwZS5vblJlc2V0U3RvcmUgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5yZXNldFN0b3JlQ2FsbGJhY2tzLnB1c2goY2IpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMucmVzZXRTdG9yZUNhbGxiYWNrcyA9IF90aGlzLnJlc2V0U3RvcmVDYWxsYmFja3MuZmlsdGVyKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjICE9PSBjYjsgfSk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBBcG9sbG9DbGllbnQucHJvdG90eXBlLm9uQ2xlYXJTdG9yZSA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNsZWFyU3RvcmVDYWxsYmFja3MucHVzaChjYik7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5jbGVhclN0b3JlQ2FsbGJhY2tzID0gX3RoaXMuY2xlYXJTdG9yZUNhbGxiYWNrcy5maWx0ZXIoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMgIT09IGNiOyB9KTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIEFwb2xsb0NsaWVudC5wcm90b3R5cGUucmVGZXRjaE9ic2VydmFibGVRdWVyaWVzID0gZnVuY3Rpb24gKGluY2x1ZGVTdGFuZGJ5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXJ5TWFuYWdlci5yZUZldGNoT2JzZXJ2YWJsZVF1ZXJpZXMoaW5jbHVkZVN0YW5kYnkpO1xuICAgIH07XG4gICAgQXBvbGxvQ2xpZW50LnByb3RvdHlwZS5leHRyYWN0ID0gZnVuY3Rpb24gKG9wdGltaXN0aWMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuZXh0cmFjdChvcHRpbWlzdGljKTtcbiAgICB9O1xuICAgIEFwb2xsb0NsaWVudC5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uIChzZXJpYWxpemVkU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUucmVzdG9yZShzZXJpYWxpemVkU3RhdGUpO1xuICAgIH07XG4gICAgQXBvbGxvQ2xpZW50LnByb3RvdHlwZS5hZGRSZXNvbHZlcnMgPSBmdW5jdGlvbiAocmVzb2x2ZXJzKSB7XG4gICAgICAgIHRoaXMubG9jYWxTdGF0ZS5hZGRSZXNvbHZlcnMocmVzb2x2ZXJzKTtcbiAgICB9O1xuICAgIEFwb2xsb0NsaWVudC5wcm90b3R5cGUuc2V0UmVzb2x2ZXJzID0gZnVuY3Rpb24gKHJlc29sdmVycykge1xuICAgICAgICB0aGlzLmxvY2FsU3RhdGUuc2V0UmVzb2x2ZXJzKHJlc29sdmVycyk7XG4gICAgfTtcbiAgICBBcG9sbG9DbGllbnQucHJvdG90eXBlLmdldFJlc29sdmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxTdGF0ZS5nZXRSZXNvbHZlcnMoKTtcbiAgICB9O1xuICAgIEFwb2xsb0NsaWVudC5wcm90b3R5cGUuc2V0TG9jYWxTdGF0ZUZyYWdtZW50TWF0Y2hlciA9IGZ1bmN0aW9uIChmcmFnbWVudE1hdGNoZXIpIHtcbiAgICAgICAgdGhpcy5sb2NhbFN0YXRlLnNldEZyYWdtZW50TWF0Y2hlcihmcmFnbWVudE1hdGNoZXIpO1xuICAgIH07XG4gICAgcmV0dXJuIEFwb2xsb0NsaWVudDtcbn0oKSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFwb2xsb0NsaWVudDtcbmV4cG9ydCB7IEFwb2xsb0NsaWVudCwgQXBvbGxvRXJyb3IsIEZldGNoVHlwZSwgTmV0d29ya1N0YXR1cywgT2JzZXJ2YWJsZVF1ZXJ5LCBpc0Fwb2xsb0Vycm9yIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idW5kbGUuZXNtLmpzLm1hcFxuIiwiaW1wb3J0IHsgX19leHRlbmRzIH0gZnJvbSAndHNsaWInO1xuaW1wb3J0IHsgQXBvbGxvTGluaywgT2JzZXJ2YWJsZSB9IGZyb20gJ2Fwb2xsby1saW5rJztcblxuZnVuY3Rpb24gb25FcnJvcihlcnJvckhhbmRsZXIpIHtcbiAgICByZXR1cm4gbmV3IEFwb2xsb0xpbmsoZnVuY3Rpb24gKG9wZXJhdGlvbiwgZm9yd2FyZCkge1xuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgICAgICB2YXIgc3ViO1xuICAgICAgICAgICAgdmFyIHJldHJpZWRTdWI7XG4gICAgICAgICAgICB2YXIgcmV0cmllZFJlc3VsdDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3ViID0gZm9yd2FyZChvcGVyYXRpb24pLnN1YnNjcmliZSh7XG4gICAgICAgICAgICAgICAgICAgIG5leHQ6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0cmllZFJlc3VsdCA9IGVycm9ySGFuZGxlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoUUxFcnJvcnM6IHJlc3VsdC5lcnJvcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3J3YXJkOiBmb3J3YXJkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXRyaWVkUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHJpZWRTdWIgPSByZXRyaWVkUmVzdWx0LnN1YnNjcmliZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0OiBvYnNlcnZlci5uZXh0LmJpbmQob2JzZXJ2ZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG9ic2VydmVyLmVycm9yLmJpbmQob2JzZXJ2ZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IG9ic2VydmVyLmNvbXBsZXRlLmJpbmQob2JzZXJ2ZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChuZXR3b3JrRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHJpZWRSZXN1bHQgPSBlcnJvckhhbmRsZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldHdvcmtFcnJvcjogbmV0d29ya0Vycm9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoUUxFcnJvcnM6IG5ldHdvcmtFcnJvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXR3b3JrRXJyb3IucmVzdWx0ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldHdvcmtFcnJvci5yZXN1bHQuZXJyb3JzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcndhcmQ6IGZvcndhcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXRyaWVkUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0cmllZFN1YiA9IHJldHJpZWRSZXN1bHQuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dDogb2JzZXJ2ZXIubmV4dC5iaW5kKG9ic2VydmVyKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IG9ic2VydmVyLmVycm9yLmJpbmQob2JzZXJ2ZXIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogb2JzZXJ2ZXIuY29tcGxldGUuYmluZChvYnNlcnZlciksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IobmV0d29ya0Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmV0cmllZFJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlLmJpbmQob2JzZXJ2ZXIpKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGVycm9ySGFuZGxlcih7IG5ldHdvcmtFcnJvcjogZSwgb3BlcmF0aW9uOiBvcGVyYXRpb24sIGZvcndhcmQ6IGZvcndhcmQgfSk7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzdWIpXG4gICAgICAgICAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIGlmIChyZXRyaWVkU3ViKVxuICAgICAgICAgICAgICAgICAgICBzdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxudmFyIEVycm9yTGluayA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEVycm9yTGluaywgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFcnJvckxpbmsoZXJyb3JIYW5kbGVyKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmxpbmsgPSBvbkVycm9yKGVycm9ySGFuZGxlcik7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgRXJyb3JMaW5rLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gKG9wZXJhdGlvbiwgZm9yd2FyZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saW5rLnJlcXVlc3Qob3BlcmF0aW9uLCBmb3J3YXJkKTtcbiAgICB9O1xuICAgIHJldHVybiBFcnJvckxpbms7XG59KEFwb2xsb0xpbmspKTtcblxuZXhwb3J0IHsgRXJyb3JMaW5rLCBvbkVycm9yIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idW5kbGUuZXNtLmpzLm1hcFxuIiwiaW1wb3J0IHsgX19hc3NpZ24gfSBmcm9tICd0c2xpYic7XG5pbXBvcnQgeyBwcmludCB9IGZyb20gJ2dyYXBocWwvbGFuZ3VhZ2UvcHJpbnRlcic7XG5pbXBvcnQgeyBJbnZhcmlhbnRFcnJvciB9IGZyb20gJ3RzLWludmFyaWFudCc7XG5cbnZhciBkZWZhdWx0SHR0cE9wdGlvbnMgPSB7XG4gICAgaW5jbHVkZVF1ZXJ5OiB0cnVlLFxuICAgIGluY2x1ZGVFeHRlbnNpb25zOiBmYWxzZSxcbn07XG52YXIgZGVmYXVsdEhlYWRlcnMgPSB7XG4gICAgYWNjZXB0OiAnKi8qJyxcbiAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxufTtcbnZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbn07XG52YXIgZmFsbGJhY2tIdHRwQ29uZmlnID0ge1xuICAgIGh0dHA6IGRlZmF1bHRIdHRwT3B0aW9ucyxcbiAgICBoZWFkZXJzOiBkZWZhdWx0SGVhZGVycyxcbiAgICBvcHRpb25zOiBkZWZhdWx0T3B0aW9ucyxcbn07XG52YXIgdGhyb3dTZXJ2ZXJFcnJvciA9IGZ1bmN0aW9uIChyZXNwb25zZSwgcmVzdWx0LCBtZXNzYWdlKSB7XG4gICAgdmFyIGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIGVycm9yLm5hbWUgPSAnU2VydmVyRXJyb3InO1xuICAgIGVycm9yLnJlc3BvbnNlID0gcmVzcG9uc2U7XG4gICAgZXJyb3Iuc3RhdHVzQ29kZSA9IHJlc3BvbnNlLnN0YXR1cztcbiAgICBlcnJvci5yZXN1bHQgPSByZXN1bHQ7XG4gICAgdGhyb3cgZXJyb3I7XG59O1xudmFyIHBhcnNlQW5kQ2hlY2tIdHRwUmVzcG9uc2UgPSBmdW5jdGlvbiAob3BlcmF0aW9ucykgeyByZXR1cm4gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgcmV0dXJuIChyZXNwb25zZVxuICAgICAgICAudGV4dCgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChib2R5VGV4dCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYm9keVRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHZhciBwYXJzZUVycm9yID0gZXJyO1xuICAgICAgICAgICAgcGFyc2VFcnJvci5uYW1lID0gJ1NlcnZlclBhcnNlRXJyb3InO1xuICAgICAgICAgICAgcGFyc2VFcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgcGFyc2VFcnJvci5zdGF0dXNDb2RlID0gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgICAgICAgcGFyc2VFcnJvci5ib2R5VGV4dCA9IGJvZHlUZXh0O1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHBhcnNlRXJyb3IpO1xuICAgICAgICB9XG4gICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDMwMCkge1xuICAgICAgICAgICAgdGhyb3dTZXJ2ZXJFcnJvcihyZXNwb25zZSwgcmVzdWx0LCBcIlJlc3BvbnNlIG5vdCBzdWNjZXNzZnVsOiBSZWNlaXZlZCBzdGF0dXMgY29kZSBcIiArIHJlc3BvbnNlLnN0YXR1cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJlc3VsdCkgJiZcbiAgICAgICAgICAgICFyZXN1bHQuaGFzT3duUHJvcGVydHkoJ2RhdGEnKSAmJlxuICAgICAgICAgICAgIXJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnZXJyb3JzJykpIHtcbiAgICAgICAgICAgIHRocm93U2VydmVyRXJyb3IocmVzcG9uc2UsIHJlc3VsdCwgXCJTZXJ2ZXIgcmVzcG9uc2Ugd2FzIG1pc3NpbmcgZm9yIHF1ZXJ5ICdcIiArIChBcnJheS5pc0FycmF5KG9wZXJhdGlvbnMpXG4gICAgICAgICAgICAgICAgPyBvcGVyYXRpb25zLm1hcChmdW5jdGlvbiAob3ApIHsgcmV0dXJuIG9wLm9wZXJhdGlvbk5hbWU7IH0pXG4gICAgICAgICAgICAgICAgOiBvcGVyYXRpb25zLm9wZXJhdGlvbk5hbWUpICsgXCInLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pKTtcbn07IH07XG52YXIgY2hlY2tGZXRjaGVyID0gZnVuY3Rpb24gKGZldGNoZXIpIHtcbiAgICBpZiAoIWZldGNoZXIgJiYgdHlwZW9mIGZldGNoID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgbGlicmFyeSA9ICd1bmZldGNoJztcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgbGlicmFyeSA9ICdub2RlLWZldGNoJztcbiAgICAgICAgdGhyb3cgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gbmV3IEludmFyaWFudEVycm9yKDEpIDogbmV3IEludmFyaWFudEVycm9yKFwiXFxuZmV0Y2ggaXMgbm90IGZvdW5kIGdsb2JhbGx5IGFuZCBubyBmZXRjaGVyIHBhc3NlZCwgdG8gZml4IHBhc3MgYSBmZXRjaCBmb3JcXG55b3VyIGVudmlyb25tZW50IGxpa2UgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvXCIgKyBsaWJyYXJ5ICsgXCIuXFxuXFxuRm9yIGV4YW1wbGU6XFxuaW1wb3J0IGZldGNoIGZyb20gJ1wiICsgbGlicmFyeSArIFwiJztcXG5pbXBvcnQgeyBjcmVhdGVIdHRwTGluayB9IGZyb20gJ2Fwb2xsby1saW5rLWh0dHAnO1xcblxcbmNvbnN0IGxpbmsgPSBjcmVhdGVIdHRwTGluayh7IHVyaTogJy9ncmFwaHFsJywgZmV0Y2g6IGZldGNoIH0pO1wiKTtcbiAgICB9XG59O1xudmFyIGNyZWF0ZVNpZ25hbElmU3VwcG9ydGVkID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgQWJvcnRDb250cm9sbGVyID09PSAndW5kZWZpbmVkJylcbiAgICAgICAgcmV0dXJuIHsgY29udHJvbGxlcjogZmFsc2UsIHNpZ25hbDogZmFsc2UgfTtcbiAgICB2YXIgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICB2YXIgc2lnbmFsID0gY29udHJvbGxlci5zaWduYWw7XG4gICAgcmV0dXJuIHsgY29udHJvbGxlcjogY29udHJvbGxlciwgc2lnbmFsOiBzaWduYWwgfTtcbn07XG52YXIgc2VsZWN0SHR0cE9wdGlvbnNBbmRCb2R5ID0gZnVuY3Rpb24gKG9wZXJhdGlvbiwgZmFsbGJhY2tDb25maWcpIHtcbiAgICB2YXIgY29uZmlncyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGNvbmZpZ3NbX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHZhciBvcHRpb25zID0gX19hc3NpZ24oe30sIGZhbGxiYWNrQ29uZmlnLm9wdGlvbnMsIHsgaGVhZGVyczogZmFsbGJhY2tDb25maWcuaGVhZGVycywgY3JlZGVudGlhbHM6IGZhbGxiYWNrQ29uZmlnLmNyZWRlbnRpYWxzIH0pO1xuICAgIHZhciBodHRwID0gZmFsbGJhY2tDb25maWcuaHR0cDtcbiAgICBjb25maWdzLmZvckVhY2goZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICBvcHRpb25zID0gX19hc3NpZ24oe30sIG9wdGlvbnMsIGNvbmZpZy5vcHRpb25zLCB7IGhlYWRlcnM6IF9fYXNzaWduKHt9LCBvcHRpb25zLmhlYWRlcnMsIGNvbmZpZy5oZWFkZXJzKSB9KTtcbiAgICAgICAgaWYgKGNvbmZpZy5jcmVkZW50aWFscylcbiAgICAgICAgICAgIG9wdGlvbnMuY3JlZGVudGlhbHMgPSBjb25maWcuY3JlZGVudGlhbHM7XG4gICAgICAgIGh0dHAgPSBfX2Fzc2lnbih7fSwgaHR0cCwgY29uZmlnLmh0dHApO1xuICAgIH0pO1xuICAgIHZhciBvcGVyYXRpb25OYW1lID0gb3BlcmF0aW9uLm9wZXJhdGlvbk5hbWUsIGV4dGVuc2lvbnMgPSBvcGVyYXRpb24uZXh0ZW5zaW9ucywgdmFyaWFibGVzID0gb3BlcmF0aW9uLnZhcmlhYmxlcywgcXVlcnkgPSBvcGVyYXRpb24ucXVlcnk7XG4gICAgdmFyIGJvZHkgPSB7IG9wZXJhdGlvbk5hbWU6IG9wZXJhdGlvbk5hbWUsIHZhcmlhYmxlczogdmFyaWFibGVzIH07XG4gICAgaWYgKGh0dHAuaW5jbHVkZUV4dGVuc2lvbnMpXG4gICAgICAgIGJvZHkuZXh0ZW5zaW9ucyA9IGV4dGVuc2lvbnM7XG4gICAgaWYgKGh0dHAuaW5jbHVkZVF1ZXJ5KVxuICAgICAgICBib2R5LnF1ZXJ5ID0gcHJpbnQocXVlcnkpO1xuICAgIHJldHVybiB7XG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXG4gICAgICAgIGJvZHk6IGJvZHksXG4gICAgfTtcbn07XG52YXIgc2VyaWFsaXplRmV0Y2hQYXJhbWV0ZXIgPSBmdW5jdGlvbiAocCwgbGFiZWwpIHtcbiAgICB2YXIgc2VyaWFsaXplZDtcbiAgICB0cnkge1xuICAgICAgICBzZXJpYWxpemVkID0gSlNPTi5zdHJpbmdpZnkocCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHZhciBwYXJzZUVycm9yID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gbmV3IEludmFyaWFudEVycm9yKDIpIDogbmV3IEludmFyaWFudEVycm9yKFwiTmV0d29yayByZXF1ZXN0IGZhaWxlZC4gXCIgKyBsYWJlbCArIFwiIGlzIG5vdCBzZXJpYWxpemFibGU6IFwiICsgZS5tZXNzYWdlKTtcbiAgICAgICAgcGFyc2VFcnJvci5wYXJzZUVycm9yID0gZTtcbiAgICAgICAgdGhyb3cgcGFyc2VFcnJvcjtcbiAgICB9XG4gICAgcmV0dXJuIHNlcmlhbGl6ZWQ7XG59O1xudmFyIHNlbGVjdFVSSSA9IGZ1bmN0aW9uIChvcGVyYXRpb24sIGZhbGxiYWNrVVJJKSB7XG4gICAgdmFyIGNvbnRleHQgPSBvcGVyYXRpb24uZ2V0Q29udGV4dCgpO1xuICAgIHZhciBjb250ZXh0VVJJID0gY29udGV4dC51cmk7XG4gICAgaWYgKGNvbnRleHRVUkkpIHtcbiAgICAgICAgcmV0dXJuIGNvbnRleHRVUkk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBmYWxsYmFja1VSSSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gZmFsbGJhY2tVUkkob3BlcmF0aW9uKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxsYmFja1VSSSB8fCAnL2dyYXBocWwnO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGNoZWNrRmV0Y2hlciwgY3JlYXRlU2lnbmFsSWZTdXBwb3J0ZWQsIGZhbGxiYWNrSHR0cENvbmZpZywgcGFyc2VBbmRDaGVja0h0dHBSZXNwb25zZSwgc2VsZWN0SHR0cE9wdGlvbnNBbmRCb2R5LCBzZWxlY3RVUkksIHNlcmlhbGl6ZUZldGNoUGFyYW1ldGVyLCB0aHJvd1NlcnZlckVycm9yIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idW5kbGUuZXNtLmpzLm1hcFxuIiwiaW1wb3J0IHsgX19yZXN0LCBfX2Fzc2lnbiwgX19leHRlbmRzIH0gZnJvbSAndHNsaWInO1xuaW1wb3J0IHsgQXBvbGxvTGluaywgZnJvbUVycm9yLCBPYnNlcnZhYmxlIH0gZnJvbSAnYXBvbGxvLWxpbmsnO1xuaW1wb3J0IHsgY2hlY2tGZXRjaGVyLCBzZWxlY3RVUkksIHNlbGVjdEh0dHBPcHRpb25zQW5kQm9keSwgZmFsbGJhY2tIdHRwQ29uZmlnLCBjcmVhdGVTaWduYWxJZlN1cHBvcnRlZCwgc2VyaWFsaXplRmV0Y2hQYXJhbWV0ZXIsIHBhcnNlQW5kQ2hlY2tIdHRwUmVzcG9uc2UgfSBmcm9tICdhcG9sbG8tbGluay1odHRwLWNvbW1vbic7XG5cbnZhciBjcmVhdGVIdHRwTGluayA9IGZ1bmN0aW9uIChsaW5rT3B0aW9ucykge1xuICAgIGlmIChsaW5rT3B0aW9ucyA9PT0gdm9pZCAwKSB7IGxpbmtPcHRpb25zID0ge307IH1cbiAgICB2YXIgX2EgPSBsaW5rT3B0aW9ucy51cmksIHVyaSA9IF9hID09PSB2b2lkIDAgPyAnL2dyYXBocWwnIDogX2EsIGZldGNoZXIgPSBsaW5rT3B0aW9ucy5mZXRjaCwgaW5jbHVkZUV4dGVuc2lvbnMgPSBsaW5rT3B0aW9ucy5pbmNsdWRlRXh0ZW5zaW9ucywgdXNlR0VURm9yUXVlcmllcyA9IGxpbmtPcHRpb25zLnVzZUdFVEZvclF1ZXJpZXMsIHJlcXVlc3RPcHRpb25zID0gX19yZXN0KGxpbmtPcHRpb25zLCBbXCJ1cmlcIiwgXCJmZXRjaFwiLCBcImluY2x1ZGVFeHRlbnNpb25zXCIsIFwidXNlR0VURm9yUXVlcmllc1wiXSk7XG4gICAgY2hlY2tGZXRjaGVyKGZldGNoZXIpO1xuICAgIGlmICghZmV0Y2hlcikge1xuICAgICAgICBmZXRjaGVyID0gZmV0Y2g7XG4gICAgfVxuICAgIHZhciBsaW5rQ29uZmlnID0ge1xuICAgICAgICBodHRwOiB7IGluY2x1ZGVFeHRlbnNpb25zOiBpbmNsdWRlRXh0ZW5zaW9ucyB9LFxuICAgICAgICBvcHRpb25zOiByZXF1ZXN0T3B0aW9ucy5mZXRjaE9wdGlvbnMsXG4gICAgICAgIGNyZWRlbnRpYWxzOiByZXF1ZXN0T3B0aW9ucy5jcmVkZW50aWFscyxcbiAgICAgICAgaGVhZGVyczogcmVxdWVzdE9wdGlvbnMuaGVhZGVycyxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgQXBvbGxvTGluayhmdW5jdGlvbiAob3BlcmF0aW9uKSB7XG4gICAgICAgIHZhciBjaG9zZW5VUkkgPSBzZWxlY3RVUkkob3BlcmF0aW9uLCB1cmkpO1xuICAgICAgICB2YXIgY29udGV4dCA9IG9wZXJhdGlvbi5nZXRDb250ZXh0KCk7XG4gICAgICAgIHZhciBjbGllbnRBd2FyZW5lc3NIZWFkZXJzID0ge307XG4gICAgICAgIGlmIChjb250ZXh0LmNsaWVudEF3YXJlbmVzcykge1xuICAgICAgICAgICAgdmFyIF9hID0gY29udGV4dC5jbGllbnRBd2FyZW5lc3MsIG5hbWVfMSA9IF9hLm5hbWUsIHZlcnNpb24gPSBfYS52ZXJzaW9uO1xuICAgICAgICAgICAgaWYgKG5hbWVfMSkge1xuICAgICAgICAgICAgICAgIGNsaWVudEF3YXJlbmVzc0hlYWRlcnNbJ2Fwb2xsb2dyYXBocWwtY2xpZW50LW5hbWUnXSA9IG5hbWVfMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50QXdhcmVuZXNzSGVhZGVyc1snYXBvbGxvZ3JhcGhxbC1jbGllbnQtdmVyc2lvbiddID0gdmVyc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgY29udGV4dEhlYWRlcnMgPSBfX2Fzc2lnbih7fSwgY2xpZW50QXdhcmVuZXNzSGVhZGVycywgY29udGV4dC5oZWFkZXJzKTtcbiAgICAgICAgdmFyIGNvbnRleHRDb25maWcgPSB7XG4gICAgICAgICAgICBodHRwOiBjb250ZXh0Lmh0dHAsXG4gICAgICAgICAgICBvcHRpb25zOiBjb250ZXh0LmZldGNoT3B0aW9ucyxcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBjb250ZXh0LmNyZWRlbnRpYWxzLFxuICAgICAgICAgICAgaGVhZGVyczogY29udGV4dEhlYWRlcnMsXG4gICAgICAgIH07XG4gICAgICAgIHZhciBfYiA9IHNlbGVjdEh0dHBPcHRpb25zQW5kQm9keShvcGVyYXRpb24sIGZhbGxiYWNrSHR0cENvbmZpZywgbGlua0NvbmZpZywgY29udGV4dENvbmZpZyksIG9wdGlvbnMgPSBfYi5vcHRpb25zLCBib2R5ID0gX2IuYm9keTtcbiAgICAgICAgdmFyIGNvbnRyb2xsZXI7XG4gICAgICAgIGlmICghb3B0aW9ucy5zaWduYWwpIHtcbiAgICAgICAgICAgIHZhciBfYyA9IGNyZWF0ZVNpZ25hbElmU3VwcG9ydGVkKCksIF9jb250cm9sbGVyID0gX2MuY29udHJvbGxlciwgc2lnbmFsID0gX2Muc2lnbmFsO1xuICAgICAgICAgICAgY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xuICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXIpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zaWduYWwgPSBzaWduYWw7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRlZmluaXRpb25Jc011dGF0aW9uID0gZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkLmtpbmQgPT09ICdPcGVyYXRpb25EZWZpbml0aW9uJyAmJiBkLm9wZXJhdGlvbiA9PT0gJ211dGF0aW9uJztcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHVzZUdFVEZvclF1ZXJpZXMgJiZcbiAgICAgICAgICAgICFvcGVyYXRpb24ucXVlcnkuZGVmaW5pdGlvbnMuc29tZShkZWZpbml0aW9uSXNNdXRhdGlvbikpIHtcbiAgICAgICAgICAgIG9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMubWV0aG9kID09PSAnR0VUJykge1xuICAgICAgICAgICAgdmFyIF9kID0gcmV3cml0ZVVSSUZvckdFVChjaG9zZW5VUkksIGJvZHkpLCBuZXdVUkkgPSBfZC5uZXdVUkksIHBhcnNlRXJyb3IgPSBfZC5wYXJzZUVycm9yO1xuICAgICAgICAgICAgaWYgKHBhcnNlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbUVycm9yKHBhcnNlRXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hvc2VuVVJJID0gbmV3VVJJO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmJvZHkgPSBzZXJpYWxpemVGZXRjaFBhcmFtZXRlcihib2R5LCAnUGF5bG9hZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKHBhcnNlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbUVycm9yKHBhcnNlRXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIGZldGNoZXIoY2hvc2VuVVJJLCBvcHRpb25zKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5zZXRDb250ZXh0KHsgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4ocGFyc2VBbmRDaGVja0h0dHBSZXNwb25zZShvcGVyYXRpb24pKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIubmFtZSA9PT0gJ0Fib3J0RXJyb3InKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKGVyci5yZXN1bHQgJiYgZXJyLnJlc3VsdC5lcnJvcnMgJiYgZXJyLnJlc3VsdC5kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZXJyLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRyb2xsZXIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbmZ1bmN0aW9uIHJld3JpdGVVUklGb3JHRVQoY2hvc2VuVVJJLCBib2R5KSB7XG4gICAgdmFyIHF1ZXJ5UGFyYW1zID0gW107XG4gICAgdmFyIGFkZFF1ZXJ5UGFyYW0gPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBxdWVyeVBhcmFtcy5wdXNoKGtleSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSk7XG4gICAgfTtcbiAgICBpZiAoJ3F1ZXJ5JyBpbiBib2R5KSB7XG4gICAgICAgIGFkZFF1ZXJ5UGFyYW0oJ3F1ZXJ5JywgYm9keS5xdWVyeSk7XG4gICAgfVxuICAgIGlmIChib2R5Lm9wZXJhdGlvbk5hbWUpIHtcbiAgICAgICAgYWRkUXVlcnlQYXJhbSgnb3BlcmF0aW9uTmFtZScsIGJvZHkub3BlcmF0aW9uTmFtZSk7XG4gICAgfVxuICAgIGlmIChib2R5LnZhcmlhYmxlcykge1xuICAgICAgICB2YXIgc2VyaWFsaXplZFZhcmlhYmxlcyA9IHZvaWQgMDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNlcmlhbGl6ZWRWYXJpYWJsZXMgPSBzZXJpYWxpemVGZXRjaFBhcmFtZXRlcihib2R5LnZhcmlhYmxlcywgJ1ZhcmlhYmxlcyBtYXAnKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAocGFyc2VFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHsgcGFyc2VFcnJvcjogcGFyc2VFcnJvciB9O1xuICAgICAgICB9XG4gICAgICAgIGFkZFF1ZXJ5UGFyYW0oJ3ZhcmlhYmxlcycsIHNlcmlhbGl6ZWRWYXJpYWJsZXMpO1xuICAgIH1cbiAgICBpZiAoYm9keS5leHRlbnNpb25zKSB7XG4gICAgICAgIHZhciBzZXJpYWxpemVkRXh0ZW5zaW9ucyA9IHZvaWQgMDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNlcmlhbGl6ZWRFeHRlbnNpb25zID0gc2VyaWFsaXplRmV0Y2hQYXJhbWV0ZXIoYm9keS5leHRlbnNpb25zLCAnRXh0ZW5zaW9ucyBtYXAnKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAocGFyc2VFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHsgcGFyc2VFcnJvcjogcGFyc2VFcnJvciB9O1xuICAgICAgICB9XG4gICAgICAgIGFkZFF1ZXJ5UGFyYW0oJ2V4dGVuc2lvbnMnLCBzZXJpYWxpemVkRXh0ZW5zaW9ucyk7XG4gICAgfVxuICAgIHZhciBmcmFnbWVudCA9ICcnLCBwcmVGcmFnbWVudCA9IGNob3NlblVSSTtcbiAgICB2YXIgZnJhZ21lbnRTdGFydCA9IGNob3NlblVSSS5pbmRleE9mKCcjJyk7XG4gICAgaWYgKGZyYWdtZW50U3RhcnQgIT09IC0xKSB7XG4gICAgICAgIGZyYWdtZW50ID0gY2hvc2VuVVJJLnN1YnN0cihmcmFnbWVudFN0YXJ0KTtcbiAgICAgICAgcHJlRnJhZ21lbnQgPSBjaG9zZW5VUkkuc3Vic3RyKDAsIGZyYWdtZW50U3RhcnQpO1xuICAgIH1cbiAgICB2YXIgcXVlcnlQYXJhbXNQcmVmaXggPSBwcmVGcmFnbWVudC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnO1xuICAgIHZhciBuZXdVUkkgPSBwcmVGcmFnbWVudCArIHF1ZXJ5UGFyYW1zUHJlZml4ICsgcXVlcnlQYXJhbXMuam9pbignJicpICsgZnJhZ21lbnQ7XG4gICAgcmV0dXJuIHsgbmV3VVJJOiBuZXdVUkkgfTtcbn1cbnZhciBIdHRwTGluayA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEh0dHBMaW5rLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEh0dHBMaW5rKG9wdHMpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIGNyZWF0ZUh0dHBMaW5rKG9wdHMpLnJlcXVlc3QpIHx8IHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBIdHRwTGluaztcbn0oQXBvbGxvTGluaykpO1xuXG5leHBvcnQgeyBIdHRwTGluaywgY3JlYXRlSHR0cExpbmsgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bmRsZS5lc20uanMubWFwXG4iLCJpbXBvcnQgT2JzZXJ2YWJsZSBmcm9tICd6ZW4tb2JzZXJ2YWJsZS10cyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE9ic2VydmFibGUgfSBmcm9tICd6ZW4tb2JzZXJ2YWJsZS10cyc7XG5pbXBvcnQgeyBpbnZhcmlhbnQsIEludmFyaWFudEVycm9yIH0gZnJvbSAndHMtaW52YXJpYW50JztcbmltcG9ydCB7IF9fZXh0ZW5kcywgX19hc3NpZ24gfSBmcm9tICd0c2xpYic7XG5pbXBvcnQgeyBnZXRPcGVyYXRpb25OYW1lIH0gZnJvbSAnYXBvbGxvLXV0aWxpdGllcyc7XG5leHBvcnQgeyBnZXRPcGVyYXRpb25OYW1lIH0gZnJvbSAnYXBvbGxvLXV0aWxpdGllcyc7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlT3BlcmF0aW9uKG9wZXJhdGlvbikge1xuICAgIHZhciBPUEVSQVRJT05fRklFTERTID0gW1xuICAgICAgICAncXVlcnknLFxuICAgICAgICAnb3BlcmF0aW9uTmFtZScsXG4gICAgICAgICd2YXJpYWJsZXMnLFxuICAgICAgICAnZXh0ZW5zaW9ucycsXG4gICAgICAgICdjb250ZXh0JyxcbiAgICBdO1xuICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBPYmplY3Qua2V5cyhvcGVyYXRpb24pOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIga2V5ID0gX2FbX2ldO1xuICAgICAgICBpZiAoT1BFUkFUSU9OX0ZJRUxEUy5pbmRleE9mKGtleSkgPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBuZXcgSW52YXJpYW50RXJyb3IoMikgOiBuZXcgSW52YXJpYW50RXJyb3IoXCJpbGxlZ2FsIGFyZ3VtZW50OiBcIiArIGtleSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9wZXJhdGlvbjtcbn1cbnZhciBMaW5rRXJyb3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhMaW5rRXJyb3IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTGlua0Vycm9yKG1lc3NhZ2UsIGxpbmspIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbWVzc2FnZSkgfHwgdGhpcztcbiAgICAgICAgX3RoaXMubGluayA9IGxpbms7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIExpbmtFcnJvcjtcbn0oRXJyb3IpKTtcbmZ1bmN0aW9uIGlzVGVybWluYXRpbmcobGluaykge1xuICAgIHJldHVybiBsaW5rLnJlcXVlc3QubGVuZ3RoIDw9IDE7XG59XG5mdW5jdGlvbiB0b1Byb21pc2Uob2JzZXJ2YWJsZSkge1xuICAgIHZhciBjb21wbGV0ZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBvYnNlcnZhYmxlLnN1YnNjcmliZSh7XG4gICAgICAgICAgICBuZXh0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiIHx8IGludmFyaWFudC53YXJuKFwiUHJvbWlzZSBXcmFwcGVyIGRvZXMgbm90IHN1cHBvcnQgbXVsdGlwbGUgcmVzdWx0cyBmcm9tIE9ic2VydmFibGVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogcmVqZWN0LFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbnZhciBtYWtlUHJvbWlzZSA9IHRvUHJvbWlzZTtcbmZ1bmN0aW9uIGZyb21Qcm9taXNlKHByb21pc2UpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgIHByb21pc2VcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKG9ic2VydmVyLmVycm9yLmJpbmQob2JzZXJ2ZXIpKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZyb21FcnJvcihlcnJvclZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvclZhbHVlKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHRyYW5zZm9ybU9wZXJhdGlvbihvcGVyYXRpb24pIHtcbiAgICB2YXIgdHJhbnNmb3JtZWRPcGVyYXRpb24gPSB7XG4gICAgICAgIHZhcmlhYmxlczogb3BlcmF0aW9uLnZhcmlhYmxlcyB8fCB7fSxcbiAgICAgICAgZXh0ZW5zaW9uczogb3BlcmF0aW9uLmV4dGVuc2lvbnMgfHwge30sXG4gICAgICAgIG9wZXJhdGlvbk5hbWU6IG9wZXJhdGlvbi5vcGVyYXRpb25OYW1lLFxuICAgICAgICBxdWVyeTogb3BlcmF0aW9uLnF1ZXJ5LFxuICAgIH07XG4gICAgaWYgKCF0cmFuc2Zvcm1lZE9wZXJhdGlvbi5vcGVyYXRpb25OYW1lKSB7XG4gICAgICAgIHRyYW5zZm9ybWVkT3BlcmF0aW9uLm9wZXJhdGlvbk5hbWUgPVxuICAgICAgICAgICAgdHlwZW9mIHRyYW5zZm9ybWVkT3BlcmF0aW9uLnF1ZXJ5ICE9PSAnc3RyaW5nJ1xuICAgICAgICAgICAgICAgID8gZ2V0T3BlcmF0aW9uTmFtZSh0cmFuc2Zvcm1lZE9wZXJhdGlvbi5xdWVyeSlcbiAgICAgICAgICAgICAgICA6ICcnO1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNmb3JtZWRPcGVyYXRpb247XG59XG5mdW5jdGlvbiBjcmVhdGVPcGVyYXRpb24oc3RhcnRpbmcsIG9wZXJhdGlvbikge1xuICAgIHZhciBjb250ZXh0ID0gX19hc3NpZ24oe30sIHN0YXJ0aW5nKTtcbiAgICB2YXIgc2V0Q29udGV4dCA9IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29udGV4dCA9IF9fYXNzaWduKHt9LCBjb250ZXh0LCBuZXh0KGNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHQgPSBfX2Fzc2lnbih7fSwgY29udGV4dCwgbmV4dCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBnZXRDb250ZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gKF9fYXNzaWduKHt9LCBjb250ZXh0KSk7IH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9wZXJhdGlvbiwgJ3NldENvbnRleHQnLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogc2V0Q29udGV4dCxcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob3BlcmF0aW9uLCAnZ2V0Q29udGV4dCcsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBnZXRDb250ZXh0LFxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvcGVyYXRpb24sICd0b0tleScsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7IHJldHVybiBnZXRLZXkob3BlcmF0aW9uKTsgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gb3BlcmF0aW9uO1xufVxuZnVuY3Rpb24gZ2V0S2V5KG9wZXJhdGlvbikge1xuICAgIHZhciBxdWVyeSA9IG9wZXJhdGlvbi5xdWVyeSwgdmFyaWFibGVzID0gb3BlcmF0aW9uLnZhcmlhYmxlcywgb3BlcmF0aW9uTmFtZSA9IG9wZXJhdGlvbi5vcGVyYXRpb25OYW1lO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbb3BlcmF0aW9uTmFtZSwgcXVlcnksIHZhcmlhYmxlc10pO1xufVxuXG5mdW5jdGlvbiBwYXNzdGhyb3VnaChvcCwgZm9yd2FyZCkge1xuICAgIHJldHVybiBmb3J3YXJkID8gZm9yd2FyZChvcCkgOiBPYnNlcnZhYmxlLm9mKCk7XG59XG5mdW5jdGlvbiB0b0xpbmsoaGFuZGxlcikge1xuICAgIHJldHVybiB0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJyA/IG5ldyBBcG9sbG9MaW5rKGhhbmRsZXIpIDogaGFuZGxlcjtcbn1cbmZ1bmN0aW9uIGVtcHR5KCkge1xuICAgIHJldHVybiBuZXcgQXBvbGxvTGluayhmdW5jdGlvbiAoKSB7IHJldHVybiBPYnNlcnZhYmxlLm9mKCk7IH0pO1xufVxuZnVuY3Rpb24gZnJvbShsaW5rcykge1xuICAgIGlmIChsaW5rcy5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiBlbXB0eSgpO1xuICAgIHJldHVybiBsaW5rcy5tYXAodG9MaW5rKS5yZWR1Y2UoZnVuY3Rpb24gKHgsIHkpIHsgcmV0dXJuIHguY29uY2F0KHkpOyB9KTtcbn1cbmZ1bmN0aW9uIHNwbGl0KHRlc3QsIGxlZnQsIHJpZ2h0KSB7XG4gICAgdmFyIGxlZnRMaW5rID0gdG9MaW5rKGxlZnQpO1xuICAgIHZhciByaWdodExpbmsgPSB0b0xpbmsocmlnaHQgfHwgbmV3IEFwb2xsb0xpbmsocGFzc3Rocm91Z2gpKTtcbiAgICBpZiAoaXNUZXJtaW5hdGluZyhsZWZ0TGluaykgJiYgaXNUZXJtaW5hdGluZyhyaWdodExpbmspKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXBvbGxvTGluayhmdW5jdGlvbiAob3BlcmF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGVzdChvcGVyYXRpb24pXG4gICAgICAgICAgICAgICAgPyBsZWZ0TGluay5yZXF1ZXN0KG9wZXJhdGlvbikgfHwgT2JzZXJ2YWJsZS5vZigpXG4gICAgICAgICAgICAgICAgOiByaWdodExpbmsucmVxdWVzdChvcGVyYXRpb24pIHx8IE9ic2VydmFibGUub2YoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFwb2xsb0xpbmsoZnVuY3Rpb24gKG9wZXJhdGlvbiwgZm9yd2FyZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRlc3Qob3BlcmF0aW9uKVxuICAgICAgICAgICAgICAgID8gbGVmdExpbmsucmVxdWVzdChvcGVyYXRpb24sIGZvcndhcmQpIHx8IE9ic2VydmFibGUub2YoKVxuICAgICAgICAgICAgICAgIDogcmlnaHRMaW5rLnJlcXVlc3Qob3BlcmF0aW9uLCBmb3J3YXJkKSB8fCBPYnNlcnZhYmxlLm9mKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbnZhciBjb25jYXQgPSBmdW5jdGlvbiAoZmlyc3QsIHNlY29uZCkge1xuICAgIHZhciBmaXJzdExpbmsgPSB0b0xpbmsoZmlyc3QpO1xuICAgIGlmIChpc1Rlcm1pbmF0aW5nKGZpcnN0TGluaykpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiIHx8IGludmFyaWFudC53YXJuKG5ldyBMaW5rRXJyb3IoXCJZb3UgYXJlIGNhbGxpbmcgY29uY2F0IG9uIGEgdGVybWluYXRpbmcgbGluaywgd2hpY2ggd2lsbCBoYXZlIG5vIGVmZmVjdFwiLCBmaXJzdExpbmspKTtcbiAgICAgICAgcmV0dXJuIGZpcnN0TGluaztcbiAgICB9XG4gICAgdmFyIG5leHRMaW5rID0gdG9MaW5rKHNlY29uZCk7XG4gICAgaWYgKGlzVGVybWluYXRpbmcobmV4dExpbmspKSB7XG4gICAgICAgIHJldHVybiBuZXcgQXBvbGxvTGluayhmdW5jdGlvbiAob3BlcmF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlyc3RMaW5rLnJlcXVlc3Qob3BlcmF0aW9uLCBmdW5jdGlvbiAob3ApIHsgcmV0dXJuIG5leHRMaW5rLnJlcXVlc3Qob3ApIHx8IE9ic2VydmFibGUub2YoKTsgfSkgfHwgT2JzZXJ2YWJsZS5vZigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQXBvbGxvTGluayhmdW5jdGlvbiAob3BlcmF0aW9uLCBmb3J3YXJkKSB7XG4gICAgICAgICAgICByZXR1cm4gKGZpcnN0TGluay5yZXF1ZXN0KG9wZXJhdGlvbiwgZnVuY3Rpb24gKG9wKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHRMaW5rLnJlcXVlc3Qob3AsIGZvcndhcmQpIHx8IE9ic2VydmFibGUub2YoKTtcbiAgICAgICAgICAgIH0pIHx8IE9ic2VydmFibGUub2YoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG52YXIgQXBvbGxvTGluayA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQXBvbGxvTGluayhyZXF1ZXN0KSB7XG4gICAgICAgIGlmIChyZXF1ZXN0KVxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICB9XG4gICAgQXBvbGxvTGluay5wcm90b3R5cGUuc3BsaXQgPSBmdW5jdGlvbiAodGVzdCwgbGVmdCwgcmlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uY2F0KHNwbGl0KHRlc3QsIGxlZnQsIHJpZ2h0IHx8IG5ldyBBcG9sbG9MaW5rKHBhc3N0aHJvdWdoKSkpO1xuICAgIH07XG4gICAgQXBvbGxvTGluay5wcm90b3R5cGUuY29uY2F0ID0gZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgcmV0dXJuIGNvbmNhdCh0aGlzLCBuZXh0KTtcbiAgICB9O1xuICAgIEFwb2xsb0xpbmsucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiAob3BlcmF0aW9uLCBmb3J3YXJkKSB7XG4gICAgICAgIHRocm93IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IG5ldyBJbnZhcmlhbnRFcnJvcigxKSA6IG5ldyBJbnZhcmlhbnRFcnJvcigncmVxdWVzdCBpcyBub3QgaW1wbGVtZW50ZWQnKTtcbiAgICB9O1xuICAgIEFwb2xsb0xpbmsuZW1wdHkgPSBlbXB0eTtcbiAgICBBcG9sbG9MaW5rLmZyb20gPSBmcm9tO1xuICAgIEFwb2xsb0xpbmsuc3BsaXQgPSBzcGxpdDtcbiAgICBBcG9sbG9MaW5rLmV4ZWN1dGUgPSBleGVjdXRlO1xuICAgIHJldHVybiBBcG9sbG9MaW5rO1xufSgpKTtcbmZ1bmN0aW9uIGV4ZWN1dGUobGluaywgb3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIChsaW5rLnJlcXVlc3QoY3JlYXRlT3BlcmF0aW9uKG9wZXJhdGlvbi5jb250ZXh0LCB0cmFuc2Zvcm1PcGVyYXRpb24odmFsaWRhdGVPcGVyYXRpb24ob3BlcmF0aW9uKSkpKSB8fCBPYnNlcnZhYmxlLm9mKCkpO1xufVxuXG5leHBvcnQgeyBBcG9sbG9MaW5rLCBjb25jYXQsIGNyZWF0ZU9wZXJhdGlvbiwgZW1wdHksIGV4ZWN1dGUsIGZyb20sIGZyb21FcnJvciwgZnJvbVByb21pc2UsIG1ha2VQcm9taXNlLCBzcGxpdCwgdG9Qcm9taXNlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idW5kbGUuZXNtLmpzLm1hcFxuIiwiaW1wb3J0IHsgdmlzaXQgfSBmcm9tICdncmFwaHFsL2xhbmd1YWdlL3Zpc2l0b3InO1xuaW1wb3J0IHsgSW52YXJpYW50RXJyb3IsIGludmFyaWFudCB9IGZyb20gJ3RzLWludmFyaWFudCc7XG5pbXBvcnQgeyBfX2Fzc2lnbiwgX19zcHJlYWRBcnJheXMgfSBmcm9tICd0c2xpYic7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJ2Zhc3QtanNvbi1zdGFibGUtc3RyaW5naWZ5JztcbmV4cG9ydCB7IGVxdWFsIGFzIGlzRXF1YWwgfSBmcm9tICdAd3J5L2VxdWFsaXR5JztcblxuZnVuY3Rpb24gaXNTY2FsYXJWYWx1ZSh2YWx1ZSkge1xuICAgIHJldHVybiBbJ1N0cmluZ1ZhbHVlJywgJ0Jvb2xlYW5WYWx1ZScsICdFbnVtVmFsdWUnXS5pbmRleE9mKHZhbHVlLmtpbmQpID4gLTE7XG59XG5mdW5jdGlvbiBpc051bWJlclZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIFsnSW50VmFsdWUnLCAnRmxvYXRWYWx1ZSddLmluZGV4T2YodmFsdWUua2luZCkgPiAtMTtcbn1cbmZ1bmN0aW9uIGlzU3RyaW5nVmFsdWUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUua2luZCA9PT0gJ1N0cmluZ1ZhbHVlJztcbn1cbmZ1bmN0aW9uIGlzQm9vbGVhblZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLmtpbmQgPT09ICdCb29sZWFuVmFsdWUnO1xufVxuZnVuY3Rpb24gaXNJbnRWYWx1ZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5raW5kID09PSAnSW50VmFsdWUnO1xufVxuZnVuY3Rpb24gaXNGbG9hdFZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLmtpbmQgPT09ICdGbG9hdFZhbHVlJztcbn1cbmZ1bmN0aW9uIGlzVmFyaWFibGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUua2luZCA9PT0gJ1ZhcmlhYmxlJztcbn1cbmZ1bmN0aW9uIGlzT2JqZWN0VmFsdWUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUua2luZCA9PT0gJ09iamVjdFZhbHVlJztcbn1cbmZ1bmN0aW9uIGlzTGlzdFZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLmtpbmQgPT09ICdMaXN0VmFsdWUnO1xufVxuZnVuY3Rpb24gaXNFbnVtVmFsdWUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUua2luZCA9PT0gJ0VudW1WYWx1ZSc7XG59XG5mdW5jdGlvbiBpc051bGxWYWx1ZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5raW5kID09PSAnTnVsbFZhbHVlJztcbn1cbmZ1bmN0aW9uIHZhbHVlVG9PYmplY3RSZXByZXNlbnRhdGlvbihhcmdPYmosIG5hbWUsIHZhbHVlLCB2YXJpYWJsZXMpIHtcbiAgICBpZiAoaXNJbnRWYWx1ZSh2YWx1ZSkgfHwgaXNGbG9hdFZhbHVlKHZhbHVlKSkge1xuICAgICAgICBhcmdPYmpbbmFtZS52YWx1ZV0gPSBOdW1iZXIodmFsdWUudmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0Jvb2xlYW5WYWx1ZSh2YWx1ZSkgfHwgaXNTdHJpbmdWYWx1ZSh2YWx1ZSkpIHtcbiAgICAgICAgYXJnT2JqW25hbWUudmFsdWVdID0gdmFsdWUudmFsdWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzT2JqZWN0VmFsdWUodmFsdWUpKSB7XG4gICAgICAgIHZhciBuZXN0ZWRBcmdPYmpfMSA9IHt9O1xuICAgICAgICB2YWx1ZS5maWVsZHMubWFwKGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZVRvT2JqZWN0UmVwcmVzZW50YXRpb24obmVzdGVkQXJnT2JqXzEsIG9iai5uYW1lLCBvYmoudmFsdWUsIHZhcmlhYmxlcyk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcmdPYmpbbmFtZS52YWx1ZV0gPSBuZXN0ZWRBcmdPYmpfMTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNWYXJpYWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgdmFyIHZhcmlhYmxlVmFsdWUgPSAodmFyaWFibGVzIHx8IHt9KVt2YWx1ZS5uYW1lLnZhbHVlXTtcbiAgICAgICAgYXJnT2JqW25hbWUudmFsdWVdID0gdmFyaWFibGVWYWx1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNMaXN0VmFsdWUodmFsdWUpKSB7XG4gICAgICAgIGFyZ09ialtuYW1lLnZhbHVlXSA9IHZhbHVlLnZhbHVlcy5tYXAoZnVuY3Rpb24gKGxpc3RWYWx1ZSkge1xuICAgICAgICAgICAgdmFyIG5lc3RlZEFyZ0FycmF5T2JqID0ge307XG4gICAgICAgICAgICB2YWx1ZVRvT2JqZWN0UmVwcmVzZW50YXRpb24obmVzdGVkQXJnQXJyYXlPYmosIG5hbWUsIGxpc3RWYWx1ZSwgdmFyaWFibGVzKTtcbiAgICAgICAgICAgIHJldHVybiBuZXN0ZWRBcmdBcnJheU9ialtuYW1lLnZhbHVlXTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzRW51bVZhbHVlKHZhbHVlKSkge1xuICAgICAgICBhcmdPYmpbbmFtZS52YWx1ZV0gPSB2YWx1ZS52YWx1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNOdWxsVmFsdWUodmFsdWUpKSB7XG4gICAgICAgIGFyZ09ialtuYW1lLnZhbHVlXSA9IG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBuZXcgSW52YXJpYW50RXJyb3IoMTcpIDogbmV3IEludmFyaWFudEVycm9yKFwiVGhlIGlubGluZSBhcmd1bWVudCBcXFwiXCIgKyBuYW1lLnZhbHVlICsgXCJcXFwiIG9mIGtpbmQgXFxcIlwiICsgdmFsdWUua2luZCArIFwiXFxcIlwiICtcbiAgICAgICAgICAgICdpcyBub3Qgc3VwcG9ydGVkLiBVc2UgdmFyaWFibGVzIGluc3RlYWQgb2YgaW5saW5lIGFyZ3VtZW50cyB0byAnICtcbiAgICAgICAgICAgICdvdmVyY29tZSB0aGlzIGxpbWl0YXRpb24uJyk7XG4gICAgfVxufVxuZnVuY3Rpb24gc3RvcmVLZXlOYW1lRnJvbUZpZWxkKGZpZWxkLCB2YXJpYWJsZXMpIHtcbiAgICB2YXIgZGlyZWN0aXZlc09iaiA9IG51bGw7XG4gICAgaWYgKGZpZWxkLmRpcmVjdGl2ZXMpIHtcbiAgICAgICAgZGlyZWN0aXZlc09iaiA9IHt9O1xuICAgICAgICBmaWVsZC5kaXJlY3RpdmVzLmZvckVhY2goZnVuY3Rpb24gKGRpcmVjdGl2ZSkge1xuICAgICAgICAgICAgZGlyZWN0aXZlc09ialtkaXJlY3RpdmUubmFtZS52YWx1ZV0gPSB7fTtcbiAgICAgICAgICAgIGlmIChkaXJlY3RpdmUuYXJndW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlLmFyZ3VtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IF9hLm5hbWUsIHZhbHVlID0gX2EudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVRvT2JqZWN0UmVwcmVzZW50YXRpb24oZGlyZWN0aXZlc09ialtkaXJlY3RpdmUubmFtZS52YWx1ZV0sIG5hbWUsIHZhbHVlLCB2YXJpYWJsZXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgdmFyIGFyZ09iaiA9IG51bGw7XG4gICAgaWYgKGZpZWxkLmFyZ3VtZW50cyAmJiBmaWVsZC5hcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIGFyZ09iaiA9IHt9O1xuICAgICAgICBmaWVsZC5hcmd1bWVudHMuZm9yRWFjaChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gX2EubmFtZSwgdmFsdWUgPSBfYS52YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZVRvT2JqZWN0UmVwcmVzZW50YXRpb24oYXJnT2JqLCBuYW1lLCB2YWx1ZSwgdmFyaWFibGVzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRTdG9yZUtleU5hbWUoZmllbGQubmFtZS52YWx1ZSwgYXJnT2JqLCBkaXJlY3RpdmVzT2JqKTtcbn1cbnZhciBLTk9XTl9ESVJFQ1RJVkVTID0gW1xuICAgICdjb25uZWN0aW9uJyxcbiAgICAnaW5jbHVkZScsXG4gICAgJ3NraXAnLFxuICAgICdjbGllbnQnLFxuICAgICdyZXN0JyxcbiAgICAnZXhwb3J0Jyxcbl07XG5mdW5jdGlvbiBnZXRTdG9yZUtleU5hbWUoZmllbGROYW1lLCBhcmdzLCBkaXJlY3RpdmVzKSB7XG4gICAgaWYgKGRpcmVjdGl2ZXMgJiZcbiAgICAgICAgZGlyZWN0aXZlc1snY29ubmVjdGlvbiddICYmXG4gICAgICAgIGRpcmVjdGl2ZXNbJ2Nvbm5lY3Rpb24nXVsna2V5J10pIHtcbiAgICAgICAgaWYgKGRpcmVjdGl2ZXNbJ2Nvbm5lY3Rpb24nXVsnZmlsdGVyJ10gJiZcbiAgICAgICAgICAgIGRpcmVjdGl2ZXNbJ2Nvbm5lY3Rpb24nXVsnZmlsdGVyJ10ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIGZpbHRlcktleXMgPSBkaXJlY3RpdmVzWydjb25uZWN0aW9uJ11bJ2ZpbHRlciddXG4gICAgICAgICAgICAgICAgPyBkaXJlY3RpdmVzWydjb25uZWN0aW9uJ11bJ2ZpbHRlciddXG4gICAgICAgICAgICAgICAgOiBbXTtcbiAgICAgICAgICAgIGZpbHRlcktleXMuc29ydCgpO1xuICAgICAgICAgICAgdmFyIHF1ZXJ5QXJnc18xID0gYXJncztcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZEFyZ3NfMSA9IHt9O1xuICAgICAgICAgICAgZmlsdGVyS2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZEFyZ3NfMVtrZXldID0gcXVlcnlBcmdzXzFba2V5XTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZXNbJ2Nvbm5lY3Rpb24nXVsna2V5J10gKyBcIihcIiArIEpTT04uc3RyaW5naWZ5KGZpbHRlcmVkQXJnc18xKSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZXNbJ2Nvbm5lY3Rpb24nXVsna2V5J107XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNvbXBsZXRlRmllbGROYW1lID0gZmllbGROYW1lO1xuICAgIGlmIChhcmdzKSB7XG4gICAgICAgIHZhciBzdHJpbmdpZmllZEFyZ3MgPSBzdHJpbmdpZnkoYXJncyk7XG4gICAgICAgIGNvbXBsZXRlRmllbGROYW1lICs9IFwiKFwiICsgc3RyaW5naWZpZWRBcmdzICsgXCIpXCI7XG4gICAgfVxuICAgIGlmIChkaXJlY3RpdmVzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGRpcmVjdGl2ZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgaWYgKEtOT1dOX0RJUkVDVElWRVMuaW5kZXhPZihrZXkpICE9PSAtMSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBpZiAoZGlyZWN0aXZlc1trZXldICYmIE9iamVjdC5rZXlzKGRpcmVjdGl2ZXNba2V5XSkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29tcGxldGVGaWVsZE5hbWUgKz0gXCJAXCIgKyBrZXkgKyBcIihcIiArIEpTT04uc3RyaW5naWZ5KGRpcmVjdGl2ZXNba2V5XSkgKyBcIilcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlRmllbGROYW1lICs9IFwiQFwiICsga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBsZXRlRmllbGROYW1lO1xufVxuZnVuY3Rpb24gYXJndW1lbnRzT2JqZWN0RnJvbUZpZWxkKGZpZWxkLCB2YXJpYWJsZXMpIHtcbiAgICBpZiAoZmllbGQuYXJndW1lbnRzICYmIGZpZWxkLmFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGFyZ09ial8xID0ge307XG4gICAgICAgIGZpZWxkLmFyZ3VtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBfYS5uYW1lLCB2YWx1ZSA9IF9hLnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlVG9PYmplY3RSZXByZXNlbnRhdGlvbihhcmdPYmpfMSwgbmFtZSwgdmFsdWUsIHZhcmlhYmxlcyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXJnT2JqXzE7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gcmVzdWx0S2V5TmFtZUZyb21GaWVsZChmaWVsZCkge1xuICAgIHJldHVybiBmaWVsZC5hbGlhcyA/IGZpZWxkLmFsaWFzLnZhbHVlIDogZmllbGQubmFtZS52YWx1ZTtcbn1cbmZ1bmN0aW9uIGlzRmllbGQoc2VsZWN0aW9uKSB7XG4gICAgcmV0dXJuIHNlbGVjdGlvbi5raW5kID09PSAnRmllbGQnO1xufVxuZnVuY3Rpb24gaXNJbmxpbmVGcmFnbWVudChzZWxlY3Rpb24pIHtcbiAgICByZXR1cm4gc2VsZWN0aW9uLmtpbmQgPT09ICdJbmxpbmVGcmFnbWVudCc7XG59XG5mdW5jdGlvbiBpc0lkVmFsdWUoaWRPYmplY3QpIHtcbiAgICByZXR1cm4gaWRPYmplY3QgJiZcbiAgICAgICAgaWRPYmplY3QudHlwZSA9PT0gJ2lkJyAmJlxuICAgICAgICB0eXBlb2YgaWRPYmplY3QuZ2VuZXJhdGVkID09PSAnYm9vbGVhbic7XG59XG5mdW5jdGlvbiB0b0lkVmFsdWUoaWRDb25maWcsIGdlbmVyYXRlZCkge1xuICAgIGlmIChnZW5lcmF0ZWQgPT09IHZvaWQgMCkgeyBnZW5lcmF0ZWQgPSBmYWxzZTsgfVxuICAgIHJldHVybiBfX2Fzc2lnbih7IHR5cGU6ICdpZCcsIGdlbmVyYXRlZDogZ2VuZXJhdGVkIH0sICh0eXBlb2YgaWRDb25maWcgPT09ICdzdHJpbmcnXG4gICAgICAgID8geyBpZDogaWRDb25maWcsIHR5cGVuYW1lOiB1bmRlZmluZWQgfVxuICAgICAgICA6IGlkQ29uZmlnKSk7XG59XG5mdW5jdGlvbiBpc0pzb25WYWx1ZShqc29uT2JqZWN0KSB7XG4gICAgcmV0dXJuIChqc29uT2JqZWN0ICE9IG51bGwgJiZcbiAgICAgICAgdHlwZW9mIGpzb25PYmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICAgIGpzb25PYmplY3QudHlwZSA9PT0gJ2pzb24nKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRWYWx1ZUZyb21WYXJpYWJsZShub2RlKSB7XG4gICAgdGhyb3cgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gbmV3IEludmFyaWFudEVycm9yKDE4KSA6IG5ldyBJbnZhcmlhbnRFcnJvcihcIlZhcmlhYmxlIG5vZGVzIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IHZhbHVlRnJvbU5vZGVcIik7XG59XG5mdW5jdGlvbiB2YWx1ZUZyb21Ob2RlKG5vZGUsIG9uVmFyaWFibGUpIHtcbiAgICBpZiAob25WYXJpYWJsZSA9PT0gdm9pZCAwKSB7IG9uVmFyaWFibGUgPSBkZWZhdWx0VmFsdWVGcm9tVmFyaWFibGU7IH1cbiAgICBzd2l0Y2ggKG5vZGUua2luZCkge1xuICAgICAgICBjYXNlICdWYXJpYWJsZSc6XG4gICAgICAgICAgICByZXR1cm4gb25WYXJpYWJsZShub2RlKTtcbiAgICAgICAgY2FzZSAnTnVsbFZhbHVlJzpcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBjYXNlICdJbnRWYWx1ZSc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQobm9kZS52YWx1ZSwgMTApO1xuICAgICAgICBjYXNlICdGbG9hdFZhbHVlJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG5vZGUudmFsdWUpO1xuICAgICAgICBjYXNlICdMaXN0VmFsdWUnOlxuICAgICAgICAgICAgcmV0dXJuIG5vZGUudmFsdWVzLm1hcChmdW5jdGlvbiAodikgeyByZXR1cm4gdmFsdWVGcm9tTm9kZSh2LCBvblZhcmlhYmxlKTsgfSk7XG4gICAgICAgIGNhc2UgJ09iamVjdFZhbHVlJzoge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gbm9kZS5maWVsZHM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkID0gX2FbX2ldO1xuICAgICAgICAgICAgICAgIHZhbHVlW2ZpZWxkLm5hbWUudmFsdWVdID0gdmFsdWVGcm9tTm9kZShmaWVsZC52YWx1ZSwgb25WYXJpYWJsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBub2RlLnZhbHVlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGlyZWN0aXZlSW5mb0Zyb21GaWVsZChmaWVsZCwgdmFyaWFibGVzKSB7XG4gICAgaWYgKGZpZWxkLmRpcmVjdGl2ZXMgJiYgZmllbGQuZGlyZWN0aXZlcy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGRpcmVjdGl2ZU9ial8xID0ge307XG4gICAgICAgIGZpZWxkLmRpcmVjdGl2ZXMuZm9yRWFjaChmdW5jdGlvbiAoZGlyZWN0aXZlKSB7XG4gICAgICAgICAgICBkaXJlY3RpdmVPYmpfMVtkaXJlY3RpdmUubmFtZS52YWx1ZV0gPSBhcmd1bWVudHNPYmplY3RGcm9tRmllbGQoZGlyZWN0aXZlLCB2YXJpYWJsZXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZU9ial8xO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIHNob3VsZEluY2x1ZGUoc2VsZWN0aW9uLCB2YXJpYWJsZXMpIHtcbiAgICBpZiAodmFyaWFibGVzID09PSB2b2lkIDApIHsgdmFyaWFibGVzID0ge307IH1cbiAgICByZXR1cm4gZ2V0SW5jbHVzaW9uRGlyZWN0aXZlcyhzZWxlY3Rpb24uZGlyZWN0aXZlcykuZXZlcnkoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSBfYS5kaXJlY3RpdmUsIGlmQXJndW1lbnQgPSBfYS5pZkFyZ3VtZW50O1xuICAgICAgICB2YXIgZXZhbGVkVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgaWYgKGlmQXJndW1lbnQudmFsdWUua2luZCA9PT0gJ1ZhcmlhYmxlJykge1xuICAgICAgICAgICAgZXZhbGVkVmFsdWUgPSB2YXJpYWJsZXNbaWZBcmd1bWVudC52YWx1ZS5uYW1lLnZhbHVlXTtcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChldmFsZWRWYWx1ZSAhPT0gdm9pZCAwLCAxMykgOiBpbnZhcmlhbnQoZXZhbGVkVmFsdWUgIT09IHZvaWQgMCwgXCJJbnZhbGlkIHZhcmlhYmxlIHJlZmVyZW5jZWQgaW4gQFwiICsgZGlyZWN0aXZlLm5hbWUudmFsdWUgKyBcIiBkaXJlY3RpdmUuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZXZhbGVkVmFsdWUgPSBpZkFyZ3VtZW50LnZhbHVlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmUubmFtZS52YWx1ZSA9PT0gJ3NraXAnID8gIWV2YWxlZFZhbHVlIDogZXZhbGVkVmFsdWU7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXREaXJlY3RpdmVOYW1lcyhkb2MpIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICB2aXNpdChkb2MsIHtcbiAgICAgICAgRGlyZWN0aXZlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgbmFtZXMucHVzaChub2RlLm5hbWUudmFsdWUpO1xuICAgICAgICB9LFxuICAgIH0pO1xuICAgIHJldHVybiBuYW1lcztcbn1cbmZ1bmN0aW9uIGhhc0RpcmVjdGl2ZXMobmFtZXMsIGRvYykge1xuICAgIHJldHVybiBnZXREaXJlY3RpdmVOYW1lcyhkb2MpLnNvbWUoZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIG5hbWVzLmluZGV4T2YobmFtZSkgPiAtMTsgfSk7XG59XG5mdW5jdGlvbiBoYXNDbGllbnRFeHBvcnRzKGRvY3VtZW50KSB7XG4gICAgcmV0dXJuIChkb2N1bWVudCAmJlxuICAgICAgICBoYXNEaXJlY3RpdmVzKFsnY2xpZW50J10sIGRvY3VtZW50KSAmJlxuICAgICAgICBoYXNEaXJlY3RpdmVzKFsnZXhwb3J0J10sIGRvY3VtZW50KSk7XG59XG5mdW5jdGlvbiBpc0luY2x1c2lvbkRpcmVjdGl2ZShfYSkge1xuICAgIHZhciB2YWx1ZSA9IF9hLm5hbWUudmFsdWU7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnc2tpcCcgfHwgdmFsdWUgPT09ICdpbmNsdWRlJztcbn1cbmZ1bmN0aW9uIGdldEluY2x1c2lvbkRpcmVjdGl2ZXMoZGlyZWN0aXZlcykge1xuICAgIHJldHVybiBkaXJlY3RpdmVzID8gZGlyZWN0aXZlcy5maWx0ZXIoaXNJbmNsdXNpb25EaXJlY3RpdmUpLm1hcChmdW5jdGlvbiAoZGlyZWN0aXZlKSB7XG4gICAgICAgIHZhciBkaXJlY3RpdmVBcmd1bWVudHMgPSBkaXJlY3RpdmUuYXJndW1lbnRzO1xuICAgICAgICB2YXIgZGlyZWN0aXZlTmFtZSA9IGRpcmVjdGl2ZS5uYW1lLnZhbHVlO1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZGlyZWN0aXZlQXJndW1lbnRzICYmIGRpcmVjdGl2ZUFyZ3VtZW50cy5sZW5ndGggPT09IDEsIDE0KSA6IGludmFyaWFudChkaXJlY3RpdmVBcmd1bWVudHMgJiYgZGlyZWN0aXZlQXJndW1lbnRzLmxlbmd0aCA9PT0gMSwgXCJJbmNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50cyBmb3IgdGhlIEBcIiArIGRpcmVjdGl2ZU5hbWUgKyBcIiBkaXJlY3RpdmUuXCIpO1xuICAgICAgICB2YXIgaWZBcmd1bWVudCA9IGRpcmVjdGl2ZUFyZ3VtZW50c1swXTtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGlmQXJndW1lbnQubmFtZSAmJiBpZkFyZ3VtZW50Lm5hbWUudmFsdWUgPT09ICdpZicsIDE1KSA6IGludmFyaWFudChpZkFyZ3VtZW50Lm5hbWUgJiYgaWZBcmd1bWVudC5uYW1lLnZhbHVlID09PSAnaWYnLCBcIkludmFsaWQgYXJndW1lbnQgZm9yIHRoZSBAXCIgKyBkaXJlY3RpdmVOYW1lICsgXCIgZGlyZWN0aXZlLlwiKTtcbiAgICAgICAgdmFyIGlmVmFsdWUgPSBpZkFyZ3VtZW50LnZhbHVlO1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoaWZWYWx1ZSAmJlxuICAgICAgICAgICAgKGlmVmFsdWUua2luZCA9PT0gJ1ZhcmlhYmxlJyB8fCBpZlZhbHVlLmtpbmQgPT09ICdCb29sZWFuVmFsdWUnKSwgMTYpIDogaW52YXJpYW50KGlmVmFsdWUgJiZcbiAgICAgICAgICAgIChpZlZhbHVlLmtpbmQgPT09ICdWYXJpYWJsZScgfHwgaWZWYWx1ZS5raW5kID09PSAnQm9vbGVhblZhbHVlJyksIFwiQXJndW1lbnQgZm9yIHRoZSBAXCIgKyBkaXJlY3RpdmVOYW1lICsgXCIgZGlyZWN0aXZlIG11c3QgYmUgYSB2YXJpYWJsZSBvciBhIGJvb2xlYW4gdmFsdWUuXCIpO1xuICAgICAgICByZXR1cm4geyBkaXJlY3RpdmU6IGRpcmVjdGl2ZSwgaWZBcmd1bWVudDogaWZBcmd1bWVudCB9O1xuICAgIH0pIDogW107XG59XG5cbmZ1bmN0aW9uIGdldEZyYWdtZW50UXVlcnlEb2N1bWVudChkb2N1bWVudCwgZnJhZ21lbnROYW1lKSB7XG4gICAgdmFyIGFjdHVhbEZyYWdtZW50TmFtZSA9IGZyYWdtZW50TmFtZTtcbiAgICB2YXIgZnJhZ21lbnRzID0gW107XG4gICAgZG9jdW1lbnQuZGVmaW5pdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xuICAgICAgICBpZiAoZGVmaW5pdGlvbi5raW5kID09PSAnT3BlcmF0aW9uRGVmaW5pdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IG5ldyBJbnZhcmlhbnRFcnJvcigxMSkgOiBuZXcgSW52YXJpYW50RXJyb3IoXCJGb3VuZCBhIFwiICsgZGVmaW5pdGlvbi5vcGVyYXRpb24gKyBcIiBvcGVyYXRpb25cIiArIChkZWZpbml0aW9uLm5hbWUgPyBcIiBuYW1lZCAnXCIgKyBkZWZpbml0aW9uLm5hbWUudmFsdWUgKyBcIidcIiA6ICcnKSArIFwiLiBcIiArXG4gICAgICAgICAgICAgICAgJ05vIG9wZXJhdGlvbnMgYXJlIGFsbG93ZWQgd2hlbiB1c2luZyBhIGZyYWdtZW50IGFzIGEgcXVlcnkuIE9ubHkgZnJhZ21lbnRzIGFyZSBhbGxvd2VkLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZWZpbml0aW9uLmtpbmQgPT09ICdGcmFnbWVudERlZmluaXRpb24nKSB7XG4gICAgICAgICAgICBmcmFnbWVudHMucHVzaChkZWZpbml0aW9uKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh0eXBlb2YgYWN0dWFsRnJhZ21lbnROYW1lID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZnJhZ21lbnRzLmxlbmd0aCA9PT0gMSwgMTIpIDogaW52YXJpYW50KGZyYWdtZW50cy5sZW5ndGggPT09IDEsIFwiRm91bmQgXCIgKyBmcmFnbWVudHMubGVuZ3RoICsgXCIgZnJhZ21lbnRzLiBgZnJhZ21lbnROYW1lYCBtdXN0IGJlIHByb3ZpZGVkIHdoZW4gdGhlcmUgaXMgbm90IGV4YWN0bHkgMSBmcmFnbWVudC5cIik7XG4gICAgICAgIGFjdHVhbEZyYWdtZW50TmFtZSA9IGZyYWdtZW50c1swXS5uYW1lLnZhbHVlO1xuICAgIH1cbiAgICB2YXIgcXVlcnkgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZG9jdW1lbnQpLCB7IGRlZmluaXRpb25zOiBfX3NwcmVhZEFycmF5cyhbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2luZDogJ09wZXJhdGlvbkRlZmluaXRpb24nLFxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogJ3F1ZXJ5JyxcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25TZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAga2luZDogJ1NlbGVjdGlvblNldCcsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kOiAnRnJhZ21lbnRTcHJlYWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZDogJ05hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYWN0dWFsRnJhZ21lbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgIF0sIGRvY3VtZW50LmRlZmluaXRpb25zKSB9KTtcbiAgICByZXR1cm4gcXVlcnk7XG59XG5cbmZ1bmN0aW9uIGFzc2lnbih0YXJnZXQpIHtcbiAgICB2YXIgc291cmNlcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHNvdXJjZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHNvdXJjZXMuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc291cmNlID09PSAndW5kZWZpbmVkJyB8fCBzb3VyY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gZ2V0TXV0YXRpb25EZWZpbml0aW9uKGRvYykge1xuICAgIGNoZWNrRG9jdW1lbnQoZG9jKTtcbiAgICB2YXIgbXV0YXRpb25EZWYgPSBkb2MuZGVmaW5pdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChkZWZpbml0aW9uKSB7XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uLmtpbmQgPT09ICdPcGVyYXRpb25EZWZpbml0aW9uJyAmJlxuICAgICAgICAgICAgZGVmaW5pdGlvbi5vcGVyYXRpb24gPT09ICdtdXRhdGlvbic7XG4gICAgfSlbMF07XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KG11dGF0aW9uRGVmLCAxKSA6IGludmFyaWFudChtdXRhdGlvbkRlZiwgJ011c3QgY29udGFpbiBhIG11dGF0aW9uIGRlZmluaXRpb24uJyk7XG4gICAgcmV0dXJuIG11dGF0aW9uRGVmO1xufVxuZnVuY3Rpb24gY2hlY2tEb2N1bWVudChkb2MpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZG9jICYmIGRvYy5raW5kID09PSAnRG9jdW1lbnQnLCAyKSA6IGludmFyaWFudChkb2MgJiYgZG9jLmtpbmQgPT09ICdEb2N1bWVudCcsIFwiRXhwZWN0aW5nIGEgcGFyc2VkIEdyYXBoUUwgZG9jdW1lbnQuIFBlcmhhcHMgeW91IG5lZWQgdG8gd3JhcCB0aGUgcXVlcnkgc3RyaW5nIGluIGEgXFxcImdxbFxcXCIgdGFnPyBodHRwOi8vZG9jcy5hcG9sbG9zdGFjay5jb20vYXBvbGxvLWNsaWVudC9jb3JlLmh0bWwjZ3FsXCIpO1xuICAgIHZhciBvcGVyYXRpb25zID0gZG9jLmRlZmluaXRpb25zXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQua2luZCAhPT0gJ0ZyYWdtZW50RGVmaW5pdGlvbic7IH0pXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcbiAgICAgICAgaWYgKGRlZmluaXRpb24ua2luZCAhPT0gJ09wZXJhdGlvbkRlZmluaXRpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBuZXcgSW52YXJpYW50RXJyb3IoMykgOiBuZXcgSW52YXJpYW50RXJyb3IoXCJTY2hlbWEgdHlwZSBkZWZpbml0aW9ucyBub3QgYWxsb3dlZCBpbiBxdWVyaWVzLiBGb3VuZDogXFxcIlwiICsgZGVmaW5pdGlvbi5raW5kICsgXCJcXFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uO1xuICAgIH0pO1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IGludmFyaWFudChvcGVyYXRpb25zLmxlbmd0aCA8PSAxLCA0KSA6IGludmFyaWFudChvcGVyYXRpb25zLmxlbmd0aCA8PSAxLCBcIkFtYmlndW91cyBHcmFwaFFMIGRvY3VtZW50OiBjb250YWlucyBcIiArIG9wZXJhdGlvbnMubGVuZ3RoICsgXCIgb3BlcmF0aW9uc1wiKTtcbiAgICByZXR1cm4gZG9jO1xufVxuZnVuY3Rpb24gZ2V0T3BlcmF0aW9uRGVmaW5pdGlvbihkb2MpIHtcbiAgICBjaGVja0RvY3VtZW50KGRvYyk7XG4gICAgcmV0dXJuIGRvYy5kZWZpbml0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKGRlZmluaXRpb24pIHsgcmV0dXJuIGRlZmluaXRpb24ua2luZCA9PT0gJ09wZXJhdGlvbkRlZmluaXRpb24nOyB9KVswXTtcbn1cbmZ1bmN0aW9uIGdldE9wZXJhdGlvbkRlZmluaXRpb25PckRpZShkb2N1bWVudCkge1xuICAgIHZhciBkZWYgPSBnZXRPcGVyYXRpb25EZWZpbml0aW9uKGRvY3VtZW50KTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZGVmLCA1KSA6IGludmFyaWFudChkZWYsIFwiR3JhcGhRTCBkb2N1bWVudCBpcyBtaXNzaW5nIGFuIG9wZXJhdGlvblwiKTtcbiAgICByZXR1cm4gZGVmO1xufVxuZnVuY3Rpb24gZ2V0T3BlcmF0aW9uTmFtZShkb2MpIHtcbiAgICByZXR1cm4gKGRvYy5kZWZpbml0aW9uc1xuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChkZWZpbml0aW9uKSB7XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uLmtpbmQgPT09ICdPcGVyYXRpb25EZWZpbml0aW9uJyAmJiBkZWZpbml0aW9uLm5hbWU7XG4gICAgfSlcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5uYW1lLnZhbHVlOyB9KVswXSB8fCBudWxsKTtcbn1cbmZ1bmN0aW9uIGdldEZyYWdtZW50RGVmaW5pdGlvbnMoZG9jKSB7XG4gICAgcmV0dXJuIGRvYy5kZWZpbml0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKGRlZmluaXRpb24pIHsgcmV0dXJuIGRlZmluaXRpb24ua2luZCA9PT0gJ0ZyYWdtZW50RGVmaW5pdGlvbic7IH0pO1xufVxuZnVuY3Rpb24gZ2V0UXVlcnlEZWZpbml0aW9uKGRvYykge1xuICAgIHZhciBxdWVyeURlZiA9IGdldE9wZXJhdGlvbkRlZmluaXRpb24oZG9jKTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQocXVlcnlEZWYgJiYgcXVlcnlEZWYub3BlcmF0aW9uID09PSAncXVlcnknLCA2KSA6IGludmFyaWFudChxdWVyeURlZiAmJiBxdWVyeURlZi5vcGVyYXRpb24gPT09ICdxdWVyeScsICdNdXN0IGNvbnRhaW4gYSBxdWVyeSBkZWZpbml0aW9uLicpO1xuICAgIHJldHVybiBxdWVyeURlZjtcbn1cbmZ1bmN0aW9uIGdldEZyYWdtZW50RGVmaW5pdGlvbihkb2MpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZG9jLmtpbmQgPT09ICdEb2N1bWVudCcsIDcpIDogaW52YXJpYW50KGRvYy5raW5kID09PSAnRG9jdW1lbnQnLCBcIkV4cGVjdGluZyBhIHBhcnNlZCBHcmFwaFFMIGRvY3VtZW50LiBQZXJoYXBzIHlvdSBuZWVkIHRvIHdyYXAgdGhlIHF1ZXJ5IHN0cmluZyBpbiBhIFxcXCJncWxcXFwiIHRhZz8gaHR0cDovL2RvY3MuYXBvbGxvc3RhY2suY29tL2Fwb2xsby1jbGllbnQvY29yZS5odG1sI2dxbFwiKTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBpbnZhcmlhbnQoZG9jLmRlZmluaXRpb25zLmxlbmd0aCA8PSAxLCA4KSA6IGludmFyaWFudChkb2MuZGVmaW5pdGlvbnMubGVuZ3RoIDw9IDEsICdGcmFnbWVudCBtdXN0IGhhdmUgZXhhY3RseSBvbmUgZGVmaW5pdGlvbi4nKTtcbiAgICB2YXIgZnJhZ21lbnREZWYgPSBkb2MuZGVmaW5pdGlvbnNbMF07XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gaW52YXJpYW50KGZyYWdtZW50RGVmLmtpbmQgPT09ICdGcmFnbWVudERlZmluaXRpb24nLCA5KSA6IGludmFyaWFudChmcmFnbWVudERlZi5raW5kID09PSAnRnJhZ21lbnREZWZpbml0aW9uJywgJ011c3QgYmUgYSBmcmFnbWVudCBkZWZpbml0aW9uLicpO1xuICAgIHJldHVybiBmcmFnbWVudERlZjtcbn1cbmZ1bmN0aW9uIGdldE1haW5EZWZpbml0aW9uKHF1ZXJ5RG9jKSB7XG4gICAgY2hlY2tEb2N1bWVudChxdWVyeURvYyk7XG4gICAgdmFyIGZyYWdtZW50RGVmaW5pdGlvbjtcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gcXVlcnlEb2MuZGVmaW5pdGlvbnM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBkZWZpbml0aW9uID0gX2FbX2ldO1xuICAgICAgICBpZiAoZGVmaW5pdGlvbi5raW5kID09PSAnT3BlcmF0aW9uRGVmaW5pdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBvcGVyYXRpb24gPSBkZWZpbml0aW9uLm9wZXJhdGlvbjtcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb24gPT09ICdxdWVyeScgfHxcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24gPT09ICdtdXRhdGlvbicgfHxcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24gPT09ICdzdWJzY3JpcHRpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlZmluaXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZmluaXRpb24ua2luZCA9PT0gJ0ZyYWdtZW50RGVmaW5pdGlvbicgJiYgIWZyYWdtZW50RGVmaW5pdGlvbikge1xuICAgICAgICAgICAgZnJhZ21lbnREZWZpbml0aW9uID0gZGVmaW5pdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZnJhZ21lbnREZWZpbml0aW9uKSB7XG4gICAgICAgIHJldHVybiBmcmFnbWVudERlZmluaXRpb247XG4gICAgfVxuICAgIHRocm93IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IG5ldyBJbnZhcmlhbnRFcnJvcigxMCkgOiBuZXcgSW52YXJpYW50RXJyb3IoJ0V4cGVjdGVkIGEgcGFyc2VkIEdyYXBoUUwgcXVlcnkgd2l0aCBhIHF1ZXJ5LCBtdXRhdGlvbiwgc3Vic2NyaXB0aW9uLCBvciBhIGZyYWdtZW50LicpO1xufVxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRNYXAoZnJhZ21lbnRzKSB7XG4gICAgaWYgKGZyYWdtZW50cyA9PT0gdm9pZCAwKSB7IGZyYWdtZW50cyA9IFtdOyB9XG4gICAgdmFyIHN5bVRhYmxlID0ge307XG4gICAgZnJhZ21lbnRzLmZvckVhY2goZnVuY3Rpb24gKGZyYWdtZW50KSB7XG4gICAgICAgIHN5bVRhYmxlW2ZyYWdtZW50Lm5hbWUudmFsdWVdID0gZnJhZ21lbnQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN5bVRhYmxlO1xufVxuZnVuY3Rpb24gZ2V0RGVmYXVsdFZhbHVlcyhkZWZpbml0aW9uKSB7XG4gICAgaWYgKGRlZmluaXRpb24gJiZcbiAgICAgICAgZGVmaW5pdGlvbi52YXJpYWJsZURlZmluaXRpb25zICYmXG4gICAgICAgIGRlZmluaXRpb24udmFyaWFibGVEZWZpbml0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRWYWx1ZXMgPSBkZWZpbml0aW9uLnZhcmlhYmxlRGVmaW5pdGlvbnNcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICB2YXIgZGVmYXVsdFZhbHVlID0gX2EuZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICB2YXIgdmFyaWFibGUgPSBfYS52YXJpYWJsZSwgZGVmYXVsdFZhbHVlID0gX2EuZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgdmFyIGRlZmF1bHRWYWx1ZU9iaiA9IHt9O1xuICAgICAgICAgICAgdmFsdWVUb09iamVjdFJlcHJlc2VudGF0aW9uKGRlZmF1bHRWYWx1ZU9iaiwgdmFyaWFibGUubmFtZSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWVPYmo7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYXNzaWduLmFwcGx5KHZvaWQgMCwgX19zcHJlYWRBcnJheXMoW3t9XSwgZGVmYXVsdFZhbHVlcykpO1xuICAgIH1cbiAgICByZXR1cm4ge307XG59XG5mdW5jdGlvbiB2YXJpYWJsZXNJbk9wZXJhdGlvbihvcGVyYXRpb24pIHtcbiAgICB2YXIgbmFtZXMgPSBuZXcgU2V0KCk7XG4gICAgaWYgKG9wZXJhdGlvbi52YXJpYWJsZURlZmluaXRpb25zKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBvcGVyYXRpb24udmFyaWFibGVEZWZpbml0aW9uczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBkZWZpbml0aW9uID0gX2FbX2ldO1xuICAgICAgICAgICAgbmFtZXMuYWRkKGRlZmluaXRpb24udmFyaWFibGUubmFtZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJJblBsYWNlKGFycmF5LCB0ZXN0LCBjb250ZXh0KSB7XG4gICAgdmFyIHRhcmdldCA9IDA7XG4gICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSwgaSkge1xuICAgICAgICBpZiAodGVzdC5jYWxsKHRoaXMsIGVsZW0sIGksIGFycmF5KSkge1xuICAgICAgICAgICAgYXJyYXlbdGFyZ2V0KytdID0gZWxlbTtcbiAgICAgICAgfVxuICAgIH0sIGNvbnRleHQpO1xuICAgIGFycmF5Lmxlbmd0aCA9IHRhcmdldDtcbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbnZhciBUWVBFTkFNRV9GSUVMRCA9IHtcbiAgICBraW5kOiAnRmllbGQnLFxuICAgIG5hbWU6IHtcbiAgICAgICAga2luZDogJ05hbWUnLFxuICAgICAgICB2YWx1ZTogJ19fdHlwZW5hbWUnLFxuICAgIH0sXG59O1xuZnVuY3Rpb24gaXNFbXB0eShvcCwgZnJhZ21lbnRzKSB7XG4gICAgcmV0dXJuIG9wLnNlbGVjdGlvblNldC5zZWxlY3Rpb25zLmV2ZXJ5KGZ1bmN0aW9uIChzZWxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbi5raW5kID09PSAnRnJhZ21lbnRTcHJlYWQnICYmXG4gICAgICAgICAgICBpc0VtcHR5KGZyYWdtZW50c1tzZWxlY3Rpb24ubmFtZS52YWx1ZV0sIGZyYWdtZW50cyk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBudWxsSWZEb2NJc0VtcHR5KGRvYykge1xuICAgIHJldHVybiBpc0VtcHR5KGdldE9wZXJhdGlvbkRlZmluaXRpb24oZG9jKSB8fCBnZXRGcmFnbWVudERlZmluaXRpb24oZG9jKSwgY3JlYXRlRnJhZ21lbnRNYXAoZ2V0RnJhZ21lbnREZWZpbml0aW9ucyhkb2MpKSlcbiAgICAgICAgPyBudWxsXG4gICAgICAgIDogZG9jO1xufVxuZnVuY3Rpb24gZ2V0RGlyZWN0aXZlTWF0Y2hlcihkaXJlY3RpdmVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGRpcmVjdGl2ZU1hdGNoZXIoZGlyZWN0aXZlKSB7XG4gICAgICAgIHJldHVybiBkaXJlY3RpdmVzLnNvbWUoZnVuY3Rpb24gKGRpcikge1xuICAgICAgICAgICAgcmV0dXJuIChkaXIubmFtZSAmJiBkaXIubmFtZSA9PT0gZGlyZWN0aXZlLm5hbWUudmFsdWUpIHx8XG4gICAgICAgICAgICAgICAgKGRpci50ZXN0ICYmIGRpci50ZXN0KGRpcmVjdGl2ZSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gcmVtb3ZlRGlyZWN0aXZlc0Zyb21Eb2N1bWVudChkaXJlY3RpdmVzLCBkb2MpIHtcbiAgICB2YXIgdmFyaWFibGVzSW5Vc2UgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHZhciB2YXJpYWJsZXNUb1JlbW92ZSA9IFtdO1xuICAgIHZhciBmcmFnbWVudFNwcmVhZHNJblVzZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdmFyIGZyYWdtZW50U3ByZWFkc1RvUmVtb3ZlID0gW107XG4gICAgdmFyIG1vZGlmaWVkRG9jID0gbnVsbElmRG9jSXNFbXB0eSh2aXNpdChkb2MsIHtcbiAgICAgICAgVmFyaWFibGU6IHtcbiAgICAgICAgICAgIGVudGVyOiBmdW5jdGlvbiAobm9kZSwgX2tleSwgcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudC5raW5kICE9PSAnVmFyaWFibGVEZWZpbml0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZXNJblVzZVtub2RlLm5hbWUudmFsdWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBGaWVsZDoge1xuICAgICAgICAgICAgZW50ZXI6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZXMgJiYgbm9kZS5kaXJlY3RpdmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzaG91bGRSZW1vdmVGaWVsZCA9IGRpcmVjdGl2ZXMuc29tZShmdW5jdGlvbiAoZGlyZWN0aXZlKSB7IHJldHVybiBkaXJlY3RpdmUucmVtb3ZlOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNob3VsZFJlbW92ZUZpZWxkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmRpcmVjdGl2ZXMgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuZGlyZWN0aXZlcy5zb21lKGdldERpcmVjdGl2ZU1hdGNoZXIoZGlyZWN0aXZlcykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5hcmd1bWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmFyZ3VtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZy52YWx1ZS5raW5kID09PSAnVmFyaWFibGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZXNUb1JlbW92ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBhcmcudmFsdWUubmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5zZWxlY3Rpb25TZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRBbGxGcmFnbWVudFNwcmVhZHNGcm9tU2VsZWN0aW9uU2V0KG5vZGUuc2VsZWN0aW9uU2V0KS5mb3JFYWNoKGZ1bmN0aW9uIChmcmFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYWdtZW50U3ByZWFkc1RvUmVtb3ZlLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZnJhZy5uYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRnJhZ21lbnRTcHJlYWQ6IHtcbiAgICAgICAgICAgIGVudGVyOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGZyYWdtZW50U3ByZWFkc0luVXNlW25vZGUubmFtZS52YWx1ZV0gPSB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRGlyZWN0aXZlOiB7XG4gICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2V0RGlyZWN0aXZlTWF0Y2hlcihkaXJlY3RpdmVzKShub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0pKTtcbiAgICBpZiAobW9kaWZpZWREb2MgJiZcbiAgICAgICAgZmlsdGVySW5QbGFjZSh2YXJpYWJsZXNUb1JlbW92ZSwgZnVuY3Rpb24gKHYpIHsgcmV0dXJuICF2YXJpYWJsZXNJblVzZVt2Lm5hbWVdOyB9KS5sZW5ndGgpIHtcbiAgICAgICAgbW9kaWZpZWREb2MgPSByZW1vdmVBcmd1bWVudHNGcm9tRG9jdW1lbnQodmFyaWFibGVzVG9SZW1vdmUsIG1vZGlmaWVkRG9jKTtcbiAgICB9XG4gICAgaWYgKG1vZGlmaWVkRG9jICYmXG4gICAgICAgIGZpbHRlckluUGxhY2UoZnJhZ21lbnRTcHJlYWRzVG9SZW1vdmUsIGZ1bmN0aW9uIChmcykgeyByZXR1cm4gIWZyYWdtZW50U3ByZWFkc0luVXNlW2ZzLm5hbWVdOyB9KVxuICAgICAgICAgICAgLmxlbmd0aCkge1xuICAgICAgICBtb2RpZmllZERvYyA9IHJlbW92ZUZyYWdtZW50U3ByZWFkRnJvbURvY3VtZW50KGZyYWdtZW50U3ByZWFkc1RvUmVtb3ZlLCBtb2RpZmllZERvYyk7XG4gICAgfVxuICAgIHJldHVybiBtb2RpZmllZERvYztcbn1cbmZ1bmN0aW9uIGFkZFR5cGVuYW1lVG9Eb2N1bWVudChkb2MpIHtcbiAgICByZXR1cm4gdmlzaXQoY2hlY2tEb2N1bWVudChkb2MpLCB7XG4gICAgICAgIFNlbGVjdGlvblNldDoge1xuICAgICAgICAgICAgZW50ZXI6IGZ1bmN0aW9uIChub2RlLCBfa2V5LCBwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50ICYmXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5raW5kID09PSAnT3BlcmF0aW9uRGVmaW5pdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0aW9ucyA9IG5vZGUuc2VsZWN0aW9ucztcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGVjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2tpcCA9IHNlbGVjdGlvbnMuc29tZShmdW5jdGlvbiAoc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoaXNGaWVsZChzZWxlY3Rpb24pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoc2VsZWN0aW9uLm5hbWUudmFsdWUgPT09ICdfX3R5cGVuYW1lJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5uYW1lLnZhbHVlLmxhc3RJbmRleE9mKCdfXycsIDApID09PSAwKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHNraXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGlzRmllbGQoZmllbGQpICYmXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLmRpcmVjdGl2ZXMgJiZcbiAgICAgICAgICAgICAgICAgICAgZmllbGQuZGlyZWN0aXZlcy5zb21lKGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLm5hbWUudmFsdWUgPT09ICdleHBvcnQnOyB9KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgbm9kZSksIHsgc2VsZWN0aW9uczogX19zcHJlYWRBcnJheXMoc2VsZWN0aW9ucywgW1RZUEVOQU1FX0ZJRUxEXSkgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0pO1xufVxudmFyIGNvbm5lY3Rpb25SZW1vdmVDb25maWcgPSB7XG4gICAgdGVzdDogZnVuY3Rpb24gKGRpcmVjdGl2ZSkge1xuICAgICAgICB2YXIgd2lsbFJlbW92ZSA9IGRpcmVjdGl2ZS5uYW1lLnZhbHVlID09PSAnY29ubmVjdGlvbic7XG4gICAgICAgIGlmICh3aWxsUmVtb3ZlKSB7XG4gICAgICAgICAgICBpZiAoIWRpcmVjdGl2ZS5hcmd1bWVudHMgfHxcbiAgICAgICAgICAgICAgICAhZGlyZWN0aXZlLmFyZ3VtZW50cy5zb21lKGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIGFyZy5uYW1lLnZhbHVlID09PSAna2V5JzsgfSkpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgfHwgaW52YXJpYW50Lndhcm4oJ1JlbW92aW5nIGFuIEBjb25uZWN0aW9uIGRpcmVjdGl2ZSBldmVuIHRob3VnaCBpdCBkb2VzIG5vdCBoYXZlIGEga2V5LiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1lvdSBtYXkgd2FudCB0byB1c2UgdGhlIGtleSBwYXJhbWV0ZXIgdG8gc3BlY2lmeSBhIHN0b3JlIGtleS4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd2lsbFJlbW92ZTtcbiAgICB9LFxufTtcbmZ1bmN0aW9uIHJlbW92ZUNvbm5lY3Rpb25EaXJlY3RpdmVGcm9tRG9jdW1lbnQoZG9jKSB7XG4gICAgcmV0dXJuIHJlbW92ZURpcmVjdGl2ZXNGcm9tRG9jdW1lbnQoW2Nvbm5lY3Rpb25SZW1vdmVDb25maWddLCBjaGVja0RvY3VtZW50KGRvYykpO1xufVxuZnVuY3Rpb24gaGFzRGlyZWN0aXZlc0luU2VsZWN0aW9uU2V0KGRpcmVjdGl2ZXMsIHNlbGVjdGlvblNldCwgbmVzdGVkQ2hlY2spIHtcbiAgICBpZiAobmVzdGVkQ2hlY2sgPT09IHZvaWQgMCkgeyBuZXN0ZWRDaGVjayA9IHRydWU7IH1cbiAgICByZXR1cm4gKHNlbGVjdGlvblNldCAmJlxuICAgICAgICBzZWxlY3Rpb25TZXQuc2VsZWN0aW9ucyAmJlxuICAgICAgICBzZWxlY3Rpb25TZXQuc2VsZWN0aW9ucy5zb21lKGZ1bmN0aW9uIChzZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBoYXNEaXJlY3RpdmVzSW5TZWxlY3Rpb24oZGlyZWN0aXZlcywgc2VsZWN0aW9uLCBuZXN0ZWRDaGVjayk7XG4gICAgICAgIH0pKTtcbn1cbmZ1bmN0aW9uIGhhc0RpcmVjdGl2ZXNJblNlbGVjdGlvbihkaXJlY3RpdmVzLCBzZWxlY3Rpb24sIG5lc3RlZENoZWNrKSB7XG4gICAgaWYgKG5lc3RlZENoZWNrID09PSB2b2lkIDApIHsgbmVzdGVkQ2hlY2sgPSB0cnVlOyB9XG4gICAgaWYgKCFpc0ZpZWxkKHNlbGVjdGlvbikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICghc2VsZWN0aW9uLmRpcmVjdGl2ZXMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gKHNlbGVjdGlvbi5kaXJlY3RpdmVzLnNvbWUoZ2V0RGlyZWN0aXZlTWF0Y2hlcihkaXJlY3RpdmVzKSkgfHxcbiAgICAgICAgKG5lc3RlZENoZWNrICYmXG4gICAgICAgICAgICBoYXNEaXJlY3RpdmVzSW5TZWxlY3Rpb25TZXQoZGlyZWN0aXZlcywgc2VsZWN0aW9uLnNlbGVjdGlvblNldCwgbmVzdGVkQ2hlY2spKSk7XG59XG5mdW5jdGlvbiBnZXREaXJlY3RpdmVzRnJvbURvY3VtZW50KGRpcmVjdGl2ZXMsIGRvYykge1xuICAgIGNoZWNrRG9jdW1lbnQoZG9jKTtcbiAgICB2YXIgcGFyZW50UGF0aDtcbiAgICByZXR1cm4gbnVsbElmRG9jSXNFbXB0eSh2aXNpdChkb2MsIHtcbiAgICAgICAgU2VsZWN0aW9uU2V0OiB7XG4gICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24gKG5vZGUsIF9rZXksIF9wYXJlbnQsIHBhdGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFBhdGggPSBwYXRoLmpvaW4oJy0nKTtcbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudFBhdGggfHxcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhdGggPT09IHBhcmVudFBhdGggfHxcbiAgICAgICAgICAgICAgICAgICAgIWN1cnJlbnRQYXRoLnN0YXJ0c1dpdGgocGFyZW50UGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuc2VsZWN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdGlvbnNXaXRoRGlyZWN0aXZlcyA9IG5vZGUuc2VsZWN0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKHNlbGVjdGlvbikgeyByZXR1cm4gaGFzRGlyZWN0aXZlc0luU2VsZWN0aW9uKGRpcmVjdGl2ZXMsIHNlbGVjdGlvbik7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc0RpcmVjdGl2ZXNJblNlbGVjdGlvblNldChkaXJlY3RpdmVzLCBub2RlLCBmYWxzZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRQYXRoID0gY3VycmVudFBhdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIG5vZGUpLCB7IHNlbGVjdGlvbnM6IHNlbGVjdGlvbnNXaXRoRGlyZWN0aXZlcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9KSk7XG59XG5mdW5jdGlvbiBnZXRBcmd1bWVudE1hdGNoZXIoY29uZmlnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGFyZ3VtZW50TWF0Y2hlcihhcmd1bWVudCkge1xuICAgICAgICByZXR1cm4gY29uZmlnLnNvbWUoZnVuY3Rpb24gKGFDb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmd1bWVudC52YWx1ZSAmJlxuICAgICAgICAgICAgICAgIGFyZ3VtZW50LnZhbHVlLmtpbmQgPT09ICdWYXJpYWJsZScgJiZcbiAgICAgICAgICAgICAgICBhcmd1bWVudC52YWx1ZS5uYW1lICYmXG4gICAgICAgICAgICAgICAgKGFDb25maWcubmFtZSA9PT0gYXJndW1lbnQudmFsdWUubmFtZS52YWx1ZSB8fFxuICAgICAgICAgICAgICAgICAgICAoYUNvbmZpZy50ZXN0ICYmIGFDb25maWcudGVzdChhcmd1bWVudCkpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHJlbW92ZUFyZ3VtZW50c0Zyb21Eb2N1bWVudChjb25maWcsIGRvYykge1xuICAgIHZhciBhcmdNYXRjaGVyID0gZ2V0QXJndW1lbnRNYXRjaGVyKGNvbmZpZyk7XG4gICAgcmV0dXJuIG51bGxJZkRvY0lzRW1wdHkodmlzaXQoZG9jLCB7XG4gICAgICAgIE9wZXJhdGlvbkRlZmluaXRpb246IHtcbiAgICAgICAgICAgIGVudGVyOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgbm9kZSksIHsgdmFyaWFibGVEZWZpbml0aW9uczogbm9kZS52YXJpYWJsZURlZmluaXRpb25zLmZpbHRlcihmdW5jdGlvbiAodmFyRGVmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWNvbmZpZy5zb21lKGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIGFyZy5uYW1lID09PSB2YXJEZWYudmFyaWFibGUubmFtZS52YWx1ZTsgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRmllbGQ6IHtcbiAgICAgICAgICAgIGVudGVyOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIHZhciBzaG91bGRSZW1vdmVGaWVsZCA9IGNvbmZpZy5zb21lKGZ1bmN0aW9uIChhcmdDb25maWcpIHsgcmV0dXJuIGFyZ0NvbmZpZy5yZW1vdmU7IH0pO1xuICAgICAgICAgICAgICAgIGlmIChzaG91bGRSZW1vdmVGaWVsZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJnTWF0Y2hDb3VudF8xID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hcmd1bWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJnTWF0Y2hlcihhcmcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJnTWF0Y2hDb3VudF8xICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJnTWF0Y2hDb3VudF8xID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIEFyZ3VtZW50OiB7XG4gICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJnTWF0Y2hlcihub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0pKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZUZyYWdtZW50U3ByZWFkRnJvbURvY3VtZW50KGNvbmZpZywgZG9jKSB7XG4gICAgZnVuY3Rpb24gZW50ZXIobm9kZSkge1xuICAgICAgICBpZiAoY29uZmlnLnNvbWUoZnVuY3Rpb24gKGRlZikgeyByZXR1cm4gZGVmLm5hbWUgPT09IG5vZGUubmFtZS52YWx1ZTsgfSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsSWZEb2NJc0VtcHR5KHZpc2l0KGRvYywge1xuICAgICAgICBGcmFnbWVudFNwcmVhZDogeyBlbnRlcjogZW50ZXIgfSxcbiAgICAgICAgRnJhZ21lbnREZWZpbml0aW9uOiB7IGVudGVyOiBlbnRlciB9LFxuICAgIH0pKTtcbn1cbmZ1bmN0aW9uIGdldEFsbEZyYWdtZW50U3ByZWFkc0Zyb21TZWxlY3Rpb25TZXQoc2VsZWN0aW9uU2V0KSB7XG4gICAgdmFyIGFsbEZyYWdtZW50cyA9IFtdO1xuICAgIHNlbGVjdGlvblNldC5zZWxlY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKHNlbGVjdGlvbikge1xuICAgICAgICBpZiAoKGlzRmllbGQoc2VsZWN0aW9uKSB8fCBpc0lubGluZUZyYWdtZW50KHNlbGVjdGlvbikpICYmXG4gICAgICAgICAgICBzZWxlY3Rpb24uc2VsZWN0aW9uU2V0KSB7XG4gICAgICAgICAgICBnZXRBbGxGcmFnbWVudFNwcmVhZHNGcm9tU2VsZWN0aW9uU2V0KHNlbGVjdGlvbi5zZWxlY3Rpb25TZXQpLmZvckVhY2goZnVuY3Rpb24gKGZyYWcpIHsgcmV0dXJuIGFsbEZyYWdtZW50cy5wdXNoKGZyYWcpOyB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzZWxlY3Rpb24ua2luZCA9PT0gJ0ZyYWdtZW50U3ByZWFkJykge1xuICAgICAgICAgICAgYWxsRnJhZ21lbnRzLnB1c2goc2VsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBhbGxGcmFnbWVudHM7XG59XG5mdW5jdGlvbiBidWlsZFF1ZXJ5RnJvbVNlbGVjdGlvblNldChkb2N1bWVudCkge1xuICAgIHZhciBkZWZpbml0aW9uID0gZ2V0TWFpbkRlZmluaXRpb24oZG9jdW1lbnQpO1xuICAgIHZhciBkZWZpbml0aW9uT3BlcmF0aW9uID0gZGVmaW5pdGlvbi5vcGVyYXRpb247XG4gICAgaWYgKGRlZmluaXRpb25PcGVyYXRpb24gPT09ICdxdWVyeScpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50O1xuICAgIH1cbiAgICB2YXIgbW9kaWZpZWREb2MgPSB2aXNpdChkb2N1bWVudCwge1xuICAgICAgICBPcGVyYXRpb25EZWZpbml0aW9uOiB7XG4gICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIG5vZGUpLCB7IG9wZXJhdGlvbjogJ3F1ZXJ5JyB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIG1vZGlmaWVkRG9jO1xufVxuZnVuY3Rpb24gcmVtb3ZlQ2xpZW50U2V0c0Zyb21Eb2N1bWVudChkb2N1bWVudCkge1xuICAgIGNoZWNrRG9jdW1lbnQoZG9jdW1lbnQpO1xuICAgIHZhciBtb2RpZmllZERvYyA9IHJlbW92ZURpcmVjdGl2ZXNGcm9tRG9jdW1lbnQoW1xuICAgICAgICB7XG4gICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbiAoZGlyZWN0aXZlKSB7IHJldHVybiBkaXJlY3RpdmUubmFtZS52YWx1ZSA9PT0gJ2NsaWVudCc7IH0sXG4gICAgICAgICAgICByZW1vdmU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgXSwgZG9jdW1lbnQpO1xuICAgIGlmIChtb2RpZmllZERvYykge1xuICAgICAgICBtb2RpZmllZERvYyA9IHZpc2l0KG1vZGlmaWVkRG9jLCB7XG4gICAgICAgICAgICBGcmFnbWVudERlZmluaXRpb246IHtcbiAgICAgICAgICAgICAgICBlbnRlcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuc2VsZWN0aW9uU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNUeXBlbmFtZU9ubHkgPSBub2RlLnNlbGVjdGlvblNldC5zZWxlY3Rpb25zLmV2ZXJ5KGZ1bmN0aW9uIChzZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNGaWVsZChzZWxlY3Rpb24pICYmIHNlbGVjdGlvbi5uYW1lLnZhbHVlID09PSAnX190eXBlbmFtZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1R5cGVuYW1lT25seSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbW9kaWZpZWREb2M7XG59XG5cbnZhciBjYW5Vc2VXZWFrTWFwID0gdHlwZW9mIFdlYWtNYXAgPT09ICdmdW5jdGlvbicgJiYgISh0eXBlb2YgbmF2aWdhdG9yID09PSAnb2JqZWN0JyAmJlxuICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnKTtcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmZ1bmN0aW9uIGNsb25lRGVlcCh2YWx1ZSkge1xuICAgIHJldHVybiBjbG9uZURlZXBIZWxwZXIodmFsdWUsIG5ldyBNYXAoKSk7XG59XG5mdW5jdGlvbiBjbG9uZURlZXBIZWxwZXIodmFsLCBzZWVuKSB7XG4gICAgc3dpdGNoICh0b1N0cmluZy5jYWxsKHZhbCkpIHtcbiAgICAgICAgY2FzZSBcIltvYmplY3QgQXJyYXldXCI6IHtcbiAgICAgICAgICAgIGlmIChzZWVuLmhhcyh2YWwpKVxuICAgICAgICAgICAgICAgIHJldHVybiBzZWVuLmdldCh2YWwpO1xuICAgICAgICAgICAgdmFyIGNvcHlfMSA9IHZhbC5zbGljZSgwKTtcbiAgICAgICAgICAgIHNlZW4uc2V0KHZhbCwgY29weV8xKTtcbiAgICAgICAgICAgIGNvcHlfMS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCwgaSkge1xuICAgICAgICAgICAgICAgIGNvcHlfMVtpXSA9IGNsb25lRGVlcEhlbHBlcihjaGlsZCwgc2Vlbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBjb3B5XzE7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcIltvYmplY3QgT2JqZWN0XVwiOiB7XG4gICAgICAgICAgICBpZiAoc2Vlbi5oYXModmFsKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gc2Vlbi5nZXQodmFsKTtcbiAgICAgICAgICAgIHZhciBjb3B5XzIgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpKTtcbiAgICAgICAgICAgIHNlZW4uc2V0KHZhbCwgY29weV8yKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHZhbCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY29weV8yW2tleV0gPSBjbG9uZURlZXBIZWxwZXIodmFsW2tleV0sIHNlZW4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gY29weV8yO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0RW52KCkge1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MuZW52Lk5PREVfRU5WO1xuICAgIH1cbiAgICByZXR1cm4gJ2RldmVsb3BtZW50Jztcbn1cbmZ1bmN0aW9uIGlzRW52KGVudikge1xuICAgIHJldHVybiBnZXRFbnYoKSA9PT0gZW52O1xufVxuZnVuY3Rpb24gaXNQcm9kdWN0aW9uKCkge1xuICAgIHJldHVybiBpc0VudigncHJvZHVjdGlvbicpID09PSB0cnVlO1xufVxuZnVuY3Rpb24gaXNEZXZlbG9wbWVudCgpIHtcbiAgICByZXR1cm4gaXNFbnYoJ2RldmVsb3BtZW50JykgPT09IHRydWU7XG59XG5mdW5jdGlvbiBpc1Rlc3QoKSB7XG4gICAgcmV0dXJuIGlzRW52KCd0ZXN0JykgPT09IHRydWU7XG59XG5cbmZ1bmN0aW9uIHRyeUZ1bmN0aW9uT3JMb2dFcnJvcihmKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGYoKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBncmFwaFFMUmVzdWx0SGFzRXJyb3IocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdC5lcnJvcnMgJiYgcmVzdWx0LmVycm9ycy5sZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGRlZXBGcmVlemUobykge1xuICAgIE9iamVjdC5mcmVlemUobyk7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobykuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICBpZiAob1twcm9wXSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgKHR5cGVvZiBvW3Byb3BdID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb1twcm9wXSA9PT0gJ2Z1bmN0aW9uJykgJiZcbiAgICAgICAgICAgICFPYmplY3QuaXNGcm96ZW4ob1twcm9wXSkpIHtcbiAgICAgICAgICAgIGRlZXBGcmVlemUob1twcm9wXSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbztcbn1cbmZ1bmN0aW9uIG1heWJlRGVlcEZyZWV6ZShvYmopIHtcbiAgICBpZiAoaXNEZXZlbG9wbWVudCgpIHx8IGlzVGVzdCgpKSB7XG4gICAgICAgIHZhciBzeW1ib2xJc1BvbHlmaWxsZWQgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2woJycpID09PSAnc3RyaW5nJztcbiAgICAgICAgaWYgKCFzeW1ib2xJc1BvbHlmaWxsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWVwRnJlZXplKG9iaik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn1cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIG1lcmdlRGVlcCgpIHtcbiAgICB2YXIgc291cmNlcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHNvdXJjZXNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlRGVlcEFycmF5KHNvdXJjZXMpO1xufVxuZnVuY3Rpb24gbWVyZ2VEZWVwQXJyYXkoc291cmNlcykge1xuICAgIHZhciB0YXJnZXQgPSBzb3VyY2VzWzBdIHx8IHt9O1xuICAgIHZhciBjb3VudCA9IHNvdXJjZXMubGVuZ3RoO1xuICAgIGlmIChjb3VudCA+IDEpIHtcbiAgICAgICAgdmFyIHBhc3RDb3BpZXMgPSBbXTtcbiAgICAgICAgdGFyZ2V0ID0gc2hhbGxvd0NvcHlGb3JNZXJnZSh0YXJnZXQsIHBhc3RDb3BpZXMpO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IG1lcmdlSGVscGVyKHRhcmdldCwgc291cmNlc1tpXSwgcGFzdENvcGllcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XG59XG5mdW5jdGlvbiBtZXJnZUhlbHBlcih0YXJnZXQsIHNvdXJjZSwgcGFzdENvcGllcykge1xuICAgIGlmIChpc09iamVjdChzb3VyY2UpICYmIGlzT2JqZWN0KHRhcmdldCkpIHtcbiAgICAgICAgaWYgKE9iamVjdC5pc0V4dGVuc2libGUgJiYgIU9iamVjdC5pc0V4dGVuc2libGUodGFyZ2V0KSkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gc2hhbGxvd0NvcHlGb3JNZXJnZSh0YXJnZXQsIHBhc3RDb3BpZXMpO1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlS2V5KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlVmFsdWUgPSBzb3VyY2Vbc291cmNlS2V5XTtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHRhcmdldCwgc291cmNlS2V5KSkge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRWYWx1ZSA9IHRhcmdldFtzb3VyY2VLZXldO1xuICAgICAgICAgICAgICAgIGlmIChzb3VyY2VWYWx1ZSAhPT0gdGFyZ2V0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W3NvdXJjZUtleV0gPSBtZXJnZUhlbHBlcihzaGFsbG93Q29weUZvck1lcmdlKHRhcmdldFZhbHVlLCBwYXN0Q29waWVzKSwgc291cmNlVmFsdWUsIHBhc3RDb3BpZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtzb3VyY2VLZXldID0gc291cmNlVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlO1xufVxuZnVuY3Rpb24gc2hhbGxvd0NvcHlGb3JNZXJnZSh2YWx1ZSwgcGFzdENvcGllcykge1xuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgICAgIHBhc3RDb3BpZXMuaW5kZXhPZih2YWx1ZSkgPCAwKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gX19hc3NpZ24oeyBfX3Byb3RvX186IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSkgfSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHBhc3RDb3BpZXMucHVzaCh2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn1cblxudmFyIGhhdmVXYXJuZWQgPSBPYmplY3QuY3JlYXRlKHt9KTtcbmZ1bmN0aW9uIHdhcm5PbmNlSW5EZXZlbG9wbWVudChtc2csIHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PT0gdm9pZCAwKSB7IHR5cGUgPSAnd2Fybic7IH1cbiAgICBpZiAoIWlzUHJvZHVjdGlvbigpICYmICFoYXZlV2FybmVkW21zZ10pIHtcbiAgICAgICAgaWYgKCFpc1Rlc3QoKSkge1xuICAgICAgICAgICAgaGF2ZVdhcm5lZFttc2ddID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHN0cmlwU3ltYm9scyhkYXRhKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuXG5leHBvcnQgeyBhZGRUeXBlbmFtZVRvRG9jdW1lbnQsIGFyZ3VtZW50c09iamVjdEZyb21GaWVsZCwgYXNzaWduLCBidWlsZFF1ZXJ5RnJvbVNlbGVjdGlvblNldCwgY2FuVXNlV2Vha01hcCwgY2hlY2tEb2N1bWVudCwgY2xvbmVEZWVwLCBjcmVhdGVGcmFnbWVudE1hcCwgZ2V0RGVmYXVsdFZhbHVlcywgZ2V0RGlyZWN0aXZlSW5mb0Zyb21GaWVsZCwgZ2V0RGlyZWN0aXZlTmFtZXMsIGdldERpcmVjdGl2ZXNGcm9tRG9jdW1lbnQsIGdldEVudiwgZ2V0RnJhZ21lbnREZWZpbml0aW9uLCBnZXRGcmFnbWVudERlZmluaXRpb25zLCBnZXRGcmFnbWVudFF1ZXJ5RG9jdW1lbnQsIGdldEluY2x1c2lvbkRpcmVjdGl2ZXMsIGdldE1haW5EZWZpbml0aW9uLCBnZXRNdXRhdGlvbkRlZmluaXRpb24sIGdldE9wZXJhdGlvbkRlZmluaXRpb24sIGdldE9wZXJhdGlvbkRlZmluaXRpb25PckRpZSwgZ2V0T3BlcmF0aW9uTmFtZSwgZ2V0UXVlcnlEZWZpbml0aW9uLCBnZXRTdG9yZUtleU5hbWUsIGdyYXBoUUxSZXN1bHRIYXNFcnJvciwgaGFzQ2xpZW50RXhwb3J0cywgaGFzRGlyZWN0aXZlcywgaXNEZXZlbG9wbWVudCwgaXNFbnYsIGlzRmllbGQsIGlzSWRWYWx1ZSwgaXNJbmxpbmVGcmFnbWVudCwgaXNKc29uVmFsdWUsIGlzTnVtYmVyVmFsdWUsIGlzUHJvZHVjdGlvbiwgaXNTY2FsYXJWYWx1ZSwgaXNUZXN0LCBtYXliZURlZXBGcmVlemUsIG1lcmdlRGVlcCwgbWVyZ2VEZWVwQXJyYXksIHJlbW92ZUFyZ3VtZW50c0Zyb21Eb2N1bWVudCwgcmVtb3ZlQ2xpZW50U2V0c0Zyb21Eb2N1bWVudCwgcmVtb3ZlQ29ubmVjdGlvbkRpcmVjdGl2ZUZyb21Eb2N1bWVudCwgcmVtb3ZlRGlyZWN0aXZlc0Zyb21Eb2N1bWVudCwgcmVtb3ZlRnJhZ21lbnRTcHJlYWRGcm9tRG9jdW1lbnQsIHJlc3VsdEtleU5hbWVGcm9tRmllbGQsIHNob3VsZEluY2x1ZGUsIHN0b3JlS2V5TmFtZUZyb21GaWVsZCwgc3RyaXBTeW1ib2xzLCB0b0lkVmFsdWUsIHRyeUZ1bmN0aW9uT3JMb2dFcnJvciwgdmFsdWVGcm9tTm9kZSwgdmFsdWVUb09iamVjdFJlcHJlc2VudGF0aW9uLCB2YXJpYWJsZXNJbk9wZXJhdGlvbiwgd2Fybk9uY2VJbkRldmVsb3BtZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idW5kbGUuZXNtLmpzLm1hcFxuIiwiaW1wb3J0IHsgU2xvdCB9IGZyb20gJ0B3cnkvY29udGV4dCc7XG5leHBvcnQgeyBhc3luY0Zyb21HZW4sIGJpbmQgYXMgYmluZENvbnRleHQsIG5vQ29udGV4dCwgc2V0VGltZW91dCB9IGZyb20gJ0B3cnkvY29udGV4dCc7XG5cbmZ1bmN0aW9uIGRlZmF1bHREaXNwb3NlKCkgeyB9XHJcbnZhciBDYWNoZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIENhY2hlKG1heCwgZGlzcG9zZSkge1xyXG4gICAgICAgIGlmIChtYXggPT09IHZvaWQgMCkgeyBtYXggPSBJbmZpbml0eTsgfVxyXG4gICAgICAgIGlmIChkaXNwb3NlID09PSB2b2lkIDApIHsgZGlzcG9zZSA9IGRlZmF1bHREaXNwb3NlOyB9XHJcbiAgICAgICAgdGhpcy5tYXggPSBtYXg7XHJcbiAgICAgICAgdGhpcy5kaXNwb3NlID0gZGlzcG9zZTtcclxuICAgICAgICB0aGlzLm1hcCA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLm5ld2VzdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vbGRlc3QgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgQ2FjaGUucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXAuaGFzKGtleSk7XHJcbiAgICB9O1xyXG4gICAgQ2FjaGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLmdldEVudHJ5KGtleSk7XHJcbiAgICAgICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnZhbHVlO1xyXG4gICAgfTtcclxuICAgIENhY2hlLnByb3RvdHlwZS5nZXRFbnRyeSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLm1hcC5nZXQoa2V5KTtcclxuICAgICAgICBpZiAoZW50cnkgJiYgZW50cnkgIT09IHRoaXMubmV3ZXN0KSB7XHJcbiAgICAgICAgICAgIHZhciBvbGRlciA9IGVudHJ5Lm9sZGVyLCBuZXdlciA9IGVudHJ5Lm5ld2VyO1xyXG4gICAgICAgICAgICBpZiAobmV3ZXIpIHtcclxuICAgICAgICAgICAgICAgIG5ld2VyLm9sZGVyID0gb2xkZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9sZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBvbGRlci5uZXdlciA9IG5ld2VyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVudHJ5Lm9sZGVyID0gdGhpcy5uZXdlc3Q7XHJcbiAgICAgICAgICAgIGVudHJ5Lm9sZGVyLm5ld2VyID0gZW50cnk7XHJcbiAgICAgICAgICAgIGVudHJ5Lm5ld2VyID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5uZXdlc3QgPSBlbnRyeTtcclxuICAgICAgICAgICAgaWYgKGVudHJ5ID09PSB0aGlzLm9sZGVzdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbGRlc3QgPSBuZXdlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZW50cnk7XHJcbiAgICB9O1xyXG4gICAgQ2FjaGUucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy5nZXRFbnRyeShrZXkpO1xyXG4gICAgICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZW50cnkudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZW50cnkgPSB7XHJcbiAgICAgICAgICAgIGtleToga2V5LFxyXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgIG5ld2VyOiBudWxsLFxyXG4gICAgICAgICAgICBvbGRlcjogdGhpcy5uZXdlc3RcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICh0aGlzLm5ld2VzdCkge1xyXG4gICAgICAgICAgICB0aGlzLm5ld2VzdC5uZXdlciA9IGVudHJ5O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5ld2VzdCA9IGVudHJ5O1xyXG4gICAgICAgIHRoaXMub2xkZXN0ID0gdGhpcy5vbGRlc3QgfHwgZW50cnk7XHJcbiAgICAgICAgdGhpcy5tYXAuc2V0KGtleSwgZW50cnkpO1xyXG4gICAgICAgIHJldHVybiBlbnRyeS52YWx1ZTtcclxuICAgIH07XHJcbiAgICBDYWNoZS5wcm90b3R5cGUuY2xlYW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMub2xkZXN0ICYmIHRoaXMubWFwLnNpemUgPiB0aGlzLm1heCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZSh0aGlzLm9sZGVzdC5rZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBDYWNoZS5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMubWFwLmdldChrZXkpO1xyXG4gICAgICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgICAgICBpZiAoZW50cnkgPT09IHRoaXMubmV3ZXN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5ld2VzdCA9IGVudHJ5Lm9sZGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbnRyeSA9PT0gdGhpcy5vbGRlc3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2xkZXN0ID0gZW50cnkubmV3ZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVudHJ5Lm5ld2VyKSB7XHJcbiAgICAgICAgICAgICAgICBlbnRyeS5uZXdlci5vbGRlciA9IGVudHJ5Lm9sZGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbnRyeS5vbGRlcikge1xyXG4gICAgICAgICAgICAgICAgZW50cnkub2xkZXIubmV3ZXIgPSBlbnRyeS5uZXdlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm1hcC5kZWxldGUoa2V5KTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwb3NlKGVudHJ5LnZhbHVlLCBrZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBDYWNoZTtcclxufSgpKTtcblxudmFyIHBhcmVudEVudHJ5U2xvdCA9IG5ldyBTbG90KCk7XG5cbnZhciByZXVzYWJsZUVtcHR5QXJyYXkgPSBbXTtcclxudmFyIGVtcHR5U2V0UG9vbCA9IFtdO1xyXG52YXIgUE9PTF9UQVJHRVRfU0laRSA9IDEwMDtcclxuLy8gU2luY2UgdGhpcyBwYWNrYWdlIG1pZ2h0IGJlIHVzZWQgYnJvd3NlcnMsIHdlIHNob3VsZCBhdm9pZCB1c2luZyB0aGVcclxuLy8gTm9kZSBidWlsdC1pbiBhc3NlcnQgbW9kdWxlLlxyXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBvcHRpb25hbE1lc3NhZ2UpIHtcclxuICAgIGlmICghY29uZGl0aW9uKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG9wdGlvbmFsTWVzc2FnZSB8fCBcImFzc2VydGlvbiBmYWlsdXJlXCIpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHZhbHVlSXMoYSwgYikge1xyXG4gICAgdmFyIGxlbiA9IGEubGVuZ3RoO1xyXG4gICAgcmV0dXJuIChcclxuICAgIC8vIFVua25vd24gdmFsdWVzIGFyZSBub3QgZXF1YWwgdG8gZWFjaCBvdGhlci5cclxuICAgIGxlbiA+IDAgJiZcclxuICAgICAgICAvLyBCb3RoIHZhbHVlcyBtdXN0IGJlIG9yZGluYXJ5IChvciBib3RoIGV4Y2VwdGlvbmFsKSB0byBiZSBlcXVhbC5cclxuICAgICAgICBsZW4gPT09IGIubGVuZ3RoICYmXHJcbiAgICAgICAgLy8gVGhlIHVuZGVybHlpbmcgdmFsdWUgb3IgZXhjZXB0aW9uIG11c3QgYmUgdGhlIHNhbWUuXHJcbiAgICAgICAgYVtsZW4gLSAxXSA9PT0gYltsZW4gLSAxXSk7XHJcbn1cclxuZnVuY3Rpb24gdmFsdWVHZXQodmFsdWUpIHtcclxuICAgIHN3aXRjaCAodmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgY2FzZSAwOiB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHZhbHVlXCIpO1xyXG4gICAgICAgIGNhc2UgMTogcmV0dXJuIHZhbHVlWzBdO1xyXG4gICAgICAgIGNhc2UgMjogdGhyb3cgdmFsdWVbMV07XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdmFsdWVDb3B5KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUuc2xpY2UoMCk7XHJcbn1cclxudmFyIEVudHJ5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRW50cnkoZm4sIGFyZ3MpIHtcclxuICAgICAgICB0aGlzLmZuID0gZm47XHJcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcclxuICAgICAgICB0aGlzLnBhcmVudHMgPSBuZXcgU2V0KCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZFZhbHVlcyA9IG5ldyBNYXAoKTtcclxuICAgICAgICAvLyBXaGVuIHRoaXMgRW50cnkgaGFzIGNoaWxkcmVuIHRoYXQgYXJlIGRpcnR5LCB0aGlzIHByb3BlcnR5IGJlY29tZXNcclxuICAgICAgICAvLyBhIFNldCBjb250YWluaW5nIG90aGVyIEVudHJ5IG9iamVjdHMsIGJvcnJvd2VkIGZyb20gZW1wdHlTZXRQb29sLlxyXG4gICAgICAgIC8vIFdoZW4gdGhlIHNldCBiZWNvbWVzIGVtcHR5LCBpdCBnZXRzIHJlY3ljbGVkIGJhY2sgdG8gZW1wdHlTZXRQb29sLlxyXG4gICAgICAgIHRoaXMuZGlydHlDaGlsZHJlbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5kaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZWNvbXB1dGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBbXTtcclxuICAgICAgICArK0VudHJ5LmNvdW50O1xyXG4gICAgfVxyXG4gICAgLy8gVGhpcyBpcyB0aGUgbW9zdCBpbXBvcnRhbnQgbWV0aG9kIG9mIHRoZSBFbnRyeSBBUEksIGJlY2F1c2UgaXRcclxuICAgIC8vIGRldGVybWluZXMgd2hldGhlciB0aGUgY2FjaGVkIHRoaXMudmFsdWUgY2FuIGJlIHJldHVybmVkIGltbWVkaWF0ZWx5LFxyXG4gICAgLy8gb3IgbXVzdCBiZSByZWNvbXB1dGVkLiBUaGUgb3ZlcmFsbCBwZXJmb3JtYW5jZSBvZiB0aGUgY2FjaGluZyBzeXN0ZW1cclxuICAgIC8vIGRlcGVuZHMgb24gdGhlIHRydXRoIG9mIHRoZSBmb2xsb3dpbmcgb2JzZXJ2YXRpb25zOiAoMSkgdGhpcy5kaXJ0eSBpc1xyXG4gICAgLy8gdXN1YWxseSBmYWxzZSwgKDIpIHRoaXMuZGlydHlDaGlsZHJlbiBpcyB1c3VhbGx5IG51bGwvZW1wdHksIGFuZCB0aHVzXHJcbiAgICAvLyAoMykgdmFsdWVHZXQodGhpcy52YWx1ZSkgaXMgdXN1YWxseSByZXR1cm5lZCB3aXRob3V0IHJlY29tcHV0YXRpb24uXHJcbiAgICBFbnRyeS5wcm90b3R5cGUucmVjb21wdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFzc2VydCghdGhpcy5yZWNvbXB1dGluZywgXCJhbHJlYWR5IHJlY29tcHV0aW5nXCIpO1xyXG4gICAgICAgIGlmICghcmVtZW1iZXJQYXJlbnQodGhpcykgJiYgbWF5YmVSZXBvcnRPcnBoYW4odGhpcykpIHtcclxuICAgICAgICAgICAgLy8gVGhlIHJlY2lwaWVudCBvZiB0aGUgZW50cnkucmVwb3J0T3JwaGFuIGNhbGxiYWNrIGRlY2lkZWQgdG8gZGlzcG9zZVxyXG4gICAgICAgICAgICAvLyBvZiB0aGlzIG9ycGhhbiBlbnRyeSBieSBjYWxsaW5nIGVudHJ5LmRpc3Bvc2UoKSwgc28gd2UgZG9uJ3QgbmVlZCB0b1xyXG4gICAgICAgICAgICAvLyAoYW5kIHNob3VsZCBub3QpIHByb2NlZWQgd2l0aCB0aGUgcmVjb21wdXRhdGlvbi5cclxuICAgICAgICAgICAgcmV0dXJuIHZvaWQgMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1pZ2h0QmVEaXJ0eSh0aGlzKVxyXG4gICAgICAgICAgICA/IHJlYWxseVJlY29tcHV0ZSh0aGlzKVxyXG4gICAgICAgICAgICA6IHZhbHVlR2V0KHRoaXMudmFsdWUpO1xyXG4gICAgfTtcclxuICAgIEVudHJ5LnByb3RvdHlwZS5zZXREaXJ0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXJ0eSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZGlydHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudmFsdWUubGVuZ3RoID0gMDtcclxuICAgICAgICByZXBvcnREaXJ0eSh0aGlzKTtcclxuICAgICAgICAvLyBXZSBjYW4gZ28gYWhlYWQgYW5kIHVuc3Vic2NyaWJlIGhlcmUsIHNpbmNlIGFueSBmdXJ0aGVyIGRpcnR5XHJcbiAgICAgICAgLy8gbm90aWZpY2F0aW9ucyB3ZSByZWNlaXZlIHdpbGwgYmUgcmVkdW5kYW50LCBhbmQgdW5zdWJzY3JpYmluZyBtYXlcclxuICAgICAgICAvLyBmcmVlIHVwIHNvbWUgcmVzb3VyY2VzLCBlLmcuIGZpbGUgd2F0Y2hlcnMuXHJcbiAgICAgICAgbWF5YmVVbnN1YnNjcmliZSh0aGlzKTtcclxuICAgIH07XHJcbiAgICBFbnRyeS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGZvcmdldENoaWxkcmVuKHRoaXMpLmZvckVhY2gobWF5YmVSZXBvcnRPcnBoYW4pO1xyXG4gICAgICAgIG1heWJlVW5zdWJzY3JpYmUodGhpcyk7XHJcbiAgICAgICAgLy8gQmVjYXVzZSB0aGlzIGVudHJ5IGhhcyBiZWVuIGtpY2tlZCBvdXQgb2YgdGhlIGNhY2hlIChpbiBpbmRleC5qcyksXHJcbiAgICAgICAgLy8gd2UndmUgbG9zdCB0aGUgYWJpbGl0eSB0byBmaW5kIG91dCBpZi93aGVuIHRoaXMgZW50cnkgYmVjb21lcyBkaXJ0eSxcclxuICAgICAgICAvLyB3aGV0aGVyIHRoYXQgaGFwcGVucyB0aHJvdWdoIGEgc3Vic2NyaXB0aW9uLCBiZWNhdXNlIG9mIGEgZGlyZWN0IGNhbGxcclxuICAgICAgICAvLyB0byBlbnRyeS5zZXREaXJ0eSgpLCBvciBiZWNhdXNlIG9uZSBvZiBpdHMgY2hpbGRyZW4gYmVjb21lcyBkaXJ0eS5cclxuICAgICAgICAvLyBCZWNhdXNlIG9mIHRoaXMgbG9zcyBvZiBmdXR1cmUgaW5mb3JtYXRpb24sIHdlIGhhdmUgdG8gYXNzdW1lIHRoZVxyXG4gICAgICAgIC8vIHdvcnN0ICh0aGF0IHRoaXMgZW50cnkgbWlnaHQgaGF2ZSBiZWNvbWUgZGlydHkgdmVyeSBzb29uKSwgc28gd2UgbXVzdFxyXG4gICAgICAgIC8vIGltbWVkaWF0ZWx5IG1hcmsgdGhpcyBlbnRyeSdzIHBhcmVudHMgYXMgZGlydHkuIE5vcm1hbGx5IHdlIGNvdWxkXHJcbiAgICAgICAgLy8ganVzdCBjYWxsIGVudHJ5LnNldERpcnR5KCkgcmF0aGVyIHRoYW4gY2FsbGluZyBwYXJlbnQuc2V0RGlydHkoKSBmb3JcclxuICAgICAgICAvLyBlYWNoIHBhcmVudCwgYnV0IHRoYXQgd291bGQgbGVhdmUgdGhpcyBlbnRyeSBpbiBwYXJlbnQuY2hpbGRWYWx1ZXNcclxuICAgICAgICAvLyBhbmQgcGFyZW50LmRpcnR5Q2hpbGRyZW4sIHdoaWNoIHdvdWxkIHByZXZlbnQgdGhlIGNoaWxkIGZyb20gYmVpbmdcclxuICAgICAgICAvLyB0cnVseSBmb3Jnb3R0ZW4uXHJcbiAgICAgICAgdGhpcy5wYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHBhcmVudCkge1xyXG4gICAgICAgICAgICBwYXJlbnQuc2V0RGlydHkoKTtcclxuICAgICAgICAgICAgZm9yZ2V0Q2hpbGQocGFyZW50LCBfdGhpcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgRW50cnkuY291bnQgPSAwO1xyXG4gICAgcmV0dXJuIEVudHJ5O1xyXG59KCkpO1xyXG5mdW5jdGlvbiByZW1lbWJlclBhcmVudChjaGlsZCkge1xyXG4gICAgdmFyIHBhcmVudCA9IHBhcmVudEVudHJ5U2xvdC5nZXRWYWx1ZSgpO1xyXG4gICAgaWYgKHBhcmVudCkge1xyXG4gICAgICAgIGNoaWxkLnBhcmVudHMuYWRkKHBhcmVudCk7XHJcbiAgICAgICAgaWYgKCFwYXJlbnQuY2hpbGRWYWx1ZXMuaGFzKGNoaWxkKSkge1xyXG4gICAgICAgICAgICBwYXJlbnQuY2hpbGRWYWx1ZXMuc2V0KGNoaWxkLCBbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtaWdodEJlRGlydHkoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIHJlcG9ydERpcnR5Q2hpbGQocGFyZW50LCBjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXBvcnRDbGVhbkNoaWxkKHBhcmVudCwgY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFyZW50O1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlYWxseVJlY29tcHV0ZShlbnRyeSkge1xyXG4gICAgLy8gU2luY2UgdGhpcyByZWNvbXB1dGF0aW9uIGlzIGxpa2VseSB0byByZS1yZW1lbWJlciBzb21lIG9mIHRoaXNcclxuICAgIC8vIGVudHJ5J3MgY2hpbGRyZW4sIHdlIGZvcmdldCBvdXIgY2hpbGRyZW4gaGVyZSBidXQgZG8gbm90IGNhbGxcclxuICAgIC8vIG1heWJlUmVwb3J0T3JwaGFuIHVudGlsIGFmdGVyIHRoZSByZWNvbXB1dGF0aW9uIGZpbmlzaGVzLlxyXG4gICAgdmFyIG9yaWdpbmFsQ2hpbGRyZW4gPSBmb3JnZXRDaGlsZHJlbihlbnRyeSk7XHJcbiAgICAvLyBTZXQgZW50cnkgYXMgdGhlIHBhcmVudCBlbnRyeSB3aGlsZSBjYWxsaW5nIHJlY29tcHV0ZU5ld1ZhbHVlKGVudHJ5KS5cclxuICAgIHBhcmVudEVudHJ5U2xvdC53aXRoVmFsdWUoZW50cnksIHJlY29tcHV0ZU5ld1ZhbHVlLCBbZW50cnldKTtcclxuICAgIGlmIChtYXliZVN1YnNjcmliZShlbnRyeSkpIHtcclxuICAgICAgICAvLyBJZiB3ZSBzdWNjZXNzZnVsbHkgcmVjb21wdXRlZCBlbnRyeS52YWx1ZSBhbmQgZGlkIG5vdCBmYWlsIHRvXHJcbiAgICAgICAgLy8gKHJlKXN1YnNjcmliZSwgdGhlbiB0aGlzIEVudHJ5IGlzIG5vIGxvbmdlciBleHBsaWNpdGx5IGRpcnR5LlxyXG4gICAgICAgIHNldENsZWFuKGVudHJ5KTtcclxuICAgIH1cclxuICAgIC8vIE5vdyB0aGF0IHdlJ3ZlIGhhZCBhIGNoYW5jZSB0byByZS1yZW1lbWJlciBhbnkgY2hpbGRyZW4gdGhhdCB3ZXJlXHJcbiAgICAvLyBpbnZvbHZlZCBpbiB0aGUgcmVjb21wdXRhdGlvbiwgd2UgY2FuIHNhZmVseSByZXBvcnQgYW55IG9ycGhhblxyXG4gICAgLy8gY2hpbGRyZW4gdGhhdCByZW1haW4uXHJcbiAgICBvcmlnaW5hbENoaWxkcmVuLmZvckVhY2gobWF5YmVSZXBvcnRPcnBoYW4pO1xyXG4gICAgcmV0dXJuIHZhbHVlR2V0KGVudHJ5LnZhbHVlKTtcclxufVxyXG5mdW5jdGlvbiByZWNvbXB1dGVOZXdWYWx1ZShlbnRyeSkge1xyXG4gICAgZW50cnkucmVjb21wdXRpbmcgPSB0cnVlO1xyXG4gICAgLy8gU2V0IGVudHJ5LnZhbHVlIGFzIHVua25vd24uXHJcbiAgICBlbnRyeS52YWx1ZS5sZW5ndGggPSAwO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICAvLyBJZiBlbnRyeS5mbiBzdWNjZWVkcywgZW50cnkudmFsdWUgd2lsbCBiZWNvbWUgYSBub3JtYWwgVmFsdWUuXHJcbiAgICAgICAgZW50cnkudmFsdWVbMF0gPSBlbnRyeS5mbi5hcHBseShudWxsLCBlbnRyeS5hcmdzKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gSWYgZW50cnkuZm4gdGhyb3dzLCBlbnRyeS52YWx1ZSB3aWxsIGJlY29tZSBleGNlcHRpb25hbC5cclxuICAgICAgICBlbnRyeS52YWx1ZVsxXSA9IGU7XHJcbiAgICB9XHJcbiAgICAvLyBFaXRoZXIgd2F5LCB0aGlzIGxpbmUgaXMgYWx3YXlzIHJlYWNoZWQuXHJcbiAgICBlbnRyeS5yZWNvbXB1dGluZyA9IGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIG1pZ2h0QmVEaXJ0eShlbnRyeSkge1xyXG4gICAgcmV0dXJuIGVudHJ5LmRpcnR5IHx8ICEhKGVudHJ5LmRpcnR5Q2hpbGRyZW4gJiYgZW50cnkuZGlydHlDaGlsZHJlbi5zaXplKTtcclxufVxyXG5mdW5jdGlvbiBzZXRDbGVhbihlbnRyeSkge1xyXG4gICAgZW50cnkuZGlydHkgPSBmYWxzZTtcclxuICAgIGlmIChtaWdodEJlRGlydHkoZW50cnkpKSB7XHJcbiAgICAgICAgLy8gVGhpcyBFbnRyeSBtYXkgc3RpbGwgaGF2ZSBkaXJ0eSBjaGlsZHJlbiwgaW4gd2hpY2ggY2FzZSB3ZSBjYW4ndFxyXG4gICAgICAgIC8vIGxldCBvdXIgcGFyZW50cyBrbm93IHdlJ3JlIGNsZWFuIGp1c3QgeWV0LlxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHJlcG9ydENsZWFuKGVudHJ5KTtcclxufVxyXG5mdW5jdGlvbiByZXBvcnREaXJ0eShjaGlsZCkge1xyXG4gICAgY2hpbGQucGFyZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChwYXJlbnQpIHsgcmV0dXJuIHJlcG9ydERpcnR5Q2hpbGQocGFyZW50LCBjaGlsZCk7IH0pO1xyXG59XHJcbmZ1bmN0aW9uIHJlcG9ydENsZWFuKGNoaWxkKSB7XHJcbiAgICBjaGlsZC5wYXJlbnRzLmZvckVhY2goZnVuY3Rpb24gKHBhcmVudCkgeyByZXR1cm4gcmVwb3J0Q2xlYW5DaGlsZChwYXJlbnQsIGNoaWxkKTsgfSk7XHJcbn1cclxuLy8gTGV0IGEgcGFyZW50IEVudHJ5IGtub3cgdGhhdCBvbmUgb2YgaXRzIGNoaWxkcmVuIG1heSBiZSBkaXJ0eS5cclxuZnVuY3Rpb24gcmVwb3J0RGlydHlDaGlsZChwYXJlbnQsIGNoaWxkKSB7XHJcbiAgICAvLyBNdXN0IGhhdmUgY2FsbGVkIHJlbWVtYmVyUGFyZW50KGNoaWxkKSBiZWZvcmUgY2FsbGluZ1xyXG4gICAgLy8gcmVwb3J0RGlydHlDaGlsZChwYXJlbnQsIGNoaWxkKS5cclxuICAgIGFzc2VydChwYXJlbnQuY2hpbGRWYWx1ZXMuaGFzKGNoaWxkKSk7XHJcbiAgICBhc3NlcnQobWlnaHRCZURpcnR5KGNoaWxkKSk7XHJcbiAgICBpZiAoIXBhcmVudC5kaXJ0eUNoaWxkcmVuKSB7XHJcbiAgICAgICAgcGFyZW50LmRpcnR5Q2hpbGRyZW4gPSBlbXB0eVNldFBvb2wucG9wKCkgfHwgbmV3IFNldDtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBhcmVudC5kaXJ0eUNoaWxkcmVuLmhhcyhjaGlsZCkpIHtcclxuICAgICAgICAvLyBJZiB3ZSBhbHJlYWR5IGtub3cgdGhpcyBjaGlsZCBpcyBkaXJ0eSwgdGhlbiB3ZSBtdXN0IGhhdmUgYWxyZWFkeVxyXG4gICAgICAgIC8vIGluZm9ybWVkIG91ciBvd24gcGFyZW50cyB0aGF0IHdlIGFyZSBkaXJ0eSwgc28gd2UgY2FuIHRlcm1pbmF0ZVxyXG4gICAgICAgIC8vIHRoZSByZWN1cnNpb24gZWFybHkuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgcGFyZW50LmRpcnR5Q2hpbGRyZW4uYWRkKGNoaWxkKTtcclxuICAgIHJlcG9ydERpcnR5KHBhcmVudCk7XHJcbn1cclxuLy8gTGV0IGEgcGFyZW50IEVudHJ5IGtub3cgdGhhdCBvbmUgb2YgaXRzIGNoaWxkcmVuIGlzIG5vIGxvbmdlciBkaXJ0eS5cclxuZnVuY3Rpb24gcmVwb3J0Q2xlYW5DaGlsZChwYXJlbnQsIGNoaWxkKSB7XHJcbiAgICAvLyBNdXN0IGhhdmUgY2FsbGVkIHJlbWVtYmVyQ2hpbGQoY2hpbGQpIGJlZm9yZSBjYWxsaW5nXHJcbiAgICAvLyByZXBvcnRDbGVhbkNoaWxkKHBhcmVudCwgY2hpbGQpLlxyXG4gICAgYXNzZXJ0KHBhcmVudC5jaGlsZFZhbHVlcy5oYXMoY2hpbGQpKTtcclxuICAgIGFzc2VydCghbWlnaHRCZURpcnR5KGNoaWxkKSk7XHJcbiAgICB2YXIgY2hpbGRWYWx1ZSA9IHBhcmVudC5jaGlsZFZhbHVlcy5nZXQoY2hpbGQpO1xyXG4gICAgaWYgKGNoaWxkVmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcGFyZW50LmNoaWxkVmFsdWVzLnNldChjaGlsZCwgdmFsdWVDb3B5KGNoaWxkLnZhbHVlKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghdmFsdWVJcyhjaGlsZFZhbHVlLCBjaGlsZC52YWx1ZSkpIHtcclxuICAgICAgICBwYXJlbnQuc2V0RGlydHkoKTtcclxuICAgIH1cclxuICAgIHJlbW92ZURpcnR5Q2hpbGQocGFyZW50LCBjaGlsZCk7XHJcbiAgICBpZiAobWlnaHRCZURpcnR5KHBhcmVudCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICByZXBvcnRDbGVhbihwYXJlbnQpO1xyXG59XHJcbmZ1bmN0aW9uIHJlbW92ZURpcnR5Q2hpbGQocGFyZW50LCBjaGlsZCkge1xyXG4gICAgdmFyIGRjID0gcGFyZW50LmRpcnR5Q2hpbGRyZW47XHJcbiAgICBpZiAoZGMpIHtcclxuICAgICAgICBkYy5kZWxldGUoY2hpbGQpO1xyXG4gICAgICAgIGlmIChkYy5zaXplID09PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChlbXB0eVNldFBvb2wubGVuZ3RoIDwgUE9PTF9UQVJHRVRfU0laRSkge1xyXG4gICAgICAgICAgICAgICAgZW1wdHlTZXRQb29sLnB1c2goZGMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBhcmVudC5kaXJ0eUNoaWxkcmVuID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLy8gSWYgdGhlIGdpdmVuIGVudHJ5IGhhcyBhIHJlcG9ydE9ycGhhbiBtZXRob2QsIGFuZCBubyByZW1haW5pbmcgcGFyZW50cyxcclxuLy8gY2FsbCBlbnRyeS5yZXBvcnRPcnBoYW4gYW5kIHJldHVybiB0cnVlIGlmZiBpdCByZXR1cm5zIHRydWUuIFRoZVxyXG4vLyByZXBvcnRPcnBoYW4gZnVuY3Rpb24gc2hvdWxkIHJldHVybiB0cnVlIHRvIGluZGljYXRlIGVudHJ5LmRpc3Bvc2UoKVxyXG4vLyBoYXMgYmVlbiBjYWxsZWQsIGFuZCB0aGUgZW50cnkgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIGFueSBvdGhlciBjYWNoZXNcclxuLy8gKHNlZSBpbmRleC5qcyBmb3IgdGhlIG9ubHkgY3VycmVudCBleGFtcGxlKS5cclxuZnVuY3Rpb24gbWF5YmVSZXBvcnRPcnBoYW4oZW50cnkpIHtcclxuICAgIHJldHVybiBlbnRyeS5wYXJlbnRzLnNpemUgPT09IDAgJiZcclxuICAgICAgICB0eXBlb2YgZW50cnkucmVwb3J0T3JwaGFuID09PSBcImZ1bmN0aW9uXCIgJiZcclxuICAgICAgICBlbnRyeS5yZXBvcnRPcnBoYW4oKSA9PT0gdHJ1ZTtcclxufVxyXG4vLyBSZW1vdmVzIGFsbCBjaGlsZHJlbiBmcm9tIHRoaXMgZW50cnkgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgdGhlXHJcbi8vIHJlbW92ZWQgY2hpbGRyZW4uXHJcbmZ1bmN0aW9uIGZvcmdldENoaWxkcmVuKHBhcmVudCkge1xyXG4gICAgdmFyIGNoaWxkcmVuID0gcmV1c2FibGVFbXB0eUFycmF5O1xyXG4gICAgaWYgKHBhcmVudC5jaGlsZFZhbHVlcy5zaXplID4gMCkge1xyXG4gICAgICAgIGNoaWxkcmVuID0gW107XHJcbiAgICAgICAgcGFyZW50LmNoaWxkVmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKF92YWx1ZSwgY2hpbGQpIHtcclxuICAgICAgICAgICAgZm9yZ2V0Q2hpbGQocGFyZW50LCBjaGlsZCk7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gQWZ0ZXIgd2UgZm9yZ2V0IGFsbCBvdXIgY2hpbGRyZW4sIHRoaXMuZGlydHlDaGlsZHJlbiBtdXN0IGJlIGVtcHR5XHJcbiAgICAvLyBhbmQgdGhlcmVmb3JlIG11c3QgaGF2ZSBiZWVuIHJlc2V0IHRvIG51bGwuXHJcbiAgICBhc3NlcnQocGFyZW50LmRpcnR5Q2hpbGRyZW4gPT09IG51bGwpO1xyXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xyXG59XHJcbmZ1bmN0aW9uIGZvcmdldENoaWxkKHBhcmVudCwgY2hpbGQpIHtcclxuICAgIGNoaWxkLnBhcmVudHMuZGVsZXRlKHBhcmVudCk7XHJcbiAgICBwYXJlbnQuY2hpbGRWYWx1ZXMuZGVsZXRlKGNoaWxkKTtcclxuICAgIHJlbW92ZURpcnR5Q2hpbGQocGFyZW50LCBjaGlsZCk7XHJcbn1cclxuZnVuY3Rpb24gbWF5YmVTdWJzY3JpYmUoZW50cnkpIHtcclxuICAgIGlmICh0eXBlb2YgZW50cnkuc3Vic2NyaWJlID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBtYXliZVVuc3Vic2NyaWJlKGVudHJ5KTsgLy8gUHJldmVudCBkb3VibGUgc3Vic2NyaXB0aW9ucy5cclxuICAgICAgICAgICAgZW50cnkudW5zdWJzY3JpYmUgPSBlbnRyeS5zdWJzY3JpYmUuYXBwbHkobnVsbCwgZW50cnkuYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoaXMgRW50cnkgaGFzIGEgc3Vic2NyaWJlIGZ1bmN0aW9uIGFuZCBpdCB0aHJldyBhbiBleGNlcHRpb25cclxuICAgICAgICAgICAgLy8gKG9yIGFuIHVuc3Vic2NyaWJlIGZ1bmN0aW9uIGl0IHByZXZpb3VzbHkgcmV0dXJuZWQgbm93IHRocm93cyksXHJcbiAgICAgICAgICAgIC8vIHJldHVybiBmYWxzZSB0byBpbmRpY2F0ZSB0aGF0IHdlIHdlcmUgbm90IGFibGUgdG8gc3Vic2NyaWJlIChvclxyXG4gICAgICAgICAgICAvLyB1bnN1YnNjcmliZSksIGFuZCB0aGlzIEVudHJ5IHNob3VsZCByZW1haW4gZGlydHkuXHJcbiAgICAgICAgICAgIGVudHJ5LnNldERpcnR5KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBSZXR1cm5pbmcgdHJ1ZSBpbmRpY2F0ZXMgZWl0aGVyIHRoYXQgdGhlcmUgd2FzIG5vIGVudHJ5LnN1YnNjcmliZVxyXG4gICAgLy8gZnVuY3Rpb24gb3IgdGhhdCBpdCBzdWNjZWVkZWQuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBtYXliZVVuc3Vic2NyaWJlKGVudHJ5KSB7XHJcbiAgICB2YXIgdW5zdWJzY3JpYmUgPSBlbnRyeS51bnN1YnNjcmliZTtcclxuICAgIGlmICh0eXBlb2YgdW5zdWJzY3JpYmUgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIGVudHJ5LnVuc3Vic2NyaWJlID0gdm9pZCAwO1xyXG4gICAgICAgIHVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbn1cblxuLy8gQSB0cmllIGRhdGEgc3RydWN0dXJlIHRoYXQgaG9sZHMgb2JqZWN0IGtleXMgd2Vha2x5LCB5ZXQgY2FuIGFsc28gaG9sZFxyXG4vLyBub24tb2JqZWN0IGtleXMsIHVubGlrZSB0aGUgbmF0aXZlIGBXZWFrTWFwYC5cclxudmFyIEtleVRyaWUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBLZXlUcmllKHdlYWtuZXNzKSB7XHJcbiAgICAgICAgdGhpcy53ZWFrbmVzcyA9IHdlYWtuZXNzO1xyXG4gICAgfVxyXG4gICAgS2V5VHJpZS5wcm90b3R5cGUubG9va3VwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIGFycmF5W19pXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmxvb2t1cEFycmF5KGFycmF5KTtcclxuICAgIH07XHJcbiAgICBLZXlUcmllLnByb3RvdHlwZS5sb29rdXBBcnJheSA9IGZ1bmN0aW9uIChhcnJheSkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcztcclxuICAgICAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIG5vZGUgPSBub2RlLmdldENoaWxkVHJpZShrZXkpOyB9KTtcclxuICAgICAgICByZXR1cm4gbm9kZS5kYXRhIHx8IChub2RlLmRhdGEgPSBPYmplY3QuY3JlYXRlKG51bGwpKTtcclxuICAgIH07XHJcbiAgICBLZXlUcmllLnByb3RvdHlwZS5nZXRDaGlsZFRyaWUgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMud2Vha25lc3MgJiYgaXNPYmpSZWYoa2V5KVxyXG4gICAgICAgICAgICA/IHRoaXMud2VhayB8fCAodGhpcy53ZWFrID0gbmV3IFdlYWtNYXAoKSlcclxuICAgICAgICAgICAgOiB0aGlzLnN0cm9uZyB8fCAodGhpcy5zdHJvbmcgPSBuZXcgTWFwKCkpO1xyXG4gICAgICAgIHZhciBjaGlsZCA9IG1hcC5nZXQoa2V5KTtcclxuICAgICAgICBpZiAoIWNoaWxkKVxyXG4gICAgICAgICAgICBtYXAuc2V0KGtleSwgY2hpbGQgPSBuZXcgS2V5VHJpZSh0aGlzLndlYWtuZXNzKSk7XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBLZXlUcmllO1xyXG59KCkpO1xyXG5mdW5jdGlvbiBpc09ialJlZih2YWx1ZSkge1xyXG4gICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcclxuICAgICAgICBjYXNlIFwib2JqZWN0XCI6XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vIEZhbGwgdGhyb3VnaCB0byByZXR1cm4gdHJ1ZS4uLlxyXG4gICAgICAgIGNhc2UgXCJmdW5jdGlvblwiOlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxuXG4vLyBUaGUgZGVmYXVsdE1ha2VDYWNoZUtleSBmdW5jdGlvbiBpcyByZW1hcmthYmx5IHBvd2VyZnVsLCBiZWNhdXNlIGl0IGdpdmVzXHJcbi8vIGEgdW5pcXVlIG9iamVjdCBmb3IgYW55IHNoYWxsb3ctaWRlbnRpY2FsIGxpc3Qgb2YgYXJndW1lbnRzLiBJZiB5b3UgbmVlZFxyXG4vLyB0byBpbXBsZW1lbnQgYSBjdXN0b20gbWFrZUNhY2hlS2V5IGZ1bmN0aW9uLCB5b3UgbWF5IGZpbmQgaXQgaGVscGZ1bCB0b1xyXG4vLyBkZWxlZ2F0ZSB0aGUgZmluYWwgd29yayB0byBkZWZhdWx0TWFrZUNhY2hlS2V5LCB3aGljaCBpcyB3aHkgd2UgZXhwb3J0IGl0XHJcbi8vIGhlcmUuIEhvd2V2ZXIsIHlvdSBtYXkgd2FudCB0byBhdm9pZCBkZWZhdWx0TWFrZUNhY2hlS2V5IGlmIHlvdXIgcnVudGltZVxyXG4vLyBkb2VzIG5vdCBzdXBwb3J0IFdlYWtNYXAsIG9yIHlvdSBoYXZlIHRoZSBhYmlsaXR5IHRvIHJldHVybiBhIHN0cmluZyBrZXkuXHJcbi8vIEluIHRob3NlIGNhc2VzLCBqdXN0IHdyaXRlIHlvdXIgb3duIGN1c3RvbSBtYWtlQ2FjaGVLZXkgZnVuY3Rpb25zLlxyXG52YXIga2V5VHJpZSA9IG5ldyBLZXlUcmllKHR5cGVvZiBXZWFrTWFwID09PSBcImZ1bmN0aW9uXCIpO1xyXG5mdW5jdGlvbiBkZWZhdWx0TWFrZUNhY2hlS2V5KCkge1xyXG4gICAgdmFyIGFyZ3MgPSBbXTtcclxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGtleVRyaWUubG9va3VwQXJyYXkoYXJncyk7XHJcbn1cclxudmFyIGNhY2hlcyA9IG5ldyBTZXQoKTtcclxuZnVuY3Rpb24gd3JhcChvcmlnaW5hbEZ1bmN0aW9uLCBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpOyB9XHJcbiAgICB2YXIgY2FjaGUgPSBuZXcgQ2FjaGUob3B0aW9ucy5tYXggfHwgTWF0aC5wb3coMiwgMTYpLCBmdW5jdGlvbiAoZW50cnkpIHsgcmV0dXJuIGVudHJ5LmRpc3Bvc2UoKTsgfSk7XHJcbiAgICB2YXIgZGlzcG9zYWJsZSA9ICEhb3B0aW9ucy5kaXNwb3NhYmxlO1xyXG4gICAgdmFyIG1ha2VDYWNoZUtleSA9IG9wdGlvbnMubWFrZUNhY2hlS2V5IHx8IGRlZmF1bHRNYWtlQ2FjaGVLZXk7XHJcbiAgICBmdW5jdGlvbiBvcHRpbWlzdGljKCkge1xyXG4gICAgICAgIGlmIChkaXNwb3NhYmxlICYmICFwYXJlbnRFbnRyeVNsb3QuaGFzVmFsdWUoKSkge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIGN1cnJlbnQgcGFyZW50IGNvbXB1dGF0aW9uLCBhbmQgdGhpcyB3cmFwcGVkXHJcbiAgICAgICAgICAgIC8vIGZ1bmN0aW9uIGlzIGRpc3Bvc2FibGUgKG1lYW5pbmcgd2UgZG9uJ3QgY2FyZSBhYm91dCBlbnRyeS52YWx1ZSxcclxuICAgICAgICAgICAgLy8ganVzdCBkZXBlbmRlbmN5IHRyYWNraW5nKSwgdGhlbiB3ZSBjYW4gc2hvcnQtY3V0IGV2ZXJ5dGhpbmcgZWxzZVxyXG4gICAgICAgICAgICAvLyBpbiB0aGlzIGZ1bmN0aW9uLCBiZWNhdXNlIGVudHJ5LnJlY29tcHV0ZSgpIGlzIGdvaW5nIHRvIHJlY3ljbGVcclxuICAgICAgICAgICAgLy8gdGhlIGVudHJ5IG9iamVjdCB3aXRob3V0IHJlY29tcHV0aW5nIGFueXRoaW5nLCBhbnl3YXkuXHJcbiAgICAgICAgICAgIHJldHVybiB2b2lkIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBrZXkgPSBtYWtlQ2FjaGVLZXkuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcclxuICAgICAgICBpZiAoa2V5ID09PSB2b2lkIDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG4gICAgICAgIHZhciBlbnRyeSA9IGNhY2hlLmdldChrZXkpO1xyXG4gICAgICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgICAgICBlbnRyeS5hcmdzID0gYXJncztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVudHJ5ID0gbmV3IEVudHJ5KG9yaWdpbmFsRnVuY3Rpb24sIGFyZ3MpO1xyXG4gICAgICAgICAgICBjYWNoZS5zZXQoa2V5LCBlbnRyeSk7XHJcbiAgICAgICAgICAgIGVudHJ5LnN1YnNjcmliZSA9IG9wdGlvbnMuc3Vic2NyaWJlO1xyXG4gICAgICAgICAgICBpZiAoZGlzcG9zYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgZW50cnkucmVwb3J0T3JwaGFuID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gY2FjaGUuZGVsZXRlKGtleSk7IH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHZhbHVlID0gZW50cnkucmVjb21wdXRlKCk7XHJcbiAgICAgICAgLy8gTW92ZSB0aGlzIGVudHJ5IHRvIHRoZSBmcm9udCBvZiB0aGUgbGVhc3QtcmVjZW50bHkgdXNlZCBxdWV1ZSxcclxuICAgICAgICAvLyBzaW5jZSB3ZSBqdXN0IGZpbmlzaGVkIGNvbXB1dGluZyBpdHMgdmFsdWUuXHJcbiAgICAgICAgY2FjaGUuc2V0KGtleSwgZW50cnkpO1xyXG4gICAgICAgIGNhY2hlcy5hZGQoY2FjaGUpO1xyXG4gICAgICAgIC8vIENsZWFuIHVwIGFueSBleGNlc3MgZW50cmllcyBpbiB0aGUgY2FjaGUsIGJ1dCBvbmx5IGlmIHRoZXJlIGlzIG5vXHJcbiAgICAgICAgLy8gYWN0aXZlIHBhcmVudCBlbnRyeSwgbWVhbmluZyB3ZSdyZSBub3QgaW4gdGhlIG1pZGRsZSBvZiBhIGxhcmdlclxyXG4gICAgICAgIC8vIGNvbXB1dGF0aW9uIHRoYXQgbWlnaHQgYmUgZmx1bW1veGVkIGJ5IHRoZSBjbGVhbmluZy5cclxuICAgICAgICBpZiAoIXBhcmVudEVudHJ5U2xvdC5oYXNWYWx1ZSgpKSB7XHJcbiAgICAgICAgICAgIGNhY2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWNoZSkgeyByZXR1cm4gY2FjaGUuY2xlYW4oKTsgfSk7XHJcbiAgICAgICAgICAgIGNhY2hlcy5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiBvcHRpb25zLmRpc3Bvc2FibGUgaXMgdHJ1dGh5LCB0aGUgY2FsbGVyIG9mIHdyYXAgaXMgdGVsbGluZyB1c1xyXG4gICAgICAgIC8vIHRoZXkgZG9uJ3QgY2FyZSBhYm91dCB0aGUgcmVzdWx0IG9mIGVudHJ5LnJlY29tcHV0ZSgpLCBzbyB3ZSBzaG91bGRcclxuICAgICAgICAvLyBhdm9pZCByZXR1cm5pbmcgdGhlIHZhbHVlLCBzbyBpdCB3b24ndCBiZSBhY2NpZGVudGFsbHkgdXNlZC5cclxuICAgICAgICByZXR1cm4gZGlzcG9zYWJsZSA/IHZvaWQgMCA6IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgb3B0aW1pc3RpYy5kaXJ0eSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIga2V5ID0gbWFrZUNhY2hlS2V5LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgdmFyIGNoaWxkID0ga2V5ICE9PSB2b2lkIDAgJiYgY2FjaGUuZ2V0KGtleSk7XHJcbiAgICAgICAgaWYgKGNoaWxkKSB7XHJcbiAgICAgICAgICAgIGNoaWxkLnNldERpcnR5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBvcHRpbWlzdGljO1xyXG59XG5cbmV4cG9ydCB7IEtleVRyaWUsIGRlZmF1bHRNYWtlQ2FjaGVLZXksIHdyYXAgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bmRsZS5lc20uanMubWFwXG4iLCIvKiBnbG9iYWwgd2luZG93ICovXG5pbXBvcnQgcG9ueWZpbGwgZnJvbSAnLi9wb255ZmlsbC5qcyc7XG5cbnZhciByb290O1xuXG5pZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gIHJvb3QgPSBzZWxmO1xufSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICByb290ID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICByb290ID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICByb290ID0gbW9kdWxlO1xufSBlbHNlIHtcbiAgcm9vdCA9IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG59XG5cbnZhciByZXN1bHQgPSBwb255ZmlsbChyb290KTtcbmV4cG9ydCBkZWZhdWx0IHJlc3VsdDtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN5bWJvbE9ic2VydmFibGVQb255ZmlsbChyb290KSB7XG5cdHZhciByZXN1bHQ7XG5cdHZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxuXHRpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGlmIChTeW1ib2wub2JzZXJ2YWJsZSkge1xuXHRcdFx0cmVzdWx0ID0gU3ltYm9sLm9ic2VydmFibGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlc3VsdCA9IFN5bWJvbCgnb2JzZXJ2YWJsZScpO1xuXHRcdFx0U3ltYm9sLm9ic2VydmFibGUgPSByZXN1bHQ7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJlc3VsdCA9ICdAQG9ic2VydmFibGUnO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn07XG4iLCJpbXBvcnQgeyBfX2V4dGVuZHMgfSBmcm9tICd0c2xpYic7XG5cbnZhciBnZW5lcmljTWVzc2FnZSA9IFwiSW52YXJpYW50IFZpb2xhdGlvblwiO1xyXG52YXIgX2EgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YsIHNldFByb3RvdHlwZU9mID0gX2EgPT09IHZvaWQgMCA/IGZ1bmN0aW9uIChvYmosIHByb3RvKSB7XHJcbiAgICBvYmouX19wcm90b19fID0gcHJvdG87XHJcbiAgICByZXR1cm4gb2JqO1xyXG59IDogX2E7XHJcbnZhciBJbnZhcmlhbnRFcnJvciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhJbnZhcmlhbnRFcnJvciwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEludmFyaWFudEVycm9yKG1lc3NhZ2UpIHtcclxuICAgICAgICBpZiAobWVzc2FnZSA9PT0gdm9pZCAwKSB7IG1lc3NhZ2UgPSBnZW5lcmljTWVzc2FnZTsgfVxyXG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHR5cGVvZiBtZXNzYWdlID09PSBcIm51bWJlclwiXHJcbiAgICAgICAgICAgID8gZ2VuZXJpY01lc3NhZ2UgKyBcIjogXCIgKyBtZXNzYWdlICsgXCIgKHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXBvbGxvZ3JhcGhxbC9pbnZhcmlhbnQtcGFja2FnZXMpXCJcclxuICAgICAgICAgICAgOiBtZXNzYWdlKSB8fCB0aGlzO1xyXG4gICAgICAgIF90aGlzLmZyYW1lc1RvUG9wID0gMTtcclxuICAgICAgICBfdGhpcy5uYW1lID0gZ2VuZXJpY01lc3NhZ2U7XHJcbiAgICAgICAgc2V0UHJvdG90eXBlT2YoX3RoaXMsIEludmFyaWFudEVycm9yLnByb3RvdHlwZSk7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIEludmFyaWFudEVycm9yO1xyXG59KEVycm9yKSk7XHJcbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIG1lc3NhZ2UpIHtcclxuICAgIGlmICghY29uZGl0aW9uKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEludmFyaWFudEVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHdyYXBDb25zb2xlTWV0aG9kKG1ldGhvZCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gY29uc29sZVttZXRob2RdLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XHJcbiAgICB9O1xyXG59XHJcbihmdW5jdGlvbiAoaW52YXJpYW50KSB7XHJcbiAgICBpbnZhcmlhbnQud2FybiA9IHdyYXBDb25zb2xlTWV0aG9kKFwid2FyblwiKTtcclxuICAgIGludmFyaWFudC5lcnJvciA9IHdyYXBDb25zb2xlTWV0aG9kKFwiZXJyb3JcIik7XHJcbn0pKGludmFyaWFudCB8fCAoaW52YXJpYW50ID0ge30pKTtcclxuLy8gQ29kZSB0aGF0IHVzZXMgdHMtaW52YXJpYW50IHdpdGggcm9sbHVwLXBsdWdpbi1pbnZhcmlhbnQgbWF5IHdhbnQgdG9cclxuLy8gaW1wb3J0IHRoaXMgcHJvY2VzcyBzdHViIHRvIGF2b2lkIGVycm9ycyBldmFsdWF0aW5nIHByb2Nlc3MuZW52Lk5PREVfRU5WLlxyXG4vLyBIb3dldmVyLCBiZWNhdXNlIG1vc3QgRVNNLXRvLUNKUyBjb21waWxlcnMgd2lsbCByZXdyaXRlIHRoZSBwcm9jZXNzIGltcG9ydFxyXG4vLyBhcyB0c0ludmFyaWFudC5wcm9jZXNzLCB3aGljaCBwcmV2ZW50cyBwcm9wZXIgcmVwbGFjZW1lbnQgYnkgbWluaWZpZXJzLCB3ZVxyXG4vLyBhbHNvIGF0dGVtcHQgdG8gZGVmaW5lIHRoZSBzdHViIGdsb2JhbGx5IHdoZW4gaXQgaXMgbm90IGFscmVhZHkgZGVmaW5lZC5cclxudmFyIHByb2Nlc3NTdHViID0geyBlbnY6IHt9IH07XHJcbmlmICh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgcHJvY2Vzc1N0dWIgPSBwcm9jZXNzO1xyXG59XHJcbmVsc2VcclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy8gVXNpbmcgRnVuY3Rpb24gdG8gZXZhbHVhdGUgdGhpcyBhc3NpZ25tZW50IGluIGdsb2JhbCBzY29wZSBhbHNvIGVzY2FwZXNcclxuICAgICAgICAvLyB0aGUgc3RyaWN0IG1vZGUgb2YgdGhlIGN1cnJlbnQgbW9kdWxlLCB0aGVyZWJ5IGFsbG93aW5nIHRoZSBhc3NpZ25tZW50LlxyXG4gICAgICAgIC8vIEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9wdWxsLzM2OS5cclxuICAgICAgICBGdW5jdGlvbihcInN0dWJcIiwgXCJwcm9jZXNzID0gc3R1YlwiKShwcm9jZXNzU3R1Yik7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoYXRMZWFzdFdlVHJpZWQpIHtcclxuICAgICAgICAvLyBUaGUgYXNzaWdubWVudCBjYW4gZmFpbCBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGhlYXZ5LWhhbmRlZGx5XHJcbiAgICAgICAgLy8gZm9yYmlkcyBGdW5jdGlvbiB1c2FnZS4gSW4gdGhvc2UgZW52aXJvbm1lbnRzLCBkZXZlbG9wZXJzIHNob3VsZCB0YWtlXHJcbiAgICAgICAgLy8gZXh0cmEgY2FyZSB0byByZXBsYWNlIHByb2Nlc3MuZW52Lk5PREVfRU5WIGluIHRoZWlyIHByb2R1Y3Rpb24gYnVpbGRzLFxyXG4gICAgICAgIC8vIG9yIGRlZmluZSBhbiBhcHByb3ByaWF0ZSBnbG9iYWwucHJvY2VzcyBwb2x5ZmlsbC5cclxuICAgIH1cclxudmFyIGludmFyaWFudCQxID0gaW52YXJpYW50O1xuXG5leHBvcnQgZGVmYXVsdCBpbnZhcmlhbnQkMTtcbmV4cG9ydCB7IEludmFyaWFudEVycm9yLCBpbnZhcmlhbnQsIHByb2Nlc3NTdHViIGFzIHByb2Nlc3MgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWludmFyaWFudC5lc20uanMubWFwXG4iLCJpbXBvcnQgemVuT2JzZXJ2YWJsZSBmcm9tICd6ZW4tb2JzZXJ2YWJsZSc7XG5cbnZhciBPYnNlcnZhYmxlID0gemVuT2JzZXJ2YWJsZTtcblxuZXhwb3J0IGRlZmF1bHQgT2JzZXJ2YWJsZTtcbmV4cG9ydCB7IE9ic2VydmFibGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1bmRsZS5lc20uanMubWFwXG4iLCJpbXBvcnQgTGF5b3V0IGZyb20gJy4uL2NvbXBvbmVudHMvTGF5b3V0JztcclxuXHJcbmltcG9ydCBQcm9kdWN0IGZyb20gJy4uL2NvbXBvbmVudHMvUHJvZHVjdCc7XHJcblxyXG5pbXBvcnQgeyBDYXJkLCBDb250YWluZXIsIENvbCwgUm93ICB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCc7XHJcblxyXG5pbXBvcnQgeyBBcG9sbG9DbGllbnQsIEluTWVtb3J5Q2FjaGUsIGdxbCB9IGZyb20gJ0BhcG9sbG8vY2xpZW50JztcclxuXHJcbmltcG9ydCBjbGllbnQgZnJvbSAnYXBvbGxvLWJvb3N0JztcclxuXHJcbmNvbnN0IFBST0RVQ1RTX1FVRVJZID0gZ3FsYHF1ZXJ5e1xyXG4gICAgICAgIHByb2R1Y3RzKGZpcnN0OiAyMCkge1xyXG4gICAgICAgICAgICBub2RlcyB7XHJcbiAgICAgICAgICAgICAgICBpZFxyXG4gICAgICAgICAgICAgICAgZGF0YWJhc2VJZFxyXG4gICAgICAgICAgICAgICAgYXZlcmFnZVJhdGluZ1xyXG4gICAgICAgICAgICAgICAgc2x1Z1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgIGltYWdlIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmlcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZVxyXG4gICAgICAgICAgICAgICAgICAgIHNyY1NldFxyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZVVybFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuYW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbn1gO1xyXG5cclxuY29uc3QgSW5kZXggPSAoIHByb3BzICkgPT4ge1xyXG5cclxuICAgIGNvbnN0IHsgcHJvZHVjdHMgfSA9IHByb3BzO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPExheW91dD5cclxuICAgICAgICAgICAgPENvbnRhaW5lcj5cclxuICAgICAgICAgICAgICAgIDxSb3cgY2xhc3NOYW1lPVwicHJvZHVjdC1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICB7IHByb2R1Y3RzLmxlbmd0aCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHMubWFwKCBwcm9kdWN0ID0+IDxQcm9kdWN0IGtleT17IHByb2R1Y3QuaWQgfSBwcm9kdWN0PXsgcHJvZHVjdCB9IC8+IClcclxuICAgICAgICAgICAgICAgICAgICApIDogJyd9XHJcbiAgICAgICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgPC9Db250YWluZXI+XHJcbiAgICAgICAgPC9MYXlvdXQ+XHJcbiAgICApXHJcbn07XHJcblxyXG5JbmRleC5nZXRJbml0aWFsUHJvcHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQucXVlcnkoIHsgcXVlcnk6IFBST0RVQ1RTX1FVRVJZIH0pXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHByb2R1Y3RzOiByZXN1bHQuZGF0YS5wcm9kdWN0cy5ub2Rlc1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSW5kZXg7Il0sInNvdXJjZVJvb3QiOiIifQ==