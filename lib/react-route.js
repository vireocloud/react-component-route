var React = require('react');
var assign = require('lodash/assign');
var Runner = require('./runner');
var authorize = require('./authorize');
var fetch = require('./fetch');
var render = require('./render');
var send = require('./send');

module.exports = function (Component, options) {
	//Build the middleware stack
	var stack = new Runner();

	options = assign({
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

	//fetch any data for the react component
	if(options.beforeFetch) {
		stack.add(options.beforeFetch);
	}

	stack.add(options.fetch || fetch);

	//authorize the request
	if(options.beforeAuthorize) {
		stack.add(options.beforeAuthorize);
	}

	stack.add(options.authorize || authorize);

	//render the component to a string
	if(options.beforeRender) {
		stack.add(options.beforeRender);
	}

	stack.add(options.render || render);

	//send the resonse to client
	if(options.beforeSend) {
		stack.add(options.beforeSend);
	}

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
