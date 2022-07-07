const md5 = require('md5')
const jwt = require('jsonwebtoken')
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
  //  this.success('token') 
		const { ctx, app } = this
    const { email, captcha, passwd } = ctx.request.body
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')
    }

    const user = await ctx.model.User.findOne({
      email,
      passwd: md5(passwd + HashSalt),
    })
    if (!user) {
      return this.error('用户名密码错误')
    }
    // 用户的信息加密成token 返回
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, {
      expiresIn: '100h',
    })
    this.success({ token, email, nickname: user.nickname })
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
