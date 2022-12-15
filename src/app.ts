import { AppComponent, AppComponentOptions } from '@app/app.component'

import './styles.scss'

const appOptions: AppComponentOptions = { message: 'Hello world!' }
const appComponent = new AppComponent(appOptions)
appComponent.render('app-container')
