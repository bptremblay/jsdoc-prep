#!/usr/bin/ruby

require 'rubygems'
require 'json' # prior to 1.9.2, json is distributed as a gem
require 'uri'

scripts_dir = File.expand_path('..', __FILE__)
load "#{scripts_dir}/lib/site_packaging.rb"

files = 'dist/blue-ui'
RPM_Maker.new.failure { "no files found to package in #{files}" } if Dir["#{files}/*"].empty?

package_info = JSON.parse(IO.read(File.join(@project_root, 'package.json')))
RPM_Maker.new.failure { 'no homepage specified in package.json' } unless package_info['homepage']
RPM_Maker.new.failure { 'no version specified in package.json' } unless package_info['version']

name = URI.parse(package_info['homepage']).host
version = package_info['version']

@logger.info(@script_name) { "packaging #{name} v#{version}" }

data = RPM_Maker.new({
  :name => name,
  :rpmname => "digital-site-#{name}-data",
  :description => "website files for #{name}",
  :version => version,
  :release => @build_number,
  :user => 'apache',
  :group => 'seurat',
  :directories => ["/data/#{name}"],
  :rpm_destination => "#{@project_root}/x86_64",
  :logger => @logger,
})
data.add_files({"#{@project_root}/#{files}/*" => "/data/#{name}"})
data.manage_directory("/data/#{name}")
data.create!

conf = RPM_Maker.new({
  :name => name,
  :rpmname => "digital-site-#{name}-conf",
  :description => "name virtual host definition for #{name}",
  :dependencies => ['digital-apache'],
  :version => version,
  :release => @build_number,
  :user => 'apache',
  :group => 'seurat',
  :directories => ["/apps"],
  :rpm_destination => "#{@project_root}/x86_64",
  :logger => @logger,
})
contents = "
<VirtualHost *:80>
  DocumentRoot /data/#{name}
  ServerName #{name}
</VirtualHost>
"
conf.create_file("/apps/apache/conf/sites.d/#{name}.conf", contents)
conf.create!
