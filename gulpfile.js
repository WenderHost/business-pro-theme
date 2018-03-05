//process.env.DISABLE_NOTIFIER = true; // Disable all notifications.

/**
 * Business Pro.
 *
 * This file adds gulp tasks to the Business Pro theme.
 *
 * @author Seo themes
 */

// Require our dependencies.
var argv         = require('minimist')(process.argv.slice(2));
var gulpif       = require('gulp-if');
var autoprefixer = require('autoprefixer');
var	browsersync  = require('browser-sync');
var	mqpacker     = require('css-mqpacker');
var	gulp         = require('gulp');
var	beautify     = require('gulp-cssbeautify');
var	cache        = require('gulp-cached');
var	cleancss     = require('gulp-clean-css');
var	csscomb      = require('gulp-csscomb');
var	cssnano      = require('gulp-cssnano');
var	filter       = require('gulp-filter');
var	imagemin     = require('gulp-imagemin');
var	notify       = require('gulp-notify');
var	pixrem       = require('gulp-pixrem');
var	plumber      = require('gulp-plumber');
var	postcss      = require('gulp-postcss');
var	rename       = require('gulp-rename');
var	replace      = require('gulp-replace');
var	s3           = require('gulp-s3-publish');
var	sass         = require('gulp-sass');
var	sort         = require('gulp-sort');
var	sourcemaps   = require('gulp-sourcemaps');
var	uglify       = require('gulp-uglify');
var	wpPot        = require('gulp-wp-pot');
var	zip          = require('gulp-zip');

// Set assets paths.
var paths = {
	concat:  ['assets/scripts/menus.js', 'assets/scripts/superfish.js'],
	images:  ['assets/images/*', '!assets/images/*.svg'],
	php:     ['./*.php', './**/*.php', './**/**/*.php'],
	scripts: ['assets/scripts/*.js', '!assets/scripts/min/'],
	styles:  ['assets/styles/*.scss', 'assets/styles/components/*.scss', '!assets/styles/min/']
};

/**
 * Autoprefixed browser support.
 *
 * https://github.com/ai/browserslist
 */
const AUTOPREFIXER_BROWSERS = [
	'last 2 versions',
	'> 0.25%',
	'ie >= 8',
	'ie_mob >= 9',
	'ff >= 28',
	'chrome >= 40',
	'safari >= 6',
	'opera >= 22',
	'ios >= 6',
	'android >= 4',
	'bb >= 9'
];

/**
 * Compile Sass.
 *
 * https://www.npmjs.com/package/gulp-sass
 */
gulp.task('styles', function () {

	/**
	 * Process WooCommerce styles.
	 */
	gulp.src('assets/styles/woocommerce.scss')

		// Notify on error
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))

		// Process sass
		.pipe(sass({
			outputStyle: 'expanded'
		}))

		// Pixel fallbacks for rem units.
		.pipe(pixrem())

		// Parse with PostCSS plugins.
		.pipe(postcss([
			autoprefixer({
				browsers: AUTOPREFIXER_BROWSERS
			}),
			mqpacker({
				sort: true
			}),
		]))

		// Format CSS.
		.pipe(csscomb())

		// Add .min suffix.
		.pipe(rename({
			suffix: '.min'
		}))

		// Output non minified css to theme directory.
		.pipe(gulp.dest('assets/styles/min/'))

	/**
	 * Process main stylesheet.
	 */
	gulp.src('assets/styles/style.scss')

		// Notify on error
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))

		// Source maps init
		/*
		.pipe(function(){
			return gulpif(enabled.maps, sourcemaps.init());
		})
		*/
		.pipe(sourcemaps.init())

		// Process sass
		.pipe(sass({
			outputStyle: 'nested',
			precision: 10,
			includePaths: ['.']
		}))

		// Pixel fallbacks for rem units.
		.pipe(pixrem())

		// Parse with PostCSS plugins.
		/*
		.pipe(postcss([
			autoprefixer({
				browsers: AUTOPREFIXER_BROWSERS
			}),
			mqpacker({
				sort: true
			}),
		]))
		/**/

		// Format non-minified CSS.
		//.pipe(csscomb())

		// Output non minified css to theme directory.
		//.pipe(gulp.dest('./'))

		// Process sass again.
		/*
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		/**/

		// Combine similar rules.
		/*
		.pipe(cleancss({
			level: {
				2: {
					all: true
				}
			}
		}))
		/**/

		// Minify and optimize style.css again.
		/*
		.pipe(cssnano({
			safe: false,
			discardComments: {
				removeAll: true,
			},
		}))
		*/

		// Add .min suffix.
		.pipe(rename({
			suffix: '.min'
		}))

		// Write source map.
		.pipe(sourcemaps.write('.'))

		// Output the compiled sass to this directory.
		.pipe(gulp.dest('assets/styles/min'))

		// Filtering stream to only css files.
		.pipe(filter('**/*.css'))

		// Notify on successful compile (uncomment for notifications).
		.pipe(notify("Compiled: <%= file.relative %>"))

		// Inject changes via browsersync.
		.pipe(browsersync.reload({
			stream: true
		}));

});

