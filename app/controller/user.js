const md5 = require('md5')
const BaseController = require('./base')

const HashSalt = ':Kaikeba@good!@123'
const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  passwd: { type: 'string' },
  captcha: { type: 'string' },
}
class UserController extends BaseController {

  async login() {
   this.success('token') 
  }
  async register() {
    const { ctx } = this;
    try {
      // 校验传递的参数
      ctx.validate(createRule);
    } catch (e) {
      // console.log(e)
      return this.error('参数校验失败', -1, e.errors);
    }

    const { email, passwd, captcha, nickname } = ctx.request.body;

    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }
    if (await this.checkEmail(email)) {
      this.error('邮箱重复啦')
    } else {
      const ret = await ctx.model.User.create({
        email,
        nickname,
        passwd: md5(passwd + HashSalt),
      })
      if (ret._id) {
        this.message('注册成功')
      }
    }


    // this.success({ name: 'kkb' });
  }
  async checkEmail(email) {
    
  }
  async verify() {
    // 校验用户是否存在
  }
  async detail() {
    
  }
  async info() {
    
  }
}

module.exports = UserController
