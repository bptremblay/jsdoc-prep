require 'spec_helper'

feature 'Button Editor', :quality_center_tp_tc => true do

  before :all do
    @ref_app = Galileo::Test::ReferenceApp.new $app_config,
                                sso_token_id: RSpec.configuration.galileo_sso_token,
                                cid_token_id: RSpec.configuration.galileo_cid_token,
                                template_name: $template_name
    @browser = Galileo::Test::Browser.new
    @browser.maximize
  end
  #let(:text_editor)   { Galileo::Test::AlohaTextEditor.new $page_objects["text_editor"]["pre_header_selector"] }
  let(:button)        { Galileo::Test::ButtonEditor.new $button_objects["selector"] }
  let(:button_layout) { Galileo::Test::EmailRowLayoutEditor.new $page_objects["block_names"]["button_name"] }
  let(:block)         { $page_objects["block_names"]["button_name"] }

  def click_color_chip
    color_chip = page.find :css, '[data-js="color-preview-area"]'

    color_chip.click
  end

  def click_arrow
    arrow = page.find :css, '[data-js="color-dropdown"] .icon-caret-open-down'

    arrow.click
  end

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

  describe 'button editor' do
    it 'should be active' do
      expect(button.active?).to be_true
    end

    it 'should load button toolbar' do
      expect(button.toolbar.visible).to be_true
    end

    it 'change button background color' do
      chip_color = button.toolbar.select_background_color_from_grid 6,5
      background_color = Galileo::Test::Utilities::Color.rgb_to_hex(button.background_color)
      expect(background_color).to eq(chip_color)
    end

    it 'should be able to change text font to Georgia' do
      font = 'Georgia'
      button.toolbar.font = font
      expect(button.toolbar.font).to eq font
      expect(button.font).to include(font)
    end

    it 'should be able to change text size to 20px via text input' do
      size = 20
      button.toolbar.font_size = size
      expect(button.font_size).to eq size
      expect(button.toolbar.font_size).to eq size
    end

    it 'should be able to increase text size by 1px' do
      font_size = button.font_size
      button.toolbar.increase_font
      expect(button.toolbar.font_size).to eq (font_size + 1)
      expect(button.font_size).to eq (font_size + 1)
    end

    it 'should be able to decrease text size by 2px' do
      font_size = button.font_size
      button.toolbar.decrease_font
      button.toolbar.decrease_font
      expect(button.toolbar.font_size).to eq (font_size - 2)
      expect(button.font_size).to eq (font_size - 2)
    end

    it 'change button text color' do
      chip_color = button.toolbar.select_color_from_grid 7,5
      text_color = Galileo::Test::Utilities::Color.rgb_to_hex(button.color)
      expect(text_color).to eq chip_color
    end

    it 'should be able to change to right button justification' do
      button.toolbar.alignment = 'right'
      expect(button.alignment).to eq 'right'
      expect(button.toolbar.alignment).to eq 'right'
    end

    it 'should be able to add email link to button' do
      link = 'someone@constantcontact.com'
      button.toolbar.link = link
      expect(button.link).to eq "mailto:#{link}"
      expect(button.toolbar.link).to eq "mailto:#{link}"
    end

    it 'should be able to add http link to button' do
      link = 'google.com'
      button.toolbar.link = link
      expect(button.link).to eq "http://#{link}"
      expect(button.toolbar.link).to eq "http://#{link}"
    end

    it 'should allow the button text to be changed' do
      button.text = 'some new button text'
      expect(button.text).to eq 'some new button text'
    end

    # it 'should be able to invoke and dispense font-family drop-down' do
    #  # pending "Waiting for VN5321 for new Font Family Drop-Down Behavior"
    #   button.toolbar.visible.should be_true
    #   expect(button.toolbar.font_dropdown_not_visible?).to be_true
    #   button.toolbar.font_dropdown_toggle.click
    #   expect(button.toolbar.font_dropdown_visible?).to be_true
    #   button.toolbar.font_dropdown_toggle.click
    #   expect(button.toolbar.font_dropdown_not_visible?).to be_true
    #   button.toolbar.done
    # end

    it 'should display new button text font style on toolbar' do
      font = "Georgia"
      button.toolbar.font = font
      expect(button.toolbar.font).to eq font
      expect(button.font).to include(font)
      button.toolbar.done
      button.activate
      expect(button.toolbar.font).to eq font
    end


    describe 'Non-Websafe Font Message' do
      let!(:wait_time) {Capybara.default_wait_time}
      warning_message_box_css = '.galileo-engine-font-warning-message'
      warning_text_css = '[data-qe-id="Msg-ID-text"]'
      warning_close_css = '[data-qe-id="Msg-ID-close"]'
      warning_dont_show_css = '.galileo-engine-no-show-font-warning'
      warning_format = "If your recipient's computer doesn't have %s, a similar font will be used."

      before :each do
        Capybara.default_wait_time = 2
      end

      after :each do
        Capybara.default_wait_time = wait_time
      end

      it 'should open when a non-websafe font is selected' do
        # Place the cursor into a text block.
        # Select a non-web-safe font.
        # Close the message box.

        non_safe_font = "Arial Narrow"
        message_text = warning_format % [non_safe_font]

        button_editor = Galileo::Test::ButtonEditor.new $button_objects["selector"]
        button_editor.activate
        expect(button_editor.toolbar.visible).to be_true
        button_editor.toolbar.font = non_safe_font
        expect(button_editor.toolbar.font).to eq non_safe_font
        message_box = page.find :css, warning_message_box_css, visible: true         # serves as a test that the message box is shown
        expect button_editor.toolbar.visible?.should eq true                         # button editor should still exist
        expect (message_box.find :css, warning_text_css, visible: true).should have_content message_text # Message text should be correct
        message_box.find(:css, warning_close_css).click                              # Close the messagebox
        page.should have_no_selector(:css, warning_message_box_css)
        button_editor.activate                                                       # need to re-open the button editor
        expect(button_editor.toolbar.font).to eq non_safe_font
      end

      it 'should close in 10 seconds' do
        # Place the cursor into a text block.
        # Select a non-web-safe font.
        # Wait 10 sec for the message box to disappear.

        non_safe_font = "Arial Narrow"
        message_text = warning_format % [non_safe_font]

        button_editor = Galileo::Test::ButtonEditor.new $button_objects["selector"]
        button_editor.activate
        expect(button_editor.toolbar.visible).to be_true
        button_editor.toolbar.font = non_safe_font
        expect(button_editor.toolbar.font).to eq non_safe_font
        expect(button_editor.font).to include(non_safe_font)
        message_box = page.find :css, warning_message_box_css, visible: true         # serves as a test that the message box is shown
        expect button_editor.toolbar.visible?.should eq true                         # button editor should still exist
        expect (message_box.find :css, warning_text_css, visible: true).should have_content message_text # Message text should be correct
        sleep(11)                                                                    # enough time for the message to close
        page.should have_no_selector(:css, warning_message_box_css)
        expect button_editor.toolbar.visible?.should eq true                         # Aloha editor should still exist
        expect(button_editor.toolbar.font).to eq non_safe_font                       # make sure it's the non-safe font
      end

      it 'should close when a web safe font is chosen' do
        # Place the cursor into a text block.
        # Select a non-web-safe font.
        # Select a web-safe font when the message box is open.

        non_safe_font = "Arial Narrow"
        message_text = warning_format % [non_safe_font]

        button_editor = Galileo::Test::ButtonEditor.new $button_objects["selector"]
        button_editor.activate
        expect(button_editor.toolbar.visible).to be_true
        button_editor.toolbar.font = non_safe_font
        expect(button_editor.toolbar.font).to eq non_safe_font
        expect(button_editor.font).to include(non_safe_font)
        message_box = page.find :css, warning_message_box_css, visible: true         # serves as a test that the message box is shown
        expect button_editor.toolbar.visible?.should eq true                         # button editor should still exist
        expect (message_box.find :css, warning_text_css, visible: true).should have_content message_text # Message text should be correct

        # choosing a web safe font causes the message to close.
        button_editor.toolbar.font = 'Courier New'
        page.should have_no_selector(:css, warning_message_box_css)
        expect button_editor.toolbar.visible?.should eq true                         # button editor should still exist
      end

      it 'should not appear after clicking got it...' do
        # Select a non-web-safe font.
        # Click the "got it, no need to show this again." link.
        # Select another non-web-safe font.

        non_safe_font = "Arial Narrow"
        message_text = warning_format % [non_safe_font]

        button_editor = Galileo::Test::ButtonEditor.new $button_objects["selector"]
        button_editor.activate
        expect(button_editor.toolbar.visible).to be_true
        button_editor.toolbar.font = non_safe_font
        expect(button_editor.toolbar.font).to eq non_safe_font
        expect(button_editor.font).to include(non_safe_font)
        message_box = page.find :css, warning_message_box_css, visible: true         # serves as a test that the message box is shown
        expect button_editor.toolbar.visible?.should eq true                         # button editor should still exist
        expect (message_box.find :css, warning_text_css, visible: true).should have_content message_text # Message text should be correct

        message_box.find(:css, warning_dont_show_css).click                          # Click on the link to not show the message again
        page.should have_no_selector(:css, warning_message_box_css)

        # check that the message will not appear when setting the font for the button editor.
        button_editor = Galileo::Test::ButtonEditor.new $button_objects["selector"]
        button_editor.activate
        expect(button_editor.toolbar.visible).to be_true
        button_editor.toolbar.font = non_safe_font
        expect(button_editor.toolbar.font).to eq non_safe_font
        expect(button_editor.font).to include(non_safe_font)
        page.should have_no_selector(:css, warning_message_box_css)
      end

    end

    after :all do
      prefix = "accounts/#{RSpec.configuration.galileo_account_id}/document"
      documents = Galileo::Test::PlatformClient.platform_list prefix, "application_config_id=#{application_id}"
      documents.each do |document|
        Galileo::Test::PlatformClient.platform_destroy prefix, document['id']
      end
    end
  end

end
