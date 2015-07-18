var _ = require('lodash');
var viewParams = function (ctx) {
	return {
		req: ctx.req,
		react: {
			html: ctx.html || '',
			data: ctx.data
		},
	};
};

module.exports = function (ctx, next) {
	var params = _.assign(viewParams(ctx), ctx.options.viewParams ? ctx.options.viewParams(ctx) : {});
	ctx.res.render(ctx.options.view, params);
};