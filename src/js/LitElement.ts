import { __wait } from '@lotsof/sugar/datetime';
import {
  __adoptStyleInShadowRoot,
  __injectStyle,
  __querySelectorLive,
  __when,
  __whenInViewport,
} from '@lotsof/sugar/dom';

import { __deepMerge } from '@lotsof/sugar/object';
import { __camelCase, __uniqid } from '@lotsof/sugar/string';
import { LitElement as __LitElement, html as __html } from 'lit';
import { property } from 'lit/decorators.js';
import { IWhenInViewportResult } from '../../../sugar/dist/js/dom/when/whenInViewport.js';

export { __html as html };

export interface ILitElementStateSettings {
  save: boolean;
  id: string;
}

export interface ILitElementSettings {
  rootNode?: HTMLElement;
  shadowDom?: boolean;
  defaultProps?: any;
  name: string;
  style: string;
  state: ILitElementStateSettings;
  useTagNameForClassName: boolean;
}

export interface ILitElementDispatchSettings {
  $elm: HTMLElement;
  bubbles: boolean;
  cancelable: boolean;
  detail: any;
}

export interface ILitElementState {
  status: 'idle' | 'error';
  [key: string]: any;
}

export interface ILitElementDefineSettings {
  window?: any;
}

export interface ISLitElementDefaultProps {
  id: string;
  lnf: string;
  verbose: boolean;
  prefixEvent: boolean;
  activeWhen: 'inViewport'[];
  mountWhen: 'directly' | 'direct' | 'inViewport';
  adoptStyle: boolean;
  saveState: boolean;
}

// up

export default class LitElement extends __LitElement {
  static _keepInjectedCssBeforeStylesheetLinksInited = false;

  static _defaultProps: Record<string, Record<string, any>> = {};

  /**
   * @name            name
   * @type            string
   * @private
   *
   * Store the name
   *
   * @since       2.0.0
   * @author 		Olivier Bossel<olivier.bossel@gmail.com>
   */
  name: string;

  /**
   * @name            settings
   * @type            Object
   * @private
   *
   * Store the settings
   *
   * @since       2.0.0
   * @author 		Olivier Bossel<olivier.bossel@gmail.com>
   */
  settings: ILitElementSettings;

  @property({ type: String })
  accessor id: string = __uniqid();

  @property({ type: Boolean })
  accessor verbose: boolean = false;

  @property({ type: Array })
  accessor activeWhen: 'inViewport'[] = [];

  @property({ type: String })
  accessor mountWhen: 'directly' | 'direct' | 'inViewport' = 'direct';

  @property({ type: Boolean })
  accessor prefixEvent: boolean = true;

  @property({ type: Boolean })
  accessor adoptStyle: boolean = true;

  @property({ type: Boolean })
  accessor saveState: boolean = false;

  _shouldUpdate = false;
  _isInViewport = false;
  _whenInViewportPromise: IWhenInViewportResult;

