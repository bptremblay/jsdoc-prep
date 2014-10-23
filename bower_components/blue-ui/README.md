# Blue UI

Blue UI is a collection of re-usable views/partials. This repo is a stand alone BlueJS app that provides documentation for all of the reusable views/partials

## Prerequisites

- http://confluence-digital.jpmchase.net/display/LJF/Blue.js+Developer+Environment+Setup
- minimum NPM version 1.4.3
- GULP and Bower versions documented in the project package.json file
- Globally installed Node/NPM, Gulp and Bower libraries

*NOTE*
While the proxy urls may change, this npm config for proxy/registry/https settings worked for me with npm@1.5.0-alpha-2
https_proxy = "http://proxy.dmz.bankone.net:8080"
proxy = "http://proxy.dmz.bankone.net:8080/"
registry = "http://registry.npmjs.org/"
strict-ssl = false

## How to include in your app

To include Blue UI in your app, edit your bower.json file and add one more dependency

##### bower.json

```js
...
"dependencies": {
	...
	"blue-ui" : "https://stash-digital.jpmchase.net/scm/jf/blue-ui.git#develop"
	...
},
...
```

and also update your index.html file with one more path

##### src/index.html

```html
<script charset="utf-8" type="text/javascript">
	require = {
		baseUrl : '/',
		paths   : {
			'appname' : 'appname/js',
			'blue-ui' : 'blue-ui/dist/blue-ui/js'
		}
	};
	appRoutes = ['appname'];
</script>
});
```

## Documentation

Add to appRoutes 'blue-ui', build your application, and after building go to [Blue UI Docs](http://localhost:9000/#blue-ui)


# DEV ONLY

## Setup your ~/.profile or ~/.bash_profile with the following
[Proxies](http://confluence-digital.jpmchase.net/display/LJF/Blue.js+Developer+Environment+Setup)

## Setup and update

```sh
npm run app-update
```

## Build and run in one

```sh
npm run start
```

After building and running, you can now see the [documentation](http://localhost:9000)

## Build and run separately
```sh
gulp clean;
gulp dist-clean --app=blue-ui
gulp server
```

## For CSS development
```sh
gulp watch --app=blue-ui
```

# TROUBLESHOOTING

If app-update fails, try the following steps:

```sh
npm cache clean
```

If app-update fails again, try the following:

```sh
npm cache clean
rm -rf bower_components/ node_modules/
```

