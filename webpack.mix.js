const mix = require('laravel-mix');
const path = require('path');

mix.setPublicPath(path.normalize('public/'));

mix.js('resources/assets/js/app.js', 'public/js')
  .sass('resources/assets/sass/app.scss', 'public/css');

mix.extract([
  'tippy.js'
]);

mix.options({
  postCss: [
    require('autoprefixer')({
      browsers: ['>0.1%'],
      cascade: false
    })
  ]
});

if (!mix.inProduction()) {
  mix.sourceMaps();
}