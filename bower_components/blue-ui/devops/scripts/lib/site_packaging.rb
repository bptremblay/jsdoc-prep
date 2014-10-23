# This snippet is designed to be loaded by a site packaging script:
#     load "path/to/lib/site_packaging.rb"
#
# It does the following:
# 1. Performs common preliminary checks
# 2. Initializes the following instance variables:
#     @build_number
#     @logger
#     @project_root
#     @script_name

require 'rubygems'
require 'logger'
require 'env_checker'
require 'rpm_maker'

def usage(msg = '')
  notes = [
    "usage: #{File.basename($0)} <build-number> [<log-level>]",
    "  build-number   A unique number value greater than the previous one",
    "  log-level      In order of verbosity: fatal, error, warn, info, debug. Defaults to error.",
    "",
  ]
  notes << msg unless msg.empty?

  abort(notes.join("\n"))
end

@script_name = File.basename($0, ".rb")

@project_root = File.expand_path('../../../..', __FILE__)

# Test for build number argument
usage('Please supply a build number. In bamboo you can use ${bamboo.buildNumber}') if ARGV.empty?
@build_number = ARGV[0]

# Instantiate logger
@logger = Logger.new(STDERR)
log_level = ARGV[1] || 'error'
@logger.level = Logger.const_get(log_level.upcase)
@logger.formatter = proc { |severity, datetime, progname, msg| "#{"%-5s" % severity} [#{progname}] #{msg}\n" }

# Test that environment has required tools for building and packaging
checker = EnvChecker.new
checker.ensure({
  :bin => [
    'node',
    'npm',
  ],
})
unless checker.ok?
  @logger.fatal(@script_name) { checker.issues.join("\n") }
  abort("Script aborted. Please resolve the issues above.")
end
