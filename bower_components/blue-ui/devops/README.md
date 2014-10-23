
# BlueUI devops

Local dev packaging and deploying for [blue-ui][blue-ui]


## Pre-requisites

* 8GB RAM or more
* Vagrant installed (see Install Vagrant: [Mac][install-vagrant-mac] | [Win][install-vagrant-win])
* VirtualBox installed (see [Install VirtualBox][install-virtualbox])
* The _centos-65_ box installed for vagrant.
  * This should install automatically on the first `vagrant up`.
  * If it errors out, you can run `./devops/scripts/get_vagrant_box.rb` instead.


## Debugging the Build script

	vagrant up
	vagrant ssh
	cd /vagrant
	npm install --loglevel silly
	ln -s node_modules/gulp/bin/gulp.js node_modules/gulp/bin/gulp
	export PATH=$PATH:/vagrant/node_modules/gulp/bin
	npm run dist --loglevel silly


## Packaging

This site is packaged as 2 RPMs: data and configuration.

The packaging script calls `npm install` and `npm run dist`,
then packs the contents of the `dist/` folder into the data rpm,
and generates the configuration rpm.

	vagrant up
	vagrant ssh
	/vagrant/devops/scripts/package_chaseui-digital.jpmchase.net.rb <build-number>
	ls -l /vagrant/x86_64


## Staging

Install the RPMs (this will also install apache):

	vagrant up
	vagrant ssh
	sudo yum clean all
	sudo yum --nogpgcheck localinstall /vagrant/x86_64/digital-site-chaseui-digital.jpmchase.net-*

Serve the site:

* bring up the apache service: `sudo service digital-apache start`
* edit your `/etc/hosts` to add an entry for the site: `192.168.150.101  chaseui-digital.jpmchase.net`
* visit [chaseui-digital.jpmchase.net][site] and confirm the site looks as expected


[blue-ui]: https://stash-digital.jpmchase.net/projects/CHAS/repos/blue-ui/browse
[install-vagrant-mac]: http://confluence-digital.jpmchase.net/pages/viewpage.action?pageId=4489316
[install-vagrant-win]: http://confluence-digital.jpmchase.net/pages/viewpage.action?pageId=4489451
[install-virtualbox]: http://confluence-digital.jpmchase.net/display/BP/Install+Virtual+Box
[site]: http://chaseui-digital.jpmchase.net/
