'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  // 验证码
  router.get('/captcha', controller.utils.captcha);

  router.group({ name: 'user', prefix: '/user' }, router => {
    const {
      info, register, login, verify, updateInfo, follow, isfollow, cancelFollow, likeArticle
    } = controller.user;
    router.post('/register', register);
    router.post('/login', login);
    router.get('/info', info);
    router.put('/info', updateInfo)
    router.get('/verify', verify);
		router.get('/detail', info);
    router.put('/follow/:id', follow);
    router.get('/follow/:id', isfollow);
		router.delete('/follow/:id', cancelFollow);
		router.put('/likeArticle/:id', likeArticle);
  });
};
