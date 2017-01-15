module.exports = function (ctx, next) {

	var getMeta = function(Component, ctx, done){
		if(typeof Component.meta === 'function') {
			try {
				Component.meta(ctx, function(err, result){
					if(err){
						return done(err);
					}

					done(null, result || {});
				});
			} catch(err) {
				return done(err);
			}
		} else {
			done(null, Component.meta || {});
		}
	};

	var Component = ctx.Component;

	if (typeof Component.fetch === 'function') {
		Component.fetch(ctx, function (err, data) {
			if (err) {
				return next(err);
			}

			ctx.data = data || {};

			getMeta(Component, ctx, function(err, meta){
				if(err) {
					return next(err);
				}

				ctx.meta = meta;
				next();
			});
		});
	} else {
		ctx.data = {};

		getMeta(Component, ctx, function(err, meta){
			if(err) {
				return next(err);
			}

			ctx.meta = meta;
			next();
		});
	};
};
