require 'spec_helper'

feature 'Button Editor - Persistence', :quality_center_tp_tc => true do

  before :all do
    Capybara.default_wait_time = 3
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

  describe 'Persistence - Button' do
    it "Persistence- button background color" do
      chip_color = button.toolbar.select_background_color_from_grid 5,4
      doc_id = @ref_app.save
      @ref_app.open_document doc_id
      @ref_app.ready
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      background_color = Galileo::Test::Utilities::Color.rgb_to_hex(new_button.background_color)
      expect(background_color).to eq chip_color
    end

    it "Persistence - button justification" do
      button.toolbar.alignment = 'right'
      doc_id = @ref_app.save
      @ref_app.open_document doc_id
      @ref_app.ready
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      expect(new_button.alignment).to eq 'right'
      expect(new_button.toolbar.alignment).to eq 'right'
    end
  end

  describe 'Persistence - Button text' do
    it 'Persistence - button text content' do
      button.text = 'some new button text'
      sleep 2
      doc_id = @ref_app.save
      @ref_app.open_document doc_id
      @ref_app.ready
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      expect(new_button.text).to eq 'some new button text'
    end

    it 'Persistence - change text font to Georgia' do
      font = 'Georgia'
      button.toolbar.font = font
      doc_id = @ref_app.save
      @ref_app.open_document doc_id
      @ref_app.ready
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      new_button.activate
      expect(new_button.toolbar.font).to eq font
      expect(new_button.font).to include(font)
    end

    it 'Persistence - change text size to 20px via text input' do
      size = 14
      button.toolbar.font_size = size
      doc_id = @ref_app.save
      @ref_app.open_document doc_id
      @ref_app.ready
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      expect(new_button.font_size).to eq size
      expect(new_button.toolbar.font_size).to eq size
    end

    it 'Persistence - increase text size by 1px' do
      original_font_size = 14
      button.toolbar.increase_font
      doc_id = @ref_app.save
      @ref_app.open_document doc_id
      @ref_app.ready
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      new_button.activate
      expect(new_button.toolbar.font_size).to eq (original_font_size + 1)
      expect(new_button.font_size).to eq (original_font_size + 1)
    end

    it 'Persistence - decrease text size by 2px' do
      original_font_size = 14
      button.toolbar.decrease_font
      button.toolbar.decrease_font
      doc_id = @ref_app.save
      @ref_app.open_document doc_id
      @ref_app.ready
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      new_button.activate
      expect(new_button.toolbar.font_size).to eq (original_font_size - 2)
      expect(new_button.font_size).to eq (original_font_size - 2)
    end

    it 'Persistence - button text color' do
      chip_color = button.toolbar.select_color_from_grid 4,5
      doc_id = @ref_app.save
      @ref_app.open_document doc_id
      @ref_app.ready
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      text_color = Galileo::Test::Utilities::Color.rgb_to_hex(new_button.color)
      expect(text_color).to eq chip_color
    end
  end

  describe 'Persistence - Button link' do
    it 'Persistence - add email link to button' do
      link = 'someone@constantcontact.com'
      button.toolbar.link = link
      button.toolbar.done
      doc_id = @ref_app.save
      @ref_app.open_document doc_id
      @ref_app.ready
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      expect(new_button.link).to eq "mailto:#{link}"
      expect(new_button.toolbar.link).to eq "mailto:#{link}"
    end

    it 'Persistence - add http link to button' do
      link = 'google.com'
      button.toolbar.link = link
      button.toolbar.done
      doc_id = @ref_app.save
      @ref_app.open_document doc_id
      @ref_app.ready
      new_button = Galileo::Test::ButtonEditor.new $button_objects["selector"]
      expect(new_button.link).to eq "http://#{link}"
      expect(new_button.toolbar.link).to eq "http://#{link}"
    end
  end

  after :all do
    @ref_app.cleanup
  end

end
