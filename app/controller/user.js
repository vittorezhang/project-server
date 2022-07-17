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
      expiresIn: '1h',
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
    // 只有token怎么获取详情
    const { ctx } = this
    const user = await this.checkEmail(ctx.state.email)
    this.success(user)
  }
  async updateInfo() {
    const { ctx } = this
    const url = ctx.request.body.url

    await ctx.model.User.updateOne(
      { _id: ctx.state.userid },
      { avatar: url }
    )
    this.success()
  }
  async info() {
    const { ctx } = this
    const { email } = ctx.state
    const user = await this.checkEmail(email)
    this.success(user)
  }
	async follow() {
    const { ctx } = this
    const me = await ctx.model.User.findById(ctx.state.userid)
    const isFollow = !!me.following.find(id => id.toString() === ctx.params.id)
    if (!isFollow) {
      me.following.push(ctx.params.id)
      me.save()
      this.message('关注成功')
    }
  }
}

module.exports = UserController
