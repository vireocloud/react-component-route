var _ = require('lodash');
var React = require('react');

var componentProps = function (ctx, fn, done) {
  //thunkify `fn`
  var customProps = fn;

  if(!fn) {
     customProps = function(ctx, done){
      done(null, {});
    };
  } else if(fn.length === 1) {
    customProps = function(ctx, done){
      done(null, fn(ctx));
    };
  }

  customProps(ctx, function(err, props){
    var defaultProps= {
      req: ctx.req,
      params: ctx.req.params,
      data: ctx.data
    };

    done(null, _.assign(defaultProps, props));
  });
};

module.exports = function (ctx, next) {
  componentProps(ctx, ctx.options.componentProps, function(err, props){
    if(err) {
      return next(err);
    }

    try {
      var ReactComponent = React.createFactory(ctx.Component);
      ctx.html = React.renderToString(ReactComponent(props));
    } catch(err) {
      return next(err);
    }

    next();
  });
};