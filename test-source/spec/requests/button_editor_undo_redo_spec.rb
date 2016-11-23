require 'spec_helper'

feature 'Button Editor - Undo/Redo', :quality_center_tp_tc => true do

  before :all do
    @ref_app = Galileo::Test::ReferenceApp.new $app_config,
                                sso_token_id: RSpec.configuration.galileo_sso_token,
                                cid_token_id: RSpec.configuration.galileo_cid_token,
                                template_name: $template_name
    @browser = Galileo::Test::Browser.new
    @browser.maximize
  end
  let(:button)        { Galileo::Test::ButtonEditor.new $button_objects["selector"] }
  let(:button_layout) { Galileo::Test::EmailRowLayoutEditor.new $page_objects["block_names"]["button_name"] }
  let(:block)         { $page_objects["block_names"]["button_name"] }

  before :all do
    visit @ref_app.url
    @ref_app.ready
  end

  before :each do
    @ref_app.add_block block
    button.activate
  end

  after :each do
    @ref_app.click_away
    button_layout.activate
    button_layout.tools.delete
    Capybara.current_session.instance_variable_set(:@touched, false)
  end

  describe 'Undo/Redo - Button' do
    it "Undo/Redo - button background color" do
      original_color = Galileo::Test::Utilities::Color.rgb_to_hex(button.background_color)
      button.toolbar.select_background_color_from_grid 2,2
      new_color = Galileo::Test::Utilities::Color.rgb_to_hex(button.background_color)
      @ref_app.undo
      expect(Galileo::Test::Utilities::Color.rgb_to_hex(button.background_color)).to eq original_color
      @ref_app.redo
      expect(Galileo::Test::Utilities::Color.rgb_to_hex(button.background_color)).to eq new_color
    end

    it "Undo/Redo - button justification" do
      button.toolbar.alignment = 'right'
      button.toolbar.alignment = 'left'
      @ref_app.undo
      expect(button.alignment).to eq 'right'
      expect(button.toolbar.alignment).to eq 'right'
      @ref_app.redo
      expect(button.alignment).to eq 'left'
      expect(button.toolbar.alignment).to eq 'left'
    end

  end

  describe 'Undo/Redo - Button text' do
    it 'Undo/Redo - button text content' do
      button.text = 'some new button text'
      sleep 2
      @ref_app.undo
      expect(button.text).to eq 'Visit our website'
      @ref_app.redo
      expect(button.text).to eq 'some new button text'
    end

    it 'Undo/Redo - change text font to Georgia' do
      original_font = button.toolbar.font
      font = 'Georgia'
      button.toolbar.font = font
      @ref_app.undo
      expect(button.toolbar.font).to eq original_font
      expect(button.font).to include(original_font)
      @ref_app.redo
      expect(button.toolbar.font).to eq font
      expect(button.font).to include(font)
    end

    it 'Undo/Redo - change text size to 20px via text input' do
      original_size = button.toolbar.font_size
      size = 20
      button.toolbar.font_size = size
      @ref_app.undo
      expect(button.font_size).to eq original_size
      expect(button.toolbar.font_size).to eq original_size
      @ref_app.redo
      expect(button.font_size).to eq size
      expect(button.toolbar.font_size).to eq size
    end

    it 'Undo/Redo - increase text size by 1px' do
      original_font_size = button.font_size
      button.toolbar.increase_font
      @ref_app.undo
      expect(button.font_size).to eq original_font_size
      @ref_app.redo
      expect(button.font_size).to eq (original_font_size + 1)
    end

    it 'Undo/Redo - decrease text size by 2px' do
      original_font_size = button.font_size
      button.toolbar.decrease_font
      button.toolbar.decrease_font
      @ref_app.undo
      expect(button.font_size).to eq (original_font_size - 1)
      @ref_app.undo
      expect(button.font_size).to eq (original_font_size)
      @ref_app.redo
      expect(button.font_size).to eq (original_font_size - 1)
      @ref_app.redo
      expect(button.font_size).to eq (original_font_size - 2)
    end

    it 'Undo/Redo - button text color' do
      original_color = Galileo::Test::Utilities::Color.rgb_to_hex(button.color)
      button.toolbar.select_background_color_from_grid 2,3
      new_color = Galileo::Test::Utilities::Color.rgb_to_hex(button.color)
      @ref_app.undo
      expect(Galileo::Test::Utilities::Color.rgb_to_hex(button.color)).to eq original_color
      @ref_app.redo
      expect(Galileo::Test::Utilities::Color.rgb_to_hex(button.color)).to eq new_color
    end
  end

  describe 'Undo/Redo - Button link' do
    it 'Undo/Redo - add email link to button' do
      link = 'someone@constantcontact.com'
      button.toolbar.link = link
      button.toolbar.done
      @ref_app.undo
      expect(button.link).to eq nil
      expect(button.toolbar.link).to eq ""
      @ref_app.redo
      expect(button.link).to eq "mailto:#{link}"
      expect(button.toolbar.link).to eq "mailto:#{link}"
    end

    it 'Undo/Redo - add http link to button' do
      link = 'google.com'
      button.toolbar.link = link
      button.toolbar.done
      @ref_app.undo
      expect(button.link).to eq nil
      expect(button.toolbar.link).to eq ""
      @ref_app.redo
      expect(button.link).to eq "http://#{link}"
      expect(button.toolbar.link).to eq "http://#{link}"
    end
  end

end
