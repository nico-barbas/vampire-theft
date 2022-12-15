import { WelcomeComponent } from '@app/components/welcome.component'
import { logger } from '@app/utils/logger'

import Data from '@assets/data.json'

export type AppComponentOptions = {
  message: string
}

export class AppComponent {
  public message: string

  constructor(options: AppComponentOptions) {
    this.message = options.message

    // Demonstrate loading assets
    logger.log(Data)

    // Define example web component
    if ('customElements' in window) {
      window.customElements.define('welcome-component', WelcomeComponent)
    }
  }

  render(elementId: string) {
    const appElement = document.getElementById(elementId)

    if (appElement) {
      appElement.innerHTML = `<welcome-component content="${this.message}"></welcome-component>`
    } else {
      logger.error(`<element id="${elementId}" ...> not found.`)
    }
  }
}
