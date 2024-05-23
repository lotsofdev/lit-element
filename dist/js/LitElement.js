var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { __wait } from '@lotsof/sugar/datetime';
import { __adoptStyleInShadowRoot, __injectStyle, __querySelectorLive, __when, __whenInViewport, } from '@lotsof/sugar/dom';
import { __deepMerge } from '@lotsof/sugar/object';
import { __camelCase, __uniqid } from '@lotsof/sugar/string';
import { LitElement as __LitElement, html as __html } from 'lit';
import { property } from 'lit/decorators.js';
export { __html as html };
// up
class LitElement extends __LitElement {
    get state() {
        return this._state;
    }
    set state(state) {
        Object.assign(this._state, state);
    }
    /**
     * @name            define
     * @type            Function
     * @static
     *
     * This static method allows you to define a custom element just like the `customElement.define` does.
     * The trick is that this define method will not initialize the component directly. It will
     * wait until it is near the viewport before actually creating a new element names "%tagName-up".
     * This will be the custom element that is registered and that will replace your "%tagName" HTMLElement.
     *
     * @param
     * @param       {Any}           props          The initial props to apply to your custom element
     * @param       {String}        tagName         The tagname you want to search in the DOM
     *
     * @since       2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    static define(tagName, Cls, props = {}, settings = {}) {
        var _a;
        // set the default props
        LitElement.setDefaultProps(tagName, props);
        const win = (_a = settings.window) !== null && _a !== void 0 ? _a : window;
        if (win.customElements.get(tagName.toLowerCase())) {
            return;
        }
        // @ts-ignore
        win.customElements.define(tagName.toLowerCase(), class extends Cls {
        });
    }
    /**
     * @name            setDefaultProps
     * @type            Function
     * @static
     *
     * This static method allows you to set some default props for some particular
     * component(s). You can target components using simple css selectorl like "my-component#cool".
     * Once the component is instanciated, it will check if some defaults are specified and
     * extends them with the passed props.
     *
     * @param     {String|String[]}      selector      The selector to use to target elements on which these props will be applied
     * @param     {Any}         props         An object of props you want to set defaults for
     *
     * @since       2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    static setDefaultProps(selector, props) {
        selector = Array.isArray(selector) ? selector : [selector];
        selector.forEach((sel) => {
            var _a;
            this._defaultProps[sel] = Object.assign(Object.assign({}, ((_a = this._defaultProps[sel]) !== null && _a !== void 0 ? _a : {})), props);
        });
    }
    injectStyle(css, id = this.tagName) {
        // @ts-ignore
        if (this.constructor._injectedStyles.indexOf(id) !== -1)
            return;
        // @ts-ignore
        this.constructor._injectedStyles.push(id);
        __injectStyle(css, {
            id,
        });
    }
    /**
     * @name            getDefaultProps
     * @type            Function
     * @static
     *
     * This static method allows you to get back some default props setted for a component/feature, etc...
     *
     * @param     {String|String[]}      selector      The selector to use to target elements on which these props will be applied
     * @return    {Any}                                 Some default props setted or an empty object
     *
     * @since       2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    static getDefaultProps(selector) {
        var _a, _b;
        return Object.assign(Object.assign({}, ((_a = this._defaultProps['*']) !== null && _a !== void 0 ? _a : {})), ((_b = this._defaultProps[selector]) !== null && _b !== void 0 ? _b : {}));
    }
    /**
     * @name            constructor
     * @type            Function
     * @constructor
     *
     * Constructor
     *
     * @since       2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    constructor(settings) {
        var _a, _b, _c, _d, _e;
        super();
        this.id = __uniqid();
        this.verbose = false;
        this.activeWhen = [];
        this.mountWhen = 'direct';
        this.prefixEvent = true;
        this.adoptStyle = true;
        this.saveState = false;
        this._shouldUpdate = false;
        this._isInViewport = false;
        this._state = {
            status: 'idle',
        };
        this.name = (_a = settings === null || settings === void 0 ? void 0 : settings.name) !== null && _a !== void 0 ? _a : this.tagName.toLowerCase();
        this.settings = __deepMerge({
            shadowDom: false,
            get rootNode() {
                var _a;
                return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('*:first-child');
            },
        }, settings !== null && settings !== void 0 ? settings : {});
        // shadow handler
        if (this.settings.shadowDom === false) {
            this.createRenderRoot = () => {
                return this;
            };
        }
        // check if we need to inject the css into the
        // document that is not the same as the app one
        const doc = this._getDocumentFromElement(this);
        if (document !== doc && this.constructor.styles) {
            __injectStyle(this.constructor.styles, {
                rootNode: doc,
            });
        }
        // monitor if the component is in viewport or not
        this._whenInViewportPromise = __whenInViewport(this, {
            once: false,
            whenIn: () => {
                this._isInViewport = true;
            },
            whenOut: () => {
                this._isInViewport = false;
            },
        });
        // make sure the injected styles stays BEFORE the link[rel="stylesheet"]
        // to avoid style override
        if (!LitElement._keepInjectedCssBeforeStylesheetLinksInited) {
            const $firstStylesheetLink = document.head.querySelector('link[rel="stylesheet"]');
            __querySelectorLive('style', ($style) => {
                if ($firstStylesheetLink) {
                    document.head.insertBefore($style, $firstStylesheetLink);
                }
            }, {
                rootNode: document.head,
            });
            LitElement._keepInjectedCssBeforeStylesheetLinksInited = true;
        }
        // @ts-ignore
        const nodeFirstUpdated = (_b = this.firstUpdated) === null || _b === void 0 ? void 0 : _b.bind(this);
        // @ts-ignore
        this.firstUpdated = () => __awaiter(this, void 0, void 0, function* () {
            if (nodeFirstUpdated) {
                // @ts-ignore
                yield nodeFirstUpdated();
            }
            // set the component as mounted
            this.setAttribute('mounted', 'true');
        });
        // litElement shouldUpdate
        // @ts-ignore
        const nodeShouldUpdate = (_c = this.shouldUpdate) === null || _c === void 0 ? void 0 : _c.bind(this);
        // @ts-ignore
        this.shouldUpdate = () => {
            if (nodeShouldUpdate) {
                // @ts-ignore
                const res = nodeShouldUpdate();
                if (!res)
                    return false;
            }
            return this._shouldUpdate;
        };
        // (async () => {
        const defaultProps = LitElement.getDefaultProps(this.tagName.toLowerCase());
        const mountWhen = (_e = (_d = this.getAttribute('mount-when')) !== null && _d !== void 0 ? _d : defaultProps.mountWhen) !== null && _e !== void 0 ? _e : 'direct';
        // component class
        this.classList.add(...this.cls('').split(' '));
        // wait until mount
        this.waitAndExecute(mountWhen, () => {
            this._mount();
        });
        // })();
    }
    _getDocumentFromElement($elm) {
        while ($elm.parentNode) {
            $elm = $elm.parentNode;
        }
        return $elm;
    }
    /**
     * @name           dispatch
     * @type            Function
     * @async
     *
     * This method allows you to dispatch some CustomEvents from your component node itself.
     * 1. An event called "%componentName.%eventName"
     * 2. An event called "%componentName" with in the detail object a "eventType" property set to the event name
     * 3. An event called "%eventName" with in the detail object a "eventComponent" property set to the component name
     *
     * @param           {String}            eventName     The event name to dispatch
     * @param           {ILitElementDispatchSettings}          [settings={}]     The settings to use for the dispatch
     *
     * @since       2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    dispatch(eventName, settings) {
        const finalSettings = Object.assign({ $elm: this, bubbles: true, cancelable: true, detail: {} }, (settings !== null && settings !== void 0 ? settings : {}));
        const componentName = this.name;
        if (this.prefixEvent) {
            // %componentName.%eventName
            finalSettings.$elm.dispatchEvent(new CustomEvent(`${__camelCase(componentName)}.${__camelCase(eventName)}`, finalSettings));
        }
        else {
            // %eventName
            finalSettings.$elm.dispatchEvent(new CustomEvent(__camelCase(eventName), Object.assign(Object.assign({}, finalSettings), { detail: Object.assign(Object.assign({}, finalSettings.detail), { eventComponent: componentName }) })));
        }
        // %componentName
        finalSettings.$elm.dispatchEvent(new CustomEvent(componentName, Object.assign(Object.assign({}, finalSettings), { detail: Object.assign(Object.assign({}, finalSettings.detail), { eventType: eventName }) })));
    }
    /**
     * @name        adoptStyleInShadowRoot
     * @type        Function
     * @async
     *
     * This method allows you to make the passed shadowRoot element adopt
     * the style of the passed context who's by default the document itself
     *
     * @param       {HTMLShadowRootElement}         $shadowRoot             The shadow root you want to adopt the $context styles
     * @param      {HTMLElement}                   [$context=document]     The context from which you want to adopt the styles
     * @return      {Promise}                                               Return a promise fullfilled when the styles have been adopted
     *
     * @since       2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    adoptStyleInShadowRoot($shadowRoot, $context) {
        return __adoptStyleInShadowRoot($shadowRoot, $context);
    }
    /**
     * @name          cls
     * @type          Function
     *
     * This method allows you to get a component ready class like my-component__something, etc...
     *
     * @param         {String}        cls         The class you want to process. Can be multiple classes separated by a space. If null, does not print any class at all but the "style" one
     * @return        {String}                    The generated class that you can apply
     *
     * @since         2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    cls(cls = '', style = '') {
        let clsString = '';
        if (cls !== null) {
            clsString = cls
                .split(' ')
                .map((clsName) => {
                let clses = [];
                // class from the component tagname if wanted
                if (this.settings.useTagNameForClassName) {
                    clses.push(`${this.tagName.toLowerCase()}${clsName && !clsName.match(/^(_{1,2}|-)/) ? '-' : ''}${clsName}`);
                }
                // class from the passed "name" in the settings
                if (this.settings.name &&
                    this.tagName.toLowerCase() !== this.settings.name) {
                    clses.push(`${this.settings.name.toLowerCase()}${clsName && !clsName.match(/^(_{1,2}|-)/) ? '-' : ''}${clsName}`);
                }
                // replace '---' by '--'
                clses = clses.map((c) => c.replace('---', '--'));
                return clses.join(' ');
            })
                .join(' ');
        }
        if (style) {
            clsString += ` ${style}`;
        }
        return clsString;
    }
    /**
     * @name           waitAndExecute
     * @type            Function
     * @async
     *
     * This async method allows you to wait for the component (node) has reached
     * his "mount" state. This state depends fully on the "mountWhen" property.
     * When the state has been reached, the passed callback will be executed.
     *
     * @param       {String|String[]}            when            When you want to execute the callback. Can be "direct", "inViewport", "nearViewport", "outOfViewport", "interact", "visible" or "stylesheetReady"
     * @param       {Function}          callback            The callback to execute
     * @return          {Promise}           A promise fullfilled when the component (node) has reached his "mount" state
     *
     * @since       2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    waitAndExecute(when, callback) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(when)) {
                when = [when];
            }
            // wait
            if (!when.includes('direct') && !when.includes('directly')) {
                yield __when(this, when);
            }
            else {
                yield __wait();
            }
            callback === null || callback === void 0 ? void 0 : callback(this);
            resolve(this);
        }));
    }
    /**
     * @name            isActive
     * @type            Function
     *
     * true if the component is active or not. A component is active when
     *
     * @since   2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    isActive() {
        if (this.activeWhen.includes('inViewport') && !this._isInViewport) {
            return false;
        }
        return true;
    }
    /**
     * @name      isMounted
     * @type      Function
     *
     * This method returns true if the component is mounted, false if not
     *
     * @return    {Boolean}       true if is mounted, false if not
     *
     * @since   2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    isMounted() {
        return this.hasAttribute('mounted');
    }
    /**
     * @name            isInViewport
     * @type            Function
     *
     * true if the component is in the viewport, false if not
     *
     * @since   2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    isInViewport() {
        return this._isInViewport;
    }
    /**
     * @name            mount
     * @type            Function
     * @async
     *
     * This method allows you to actually mount your feature behavior.
     * It will be called depending on the "mountWhen" setting setted.
     *
     * @since           2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    mount() { }
    _mount() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const _this = this, defaultProps = LitElement.getDefaultProps(this.tagName.toLowerCase());
            for (let [name, value] of Object.entries(defaultProps)) {
                this[name] = value;
            }
            // make props responsive
            // this.utils.makePropsResponsive(this.props);
            // verbose
            if (this.verbose) {
                console.log(`[${this.tagName.toLowerCase()}]${this.id ? ` #${this.id} ` : ' '}mounting`);
            }
            // custom mount function
            if (this.mount && typeof this.mount === 'function') {
                yield this.mount();
            }
            // set the not as updatable
            this._shouldUpdate = true;
            // @ts-ignore
            this.requestUpdate();
            // await this.updateComplete;
            this.injectStyle(
            // @ts-ignore
            (_b = (_a = this.constructor.styles) === null || _a === void 0 ? void 0 : _a.cssText) !== null && _b !== void 0 ? _b : '', this.tagName);
            if (this.adoptStyle && this.shadowRoot) {
                yield this.adoptStyleInShadowRoot(this.shadowRoot);
            }
            return true;
        });
    }
    disconnectedCallback() {
        var _a, _b;
        super.disconnectedCallback();
        (_b = (_a = this._whenInViewportPromise).cancel) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
}
LitElement._keepInjectedCssBeforeStylesheetLinksInited = false;
LitElement._defaultProps = {};
LitElement._injectedStyles = [];
export default LitElement;
__decorate([
    property()
], LitElement.prototype, "id", void 0);
__decorate([
    property()
], LitElement.prototype, "verbose", void 0);
__decorate([
    property()
], LitElement.prototype, "activeWhen", void 0);
__decorate([
    property()
], LitElement.prototype, "mountWhen", void 0);
__decorate([
    property()
], LitElement.prototype, "prefixEvent", void 0);
__decorate([
    property()
], LitElement.prototype, "adoptStyle", void 0);
__decorate([
    property()
], LitElement.prototype, "saveState", void 0);
//# sourceMappingURL=LitElement.js.map