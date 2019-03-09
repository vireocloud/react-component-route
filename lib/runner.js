var Runner = function () {
	this.middleware = [];
};

Runner.prototype.add = function (fn) {
	this.middleware.push(fn);
};

Runner.prototype.setTest = function (fn) {
	this.test = fn;
};

Runner.prototype.run = function (ctx, index) {
	//default value
	index = index || 0;

	//stop if at end of stack
	if (index >= this.middleware.length) {
		return;
	}

	this.middleware[index].call(this, ctx, function (err) {
		//if err, end stack and go back to express
		if (err) {
			return ctx.next(err);
		}

		//end if test fails, and go back to express
		if (this.test && !this.test(ctx)) {
			return ctx.next();
		}

		this.run(ctx, index + 1);
	}.bind(this));
};

module.exports = Runner;