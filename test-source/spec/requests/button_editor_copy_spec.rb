require 'spec_helper'

feature 'Button Editor - Copy', :quality_center_tp_tc => true do

  before :all do
    @ref_app = Galileo::Test::ReferenceApp.new $app_config,
                                sso_token_id: RSpec.configuration.galileo_sso_token,
                                cid_token_id: RSpec.configuration.galileo_cid_token,
                                template_name: $template_name
    @browser = Galileo::Test::Browser.new
    @browser.maximize
  end
  let(:button_editor) { Galileo::Test::ButtonEditor.new $button_objects["selector"] }
  let(:button_layout) { Galileo::Test::EmailRowLayoutEditor.new $page_objects["block_names"]["button_name"] }
  let(:block)         { $page_objects["block_names"]["button_name"] }

  describe 'Button editor' do
    before :all do
      visit @ref_app.url
      @ref_app.ready
    end

    before :each do
      @ref_app.add_block block
      button_editor.activate
    end

    after :each do
      @ref_app.click_away
      button_layout.activate
      button_layout.tools.delete
      Capybara.current_session.instance_variable_set(:@touched, false)
    end

    it "Copy - Link stays the same" do
      link = 'http://www.google.com'
      button_editor.toolbar.link = link
      button_editor.toolbar.done
      button_layout.activate
      button_layout.tools.copy
      button_layout.tools.delete
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      new_button.activate
      expect(new_button.toolbar.link).to eq link
      expect(new_button.link).to eq link
    end

    it "Copy - Font stays the same" do
      font = 'Georgia'
      button_editor.toolbar.font = font
      button_editor.toolbar.done
      button_layout.activate
      button_layout.tools.copy
      button_layout.tools.delete
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      new_button.activate
      expect(new_button.toolbar.font).to eq font
      expect(new_button.font).to include font
    end

    it "Copy - Text color stays the same" do
      chip_color = button_editor.toolbar.select_color_from_grid 5,5
      button_editor.toolbar.done
      button_layout.activate
      button_layout.tools.copy
      button_layout.tools.delete
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      text_color = Galileo::Test::Utilities::Color.rgb_to_hex(new_button.color)
      expect(text_color).to eq chip_color
    end

    it "Copy - Text size stays the same" do
      size = 14
      button_editor.toolbar.font_size = size
      button_editor.toolbar.done
      button_layout.activate
      button_layout.tools.copy
      button_layout.tools.delete
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      new_button.activate
      expect(new_button.toolbar.font_size).to eq size
      expect(new_button.font_size).to eq size
    end

    it "Copy - Background color stays the same" do
      chip_color = button_editor.toolbar.select_background_color_from_grid 3,4
      button_editor.toolbar.done
      button_layout.activate
      button_layout.tools.copy
      button_layout.tools.delete
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      background_color = Galileo::Test::Utilities::Color.rgb_to_hex(new_button.background_color)
      expect(background_color).to eq chip_color
    end

    it "Copy - Alignment stays the same" do
      button_editor.toolbar.alignment = 'right'
      button_editor.toolbar.done
      button_layout.activate
      button_layout.tools.copy
      button_layout.tools.delete
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      new_button.activate
      expect(new_button.toolbar.alignment).to eq 'right'
      expect(new_button.alignment).to eq 'right'
    end

  end

end
