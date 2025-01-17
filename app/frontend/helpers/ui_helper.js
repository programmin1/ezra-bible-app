/* This file is part of Ezra Bible App.

   Copyright (C) 2019 - 2021 Ezra Bible App Development Team <contact@ezrabibleapp.net>

   Ezra Bible App is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 2 of the License, or
   (at your option) any later version.

   Ezra Bible App is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Ezra Bible App. See the file LICENSE.
   If not, see <http://www.gnu.org/licenses/>. */

const i18nController = require('../controllers/i18n_controller.js');

class UiHelper {
  constructor() {
    this.app_container_height = null;
    this.windowWidth = window.innerWidth;
  }

  configureButtonStyles(context=null) {
    if (context == null) {
      context = document;
    } else if (typeof context === 'string') {
      context = document.querySelector(context);
    } else if (!(context instanceof HTMLElement)) {
      throw new Error('context should be HTMLElement, css selector string or null for the document context');
    }
  
    var buttons = context.querySelectorAll('.fg-button');
  
    for (let i = 0; i < buttons.length; i++) {
      const currentButton = buttons[i];
      const currentButtonClasses = currentButton.classList;
  
      if (!currentButtonClasses.contains("ui-state-disabled") && !currentButtonClasses.contains("events-configured")) {
        currentButton.addEventListener('mouseover', function(e) {
          $(e.target).closest('.fg-button').addClass('ui-state-hover');
        });
  
        currentButton.addEventListener('mouseout', function(e) {
          $(e.target).closest('.fg-button').removeClass('ui-state-hover');
        });
  
        currentButton.addEventListener('mousedown', function(e) {
          uiHelper.handleButtonMousedown($(e.target).closest('.fg-button'), e.target.nodeName != 'INPUT');
        });
  
        currentButton.addEventListener('mouseup', function(e) {
          if(!$(e.target).closest('.fg-button').is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
            $(e.target).closest('.fg-button').removeClass("ui-state-active");
          }
        });
  
        currentButton.classList.add('events-configured');
      }
    }
  }
  
  handleButtonMousedown(element, click_checkbox) {
    $(element).parents('.fg-buttonset-single:first').find(".fg-button.ui-state-active").removeClass("ui-state-active");
    if ($(element).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active')) {
      $(element).removeClass("ui-state-active");
    } else { 
      $(element).addClass("ui-state-active");
    }
  
    if (click_checkbox) {
      var embedded_input = $(element).find('input:first');
  
      if (embedded_input.attr('type') == 'checkbox') {
        embedded_input[0].click();
      }
    }
  }
  
  initProgressBar(progressBar) {
    var progressLabel = progressBar.find(".progress-label");
  
    progressBar.progressbar({
      value: false,
      change: function() {
        progressLabel.text( progressBar.progressbar( "value" ) + "%" );
      },
      complete: function() {
        progressLabel.text(i18n.t('general.completed'));
      }
    });
  }

  onResize() {
    this.windowWidth = window.innerWidth;
  }

  getMaxDialogWidth() {
    var width = 900;

    if (this.windowWidth > 400 && this.windowWidth < width) {
      width = this.windowWidth - 20;
    }

    return width;
  }

  showGlobalLoadingIndicator() {
    $('#main-content').hide();
    var loadingIndicator = $('#startup-loading-indicator');
    loadingIndicator.show();
    loadingIndicator.find('.loader').show();
  }
  
  hideGlobalLoadingIndicator() {
    var loadingIndicator = $('#startup-loading-indicator');
    loadingIndicator.hide();
    $('#main-content').show();
  }

  updateLoadingSubtitle(i18nKey, fallbackText="") {
    if (!platformHelper.isCordova()) {
      return;
    }
    
    var text = i18nController.getStringForStartup(i18nKey, fallbackText);
    if (text === fallbackText && window.i18n !== undefined && typeof window.i18n.t === 'function') {
      text = window.i18n.t(i18nKey);
    }

    document.querySelector('#loading-subtitle').textContent = text !== i18nKey ? text : fallbackText;
  }

  getCurrentTextLoadingIndicator(tabIndex=undefined) {
    var currentVerseListMenu = app_controller.getCurrentVerseListMenu(tabIndex);
    var loadingIndicator = currentVerseListMenu.find('.loader');
    return loadingIndicator;
  }

  showTextLoadingIndicator(tabIndex=undefined) {
    var textLoadingIndicator = this.getCurrentTextLoadingIndicator(tabIndex);
    textLoadingIndicator.show();
  }

  hideTextLoadingIndicator(tabIndex=undefined) {
    var textLoadingIndicator = this.getCurrentTextLoadingIndicator(tabIndex);
    textLoadingIndicator.hide();
  }

  showButtonMenu($button, $menu) {
    const OFFSET_FROM_EDGE = 20;
    $button.addClass('ui-state-active');

    var buttonOffset = $button.offset();
    var topOffset = buttonOffset.top + $button.height() + 1;
    var leftOffset = buttonOffset.left;

    if (leftOffset + $menu.width() > this.windowWidth - OFFSET_FROM_EDGE) {
      leftOffset = (this.windowWidth - $menu.width()) / 2;

      if (leftOffset < 0) {
        leftOffset = 0;
      }
    }

    $menu.css('top', topOffset);
    $menu.css('left', leftOffset);
    $menu.show();
  }
}

module.exports = UiHelper;
