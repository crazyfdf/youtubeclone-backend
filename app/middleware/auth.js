module.exports = (options = { required: true }) => {
  return async (ctx, next) => {
    // 1.获取请求头中的token数据
    let token = ctx.headers["authorization"];
    token = token ? token.split("Bearer ")[1] : null; //Bearer空格token数据

    if (token) {
      try {
        // 2.toekn有效，根据userId获取用户数据挂载到ctx对象中给后续中间件使用
        const data = ctx.service.user.verifyToken(token);
        ctx.user = await ctx.model.User.findById(data.userId);
      } catch (err) {
        ctx.throw(401);
      }
    } else if (options.required) {
      // 3.验证token，无效401
      ctx.throw(401);
    }
    // 4.next执行后续中间件
    await next();
  };
};
