/* ========================================================================== 
 *                           dexie-cloud-addom.js
 * ==========================================================================
 *
 * Dexie addon that syncs IndexedDB with Dexie Cloud.
 *
 * By David Fahlander, david@dexie.org
 *
 * ==========================================================================
 *
 * Version 4.0.11, Wed Jan 15 2025
 *
 * https://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
 * 
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('dexie'), require('rxjs')) :
    typeof define === 'function' && define.amd ? define(['exports', 'dexie', 'rxjs'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DexieCloud = {}, global.Dexie, global.rxjs));
})(this, (function (exports, Dexie, rxjs) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function assert(b) {
        if (!b)
            throw new Error('Assertion Failed');
    }
    const _hasOwn = {}.hasOwnProperty;
    function hasOwn(obj, prop) {
        return _hasOwn.call(obj, prop);
    }
    function setByKeyPath(obj, keyPath, value) {
        if (!obj || keyPath === undefined)
            return;
        if ('isFrozen' in Object && Object.isFrozen(obj))
            return;
        if (typeof keyPath !== 'string' && 'length' in keyPath) {
            assert(typeof value !== 'string' && 'length' in value);
            for (var i = 0, l = keyPath.length; i < l; ++i) {
                setByKeyPath(obj, keyPath[i], value[i]);
            }
        }
        else {
            var period = keyPath.indexOf('.');
            if (period !== -1) {
                var currentKeyPath = keyPath.substr(0, period);
                var remainingKeyPath = keyPath.substr(period + 1);
                if (remainingKeyPath === '')
                    if (value === undefined) {
                        if (Array.isArray(obj)) {
                            if (!isNaN(parseInt(currentKeyPath)))
                                obj.splice(parseInt(currentKeyPath), 1);
                        }
                        else
                            delete obj[currentKeyPath];
                        // @ts-ignore: even if currentKeyPath would be numeric string and obj would be array - it works.
                    }
                    else
                        obj[currentKeyPath] = value;
                else {
                    //@ts-ignore: even if currentKeyPath would be numeric string and obj would be array - it works.
                    var innerObj = obj[currentKeyPath];
                    //@ts-ignore: even if currentKeyPath would be numeric string and obj would be array - it works.
                    if (!innerObj || !hasOwn(obj, currentKeyPath))
                        innerObj = (obj[currentKeyPath] = {});
                    setByKeyPath(innerObj, remainingKeyPath, value);
                }
            }
            else {
                if (value === undefined) {
                    if (Array.isArray(obj) && !isNaN(parseInt(keyPath)))
                        // @ts-ignore: even if currentKeyPath would be numeric string and obj would be array - it works.
                        obj.splice(keyPath, 1);
                    //@ts-ignore: even if currentKeyPath would be numeric string and obj would be array - it works.
                    else
                        delete obj[keyPath];
                    //@ts-ignore: even if currentKeyPath would be numeric string and obj would be array - it works.
                }
                else
                    obj[keyPath] = value;
            }
        }
    }
    const randomString$1 = typeof self !== 'undefined' && typeof crypto !== 'undefined' ? (bytes, randomFill = crypto.getRandomValues.bind(crypto)) => {
        // Web
        const buf = new Uint8Array(bytes);
        randomFill(buf);
        return self.btoa(String.fromCharCode.apply(null, buf));
    } : typeof Buffer !== 'undefined' ? (bytes, randomFill = simpleRandomFill) => {
        // Node
        const buf = Buffer.alloc(bytes);
        randomFill(buf);
        return buf.toString("base64");
    } : () => { throw new Error("No implementation of randomString was found"); };
    function simpleRandomFill(buf) {
        for (let i = 0; i < buf.length; ++i) {
            buf[i] = Math.floor(Math.random() * 256);
        }
    }

    /** Verifies that given primary key is valid.
     * The reason we narrow validity for valid keys are twofold:
     *  1: Make sure to only support types that can be used as an object index in DBKeyMutationSet.
     *     For example, ArrayBuffer cannot be used (gives "object ArrayBuffer") but Uint8Array can be
     *     used (gives comma-delimited list of included bytes).
     *  2: Avoid using plain numbers and Dates as keys when they are synced, as they are not globally unique.
     *  3: Since we store the key as a VARCHAR server side in current version, try not promote types that stringifies to become very long server side.
     *
     * @param id
     * @returns
     */
    function isValidSyncableID(id) {
        if (typeof id === "string")
            return true;
        //if (validIDTypes[toStringTag(id)]) return true;
        //if (Array.isArray(id)) return id.every((part) => isValidSyncableID(part));
        if (Array.isArray(id) && id.some(key => isValidSyncableID(key)) && id.every(isValidSyncableIDPart))
            return true;
        return false;
    }
    /** Verifies that given key part is valid.
     *  1: Make sure that arrays of this types are stringified correclty and works with DBKeyMutationSet.
     *     For example, ArrayBuffer cannot be used (gives "object ArrayBuffer") but Uint8Array can be
     *     used (gives comma-delimited list of included bytes).
     *  2: Since we store the key as a VARCHAR server side in current version, try not promote types that stringifies to become very long server side.
    */
    function isValidSyncableIDPart(part) {
        return typeof part === "string" || typeof part === "number" || Array.isArray(part) && part.every(isValidSyncableIDPart);
    }
    function isValidAtID(id, idPrefix) {
        return !idPrefix || (typeof id === "string" && id.startsWith(idPrefix));
    }

    function applyOperation(target, table, op) {
        const tbl = target[table] || (target[table] = {});
        const keys = op.keys.map(key => typeof key === 'string' ? key : JSON.stringify(key));
        switch (op.type) {
            case "insert":
            // TODO: Don't treat insert and upsert the same?
            case "upsert":
                keys.forEach((key, idx) => {
                    tbl[key] = {
                        type: "ups",
                        val: op.values[idx],
                    };
                });
                break;
            case "update":
            case "modify": {
                keys.forEach((key, idx) => {
                    const changeSpec = op.type === "update"
                        ? op.changeSpecs[idx]
                        : op.changeSpec;
                    const entry = tbl[key];
                    if (!entry) {
                        tbl[key] = {
                            type: "upd",
                            mod: changeSpec,
                        };
                    }
                    else {
                        switch (entry.type) {
                            case "ups":
                                // Adjust the existing upsert with additional updates
                                for (const [propPath, value] of Object.entries(changeSpec)) {
                                    setByKeyPath(entry.val, propPath, value);
                                }
                                break;
                            case "del":
                                // No action.
                                break;
                            case "upd":
                                // Adjust existing update with additional updates
                                Object.assign(entry.mod, changeSpec); // May work for deep props as well - new keys is added later, right? Does the prop order persist along TSON and all? But it will not be 100% when combined with some server code (seach for "address.city": "Stockholm" comment)
                                break;
                        }
                    }
                });
                break;
            }
            case "delete":
                keys.forEach((key) => {
                    tbl[key] = {
                        type: "del",
                    };
                });
                break;
        }
        return target;
    }

    function applyOperations(target, ops) {
        for (const { table, muts } of ops) {
            for (const mut of muts) {
                applyOperation(target, table, mut);
            }
        }
    }

    function subtractChanges(target, // Server change set
    changesToSubtract // additional mutations on client during syncWithServer()
    ) {
        var _a, _b, _c;
        for (const [table, mutationSet] of Object.entries(changesToSubtract)) {
            for (const [key, mut] of Object.entries(mutationSet)) {
                switch (mut.type) {
                    case 'ups':
                        {
                            const targetMut = (_a = target[table]) === null || _a === void 0 ? void 0 : _a[key];
                            if (targetMut) {
                                switch (targetMut.type) {
                                    case 'ups':
                                        delete target[table][key];
                                        break;
                                    case 'del':
                                        // Leave delete operation.
                                        // (Don't resurrect objects unintenionally (using tx(get, put) pattern locally))
                                        break;
                                    case 'upd':
                                        delete target[table][key];
                                        break;
                                }
                            }
                        }
                        break;
                    case 'del':
                        (_b = target[table]) === null || _b === void 0 ? true : delete _b[key];
                        break;
                    case 'upd': {
                        const targetMut = (_c = target[table]) === null || _c === void 0 ? void 0 : _c[key];
                        if (targetMut) {
                            switch (targetMut.type) {
                                case 'ups':
                                    // Adjust the server upsert with locally updated values.
                                    for (const [propPath, value] of Object.entries(mut.mod)) {
                                        setByKeyPath(targetMut.val, propPath, value);
                                    }
                                    break;
                                case 'del':
                                    // Leave delete.
                                    break;
                                case 'upd':
                                    // Remove the local update props from the server update mutation.
                                    for (const propPath of Object.keys(mut.mod)) {
                                        delete targetMut.mod[propPath];
                                    }
                                    break;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }

    /** Convert a DBKeyMutationSet (which is an internal format capable of looking up changes per ID)
     * ...into a DBOperationsSet (which is more optimal for performing DB operations into DB (bulkAdd() etc))
     *
     * @param inSet
     * @returns DBOperationsSet representing inSet
     */
    function toDBOperationSet(inSet, txid = "") {
        // Fictive transaction:
        if (!txid)
            txid = randomString$1(16);
        // Convert data into a temporary map to collect mutations of same table and type
        const map = {};
        for (const [table, ops] of Object.entries(inSet)) {
            for (const [key, op] of Object.entries(ops)) {
                const mapEntry = map[table] || (map[table] = {});
                const ops = mapEntry[op.type] || (mapEntry[op.type] = []);
                ops.push(Object.assign({ key }, op)); // DBKeyMutation doesn't contain key, so we need to bring it in.
            }
        }
        // Start computing the resulting format:
        const result = [];
        for (const [table, ops] of Object.entries(map)) {
            const resultEntry = {
                table,
                muts: [],
            };
            for (const [optype, muts] of Object.entries(ops)) {
                switch (optype) {
                    case "ups": {
                        const op = {
                            type: "upsert",
                            keys: muts.map(mut => mut.key),
                            values: muts.map(mut => mut.val),
                            txid
                        };
                        resultEntry.muts.push(op);
                        break;
                    }
                    case "upd": {
                        const op = {
                            type: "update",
                            keys: muts.map(mut => mut.key),
                            changeSpecs: muts.map(mut => mut.mod),
                            txid
                        };
                        resultEntry.muts.push(op);
                        break;
                    }
                    case "del": {
                        const op = {
                            type: "delete",
                            keys: muts.map(mut => mut.key),
                            txid,
                        };
                        resultEntry.muts.push(op);
                        break;
                    }
                }
            }
            result.push(resultEntry);
        }
        return result;
    }

    function getDbNameFromDbUrl(dbUrl) {
        const url = new URL(dbUrl);
        return url.pathname === "/"
            ? url.hostname.split('.')[0]
            : url.pathname.split('/')[1];
    }

    function isFunction(value) {
        return typeof value === 'function';
    }

    function hasLift(source) {
        return isFunction(source === null || source === void 0 ? void 0 : source.lift);
    }
    function operate(init) {
        return function (source) {
            if (hasLift(source)) {
                return source.lift(function (liftedSource) {
                    try {
                        return init(liftedSource, this);
                    }
                    catch (err) {
                        this.error(err);
                    }
                });
            }
            throw new TypeError('Unable to lift unknown Observable type');
        };
    }

    var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

    function isPromise(value) {
        return isFunction(value === null || value === void 0 ? void 0 : value.then);
    }

    function createErrorClass(createImpl) {
        var _super = function (instance) {
            Error.call(instance);
            instance.stack = new Error().stack;
        };
        var ctorFunc = createImpl(_super);
        ctorFunc.prototype = Object.create(Error.prototype);
        ctorFunc.prototype.constructor = ctorFunc;
        return ctorFunc;
    }

    var UnsubscriptionError = createErrorClass(function (_super) {
        return function UnsubscriptionErrorImpl(errors) {
            _super(this);
            this.message = errors
                ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
                : '';
            this.name = 'UnsubscriptionError';
            this.errors = errors;
        };
    });

    function arrRemove(arr, item) {
        if (arr) {
            var index = arr.indexOf(item);
            0 <= index && arr.splice(index, 1);
        }
    }

    var Subscription = (function () {
        function Subscription(initialTeardown) {
            this.initialTeardown = initialTeardown;
            this.closed = false;
            this._parentage = null;
            this._finalizers = null;
        }
        Subscription.prototype.unsubscribe = function () {
            var e_1, _a, e_2, _b;
            var errors;
            if (!this.closed) {
                this.closed = true;
                var _parentage = this._parentage;
                if (_parentage) {
                    this._parentage = null;
                    if (Array.isArray(_parentage)) {
                        try {
                            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                                var parent_1 = _parentage_1_1.value;
                                parent_1.remove(this);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    else {
                        _parentage.remove(this);
                    }
                }
                var initialFinalizer = this.initialTeardown;
                if (isFunction(initialFinalizer)) {
                    try {
                        initialFinalizer();
                    }
                    catch (e) {
                        errors = e instanceof UnsubscriptionError ? e.errors : [e];
                    }
                }
                var _finalizers = this._finalizers;
                if (_finalizers) {
                    this._finalizers = null;
                    try {
                        for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                            var finalizer = _finalizers_1_1.value;
                            try {
                                execFinalizer(finalizer);
                            }
                            catch (err) {
                                errors = errors !== null && errors !== void 0 ? errors : [];
                                if (err instanceof UnsubscriptionError) {
                                    errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                                }
                                else {
                                    errors.push(err);
                                }
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                if (errors) {
                    throw new UnsubscriptionError(errors);
                }
            }
        };
        Subscription.prototype.add = function (teardown) {
            var _a;
            if (teardown && teardown !== this) {
                if (this.closed) {
                    execFinalizer(teardown);
                }
                else {
                    if (teardown instanceof Subscription) {
                        if (teardown.closed || teardown._hasParent(this)) {
                            return;
                        }
                        teardown._addParent(this);
                    }
                    (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
                }
            }
        };
        Subscription.prototype._hasParent = function (parent) {
            var _parentage = this._parentage;
            return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
        };
        Subscription.prototype._addParent = function (parent) {
            var _parentage = this._parentage;
            this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
        };
        Subscription.prototype._removeParent = function (parent) {
            var _parentage = this._parentage;
            if (_parentage === parent) {
                this._parentage = null;
            }
            else if (Array.isArray(_parentage)) {
                arrRemove(_parentage, parent);
            }
        };
        Subscription.prototype.remove = function (teardown) {
            var _finalizers = this._finalizers;
            _finalizers && arrRemove(_finalizers, teardown);
            if (teardown instanceof Subscription) {
                teardown._removeParent(this);
            }
        };
        Subscription.EMPTY = (function () {
            var empty = new Subscription();
            empty.closed = true;
            return empty;
        })();
        return Subscription;
    }());
    Subscription.EMPTY;
    function isSubscription(value) {
        return (value instanceof Subscription ||
            (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
    }
    function execFinalizer(finalizer) {
        if (isFunction(finalizer)) {
            finalizer();
        }
        else {
            finalizer.unsubscribe();
        }
    }

    var config = {
        onUnhandledError: null,
        onStoppedNotification: null,
        Promise: undefined,
        useDeprecatedSynchronousErrorHandling: false,
        useDeprecatedNextContext: false,
    };

    var timeoutProvider = {
        setTimeout: function (handler, timeout) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var delegate = timeoutProvider.delegate;
            if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
                return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
            }
            return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
        },
        clearTimeout: function (handle) {
            var delegate = timeoutProvider.delegate;
            return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
        },
        delegate: undefined,
    };

    function reportUnhandledError(err) {
        timeoutProvider.setTimeout(function () {
            {
                throw err;
            }
        });
    }

    function noop() { }

    function errorContext(cb) {
        {
            cb();
        }
    }

    var Subscriber = (function (_super) {
        __extends(Subscriber, _super);
        function Subscriber(destination) {
            var _this = _super.call(this) || this;
            _this.isStopped = false;
            if (destination) {
                _this.destination = destination;
                if (isSubscription(destination)) {
                    destination.add(_this);
                }
            }
            else {
                _this.destination = EMPTY_OBSERVER;
            }
            return _this;
        }
        Subscriber.create = function (next, error, complete) {
            return new SafeSubscriber(next, error, complete);
        };
        Subscriber.prototype.next = function (value) {
            if (this.isStopped) ;
            else {
                this._next(value);
            }
        };
        Subscriber.prototype.error = function (err) {
            if (this.isStopped) ;
            else {
                this.isStopped = true;
                this._error(err);
            }
        };
        Subscriber.prototype.complete = function () {
            if (this.isStopped) ;
            else {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber.prototype.unsubscribe = function () {
            if (!this.closed) {
                this.isStopped = true;
                _super.prototype.unsubscribe.call(this);
                this.destination = null;
            }
        };
        Subscriber.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber.prototype._error = function (err) {
            try {
                this.destination.error(err);
            }
            finally {
                this.unsubscribe();
            }
        };
        Subscriber.prototype._complete = function () {
            try {
                this.destination.complete();
            }
            finally {
                this.unsubscribe();
            }
        };
        return Subscriber;
    }(Subscription));
    var _bind = Function.prototype.bind;
    function bind(fn, thisArg) {
        return _bind.call(fn, thisArg);
    }
    var ConsumerObserver = (function () {
        function ConsumerObserver(partialObserver) {
            this.partialObserver = partialObserver;
        }
        ConsumerObserver.prototype.next = function (value) {
            var partialObserver = this.partialObserver;
            if (partialObserver.next) {
                try {
                    partialObserver.next(value);
                }
                catch (error) {
                    handleUnhandledError(error);
                }
            }
        };
        ConsumerObserver.prototype.error = function (err) {
            var partialObserver = this.partialObserver;
            if (partialObserver.error) {
                try {
                    partialObserver.error(err);
                }
                catch (error) {
                    handleUnhandledError(error);
                }
            }
            else {
                handleUnhandledError(err);
            }
        };
        ConsumerObserver.prototype.complete = function () {
            var partialObserver = this.partialObserver;
            if (partialObserver.complete) {
                try {
                    partialObserver.complete();
                }
                catch (error) {
                    handleUnhandledError(error);
                }
            }
        };
        return ConsumerObserver;
    }());
    var SafeSubscriber = (function (_super) {
        __extends(SafeSubscriber, _super);
        function SafeSubscriber(observerOrNext, error, complete) {
            var _this = _super.call(this) || this;
            var partialObserver;
            if (isFunction(observerOrNext) || !observerOrNext) {
                partialObserver = {
                    next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                    error: error !== null && error !== void 0 ? error : undefined,
                    complete: complete !== null && complete !== void 0 ? complete : undefined,
                };
            }
            else {
                var context_1;
                if (_this && config.useDeprecatedNextContext) {
                    context_1 = Object.create(observerOrNext);
                    context_1.unsubscribe = function () { return _this.unsubscribe(); };
                    partialObserver = {
                        next: observerOrNext.next && bind(observerOrNext.next, context_1),
                        error: observerOrNext.error && bind(observerOrNext.error, context_1),
                        complete: observerOrNext.complete && bind(observerOrNext.complete, context_1),
                    };
                }
                else {
                    partialObserver = observerOrNext;
                }
            }
            _this.destination = new ConsumerObserver(partialObserver);
            return _this;
        }
        return SafeSubscriber;
    }(Subscriber));
    function handleUnhandledError(error) {
        {
            reportUnhandledError(error);
        }
    }
    function defaultErrorHandler(err) {
        throw err;
    }
    var EMPTY_OBSERVER = {
        closed: true,
        next: noop,
        error: defaultErrorHandler,
        complete: noop,
    };

    var observable = (function () { return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'; })();

    function identity(x) {
        return x;
    }

    function pipeFromArray(fns) {
        if (fns.length === 0) {
            return identity;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce(function (prev, fn) { return fn(prev); }, input);
        };
    }

    var Observable = (function () {
        function Observable(subscribe) {
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        Observable.prototype.lift = function (operator) {
            var observable = new Observable();
            observable.source = this;
            observable.operator = operator;
            return observable;
        };
        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
            var _this = this;
            var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
            errorContext(function () {
                var _a = _this, operator = _a.operator, source = _a.source;
                subscriber.add(operator
                    ?
                        operator.call(subscriber, source)
                    : source
                        ?
                            _this._subscribe(subscriber)
                        :
                            _this._trySubscribe(subscriber));
            });
            return subscriber;
        };
        Observable.prototype._trySubscribe = function (sink) {
            try {
                return this._subscribe(sink);
            }
            catch (err) {
                sink.error(err);
            }
        };
        Observable.prototype.forEach = function (next, promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var subscriber = new SafeSubscriber({
                    next: function (value) {
                        try {
                            next(value);
                        }
                        catch (err) {
                            reject(err);
                            subscriber.unsubscribe();
                        }
                    },
                    error: reject,
                    complete: resolve,
                });
                _this.subscribe(subscriber);
            });
        };
        Observable.prototype._subscribe = function (subscriber) {
            var _a;
            return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
        };
        Observable.prototype[observable] = function () {
            return this;
        };
        Observable.prototype.pipe = function () {
            var operations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                operations[_i] = arguments[_i];
            }
            return pipeFromArray(operations)(this);
        };
        Observable.prototype.toPromise = function (promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var value;
                _this.subscribe(function (x) { return (value = x); }, function (err) { return reject(err); }, function () { return resolve(value); });
            });
        };
        Observable.create = function (subscribe) {
            return new Observable(subscribe);
        };
        return Observable;
    }());
    function getPromiseCtor(promiseCtor) {
        var _a;
        return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
    }
    function isObserver(value) {
        return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
    }
    function isSubscriber(value) {
        return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
    }

    function isInteropObservable(input) {
        return isFunction(input[observable]);
    }

    function isAsyncIterable(obj) {
        return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
    }

    function createInvalidObservableTypeError(input) {
        return new TypeError("You provided " + (input !== null && typeof input === 'object' ? 'an invalid object' : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
    }

    function getSymbolIterator() {
        if (typeof Symbol !== 'function' || !Symbol.iterator) {
            return '@@iterator';
        }
        return Symbol.iterator;
    }
    var iterator = getSymbolIterator();

    function isIterable(input) {
        return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
    }

    function readableStreamLikeToAsyncGenerator(readableStream) {
        return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
            var reader, _a, value, done;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reader = readableStream.getReader();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 9, 10]);
                        _b.label = 2;
                    case 2:
                        return [4, __await(reader.read())];
                    case 3:
                        _a = _b.sent(), value = _a.value, done = _a.done;
                        if (!done) return [3, 5];
                        return [4, __await(void 0)];
                    case 4: return [2, _b.sent()];
                    case 5: return [4, __await(value)];
                    case 6: return [4, _b.sent()];
                    case 7:
                        _b.sent();
                        return [3, 2];
                    case 8: return [3, 10];
                    case 9:
                        reader.releaseLock();
                        return [7];
                    case 10: return [2];
                }
            });
        });
    }
    function isReadableStreamLike(obj) {
        return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
    }

    function innerFrom(input) {
        if (input instanceof Observable) {
            return input;
        }
        if (input != null) {
            if (isInteropObservable(input)) {
                return fromInteropObservable(input);
            }
            if (isArrayLike(input)) {
                return fromArrayLike(input);
            }
            if (isPromise(input)) {
                return fromPromise(input);
            }
            if (isAsyncIterable(input)) {
                return fromAsyncIterable(input);
            }
            if (isIterable(input)) {
                return fromIterable(input);
            }
            if (isReadableStreamLike(input)) {
                return fromReadableStreamLike(input);
            }
        }
        throw createInvalidObservableTypeError(input);
    }
    function fromInteropObservable(obj) {
        return new Observable(function (subscriber) {
            var obs = obj[observable]();
            if (isFunction(obs.subscribe)) {
                return obs.subscribe(subscriber);
            }
            throw new TypeError('Provided object does not correctly implement Symbol.observable');
        });
    }
    function fromArrayLike(array) {
        return new Observable(function (subscriber) {
            for (var i = 0; i < array.length && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        });
    }
    function fromPromise(promise) {
        return new Observable(function (subscriber) {
            promise
                .then(function (value) {
                if (!subscriber.closed) {
                    subscriber.next(value);
                    subscriber.complete();
                }
            }, function (err) { return subscriber.error(err); })
                .then(null, reportUnhandledError);
        });
    }
    function fromIterable(iterable) {
        return new Observable(function (subscriber) {
            var e_1, _a;
            try {
                for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                    var value = iterable_1_1.value;
                    subscriber.next(value);
                    if (subscriber.closed) {
                        return;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            subscriber.complete();
        });
    }
    function fromAsyncIterable(asyncIterable) {
        return new Observable(function (subscriber) {
            process(asyncIterable, subscriber).catch(function (err) { return subscriber.error(err); });
        });
    }
    function fromReadableStreamLike(readableStream) {
        return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
    }
    function process(asyncIterable, subscriber) {
        var asyncIterable_1, asyncIterable_1_1;
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function () {
            var value, e_2_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 11]);
                        asyncIterable_1 = __asyncValues(asyncIterable);
                        _b.label = 1;
                    case 1: return [4, asyncIterable_1.next()];
                    case 2:
                        if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
                        value = asyncIterable_1_1.value;
                        subscriber.next(value);
                        if (subscriber.closed) {
                            return [2];
                        }
                        _b.label = 3;
                    case 3: return [3, 1];
                    case 4: return [3, 11];
                    case 5:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 11];
                    case 6:
                        _b.trys.push([6, , 9, 10]);
                        if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
                        return [4, _a.call(asyncIterable_1)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [3, 10];
                    case 9:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 10: return [7];
                    case 11:
                        subscriber.complete();
                        return [2];
                }
            });
        });
    }

    function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
        return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
    }
    var OperatorSubscriber = (function (_super) {
        __extends(OperatorSubscriber, _super);
        function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
            var _this = _super.call(this, destination) || this;
            _this.onFinalize = onFinalize;
            _this.shouldUnsubscribe = shouldUnsubscribe;
            _this._next = onNext
                ? function (value) {
                    try {
                        onNext(value);
                    }
                    catch (err) {
                        destination.error(err);
                    }
                }
                : _super.prototype._next;
            _this._error = onError
                ? function (err) {
                    try {
                        onError(err);
                    }
                    catch (err) {
                        destination.error(err);
                    }
                    finally {
                        this.unsubscribe();
                    }
                }
                : _super.prototype._error;
            _this._complete = onComplete
                ? function () {
                    try {
                        onComplete();
                    }
                    catch (err) {
                        destination.error(err);
                    }
                    finally {
                        this.unsubscribe();
                    }
                }
                : _super.prototype._complete;
            return _this;
        }
        OperatorSubscriber.prototype.unsubscribe = function () {
            var _a;
            if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
                var closed_1 = this.closed;
                _super.prototype.unsubscribe.call(this);
                !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
            }
        };
        return OperatorSubscriber;
    }(Subscriber));

    var Action = (function (_super) {
        __extends(Action, _super);
        function Action(scheduler, work) {
            return _super.call(this) || this;
        }
        Action.prototype.schedule = function (state, delay) {
            return this;
        };
        return Action;
    }(Subscription));

    var intervalProvider = {
        setInterval: function (handler, timeout) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var delegate = intervalProvider.delegate;
            if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
                return delegate.setInterval.apply(delegate, __spreadArray([handler, timeout], __read(args)));
            }
            return setInterval.apply(void 0, __spreadArray([handler, timeout], __read(args)));
        },
        clearInterval: function (handle) {
            var delegate = intervalProvider.delegate;
            return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
        },
        delegate: undefined,
    };

    var AsyncAction = (function (_super) {
        __extends(AsyncAction, _super);
        function AsyncAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            _this.pending = false;
            return _this;
        }
        AsyncAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) { delay = 0; }
            if (this.closed) {
                return this;
            }
            this.state = state;
            var id = this.id;
            var scheduler = this.scheduler;
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, delay);
            }
            this.pending = true;
            this.delay = delay;
            this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
            return this;
        };
        AsyncAction.prototype.requestAsyncId = function (scheduler, _id, delay) {
            if (delay === void 0) { delay = 0; }
            return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
        };
        AsyncAction.prototype.recycleAsyncId = function (_scheduler, id, delay) {
            if (delay === void 0) { delay = 0; }
            if (delay != null && this.delay === delay && this.pending === false) {
                return id;
            }
            intervalProvider.clearInterval(id);
            return undefined;
        };
        AsyncAction.prototype.execute = function (state, delay) {
            if (this.closed) {
                return new Error('executing a cancelled action');
            }
            this.pending = false;
            var error = this._execute(state, delay);
            if (error) {
                return error;
            }
            else if (this.pending === false && this.id != null) {
                this.id = this.recycleAsyncId(this.scheduler, this.id, null);
            }
        };
        AsyncAction.prototype._execute = function (state, _delay) {
            var errored = false;
            var errorValue;
            try {
                this.work(state);
            }
            catch (e) {
                errored = true;
                errorValue = e ? e : new Error('Scheduled action threw falsy error');
            }
            if (errored) {
                this.unsubscribe();
                return errorValue;
            }
        };
        AsyncAction.prototype.unsubscribe = function () {
            if (!this.closed) {
                var _a = this, id = _a.id, scheduler = _a.scheduler;
                var actions = scheduler.actions;
                this.work = this.state = this.scheduler = null;
                this.pending = false;
                arrRemove(actions, this);
                if (id != null) {
                    this.id = this.recycleAsyncId(scheduler, id, null);
                }
                this.delay = null;
                _super.prototype.unsubscribe.call(this);
            }
        };
        return AsyncAction;
    }(Action));

    var dateTimestampProvider = {
        now: function () {
            return (dateTimestampProvider.delegate || Date).now();
        },
        delegate: undefined,
    };

    var Scheduler = (function () {
        function Scheduler(schedulerActionCtor, now) {
            if (now === void 0) { now = Scheduler.now; }
            this.schedulerActionCtor = schedulerActionCtor;
            this.now = now;
        }
        Scheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) { delay = 0; }
            return new this.schedulerActionCtor(this, work).schedule(state, delay);
        };
        Scheduler.now = dateTimestampProvider.now;
        return Scheduler;
    }());

    var AsyncScheduler = (function (_super) {
        __extends(AsyncScheduler, _super);
        function AsyncScheduler(SchedulerAction, now) {
            if (now === void 0) { now = Scheduler.now; }
            var _this = _super.call(this, SchedulerAction, now) || this;
            _this.actions = [];
            _this._active = false;
            _this._scheduled = undefined;
            return _this;
        }
        AsyncScheduler.prototype.flush = function (action) {
            var actions = this.actions;
            if (this._active) {
                actions.push(action);
                return;
            }
            var error;
            this._active = true;
            do {
                if ((error = action.execute(action.state, action.delay))) {
                    break;
                }
            } while ((action = actions.shift()));
            this._active = false;
            if (error) {
                while ((action = actions.shift())) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AsyncScheduler;
    }(Scheduler));

    var asyncScheduler = new AsyncScheduler(AsyncAction);
    var async = asyncScheduler;

    function isScheduler(value) {
        return value && isFunction(value.schedule);
    }

    function isValidDate(value) {
        return value instanceof Date && !isNaN(value);
    }

    function timer(dueTime, intervalOrScheduler, scheduler) {
        if (dueTime === void 0) { dueTime = 0; }
        if (scheduler === void 0) { scheduler = async; }
        var intervalDuration = -1;
        if (intervalOrScheduler != null) {
            if (isScheduler(intervalOrScheduler)) {
                scheduler = intervalOrScheduler;
            }
            else {
                intervalDuration = intervalOrScheduler;
            }
        }
        return new Observable(function (subscriber) {
            var due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
            if (due < 0) {
                due = 0;
            }
            var n = 0;
            return scheduler.schedule(function () {
                if (!subscriber.closed) {
                    subscriber.next(n++);
                    if (0 <= intervalDuration) {
                        this.schedule(undefined, intervalDuration);
                    }
                    else {
                        subscriber.complete();
                    }
                }
            }, due);
        });
    }

    function last(arr) {
        return arr[arr.length - 1];
    }
    function popScheduler(args) {
        return isScheduler(last(args)) ? args.pop() : undefined;
    }

    function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
        if (delay === void 0) { delay = 0; }
        if (repeat === void 0) { repeat = false; }
        var scheduleSubscription = scheduler.schedule(function () {
            work();
            if (repeat) {
                parentSubscription.add(this.schedule(null, delay));
            }
            else {
                this.unsubscribe();
            }
        }, delay);
        parentSubscription.add(scheduleSubscription);
        if (!repeat) {
            return scheduleSubscription;
        }
    }

    function catchError(selector) {
        return operate(function (source, subscriber) {
            var innerSub = null;
            var syncUnsub = false;
            var handledResult;
            innerSub = source.subscribe(createOperatorSubscriber(subscriber, undefined, undefined, function (err) {
                handledResult = innerFrom(selector(err, catchError(selector)(source)));
                if (innerSub) {
                    innerSub.unsubscribe();
                    innerSub = null;
                    handledResult.subscribe(subscriber);
                }
                else {
                    syncUnsub = true;
                }
            }));
            if (syncUnsub) {
                innerSub.unsubscribe();
                innerSub = null;
                handledResult.subscribe(subscriber);
            }
        });
    }

    function observeOn(scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        return operate(function (source, subscriber) {
            source.subscribe(createOperatorSubscriber(subscriber, function (value) { return executeSchedule(subscriber, scheduler, function () { return subscriber.next(value); }, delay); }, function () { return executeSchedule(subscriber, scheduler, function () { return subscriber.complete(); }, delay); }, function (err) { return executeSchedule(subscriber, scheduler, function () { return subscriber.error(err); }, delay); }));
        });
    }

    function subscribeOn(scheduler, delay) {
        if (delay === void 0) { delay = 0; }
        return operate(function (source, subscriber) {
            subscriber.add(scheduler.schedule(function () { return source.subscribe(subscriber); }, delay));
        });
    }

    function scheduleObservable(input, scheduler) {
        return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
    }

    function schedulePromise(input, scheduler) {
        return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
    }

    function scheduleArray(input, scheduler) {
        return new Observable(function (subscriber) {
            var i = 0;
            return scheduler.schedule(function () {
                if (i === input.length) {
                    subscriber.complete();
                }
                else {
                    subscriber.next(input[i++]);
                    if (!subscriber.closed) {
                        this.schedule();
                    }
                }
            });
        });
    }

    function scheduleIterable(input, scheduler) {
        return new Observable(function (subscriber) {
            var iterator$1;
            executeSchedule(subscriber, scheduler, function () {
                iterator$1 = input[iterator]();
                executeSchedule(subscriber, scheduler, function () {
                    var _a;
                    var value;
                    var done;
                    try {
                        (_a = iterator$1.next(), value = _a.value, done = _a.done);
                    }
                    catch (err) {
                        subscriber.error(err);
                        return;
                    }
                    if (done) {
                        subscriber.complete();
                    }
                    else {
                        subscriber.next(value);
                    }
                }, 0, true);
            });
            return function () { return isFunction(iterator$1 === null || iterator$1 === void 0 ? void 0 : iterator$1.return) && iterator$1.return(); };
        });
    }

    function scheduleAsyncIterable(input, scheduler) {
        if (!input) {
            throw new Error('Iterable cannot be null');
        }
        return new Observable(function (subscriber) {
            executeSchedule(subscriber, scheduler, function () {
                var iterator = input[Symbol.asyncIterator]();
                executeSchedule(subscriber, scheduler, function () {
                    iterator.next().then(function (result) {
                        if (result.done) {
                            subscriber.complete();
                        }
                        else {
                            subscriber.next(result.value);
                        }
                    });
                }, 0, true);
            });
        });
    }

    function scheduleReadableStreamLike(input, scheduler) {
        return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
    }

    function scheduled(input, scheduler) {
        if (input != null) {
            if (isInteropObservable(input)) {
                return scheduleObservable(input, scheduler);
            }
            if (isArrayLike(input)) {
                return scheduleArray(input, scheduler);
            }
            if (isPromise(input)) {
                return schedulePromise(input, scheduler);
            }
            if (isAsyncIterable(input)) {
                return scheduleAsyncIterable(input, scheduler);
            }
            if (isIterable(input)) {
                return scheduleIterable(input, scheduler);
            }
            if (isReadableStreamLike(input)) {
                return scheduleReadableStreamLike(input, scheduler);
            }
        }
        throw createInvalidObservableTypeError(input);
    }

    function from(input, scheduler) {
        return scheduler ? scheduled(input, scheduler) : innerFrom(input);
    }

    function map(project, thisArg) {
        return operate(function (source, subscriber) {
            var index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                subscriber.next(project.call(thisArg, value, index++));
            }));
        });
    }

    function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
        var buffer = [];
        var active = 0;
        var index = 0;
        var isComplete = false;
        var checkComplete = function () {
            if (isComplete && !buffer.length && !active) {
                subscriber.complete();
            }
        };
        var outerNext = function (value) { return (active < concurrent ? doInnerSub(value) : buffer.push(value)); };
        var doInnerSub = function (value) {
            expand && subscriber.next(value);
            active++;
            var innerComplete = false;
            innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function (innerValue) {
                onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
                if (expand) {
                    outerNext(innerValue);
                }
                else {
                    subscriber.next(innerValue);
                }
            }, function () {
                innerComplete = true;
            }, undefined, function () {
                if (innerComplete) {
                    try {
                        active--;
                        var _loop_1 = function () {
                            var bufferedValue = buffer.shift();
                            if (innerSubScheduler) {
                                executeSchedule(subscriber, innerSubScheduler, function () { return doInnerSub(bufferedValue); });
                            }
                            else {
                                doInnerSub(bufferedValue);
                            }
                        };
                        while (buffer.length && active < concurrent) {
                            _loop_1();
                        }
                        checkComplete();
                    }
                    catch (err) {
                        subscriber.error(err);
                    }
                }
            }));
        };
        source.subscribe(createOperatorSubscriber(subscriber, outerNext, function () {
            isComplete = true;
            checkComplete();
        }));
        return function () {
            additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
        };
    }

    function mergeMap(project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Infinity; }
        if (isFunction(resultSelector)) {
            return mergeMap(function (a, i) { return map(function (b, ii) { return resultSelector(a, b, i, ii); })(innerFrom(project(a, i))); }, concurrent);
        }
        else if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
        }
        return operate(function (source, subscriber) { return mergeInternals(source, subscriber, project, concurrent); });
    }

    function mergeAll(concurrent) {
        if (concurrent === void 0) { concurrent = Infinity; }
        return mergeMap(identity, concurrent);
    }

    function concatAll() {
        return mergeAll(1);
    }

    function debounceTime(dueTime, scheduler) {
        if (scheduler === void 0) { scheduler = asyncScheduler; }
        return operate(function (source, subscriber) {
            var activeTask = null;
            var lastValue = null;
            var lastTime = null;
            var emit = function () {
                if (activeTask) {
                    activeTask.unsubscribe();
                    activeTask = null;
                    var value = lastValue;
                    lastValue = null;
                    subscriber.next(value);
                }
            };
            function emitWhenIdle() {
                var targetTime = lastTime + dueTime;
                var now = scheduler.now();
                if (now < targetTime) {
                    activeTask = this.schedule(undefined, targetTime - now);
                    subscriber.add(activeTask);
                    return;
                }
                emit();
            }
            source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                lastValue = value;
                lastTime = scheduler.now();
                if (!activeTask) {
                    activeTask = scheduler.schedule(emitWhenIdle, dueTime);
                    subscriber.add(activeTask);
                }
            }, function () {
                emit();
                subscriber.complete();
            }, undefined, function () {
                lastValue = activeTask = null;
            }));
        });
    }

    function concat$1() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return concatAll()(from(args, popScheduler(args)));
    }

    var EMPTY = new Observable(function (subscriber) { return subscriber.complete(); });

    function take(count) {
        return count <= 0
            ?
                function () { return EMPTY; }
            : operate(function (source, subscriber) {
                var seen = 0;
                source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                    if (++seen <= count) {
                        subscriber.next(value);
                        if (count <= seen) {
                            subscriber.complete();
                        }
                    }
                }));
            });
    }

    function ignoreElements() {
        return operate(function (source, subscriber) {
            source.subscribe(createOperatorSubscriber(subscriber, noop));
        });
    }

    function mapTo(value) {
        return map(function () { return value; });
    }

    function delayWhen(delayDurationSelector, subscriptionDelay) {
        if (subscriptionDelay) {
            return function (source) {
                return concat$1(subscriptionDelay.pipe(take(1), ignoreElements()), source.pipe(delayWhen(delayDurationSelector)));
            };
        }
        return mergeMap(function (value, index) { return delayDurationSelector(value, index).pipe(take(1), mapTo(value)); });
    }

    function delay(due, scheduler) {
        if (scheduler === void 0) { scheduler = asyncScheduler; }
        var duration = timer(due, scheduler);
        return delayWhen(function () { return duration; });
    }

    function distinctUntilChanged(comparator, keySelector) {
        if (keySelector === void 0) { keySelector = identity; }
        comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
        return operate(function (source, subscriber) {
            var previousKey;
            var first = true;
            source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                var currentKey = keySelector(value);
                if (first || !comparator(previousKey, currentKey)) {
                    first = false;
                    previousKey = currentKey;
                    subscriber.next(value);
                }
            }));
        });
    }
    function defaultCompare(a, b) {
        return a === b;
    }

    function filter(predicate, thisArg) {
        return operate(function (source, subscriber) {
            var index = 0;
            source.subscribe(createOperatorSubscriber(subscriber, function (value) { return predicate.call(thisArg, value, index++) && subscriber.next(value); }));
        });
    }

    function skip(count) {
        return filter(function (_, index) { return count <= index; });
    }

    function startWith() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var scheduler = popScheduler(values);
        return operate(function (source, subscriber) {
            (scheduler ? concat$1(values, source, scheduler) : concat$1(values, source)).subscribe(subscriber);
        });
    }

    function switchMap(project, resultSelector) {
        return operate(function (source, subscriber) {
            var innerSubscriber = null;
            var index = 0;
            var isComplete = false;
            var checkComplete = function () { return isComplete && !innerSubscriber && subscriber.complete(); };
            source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
                var innerIndex = 0;
                var outerIndex = index++;
                innerFrom(project(value, outerIndex)).subscribe((innerSubscriber = createOperatorSubscriber(subscriber, function (innerValue) { return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue); }, function () {
                    innerSubscriber = null;
                    checkComplete();
                })));
            }, function () {
                isComplete = true;
                checkComplete();
            }));
        });
    }

    function tap(observerOrNext, error, complete) {
        var tapObserver = isFunction(observerOrNext) || error || complete
            ?
                { next: observerOrNext, error: error, complete: complete }
            : observerOrNext;
        return tapObserver
            ? operate(function (source, subscriber) {
                var _a;
                (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                var isUnsub = true;
                source.subscribe(createOperatorSubscriber(subscriber, function (value) {
                    var _a;
                    (_a = tapObserver.next) === null || _a === void 0 ? void 0 : _a.call(tapObserver, value);
                    subscriber.next(value);
                }, function () {
                    var _a;
                    isUnsub = false;
                    (_a = tapObserver.complete) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                    subscriber.complete();
                }, function (err) {
                    var _a;
                    isUnsub = false;
                    (_a = tapObserver.error) === null || _a === void 0 ? void 0 : _a.call(tapObserver, err);
                    subscriber.error(err);
                }, function () {
                    var _a, _b;
                    if (isUnsub) {
                        (_a = tapObserver.unsubscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                    }
                    (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
                }));
            })
            :
                identity;
    }

    //const hasSW = 'serviceWorker' in navigator;
    let hasComplainedAboutSyncEvent = false;
    function registerSyncEvent(db, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Send sync event to SW:
                const sw = yield navigator.serviceWorker.ready;
                if (purpose === "push" && sw.sync) {
                    yield sw.sync.register(`dexie-cloud:${db.name}`);
                }
                if (sw.active) {
                    // Use postMessage for pull syncs and for browsers not supporting sync event (Firefox, Safari).
                    // Also chromium based browsers with sw.sync as a fallback for sleepy sync events not taking action for a while.
                    sw.active.postMessage({
                        type: 'dexie-cloud-sync',
                        dbName: db.name,
                        purpose
                    });
                }
                else {
                    throw new Error(`Failed to trigger sync - there's no active service worker`);
                }
                return;
            }
            catch (e) {
                if (!hasComplainedAboutSyncEvent) {
                    console.debug(`Dexie Cloud: Could not register sync event`, e);
                    hasComplainedAboutSyncEvent = true;
                }
            }
        });
    }
    function registerPeriodicSyncEvent(db) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Register periodicSync event to SW:
                // @ts-ignore
                const { periodicSync } = yield navigator.serviceWorker.ready;
                if (periodicSync) {
                    try {
                        yield periodicSync.register(`dexie-cloud:${db.name}`, (_a = db.cloud.options) === null || _a === void 0 ? void 0 : _a.periodicSync);
                        console.debug(`Dexie Cloud: Successfully registered periodicsync event for ${db.name}`);
                    }
                    catch (e) {
                        console.debug(`Dexie Cloud: Failed to register periodic sync. Your PWA must be installed to allow background sync.`, e);
                    }
                }
                else {
                    console.debug(`Dexie Cloud: periodicSync not supported.`);
                }
            }
            catch (e) {
                console.debug(`Dexie Cloud: Could not register periodicSync for ${db.name}`, e);
            }
        });
    }

    function triggerSync(db, purpose) {
        if (db.cloud.usingServiceWorker) {
            console.debug('registering sync event');
            registerSyncEvent(db, purpose);
        }
        else {
            db.localSyncEvent.next({ purpose });
        }
    }

    const b64decode = typeof Buffer !== "undefined"
        ? (base64) => Buffer.from(base64, "base64")
        : (base64) => {
            const binary_string = atob(base64);
            const len = binary_string.length;
            const bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes;
        };
    const b64encode = typeof Buffer !== "undefined"
        ? (b) => {
            if (ArrayBuffer.isView(b)) {
                return Buffer.from(b.buffer, b.byteOffset, b.byteLength).toString("base64");
            }
            else {
                return Buffer.from(b).toString("base64");
            }
        }
        : (b) => {
            const u8a = ArrayBuffer.isView(b) ? b : new Uint8Array(b);
            const CHUNK_SIZE = 0x1000;
            const strs = [];
            for (let i = 0, l = u8a.length; i < l; i += CHUNK_SIZE) {
                const chunk = u8a.subarray(i, i + CHUNK_SIZE);
                strs.push(String.fromCharCode.apply(null, chunk));
            }
            return btoa(strs.join(""));
        };

    class TokenErrorResponseError extends Error {
        constructor({ title, message, messageCode, messageParams, }) {
            super(message);
            this.name = 'TokenErrorResponseError';
            this.title = title;
            this.messageCode = messageCode;
            this.messageParams = messageParams;
        }
    }

    function interactWithUser(userInteraction, req) {
        return new Promise((resolve, reject) => {
            const interactionProps = Object.assign(Object.assign({ submitLabel: 'Submit', cancelLabel: 'Cancel' }, req), { onSubmit: (res) => {
                    userInteraction.next(undefined);
                    resolve(res);
                }, onCancel: () => {
                    userInteraction.next(undefined);
                    reject(new Dexie.AbortError('User cancelled'));
                } });
            userInteraction.next(interactionProps);
            // Start subscribing for external updates to db.cloud.userInteraction, and if so, cancel this request.
            /*const subscription = userInteraction.subscribe((currentInteractionProps) => {
              if (currentInteractionProps !== interactionProps) {
                if (subscription) subscription.unsubscribe();
                if (!done) {
                  reject(new Dexie.AbortError("User cancelled"));
                }
              }
            });*/
        });
    }
    function alertUser(userInteraction, title, ...alerts) {
        return interactWithUser(userInteraction, {
            type: 'message-alert',
            title,
            alerts,
            fields: {},
            submitLabel: 'OK',
            cancelLabel: null,
        });
    }
    function promptForEmail(userInteraction, title, emailHint) {
        return __awaiter(this, void 0, void 0, function* () {
            let email = emailHint || '';
            // Regular expression for email validation
            // ^[\w-+.]+@([\w-]+\.)+[\w-]{2,10}(\sas\s[\w-+.]+@([\w-]+\.)+[\w-]{2,10})?$
            //
            // ^[\w-+.]+ : Matches the start of the string. Allows one or more word characters
            // (a-z, A-Z, 0-9, and underscore), hyphen, plus, or dot.
            //
            // @ : Matches the @ symbol.
            // ([\w-]+\.)+ : Matches one or more word characters or hyphens followed by a dot.
            //   The plus sign outside the parentheses means this pattern can repeat one or more times,
            //   allowing for subdomains.
            // [\w-]{2,10} : Matches between 2 and 10 word characters or hyphens. This is typically for
            //   the domain extension like .com, .net, etc.
            // (\sas\s[\w-+.]+@([\w-]+\.)+[\w-]{2,10})?$ : This part is optional (due to the ? at the end).
            //   If present, it matches " as " followed by another valid email address. This allows for the
            //   input to be either a single email address or two email addresses separated by " as ". 
            //
            // The use case for "<email1> as <email2>"" is for when a database owner with full access to the
            // database needs to impersonate another user in the database in order to troubleshoot. This
            // format will only be possible to use when email1 is the owner of an API client with GLOBAL_READ
            // and GLOBAL_WRITE permissions on the database. The email will be checked on the server before
            // allowing it and giving out a token for email2, using the OTP sent to email1.
            while (!email || !/^[\w-+.]+@([\w-]+\.)+[\w-]{2,10}(\sas\s[\w-+.]+@([\w-]+\.)+[\w-]{2,10})?$/.test(email)) {
                email = (yield interactWithUser(userInteraction, {
                    type: 'email',
                    title,
                    alerts: email
                        ? [
                            {
                                type: 'error',
                                messageCode: 'INVALID_EMAIL',
                                message: 'Please enter a valid email address',
                                messageParams: {},
                            },
                        ]
                        : [],
                    fields: {
                        email: {
                            type: 'email',
                            placeholder: 'you@somedomain.com',
                        },
                    },
                })).email;
            }
            return email;
        });
    }
    function promptForOTP(userInteraction, email, alert) {
        return __awaiter(this, void 0, void 0, function* () {
            const alerts = [
                {
                    type: 'info',
                    messageCode: 'OTP_SENT',
                    message: `A One-Time password has been sent to {email}`,
                    messageParams: { email },
                },
            ];
            if (alert) {
                alerts.push(alert);
            }
            const { otp } = yield interactWithUser(userInteraction, {
                type: 'otp',
                title: 'Enter OTP',
                alerts,
                fields: {
                    otp: {
                        type: 'otp',
                        label: 'OTP',
                        placeholder: 'Paste OTP here',
                    },
                },
            });
            return otp;
        });
    }
    function confirmLogout(userInteraction, currentUserId, numUnsyncedChanges) {
        return __awaiter(this, void 0, void 0, function* () {
            const alerts = [
                {
                    type: 'warning',
                    messageCode: 'LOGOUT_CONFIRMATION',
                    message: `{numUnsyncedChanges} unsynced changes will get lost!
                Logout anyway?`,
                    messageParams: {
                        currentUserId,
                        numUnsyncedChanges: numUnsyncedChanges.toString(),
                    }
                },
            ];
            return yield interactWithUser(userInteraction, {
                type: 'logout-confirmation',
                title: 'Confirm Logout',
                alerts,
                fields: {},
                submitLabel: 'Confirm logout',
                cancelLabel: 'Cancel'
            })
                .then(() => true)
                .catch(() => false);
        });
    }

    function loadAccessToken(db) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield db.getCurrentUser();
            const { accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration, claims, } = currentUser;
            if (!accessToken)
                return null;
            const expTime = (_a = accessTokenExpiration === null || accessTokenExpiration === void 0 ? void 0 : accessTokenExpiration.getTime()) !== null && _a !== void 0 ? _a : Infinity;
            if (expTime > Date.now() && (((_b = currentUser.license) === null || _b === void 0 ? void 0 : _b.status) || 'ok') === 'ok') {
                return currentUser;
            }
            if (!refreshToken) {
                throw new Error(`Refresh token missing`);
            }
            const refreshExpTime = (_c = refreshTokenExpiration === null || refreshTokenExpiration === void 0 ? void 0 : refreshTokenExpiration.getTime()) !== null && _c !== void 0 ? _c : Infinity;
            if (refreshExpTime <= Date.now()) {
                throw new Error(`Refresh token has expired`);
            }
            const refreshedLogin = yield refreshAccessToken(db.cloud.options.databaseUrl, currentUser);
            yield db.table('$logins').update(claims.sub, {
                accessToken: refreshedLogin.accessToken,
                accessTokenExpiration: refreshedLogin.accessTokenExpiration,
                claims: refreshedLogin.claims,
                license: refreshedLogin.license,
            });
            return refreshedLogin;
        });
    }
    function authenticate(url, context, fetchToken, userInteraction, hints) {
        return __awaiter(this, void 0, void 0, function* () {
            if (context.accessToken &&
                context.accessTokenExpiration.getTime() > Date.now()) {
                return context;
            }
            else if (context.refreshToken &&
                (!context.refreshTokenExpiration ||
                    context.refreshTokenExpiration.getTime() > Date.now())) {
                return yield refreshAccessToken(url, context);
            }
            else {
                return yield userAuthenticate(context, fetchToken, userInteraction, hints);
            }
        });
    }
    function refreshAccessToken(url, login) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!login.refreshToken)
                throw new Error(`Cannot refresh token - refresh token is missing.`);
            if (!login.nonExportablePrivateKey)
                throw new Error(`login.nonExportablePrivateKey is missing - cannot sign refresh token without a private key.`);
            const time_stamp = Date.now();
            const signing_algorithm = 'RSASSA-PKCS1-v1_5';
            const textEncoder = new TextEncoder();
            const data = textEncoder.encode(login.refreshToken + time_stamp);
            const binarySignature = yield crypto.subtle.sign(signing_algorithm, login.nonExportablePrivateKey, data);
            const signature = b64encode(binarySignature);
            const tokenRequest = {
                grant_type: 'refresh_token',
                refresh_token: login.refreshToken,
                scopes: ['ACCESS_DB'],
                signature,
                signing_algorithm,
                time_stamp,
            };
            const res = yield fetch(`${url}/token`, {
                body: JSON.stringify(tokenRequest),
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors',
            });
            if (res.status !== 200)
                throw new Error(`RefreshToken: Status ${res.status} from ${url}/token`);
            const response = yield res.json();
            if (response.type === 'error') {
                throw new TokenErrorResponseError(response);
            }
            login.accessToken = response.accessToken;
            login.accessTokenExpiration = response.accessTokenExpiration
                ? new Date(response.accessTokenExpiration)
                : undefined;
            login.claims = response.claims;
            login.license = {
                type: response.userType,
                status: response.claims.license || 'ok',
            };
            if (response.evalDaysLeft != null) {
                login.license.evalDaysLeft = response.evalDaysLeft;
            }
            if (response.userValidUntil != null) {
                login.license.validUntil = new Date(response.userValidUntil);
            }
            if (response.data) {
                login.data = response.data;
            }
            return login;
        });
    }
    function userAuthenticate(context, fetchToken, userInteraction, hints) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!crypto.subtle) {
                if (typeof location !== 'undefined' && location.protocol === 'http:') {
                    throw new Error(`Dexie Cloud Addon needs to use WebCrypto, but your browser has disabled it due to being served from an insecure location. Please serve it from https or http://localhost:<port> (See https://stackoverflow.com/questions/46670556/how-to-enable-crypto-subtle-for-unsecure-origins-in-chrome/46671627#46671627)`);
                }
                else {
                    throw new Error(`This browser does not support WebCrypto.`);
                }
            }
            const { privateKey, publicKey } = yield crypto.subtle.generateKey({
                name: 'RSASSA-PKCS1-v1_5',
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: { name: 'SHA-256' },
            }, false, // Non-exportable...
            ['sign', 'verify']);
            if (!privateKey || !publicKey)
                throw new Error(`Could not generate RSA keypair`); // Typings suggest these can be undefined...
            context.nonExportablePrivateKey = privateKey; //...but storable!
            const publicKeySPKI = yield crypto.subtle.exportKey('spki', publicKey);
            const publicKeyPEM = spkiToPEM(publicKeySPKI);
            context.publicKey = publicKey;
            try {
                const response2 = yield fetchToken({
                    public_key: publicKeyPEM,
                    hints,
                });
                if (response2.type === 'error') {
                    throw new TokenErrorResponseError(response2);
                }
                if (response2.type !== 'tokens')
                    throw new Error(`Unexpected response type from token endpoint: ${response2.type}`);
                /*const licenseStatus = response2.claims.license || 'ok';
                if (licenseStatus !== 'ok') {
                  throw new InvalidLicenseError(licenseStatus);
                }*/
                context.accessToken = response2.accessToken;
                context.accessTokenExpiration = new Date(response2.accessTokenExpiration);
                context.refreshToken = response2.refreshToken;
                if (response2.refreshTokenExpiration) {
                    context.refreshTokenExpiration = new Date(response2.refreshTokenExpiration);
                }
                context.userId = response2.claims.sub;
                context.email = response2.claims.email;
                context.name = response2.claims.name;
                context.claims = response2.claims;
                context.license = {
                    type: response2.userType,
                    status: response2.claims.license || 'ok',
                };
                context.data = response2.data;
                if (response2.evalDaysLeft != null) {
                    context.license.evalDaysLeft = response2.evalDaysLeft;
                }
                if (response2.userValidUntil != null) {
                    context.license.validUntil = new Date(response2.userValidUntil);
                }
                if (response2.alerts && response2.alerts.length > 0) {
                    yield interactWithUser(userInteraction, {
                        type: 'message-alert',
                        title: 'Authentication Alert',
                        fields: {},
                        alerts: response2.alerts,
                    });
                }
                return context;
            }
            catch (error) {
                if (error instanceof TokenErrorResponseError) {
                    yield alertUser(userInteraction, error.title, {
                        type: 'error',
                        messageCode: error.messageCode,
                        message: error.message,
                        messageParams: {},
                    });
                    throw error;
                }
                let message = `We're having a problem authenticating right now.`;
                console.error(`Error authenticating`, error);
                if (error instanceof TypeError) {
                    const isOffline = typeof navigator !== undefined && !navigator.onLine;
                    if (isOffline) {
                        message = `You seem to be offline. Please connect to the internet and try again.`;
                    }
                    else if (Dexie.debug || (typeof location !== 'undefined' && (location.hostname === 'localhost' || location.hostname === '127.0.0.1'))) {
                        // The audience is most likely the developer. Suggest to whitelist the localhost origin:
                        message = `Could not connect to server. Please verify that your origin '${location.origin}' is whitelisted using \`npx dexie-cloud whitelist\``;
                    }
                    else {
                        message = `Could not connect to server. Please verify the connection.`;
                    }
                    yield alertUser(userInteraction, 'Authentication Failed', {
                        type: 'error',
                        messageCode: 'GENERIC_ERROR',
                        message,
                        messageParams: {},
                    }).catch(() => { });
                }
                throw error;
            }
        });
    }
    function spkiToPEM(keydata) {
        const keydataB64 = b64encode(keydata);
        const keydataB64Pem = formatAsPem(keydataB64);
        return keydataB64Pem;
    }
    function formatAsPem(str) {
        let finalString = '-----BEGIN PUBLIC KEY-----\n';
        while (str.length > 0) {
            finalString += str.substring(0, 64) + '\n';
            str = str.substring(64);
        }
        finalString = finalString + '-----END PUBLIC KEY-----';
        return finalString;
    }

    // Emulate true-private property db. Why? So it's not stored in DB.
    const wm$1 = new WeakMap();
    class AuthPersistedContext {
        constructor(db, userLogin) {
            wm$1.set(this, db);
            Object.assign(this, userLogin);
        }
        static load(db, userId) {
            return db
                .table("$logins")
                .get(userId)
                .then((userLogin) => new AuthPersistedContext(db, userLogin || {
                userId,
                claims: {
                    sub: userId
                },
                lastLogin: new Date(0)
            }));
        }
        save() {
            return __awaiter(this, void 0, void 0, function* () {
                const db = wm$1.get(this);
                db.table("$logins").put(this);
            });
        }
    }

    const UNAUTHORIZED_USER = {
        userId: "unauthorized",
        name: "Unauthorized",
        claims: {
            sub: "unauthorized",
        },
        lastLogin: new Date(0)
    };
    try {
        Object.freeze(UNAUTHORIZED_USER);
        Object.freeze(UNAUTHORIZED_USER.claims);
    }
    catch (_a) { }

    function waitUntil(o, // Works with Dexie's liveQuery observables if we'd need that
    predicate) {
        return rxjs.firstValueFrom(rxjs.from(o).pipe(rxjs.filter(predicate)));
    }

    function logout(db) {
        return __awaiter(this, void 0, void 0, function* () {
            const numUnsyncedChanges = yield _logout(db);
            if (numUnsyncedChanges) {
                if (yield confirmLogout(db.cloud.userInteraction, db.cloud.currentUserId, numUnsyncedChanges)) {
                    yield _logout(db, { deleteUnsyncedData: true });
                }
                else {
                    throw new Error(`User cancelled logout due to unsynced changes`);
                }
            }
        });
    }
    function _logout(db, { deleteUnsyncedData = false } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Clear the database without emptying configuration options.
            const [numUnsynced, loggedOut] = yield db.dx.transaction('rw', db.dx.tables, (tx) => __awaiter(this, void 0, void 0, function* () {
                // @ts-ignore
                const idbtrans = tx.idbtrans;
                idbtrans.disableChangeTracking = true;
                idbtrans.disableAccessControl = true;
                const mutationTables = tx.storeNames.filter((tableName) => tableName.endsWith('_mutations'));
                // Count unsynced changes
                const unsyncCounts = yield Promise.all(mutationTables.map((mutationTable) => tx.table(mutationTable).count()));
                const sumUnSynced = unsyncCounts.reduce((a, b) => a + b, 0);
                if (sumUnSynced > 0 && !deleteUnsyncedData) {
                    // Let caller ask user if they want to delete unsynced data.
                    return [sumUnSynced, false];
                }
                // Either there are no unsynched changes, or caller provided flag deleteUnsynchedData = true.
                // Clear all tables except $jobs and $syncState (except the persisted sync state which is
                // also cleared because we're going to rebuild it using a fresh sync).
                db.$syncState.delete('syncState');
                for (const table of db.dx.tables) {
                    if (table.name !== '$jobs' && table.name !== '$syncState') {
                        table.clear();
                    }
                }
                return [sumUnSynced, true];
            }));
            if (loggedOut) {
                // Wait for currentUser observable to emit UNAUTHORIZED_USER
                yield waitUntil(db.cloud.currentUser, (user) => user.userId === UNAUTHORIZED_USER.userId);
                // Then perform an initial sync
                yield db.cloud.sync({ purpose: 'pull', wait: true });
            }
            return numUnsynced;
        });
    }

    class HttpError extends Error {
        constructor(res, message) {
            super(message || `${res.status} ${res.statusText}`);
            this.httpStatus = res.status;
        }
        get name() {
            return "HttpError";
        }
    }

    function otpFetchTokenCallback(db) {
        const { userInteraction } = db.cloud;
        return function otpAuthenticate({ public_key, hints }) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                let tokenRequest;
                const url = (_a = db.cloud.options) === null || _a === void 0 ? void 0 : _a.databaseUrl;
                if (!url)
                    throw new Error(`No database URL given.`);
                if ((hints === null || hints === void 0 ? void 0 : hints.grant_type) === 'demo') {
                    const demo_user = yield promptForEmail(userInteraction, 'Enter a demo user email', (hints === null || hints === void 0 ? void 0 : hints.email) || (hints === null || hints === void 0 ? void 0 : hints.userId));
                    tokenRequest = {
                        demo_user,
                        grant_type: 'demo',
                        scopes: ['ACCESS_DB'],
                        public_key
                    };
                }
                else if ((hints === null || hints === void 0 ? void 0 : hints.otpId) && hints.otp) {
                    // User provided OTP ID and OTP code. This means that the OTP email
                    // has already gone out and the user may have clicked a magic link
                    // in the email with otp and otpId in query and the app has picked
                    // up those values and passed them to db.cloud.login().
                    tokenRequest = {
                        grant_type: 'otp',
                        otp_id: hints.otpId,
                        otp: hints.otp,
                        scopes: ['ACCESS_DB'],
                        public_key,
                    };
                }
                else {
                    const email = yield promptForEmail(userInteraction, 'Enter email address', hints === null || hints === void 0 ? void 0 : hints.email);
                    if (/@demo.local$/.test(email)) {
                        tokenRequest = {
                            demo_user: email,
                            grant_type: 'demo',
                            scopes: ['ACCESS_DB'],
                            public_key
                        };
                    }
                    else {
                        tokenRequest = {
                            email,
                            grant_type: 'otp',
                            scopes: ['ACCESS_DB'],
                        };
                    }
                }
                const res1 = yield fetch(`${url}/token`, {
                    body: JSON.stringify(tokenRequest),
                    method: 'post',
                    headers: { 'Content-Type': 'application/json', mode: 'cors' },
                });
                if (res1.status !== 200) {
                    const errMsg = yield res1.text();
                    yield alertUser(userInteraction, "Token request failed", {
                        type: 'error',
                        messageCode: 'GENERIC_ERROR',
                        message: errMsg,
                        messageParams: {}
                    }).catch(() => { });
                    throw new HttpError(res1, errMsg);
                }
                const response = yield res1.json();
                if (response.type === 'tokens' || response.type === 'error') {
                    // Demo user request can get a "tokens" response right away
                    // Error can also be returned right away.
                    return response;
                }
                else if (tokenRequest.grant_type === 'otp' && 'email' in tokenRequest) {
                    if (response.type !== 'otp-sent')
                        throw new Error(`Unexpected response from ${url}/token`);
                    const otp = yield promptForOTP(userInteraction, tokenRequest.email);
                    const tokenRequest2 = Object.assign(Object.assign({}, tokenRequest), { otp: otp || '', otp_id: response.otp_id, public_key });
                    let res2 = yield fetch(`${url}/token`, {
                        body: JSON.stringify(tokenRequest2),
                        method: 'post',
                        headers: { 'Content-Type': 'application/json' },
                        mode: 'cors',
                    });
                    while (res2.status === 401) {
                        const errorText = yield res2.text();
                        tokenRequest2.otp = yield promptForOTP(userInteraction, tokenRequest.email, {
                            type: 'error',
                            messageCode: 'INVALID_OTP',
                            message: errorText,
                            messageParams: {}
                        });
                        res2 = yield fetch(`${url}/token`, {
                            body: JSON.stringify(tokenRequest2),
                            method: 'post',
                            headers: { 'Content-Type': 'application/json' },
                            mode: 'cors',
                        });
                    }
                    if (res2.status !== 200) {
                        const errMsg = yield res2.text();
                        throw new HttpError(res2, errMsg);
                    }
                    const response2 = yield res2.json();
                    return response2;
                }
                else {
                    throw new Error(`Unexpected response from ${url}/token`);
                }
            });
        };
    }

    /** A way to log to console in production without terser stripping out
     * it from the release bundle.
     * This should be used very rarely and only in places where it's
     * absolutely necessary to log something in production.
     *
     * @param level
     * @param args
     */
    function prodLog(level, ...args) {
        globalThis["con" + "sole"][level](...args);
    }

    /** This function changes or sets the current user as requested.
     *
     * Use cases:
     * * Initially on db.ready after reading the current user from db.$logins.
     *   This will make sure that any unsynced operations from the previous user is synced before
     *   changing the user.
     * * Upon user request
     *
     * @param db
     * @param newUser
     */
    function setCurrentUser(db, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.userId === db.cloud.currentUserId)
                return; // Already this user.
            const $logins = db.table('$logins');
            yield db.transaction('rw', $logins, (tx) => __awaiter(this, void 0, void 0, function* () {
                const existingLogins = yield $logins.toArray();
                yield Promise.all(existingLogins
                    .filter((login) => login.userId !== user.userId && login.isLoggedIn)
                    .map((login) => {
                    login.isLoggedIn = false;
                    return $logins.put(login);
                }));
                user.isLoggedIn = true;
                user.lastLogin = new Date();
                try {
                    yield user.save();
                }
                catch (e) {
                    try {
                        if (e.name === 'DataCloneError') {
                            // We've seen this buggy behavior in some browsers and in case it happens
                            // again we really need to collect the details to understand what's going on.
                            prodLog('debug', `Login context property names:`, Object.keys(user));
                            prodLog('debug', `Login context property names:`, Object.keys(user));
                            prodLog('debug', `Login context:`, user);
                            prodLog('debug', `Login context JSON:`, JSON.stringify(user));
                        }
                    }
                    catch (_a) { }
                    throw e;
                }
                console.debug('Saved new user', user.email);
            }));
            yield waitUntil(db.cloud.currentUser, (currentUser) => currentUser.userId === user.userId);
        });
    }

    function login(db, hints) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield db.getCurrentUser();
            const origUserId = currentUser.userId;
            if (currentUser.isLoggedIn && (!hints || (!hints.email && !hints.userId))) {
                const licenseStatus = ((_a = currentUser.license) === null || _a === void 0 ? void 0 : _a.status) || 'ok';
                if (licenseStatus === 'ok' &&
                    currentUser.accessToken &&
                    (!currentUser.accessTokenExpiration ||
                        currentUser.accessTokenExpiration.getTime() > Date.now())) {
                    // Already authenticated according to given hints. And license is valid.
                    return false;
                }
                if (currentUser.refreshToken &&
                    (!currentUser.refreshTokenExpiration ||
                        currentUser.refreshTokenExpiration.getTime() > Date.now())) {
                    // Refresh the token
                    yield loadAccessToken(db);
                    return false;
                }
                // No refresh token - must re-authenticate:
            }
            const context = new AuthPersistedContext(db, {
                claims: {},
                lastLogin: new Date(0),
            });
            yield authenticate(db.cloud.options.databaseUrl, context, db.cloud.options.fetchTokens || otpFetchTokenCallback(db), db.cloud.userInteraction, hints);
            if (origUserId !== UNAUTHORIZED_USER.userId &&
                context.userId !== origUserId) {
                // User was logged in before, but now logged in as another user.
                yield logout(db);
            }
            /*try {
              await context.save();
            } catch (e) {
              try {
                if (e.name === 'DataCloneError') {
                  console.debug(`Login context property names:`, Object.keys(context));
                  console.debug(`Login context:`, context);
                  console.debug(`Login context JSON:`, JSON.stringify(context));
                }
              } catch {}
              throw e;
            }*/
            yield setCurrentUser(db, context);
            // Make sure to resync as the new login will be authorized
            // for new realms.
            triggerSync(db, 'pull');
            return context.userId !== origUserId;
        });
    }

    const swHolder = {};
    const swContainer = typeof self !== 'undefined' && self.document && // self.document is to verify we're not the SW ourself
        typeof navigator !== 'undefined' && navigator.serviceWorker;
    if (swContainer)
        swContainer.ready.then((registration) => (swHolder.registration = registration));
    if (typeof self !== 'undefined' && 'clients' in self && !self.document) {
        // We are the service worker. Propagate messages to all our clients.
        addEventListener('message', (ev) => {
            var _a, _b;
            if ((_b = (_a = ev.data) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.startsWith('sw-broadcast-')) {
                [...self['clients'].matchAll({ includeUncontrolled: true })].forEach((client) => { var _a; return client.id !== ((_a = ev.source) === null || _a === void 0 ? void 0 : _a.id) && client.postMessage(ev.data); });
            }
        });
    }
    /** This class is a fallback for browsers that lacks BroadcastChannel but have
     * service workers (which is Safari versions 11.1 through 15.3).
     * Safari 15.4 with BroadcastChannel was released on 2022-03-14.
     * We might be able to remove this class in a near future as Safari < 15.4 is
     * already very low in market share as of 2023-03-10.
     */
    class SWBroadcastChannel {
        constructor(name) {
            this.name = name;
        }
        subscribe(listener) {
            if (!swContainer)
                return () => { };
            const forwarder = (ev) => {
                var _a;
                if (((_a = ev.data) === null || _a === void 0 ? void 0 : _a.type) === `sw-broadcast-${this.name}`) {
                    listener(ev.data.message);
                }
            };
            swContainer.addEventListener('message', forwarder);
            return () => swContainer.removeEventListener('message', forwarder);
        }
        postMessage(message) {
            var _a;
            if (typeof self['clients'] === 'object') {
                // We're a service worker. Propagate to our browser clients.
                [...self['clients'].matchAll({ includeUncontrolled: true })].forEach((client) => client.postMessage({
                    type: `sw-broadcast-${this.name}`,
                    message,
                }));
            }
            else if (swHolder.registration) {
                // We're a client (browser window or other worker)
                // Post to SW so it can repost to all its clients and to itself
                (_a = swHolder.registration.active) === null || _a === void 0 ? void 0 : _a.postMessage({
                    type: `sw-broadcast-${this.name}`,
                    message,
                });
            }
        }
    }

    const events = globalThis['lbc-events'] || (globalThis['lbc-events'] = new Map());
    function addListener(name, listener) {
        if (events.has(name)) {
            events.get(name).push(listener);
        }
        else {
            events.set(name, [listener]);
        }
    }
    function removeListener(name, listener) {
        const listeners = events.get(name);
        if (listeners) {
            const idx = listeners.indexOf(listener);
            if (idx !== -1) {
                listeners.splice(idx, 1);
            }
        }
    }
    function dispatch(ev) {
        const listeners = events.get(ev.type);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(ev);
                }
                catch (_a) {
                }
            });
        }
    }
    class BroadcastedAndLocalEvent extends rxjs.Observable {
        constructor(name) {
            const bc = typeof BroadcastChannel === "undefined"
                ? new SWBroadcastChannel(name) : new BroadcastChannel(name);
            super(subscriber => {
                function onCustomEvent(ev) {
                    subscriber.next(ev.detail);
                }
                function onMessageEvent(ev) {
                    console.debug("BroadcastedAndLocalEvent: onMessageEvent", ev);
                    subscriber.next(ev.data);
                }
                let unsubscribe;
                //self.addEventListener(`lbc-${name}`, onCustomEvent); // Fails in service workers
                addListener(`lbc-${name}`, onCustomEvent); // Works better in service worker
                try {
                    if (bc instanceof SWBroadcastChannel) {
                        unsubscribe = bc.subscribe(message => subscriber.next(message));
                    }
                    else {
                        console.debug("BroadcastedAndLocalEvent: bc.addEventListener()", name, "bc is a", bc);
                        bc.addEventListener("message", onMessageEvent);
                    }
                }
                catch (err) {
                    // Service workers might fail to subscribe outside its initial script.
                    console.warn('Failed to subscribe to broadcast channel', err);
                }
                return () => {
                    //self.removeEventListener(`lbc-${name}`, onCustomEvent);
                    removeListener(`lbc-${name}`, onCustomEvent);
                    if (bc instanceof SWBroadcastChannel) {
                        unsubscribe();
                    }
                    else {
                        bc.removeEventListener("message", onMessageEvent);
                    }
                };
            });
            this.name = name;
            this.bc = bc;
        }
        next(message) {
            console.debug("BroadcastedAndLocalEvent: bc.postMessage()", Object.assign({}, message), "bc is a", this.bc);
            this.bc.postMessage(message);
            const ev = new CustomEvent(`lbc-${this.name}`, { detail: message });
            //self.dispatchEvent(ev);
            dispatch(ev);
        }
    }

    function computeRealmSetHash({ realms, inviteRealms, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify([
                ...realms.map((realmId) => ({ realmId, accepted: true })),
                ...inviteRealms.map((realmId) => ({ realmId, accepted: false })),
            ].sort((a, b) => a.realmId < b.realmId ? -1 : a.realmId > b.realmId ? 1 : 0));
            const byteArray = new TextEncoder().encode(data);
            const digestBytes = yield crypto.subtle.digest('SHA-1', byteArray);
            const base64 = b64encode(digestBytes);
            return base64;
        });
    }

    function getSyncableTables(db) {
        return Object.entries(db.cloud.schema || {})
            .filter(([, { markedForSync }]) => markedForSync)
            .map(([tbl]) => db.tables.filter(({ name }) => name === tbl)[0])
            .filter(cloudTableSchema => cloudTableSchema);
    }

    function getMutationTable(tableName) {
        return `$${tableName}_mutations`;
    }

    function getTableFromMutationTable(mutationTable) {
        var _a;
        const tableName = (_a = /^\$(.*)_mutations$/.exec(mutationTable)) === null || _a === void 0 ? void 0 : _a[1];
        if (!tableName)
            throw new Error(`Given mutationTable ${mutationTable} is not correct`);
        return tableName;
    }

    const concat = [].concat;
    function flatten(a) {
        return concat.apply([], a);
    }

    function listClientChanges(mutationTables, db, { since = {}, limit = Infinity } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const allMutsOnTables = yield Promise.all(mutationTables.map((mutationTable) => __awaiter(this, void 0, void 0, function* () {
                const tableName = getTableFromMutationTable(mutationTable.name);
                const lastRevision = since[tableName];
                let query = lastRevision
                    ? mutationTable.where('rev').above(lastRevision)
                    : mutationTable;
                if (limit < Infinity)
                    query = query.limit(limit);
                const muts = yield query.toArray();
                //const objTable = db.table(tableName);
                /*for (const mut of muts) {
                  if (mut.type === "insert" || mut.type === "upsert") {
                    mut.values = await objTable.bulkGet(mut.keys);
                  }
                }*/
                return muts.map((mut) => ({
                    table: tableName,
                    mut,
                }));
            })));
            // Sort by time to get a true order of the operations (between tables)
            const sorted = flatten(allMutsOnTables).sort((a, b) => a.mut.txid === b.mut.txid
                ? a.mut.opNo - b.mut.opNo // Within same transaction, sort by opNo
                : a.mut.ts - b.mut.ts // Different transactions - sort by timestamp when mutation resolved
            );
            const result = [];
            let currentEntry = null;
            let currentTxid = null;
            for (const { table, mut } of sorted) {
                if (currentEntry &&
                    currentEntry.table === table &&
                    currentTxid === mut.txid) {
                    currentEntry.muts.push(mut);
                }
                else {
                    currentEntry = {
                        table,
                        muts: [mut],
                    };
                    currentTxid = mut.txid;
                    result.push(currentEntry);
                }
            }
            // Filter out those tables that doesn't have any mutations:
            return result;
        });
    }

    function randomString(bytes) {
        const buf = new Uint8Array(bytes);
        if (typeof crypto !== 'undefined') {
            crypto.getRandomValues(buf);
        }
        else {
            for (let i = 0; i < bytes; i++)
                buf[i] = Math.floor(Math.random() * 256);
        }
        if (typeof Buffer !== 'undefined' && Buffer.from) {
            return Buffer.from(buf).toString('base64');
        }
        else if (typeof btoa !== 'undefined') {
            return btoa(String.fromCharCode.apply(null, buf));
        }
        else {
            throw new Error('No btoa or Buffer available');
        }
    }

    function listSyncifiedChanges(tablesToSyncify, currentUser, schema, alreadySyncedRealms) {
        return __awaiter(this, void 0, void 0, function* () {
            const txid = `upload-${randomString(8)}`;
            if (currentUser.isLoggedIn) {
                if (tablesToSyncify.length > 0) {
                    const ignoredRealms = new Set(alreadySyncedRealms || []);
                    const upserts = yield Promise.all(tablesToSyncify.map((table) => __awaiter(this, void 0, void 0, function* () {
                        const { extractKey } = table.core.schema.primaryKey;
                        if (!extractKey)
                            return { table: table.name, muts: [] }; // Outbound tables are not synced.
                        const dexieCloudTableSchema = schema[table.name];
                        const query = (dexieCloudTableSchema === null || dexieCloudTableSchema === void 0 ? void 0 : dexieCloudTableSchema.generatedGlobalId)
                            ? table.filter((item) => {
                                extractKey(item);
                                return (!ignoredRealms.has(item.realmId || '') &&
                                    //(id[0] !== '#' || !!item.$ts) && // Private obj need no sync if not changed
                                    isValidAtID(extractKey(item), dexieCloudTableSchema === null || dexieCloudTableSchema === void 0 ? void 0 : dexieCloudTableSchema.idPrefix));
                            })
                            : table.filter((item) => {
                                const id = extractKey(item);
                                return (!ignoredRealms.has(item.realmId || '') &&
                                    //(id[0] !== '#' || !!item.$ts) && // Private obj need no sync if not changed
                                    isValidSyncableID(id));
                            });
                        const unsyncedObjects = yield query.toArray();
                        if (unsyncedObjects.length > 0) {
                            const mut = {
                                type: 'upsert',
                                values: unsyncedObjects,
                                keys: unsyncedObjects.map(extractKey),
                                userId: currentUser.userId,
                                txid,
                            };
                            return {
                                table: table.name,
                                muts: [mut],
                            };
                        }
                        else {
                            return {
                                table: table.name,
                                muts: [],
                            };
                        }
                    })));
                    return upserts.filter((op) => op.muts.length > 0);
                }
            }
            return [];
        });
    }

    function getTablesToSyncify(db, syncState) {
        const syncedTables = (syncState === null || syncState === void 0 ? void 0 : syncState.syncedTables) || [];
        const syncableTables = getSyncableTables(db);
        const tablesToSyncify = syncableTables.filter((tbl) => !syncedTables.includes(tbl.name));
        return tablesToSyncify;
    }

    const { toString: toStr } = {};
    function getToStringTag(val) {
        return toStr.call(val).slice(8, -1);
    }
    function escapeDollarProps(value) {
        const keys = Object.keys(value);
        let dollarKeys = null;
        for (let i = 0, l = keys.length; i < l; ++i) {
            if (keys[i][0] === "$") {
                dollarKeys = dollarKeys || [];
                dollarKeys.push(keys[i]);
            }
        }
        if (!dollarKeys)
            return value;
        const clone = { ...value };
        for (const k of dollarKeys) {
            delete clone[k];
        }
        for (const k of dollarKeys) {
            clone["$" + k] = value[k];
        }
        return clone;
    }
    const ObjectDef = {
        replace: escapeDollarProps,
    };
    function TypesonSimplified(...typeDefsInputs) {
        const typeDefs = typeDefsInputs.reduce((p, c) => ({ ...p, ...c }), typeDefsInputs.reduce((p, c) => ({ ...c, ...p }), {}));
        const protoMap = new WeakMap();
        return {
            stringify(value, alternateChannel, space) {
                const json = JSON.stringify(value, function (key) {
                    const realVal = this[key];
                    const typeDef = getTypeDef(realVal);
                    return typeDef
                        ? typeDef.replace(realVal, alternateChannel, typeDefs)
                        : realVal;
                }, space);
                return json;
            },
            parse(tson, alternateChannel) {
                const stack = [];
                return JSON.parse(tson, function (key, value) {
                    //
                    // Parent Part
                    //
                    const type = value === null || value === void 0 ? void 0 : value.$t;
                    if (type) {
                        const typeDef = typeDefs[type];
                        value = typeDef
                            ? typeDef.revive(value, alternateChannel, typeDefs)
                            : value;
                    }
                    let top = stack[stack.length - 1];
                    if (top && top[0] === value) {
                        // Do what the kid told us to
                        // Unescape dollar props
                        value = { ...value };
                        // Delete keys that children wanted us to delete
                        for (const k of top[1])
                            delete value[k];
                        // Set keys that children wanted us to set
                        for (const [k, v] of Object.entries(top[2])) {
                            value[k] = v;
                        }
                        stack.pop();
                    }
                    //
                    // Child part
                    //
                    if (value === undefined || (key[0] === "$" && key !== "$t")) {
                        top = stack[stack.length - 1];
                        let deletes;
                        let mods;
                        if (top && top[0] === this) {
                            deletes = top[1];
                            mods = top[2];
                        }
                        else {
                            stack.push([this, (deletes = []), (mods = {})]);
                        }
                        if (key[0] === "$" && key !== "$t") {
                            // Unescape props (also preserves undefined if this is a combo)
                            deletes.push(key);
                            mods[key.substr(1)] = value;
                        }
                        else {
                            // Preserve undefined
                            mods[key] = undefined;
                        }
                    }
                    return value;
                });
            },
        };
        function getTypeDef(realVal) {
            const type = typeof realVal;
            switch (typeof realVal) {
                case "object":
                case "function": {
                    // "object", "function", null
                    if (realVal === null)
                        return null;
                    const proto = Object.getPrototypeOf(realVal);
                    if (!proto)
                        return ObjectDef;
                    let typeDef = protoMap.get(proto);
                    if (typeDef !== undefined)
                        return typeDef; // Null counts to! So the caching of Array.prototype also counts.
                    const toStringTag = getToStringTag(realVal);
                    const entry = Object.entries(typeDefs).find(([typeName, typeDef]) => { var _a, _b; return (_b = (_a = typeDef === null || typeDef === void 0 ? void 0 : typeDef.test) === null || _a === void 0 ? void 0 : _a.call(typeDef, realVal, toStringTag)) !== null && _b !== void 0 ? _b : typeName === toStringTag; });
                    typeDef = entry === null || entry === void 0 ? void 0 : entry[1];
                    if (!typeDef) {
                        typeDef = Array.isArray(realVal)
                            ? null
                            : typeof realVal === "function"
                                ? typeDefs.function || null
                                : ObjectDef;
                    }
                    protoMap.set(proto, typeDef);
                    return typeDef;
                }
                default:
                    return typeDefs[type];
            }
        }
    }

    const BisonBinaryTypes = {
        Blob: {
            test: (blob, toStringTag) => toStringTag === "Blob",
            replace: (blob, altChannel) => {
                const i = altChannel.length;
                altChannel.push(blob);
                return {
                    $t: "Blob",
                    mimeType: blob.type,
                    i,
                };
            },
            revive: ({ i, mimeType }, altChannel) => new Blob([altChannel[i]], { type: mimeType }),
        },
    };

    var numberDef = {
        number: {
            replace: (num) => {
                switch (true) {
                    case isNaN(num):
                        return { $t: "number", v: "NaN" };
                    case num === Infinity:
                        return { $t: "number", v: "Infinity" };
                    case num === -Infinity:
                        return { $t: "number", v: "-Infinity" };
                    default:
                        return num;
                }
            },
            revive: ({ v }) => Number(v),
        },
    };

    const bigIntDef$1 = {
        bigint: {
            replace: (realVal) => {
                return { $t: "bigint", v: "" + realVal };
            },
            revive: (obj) => BigInt(obj.v),
        },
    };

    var DateDef = {
        Date: {
            replace: (date) => ({
                $t: "Date",
                v: isNaN(date.getTime()) ? "NaN" : date.toISOString(),
            }),
            revive: ({ v }) => new Date(v === "NaN" ? NaN : Date.parse(v)),
        },
    };

    var SetDef = {
        Set: {
            replace: (set) => ({
                $t: "Set",
                v: Array.from(set.entries()),
            }),
            revive: ({ v }) => new Set(v),
        },
    };

    var MapDef = {
        Map: {
            replace: (map) => ({
                $t: "Map",
                v: Array.from(map.entries()),
            }),
            revive: ({ v }) => new Map(v),
        },
    };

    const _global = typeof globalThis !== "undefined" // All modern environments (node, bun, deno, browser, workers, webview etc)
        ? globalThis
        : typeof self !== "undefined" // Older browsers, workers, webview, window etc
            ? self
            : typeof global !== "undefined" // Older versions of node
                ? global
                : undefined; // Unsupported environment. No idea to return 'this' since we are in a module or a function scope anyway.

    var TypedArraysDefs = [
        "Int8Array",
        "Uint8Array",
        "Uint8ClampedArray",
        "Int16Array",
        "Uint16Array",
        "Int32Array",
        "Uint32Array",
        "Float32Array",
        "Float64Array",
        "DataView",
        "BigInt64Array",
        "BigUint64Array",
    ].reduce((specs, typeName) => ({
        ...specs,
        [typeName]: {
            // Replace passes the the typed array into $t, buffer so that
            // the ArrayBuffer typedef takes care of further handling of the buffer:
            // {$t:"Uint8Array",buffer:{$t:"ArrayBuffer",idx:0}}
            // CHANGED ABOVE! Now shortcutting that for more sparse format of the typed arrays
            // to contain the b64 property directly.
            replace: (a, _, typeDefs) => {
                const result = {
                    $t: typeName,
                    v: typeDefs.ArrayBuffer.replace(a.byteOffset === 0 && a.byteLength === a.buffer.byteLength
                        ? a.buffer
                        : a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength), _, typeDefs).v,
                };
                return result;
            },
            revive: ({ v }, _, typeDefs) => {
                const TypedArray = _global[typeName];
                return (TypedArray &&
                    new TypedArray(typeDefs.ArrayBuffer.revive({ v }, _, typeDefs)));
            },
        },
    }), {});

    function b64LexEncode(b) {
        return b64ToLex(b64encode(b));
    }
    function b64LexDecode(b64Lex) {
        return b64decode(lexToB64(b64Lex));
    }
    function b64ToLex(base64) {
        var encoded = "";
        for (var i = 0, length = base64.length; i < length; i++) {
            encoded += ENCODE_TABLE[base64[i]];
        }
        return encoded;
    }
    function lexToB64(base64lex) {
        // only accept string input
        if (typeof base64lex !== "string") {
            throw new Error("invalid decoder input: " + base64lex);
        }
        var base64 = "";
        for (var i = 0, length = base64lex.length; i < length; i++) {
            base64 += DECODE_TABLE[base64lex[i]];
        }
        return base64;
    }
    const DECODE_TABLE = {
        "-": "=",
        "0": "A",
        "1": "B",
        "2": "C",
        "3": "D",
        "4": "E",
        "5": "F",
        "6": "G",
        "7": "H",
        "8": "I",
        "9": "J",
        A: "K",
        B: "L",
        C: "M",
        D: "N",
        E: "O",
        F: "P",
        G: "Q",
        H: "R",
        I: "S",
        J: "T",
        K: "U",
        L: "V",
        M: "W",
        N: "X",
        O: "Y",
        P: "Z",
        Q: "a",
        R: "b",
        S: "c",
        T: "d",
        U: "e",
        V: "f",
        W: "g",
        X: "h",
        Y: "i",
        Z: "j",
        _: "k",
        a: "l",
        b: "m",
        c: "n",
        d: "o",
        e: "p",
        f: "q",
        g: "r",
        h: "s",
        i: "t",
        j: "u",
        k: "v",
        l: "w",
        m: "x",
        n: "y",
        o: "z",
        p: "0",
        q: "1",
        r: "2",
        s: "3",
        t: "4",
        u: "5",
        v: "6",
        w: "7",
        x: "8",
        y: "9",
        z: "+",
        "|": "/",
    };
    const ENCODE_TABLE = {};
    for (const c of Object.keys(DECODE_TABLE)) {
        ENCODE_TABLE[DECODE_TABLE[c]] = c;
    }

    var ArrayBufferDef = {
        ArrayBuffer: {
            replace: (ab) => ({
                $t: "ArrayBuffer",
                v: b64LexEncode(ab),
            }),
            revive: ({ v }) => {
                const ba = b64LexDecode(v);
                return ba.buffer.byteLength === ba.byteLength
                    ? ba.buffer
                    : ba.buffer.slice(ba.byteOffset, ba.byteOffset + ba.byteLength);
            },
        },
    };

    class FakeBlob {
        constructor(buf, type) {
            this.buf = buf;
            this.type = type;
        }
    }

    function readBlobSync(b) {
        const req = new XMLHttpRequest();
        req.overrideMimeType("text/plain; charset=x-user-defined");
        req.open("GET", URL.createObjectURL(b), false); // Sync
        req.send();
        if (req.status !== 200 && req.status !== 0) {
            throw new Error("Bad Blob access: " + req.status);
        }
        return req.responseText;
    }

    function string2ArrayBuffer(str) {
        const array = new Uint8Array(str.length);
        for (let i = 0; i < str.length; ++i) {
            array[i] = str.charCodeAt(i); // & 0xff;
        }
        return array.buffer;
    }

    var BlobDef = {
        Blob: {
            test: (blob, toStringTag) => toStringTag === "Blob" || blob instanceof FakeBlob,
            replace: (blob) => ({
                $t: "Blob",
                v: blob instanceof FakeBlob
                    ? b64encode(blob.buf)
                    : b64encode(string2ArrayBuffer(readBlobSync(blob))),
                type: blob.type,
            }),
            revive: ({ type, v }) => {
                const ab = b64decode(v);
                return typeof Blob !== undefined
                    ? new Blob([ab])
                    : new FakeBlob(ab.buffer, type);
            },
        },
    };

    const builtin = {
        ...numberDef,
        ...bigIntDef$1,
        ...DateDef,
        ...SetDef,
        ...MapDef,
        ...TypedArraysDefs,
        ...ArrayBufferDef,
        ...BlobDef, // Should be moved to another preset for DOM types (or universal? since it supports node as well with FakeBlob)
    };

    function Bison(...typeDefsInputs) {
        const tson = TypesonSimplified(builtin, BisonBinaryTypes, ...typeDefsInputs);
        return {
            toBinary(value) {
                const [blob, json] = this.stringify(value);
                const lenBuf = new ArrayBuffer(4);
                new DataView(lenBuf).setUint32(0, blob.size);
                return new Blob([lenBuf, blob, json]);
            },
            stringify(value) {
                const binaries = [];
                const json = tson.stringify(value, binaries);
                const blob = new Blob(binaries.map((b) => {
                    const lenBuf = new ArrayBuffer(4);
                    new DataView(lenBuf).setUint32(0, "byteLength" in b ? b.byteLength : b.size);
                    return new Blob([lenBuf, b]);
                }));
                return [blob, json];
            },
            async parse(json, binData) {
                let pos = 0;
                const arrayBuffers = [];
                const buf = await readBlobBinary(binData);
                const view = new DataView(buf);
                while (pos < buf.byteLength) {
                    const len = view.getUint32(pos);
                    pos += 4;
                    const ab = buf.slice(pos, pos + len);
                    pos += len;
                    arrayBuffers.push(ab);
                }
                return tson.parse(json, arrayBuffers);
            },
            async fromBinary(blob) {
                const len = new DataView(await readBlobBinary(blob.slice(0, 4))).getUint32(0);
                const binData = blob.slice(4, len + 4);
                const json = await readBlob(blob.slice(len + 4));
                return await this.parse(json, binData);
            },
        };
    }
    function readBlob(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onabort = (ev) => reject(new Error("file read aborted"));
            reader.onerror = (ev) => reject(ev.target.error);
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsText(blob);
        });
    }
    function readBlobBinary(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onabort = (ev) => reject(new Error("file read aborted"));
            reader.onerror = (ev) => reject(ev.target.error);
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsArrayBuffer(blob);
        });
    }

    /** The undefined type is not part of builtin but can be manually added.
     * The reason for supporting undefined is if the following object should be revived correctly:
     *
     *    {foo: undefined}
     *
     * Without including this typedef, the revived object would just be {}.
     * If including this typedef, the revived object would be {foo: undefined}.
     */
    var undefinedDef = {
        undefined: {
            replace: () => ({
                $t: "undefined"
            }),
            revive: () => undefined,
        },
    };

    // Since server revisions are stored in bigints, we need to handle clients without
    // bigint support to not fail when serverRevision is passed over to client.
    // We need to not fail when reviving it and we need to somehow store the information.
    // Since the revived version will later on be put into indexedDB we have another
    // issue: When reading it back from indexedDB we will get a poco object that we
    // cannot replace correctly when sending it to server. So we will also need
    // to do an explicit workaround in the protocol where a bigint is supported.
    // The workaround should be there regardless if browser supports BigInt or not, because
    // the serverRev might have been stored in IDB before the browser was upgraded to support bigint.
    //
    // if (typeof serverRev.rev !== "bigint")
    //   if (hasBigIntSupport)
    //     serverRev.rev = bigIntDef.bigint.revive(server.rev)
    //   else
    //     serverRev.rev = new FakeBigInt(server.rev)
    const hasBigIntSupport = typeof BigInt === 'function' && typeof BigInt(0) === 'bigint';
    class FakeBigInt {
        toString() {
            return this.v;
        }
        constructor(value) {
            this.v = value;
        }
    }
    const bigIntDef = hasBigIntSupport
        ? {}
        : {
            bigint: {
                test: (val) => val instanceof FakeBigInt,
                replace: (fakeBigInt) => {
                    return Object.assign({ $t: 'bigint' }, fakeBigInt);
                },
                revive: ({ v }) => new FakeBigInt(v),
            },
        };
    const defs = Object.assign(Object.assign(Object.assign({}, undefinedDef), bigIntDef), { PropModification: {
            test: (val) => val instanceof Dexie.PropModification,
            replace: (propModification) => {
                return Object.assign({ $t: 'PropModification' }, propModification['@@propmod']);
            },
            revive: (_a) => {
                var propModSpec = __rest(_a, ["$t"]) // keep the rest
                ;
                return new Dexie.PropModification(propModSpec);
            },
        } });
    const TSON = TypesonSimplified(builtin, defs);
    const BISON = Bison(defs);

    function encodeIdsForServer(schema, currentUser, changes) {
        const rv = [];
        for (let change of changes) {
            const { table, muts } = change;
            const tableSchema = schema.tables.find((t) => t.name === table);
            if (!tableSchema)
                throw new Error(`Internal error: table ${table} not found in DBCore schema`);
            const { primaryKey } = tableSchema;
            let changeClone = change;
            muts.forEach((mut, mutIndex) => {
                const rewriteValues = !primaryKey.outbound &&
                    (mut.type === 'upsert' || mut.type === 'insert');
                mut.keys.forEach((key, keyIndex) => {
                    if (Array.isArray(key)) {
                        // Server only support string keys. Dexie Cloud client support strings or array of strings.
                        if (changeClone === change)
                            changeClone = cloneChange(change, rewriteValues);
                        const mutClone = changeClone.muts[mutIndex];
                        const rewrittenKey = JSON.stringify(key);
                        mutClone.keys[keyIndex] = rewrittenKey;
                        /* Bug (#1777)
                          We should not rewrite values. It will fail because the key is array and the value is string.
                          Only the keys should be rewritten and it's already done on the server.
                          We should take another round of revieweing how key transformations are being done between
                          client and server and let the server do the key transformations entirely instead now that
                          we have the primary key schema on the server making it possible to do so.
                          if (rewriteValues) {
                          Dexie.setByKeyPath(
                            (mutClone as DBInsertOperation).values[keyIndex],
                            primaryKey.keyPath!,
                            rewrittenKey
                          );
                        }*/
                    }
                    else if (key[0] === '#') {
                        // Private ID - translate!
                        if (changeClone === change)
                            changeClone = cloneChange(change, rewriteValues);
                        const mutClone = changeClone.muts[mutIndex];
                        if (!currentUser.isLoggedIn)
                            throw new Error(`Internal error: Cannot sync private IDs before authenticated`);
                        const rewrittenKey = `${key}:${currentUser.userId}`;
                        mutClone.keys[keyIndex] = rewrittenKey;
                        if (rewriteValues) {
                            Dexie.setByKeyPath(mutClone.values[keyIndex], primaryKey.keyPath, rewrittenKey);
                        }
                    }
                });
            });
            rv.push(changeClone);
        }
        return rv;
    }
    function cloneChange(change, rewriteValues) {
        // clone on demand:
        return Object.assign(Object.assign({}, change), { muts: rewriteValues
                ? change.muts.map((m) => {
                    return (m.type === 'insert' || m.type === 'upsert') && m.values
                        ? Object.assign(Object.assign({}, m), { keys: m.keys.slice(), values: m.values.slice() }) : Object.assign(Object.assign({}, m), { keys: m.keys.slice() });
                })
                : change.muts.map((m) => (Object.assign(Object.assign({}, m), { keys: m.keys.slice() }))) });
    }

    // If we get Ratelimit-Limit and Ratelimit-Remaining where Ratelimit-Remaining is below
    // (Ratelimit-Limit / 2), we should delay the next sync by (Ratelimit-Reset / Ratelimit-Remaining)
    // seconds (given that there is a Ratelimit-Reset header).
    let syncRatelimitDelays = new WeakMap();
    function checkSyncRateLimitDelay(db) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const delatMilliseconds = ((_b = (_a = syncRatelimitDelays.get(db)) === null || _a === void 0 ? void 0 : _a.getTime()) !== null && _b !== void 0 ? _b : 0) - Date.now();
            if (delatMilliseconds > 0) {
                console.debug(`Stalling sync request ${delatMilliseconds} ms to spare ratelimits`);
                yield new Promise(resolve => setTimeout(resolve, delatMilliseconds));
            }
        });
    }
    function updateSyncRateLimitDelays(db, res) {
        const limit = res.headers.get('Ratelimit-Limit');
        const remaining = res.headers.get('Ratelimit-Remaining');
        const reset = res.headers.get('Ratelimit-Reset');
        if (limit && remaining && reset) {
            const limitNum = Number(limit);
            const remainingNum = Math.max(0, Number(remaining));
            const willResetInSeconds = Number(reset);
            if (remainingNum < limitNum / 2) {
                const delay = Math.ceil(willResetInSeconds / (remainingNum + 1));
                syncRatelimitDelays.set(db, new Date(Date.now() + delay * 1000));
                console.debug(`Sync ratelimit delay set to ${delay} seconds`);
            }
            else {
                syncRatelimitDelays.delete(db);
                console.debug(`Sync ratelimit delay cleared`);
            }
        }
    }

    //import {BisonWebStreamReader} from "dreambase-library/dist/typeson-simplified/BisonWebStreamReader";
    function syncWithServer(changes, syncState, baseRevs, db, databaseUrl, schema, clientIdentity, currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            //
            // Push changes to server using fetch
            //
            const headers = {
                Accept: 'application/json, application/x-bison, application/x-bison-stream',
                'Content-Type': 'application/tson',
            };
            const updatedUser = yield loadAccessToken(db);
            /*
            if (updatedUser?.license && changes.length > 0) {
              if (updatedUser.license.status === 'expired') {
                throw new Error(`License has expired`);
              }
              if (updatedUser.license.status === 'deactivated') {
                throw new Error(`License deactivated`);
              }
            }
            */
            const accessToken = updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.accessToken;
            if (accessToken) {
                headers.Authorization = `Bearer ${accessToken}`;
            }
            const syncRequest = {
                v: 2,
                dbID: syncState === null || syncState === void 0 ? void 0 : syncState.remoteDbId,
                clientIdentity,
                schema: schema || {},
                lastPull: syncState
                    ? {
                        serverRevision: syncState.serverRevision,
                        realms: syncState.realms,
                        inviteRealms: syncState.inviteRealms,
                    }
                    : undefined,
                baseRevs,
                changes: encodeIdsForServer(db.dx.core.schema, currentUser, changes),
            };
            console.debug('Sync request', syncRequest);
            db.syncStateChangedEvent.next({
                phase: 'pushing',
            });
            const res = yield fetch(`${databaseUrl}/sync`, {
                method: 'post',
                headers,
                credentials: 'include', // For Arr Affinity cookie only, for better Rate-Limit counting only.
                body: TSON.stringify(syncRequest),
            });
            //const contentLength = Number(res.headers.get('content-length'));
            db.syncStateChangedEvent.next({
                phase: 'pulling',
            });
            updateSyncRateLimitDelays(db, res);
            if (!res.ok) {
                throw new HttpError(res);
            }
            switch (res.headers.get('content-type')) {
                case 'application/x-bison':
                    return BISON.fromBinary(yield res.blob());
                case 'application/x-bison-stream': //return BisonWebStreamReader(BISON, res);
                default:
                case 'application/json': {
                    const text = yield res.text();
                    const syncRes = TSON.parse(text);
                    return syncRes;
                }
            }
        });
    }

    function modifyLocalObjectsWithNewUserId(syncifiedTables, currentUser, alreadySyncedRealms) {
        return __awaiter(this, void 0, void 0, function* () {
            const ignoredRealms = new Set(alreadySyncedRealms || []);
            for (const table of syncifiedTables) {
                if (table.name === "members") {
                    // members
                    yield table.toCollection().modify((member) => {
                        if (!ignoredRealms.has(member.realmId) && (!member.userId || member.userId === UNAUTHORIZED_USER.userId)) {
                            member.userId = currentUser.userId;
                        }
                    });
                }
                else if (table.name === "roles") ;
                else if (table.name === "realms") {
                    // realms
                    yield table.toCollection().modify((realm) => {
                        if (!ignoredRealms.has(realm.realmId) && (realm.owner === undefined || realm.owner === UNAUTHORIZED_USER.userId)) {
                            realm.owner = currentUser.userId;
                        }
                    });
                }
                else {
                    // application entities
                    yield table.toCollection().modify((obj) => {
                        if (!obj.realmId || !ignoredRealms.has(obj.realmId)) {
                            if (!obj.owner || obj.owner === UNAUTHORIZED_USER.userId)
                                obj.owner = currentUser.userId;
                            if (!obj.realmId || obj.realmId === UNAUTHORIZED_USER.userId) {
                                obj.realmId = currentUser.userId;
                            }
                        }
                    });
                }
            }
        });
    }

    function throwIfCancelled(cancelToken) {
        if (cancelToken === null || cancelToken === void 0 ? void 0 : cancelToken.cancelled)
            throw new Dexie.AbortError(`Operation was cancelled`);
    }

    /* Need this because navigator.onLine seems to say "false" when it is actually online.
      This function relies initially on navigator.onLine but then uses online and offline events
      which seem to be more reliable.
    */
    let isOnline = false;
    if (typeof self !== 'undefined' && typeof navigator !== 'undefined') {
        isOnline = navigator.onLine;
        self.addEventListener('online', () => isOnline = true);
        self.addEventListener('offline', () => isOnline = false);
    }

    function updateBaseRevs(db, schema, latestRevisions, serverRev) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.$baseRevs.bulkPut(Object.keys(schema)
                .filter((table) => schema[table].markedForSync)
                .map((tableName) => {
                const lastClientRevOnPreviousServerRev = latestRevisions[tableName] || 0;
                return {
                    tableName,
                    clientRev: lastClientRevOnPreviousServerRev + 1,
                    serverRev,
                };
            }));
        });
    }

    function getLatestRevisionsPerTable(clientChangeSet, lastRevisions = {}) {
        for (const { table, muts } of clientChangeSet) {
            const lastRev = muts.length > 0 ? muts[muts.length - 1].rev : null;
            lastRevisions[table] = lastRev || lastRevisions[table] || 0;
        }
        return lastRevisions;
    }

    function bulkUpdate(table, keys, changeSpecs) {
        return __awaiter(this, void 0, void 0, function* () {
            const objs = yield table.bulkGet(keys);
            const resultKeys = [];
            const resultObjs = [];
            keys.forEach((key, idx) => {
                const obj = objs[idx];
                if (obj) {
                    for (const [keyPath, value] of Object.entries(changeSpecs[idx])) {
                        if (keyPath === table.schema.primKey.keyPath) {
                            if (Dexie.cmp(value, key) !== 0) {
                                throw new Error(`Cannot change primary key`);
                            }
                        }
                        else {
                            Dexie.setByKeyPath(obj, keyPath, value);
                        }
                    }
                    resultKeys.push(key);
                    resultObjs.push(obj);
                }
            });
            yield (table.schema.primKey.keyPath == null
                ? table.bulkPut(resultObjs, resultKeys)
                : table.bulkPut(resultObjs));
        });
    }

    function applyServerChanges(changes, db) {
        return __awaiter(this, void 0, void 0, function* () {
            console.debug('Applying server changes', changes, Dexie.currentTransaction);
            for (const { table: tableName, muts } of changes) {
                const table = db.table(tableName);
                if (!table)
                    continue; // If server sends changes on a table we don't have, ignore it.
                const { primaryKey } = table.core.schema;
                const keyDecoder = (key) => {
                    switch (key[0]) {
                        case '[':
                            // Decode JSON array
                            if (key.endsWith(']'))
                                try {
                                    // On server, array keys are transformed to JSON string representation
                                    return JSON.parse(key);
                                }
                                catch (_a) { }
                            return key;
                        case '#':
                            // Decode private ID (do the opposite from what's done in encodeIdsForServer())
                            if (key.endsWith(':' + db.cloud.currentUserId)) {
                                return key.substr(0, key.length - db.cloud.currentUserId.length - 1);
                            }
                            return key;
                        default:
                            return key;
                    }
                };
                for (const mut of muts) {
                    const keys = mut.keys.map(keyDecoder);
                    switch (mut.type) {
                        case 'insert':
                            if (primaryKey.outbound) {
                                yield table.bulkAdd(mut.values, keys);
                            }
                            else {
                                keys.forEach((key, i) => {
                                    // Make sure inbound keys are consistent
                                    Dexie.setByKeyPath(mut.values[i], primaryKey.keyPath, key);
                                });
                                yield table.bulkAdd(mut.values);
                            }
                            break;
                        case 'upsert':
                            if (primaryKey.outbound) {
                                yield table.bulkPut(mut.values, keys);
                            }
                            else {
                                keys.forEach((key, i) => {
                                    // Make sure inbound keys are consistent
                                    Dexie.setByKeyPath(mut.values[i], primaryKey.keyPath, key);
                                });
                                yield table.bulkPut(mut.values);
                            }
                            break;
                        case 'modify':
                            if (keys.length === 1) {
                                yield table.update(keys[0], mut.changeSpec);
                            }
                            else {
                                yield table.where(':id').anyOf(keys).modify(mut.changeSpec);
                            }
                            break;
                        case 'update':
                            yield bulkUpdate(table, keys, mut.changeSpecs);
                            break;
                        case 'delete':
                            yield table.bulkDelete(keys);
                            break;
                    }
                }
            }
        });
    }

    const CURRENT_SYNC_WORKER = 'currentSyncWorker';
    function sync(db, options, schema, syncOptions) {
        return _sync
            .apply(this, arguments)
            .then((result) => {
            if (!(syncOptions === null || syncOptions === void 0 ? void 0 : syncOptions.justCheckIfNeeded)) { // && syncOptions?.purpose !== 'push') {
                db.syncStateChangedEvent.next({
                    phase: 'in-sync',
                });
            }
            return result;
        })
            .catch((error) => __awaiter(this, void 0, void 0, function* () {
            if (syncOptions === null || syncOptions === void 0 ? void 0 : syncOptions.justCheckIfNeeded)
                return Promise.reject(error); // Just rethrow.
            console.debug('Error from _sync', {
                isOnline,
                syncOptions,
                error,
            });
            if (isOnline &&
                (syncOptions === null || syncOptions === void 0 ? void 0 : syncOptions.retryImmediatelyOnFetchError) &&
                (error === null || error === void 0 ? void 0 : error.name) === 'TypeError' &&
                /fetch/.test(error === null || error === void 0 ? void 0 : error.message)) {
                db.syncStateChangedEvent.next({
                    phase: 'error',
                    error,
                });
                // Retry again in 500 ms but if it fails again, don't retry.
                yield new Promise((resolve) => setTimeout(resolve, 500));
                return yield sync(db, options, schema, Object.assign(Object.assign({}, syncOptions), { retryImmediatelyOnFetchError: false }));
            }
            // Make sure that no matter whether sync() explodes or not,
            // always update the timestamp. Also store the error.
            yield db.$syncState.update('syncState', {
                timestamp: new Date(),
                error: '' + error,
            });
            db.syncStateChangedEvent.next({
                phase: isOnline ? 'error' : 'offline',
                error: new Error('' + (error === null || error === void 0 ? void 0 : error.message) || error),
            });
            return Promise.reject(error);
        }));
    }
    function _sync(db, options, schema, { isInitialSync, cancelToken, justCheckIfNeeded, purpose } = {
        isInitialSync: false,
    }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!justCheckIfNeeded) {
                console.debug('SYNC STARTED', { isInitialSync, purpose });
            }
            if (!((_a = db.cloud.options) === null || _a === void 0 ? void 0 : _a.databaseUrl))
                throw new Error(`Internal error: sync must not be called when no databaseUrl is configured`);
            const { databaseUrl } = options;
            const currentUser = yield db.getCurrentUser(); // Keep same value across entire sync flow:
            const tablesToSync = currentUser.isLoggedIn ? getSyncableTables(db) : [];
            const mutationTables = tablesToSync.map((tbl) => db.table(getMutationTable(tbl.name)));
            // If this is not the initial sync,
            // go through tables that were previously not synced but should now be according to
            // logged in state and the sync table whitelist in db.cloud.options.
            //
            // Prepare for syncification by modifying locally unauthorized objects:
            //
            const persistedSyncState = yield db.getPersistedSyncState();
            const readyForSyncification = !isInitialSync && currentUser.isLoggedIn;
            const tablesToSyncify = readyForSyncification
                ? getTablesToSyncify(db, persistedSyncState)
                : [];
            throwIfCancelled(cancelToken);
            const doSyncify = tablesToSyncify.length > 0;
            if (doSyncify) {
                if (justCheckIfNeeded)
                    return true;
                //console.debug('sync doSyncify is true');
                yield db.transaction('rw', tablesToSyncify, (tx) => __awaiter(this, void 0, void 0, function* () {
                    // @ts-ignore
                    tx.idbtrans.disableChangeTracking = true;
                    // @ts-ignore
                    tx.idbtrans.disableAccessControl = true; // TODO: Take care of this flag in access control middleware!
                    yield modifyLocalObjectsWithNewUserId(tablesToSyncify, currentUser, persistedSyncState === null || persistedSyncState === void 0 ? void 0 : persistedSyncState.realms);
                }));
                throwIfCancelled(cancelToken);
            }
            //
            // List changes to sync
            //
            const [clientChangeSet, syncState, baseRevs] = yield db.transaction('r', db.tables, () => __awaiter(this, void 0, void 0, function* () {
                const syncState = yield db.getPersistedSyncState();
                const baseRevs = yield db.$baseRevs.toArray();
                let clientChanges = yield listClientChanges(mutationTables);
                throwIfCancelled(cancelToken);
                if (doSyncify) {
                    const alreadySyncedRealms = [
                        ...((persistedSyncState === null || persistedSyncState === void 0 ? void 0 : persistedSyncState.realms) || []),
                        ...((persistedSyncState === null || persistedSyncState === void 0 ? void 0 : persistedSyncState.inviteRealms) || []),
                    ];
                    const syncificationInserts = yield listSyncifiedChanges(tablesToSyncify, currentUser, schema, alreadySyncedRealms);
                    throwIfCancelled(cancelToken);
                    clientChanges = clientChanges.concat(syncificationInserts);
                    return [clientChanges, syncState, baseRevs];
                }
                return [clientChanges, syncState, baseRevs];
            }));
            const pushSyncIsNeeded = clientChangeSet.some((set) => set.muts.some((mut) => mut.keys.length > 0));
            if (justCheckIfNeeded) {
                console.debug('Sync is needed:', pushSyncIsNeeded);
                return pushSyncIsNeeded;
            }
            if (purpose === 'push' && !pushSyncIsNeeded) {
                // The purpose of this request was to push changes
                return false;
            }
            const latestRevisions = getLatestRevisionsPerTable(clientChangeSet, syncState === null || syncState === void 0 ? void 0 : syncState.latestRevisions);
            const clientIdentity = (syncState === null || syncState === void 0 ? void 0 : syncState.clientIdentity) || randomString$1(16);
            //
            // Push changes to server
            //
            throwIfCancelled(cancelToken);
            const res = yield syncWithServer(clientChangeSet, syncState, baseRevs, db, databaseUrl, schema, clientIdentity, currentUser);
            console.debug('Sync response', res);
            //
            // Apply changes locally and clear old change entries:
            //
            const done = yield db.transaction('rw', db.tables, (tx) => __awaiter(this, void 0, void 0, function* () {
                // @ts-ignore
                tx.idbtrans.disableChangeTracking = true;
                // @ts-ignore
                tx.idbtrans.disableAccessControl = true; // TODO: Take care of this flag in access control middleware!
                // Update db.cloud.schema from server response.
                // Local schema MAY include a subset of tables, so do not force all tables into local schema.
                for (const tableName of Object.keys(schema)) {
                    if (res.schema[tableName]) {
                        // Write directly into configured schema. This code can only be executed alone.
                        schema[tableName] = res.schema[tableName];
                    }
                }
                yield db.$syncState.put(schema, 'schema');
                // List mutations that happened during our exchange with the server:
                const addedClientChanges = yield listClientChanges(mutationTables, db, {
                    since: latestRevisions,
                });
                //
                // Delete changes now as server has return success
                // (but keep changes that haven't reached server yet)
                //
                for (const mutTable of mutationTables) {
                    const tableName = getTableFromMutationTable(mutTable.name);
                    if (!addedClientChanges.some((ch) => ch.table === tableName && ch.muts.length > 0)) {
                        // No added mutations for this table during the time we sent changes
                        // to the server.
                        // It is therefore safe to clear all changes (which is faster than
                        // deleting a range)
                        yield Promise.all([
                            mutTable.clear(),
                            db.$baseRevs.where({ tableName }).delete(),
                        ]);
                    }
                    else if (latestRevisions[tableName]) {
                        const latestRev = latestRevisions[tableName] || 0;
                        yield Promise.all([
                            mutTable.where('rev').belowOrEqual(latestRev).delete(),
                            db.$baseRevs
                                .where(':id')
                                .between([tableName, -Infinity], [tableName, latestRev + 1], true, true)
                                .reverse()
                                .offset(1) // Keep one entry (the one mapping muts that came during fetch --> previous server revision)
                                .delete(),
                        ]);
                    }
                    else ;
                }
                // Update latestRevisions object according to additional changes:
                getLatestRevisionsPerTable(addedClientChanges, latestRevisions);
                // Update/add new entries into baseRevs map.
                // * On tables without mutations since last serverRevision,
                //   this will update existing entry.
                // * On tables where mutations have been recorded since last
                //   serverRevision, this will create a new entry.
                // The purpose of this operation is to mark a start revision (per table)
                // so that all client-mutations that come after this, will be mapped to current
                // server revision.
                yield updateBaseRevs(db, schema, latestRevisions, res.serverRevision);
                const syncState = yield db.getPersistedSyncState();
                //
                // Delete objects from removed realms
                //
                yield deleteObjectsFromRemovedRealms(db, res, syncState);
                //
                // Update syncState
                //
                const newSyncState = syncState || {
                    syncedTables: [],
                    latestRevisions: {},
                    realms: [],
                    inviteRealms: [],
                    clientIdentity,
                };
                if (readyForSyncification) {
                    newSyncState.syncedTables = tablesToSync
                        .map((tbl) => tbl.name)
                        .concat(tablesToSyncify.map((tbl) => tbl.name));
                }
                newSyncState.latestRevisions = latestRevisions;
                newSyncState.remoteDbId = res.dbId;
                newSyncState.initiallySynced = true;
                newSyncState.realms = res.realms;
                newSyncState.inviteRealms = res.inviteRealms;
                newSyncState.serverRevision = res.serverRevision;
                newSyncState.timestamp = new Date();
                delete newSyncState.error;
                const filteredChanges = filterServerChangesThroughAddedClientChanges(res.changes, addedClientChanges);
                //
                // apply server changes
                //
                yield applyServerChanges(filteredChanges, db);
                //
                // Update syncState
                //
                db.$syncState.put(newSyncState, 'syncState');
                return addedClientChanges.length === 0;
            }));
            if (!done) {
                console.debug('MORE SYNC NEEDED. Go for it again!');
                yield checkSyncRateLimitDelay(db);
                return yield _sync(db, options, schema, { isInitialSync, cancelToken });
            }
            console.debug('SYNC DONE', { isInitialSync });
            db.syncCompleteEvent.next();
            return false; // Not needed anymore
        });
    }
    function deleteObjectsFromRemovedRealms(db, res, prevState) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedRealms = new Set();
            const rejectedRealms = new Set();
            const previousRealmSet = prevState ? prevState.realms : [];
            const previousInviteRealmSet = prevState ? prevState.inviteRealms : [];
            const updatedRealmSet = new Set(res.realms);
            const updatedTotalRealmSet = new Set(res.realms.concat(res.inviteRealms));
            for (const realmId of previousRealmSet) {
                if (!updatedRealmSet.has(realmId)) {
                    rejectedRealms.add(realmId);
                    if (!updatedTotalRealmSet.has(realmId)) {
                        deletedRealms.add(realmId);
                    }
                }
            }
            for (const realmId of previousInviteRealmSet.concat(previousRealmSet)) {
                if (!updatedTotalRealmSet.has(realmId)) {
                    deletedRealms.add(realmId);
                }
            }
            if (deletedRealms.size > 0 || rejectedRealms.size > 0) {
                const tables = getSyncableTables(db);
                for (const table of tables) {
                    let realmsToDelete = ['realms', 'members', 'roles'].includes(table.name)
                        ? deletedRealms // These tables should spare rejected ones.
                        : rejectedRealms; // All other tables shoudl delete rejected+deleted ones
                    if (realmsToDelete.size === 0)
                        continue;
                    if (table.schema.indexes.some((idx) => idx.keyPath === 'realmId' ||
                        (Array.isArray(idx.keyPath) && idx.keyPath[0] === 'realmId'))) {
                        // There's an index to use:
                        //console.debug(`REMOVAL: deleting all ${table.name} where realmId anyOf `, JSON.stringify([...realmsToDelete]));
                        yield table
                            .where('realmId')
                            .anyOf([...realmsToDelete])
                            .delete();
                    }
                    else {
                        // No index to use:
                        //console.debug(`REMOVAL: deleting all ${table.name} where realmId is any of `, JSON.stringify([...realmsToDelete]), realmsToDelete.size);
                        yield table
                            .filter((obj) => !!(obj === null || obj === void 0 ? void 0 : obj.realmId) && realmsToDelete.has(obj.realmId))
                            .delete();
                    }
                }
            }
        });
    }
    function filterServerChangesThroughAddedClientChanges(serverChanges, addedClientChanges) {
        const changes = {};
        applyOperations(changes, serverChanges);
        const localPostChanges = {};
        applyOperations(localPostChanges, addedClientChanges);
        subtractChanges(changes, localPostChanges);
        return toDBOperationSet(changes);
    }

    const LIMIT_NUM_MESSAGES_PER_TIME = 10; // Allow a maximum of 10 messages per...
    const TIME_WINDOW = 10000; // ...10 seconds.
    const PAUSE_PERIOD = 1000; // Pause for 1 second if reached
    function MessagesFromServerConsumer(db) {
        const queue = [];
        const readyToServe = new rxjs.BehaviorSubject(true);
        const event = new rxjs.BehaviorSubject(null);
        let isWorking = false;
        let loopDetection = new Array(LIMIT_NUM_MESSAGES_PER_TIME).fill(0);
        event.subscribe(() => __awaiter(this, void 0, void 0, function* () {
            if (isWorking)
                return;
            if (queue.length > 0) {
                isWorking = true;
                loopDetection.shift();
                loopDetection.push(Date.now());
                readyToServe.next(false);
                try {
                    yield consumeQueue();
                }
                finally {
                    if (loopDetection[loopDetection.length - 1] - loopDetection[0] <
                        TIME_WINDOW) {
                        // Ten loops within 10 seconds. Slow down!
                        // This is a one-time event. Just pause 10 seconds.
                        console.warn(`Slowing down websocket loop for ${PAUSE_PERIOD} milliseconds`);
                        yield new Promise((resolve) => setTimeout(resolve, PAUSE_PERIOD));
                    }
                    isWorking = false;
                    readyToServe.next(true);
                }
            }
        }));
        function enqueue(msg) {
            queue.push(msg);
            event.next(null);
        }
        function consumeQueue() {
            var _a, _b, _c, _d, _e, _f;
            return __awaiter(this, void 0, void 0, function* () {
                while (queue.length > 0) {
                    const msg = queue.shift();
                    try {
                        // If the sync worker or service worker is syncing, wait 'til thei're done.
                        // It's no need to have two channels at the same time - even though it wouldnt
                        // be a problem - this is an optimization.
                        yield rxjs.firstValueFrom(db.cloud.syncState.pipe(filter(({ phase }) => phase === 'in-sync' || phase === 'error')));
                        console.debug('processing msg', msg);
                        const persistedSyncState = db.cloud.persistedSyncState.value;
                        //syncState.
                        if (!msg)
                            continue;
                        switch (msg.type) {
                            case 'token-expired':
                                console.debug('WebSocket observable: Token expired. Refreshing token...');
                                const user = db.cloud.currentUser.value;
                                // Refresh access token
                                const refreshedLogin = yield refreshAccessToken(db.cloud.options.databaseUrl, user);
                                // Persist updated access token
                                yield db.table('$logins').update(user.userId, {
                                    accessToken: refreshedLogin.accessToken,
                                    accessTokenExpiration: refreshedLogin.accessTokenExpiration,
                                    claims: refreshedLogin.claims,
                                    license: refreshedLogin.license,
                                    data: refreshedLogin.data,
                                });
                                // Updating $logins will trigger emission of db.cloud.currentUser observable, which
                                // in turn will lead to that connectWebSocket.ts will reconnect the socket with the
                                // new token. So we don't need to do anything more here.
                                break;
                            case 'realm-added':
                                if (!((_a = persistedSyncState === null || persistedSyncState === void 0 ? void 0 : persistedSyncState.realms) === null || _a === void 0 ? void 0 : _a.includes(msg.realm)) &&
                                    !((_b = persistedSyncState === null || persistedSyncState === void 0 ? void 0 : persistedSyncState.inviteRealms) === null || _b === void 0 ? void 0 : _b.includes(msg.realm))) {
                                    yield db.cloud.sync({ purpose: 'pull', wait: true });
                                    //triggerSync(db, 'pull');
                                }
                                break;
                            case 'realm-accepted':
                                if (!((_c = persistedSyncState === null || persistedSyncState === void 0 ? void 0 : persistedSyncState.realms) === null || _c === void 0 ? void 0 : _c.includes(msg.realm))) {
                                    yield db.cloud.sync({ purpose: 'pull', wait: true });
                                    //triggerSync(db, 'pull');
                                }
                                break;
                            case 'realm-removed':
                                if (((_d = persistedSyncState === null || persistedSyncState === void 0 ? void 0 : persistedSyncState.realms) === null || _d === void 0 ? void 0 : _d.includes(msg.realm)) ||
                                    ((_e = persistedSyncState === null || persistedSyncState === void 0 ? void 0 : persistedSyncState.inviteRealms) === null || _e === void 0 ? void 0 : _e.includes(msg.realm))) {
                                    yield db.cloud.sync({ purpose: 'pull', wait: true });
                                    //triggerSync(db, 'pull');
                                }
                                break;
                            case 'realms-changed':
                                //triggerSync(db, 'pull');
                                yield db.cloud.sync({ purpose: 'pull', wait: true });
                                break;
                            case 'changes':
                                console.debug('changes');
                                if (((_f = db.cloud.syncState.value) === null || _f === void 0 ? void 0 : _f.phase) === 'error') {
                                    triggerSync(db, 'pull');
                                    break;
                                }
                                yield db.transaction('rw', db.dx.tables, (tx) => __awaiter(this, void 0, void 0, function* () {
                                    // @ts-ignore
                                    tx.idbtrans.disableChangeTracking = true;
                                    // @ts-ignore
                                    tx.idbtrans.disableAccessControl = true;
                                    const [schema, syncState, currentUser] = yield Promise.all([
                                        db.getSchema(),
                                        db.getPersistedSyncState(),
                                        db.getCurrentUser(),
                                    ]);
                                    console.debug('ws message queue: in transaction');
                                    if (!syncState || !schema || !currentUser) {
                                        console.debug('required vars not present', {
                                            syncState,
                                            schema,
                                            currentUser,
                                        });
                                        return; // Initial sync must have taken place - otherwise, ignore this.
                                    }
                                    // Verify again in ACID tx that we're on same server revision.
                                    if (msg.baseRev !== syncState.serverRevision) {
                                        console.debug(`baseRev (${msg.baseRev}) differs from our serverRevision in syncState (${syncState.serverRevision})`);
                                        // Should we trigger a sync now? No. This is a normal case
                                        // when another local peer (such as the SW or a websocket channel on other tab) has
                                        // updated syncState from new server information but we are not aware yet. It would
                                        // be unnescessary to do a sync in that case. Instead, the caller of this consumeQueue()
                                        // function will do readyToServe.next(true) right after this return, which will lead
                                        // to a "ready" message being sent to server with the new accurate serverRev we have,
                                        // so that the next message indeed will be correct.
                                        if (typeof msg.baseRev === 'string' && // v2 format
                                            (typeof syncState.serverRevision === 'bigint' || // v1 format
                                                typeof syncState.serverRevision === 'object') // v1 format old browser
                                        ) {
                                            // The reason for the diff seems to be that server has migrated the revision format.
                                            // Do a full sync to update revision format.
                                            // If we don't do a sync request now, we could stuck in an endless loop.
                                            triggerSync(db, 'pull');
                                        }
                                        return; // Ignore message
                                    }
                                    // Verify also that the message is based on the exact same set of realms
                                    const ourRealmSetHash = yield Dexie.waitFor(
                                    // Keep TX in non-IDB work
                                    computeRealmSetHash(syncState));
                                    console.debug('ourRealmSetHash', ourRealmSetHash);
                                    if (ourRealmSetHash !== msg.realmSetHash) {
                                        console.debug('not same realmSetHash', msg.realmSetHash);
                                        triggerSync(db, 'pull');
                                        // The message isn't based on the same realms.
                                        // Trigger a sync instead to resolve all things up.
                                        return;
                                    }
                                    // Get clientChanges
                                    let clientChanges = [];
                                    if (currentUser.isLoggedIn) {
                                        const mutationTables = getSyncableTables(db).map((tbl) => db.table(getMutationTable(tbl.name)));
                                        clientChanges = yield listClientChanges(mutationTables, db);
                                        console.debug('msg queue: client changes', clientChanges);
                                    }
                                    if (msg.changes.length > 0) {
                                        const filteredChanges = filterServerChangesThroughAddedClientChanges(msg.changes, clientChanges);
                                        //
                                        // apply server changes
                                        //
                                        console.debug('applying filtered server changes', filteredChanges);
                                        yield applyServerChanges(filteredChanges, db);
                                    }
                                    // Update latest revisions per table in case there are unsynced changes
                                    // This can be a real case in future when we allow non-eagery sync.
                                    // And it can actually be realistic now also, but very rare.
                                    syncState.latestRevisions = getLatestRevisionsPerTable(clientChanges, syncState.latestRevisions);
                                    syncState.serverRevision = msg.newRev;
                                    // Update base revs
                                    console.debug('Updating baseRefs', syncState.latestRevisions);
                                    yield updateBaseRevs(db, schema, syncState.latestRevisions, msg.newRev);
                                    //
                                    // Update syncState
                                    //
                                    console.debug('Updating syncState', syncState);
                                    yield db.$syncState.put(syncState, 'syncState');
                                }));
                                console.debug('msg queue: done with rw transaction');
                                break;
                        }
                    }
                    catch (error) {
                        console.error(`Error in msg queue`, error);
                    }
                }
            });
        }
        return {
            enqueue,
            readyToServe,
        };
    }

    const wm = new WeakMap();
    const DEXIE_CLOUD_SCHEMA = {
        members: '@id, [userId+realmId], [email+realmId], realmId',
        roles: '[realmId+name]',
        realms: '@realmId',
        $jobs: '',
        $syncState: '',
        $baseRevs: '[tableName+clientRev]',
        $logins: 'claims.sub, lastLogin',
    };
    let static_counter = 0;
    function DexieCloudDB(dx) {
        if ('vip' in dx)
            dx = dx['vip']; // Avoid race condition. Always map to a vipped dexie that don't block during db.on.ready().
        let db = wm.get(dx.cloud);
        if (!db) {
            const localSyncEvent = new rxjs.Subject();
            let syncStateChangedEvent = new BroadcastedAndLocalEvent(`syncstatechanged-${dx.name}`);
            let syncCompleteEvent = new BroadcastedAndLocalEvent(`synccomplete-${dx.name}`);
            localSyncEvent['id'] = ++static_counter;
            let initiallySynced = false;
            db = {
                get name() {
                    return dx.name;
                },
                close() {
                    return dx.close();
                },
                transaction: dx.transaction.bind(dx),
                table: dx.table.bind(dx),
                get tables() {
                    return dx.tables;
                },
                cloud: dx.cloud,
                get $jobs() {
                    return dx.table('$jobs');
                },
                get $syncState() {
                    return dx.table('$syncState');
                },
                get $baseRevs() {
                    return dx.table('$baseRevs');
                },
                get $logins() {
                    return dx.table('$logins');
                },
                get realms() {
                    return dx.realms;
                },
                get members() {
                    return dx.members;
                },
                get roles() {
                    return dx.roles;
                },
                get initiallySynced() {
                    return initiallySynced;
                },
                localSyncEvent,
                get syncStateChangedEvent() {
                    return syncStateChangedEvent;
                },
                get syncCompleteEvent() {
                    return syncCompleteEvent;
                },
                dx,
            };
            const helperMethods = {
                getCurrentUser() {
                    return db.$logins
                        .toArray()
                        .then((logins) => logins.find((l) => l.isLoggedIn) || UNAUTHORIZED_USER);
                },
                getPersistedSyncState() {
                    return db.$syncState.get('syncState');
                },
                getSchema() {
                    return db.$syncState.get('schema').then((schema) => {
                        if (schema) {
                            for (const table of db.tables) {
                                if (table.schema.primKey && table.schema.primKey.keyPath && schema[table.name]) {
                                    schema[table.name].primaryKey = nameFromKeyPath(table.schema.primKey.keyPath);
                                }
                            }
                        }
                        return schema;
                    });
                },
                getOptions() {
                    return db.$syncState.get('options');
                },
                setInitiallySynced(value) {
                    initiallySynced = value;
                },
                reconfigure() {
                    syncStateChangedEvent = new BroadcastedAndLocalEvent(`syncstatechanged-${dx.name}`);
                    syncCompleteEvent = new BroadcastedAndLocalEvent(`synccomplete-${dx.name}`);
                },
            };
            Object.assign(db, helperMethods);
            db.messageConsumer = MessagesFromServerConsumer(db);
            wm.set(dx.cloud, db);
        }
        return db;
    }
    function nameFromKeyPath(keyPath) {
        return typeof keyPath === 'string' ?
            keyPath :
            keyPath ? ('[' + [].join.call(keyPath, '+') + ']') : "";
    }

    // @ts-ignore
    const isFirefox = typeof InstallTrigger !== 'undefined';

    const isSafari = typeof navigator !== 'undefined' &&
        /Safari\//.test(navigator.userAgent) &&
        !/Chrom(e|ium)\/|Edge\//.test(navigator.userAgent);
    const safariVersion = isSafari
        ? // @ts-ignore
            [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1]
        : NaN;

    // What we know: Safari 14.1 (version 605) crashes when using dexie-cloud's service worker.
    // We don't know what exact call is causing this. Have tried safari-14-idb-fix with no luck.
    // Something we do in the service worker is triggering the crash.
    // When next Safari version (606) is out we will start enabling SW again, hoping that the bug is solved.
    // If not, we might increment 605 to 606.
    const DISABLE_SERVICEWORKER_STRATEGY = (isSafari && safariVersion <= 605) || // Disable for Safari for now.
        isFirefox; // Disable for Firefox for now. Seems to have a bug in reading CryptoKeys from IDB from service workers

    /* Helper function to subscribe to database close no matter if it was unexpectedly closed or manually using db.close()
     */
    function dbOnClosed(db, handler) {
        db.on.close.subscribe(handler);
        // @ts-ignore
        const origClose = db._close;
        // @ts-ignore
        db._close = function () {
            origClose.call(this);
            handler();
        };
        return () => {
            db.on.close.unsubscribe(handler);
            // @ts-ignore
            db._close = origClose;
        };
    }

    const IS_SERVICE_WORKER = typeof self !== "undefined" && "clients" in self && !self.document;

    function throwVersionIncrementNeeded() {
        throw new Dexie.SchemaError(`Version increment needed to allow dexie-cloud change tracking`);
    }

    const { toString } = {};
    function toStringTag(o) {
        return toString.call(o).slice(8, -1);
    }
    function getEffectiveKeys(primaryKey, req) {
        var _a;
        if (req.type === 'delete')
            return req.keys;
        return ((_a = req.keys) === null || _a === void 0 ? void 0 : _a.slice()) || req.values.map(primaryKey.extractKey);
    }
    function applyToUpperBitFix(orig, bits) {
        return ((bits & 1 ? orig[0].toUpperCase() : orig[0].toLowerCase()) +
            (bits & 2 ? orig[1].toUpperCase() : orig[1].toLowerCase()) +
            (bits & 4 ? orig[2].toUpperCase() : orig[2].toLowerCase()));
    }
    const consonants = /b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|x|y|z/i;
    function isUpperCase(ch) {
        return ch >= 'A' && ch <= 'Z';
    }
    function generateTablePrefix(tableName, allPrefixes) {
        let rv = tableName[0].toLocaleLowerCase(); // "users" = "usr", "friends" = "frn", "realms" = "rlm", etc.
        for (let i = 1, l = tableName.length; i < l && rv.length < 3; ++i) {
            if (consonants.test(tableName[i]) || isUpperCase(tableName[i]))
                rv += tableName[i].toLowerCase();
        }
        while (allPrefixes.has(rv)) {
            if (/\d/g.test(rv)) {
                rv = rv.substr(0, rv.length - 1) + (rv[rv.length - 1] + 1);
                if (rv.length > 3)
                    rv = rv.substr(0, 3);
                else
                    continue;
            }
            else if (rv.length < 3) {
                rv = rv + '2';
                continue;
            }
            let bitFix = 1;
            let upperFixed = rv;
            while (allPrefixes.has(upperFixed) && bitFix < 8) {
                upperFixed = applyToUpperBitFix(rv, bitFix);
                ++bitFix;
            }
            if (bitFix < 8)
                rv = upperFixed;
            else {
                let nextChar = (rv.charCodeAt(2) + 1) & 127;
                rv = rv.substr(0, 2) + String.fromCharCode(nextChar);
                // Here, in theory we could get an infinite loop if having 127*8 table names with identical 3 first consonants.
            }
        }
        return rv;
    }
    let time = 0;
    /**
     *
     * @param prefix A unique 3-letter short-name of the table.
     * @param shardKey 3 last letters from another ID if colocation is requested. Verified on server on inserts - guarantees unique IDs across shards.
     *  The shardKey part of the key represent the shardId where it was first created. An object with this
     *  primary key can later on be moved to another shard without being altered. The reason for having
     *  the origin shardKey as part of the key, is that the server will not need to check uniqueness constraint
     *  across all shards on every insert. Updates / moves across shards are already controlled by the server
     *  in the sense that the objects needs to be there already - we only need this part for inserts.
     * @returns
     */
    function generateKey(prefix, shardKey) {
        const a = new Uint8Array(18);
        const timePart = new Uint8Array(a.buffer, 0, 6);
        const now = Date.now(); // Will fit into 6 bytes until year 10 895.
        if (time >= now) {
            // User is bulk-creating objects the same millisecond.
            // Increment the time part by one millisecond for each item.
            // If bulk-creating 1,000,000 rows client-side in 10 seconds,
            // the last time-stamp will be 990 seconds in future, which is no biggie at all.
            // The point is to create a nice order of the generated IDs instead of
            // using random ids.
            ++time;
        }
        else {
            time = now;
        }
        timePart[0] = time / 1099511627776; // Normal division (no bitwise operator) --> works with >= 32 bits.
        timePart[1] = time / 4294967296;
        timePart[2] = time / 16777216;
        timePart[3] = time / 65536;
        timePart[4] = time / 256;
        timePart[5] = time;
        const randomPart = new Uint8Array(a.buffer, 6);
        crypto.getRandomValues(randomPart);
        const id = new Uint8Array(a.buffer);
        return prefix + b64LexEncode(id) + (shardKey || '');
    }

    function createIdGenerationMiddleware(db) {
        return {
            stack: 'dbcore',
            name: 'idGenerationMiddleware',
            level: 1,
            create: (core) => {
                return Object.assign(Object.assign({}, core), { table: (tableName) => {
                        const table = core.table(tableName);
                        function generateOrVerifyAtKeys(req, idPrefix) {
                            let valueClones = null;
                            const keys = getEffectiveKeys(table.schema.primaryKey, req);
                            keys.forEach((key, idx) => {
                                if (key === undefined) {
                                    // Generate the key
                                    const colocatedId = req.values[idx].realmId || db.cloud.currentUserId;
                                    const shardKey = colocatedId.substr(colocatedId.length - 3);
                                    keys[idx] = generateKey(idPrefix, shardKey);
                                    if (!table.schema.primaryKey.outbound) {
                                        if (!valueClones)
                                            valueClones = req.values.slice();
                                        valueClones[idx] = Dexie.deepClone(valueClones[idx]);
                                        Dexie.setByKeyPath(valueClones[idx], table.schema.primaryKey.keyPath, keys[idx]);
                                    }
                                }
                                else if (typeof key !== 'string' ||
                                    (!key.startsWith(idPrefix) && !key.startsWith('#' + idPrefix))) {
                                    // Key was specified by caller. Verify it complies with id prefix.
                                    throw new Dexie.ConstraintError(`The ID "${key}" is not valid for table "${tableName}". ` +
                                        `Primary '@' keys requires the key to be prefixed with "${idPrefix}" (or "#${idPrefix}).\n` +
                                        `If you want to generate IDs programmatically, remove '@' from the schema to get rid of this constraint. Dexie Cloud supports custom IDs as long as they are random and globally unique.`);
                                }
                            });
                            return table.mutate(Object.assign(Object.assign({}, req), { keys, values: valueClones || req.values }));
                        }
                        return Object.assign(Object.assign({}, table), { mutate: (req) => {
                                var _a, _b;
                                // @ts-ignore
                                if (req.trans.disableChangeTracking) {
                                    // Disable ID policy checks and ID generation
                                    return table.mutate(req);
                                }
                                if (req.type === 'add' || req.type === 'put') {
                                    const cloudTableSchema = (_a = db.cloud.schema) === null || _a === void 0 ? void 0 : _a[tableName];
                                    if (!(cloudTableSchema === null || cloudTableSchema === void 0 ? void 0 : cloudTableSchema.generatedGlobalId)) {
                                        if (cloudTableSchema === null || cloudTableSchema === void 0 ? void 0 : cloudTableSchema.markedForSync) {
                                            // Just make sure primary key is of a supported type:
                                            const keys = getEffectiveKeys(table.schema.primaryKey, req);
                                            keys.forEach((key, idx) => {
                                                if (!isValidSyncableID(key)) {
                                                    const type = Array.isArray(key)
                                                        ? key.map(toStringTag).join(',')
                                                        : toStringTag(key);
                                                    throw new Dexie.ConstraintError(`Invalid primary key type ${type} for table ${tableName}. Tables marked for sync has primary keys of type string or Array of string (and optional numbers)`);
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        if (((_b = db.cloud.options) === null || _b === void 0 ? void 0 : _b.databaseUrl) && !db.initiallySynced) {
                                            // A database URL is configured but no initial sync has been performed.
                                            const keys = getEffectiveKeys(table.schema.primaryKey, req);
                                            // Check if the operation would yield any INSERT. If so, complain! We never want wrong ID prefixes stored.
                                            return table
                                                .getMany({ keys, trans: req.trans, cache: 'immutable' })
                                                .then((results) => {
                                                if (results.length < keys.length) {
                                                    // At least one of the given objects would be created. Complain since
                                                    // the generated ID would be based on a locally computed ID prefix only - we wouldn't
                                                    // know if the server would give the same ID prefix until an initial sync has been
                                                    // performed.
                                                    throw new Error(`Unable to create new objects without an initial sync having been performed.`);
                                                }
                                                return table.mutate(req);
                                            });
                                        }
                                        return generateOrVerifyAtKeys(req, cloudTableSchema.idPrefix);
                                    }
                                }
                                return table.mutate(req);
                            } });
                    } });
            },
        };
    }

    function createImplicitPropSetterMiddleware(db) {
        return {
            stack: 'dbcore',
            name: 'implicitPropSetterMiddleware',
            level: 1,
            create: (core) => {
                return Object.assign(Object.assign({}, core), { table: (tableName) => {
                        const table = core.table(tableName);
                        return Object.assign(Object.assign({}, table), { mutate: (req) => {
                                var _a, _b, _c, _d;
                                // @ts-ignore
                                if (req.trans.disableChangeTracking) {
                                    return table.mutate(req);
                                }
                                const trans = req.trans;
                                if ((_b = (_a = db.cloud.schema) === null || _a === void 0 ? void 0 : _a[tableName]) === null || _b === void 0 ? void 0 : _b.markedForSync) {
                                    if (trans.mode === 'versionchange') {
                                        // Don't mutate tables marked for sync in versionchange transactions.
                                        return Promise.reject(new Dexie.UpgradeError(`Dexie Cloud Addon: Cannot upgrade or populate synced table "${tableName}". See https://dexie.org/cloud/docs/best-practices`));
                                    }
                                    if (req.type === 'add' || req.type === 'put') {
                                        if (tableName === 'members') {
                                            for (const member of req.values) {
                                                if (typeof member.email === 'string') {
                                                    // Resolve https://github.com/dexie/dexie-cloud/issues/4
                                                    // If adding a member, make sure email is lowercase and trimmed.
                                                    // This is to avoid issues where the APP does not check this
                                                    // and just allows the user to enter an email address that might
                                                    // have been pasted by the user from a source that had a trailing
                                                    // space or was in uppercase. We want to avoid that the user
                                                    // creates a new member with a different email address than
                                                    // the one he/she intended to create.
                                                    member.email = member.email.trim().toLowerCase();
                                                }
                                            }
                                        }
                                        // No matter if user is logged in or not, make sure "owner" and "realmId" props are set properly.
                                        // If not logged in, this will be changed upon syncification of the tables (next sync after login),
                                        // however, application code will work better if we can always rely on that the properties realmId
                                        // and owner are set. Application code may index them and query them based on db.cloud.currentUserId,
                                        // and expect them to be returned. That scenario must work also when db.cloud.currentUserId === 'unauthorized'.
                                        for (const obj of req.values) {
                                            if (!obj.owner) {
                                                obj.owner = trans.currentUser.userId;
                                            }
                                            if (!obj.realmId) {
                                                obj.realmId = trans.currentUser.userId;
                                            }
                                            const key = (_d = (_c = table.schema.primaryKey).extractKey) === null || _d === void 0 ? void 0 : _d.call(_c, obj);
                                            if (typeof key === 'string' && key[0] === '#') {
                                                // Add $ts prop for put operations and
                                                // disable update operations as well as consistent
                                                // modify operations. Reason: Server may not have
                                                // the object. Object should be created on server only
                                                // if is being updated. An update operation won't create it
                                                // so we must delete req.changeSpec to degrade operation to
                                                // an upsert operation with timestamp so that it will be created.
                                                // We must also degrade from consistent modify operations for the
                                                // same reason - object might be there on server. Must but put up instead.
                                                // FUTURE: This clumpsy behavior of private IDs could be refined later.
                                                // Suggestion is to in future, treat private IDs as we treat all objects 
                                                // and sync operations normally. Only that deletions should become soft deletes
                                                // for them - so that server knows when a private ID has been deleted on server
                                                // not accept insert/upserts on them.
                                                if (req.type === 'put') {
                                                    delete req.criteria;
                                                    delete req.changeSpec;
                                                    delete req.updates;
                                                    obj.$ts = Date.now();
                                                }
                                            }
                                        }
                                    }
                                }
                                return table.mutate(req);
                            } });
                    } });
            },
        };
    }

    function allSettled(possiblePromises) {
        return new Promise(resolve => {
            if (possiblePromises.length === 0)
                resolve([]);
            let remaining = possiblePromises.length;
            const results = new Array(remaining);
            possiblePromises.forEach((p, i) => Promise.resolve(p).then(value => results[i] = { status: "fulfilled", value }, reason => results[i] = { status: "rejected", reason })
                .then(() => --remaining || resolve(results)));
        });
    }

    let counter$1 = 0;
    function guardedTable(table) {
        const prop = "$lock" + (++counter$1);
        return Object.assign(Object.assign({}, table), { count: readLock(table.count, prop), get: readLock(table.get, prop), getMany: readLock(table.getMany, prop), openCursor: readLock(table.openCursor, prop), query: readLock(table.query, prop), mutate: writeLock(table.mutate, prop) });
    }
    function readLock(fn, prop) {
        return function readLocker(req) {
            const { readers, writers, } = req.trans[prop] || (req.trans[prop] = { writers: [], readers: [] });
            const numWriters = writers.length;
            const promise = (numWriters > 0
                ? writers[numWriters - 1].then(() => fn(req), () => fn(req))
                : fn(req)).finally(() => { readers.splice(readers.indexOf(promise)); });
            readers.push(promise);
            return promise;
        };
    }
    function writeLock(fn, prop) {
        return function writeLocker(req) {
            const { readers, writers, } = req.trans[prop] || (req.trans[prop] = { writers: [], readers: [] });
            let promise = (writers.length > 0
                ? writers[writers.length - 1].then(() => fn(req), () => fn(req))
                : readers.length > 0
                    ? allSettled(readers).then(() => fn(req))
                    : fn(req)).finally(() => { writers.shift(); });
            writers.push(promise);
            return promise;
        };
    }

    const outstandingTransactions = new rxjs.BehaviorSubject(new Set());

    function isEagerSyncDisabled(db) {
        var _a, _b, _c, _d;
        return (((_a = db.cloud.options) === null || _a === void 0 ? void 0 : _a.disableEagerSync) ||
            ((_c = (_b = db.cloud.currentUser.value) === null || _b === void 0 ? void 0 : _b.license) === null || _c === void 0 ? void 0 : _c.status) !== 'ok' ||
            !((_d = db.cloud.options) === null || _d === void 0 ? void 0 : _d.databaseUrl));
    }

    /** Tracks all mutations in the same transaction as the mutations -
     * so it is guaranteed that no mutation goes untracked - and if transaction
     * aborts, the mutations won't be tracked.
     *
     * The sync job will use the tracked mutations as the source of truth when pushing
     * changes to server and cleanup the tracked mutations once the server has
     * ackowledged that it got them.
     */
    function createMutationTrackingMiddleware({ currentUserObservable, db, }) {
        return {
            stack: 'dbcore',
            name: 'MutationTrackingMiddleware',
            level: 1,
            create: (core) => {
                const ordinaryTables = core.schema.tables.filter((t) => !/^\$/.test(t.name));
                let mutTableMap;
                try {
                    mutTableMap = new Map(ordinaryTables.map((tbl) => [
                        tbl.name,
                        core.table(`$${tbl.name}_mutations`),
                    ]));
                }
                catch (_a) {
                    throwVersionIncrementNeeded();
                }
                return Object.assign(Object.assign({}, core), { transaction: (tables, mode) => {
                        let tx;
                        if (mode === 'readwrite') {
                            const mutationTables = tables
                                .filter((tbl) => { var _a, _b; return (_b = (_a = db.cloud.schema) === null || _a === void 0 ? void 0 : _a[tbl]) === null || _b === void 0 ? void 0 : _b.markedForSync; })
                                .map((tbl) => getMutationTable(tbl));
                            tx = core.transaction([...tables, ...mutationTables], mode);
                        }
                        else {
                            tx = core.transaction(tables, mode);
                        }
                        if (mode === 'readwrite') {
                            // Give each transaction a globally unique id.
                            tx.txid = randomString(16);
                            tx.opCount = 0;
                            // Introduce the concept of current user that lasts through the entire transaction.
                            // This is important because the tracked mutations must be connected to the user.
                            tx.currentUser = currentUserObservable.value;
                            outstandingTransactions.value.add(tx);
                            outstandingTransactions.next(outstandingTransactions.value);
                            const removeTransaction = () => {
                                tx.removeEventListener('complete', txComplete);
                                tx.removeEventListener('error', removeTransaction);
                                tx.removeEventListener('abort', removeTransaction);
                                outstandingTransactions.value.delete(tx);
                                outstandingTransactions.next(outstandingTransactions.value);
                            };
                            const txComplete = () => {
                                if (tx.mutationsAdded &&
                                    !isEagerSyncDisabled(db)) {
                                    triggerSync(db, 'push');
                                }
                                removeTransaction();
                            };
                            tx.addEventListener('complete', txComplete);
                            tx.addEventListener('error', removeTransaction);
                            tx.addEventListener('abort', removeTransaction);
                        }
                        return tx;
                    }, table: (tableName) => {
                        const table = core.table(tableName);
                        if (/^\$/.test(tableName)) {
                            if (tableName.endsWith('_mutations')) {
                                // In case application code adds items to ..._mutations tables,
                                // make sure to set the mutationsAdded flag on transaction.
                                // This is also done in mutateAndLog() as that function talks to a
                                // lower level DBCore and wouldn't be catched by this code.
                                return Object.assign(Object.assign({}, table), { mutate: (req) => {
                                        if (req.type === 'add' || req.type === 'put') {
                                            req.trans.mutationsAdded = true;
                                        }
                                        return table.mutate(req);
                                    } });
                            }
                            else if (tableName === '$logins') {
                                return Object.assign(Object.assign({}, table), { mutate: (req) => {
                                        //console.debug('Mutating $logins table', req);
                                        return table
                                            .mutate(req)
                                            .then((res) => {
                                            //console.debug('Mutating $logins');
                                            req.trans.mutationsAdded = true;
                                            //console.debug('$logins mutated');
                                            return res;
                                        })
                                            .catch((err) => {
                                            console.debug('Failed mutation $logins', err);
                                            return Promise.reject(err);
                                        });
                                    } });
                            }
                            else {
                                return table;
                            }
                        }
                        const { schema } = table;
                        const mutsTable = mutTableMap.get(tableName);
                        return guardedTable(Object.assign(Object.assign({}, table), { mutate: (req) => {
                                var _a, _b, _c;
                                const trans = req.trans;
                                if (!trans.txid)
                                    return table.mutate(req); // Upgrade transactions not guarded by us.
                                if (trans.disableChangeTracking)
                                    return table.mutate(req);
                                if (!((_b = (_a = db.cloud.schema) === null || _a === void 0 ? void 0 : _a[tableName]) === null || _b === void 0 ? void 0 : _b.markedForSync))
                                    return table.mutate(req);
                                if (!((_c = trans.currentUser) === null || _c === void 0 ? void 0 : _c.isLoggedIn)) {
                                    // Unauthorized user should not log mutations.
                                    // Instead, after login all local data should be logged at once.
                                    return table.mutate(req);
                                }
                                return req.type === 'deleteRange'
                                    ? table
                                        // Query the actual keys (needed for server sending correct rollback to us)
                                        .query({
                                        query: { range: req.range, index: schema.primaryKey },
                                        trans: req.trans,
                                        values: false,
                                    })
                                        // Do a delete request instead, but keep the criteria info for the server to execute
                                        .then((res) => {
                                        return mutateAndLog({
                                            type: 'delete',
                                            keys: res.result,
                                            trans: req.trans,
                                            criteria: { index: null, range: req.range },
                                        });
                                    })
                                    : mutateAndLog(req);
                            } }));
                        function mutateAndLog(req) {
                            const trans = req.trans;
                            trans.mutationsAdded = true;
                            const { txid, currentUser: { userId }, } = trans;
                            const { type } = req;
                            const opNo = ++trans.opCount;
                            return table.mutate(req).then((res) => {
                                const { numFailures: hasFailures, failures } = res;
                                let keys = type === 'delete' ? req.keys : res.results;
                                let values = 'values' in req ? req.values : [];
                                let updates = 'updates' in req && req.updates;
                                if (hasFailures) {
                                    keys = keys.filter((_, idx) => !failures[idx]);
                                    values = values.filter((_, idx) => !failures[idx]);
                                }
                                const ts = Date.now();
                                const mut = req.type === 'delete'
                                    ? {
                                        type: 'delete',
                                        ts,
                                        opNo,
                                        keys,
                                        criteria: req.criteria,
                                        txid,
                                        userId,
                                    }
                                    : req.type === 'add'
                                        ? {
                                            type: 'insert',
                                            ts,
                                            opNo,
                                            keys,
                                            txid,
                                            userId,
                                            values,
                                        }
                                        : req.criteria && req.changeSpec
                                            ? {
                                                // Common changeSpec for all keys
                                                type: 'modify',
                                                ts,
                                                opNo,
                                                keys,
                                                criteria: req.criteria,
                                                changeSpec: req.changeSpec,
                                                txid,
                                                userId,
                                            }
                                            : updates
                                                ? {
                                                    // One changeSpec per key
                                                    type: 'update',
                                                    ts,
                                                    opNo,
                                                    keys: updates.keys,
                                                    changeSpecs: updates.changeSpecs,
                                                    txid,
                                                    userId,
                                                }
                                                : {
                                                    type: 'upsert',
                                                    ts,
                                                    opNo,
                                                    keys,
                                                    values,
                                                    txid,
                                                    userId,
                                                };
                                if ('isAdditionalChunk' in req && req.isAdditionalChunk) {
                                    mut.isAdditionalChunk = true;
                                }
                                return keys.length > 0 || ('criteria' in req && req.criteria)
                                    ? mutsTable
                                        .mutate({ type: 'add', trans, values: [mut] }) // Log entry
                                        .then(() => res) // Return original response
                                    : res;
                            });
                        }
                    } });
            },
        };
    }

    function overrideParseStoresSpec(origFunc, dexie) {
        return function (stores, dbSchema) {
            const storesClone = Object.assign(Object.assign({}, DEXIE_CLOUD_SCHEMA), stores);
            // Merge indexes of DEXIE_CLOUD_SCHEMA with stores
            Object.keys(DEXIE_CLOUD_SCHEMA).forEach((tableName) => {
                const schemaSrc = storesClone[tableName];
                // Verify that they don't try to delete a table that is needed for access control of Dexie Cloud
                if (schemaSrc == null) {
                    // They try to delete one of the built-in schema tables.
                    throw new Error(`Cannot delete table ${tableName} as it is needed for access control of Dexie Cloud`);
                }
                // If not trying to override a built-in table, then we can skip this and continue to next table.
                if (!stores[tableName]) {
                    // They haven't tried to declare this table. No need to merge indexes.
                    return; // Continue
                }
                // They have declared this table. Merge indexes in case they didn't declare all indexes we need.
                const requestedIndexes = schemaSrc.split(',').map(spec => spec.trim());
                const builtInIndexes = DEXIE_CLOUD_SCHEMA[tableName].split(',').map(spec => spec.trim());
                const requestedIndexSet = new Set(requestedIndexes.map(index => index.replace(/([&*]|\+\+)/g, "")));
                // Verify that primary key is unchanged
                if (requestedIndexes[0] !== builtInIndexes[0]) {
                    // Primary key must match exactly
                    throw new Error(`Cannot override primary key of table ${tableName}. Please declare it as {${tableName}: ${JSON.stringify(DEXIE_CLOUD_SCHEMA[tableName])}`);
                }
                // Merge indexes
                for (let i = 1; i < builtInIndexes.length; ++i) {
                    const builtInIndex = builtInIndexes[i];
                    if (!requestedIndexSet.has(builtInIndex.replace(/([&*]|\+\+)/g, ""))) {
                        // Add built-in index if not already requested
                        storesClone[tableName] += `,${builtInIndex}`;
                    }
                }
            });
            // Populate dexie.cloud.schema
            const cloudSchema = dexie.cloud.schema || (dexie.cloud.schema = {});
            const allPrefixes = new Set();
            Object.keys(storesClone).forEach(tableName => {
                const schemaSrc = storesClone[tableName];
                const cloudTableSchema = cloudSchema[tableName] || (cloudSchema[tableName] = {});
                if (schemaSrc != null) {
                    if (/^\@/.test(schemaSrc)) {
                        storesClone[tableName] = storesClone[tableName].substr(1);
                        cloudTableSchema.generatedGlobalId = true;
                        cloudTableSchema.idPrefix = generateTablePrefix(tableName, allPrefixes);
                        allPrefixes.add(cloudTableSchema.idPrefix);
                    }
                    if (!/^\$/.test(tableName)) {
                        storesClone[`$${tableName}_mutations`] = '++rev';
                        cloudTableSchema.markedForSync = true;
                    }
                    if (cloudTableSchema.deleted) {
                        cloudTableSchema.deleted = false;
                    }
                }
                else {
                    cloudTableSchema.deleted = true;
                    cloudTableSchema.markedForSync = false;
                    storesClone[`$${tableName}_mutations`] = null;
                }
            });
            const rv = origFunc.call(this, storesClone, dbSchema);
            return rv;
        };
    }

    function performInitialSync(db, cloudOptions, cloudSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            console.debug('Performing initial sync');
            yield sync(db, cloudOptions, cloudSchema, { isInitialSync: true });
            console.debug('Done initial sync');
        });
    }

    const USER_INACTIVITY_TIMEOUT = 180000; // 3 minutes
    const INACTIVE_WAIT_TIME = 20000;
    // This observable will be emitted to later down....
    const userIsActive = new rxjs.BehaviorSubject(true);
    // A refined version that waits before changing state:
    // * Wait another INACTIVE_WAIT_TIME before accepting that the user is inactive.
    //   Reason 1: Spare resources - no need to setup the entire websocket flow when
    //             switching tabs back and forth.
    //   Reason 2: Less flickering for the end user when switching tabs back and forth.
    // * Wait another ACTIVE_WAIT_TIME before accepting that the user is active.
    //   Possible reason to have a value here: Sparing resources if users often temporary click the tab
    //   for just a short time.
    const userIsReallyActive = new rxjs.BehaviorSubject(true);
    userIsActive
        .pipe(switchMap((isActive) => {
        //console.debug('SyncStatus: DUBB: isActive changed to', isActive);
        return isActive
            ? rxjs.of(true)
            : rxjs.of(false).pipe(delay(INACTIVE_WAIT_TIME))
                ;
    }), distinctUntilChanged())
        .subscribe(userIsReallyActive);
    //
    // First create some corner-stone observables to build the flow on
    //
    // document.onvisibilitychange:
    const visibilityStateIsChanged = typeof document !== 'undefined'
        ? rxjs.fromEvent(document, 'visibilitychange')
        : rxjs.of({});
    // document.onvisibilitychange makes document hidden:
    const documentBecomesHidden = visibilityStateIsChanged.pipe(filter(() => document.visibilityState === 'hidden'));
    // document.onvisibilitychange makes document visible
    const documentBecomesVisible = visibilityStateIsChanged.pipe(filter(() => document.visibilityState === 'visible'));
    // Any of various user-activity-related events happen:
    const userDoesSomething = typeof window !== 'undefined'
        ? rxjs.merge(documentBecomesVisible, rxjs.fromEvent(window, 'mousedown'), rxjs.fromEvent(window, 'mousemove'), rxjs.fromEvent(window, 'keydown'), rxjs.fromEvent(window, 'wheel'), rxjs.fromEvent(window, 'touchmove'))
        : rxjs.of({});
    if (typeof document !== 'undefined') {
        //
        // Now, create a final observable and start subscribing to it in order
        // to make it emit values to userIsActive BehaviourSubject (which is the
        // most important global hot observable we have here)
        //
        // Live test: https://jsitor.com/LboCDHgbn
        //
        rxjs.merge(rxjs.of(true), // Make sure something is always emitted from start
        documentBecomesHidden, // so that we can eagerly emit false!
        userDoesSomething)
            .pipe(
        // No matter event source, compute whether user is visible using visibilityState:
        map(() => document.visibilityState === 'visible'), 
        // Make sure to emit it
        tap((isActive) => {
            if (userIsActive.value !== isActive) {
                // Emit new value unless it already has that value
                userIsActive.next(isActive);
            }
        }), 
        // Now, if true was emitted, make sure to set a timeout to emit false
        // unless new user activity things happen (in that case, the timeout will be cancelled!)
        switchMap((isActive) => isActive
            ? rxjs.of(0).pipe(delay(USER_INACTIVITY_TIMEOUT - INACTIVE_WAIT_TIME), tap(() => userIsActive.next(false)))
            : rxjs.of(0)))
            .subscribe(() => { }); // Unless we subscribe nothing will be propagated to userIsActive observable
    }

    class TokenExpiredError extends Error {
        constructor() {
            super(...arguments);
            this.name = "TokenExpiredError";
        }
    }

    const SERVER_PING_TIMEOUT = 20000;
    const CLIENT_PING_INTERVAL = 30000;
    const FAIL_RETRY_WAIT_TIME = 60000;
    class WSObservable extends rxjs.Observable {
        constructor(databaseUrl, rev, realmSetHash, clientIdentity, messageProducer, webSocketStatus, token, tokenExpiration) {
            super((subscriber) => new WSConnection(databaseUrl, rev, realmSetHash, clientIdentity, token, tokenExpiration, subscriber, messageProducer, webSocketStatus));
        }
    }
    let counter = 0;
    class WSConnection extends rxjs.Subscription {
        constructor(databaseUrl, rev, realmSetHash, clientIdentity, token, tokenExpiration, subscriber, messageProducer, webSocketStatus) {
            super(() => this.teardown());
            this.id = ++counter;
            this.reconnecting = false;
            console.debug('New WebSocket Connection', this.id, token ? 'authorized' : 'unauthorized');
            this.databaseUrl = databaseUrl;
            this.rev = rev;
            this.realmSetHash = realmSetHash;
            this.clientIdentity = clientIdentity;
            this.token = token;
            this.tokenExpiration = tokenExpiration;
            this.subscriber = subscriber;
            this.lastUserActivity = new Date();
            this.messageProducer = messageProducer;
            this.messageProducerSubscription = null;
            this.webSocketStatus = webSocketStatus;
            this.connect();
        }
        teardown() {
            console.debug('Teardown WebSocket Connection', this.id);
            this.disconnect();
        }
        disconnect() {
            this.webSocketStatus.next('disconnected');
            if (this.pinger) {
                clearInterval(this.pinger);
                this.pinger = null;
            }
            if (this.ws) {
                try {
                    this.ws.close();
                }
                catch (_a) { }
            }
            this.ws = null;
            if (this.messageProducerSubscription) {
                this.messageProducerSubscription.unsubscribe();
                this.messageProducerSubscription = null;
            }
        }
        reconnect() {
            if (this.reconnecting)
                return;
            this.reconnecting = true;
            try {
                this.disconnect();
            }
            catch (_a) { }
            this.connect()
                .catch(() => { })
                .then(() => (this.reconnecting = false)); // finally()
        }
        connect() {
            return __awaiter(this, void 0, void 0, function* () {
                this.lastServerActivity = new Date();
                if (this.pauseUntil && this.pauseUntil > new Date()) {
                    console.debug('WS not reconnecting just yet', {
                        id: this.id,
                        pauseUntil: this.pauseUntil,
                    });
                    return;
                }
                if (this.ws) {
                    throw new Error(`Called connect() when a connection is already open`);
                }
                if (!this.databaseUrl)
                    throw new Error(`Cannot connect without a database URL`);
                if (this.closed) {
                    //console.debug('SyncStatus: DUBB: Ooops it was closed!');
                    return;
                }
                if (this.tokenExpiration && this.tokenExpiration < new Date()) {
                    this.subscriber.error(new TokenExpiredError()); // Will be handled in connectWebSocket.ts.
                    return;
                }
                this.webSocketStatus.next('connecting');
                this.pinger = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    if (this.closed) {
                        console.debug('pinger check', this.id, 'CLOSED.');
                        this.teardown();
                        return;
                    }
                    if (this.ws) {
                        try {
                            this.ws.send(JSON.stringify({ type: 'ping' }));
                            setTimeout(() => {
                                console.debug('pinger setTimeout', this.id, this.pinger ? `alive` : 'dead');
                                if (!this.pinger)
                                    return;
                                if (this.closed) {
                                    console.debug('pinger setTimeout', this.id, 'subscription is closed');
                                    this.teardown();
                                    return;
                                }
                                if (this.lastServerActivity <
                                    new Date(Date.now() - SERVER_PING_TIMEOUT)) {
                                    // Server inactive. Reconnect if user is active.
                                    console.debug('pinger: server is inactive');
                                    console.debug('pinger reconnecting');
                                    this.reconnect();
                                }
                                else {
                                    console.debug('pinger: server still active');
                                }
                            }, SERVER_PING_TIMEOUT);
                        }
                        catch (_a) {
                            console.debug('pinger catch error', this.id, 'reconnecting');
                            this.reconnect();
                        }
                    }
                    else {
                        console.debug('pinger', this.id, 'reconnecting');
                        this.reconnect();
                    }
                }), CLIENT_PING_INTERVAL);
                // The following vars are needed because we must know which callback to ack when server sends it's ack to us.
                const wsUrl = new URL(this.databaseUrl);
                wsUrl.protocol = wsUrl.protocol === 'http:' ? 'ws' : 'wss';
                const searchParams = new URLSearchParams();
                if (this.subscriber.closed)
                    return;
                searchParams.set('v', '2');
                searchParams.set('rev', this.rev);
                searchParams.set('realmsHash', this.realmSetHash);
                searchParams.set('clientId', this.clientIdentity);
                if (this.token) {
                    searchParams.set('token', this.token);
                }
                // Connect the WebSocket to given url:
                console.debug('dexie-cloud WebSocket create');
                const ws = (this.ws = new WebSocket(`${wsUrl}/changes?${searchParams}`));
                //ws.binaryType = "arraybuffer"; // For future when subscribing to actual changes.
                ws.onclose = (event) => {
                    if (!this.pinger)
                        return;
                    console.debug('dexie-cloud WebSocket onclosed', this.id);
                    this.reconnect();
                };
                ws.onmessage = (event) => {
                    if (!this.pinger)
                        return;
                    console.debug('dexie-cloud WebSocket onmessage', event.data);
                    this.lastServerActivity = new Date();
                    try {
                        const msg = TSON.parse(event.data);
                        if (msg.type === 'error') {
                            throw new Error(`Error message from dexie-cloud: ${msg.error}`);
                        }
                        if (msg.type === 'rev') {
                            this.rev = msg.rev; // No meaning but seems reasonable.
                        }
                        if (msg.type !== 'pong') {
                            this.subscriber.next(msg);
                        }
                    }
                    catch (e) {
                        this.subscriber.error(e);
                    }
                };
                try {
                    let everConnected = false;
                    yield new Promise((resolve, reject) => {
                        ws.onopen = (event) => {
                            console.debug('dexie-cloud WebSocket onopen');
                            everConnected = true;
                            resolve(null);
                        };
                        ws.onerror = (event) => {
                            if (!everConnected) {
                                const error = event.error || new Error('WebSocket Error');
                                this.subscriber.error(error);
                                this.webSocketStatus.next('error');
                                reject(error);
                            }
                            else {
                                this.reconnect();
                            }
                        };
                    });
                    this.messageProducerSubscription = this.messageProducer.subscribe((msg) => {
                        var _a;
                        if (!this.closed) {
                            if (msg.type === 'ready' &&
                                this.webSocketStatus.value !== 'connected') {
                                this.webSocketStatus.next('connected');
                            }
                            (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(TSON.stringify(msg));
                        }
                    });
                }
                catch (error) {
                    this.pauseUntil = new Date(Date.now() + FAIL_RETRY_WAIT_TIME);
                }
            });
        }
    }

    class InvalidLicenseError extends Error {
        constructor(license) {
            super(license === 'expired'
                ? `License expired`
                : license === 'deactivated'
                    ? `User deactivated`
                    : 'Invalid license');
            this.name = 'InvalidLicenseError';
            if (license) {
                this.license = license;
            }
        }
    }

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    function waitAndReconnectWhenUserDoesSomething(error) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error(`WebSocket observable: error but revive when user does some active thing...`, error);
            // Sleep some seconds...
            yield sleep(3000);
            // Wait til user does something (move mouse, tap, scroll, click etc)
            console.debug('waiting for someone to do something');
            yield rxjs.firstValueFrom(userDoesSomething);
            console.debug('someone did something!');
        });
    }
    function connectWebSocket(db) {
        var _a;
        if (!((_a = db.cloud.options) === null || _a === void 0 ? void 0 : _a.databaseUrl)) {
            throw new Error(`No database URL to connect WebSocket to`);
        }
        const messageProducer = db.messageConsumer.readyToServe.pipe(filter((isReady) => isReady), // When consumer is ready for new messages, produce such a message to inform server about it
        switchMap(() => db.getPersistedSyncState()), // We need the info on which server revision we are at:
        filter((syncState) => syncState && syncState.serverRevision), // We wont send anything to server before inital sync has taken place
        switchMap((syncState) => __awaiter(this, void 0, void 0, function* () {
            return ({
                // Produce the message to trigger server to send us new messages to consume:
                type: 'ready',
                rev: syncState.serverRevision,
                realmSetHash: yield computeRealmSetHash(syncState)
            });
        })));
        function createObservable() {
            return db.cloud.persistedSyncState.pipe(filter((syncState) => syncState === null || syncState === void 0 ? void 0 : syncState.serverRevision), // Don't connect before there's no initial sync performed.
            take(1), // Don't continue waking up whenever syncState change
            switchMap((syncState) => db.cloud.currentUser.pipe(map((userLogin) => [userLogin, syncState]))), switchMap(([userLogin, syncState]) => {
                /*if (userLogin.license?.status && userLogin.license.status !== 'ok') {
                  throw new InvalidLicenseError();
                }*/
                return userIsReallyActive.pipe(map((isActive) => [isActive ? userLogin : null, syncState]));
            }), switchMap(([userLogin, syncState]) => {
                if ((userLogin === null || userLogin === void 0 ? void 0 : userLogin.isLoggedIn) && !(syncState === null || syncState === void 0 ? void 0 : syncState.realms.includes(userLogin.userId))) {
                    // We're in an in-between state when user is logged in but the user's realms are not yet synced.
                    // Don't make this change reconnect the websocket just yet. Wait till syncState is updated
                    // to iclude the user's realm.
                    return db.cloud.persistedSyncState.pipe(filter((syncState) => (syncState === null || syncState === void 0 ? void 0 : syncState.realms.includes(userLogin.userId)) || false), take(1), map((syncState) => [userLogin, syncState]));
                }
                return new rxjs.BehaviorSubject([userLogin, syncState]);
            }), switchMap(([userLogin, syncState]) => __awaiter(this, void 0, void 0, function* () { return [userLogin, yield computeRealmSetHash(syncState)]; })), distinctUntilChanged(([prevUser, prevHash], [currUser, currHash]) => prevUser === currUser && prevHash === currHash), switchMap(([userLogin, realmSetHash]) => {
                var _a;
                if (!((_a = db.cloud.persistedSyncState) === null || _a === void 0 ? void 0 : _a.value)) {
                    // Restart the flow if persistedSyncState is not yet available.
                    return createObservable();
                }
                // Let server end query changes from last entry of same client-ID and forward.
                // If no new entries, server won't bother the client. If new entries, server sends only those
                // and the baseRev of the last from same client-ID.
                if (userLogin) {
                    return new WSObservable(db.cloud.options.databaseUrl, db.cloud.persistedSyncState.value.serverRevision, realmSetHash, db.cloud.persistedSyncState.value.clientIdentity, messageProducer, db.cloud.webSocketStatus, userLogin.accessToken, userLogin.accessTokenExpiration);
                }
                else {
                    return rxjs.from([]);
                }
            }), catchError((error) => {
                if ((error === null || error === void 0 ? void 0 : error.name) === 'TokenExpiredError') {
                    console.debug('WebSocket observable: Token expired. Refreshing token...');
                    return rxjs.of(true).pipe(switchMap(() => __awaiter(this, void 0, void 0, function* () {
                        // Refresh access token
                        const user = yield db.getCurrentUser();
                        const refreshedLogin = yield refreshAccessToken(db.cloud.options.databaseUrl, user);
                        // Persist updated access token
                        yield db.table('$logins').update(user.userId, {
                            accessToken: refreshedLogin.accessToken,
                            accessTokenExpiration: refreshedLogin.accessTokenExpiration,
                            claims: refreshedLogin.claims,
                            license: refreshedLogin.license,
                            data: refreshedLogin.data
                        });
                    })), switchMap(() => createObservable()));
                }
                else {
                    return rxjs.throwError(() => error);
                }
            }), catchError((error) => {
                db.cloud.webSocketStatus.next("error");
                if (error instanceof InvalidLicenseError) {
                    // Don't retry. Just throw and don't try connect again.
                    return rxjs.throwError(() => error);
                }
                return rxjs.from(waitAndReconnectWhenUserDoesSomething(error)).pipe(switchMap(() => createObservable()));
            }));
        }
        return createObservable().subscribe({
            next: (msg) => {
                if (msg) {
                    console.debug('WS got message', msg);
                    db.messageConsumer.enqueue(msg);
                }
            },
            error: (error) => {
                console.error('WS got error', error);
            },
            complete: () => {
                console.debug('WS observable completed');
            },
        });
    }

    function isSyncNeeded(db) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return ((_a = db.cloud.options) === null || _a === void 0 ? void 0 : _a.databaseUrl) && db.cloud.schema
                ? yield sync(db, db.cloud.options, db.cloud.schema, { justCheckIfNeeded: true })
                : false;
        });
    }

    function performGuardedJob(db, jobName, job) {
        if (typeof navigator === 'undefined' || !navigator.locks) {
            // No support for guarding jobs. IE11, node.js, etc.
            return job();
        }
        return navigator.locks.request(db.name + '|' + jobName, () => job());
    }

    const ongoingSyncs = new WeakMap();
    function syncIfPossible(db, cloudOptions, cloudSchema, options) {
        const ongoing = ongoingSyncs.get(db);
        if (ongoing) {
            if (ongoing.pull || (options === null || options === void 0 ? void 0 : options.purpose) === 'push') {
                console.debug('syncIfPossible(): returning the ongoing sync promise.');
                return ongoing.promise;
            }
            else {
                // Ongoing sync may never do anything in case there are no outstanding changes
                // to sync (because its purpose was "push" not "pull")
                // Now, however, we are asked to do a sync with the purpose of "pull"
                // We want to optimize here. We must wait for the ongoing to complete
                // and then, if the ongoing sync never resulted in a sync request,
                // we must redo the sync.
                // To inspect what is happening in the ongoing request, let's subscribe
                // to db.cloud.syncState and look for if it is doing any "pulling" phase:
                let hasPullTakenPlace = false;
                const subscription = db.cloud.syncState.subscribe((syncState) => {
                    if (syncState.phase === 'pulling') {
                        hasPullTakenPlace = true;
                    }
                });
                // Ok, so now we are watching. At the same time, wait for the ongoing to complete
                // and when it has completed, check if we're all set or if we need to redo
                // the call:
                return (ongoing.promise
                    // This is a finally block but we are still running tests on
                    // browsers that don't support it, so need to do it like this:
                    .then(() => {
                    subscription.unsubscribe();
                })
                    .catch((error) => {
                    subscription.unsubscribe();
                    return Promise.reject(error);
                })
                    .then(() => {
                    if (!hasPullTakenPlace) {
                        // No pull took place in the ongoing sync but the caller had "pull" as
                        // an explicit purpose of this call - so we need to redo the call!
                        return syncIfPossible(db, cloudOptions, cloudSchema, options);
                    }
                }));
            }
        }
        const promise = _syncIfPossible();
        ongoingSyncs.set(db, { promise, pull: (options === null || options === void 0 ? void 0 : options.purpose) !== 'push' });
        return promise;
        function _syncIfPossible() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Check if should delay sync due to ratelimit:
                    yield checkSyncRateLimitDelay(db);
                    // Check if we need to lock the sync job. Not needed if we are the service worker.
                    if (db.cloud.isServiceWorkerDB) {
                        // We are the dedicated sync SW:
                        yield sync(db, cloudOptions, cloudSchema, options);
                    }
                    else if (!db.cloud.usingServiceWorker) {
                        // We use a flow that is better suited for the case when multiple workers want to
                        // do the same thing.
                        yield performGuardedJob(db, CURRENT_SYNC_WORKER, () => sync(db, cloudOptions, cloudSchema, options));
                    }
                    else {
                        assert(false);
                        throw new Error('Internal _syncIfPossible() - invalid precondition - should not have been called.');
                    }
                    ongoingSyncs.delete(db);
                    console.debug('Done sync');
                }
                catch (error) {
                    ongoingSyncs.delete(db);
                    console.error(`Failed to sync client changes`, error);
                    throw error; // Make sure we rethrow error so that sync event is retried.
                    // I don't think we should setTimout or so here.
                    // Unless server tells us to in some response.
                    // Then we could follow that advice but not by waiting here but by registering
                    // Something that triggers an event listened to in startPushWorker()
                }
            });
        }
    }

    const SECONDS = 1000;
    const MINUTES = 60 * SECONDS;

    function LocalSyncWorker(db, cloudOptions, cloudSchema) {
        let localSyncEventSubscription = null;
        //let syncHandler: ((event: Event) => void) | null = null;
        //let periodicSyncHandler: ((event: Event) => void) | null = null;
        let cancelToken = { cancelled: false };
        let retryHandle = null;
        let retryPurpose = null; // "pull" is superset of "push"
        function syncAndRetry(purpose, retryNum = 1) {
            // Use setTimeout() to get onto a clean stack and
            // break free from possible active transaction:
            setTimeout(() => {
                if (retryHandle)
                    clearTimeout(retryHandle);
                const combPurpose = retryPurpose === 'pull' ? 'pull' : purpose;
                retryHandle = null;
                retryPurpose = null;
                syncIfPossible(db, cloudOptions, cloudSchema, {
                    cancelToken,
                    retryImmediatelyOnFetchError: true, // workaround for "net::ERR_NETWORK_CHANGED" in chrome.
                    purpose: combPurpose,
                }).catch((e) => {
                    console.error('error in syncIfPossible()', e);
                    if (cancelToken.cancelled) {
                        stop();
                    }
                    else if (retryNum < 3) {
                        // Mimic service worker sync event: retry 3 times
                        // * first retry after 5 minutes
                        // * second retry 15 minutes later
                        const combinedPurpose = retryPurpose && retryPurpose === 'pull' ? 'pull' : purpose;
                        const handle = setTimeout(() => syncAndRetry(combinedPurpose, retryNum + 1), [0, 5, 15][retryNum] * MINUTES);
                        // Cancel the previous retryHandle if it exists to avoid scheduling loads of retries.
                        if (retryHandle)
                            clearTimeout(retryHandle);
                        retryHandle = handle;
                        retryPurpose = combinedPurpose;
                    }
                });
            }, 0);
        }
        const start = () => {
            // Sync eagerly whenever a change has happened (+ initially when there's no syncState yet)
            // This initial subscribe will also trigger an sync also now.
            console.debug('Starting LocalSyncWorker', db.localSyncEvent['id']);
            localSyncEventSubscription = db.localSyncEvent.subscribe(({ purpose }) => {
                try {
                    syncAndRetry(purpose || 'pull');
                }
                catch (err) {
                    console.error('What-the....', err);
                }
            });
            //setTimeout(()=>db.localSyncEvent.next({}), 5000);
        };
        const stop = () => {
            console.debug('Stopping LocalSyncWorker');
            cancelToken.cancelled = true;
            if (localSyncEventSubscription)
                localSyncEventSubscription.unsubscribe();
        };
        return {
            start,
            stop,
        };
    }

    function updateSchemaFromOptions(schema, options) {
        if (schema && options) {
            if (options.unsyncedTables) {
                for (const tableName of options.unsyncedTables) {
                    if (schema[tableName]) {
                        schema[tableName].markedForSync = false;
                    }
                }
            }
        }
    }

    function verifySchema(db) {
        var _a, _b;
        for (const table of db.tables) {
            if ((_b = (_a = db.cloud.schema) === null || _a === void 0 ? void 0 : _a[table.name]) === null || _b === void 0 ? void 0 : _b.markedForSync) {
                if (table.schema.primKey.auto) {
                    throw new Dexie.SchemaError(`Table ${table.name} is both autoIncremented and synced. ` +
                        `Use db.cloud.configure({unsyncedTables: [${JSON.stringify(table.name)}]}) to blacklist it from sync`);
                }
                if (!table.schema.primKey.keyPath) {
                    throw new Dexie.SchemaError(`Table ${table.name} cannot be both synced and outbound. ` +
                        `Use db.cloud.configure({unsyncedTables: [${JSON.stringify(table.name)}]}) to blacklist it from sync`);
                }
            }
        }
    }

    var n,l$1,u$1,t$1,o$1,f$1={},e$1=[],c$1=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function s$1(n,l){for(var u in l)n[u]=l[u];return n}function a$1(n){var l=n.parentNode;l&&l.removeChild(n);}function h(l,u,i){var t,o,r,f={};for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return v$1(l,f,t,o,null)}function v$1(n,i,t,o,r){var f={type:n,props:i,key:t,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u$1:r};return null==r&&null!=l$1.vnode&&l$1.vnode(f),f}function p$1(n){return n.children}function d$1(n,l){this.props=n,this.context=l;}function _$1(n,l){if(null==l)return n.__?_$1(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?_$1(n):null}function k$1(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return k$1(n)}}function b$1(n){(!n.__d&&(n.__d=!0)&&t$1.push(n)&&!g$1.__r++||o$1!==l$1.debounceRendering)&&((o$1=l$1.debounceRendering)||setTimeout)(g$1);}function g$1(){for(var n;g$1.__r=t$1.length;)n=t$1.sort(function(n,l){return n.__v.__b-l.__v.__b}),t$1=[],n.some(function(n){var l,u,i,t,o,r;n.__d&&(o=(t=(l=n).__v).__e,(r=l.__P)&&(u=[],(i=s$1({},t)).__v=t.__v+1,j$1(r,t,i,l.__n,void 0!==r.ownerSVGElement,null!=t.__h?[o]:null,u,null==o?_$1(t):o,t.__h),z$1(u,t),t.__e!=o&&k$1(t)));});}function w$1(n,l,u,i,t,o,r,c,s,a){var h,y,d,k,b,g,w,x=i&&i.__k||e$1,C=x.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(k=u.__k[h]=null==(k=l[h])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k||"bigint"==typeof k?v$1(null,k,null,null,k):Array.isArray(k)?v$1(p$1,{children:k},null,null,null):k.__b>0?v$1(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(d=x[h])||d&&k.key==d.key&&k.type===d.type)x[h]=void 0;else for(y=0;y<C;y++){if((d=x[y])&&k.key==d.key&&k.type===d.type){x[y]=void 0;break}d=null;}j$1(n,k,d=d||f$1,t,o,r,c,s,a),b=k.__e,(y=k.ref)&&d.ref!=y&&(w||(w=[]),d.ref&&w.push(d.ref,null,k),w.push(y,k.__c||b,k)),null!=b?(null==g&&(g=b),"function"==typeof k.type&&k.__k===d.__k?k.__d=s=m$1(k,s,n):s=A(n,k,d,x,b,s),"function"==typeof u.type&&(u.__d=s)):s&&d.__e==s&&s.parentNode!=n&&(s=_$1(d));}for(u.__e=g,h=C;h--;)null!=x[h]&&("function"==typeof u.type&&null!=x[h].__e&&x[h].__e==u.__d&&(u.__d=_$1(i,h+1)),N(x[h],x[h]));if(w)for(h=0;h<w.length;h++)M(w[h],w[++h],w[++h]);}function m$1(n,l,u){for(var i,t=n.__k,o=0;t&&o<t.length;o++)(i=t[o])&&(i.__=n,l="function"==typeof i.type?m$1(i,l,u):A(u,i,i,t,i.__e,l));return l}function A(n,l,u,i,t,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||t!=o||null==t.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(t),r=null;else {for(f=o,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,o),r=o;}return void 0!==r?r:t.nextSibling}function C(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||H(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||H(n,o,l[o],u[o],i);}function $(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||c$1.test(l)?u:u+"px";}function H(n,l,u,i,t){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||$(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||$(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?i||n.addEventListener(l,o?T:I,o):n.removeEventListener(l,o?T:I,o);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l));}}function I(n){this.l[n.type+!1](l$1.event?l$1.event(n):n);}function T(n){this.l[n.type+!0](l$1.event?l$1.event(n):n);}function j$1(n,u,i,t,o,r,f,e,c){var a,h,v,y,_,k,b,g,m,x,A,C,$,H=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,r=[e]),(a=l$1.__b)&&a(u);try{n:if("function"==typeof H){if(g=u.props,m=(a=H.contextType)&&t[a.__c],x=a?m?m.props.value:a.__:t,i.__c?b=(h=u.__c=i.__c).__=h.__E:("prototype"in H&&H.prototype.render?u.__c=h=new H(g,x):(u.__c=h=new d$1(g,x),h.constructor=H,h.render=O),m&&m.sub(h),h.props=g,h.state||(h.state={}),h.context=x,h.__n=t,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=H.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=s$1({},h.__s)),s$1(h.__s,H.getDerivedStateFromProps(g,h.__s))),y=h.props,_=h.state,v)null==H.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else {if(null==H.getDerivedStateFromProps&&g!==y&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(g,x),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(g,h.__s,x)||u.__v===i.__v){h.props=g,h.state=h.__s,u.__v!==i.__v&&(h.__d=!1),h.__v=u,u.__e=i.__e,u.__k=i.__k,u.__k.forEach(function(n){n&&(n.__=u);}),h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(g,h.__s,x),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(y,_,k);});}if(h.context=x,h.props=g,h.__v=u,h.__P=n,A=l$1.__r,C=0,"prototype"in H&&H.prototype.render)h.state=h.__s,h.__d=!1,A&&A(u),a=h.render(h.props,h.state,h.context);else do{h.__d=!1,A&&A(u),a=h.render(h.props,h.state,h.context),h.state=h.__s;}while(h.__d&&++C<25);h.state=h.__s,null!=h.getChildContext&&(t=s$1(s$1({},t),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(k=h.getSnapshotBeforeUpdate(y,_)),$=null!=a&&a.type===p$1&&null==a.key?a.props.children:a,w$1(n,Array.isArray($)?$:[$],u,i,t,o,r,f,e,c),h.base=u.__e,u.__h=null,h.__h.length&&f.push(h),b&&(h.__E=h.__=null),h.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=L(i.__e,u,i,t,o,r,f,c);(a=l$1.diffed)&&a(u);}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l$1.__e(n,u,i);}}function z$1(n,u){l$1.__c&&l$1.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$1.__e(n,u.__v);}});}function L(l,u,i,t,o,r,e,c){var s,h,v,y=i.props,p=u.props,d=u.type,k=0;if("svg"===d&&(o=!0),null!=r)for(;k<r.length;k++)if((s=r[k])&&"setAttribute"in s==!!d&&(d?s.localName===d:3===s.nodeType)){l=s,r[k]=null;break}if(null==l){if(null===d)return document.createTextNode(p);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,p.is&&p),r=null,c=!1;}if(null===d)y===p||c&&l.data===p||(l.data=p);else {if(r=r&&n.call(l.childNodes),h=(y=i.props||f$1).dangerouslySetInnerHTML,v=p.dangerouslySetInnerHTML,!c){if(null!=r)for(y={},k=0;k<l.attributes.length;k++)y[l.attributes[k].name]=l.attributes[k].value;(v||h)&&(v&&(h&&v.__html==h.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""));}if(C(l,p,y,o,c),v)u.__k=[];else if(k=u.props.children,w$1(l,Array.isArray(k)?k:[k],u,i,t,o&&"foreignObject"!==d,r,e,r?r[0]:i.__k&&_$1(i,0),c),null!=r)for(k=r.length;k--;)null!=r[k]&&a$1(r[k]);c||("value"in p&&void 0!==(k=p.value)&&(k!==l.value||"progress"===d&&!k||"option"===d&&k!==y.value)&&H(l,"value",k,y.value,!1),"checked"in p&&void 0!==(k=p.checked)&&k!==l.checked&&H(l,"checked",k,y.checked,!1));}return l}function M(n,u,i){try{"function"==typeof n?n(u):n.current=u;}catch(n){l$1.__e(n,i);}}function N(n,u,i){var t,o;if(l$1.unmount&&l$1.unmount(n),(t=n.ref)&&(t.current&&t.current!==n.__e||M(t,null,u)),null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(n){l$1.__e(n,u);}t.base=t.__P=null;}if(t=n.__k)for(o=0;o<t.length;o++)t[o]&&N(t[o],u,"function"!=typeof n.type);i||null==n.__e||a$1(n.__e),n.__e=n.__d=void 0;}function O(n,l,u){return this.constructor(n,u)}function P(u,i,t){var o,r,e;l$1.__&&l$1.__(u,i),r=(o="function"==typeof t)?null:t&&t.__k||i.__k,e=[],j$1(i,u=(!o&&t||i).__k=h(p$1,null,[u]),r||f$1,f$1,void 0!==i.ownerSVGElement,!o&&t?[t]:r?null:i.firstChild?n.call(i.childNodes):null,e,!o&&t?t:r?r.__e:i.firstChild,o),z$1(e,u);}n=e$1.slice,l$1={__e:function(n,l,u,i){for(var t,o,r;l=l.__;)if((t=l.__c)&&!t.__)try{if((o=t.constructor)&&null!=o.getDerivedStateFromError&&(t.setState(o.getDerivedStateFromError(n)),r=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(n,i||{}),r=t.__d),r)return t.__E=t}catch(l){n=l;}throw n}},u$1=0,d$1.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=s$1({},this.state),"function"==typeof n&&(n=n(s$1({},u),this.props)),n&&s$1(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),b$1(this));},d$1.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),b$1(this));},d$1.prototype.render=p$1,t$1=[],g$1.__r=0;

    const Styles = {
        Error: {
            color: "red",
        },
        Alert: {
            error: {
                color: "red",
                fontWeight: "bold"
            },
            warning: {
                color: "#f80",
                fontWeight: "bold"
            },
            info: {
                color: "black"
            }
        },
        Darken: {
            position: "fixed",
            top: 0,
            left: 0,
            opacity: 0.5,
            backgroundColor: "#000",
            width: "100vw",
            height: "100vh",
            zIndex: 150,
            webkitBackdropFilter: "blur(2px)",
            backdropFilter: "blur(2px)",
        },
        DialogOuter: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 150,
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
        },
        DialogInner: {
            position: "relative",
            color: "#222",
            backgroundColor: "#fff",
            padding: "30px",
            marginBottom: "2em",
            maxWidth: "90%",
            maxHeight: "90%",
            overflowY: "auto",
            border: "3px solid #3d3d5d",
            borderRadius: "8px",
            boxShadow: "0 0 80px 10px #666",
            width: "auto",
            fontFamily: "sans-serif",
        },
        Input: {
            height: "35px",
            width: "17em",
            borderColor: "#ccf4",
            outline: "none",
            fontSize: "17pt",
            padding: "8px"
        }
    };

    function Dialog({ children, className }) {
        return (h("div", { className: className },
            h("div", { style: Styles.Darken }),
            h("div", { style: Styles.DialogOuter },
                h("div", { style: Styles.DialogInner }, children))));
    }

    var t,r,u,i,o=0,c=[],f=[],e=l$1.__b,a=l$1.__r,v=l$1.diffed,l=l$1.__c,m=l$1.unmount;function d(t,u){l$1.__h&&l$1.__h(r,t,o||u),o=0;var i=r.__H||(r.__H={__:[],__h:[]});return t>=i.__.length&&i.__.push({__V:f}),i.__[t]}function p(n){return o=1,y(z,n)}function y(n,u,i){var o=d(t++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):z(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}));}],o.__c=r,!r.u)){r.u=!0;var c=r.shouldComponentUpdate;r.shouldComponentUpdate=function(n,t,r){if(!o.__c.__H)return !0;var u=o.__c.__H.__.filter(function(n){return n.__c});if(u.every(function(n){return !n.__N}))return !c||c.call(this,n,t,r);var i=!1;return u.forEach(function(n){if(n.__N){var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=!0);}}),!!i&&(!c||c.call(this,n,t,r))};}return o.__N||o.__}function s(u,i){var o=d(t++,4);!l$1.__s&&w(o.__H,i)&&(o.__=u,o.i=i,r.__h.push(o));}function _(n){return o=5,F(function(){return {current:n}},[])}function F(n,r){var u=d(t++,7);return w(u.__H,r)?(u.__V=n(),u.i=r,u.__h=n,u.__V):u.__}function b(){for(var t;t=c.shift();)if(t.__P&&t.__H)try{t.__H.__h.forEach(j),t.__H.__h.forEach(k),t.__H.__h=[];}catch(r){t.__H.__h=[],l$1.__e(r,t.__v);}}l$1.__b=function(n){r=null,e&&e(n);},l$1.__r=function(n){a&&a(n),t=0;var i=(r=n.__c).__H;i&&(u===r?(i.__h=[],r.__h=[],i.__.forEach(function(n){n.__N&&(n.__=n.__N),n.__V=f,n.__N=n.i=void 0;})):(i.__h.forEach(j),i.__h.forEach(k),i.__h=[])),u=r;},l$1.diffed=function(t){v&&v(t);var o=t.__c;o&&o.__H&&(o.__H.__h.length&&(1!==c.push(o)&&i===l$1.requestAnimationFrame||((i=l$1.requestAnimationFrame)||function(n){var t,r=function(){clearTimeout(u),g&&cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);g&&(t=requestAnimationFrame(r));})(b)),o.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.__V!==f&&(n.__=n.__V),n.i=void 0,n.__V=f;})),u=r=null;},l$1.__c=function(t,r){r.some(function(t){try{t.__h.forEach(j),t.__h=t.__h.filter(function(n){return !n.__||k(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],l$1.__e(u,t.__v);}}),l&&l(t,r);},l$1.unmount=function(t){m&&m(t);var r,u=t.__c;u&&u.__H&&(u.__H.__.forEach(function(n){try{j(n);}catch(n){r=n;}}),r&&l$1.__e(r,u.__v));};var g="function"==typeof requestAnimationFrame;function j(n){var t=r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r=t;}function k(n){var t=r;n.__c=n.__(),r=t;}function w(n,t){return !n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function z(n,t){return "function"==typeof t?t(n):t}

    /** Resolve a message template with parameters.
     *
     * Example:
     *  resolveText({
     *    message: "Hello {name}!",
     *    messageCode: "HELLO",
     *    messageParams: {name: "David"}
     *  }) => "Hello David!"
     *
     * @param message Template message with {vars} in it.
     * @param messageCode Unique code for the message. Can be used for translation.
     * @param messageParams Parameters to be used in the message.
     * @returns A final message where parameters have been replaced with values.
     */
    function resolveText({ message, messageCode, messageParams }) {
        return message.replace(/\{\w+\}/ig, n => messageParams[n.substring(1, n.length - 1)]);
    }

    const OTP_LENGTH = 8;
    function LoginDialog({ title, type, alerts, fields, submitLabel, cancelLabel, onCancel, onSubmit, }) {
        const [params, setParams] = p({});
        const firstFieldRef = _(null);
        s(() => { var _a; return (_a = firstFieldRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, []);
        return (h(Dialog, { className: "dxc-login-dlg" },
            h(p$1, null,
                h("h3", { style: Styles.WindowHeader }, title),
                alerts.map((alert) => (h("p", { style: Styles.Alert[alert.type] }, resolveText(alert)))),
                h("form", { onSubmit: (ev) => {
                        ev.preventDefault();
                        onSubmit(params);
                    } }, Object.entries(fields).map(([fieldName, { type, label, placeholder }], idx) => (h("label", { style: Styles.Label, key: idx },
                    label ? `${label}: ` : '',
                    h("input", { ref: idx === 0 ? firstFieldRef : undefined, type: type, name: fieldName, autoComplete: "on", style: Styles.Input, autoFocus: true, placeholder: placeholder, value: params[fieldName] || '', onInput: (ev) => {
                            var _a;
                            const value = valueTransformer(type, (_a = ev.target) === null || _a === void 0 ? void 0 : _a['value']);
                            let updatedParams = Object.assign(Object.assign({}, params), { [fieldName]: value });
                            setParams(updatedParams);
                            if (type === 'otp' && (value === null || value === void 0 ? void 0 : value.trim().length) === OTP_LENGTH) {
                                // Auto-submit when OTP is filled in.
                                onSubmit(updatedParams);
                            }
                        } })))))),
            h("div", { style: Styles.ButtonsDiv },
                h(p$1, null,
                    h("button", { type: "submit", style: Styles.Button, onClick: () => onSubmit(params) }, submitLabel),
                    cancelLabel && (h("button", { style: Styles.Button, onClick: onCancel }, cancelLabel))))));
    }
    function valueTransformer(type, value) {
        switch (type) {
            case 'email':
                return value.toLowerCase();
            case 'otp':
                return value.toUpperCase();
            default:
                return value;
        }
    }

    class LoginGui extends d$1 {
        constructor(props) {
            super(props);
            this.observer = (userInteraction) => this.setState({ userInteraction });
            this.state = { userInteraction: undefined };
        }
        componentDidMount() {
            this.subscription = rxjs.from(this.props.db.cloud.userInteraction).subscribe(this.observer);
        }
        componentWillUnmount() {
            if (this.subscription) {
                this.subscription.unsubscribe();
                delete this.subscription;
            }
        }
        render(props, { userInteraction }) {
            if (!userInteraction)
                return null;
            //if (props.db.cloud.userInteraction.observers.length > 1) return null; // Someone else subscribes.
            return h(LoginDialog, Object.assign({}, userInteraction));
        }
    }
    function setupDefaultGUI(db) {
        let closed = false;
        const el = document.createElement('div');
        if (document.body) {
            document.body.appendChild(el);
            P(h(LoginGui, { db: db.vip }), el);
        }
        else {
            addEventListener('DOMContentLoaded', () => {
                if (!closed) {
                    document.body.appendChild(el);
                    P(h(LoginGui, { db: db.vip }), el);
                }
            });
        }
        return {
            unsubscribe() {
                try {
                    el.remove();
                }
                catch (_a) { }
                closed = true;
            },
            get closed() {
                return closed;
            }
        };
    }

    function associate(factory) {
        const wm = new WeakMap();
        return (x) => {
            let rv = wm.get(x);
            if (!rv) {
                rv = factory(x);
                wm.set(x, rv);
            }
            return rv;
        };
    }

    const getCurrentUserEmitter = associate((db) => new rxjs.BehaviorSubject(UNAUTHORIZED_USER));

    function computeSyncState(db) {
        let _prevStatus = db.cloud.webSocketStatus.value;
        const lazyWebSocketStatus = db.cloud.webSocketStatus.pipe(switchMap((status) => {
            const prevStatus = _prevStatus;
            _prevStatus = status;
            const rv = rxjs.of(status);
            switch (status) {
                // A normal scenario is that the WS reconnects and falls shortly in disconnected-->connection-->connected.
                // Don't distract user with this unless these things take more time than normal:
                // Only show disconnected if disconnected more than 500ms, or if we can
                // see that the user is indeed not active.
                case 'disconnected':
                    return userIsActive.value ? rv.pipe(debounceTime(500)) : rv;
                // Only show connecting if previous state was 'not-started' or 'error', or if
                // the time it takes to connect goes beyond 4 seconds.
                case 'connecting':
                    return prevStatus === 'not-started' || prevStatus === 'error'
                        ? rv
                        : rv.pipe(debounceTime(4000));
                default:
                    return rv;
            }
        }));
        return rxjs.combineLatest([
            lazyWebSocketStatus,
            db.syncStateChangedEvent.pipe(startWith({ phase: 'initial' })),
            getCurrentUserEmitter(db.dx._novip),
            userIsReallyActive
        ]).pipe(map(([status, syncState, user, userIsActive]) => {
            var _a;
            if (((_a = user.license) === null || _a === void 0 ? void 0 : _a.status) && user.license.status !== 'ok') {
                return {
                    phase: 'offline',
                    status: 'offline',
                    license: user.license.status
                };
            }
            let { phase, error, progress } = syncState;
            let adjustedStatus = status;
            if (phase === 'error') {
                // Let users only rely on the status property to display an icon.
                // If there's an error in the sync phase, let it show on that
                // status icon also.
                adjustedStatus = 'error';
            }
            if (status === 'not-started') {
                // If websocket isn't yet connected becase we're doing
                // the startup sync, let the icon show the symbol for connecting.
                if (phase === 'pushing' || phase === 'pulling') {
                    adjustedStatus = 'connecting';
                }
            }
            const previousPhase = db.cloud.syncState.value.phase;
            //const previousStatus = db.cloud.syncState.value.status;
            if (previousPhase === 'error' && (syncState.phase === 'pushing' || syncState.phase === 'pulling')) {
                // We were in an errored state but is now doing sync. Show "connecting" icon.
                adjustedStatus = 'connecting';
            }
            /*if (syncState.phase === 'in-sync' && adjustedStatus === 'connecting') {
              adjustedStatus = 'connected';
            }*/
            if (!userIsActive) {
                adjustedStatus = 'disconnected';
            }
            const retState = {
                phase,
                error,
                progress,
                status: isOnline ? adjustedStatus : 'offline',
                license: 'ok'
            };
            return retState;
        }));
    }

    function createSharedValueObservable(o, defaultValue) {
        let currentValue = defaultValue;
        let shared = rxjs.from(o).pipe(rxjs.map((x) => (currentValue = x)), rxjs.share({ resetOnRefCountZero: () => rxjs.timer(1000) }));
        const rv = new rxjs.Observable((observer) => {
            let didEmit = false;
            const subscription = shared.subscribe({
                next(value) {
                    didEmit = true;
                    observer.next(value);
                },
                error(error) {
                    observer.error(error);
                },
                complete() {
                    observer.complete();
                }
            });
            if (!didEmit && !subscription.closed) {
                observer.next(currentValue);
            }
            return subscription;
        });
        rv.getValue = () => currentValue;
        return rv;
    }

    const getGlobalRolesObservable = associate((db) => {
        return createSharedValueObservable(Dexie.liveQuery(() => db.roles
            .where({ realmId: 'rlm-public' })
            .toArray()
            .then((roles) => {
            const rv = {};
            for (const role of roles
                .slice()
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))) {
                rv[role.name] = role;
            }
            return rv;
        })), {});
    });

    const getInternalAccessControlObservable = associate((db) => {
        return createSharedValueObservable(getCurrentUserEmitter(db._novip).pipe(switchMap((currentUser) => Dexie.liveQuery(() => db.transaction('r', 'realms', 'members', () => Promise.all([
            db.members.where({ userId: currentUser.userId }).toArray(),
            db.realms.toArray(),
            currentUser.userId,
        ]).then(([selfMembers, realms, userId]) => {
            //console.debug(`PERMS: Result from liveQUery():`, JSON.stringify({selfMembers, realms, userId}, null, 2))
            return { selfMembers, realms, userId };
        }))))), {
            selfMembers: [],
            realms: [],
            get userId() {
                return db.cloud.currentUserId;
            },
        });
        /* let refCount = 0;
        return new Observable(observer => {
          const subscription = o.subscribe(observer);
          console.debug ('PERMS subscribe', ++refCount);
          return {
            unsubscribe() {
              console.debug ('PERMS unsubscribe', --refCount);
              subscription.unsubscribe();
            }
          }
        })*/
    });

    function mapValueObservable(o, mapper) {
        let currentValue;
        const rv = o.pipe(rxjs.map((x) => (currentValue = mapper(x))));
        rv.getValue = () => currentValue !== undefined
            ? currentValue
            : (currentValue = mapper(o.getValue()));
        return rv;
    }

    // TODO: Move to dexie-cloud-common
    function mergePermissions(...permissions) {
        if (permissions.length === 0)
            return {};
        const reduced = permissions.reduce((result, next) => {
            const ret = Object.assign({}, result);
            for (const [verb, rights] of Object.entries(next)) {
                if (verb in ret && ret[verb]) {
                    if (ret[verb] === '*')
                        continue;
                    if (rights === '*') {
                        ret[verb] = '*';
                    }
                    else if (Array.isArray(rights) && Array.isArray(ret[verb])) {
                        // Both are arrays (verb is 'add' or 'manage')
                        const r = ret;
                        const retVerb = r[verb]; // "!" because Array.isArray(ret[verb])
                        r[verb] = [...new Set([...retVerb, ...rights])];
                    }
                    else if (typeof rights === 'object' &&
                        rights &&
                        typeof ret[verb] === 'object') {
                        // Both are objects (verb is 'update')
                        const mergedRights = ret[verb]; // because we've checked that typeof ret[verb] === 'object' and earlier that not ret[verb] === '*'.
                        for (const [tableName, tableRights] of Object.entries(rights)) {
                            if (mergedRights[tableName] === '*')
                                continue;
                            if (tableRights === '*') {
                                mergedRights[tableName] = '*';
                            }
                            else if (Array.isArray(mergedRights[tableName]) &&
                                Array.isArray(tableRights)) {
                                mergedRights[tableName] = [
                                    ...new Set([...mergedRights[tableName], ...tableRights]),
                                ];
                            }
                        }
                    }
                }
                else {
                    /* This compiles without type assertions. Keeping the comment to
                       explain why we do tsignore on the next statement.
                    if (verb === "add") {
                      ret[verb] = next[verb];
                    } else if (verb === "update") {
                      ret[verb] = next[verb];
                    } else if (verb === "manage") {
                      ret[verb] = next[verb];
                    } else {
                      ret[verb] = next[verb];
                    }
                    */
                    //@ts-ignore
                    ret[verb] = next[verb];
                }
            }
            return ret;
        });
        return reduced;
    }

    const getPermissionsLookupObservable = associate((db) => {
        const o = createSharedValueObservable(rxjs.combineLatest([
            getInternalAccessControlObservable(db._novip),
            getGlobalRolesObservable(db._novip),
        ]).pipe(map(([{ selfMembers, realms, userId }, globalRoles]) => ({
            selfMembers,
            realms,
            userId,
            globalRoles,
        }))), {
            selfMembers: [],
            realms: [],
            userId: UNAUTHORIZED_USER.userId,
            globalRoles: {},
        });
        return mapValueObservable(o, ({ selfMembers, realms, userId, globalRoles }) => {
            const rv = realms
                .map((realm) => {
                const selfRealmMembers = selfMembers.filter((m) => m.realmId === realm.realmId);
                const directPermissionSets = selfRealmMembers
                    .map((m) => m.permissions)
                    .filter((p) => p);
                const rolePermissionSets = flatten(selfRealmMembers.map((m) => m.roles).filter((roleName) => roleName))
                    .map((role) => globalRoles[role])
                    .filter((role) => role)
                    .map((role) => role.permissions);
                return Object.assign(Object.assign({}, realm), { permissions: realm.owner === userId
                        ? { manage: '*' }
                        : mergePermissions(...directPermissionSets, ...rolePermissionSets) });
            })
                .reduce((p, c) => (Object.assign(Object.assign({}, p), { [c.realmId]: c })), {
                [userId]: {
                    realmId: userId,
                    owner: userId,
                    name: userId,
                    permissions: { manage: '*' },
                },
            });
            return rv;
        });
    });

    class PermissionChecker {
        constructor(permissions, tableName, isOwner) {
            this.permissions = permissions || {};
            this.tableName = tableName;
            this.isOwner = isOwner;
        }
        add(...tableNames) {
            var _a;
            // If user can manage the whole realm, return true.
            if (this.permissions.manage === '*')
                return true;
            // If user can manage given table in realm, return true
            if ((_a = this.permissions.manage) === null || _a === void 0 ? void 0 : _a.includes(this.tableName))
                return true;
            // If user can add any type, return true
            if (this.permissions.add === '*')
                return true;
            // If user can add objects into given table names in the realm, return true
            if (tableNames.every((tableName) => { var _a; return (_a = this.permissions.add) === null || _a === void 0 ? void 0 : _a.includes(tableName); })) {
                return true;
            }
            return false;
        }
        update(...props) {
            var _a, _b;
            // If user is owner of this object, or if user can manage the whole realm, return true.
            if (this.isOwner || this.permissions.manage === '*')
                return true;
            // If user can manage given table in realm, return true
            if ((_a = this.permissions.manage) === null || _a === void 0 ? void 0 : _a.includes(this.tableName))
                return true;
            // If user can update any prop in any table in this realm, return true unless
            // it regards to ownership change:
            if (this.permissions.update === '*') {
                return props.every((prop) => prop !== 'owner');
            }
            const tablePermissions = (_b = this.permissions.update) === null || _b === void 0 ? void 0 : _b[this.tableName];
            // If user can update any prop in table and realm, return true unless
            // accessing special props owner or realmId
            if (tablePermissions === '*')
                return props.every((prop) => prop !== 'owner');
            // Explicitely listed properties to allow updates on:
            return props.every((prop) => tablePermissions === null || tablePermissions === void 0 ? void 0 : tablePermissions.some((permittedProp) => permittedProp === prop || (permittedProp === '*' && prop !== 'owner')));
        }
        delete() {
            var _a;
            // If user is owner of this object, or if user can manage the whole realm, return true.
            if (this.isOwner || this.permissions.manage === '*')
                return true;
            // If user can manage given table in realm, return true
            if ((_a = this.permissions.manage) === null || _a === void 0 ? void 0 : _a.includes(this.tableName))
                return true;
            return false;
        }
    }

    function permissions(dexie, obj, tableName) {
        if (!obj)
            throw new TypeError(`Cannot check permissions of undefined or null. A Dexie Cloud object with realmId and owner expected.`);
        const { owner, realmId } = obj;
        if (!tableName) {
            if (typeof obj.table !== 'function') {
                throw new TypeError(`Missing 'table' argument to permissions and table could not be extracted from entity`);
            }
            tableName = obj.table();
        }
        const source = getPermissionsLookupObservable(dexie);
        const mapper = (permissionsLookup) => {
            // If realmId is undefined, it can be due to that the object is not yet syncified - it exists
            // locally only as the user might not yet be authenticated. This is ok and we shall treat it
            // as if the realmId is dexie.cloud.currentUserId (which is "unauthorized" by the way)
            const realm = permissionsLookup[realmId || dexie.cloud.currentUserId];
            if (!realm)
                return new PermissionChecker({}, tableName, !owner || owner === dexie.cloud.currentUserId);
            return new PermissionChecker(realm.permissions, tableName, realmId === undefined || realmId === dexie.cloud.currentUserId || owner === dexie.cloud.currentUserId);
        };
        const o = source.pipe(map(mapper));
        o.getValue = () => mapper(source.getValue());
        return o;
    }

    const getInvitesObservable = associate((db) => {
        const membersByEmail = getCurrentUserEmitter(db._novip).pipe(switchMap((currentUser) => Dexie.liveQuery(() => db.members.where({ email: currentUser.email || '' }).toArray())));
        const permissions = getPermissionsLookupObservable(db._novip);
        const accessControl = getInternalAccessControlObservable(db._novip);
        return createSharedValueObservable(rxjs.combineLatest([membersByEmail, accessControl, permissions]).pipe(map(([membersByEmail, accessControl, realmLookup]) => {
            const reducer = (result, m) => (Object.assign(Object.assign({}, result), { [m.id]: Object.assign(Object.assign({}, m), { realm: realmLookup[m.realmId] }) }));
            const emailMembersById = membersByEmail.reduce(reducer, {});
            const membersById = accessControl.selfMembers.reduce(reducer, emailMembersById);
            return Object.values(membersById)
                .filter((invite) => !invite.accepted)
                .map((invite) => (Object.assign(Object.assign({}, invite), { accept() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield db.members.update(invite.id, { accepted: new Date() });
                    });
                },
                reject() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield db.members.update(invite.id, { rejected: new Date() });
                    });
                } })));
        })), []);
    });

    function getTiedRealmId(objectId) {
        return 'rlm~' + objectId;
    }
    function getTiedObjectId(realmId) {
        return realmId.startsWith('rlm~') ? realmId.substr(4) : null;
    }

    const DEFAULT_OPTIONS = {
        nameSuffix: true,
    };
    function dexieCloud(dexie) {
        const origIdbName = dexie.name;
        //
        //
        //
        const currentUserEmitter = getCurrentUserEmitter(dexie);
        const subscriptions = [];
        let configuredProgramatically = false;
        // local sync worker - used when there's no service worker.
        let localSyncWorker = null;
        dexie.on('ready', (dexie) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield onDbReady(dexie);
            }
            catch (error) {
                console.error(error);
                // Make sure to succeed with database open even if network is down.
            }
        }), true // true = sticky
        );
        /** Void starting subscribers after a close has happened. */
        let closed = false;
        function throwIfClosed() {
            if (closed)
                throw new Dexie.DatabaseClosedError();
        }
        dbOnClosed(dexie, () => {
            subscriptions.forEach((subscription) => subscription.unsubscribe());
            closed = true;
            localSyncWorker && localSyncWorker.stop();
            localSyncWorker = null;
            currentUserEmitter.next(UNAUTHORIZED_USER);
        });
        const syncComplete = new rxjs.Subject();
        dexie.cloud = {
            // @ts-ignore
            version: "4.0.11",
            options: Object.assign({}, DEFAULT_OPTIONS),
            schema: null,
            get currentUserId() {
                return currentUserEmitter.value.userId || UNAUTHORIZED_USER.userId;
            },
            currentUser: currentUserEmitter,
            syncState: new rxjs.BehaviorSubject({
                phase: 'initial',
                status: 'not-started',
            }),
            events: {
                syncComplete,
            },
            persistedSyncState: new rxjs.BehaviorSubject(undefined),
            userInteraction: new rxjs.BehaviorSubject(undefined),
            webSocketStatus: new rxjs.BehaviorSubject('not-started'),
            login(hint) {
                return __awaiter(this, void 0, void 0, function* () {
                    const db = DexieCloudDB(dexie);
                    yield db.cloud.sync();
                    yield login(db, hint);
                });
            },
            invites: getInvitesObservable(dexie),
            roles: getGlobalRolesObservable(dexie),
            configure(options) {
                options = dexie.cloud.options = Object.assign(Object.assign({}, dexie.cloud.options), options);
                configuredProgramatically = true;
                if (options.databaseUrl && options.nameSuffix) {
                    // @ts-ignore
                    dexie.name = `${origIdbName}-${getDbNameFromDbUrl(options.databaseUrl)}`;
                    DexieCloudDB(dexie).reconfigure(); // Update observable from new dexie.name
                }
                updateSchemaFromOptions(dexie.cloud.schema, dexie.cloud.options);
            },
            logout({ force } = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    force
                        ? yield _logout(DexieCloudDB(dexie), { deleteUnsyncedData: true })
                        : yield logout(DexieCloudDB(dexie));
                });
            },
            sync({ wait, purpose } = { wait: true, purpose: 'push' }) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    if (wait === undefined)
                        wait = true;
                    const db = DexieCloudDB(dexie);
                    const licenseStatus = ((_a = db.cloud.currentUser.value.license) === null || _a === void 0 ? void 0 : _a.status) || 'ok';
                    if (licenseStatus !== 'ok') {
                        // Refresh access token to check for updated license
                        yield loadAccessToken(db);
                    }
                    if (purpose === 'pull') {
                        const syncState = db.cloud.persistedSyncState.value;
                        triggerSync(db, purpose);
                        if (wait) {
                            const newSyncState = yield rxjs.firstValueFrom(db.cloud.persistedSyncState.pipe(filter((newSyncState) => (newSyncState === null || newSyncState === void 0 ? void 0 : newSyncState.timestamp) != null &&
                                (!syncState || newSyncState.timestamp > syncState.timestamp))));
                            if (newSyncState === null || newSyncState === void 0 ? void 0 : newSyncState.error) {
                                throw new Error(`Sync error: ` + newSyncState.error);
                            }
                        }
                    }
                    else if (yield isSyncNeeded(db)) {
                        const syncState = db.cloud.persistedSyncState.value;
                        triggerSync(db, purpose);
                        if (wait) {
                            console.debug('db.cloud.login() is waiting for sync completion...');
                            yield rxjs.firstValueFrom(rxjs.from(Dexie.liveQuery(() => __awaiter(this, void 0, void 0, function* () {
                                const syncNeeded = yield isSyncNeeded(db);
                                const newSyncState = yield db.getPersistedSyncState();
                                if ((newSyncState === null || newSyncState === void 0 ? void 0 : newSyncState.timestamp) !== (syncState === null || syncState === void 0 ? void 0 : syncState.timestamp) &&
                                    (newSyncState === null || newSyncState === void 0 ? void 0 : newSyncState.error))
                                    throw new Error(`Sync error: ` + newSyncState.error);
                                return syncNeeded;
                            }))).pipe(filter((isNeeded) => !isNeeded)));
                            console.debug('Done waiting for sync completion because we have nothing to push anymore');
                        }
                    }
                });
            },
            permissions(obj, tableName) {
                return permissions(dexie._novip, obj, tableName);
            },
        };
        dexie.Version.prototype['_parseStoresSpec'] = Dexie.override(dexie.Version.prototype['_parseStoresSpec'], (origFunc) => overrideParseStoresSpec(origFunc, dexie));
        dexie.Table.prototype.newId = function ({ colocateWith } = {}) {
            const shardKey = colocateWith && colocateWith.substr(colocateWith.length - 3);
            return generateKey(dexie.cloud.schema[this.name].idPrefix || '', shardKey);
        };
        dexie.Table.prototype.idPrefix = function () {
            var _a, _b;
            return ((_b = (_a = this.db.cloud.schema) === null || _a === void 0 ? void 0 : _a[this.name]) === null || _b === void 0 ? void 0 : _b.idPrefix) || '';
        };
        dexie.use(createMutationTrackingMiddleware({
            currentUserObservable: dexie.cloud.currentUser,
            db: DexieCloudDB(dexie),
        }));
        dexie.use(createImplicitPropSetterMiddleware(DexieCloudDB(dexie)));
        dexie.use(createIdGenerationMiddleware(DexieCloudDB(dexie)));
        function onDbReady(dexie) {
            var _a, _b, _c, _d, _e, _f, _g;
            return __awaiter(this, void 0, void 0, function* () {
                closed = false; // As Dexie calls us, we are not closed anymore. Maybe reopened? Remember db.ready event is registered with sticky flag!
                const db = DexieCloudDB(dexie);
                // Setup default GUI:
                if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                    if (!((_a = db.cloud.options) === null || _a === void 0 ? void 0 : _a.customLoginGui)) {
                        subscriptions.push(setupDefaultGUI(dexie));
                    }
                }
                if (!db.cloud.isServiceWorkerDB) {
                    subscriptions.push(computeSyncState(db).subscribe(dexie.cloud.syncState));
                }
                // Forward db.syncCompleteEvent to be publicly consumable via db.cloud.events.syncComplete:
                subscriptions.push(db.syncCompleteEvent.subscribe(syncComplete));
                //verifyConfig(db.cloud.options); Not needed (yet at least!)
                // Verify the user has allowed version increment.
                if (!db.tables.every((table) => table.core)) {
                    throwVersionIncrementNeeded();
                }
                const swRegistrations = 'serviceWorker' in navigator
                    ? yield navigator.serviceWorker.getRegistrations()
                    : [];
                const [initiallySynced, lastSyncedRealms] = yield db.transaction('rw', db.$syncState, () => __awaiter(this, void 0, void 0, function* () {
                    var _h, _j;
                    const { options, schema } = db.cloud;
                    const [persistedOptions, persistedSchema, persistedSyncState] = yield Promise.all([
                        db.getOptions(),
                        db.getSchema(),
                        db.getPersistedSyncState(),
                    ]);
                    if (!configuredProgramatically) {
                        // Options not specified programatically (use case for SW!)
                        // Take persisted options:
                        db.cloud.options = persistedOptions || null;
                    }
                    else if (!persistedOptions ||
                        JSON.stringify(persistedOptions) !== JSON.stringify(options)) {
                        // Update persisted options:
                        if (!options)
                            throw new Error(`Internal error`); // options cannot be null if configuredProgramatically is set.
                        const newPersistedOptions = Object.assign({}, options);
                        delete newPersistedOptions.fetchTokens;
                        yield db.$syncState.put(newPersistedOptions, 'options');
                    }
                    if (((_h = db.cloud.options) === null || _h === void 0 ? void 0 : _h.tryUseServiceWorker) &&
                        'serviceWorker' in navigator &&
                        swRegistrations.length > 0 &&
                        !DISABLE_SERVICEWORKER_STRATEGY) {
                        // * Configured for using service worker if available.
                        // * Browser supports service workers
                        // * There are at least one service worker registration
                        console.debug('Dexie Cloud Addon: Using service worker');
                        db.cloud.usingServiceWorker = true;
                    }
                    else {
                        // Not configured for using service worker or no service worker
                        // registration exists. Don't rely on service worker to do any job.
                        // Use LocalSyncWorker instead.
                        if (((_j = db.cloud.options) === null || _j === void 0 ? void 0 : _j.tryUseServiceWorker) &&
                            !db.cloud.isServiceWorkerDB) {
                            console.debug('dexie-cloud-addon: Not using service worker.', swRegistrations.length === 0
                                ? 'No SW registrations found.'
                                : 'serviceWorker' in navigator && DISABLE_SERVICEWORKER_STRATEGY
                                    ? 'Avoiding SW background sync and SW periodic bg sync for this browser due to browser bugs.'
                                    : 'navigator.serviceWorker not present');
                        }
                        db.cloud.usingServiceWorker = false;
                    }
                    updateSchemaFromOptions(schema, db.cloud.options);
                    updateSchemaFromOptions(persistedSchema, db.cloud.options);
                    if (!schema) {
                        // Database opened dynamically (use case for SW!)
                        // Take persisted schema:
                        db.cloud.schema = persistedSchema || null;
                    }
                    else if (!persistedSchema ||
                        JSON.stringify(persistedSchema) !== JSON.stringify(schema)) {
                        // Update persisted schema (but don't overwrite table prefixes)
                        const newPersistedSchema = persistedSchema || {};
                        for (const [table, tblSchema] of Object.entries(schema)) {
                            const newTblSchema = newPersistedSchema[table];
                            if (!newTblSchema) {
                                newPersistedSchema[table] = Object.assign({}, tblSchema);
                            }
                            else {
                                newTblSchema.markedForSync = tblSchema.markedForSync;
                                tblSchema.deleted = newTblSchema.deleted;
                                newTblSchema.generatedGlobalId = tblSchema.generatedGlobalId;
                            }
                        }
                        yield db.$syncState.put(newPersistedSchema, 'schema');
                        // Make sure persisted table prefixes are being used instead of computed ones:
                        // Let's assign all props as the newPersistedSchems should be what we should be working with.
                        Object.assign(schema, newPersistedSchema);
                    }
                    return [persistedSyncState === null || persistedSyncState === void 0 ? void 0 : persistedSyncState.initiallySynced, persistedSyncState === null || persistedSyncState === void 0 ? void 0 : persistedSyncState.realms];
                }));
                if (initiallySynced) {
                    db.setInitiallySynced(true);
                }
                verifySchema(db);
                if (((_b = db.cloud.options) === null || _b === void 0 ? void 0 : _b.databaseUrl) && !initiallySynced) {
                    yield performInitialSync(db, db.cloud.options, db.cloud.schema);
                    db.setInitiallySynced(true);
                }
                // Manage CurrentUser observable:
                throwIfClosed();
                if (!db.cloud.isServiceWorkerDB) {
                    subscriptions.push(Dexie.liveQuery(() => db.getCurrentUser()).subscribe(currentUserEmitter));
                    // Manage PersistendSyncState observable:
                    subscriptions.push(Dexie.liveQuery(() => db.getPersistedSyncState()).subscribe(db.cloud.persistedSyncState));
                    // Wait till currentUser and persistedSyncState gets populated
                    // with things from the database and not just the default values.
                    // This is so that when db.open() completes, user should be safe
                    // to subscribe to these observables and get actual data.
                    yield rxjs.firstValueFrom(rxjs.combineLatest([
                        currentUserEmitter.pipe(skip(1), take(1)),
                        db.cloud.persistedSyncState.pipe(skip(1), take(1)),
                    ]));
                }
                // HERE: If requireAuth, do athentication now.
                let changedUser = false;
                const user = yield db.getCurrentUser();
                const requireAuth = (_c = db.cloud.options) === null || _c === void 0 ? void 0 : _c.requireAuth;
                if (requireAuth) {
                    if (typeof requireAuth === 'object') {
                        // requireAuth contains login hints. Check if we already fulfil it:
                        if (!user.isLoggedIn ||
                            (requireAuth.userId && user.userId !== requireAuth.userId) ||
                            (requireAuth.email && user.email !== requireAuth.email)) {
                            // If not, login the configured user:
                            changedUser = yield login(db, requireAuth);
                        }
                    }
                    else if (!user.isLoggedIn) {
                        // requireAuth is true and user is not logged in
                        changedUser = yield login(db);
                    }
                }
                if (user.isLoggedIn && (!lastSyncedRealms || !lastSyncedRealms.includes(user.userId))) {
                    // User has been logged in but this is not reflected in the sync state.
                    // This can happen if page is reloaded after login but before the sync call following
                    // the login was complete.
                    // The user is to be viewed as changed becuase current syncState does not reflect the presence
                    // of the logged-in user.
                    changedUser = true; // Set changedUser to true to trigger a pull-sync later down.
                }
                if (localSyncWorker)
                    localSyncWorker.stop();
                localSyncWorker = null;
                throwIfClosed();
                if (db.cloud.usingServiceWorker && ((_d = db.cloud.options) === null || _d === void 0 ? void 0 : _d.databaseUrl)) {
                    registerSyncEvent(db, changedUser ? 'pull' : 'push').catch(() => { });
                    registerPeriodicSyncEvent(db).catch(() => { });
                }
                else if (((_e = db.cloud.options) === null || _e === void 0 ? void 0 : _e.databaseUrl) &&
                    db.cloud.schema &&
                    !db.cloud.isServiceWorkerDB) {
                    // There's no SW. Start SyncWorker instead.
                    localSyncWorker = LocalSyncWorker(db, db.cloud.options, db.cloud.schema);
                    localSyncWorker.start();
                    triggerSync(db, changedUser ? 'pull' : 'push');
                }
                // Listen to online event and do sync.
                throwIfClosed();
                if (!db.cloud.isServiceWorkerDB) {
                    subscriptions.push(rxjs.fromEvent(self, 'online').subscribe(() => {
                        console.debug('online!');
                        db.syncStateChangedEvent.next({
                            phase: 'not-in-sync',
                        });
                        if (!isEagerSyncDisabled(db)) {
                            triggerSync(db, 'push');
                        }
                    }), rxjs.fromEvent(self, 'offline').subscribe(() => {
                        console.debug('offline!');
                        db.syncStateChangedEvent.next({
                            phase: 'offline',
                        });
                    }));
                }
                // Connect WebSocket unless we
                if (((_f = db.cloud.options) === null || _f === void 0 ? void 0 : _f.databaseUrl) &&
                    !((_g = db.cloud.options) === null || _g === void 0 ? void 0 : _g.disableWebSocket) &&
                    !IS_SERVICE_WORKER) {
                    subscriptions.push(connectWebSocket(db));
                }
            });
        }
    }
    // @ts-ignore
    dexieCloud.version = "4.0.11";
    Dexie.Cloud = dexieCloud;

    exports.default = dexieCloud;
    exports.dexieCloud = dexieCloud;
    exports.getTiedObjectId = getTiedObjectId;
    exports.getTiedRealmId = getTiedRealmId;
    exports.resolveText = resolveText;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=dexie-cloud-addon.js.map
