var React = require('react');
var _ = require('lodash');
var Runner = require('./runner');
var authorize = require('./authorize');
var fetch = require('./fetch');
var render = require('./render');
var send = require('./send');

module.exports = function (Component, options) {
	//Build the middleware stack
	var stack = new Runner();

	options = _.assign({
		view: 'index'
	}, options);

	//Set test
	//if headers have been sent, stop the stack
	stack.setTest(options.test || function (ctx) {
		return !ctx.res.headersSent;
	});

	//before middleware
	if (options.before) {
		stack.add(options.before);
	}

	//authorize the request
	stack.add(options.authorize || authorize);

	//fetch any data for the react component
	stack.add(options.fetch || fetch);

	//render the component to a string
	stack.add(options.render || render);

	//send the resonse to client
	stack.add(options.send || send);

	return function (req, res, next) {
		var ctx = {
			Component: Component,
			req: req,
			res: res,
			next: next,
			options: options
		};

		stack.run(ctx);
	};
};