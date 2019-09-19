import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageHandlerService } from './services/localstorage/local-storage-handler.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // themeClass: string;
  themePaleteClass: boolean;
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private _localStorageHandler: LocalStorageHandlerService
  ) {
    this.translate.setDefaultLang('en');
    document.getElementById('root-app-container').classList.value = this._localStorageHandler.getFromLocalStorage('lastTheme') as string;
}

  onChangeTheme(name: string) {
    if (name === 'lava') {
      this._switchTheme('dark-theme-red');
    } else if (name === 'light-purple') {
      this._switchTheme('light-theme-purple');
    } else if (name === 'brown') {
      this._switchTheme('dark-theme-brown');
    } else if (name === 'black') {
      this._switchTheme('dark-theme-black');
    }
  }

  private _switchTheme(className: string) {
    document.getElementById('root-app-container').classList.value = className;
    // this.themeClass = className;
    this._localStorageHandler.setToLocalStorage('lastTheme', className);
  }

  onPalletHover(event: string) {
    if (event === 'enter') {
      this.themePaleteClass = true;
    } else if (event === 'leave') {
      this.themePaleteClass = false;
    }
  }

}
