// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle = require('../../../app/model/article');
import ExportUser = require('../../../app/model/user');

declare module 'egg' {
  interface IModel {
    Article: ReturnType<typeof ExportArticle>;
    User: ReturnType<typeof ExportUser>;
  }
}
