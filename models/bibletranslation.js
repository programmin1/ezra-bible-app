/* This file is part of Ezra Project.

   Copyright (C) 2019 - 2020 Tobias Klein <contact@ezra-project.net>

   Ezra Project is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   Ezra Project is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Ezra Project. See the file LICENSE.
   If not, see <http://www.gnu.org/licenses/>. */

'use strict';
module.exports = (sequelize, DataTypes) => {
  var BibleTranslation = sequelize.define('BibleTranslation', {
    name: DataTypes.STRING,
    repository: DataTypes.STRING,
    languageCode: DataTypes.STRING,
    languageName: DataTypes.STRING,
    isFree: DataTypes.BOOLEAN,
    hasStrongs: DataTypes.BOOLEAN,
    versification: DataTypes.ENUM('ENGLISH', 'HEBREW')
  }, {
    timestamps: false
  });

  BibleTranslation.importSwordTranslation = async function(translationCode, modelsInstance=undefined) {
    var reImport = false;
    
    if (modelsInstance === undefined) {
      modelsInstance = models;
    } else {
      reImport = true;
    }

    var module = nsi.getLocalModule(translationCode);

    var languageMapper = new LanguageMapper();
    var languageName = languageMapper.getLanguageName(module.language);

    if (!reImport) {
      var translation = await modelsInstance.BibleTranslation.create({
        id: translationCode,
        name: module.description,
        languageCode: module.language,
        languageName: languageName,
        isFree: 1,
        hasStrongs: module.hasStrongs,
        versification: "ENGLISH"
      });
    }

    if (!reImport) {
      await modelsInstance.BibleTranslation.updateVersification(translationCode);
    }
  };

  BibleTranslation.removeFromDb = async function(translationCode) {
    await models.BibleTranslation.destroy({
      where: {
        id: translationCode
      }
    });
  };

  BibleTranslation.updateVersification = async function(translationCode) {
    models.BibleTranslation.findByPk(translationCode).then(translation => {
      translation.updateVersification();
    });
  };

  // This function tests the versification by checking passages in Psalms and Revelation that
  // are having different numbers of verses in English and Hebrew versification
  BibleTranslation.prototype.updateVersification = async function() {
    var versification = BibleTranslation.getVersification(this.id);

    if (versification != "UNKNOWN") {
      this.versification = versification;
      await this.save();
    }
  };

  return BibleTranslation;
};
