module.exports = {
	has: {
		'cookies': true,
		'dom': true,
		'host-browser': true,
		'native-navigator': true,
		'xhr': true
	},
	logLevel: 1,
	'paths': {
		'blue': 'empty:',
		'components': 'empty:',
		'stately': 'empty:',
		'handlebars': 'empty:'
	},
	modules: [{
		name: 'lab-component/main',
		exclude: [
			// "blue"
		],
		include: [
			'lab-component/config',
			'lab-component/main',
			'lab-component/settings'
			//'lab-component/controller/index',
			//'lab-component/component/contactForm',
			//'lab-component/spec/contactForm',
			//'lab-component/view/index',
			//'lab-component/view/webspec/contactForm'
		]
	}]
};
