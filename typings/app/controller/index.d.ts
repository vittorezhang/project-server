// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle = require('../../../app/controller/article');
import ExportBase = require('../../../app/controller/base');
import ExportHome = require('../../../app/controller/home');
import ExportUser = require('../../../app/controller/user');
import ExportUtil = require('../../../app/controller/util');

declare module 'egg' {
  interface IController {
    article: ExportArticle;
    base: ExportBase;
    home: ExportHome;
    user: ExportUser;
    util: ExportUtil;
  }
}
