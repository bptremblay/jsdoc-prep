ENV["RAILS_ENV"] ||= 'test'
ENV["TEAM_OWNER"] = 'Galileo'
ENV['REPO'] = 'galileo-basic-image-editor'
ENV['CI_RUN_ID'] = 'galileo-basic-image-editor'
ENV['TEST_ENV'] = ENV['SERVICES_ENV']

require 'auth-platform-factory'
require 'galileo-test-factories'
require 'galileo-test-objects'
require 'galileo-test/request'
require 'galileo-test/application_configs'
require 'fileutils'
require 'uuidtools'

QeSetup.new

$page_objects = Galileo::Test::PageObjects.page_objects
$button_objects = Galileo::Test::PageObjects.page_objects["button_editor"]

env_info = Galileo::Test::Services.services.image_ssl
discovered_application_id = Galileo::Test::Utilities::ApplicationId.new(env: ENV['SERVICES_ENV'], app_config_name: ENV['APP_CONFIG']).value
$app_config = { 'application_id' => discovered_application_id }
$template_url = "#{env_info}/galileo/templates/GalileoDevelopment/BlankTemplate_con.html"
$template_name = "Blank Template"

RSpec.configure do |c|

  #Reset internet explorer after every set of specs
  c.after :all do |test|
    if Capybara.current_session.driver.browser.browser == :internet_explorer
      Capybara.current_session.driver.quit unless ENV['DONT_RESTART_IE']
    end
  end
end

Capybara.configure do |config|
  config.app_host = Galileo::Test::Services.services.auth_devportal
  config.default_driver = :selenium
  config.ignore_hidden_elements = false
  config.match = :prefer_exact
end

def application_id
  'a784bdc0-0a2e-489a-9f3b-b35d32a903c6'
end

def auth_platform_internal
  Galileo::Test::Services.services.auth_platform_internal
end
Galileo::Test::PlatformClient.platform_url = auth_platform_internal


AuthPlatformFactory.configure do |c|
  c.platform_url = auth_platform_internal
end

FileUtils.mkdir_p 'tmp'
unless ENV['REGISTER_APP_CONFIGS'] == 'false'
  tmp = File.join Dir.pwd, 'tmp'
  Galileo::Test::ApplicationConfigs.application_configs_manager tmp
end

WebSetup.new

Capybara.default_driver = :selenium
Capybara.app_host = Galileo::Test::Services.services.auth_devportal

if ENV['CAPYBARA_DRIVER']
  Capybara.default_driver = Capybara.javascript_driver = ENV['CAPYBARA_DRIVER'].to_sym
end
