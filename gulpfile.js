var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var Server = require('karma').Server;
var demoWebpackConfig = require('./webpack/demo.config');
var webpackConfig = require('./webpack/webpack.config');
var WebpackDevServer = require("webpack-dev-server");
var open = require('gulp-open');

var babel = require('gulp-babel');

var config = require('./package.json');

var error = function(e){
  console.error(e);
  if(e.stack){
    console.error(e.stack);
  }
  process.exit(1);
};
gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('open', function () {
  gulp.src(__filename)
      .pipe(open({uri: "http://127.0.0.1:8081/webpack-dev-server/example/index.html"}));
});

gulp.task('demo-webpack', function(done) {

  var wbpk = Object.create(demoWebpackConfig);
  wbpk.devtool = 'eval';
  wbpk.entry = [
    'webpack-dev-server/client?http://127.0.0.1:' + 8081,
    'webpack/hot/only-dev-server',
    './example/src/index.js'
  ];

  wbpk.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];
  wbpk.module={
    loaders:[
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader"

      }
    ]
  }

  var compiler = webpack(wbpk);

  var server = new WebpackDevServer(compiler, {
    hot: true,
    historyApiFallback: false,
    filename: config.name+".js",
    publicPath: "/example/js",
    stats: { colors: true }
  });
  server.listen(8081, "localhost", function() {});

});
gulp.task('example-webpack',function(done){
  webpack(demoWebpackConfig).run(function(err, stats) {
    if(err) throw new gutil.PluginError("example-webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    done();
  });
});

gulp.task('require-webpack', function(done) {
  webpack(webpackConfig).run(function(err, stats) {
    if(err) throw new gutil.PluginError("require-webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    done();
  });
});

gulp.task('min-webpack', function(done) {

  var wbpk = Object.create(webpackConfig);
  wbpk.output.filename = config.name+'.min.js';
  wbpk.plugins = [
    new webpack.optimize.UglifyJsPlugin()
  ];

  webpack(wbpk).run(function(err, stats) {
    if(err) throw new gutil.PluginError("min-webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    done();
  });
});

gulp.task('babel', function(done){
  return gulp.src('src/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest('lib'));
});

gulp.task('watch', function () {
  gulp.watch(['./lib/**/*.*'], ['demo']);
});

gulp.task('default', ['babel','require-webpack','example-webpack']);
gulp.task('test',['karma']);
gulp.task('demo', ['demo-webpack','open']);
gulp.task('min',['min-webpack']);