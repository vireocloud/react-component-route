var assign = require('lodash/assign');
var viewParams = function (ctx, fn, done) {

	//thunkify `fn`
	var customParams = fn;

	if(!fn) {
		 customParams = function(ctx, done){
			done(null, {});
		};
	} else if(fn.length === 1) {
		customParams = function(ctx, done){
			done(null, fn(ctx));
		};
	}

	customParams(ctx, function(err, params){
		var defaultParams = {
			req: ctx.req,
			react: {
				html: ctx.html || '',
				data: ctx.data,
	      meta: ctx.meta
			},
		};

		done(null, assign(defaultParams, params));
	});
};

module.exports = function (ctx, next) {
	viewParams(ctx, ctx.options.viewParams, function(err, params){
		if(err) {
			return next(err);
		}

		ctx.res.render(ctx.options.view, params);
	});
};
