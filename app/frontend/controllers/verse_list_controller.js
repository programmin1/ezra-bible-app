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

const VerseBox = require('../ui_models/verse_box.js');

function getCurrentVerseListLoadingIndicator(tabIndex=undefined) {
  var currentVerseListFrame = app_controller.getCurrentVerseListFrame(tabIndex);
  var loadingIndicator = currentVerseListFrame.find('.verse-list-loading-indicator');
  return loadingIndicator;
}

function showVerseListLoadingIndicator(tabIndex=undefined, message=undefined, withLoader=true) {
  var loadingIndicator = getCurrentVerseListLoadingIndicator(tabIndex);
  var loadingText = loadingIndicator.find('.verse-list-loading-indicator-text');
  if (message === undefined) {
    message = i18n.t("bible-browser.loading-bible-text");
  }

  loadingText.html(message);

  if (withLoader) {
    loadingIndicator.find('.loader').show();
  } else {
    loadingIndicator.find('.loader').hide();
  }

  loadingIndicator.show();
}

function hideVerseListLoadingIndicator(tabIndex=undefined) {
  var loadingIndicator = getCurrentVerseListLoadingIndicator(tabIndex);
  loadingIndicator.hide();
}

function getBibleBookStatsFromVerseList(tabIndex) {
  var bibleBookStats = {};    
  var currentVerseList = app_controller.getCurrentVerseList(tabIndex)[0];
  var verseBoxList = currentVerseList.querySelectorAll('.verse-box');

  for (var i = 0; i < verseBoxList.length; i++) {
    var currentVerseBox = verseBoxList[i];
    var bibleBookShortTitle = new VerseBox(currentVerseBox).getBibleBookShortTitle();

    if (bibleBookStats[bibleBookShortTitle] === undefined) {
      bibleBookStats[bibleBookShortTitle] = 1;
    } else {
      bibleBookStats[bibleBookShortTitle] += 1;
    }
  }

  return bibleBookStats;
}

function resetVerseListView() {
  var textType = app_controller.tab_controller.getTab().getTextType();
  if (textType != 'xrefs' && textType != 'tagged_verses') {
    var currentReferenceVerse = app_controller.getCurrentVerseListFrame().find('.reference-verse');
    currentReferenceVerse[0].innerHTML = "";
  }

  var currentVerseList = app_controller.getCurrentVerseList()[0];
  if (currentVerseList != undefined) {
    currentVerseList.innerHTML = "";
  }

  app_controller.docxExport.disableExportButton();
}

function getVerseListBookNumber(bibleBookLongTitle, bookHeaders=undefined) {
  var bibleBookNumber = -1;

  if (bookHeaders === undefined) {
    var currentVerseListFrame = app_controller.getCurrentVerseListFrame();
    bookHeaders = currentVerseListFrame.find('.tag-browser-verselist-book-header');
  }

  for (let i = 0; i < bookHeaders.length; i++) {
    var currentBookHeader = $(bookHeaders[i]);
    var currentBookHeaderText = currentBookHeader.text();

    if (currentBookHeaderText.includes(bibleBookLongTitle)) {
      bibleBookNumber = i + 1;
      break;
    }
  }

  return bibleBookNumber;
}

module.exports = {
  getCurrentVerseListLoadingIndicator,
  showVerseListLoadingIndicator,
  hideVerseListLoadingIndicator,
  getBibleBookStatsFromVerseList,
  resetVerseListView,
  getVerseListBookNumber
};