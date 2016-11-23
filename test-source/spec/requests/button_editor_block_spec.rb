require 'spec_helper'

feature 'Button Editor - Add/Delete Block', :quality_center_tp_tc => true do

  before :all do
    Capybara.default_wait_time = 3
    @ref_app = Galileo::Test::ReferenceApp.new $app_config,
                                sso_token_id: RSpec.configuration.galileo_sso_token,
                                cid_token_id: RSpec.configuration.galileo_cid_token,
                                template_name: $template_name
    @browser = Galileo::Test::Browser.new
    @browser.maximize
  end
  let(:button_editor)   { Galileo::Test::ButtonEditor.new $button_objects["selector"] }
  let(:button_layout)   { Galileo::Test::EmailRowLayoutEditor.new $page_objects["block_names"]["button_name"] }
  let(:document_editor) { Galileo::Test::EmailDocumentEditor.new }
  let(:block)           { $page_objects["block_names"]["button_name"] }

  describe 'Add/Delete button block' do
    before :all do
      visit @ref_app.url
      @ref_app.ready
    end

    after :each do
      Capybara.current_session.instance_variable_set(:@touched, false)
    end

    it 'Click to add button block' do
      @ref_app.add_block block
      expect(document_editor.layout_present?(block)).to eq true
    end

    it 'Delete button block' do
      button_layout.activate
      expect(button_layout.tools.visible?).to eq true
      button_layout.tools.delete
      expect(document_editor.layout_present?(block)).to eq false
    end

  end

end
