import { LitElement as __LitElement, html as __html } from 'lit';
import { TWhenInViewportResult } from '../../../sugar/dist/js/dom/when/whenInViewport.js';
export { __html as html };
export type TLitElementDispatchSettings = {
    $elm: HTMLElement;
    bubbles: boolean;
    cancelable: boolean;
    detail: any;
};
export type TLitElementState = {
    status: 'idle' | 'error';
    [key: string]: any;
};
export type TLitElementDefineSettings = {
    window?: any;
};
export type TSLitElementDefaultProps = {
    id: string;
    lnf: string;
    verbose: boolean;
    prefixEvent: boolean;
    activeWhen: 'inViewport'[];
    mountWhen: 'directly' | 'direct' | 'inViewport';
    adoptStyle: boolean;
    saveState: boolean;
    stateId: string;
    shadowDom: boolean;
    darkModeClass: string;
};
export type TSLitElementSettings = {};
export default class LitElement extends __LitElement {
    static _keepInjectedCssBeforeStylesheetLinksInited: boolean;
    static _defaultProps: Record<string, Record<string, any>>;
    id: string | undefined;
    name: string;
    verbose: boolean;
    activeWhen: 'inViewport'[];
    mountWhen: 'directly' | 'direct' | 'inViewport';
    prefixEvent: boolean;
    adoptStyle: boolean;
    saveState: boolean;
    stateId: string;
    shadowDom: boolean;
    lnf: boolean;
    protected _internalName: string;
    _shouldUpdate: boolean;
    _isInViewport: boolean;
    _whenInViewportPromise: TWhenInViewportResult;
    protected _state: any;
    get state(): LitElement['_state'];
    set state(state: LitElement['_state']);
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
    static define(tagName: string, props?: any, settings?: Partial<TLitElementDefineSettings>): void;
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
    static setDefaultProps(selector: string | string[], props: any): void;
    static _injectedStyles: string[];
    injectStyle(css: any, id?: string): void;
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
    static getDefaultProps(selector: string): any;
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
    constructor(internalName: string);
    connectedCallback(): void;
    setState(newState: Partial<LitElement['_state']>): void;
    log(...args: any[]): void;
    _getDocumentFromElement($elm: any): any;
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
     * @param           {TLitElementDispatchSettings}          [settings={}]     The settings to use for the dispatch
     *
     * @since       2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    dispatch(eventName: string, settings?: Partial<TLitElementDispatchSettings>): void;
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
    adoptStyleInShadowRoot($shadowRoot: ShadowRoot, $context?: HTMLElement | typeof document): Promise<any>;
    /**
     * @name          internalCls
     * @type          Function
     *
     * This method allows you to get a class that is based in on the internalName of the component.
     * This is useful to query some element(s) inside your component that used the `cls` method.
     *
     * @param         {String}        cls         The class you want to process. Can be multiple classes separated by a space. If null, does not print any class at all but the "style" one
     * @return        {String}                    The generated internalName based class that you can apply
     *
     * @since         2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    internalCls(cls?: string): string;
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
    cls(cls?: string, style?: string): string;
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
    waitAndExecute(when: string | string[], callback?: Function): Promise<any>;
    /**
     * @name            isActive
     * @type            Function
     *
     * true if the component is active or not. A component is active when
     *
     * @since   2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    isActive(): boolean;
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
    isMounted(): boolean;
    /**
     * @name            isInViewport
     * @type            Function
     *
     * true if the component is in the viewport, false if not
     *
     * @since   2.0.0
     * @author 		Olivier Bossel<olivier.bossel@gmail.com>
     */
    isInViewport(): boolean;
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
    protected mount(): void;
    private _mount;
    disconnectedCallback(): void;
}
