var _ = require('lodash');
var React = require('react');

var componentProps = function (ctx) {
	return {
		req: ctx.req,
		params: ctx.req.params,
		data: ctx.data
	};
};

module.exports = function (ctx, next) {
	var ReactComponent = React.createFactory(ctx.Component);
	var props = _.assign(componentProps(ctx), ctx.options.componentProps ? ctx.options.componentProps(ctx) : {});

  try {
    ctx.html = React.renderToString(ReactComponent(props));
  } catch(err) {
    return next(err);
  }

	next();
};