  _state: ILitElementState = {
    status: 'idle',
  };
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
  static define(
    tagName: string,
    Cls: typeof LitElement,
    props: any = {},
    settings: Partial<ILitElementDefineSettings> = {},
  ) {
    // set the default props
    LitElement.setDefaultProps(tagName, props);

    const win = settings.window ?? window;
    if (win.customElements.get(tagName.toLowerCase())) {
      return;
    }

    // @ts-ignore
    win.customElements.define(tagName.toLowerCase(), class extends Cls {});
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
  static setDefaultProps(selector: string | string[], props: any): void {
    selector = Array.isArray(selector) ? selector : [selector];
    selector.forEach((sel) => {
      this._defaultProps[sel] = {
        ...(this._defaultProps[sel] ?? {}),
        ...props,
      };
    });
  }

  static _injectedStyles: string[] = [];
  injectStyle(css, id = this.tagName) {
    // @ts-ignore
    if (this.constructor._injectedStyles.indexOf(id) !== -1) return;
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
  static getDefaultProps(selector: string): any {
    return {
      ...(this._defaultProps['*'] ?? {}),
      ...(this._defaultProps[selector] ?? {}),
    };
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
  constructor(settings?: Partial<ILitElementSettings>) {
    super();
    this.name = settings?.name ?? this.tagName.toLowerCase();

    this.settings = __deepMerge(
      {
        shadowDom: false,
        get rootNode() {
          return this.shadowRoot?.querySelector('*:first-child');
        },
      },
      settings ?? {},
    );

    // shadow handler
    if (this.settings.shadowDom === false) {
      this.createRenderRoot = () => {
        return this;
      };
    }

    // check if we need to inject the css into the
    // document that is not the same as the app one
    const doc = this._getDocumentFromElement(this);
    if (document !== doc && (<typeof LitElement>this.constructor).styles) {
      __injectStyle((<typeof LitElement>this.constructor).styles, {
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
      const $firstStylesheetLink = document.head.querySelector(
        'link[rel="stylesheet"]',
      );
      __querySelectorLive(
        'style',
        ($style) => {
          if ($firstStylesheetLink) {
            document.head.insertBefore($style, $firstStylesheetLink);
          }
        },
        {
          rootNode: document.head,
        },
      );
      LitElement._keepInjectedCssBeforeStylesheetLinksInited = true;
    }

    // @ts-ignore
    const nodeFirstUpdated = this.firstUpdated?.bind(this);
    // @ts-ignore
    this.firstUpdated = async () => {
      if (nodeFirstUpdated) {
        // @ts-ignore
        await nodeFirstUpdated();
      }
      // set the component as mounted
      this.setAttribute('mounted', 'true');
    };

    // litElement shouldUpdate
    // @ts-ignore
    const nodeShouldUpdate = this.shouldUpdate?.bind(this);
    // @ts-ignore
    this.shouldUpdate = () => {
      if (nodeShouldUpdate) {
        // @ts-ignore
        const res = nodeShouldUpdate();
        if (!res) return false;
      }
      return this._shouldUpdate;
    };

    const defaultProps = LitElement.getDefaultProps(this.tagName.toLowerCase());

    const mountWhen =
      this.getAttribute('mount-when') ?? defaultProps.mountWhen ?? 'direct';

    // component class
    console.log('S?', this.cls());
    this.classList.add(...this.cls('').split(' '));

    // wait until mount
    this.waitAndExecute(mountWhen, () => {
      this._mount();
    });
  }

  log(...args) {
    if (this.verbose) {
      let logs: any[] = [];
      logs.push(`[${this.tagName.toLowerCase()}]`);
      if (this.id !== this.tagName.toLocaleLowerCase()) {
        logs.push(this.id);
      }
      logs = [...logs, ...args];
      console.log(...logs);
    }
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
  dispatch(
    eventName: string,
    settings?: Partial<ILitElementDispatchSettings>,
  ): void {
    const finalSettings: ILitElementDispatchSettings = {
      $elm: this,
      bubbles: true,
      cancelable: true,
      detail: {},
      ...(settings ?? {}),
    };

    const componentName = this.name;

    if (this.prefixEvent) {
      // %componentName.%eventName
      finalSettings.$elm.dispatchEvent(
        new CustomEvent(
          `${__camelCase(componentName)}.${__camelCase(eventName)}`,
          finalSettings,
        ),
      );
    } else {
      // %eventName
      finalSettings.$elm.dispatchEvent(
        new CustomEvent(__camelCase(eventName), {
          ...finalSettings,
          detail: {
            ...finalSettings.detail,
            eventComponent: componentName,
          },
        }),
      );
    }

    // %componentName
    finalSettings.$elm.dispatchEvent(
      new CustomEvent(componentName, {
        ...finalSettings,
        detail: {
          ...finalSettings.detail,
          eventType: eventName,
        },
      }),
    );
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
  adoptStyleInShadowRoot(
    $shadowRoot: ShadowRoot,
    $context?: HTMLElement | typeof document,
  ): Promise<any> {
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
          let clses: string[] = [];
          // class from the component tagname if wanted
          if (this.settings.useTagNameForClassName) {
            clses.push(
              `${this.tagName.toLowerCase()}${
                clsName && !clsName.match(/^(_{1,2}|-)/) ? '-' : ''
              }${clsName}`,
            );
          }
          // class from the passed "name" in the settings
          if (this.settings.name) {
            clses.push(
              `${this.settings.name.toLowerCase()}${
                clsName && !clsName.match(/^(_{1,2}|-)/) ? '-' : ''
              }${clsName}`,
            );
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
  waitAndExecute(when: string | string[], callback?: Function): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!Array.isArray(when)) {
        when = [when];
      }

      // wait
      if (!when.includes('direct') && !when.includes('directly')) {
        await __when(this, when);
      } else {
        await __wait();
      }

      callback?.(this);
      resolve(this);
    });
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
  isActive(): boolean {
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
  isInViewport(): boolean {
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
  protected mount() {}
  private async _mount() {
    const _this = this,
      defaultProps = LitElement.getDefaultProps(this.tagName.toLowerCase());

    for (let [name, value] of Object.entries(defaultProps)) {
      this[name] = value;
    }

    // make props responsive
    // this.utils.makePropsResponsive(this.props);

    // verbose
    this.log('Mounting...');

    // custom mount function
    if (this.mount && typeof this.mount === 'function') {
      await this.mount();
    }

    // set the not as updatable
    this._shouldUpdate = true;
    // @ts-ignore
    this.requestUpdate();
    // await this.updateComplete;
    this.injectStyle(
      // @ts-ignore
      (<typeof LitElement>this.constructor).styles?.cssText ?? '',
      this.tagName,
    );
    if (this.adoptStyle && this.shadowRoot) {
      await this.adoptStyleInShadowRoot(this.shadowRoot);
    }

    return true;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._whenInViewportPromise.cancel?.();
  }
}