/**
 * Minify javascript files.
 *
 * https://www.npmjs.com/package/gulp-uglify
 */
gulp.task('scripts', function () {

	gulp.src(paths.scripts)

		// Notify on error.
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))

		// Cache files to avoid processing files that haven't changed.
		.pipe(cache('scripts'))

		// Add .min suffix.
		.pipe(rename({
			suffix: '.min'
		}))

		// Minify.
		.pipe(uglify())

		// Output the processed js to this directory.
		.pipe(gulp.dest('assets/scripts/min'))

		// Inject changes via browsersync.
		.pipe(browsersync.reload({
			stream: true
		}))

		// Notify on successful compile.
		.pipe(notify("Minified: <%= file.relative %>"));

});

/**
 * Optimize images.
 *
 * https://www.npmjs.com/package/gulp-imagemin
 */
gulp.task('images', function () {

	return gulp.src(paths.images)

		// Notify on error.
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))

		// Cache files to avoid processing files that haven't changed.
		.pipe(cache('images'))

		// Optimize images.
		.pipe(imagemin({
			progressive: true
		}))

		// Output the optimized images to this directory.
		.pipe(gulp.dest('assets/images'))

		// Inject changes via browsersync.
		.pipe(browsersync.reload({
			stream: true
		}))

		// Notify on successful compile.
		.pipe(notify("Optimized: <%= file.relative %>"));

});

/**
 * Scan the theme and create a POT file.
 *
 * https://www.npmjs.com/package/gulp-wp-pot
 */
gulp.task('i18n', function () {

	return gulp.src(paths.php)

		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))

		.pipe(sort())

		.pipe(wpPot({
			domain: 'business-pro-theme',
			destFile: 'business-pro.pot',
			package: 'Business Pro',
			bugReport: 'https://seothemes.com/support',
			lastTranslator: 'Lee Anthony <help@seothemes.com>',
			team: 'Seo Themes <help@seothemes.com>'
		}))

		.pipe(gulp.dest('./languages/'));

});

/**
 * Package theme.
 *
 * https://www.npmjs.com/package/gulp-zip
 */
gulp.task('zip', function () {

	gulp.src(['./**/*', '!./node_modules/', '!./node_modules/**', '!./aws.json'])
		.pipe(zip(__dirname.split("/").pop() + '.zip'))
		.pipe(gulp.dest('../'));

});

/**
 * Process tasks and reload browsers on file changes.
 *
 * https://www.npmjs.com/package/browser-sync
 */
gulp.task('watch', function () {

	// HTTPS.
	/*
	browsersync({
		proxy: 'http://foxelectronics.loco',
		port: 8000,
		notify: false,
		open: false,
		https: {
			"key": "/Users/seothemes/.valet/Certificates/business.dev.key",
			"cert": "/Users/seothemes/.valet/Certificates/business.dev.crt"
		}
	});
	*/

	/**
	 * Non-HTTPS browsersync.
	 *
	 * Use this instead if you are not using a self signed
	 * certificate on your local development environment.
	 */
	 browsersync( {
	     proxy: 'http://foxelectronics.loco'
	 } );

	// Run tasks when files change.
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.images, ['images']);
	gulp.watch(paths.php).on('change', browsersync.reload);

});

/**
 * Create default task.
 */
gulp.task('default', ['watch'], function () {
	gulp.start('styles', 'scripts', 'images');
});
