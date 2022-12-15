import { logger } from '../utils/logger'

/**
 * An example web component
 */
export class WelcomeComponent extends HTMLElement {
  constructor() {
    super() // Always call super() first
    logger.log('[WelcomeComponent] Constructed', this)
  }

  get content(): string {
    return this.getAttribute('content') ?? ''
  }

  set content(value: string) {
    this.setAttribute('content', value)
  }

  /**
   * Specify which attributes to observe for changes.
   * Standard HTMLElement method.
   */
  static get observedAttributes() {
    return ['content']
  }

  /**
   * Invoked each time one of the custom element's attributes is added, removed, or changed.
   * Which attributes to notice change for is specified in a static get observedAttributes method.
   * Standard HTMLElement method.
   */
  attributeChangedCallback = (attr: string, oldValue: any, value: any) => {
    logger.log('Attribute changed:', attr, oldValue, value)
    switch (attr) {
      case 'content':
        if (!value || oldValue === value) return
        this.render(value)
        break
    }
  }

  /**
   * Invoked each time the custom element is connected to the document's DOM.
   * Standard HTMLElement method.
   */
  connectedCallback() {
    logger.log('[WelcomeComponent] Connected', this)
    this.render(this.content)
  }

  /**
   * Invoked each time the custom element is disconnected from the document's DOM.
   * Standard HTMLElement method.
   */
  disconnectedCallback() {
    logger.log('[WelcomeComponent] Disconnected', this)
  }

  /**
   * Update the output HTML
   * @param value String content to display in a paragraph element
   */
  private readonly render = (value: any) => {
    if (typeof value === 'string') {
      this.innerHTML = `<p class="content"> ${value} </p>`
    } else {
      logger.error('[WelcomeComponent]: Content value is not a string.')
    }
  }
}
