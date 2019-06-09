//	Imports ____________________________________________________________________

const del = require('del');

const gulp = require('gulp');
const sass = require('gulp-sass');
const file2json = require('./plugins/gulp-file2json');
const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript');

//	Variables __________________________________________________________________



//	Initialize _________________________________________________________________



//	Exports ____________________________________________________________________

gulp.task('clean', () => {
	
	return del(['.cache', 'media', 'out']);
	
});

gulp.task('icons:common', () => {
	
	return gulp.src('src/views/icons/**/*.svg')
		.pipe(gulp.dest('media/icons'));
	
});

gulp.task('icons:json', () => {
	
	return gulp.src('src/views/components/icons/**/*.svg')
		.pipe(file2json({
			path: 'icons.ts',
			indent: '\t',
			template: '// tslint:disable\nexport default __CONTENT__;',
		}))
		.pipe(gulp.dest('src/views/components'));
	
});

gulp.task('icons', gulp.series('icons:common', 'icons:json'));

gulp.task('style:common', () => {
	
	return gulp.src('src/views/style.scss')
		.pipe(sass.sync({}).on('error', sass.logError))
		.pipe(gulp.dest('media'));
	
});

gulp.task('style:precompile', () => {
	
	return gulp.src('src/views/components/**/*.scss')
		.pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(gulp.dest('.cache/src/views/components'));
	
});

gulp.task('style:json', () => {
	
	return gulp.src('.cache/src/views/components/**/*.css')
		.pipe(file2json({
			path: 'styles.ts',
			indent: '\t',
			template: '// tslint:disable\nexport default __CONTENT__;',
		}))
		.pipe(gulp.dest('src/views/components'));
	
});

gulp.task('style', gulp.series('style:common', 'style:precompile', 'style:json'));

gulp.task('templates', () => {
	
	return gulp.src('src/views/components/**/!(index).html')
		.pipe(file2json({
			path: 'templates.ts',
			indent: '\t',
			template: '// tslint:disable\nexport default __CONTENT__;',
		}))
		.pipe(gulp.dest('src/views/components'));
	
});

gulp.task('script:view', () => {
	
	return rollup.rollup({
		input: 'src/views/main.ts',
		plugins: [
			typescript({
				target: 'es6',
				lib: [
					'es6',
					'dom',
				],
				strict: true,
				removeComments: true,
				emitDecoratorMetadata: true,
				experimentalDecorators: true,
				
			}),
		]
	}).then(bundle => {
		
		return bundle.write({
			file: './media/main.js',
			format: 'iife',
			name: 'l13diffview',
		});
		
	});
	
});

gulp.task('script:services', () => {
	
	return rollup.rollup({
		input: 'src/extension.ts',
		plugins: [
			typescript({
				target: 'es6',
				lib: [
					'es6',
					'dom',
				],
				strict: true,
				removeComments: true,
			}),
		]
	}).then(bundle => {
		
		return bundle.write({
			file: './out/extension.js',
			format: 'umd',
			name: 'l13diffservices',
		});
		
	});
	
});

gulp.task('script', gulp.series('script:view', 'script:services'));

gulp.task('build', gulp.series('clean', 'icons', 'style', 'templates', 'script'));

gulp.task('watch', () => {
	
	gulp.watch('src/views/**/*.svg', gulp.parallel('icons'));
	
	gulp.watch('src/views/**/*.scss', gulp.parallel('style'));
	
	gulp.watch('src/views/**/*.html', gulp.parallel('templates'));
	
	gulp.watch([
		'src/views/**/*.ts',
		'src/types.ts',
	], gulp.parallel('script:view'));
	
	gulp.watch([
		'src/extension.ts',
		'src/types.ts',
		'src/services/**/*.ts',
		'src/utilities/**/*.ts',
	], gulp.parallel('script:services'));
	
});

//	Functions __________________________________________________________________
