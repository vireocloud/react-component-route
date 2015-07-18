module.exports = function (ctx, next) {

	var Component = ctx.Component;

	if (typeof Component.fetch === 'function') {
		Component.fetch(ctx, function (err, data) {
			if (err) {
				return next(err);
			}

			ctx.data = data || {};
			next();
		});
	} else {
		ctx.data = {};
		next();
	};
};