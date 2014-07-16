/**
 * index.js.
 *
 * @copyright JPMorgan Chase & Co. All rights reserved.
 */
define(
  /**
   * index.js.
   *
   * @exports index
   * @copyright JPMorgan Chase & Co. All rights reserved.
   * @requires jquery
   */
  function(require) {

    /**
     * Index view.
     *
     * @constructor
     */
    function IndexView() {
      require('dashboard/service/dataTransform').call(this);
      require('dashboard/service/languageMapper').call(this);
      require('dashboard/service/statusCodeMapper').call(this);

      //set up essential view settings
      var settings = require('dashboard/settings');
      var template = require('blue/template');

      //render the default view
      this.template = require('dashboard/template/index');

      template.registerPartial('megaMenu', require('dashboard/template/megaMenu'));
      template.registerPartial('modalPopup', require('dashboard/template/modalPopup'));
      template.registerPartial('notifications', require('dashboard/template/notifications'));
      template.registerPartial('notificationDropDown', require('dashboard/template/notificationDropDown'));
      template.registerPartial('activity', require('dashboard/template/activity'));
      template.registerPartial('pendingList', require('dashboard/template/pendingList'));
      template.registerPartial('postedList', require('dashboard/template/postedList'));
      template.registerPartial('activityHeader', require('dashboard/template/activityHeader'));
      template.registerPartial('topMenu', require('dashboard/template/topMenu'));
      template.registerPartial('myInfo', require('dashboard/template/myInfo'));
      template.registerPartial('payBills', require('dashboard/template/payBills'));
      template.registerPartial('paymentComplete', require('dashboard/template/paymentComplete'));
      template.registerPartial('sendMoney', require('dashboard/template/sendMoney'));
      template.registerPartial('transferMoney', require('dashboard/template/transferMoney'));
      template.registerPartial('paymentMenu', require('dashboard/template/paymentMenu'));
      template.registerPartial('search', require('dashboard/template/search'));
      template.registerPartial('footer', require('dashboard/template/footer'));
      template.registerPartial('DDASummary', require('dashboard/template/DDASummary'));
      template.registerPartial('cardSummary', require('dashboard/template/cardSummary'));


      template.registerHelper('summaryItems', function(context, options) {
        if (!context.componentIdx) return;
        var cidx = context.componentIdx;
        var ret = "";

        for (var i = 0, j = cidx.length; i < j; i++) {
          ret = ret + options.fn(context[cidx[i]]);
        }

        return ret;
      });


      /** Init. */
      this.init = function() {

        this.preLoader();

        this.changeStyle();

        this.eventManager = {
          click: {
            '.main-nav a': function(e) {
              var href = e.attr('href');
              if (e.attr('target') === '_self') {
                this.send('contentSubSection/show', href);
              }

              switch (href) {
                case '#dashboard':
                  this.send('topMenuComponent/everydayLivingClick');
                  break;

                case '#investments':
                  this.send('topMenuComponent/investmentsClick');
                  break;

                case '#goals':
                  this.send('topMenuComponent/goalsClick');
                  break;

                default:
                  window.open(href, e.attr('target'));
              }
            },
            '#logo-group': function() { //TODO: UPDATE USING DOM UTILS
              $('body').toggleClass('hidden-menu');
            },
            '#atm-pref': function(e) { // TODO: DISPLAYING ATM PREFERENCE POPUP
              var name = e.closest('li').data('name');
              $('body').removeClass('hidden-menu');
              this.showModalPopup(settings.POPUP_URL[name], name);
            },
            '#message-center': function(e) { // TODO: DISPLAYING ATM PREFERENCE POPUP
              var name = e.closest('li').data('name');
              $('body').removeClass('hidden-menu');
              this.showModalPopup(settings.POPUP_URL[name], name);
            },
            '.mortgage-payoff': function(e) {
              var accountTab = e.closest('.account-summary-tab'),
                modalUrl = settings.POPUP_URL[name] + accountTab.data('accid');
              this.showModalPopup(modalUrl, name);
            },
            '#close-modal': function() { // TODO: HIDE ATM PREFERENCE POPUP
              this.hideOverlay();
            },
            '#profileLink': function() { //TODO: UPDATE USING DOM UTILS
              $('#profileDropdown').toggleClass('dropdown open');
            },
            'a.action': function(e) {
              this.send(e.data('action'));
            },
            'span#notif-counter, div#notif': function() {
              var notIfFlag = $('span#notif-counter span');
              this.send('myNotificationsComponent/enableNotification', {
                'enableNotification': !(notIfFlag.data('enableNotification') || false)
              });
            },
            '.account-summary-tab': function(e) {
              var accountTab = e.closest('.account-summary-tab');
              var requestedAccountId = accountTab.data('accid');
              var activeAccountId = this.$('.account-summary-tab.active').data('accid');

              if (accountTab.data('linkTo')) {
                window.open(accountTab.data('linkTo'));
                this.send('summaryInstance/setActiveAccount', {
                  // this.send('summaryInstance/accountsDataLoaded', {
                  activeAccountId: activeAccountId,
                  requestedAccountId: requestedAccountId
                });
              } else if (accountTab.data('accid')) {
                this.state(
                  settings.summaryActivityUrlPrefix + '/' +
                  requestedAccountId + '/' +
                  activeAccountId
                );
              }
            },
            '#payBill': function() {
              this.send('payBillsComponent/enablePayBill', {
                'enabled': !($('.pay-bills--holder').data('enabled') || false)
              });
              this.send('sendMoneyComponent/enableSendMoney', {
                'enabled': false
              });
              this.send('transferMoneyComponent/enableTransferMoney', {
                'enabled': false
              });
            },
            '#sendMoney': function() {
              this.send('sendMoneyComponent/enableSendMoney', {
                'enabled': !($('.send-money--holder').data('enabled') || false)
              });
              this.send('payBillsComponent/enablePayBill', {
                'enabled': false
              });
              this.send('transferMoneyComponent/enableTransferMoney', {
                'enabled': false
              });
            },
            '#transferMoney': function() {
              this.send('transferMoneyComponent/enableTransferMoney', {
                'enabled': !($('.transfer-money--holder').data('enabled') || false)
              });
              this.send('payBillsComponent/enablePayBill', {
                'enabled': false
              });
              this.send('sendMoneyComponent/enableSendMoney', {
                'enabled': false
              });
            },
            'span.notif-remove': function(e) {
              this.send('myNotificationsComponent/updateNotificationList', {
                'i': e.data('i')
              });
            },
            'section#search-actions': function(e) {
              this.send(e.data('action'), {
                'enabled': !($('#pay-bills').data('enabled') || false)
              });
            },
            '#myProfile': function() {
              this.send('myInfoComponent/myProfile');
            },
            '#logOut': function() {
              this.send('myInfoComponent/logOut');
            },
            '#search-bar-container': function() {
              this.send('searchComponent/showSearchOptions');
              $('#search-bar').focus(); //TODO: Should be done using framework
            },
            //TODO fix event conflict with focusout
            '#search-bar-suggest .list-group-item': function(e) {
              this.send('searchComponent/triggerComponent', e.attr('ref'));
            },
            'li.paybill-option': function(e) {
              var paybilOption = e.parent().parent(),
                initiateSelect = paybilOption.parent().parent().find('span.initial');
              initiateSelect.text(paybilOption.data('value'));
              $('.wrapper-dropdown').removeClass('active');
            },
            '#payIt': function() {
              var date = new Date(),
                today = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear(),
                data = {
                  'type': 'card',
                  'from': $('.pay-from').text(),
                  'to': $('.pay-to').text(),
                  'amount': $('.pay-amount').val(),
                  'date': $('#senddate').val() ? $('#senddate').val() : today
                };

              this.send('payBillsComponent/payIt', data);
            },
            '.paybill-field': function(e) {
              $('.wrapper-dropdown').removeClass('active');
              e.parent().addClass('active');
            },
            '.pay-bills--content': function() {
              $('.wrapper-dropdown').removeClass('active');
            }
          },
          focusout: {
            '#search-bar-suggest': function() {
              this.send('searchComponent/hideSearchOptions');
            }
          },
          keyup: {
            '#search-bar': function($input, event) {
              var k = String.fromCharCode(event.keyCode);

              if (k.match(/^[a-zA-Z0-9 ]+$/)) {
                this.send('searchComponent/search', $input.val());
              }
            },
            '#search-activity': function($input, event) {
              var key = event.keyCode || event.which,
                searchTxt = $('#search-activity').val();
              if (key === 13 || searchTxt.length === 0) {
                this.send('searchActivityComponent/search', searchTxt);
              }
              return false;
            }
          }
        };


        this.receive('searchComponent/focusOnSearchField', function(e) {
          $('#search-bar').focus();

          if (e && e.hasOwnProperty('lastSearchedkey')) {
            $('#search-bar').val(e.lastSearchedkey);
          }
        });

        // this.receive('searchActivity/SearchActivity/search', function() {
        //     var searchText = this.model.get().searchActivity.searchText;
        //     this.searchTable('.activity', searchText);
        // });


        this.receive('myNotificationsComponent/enableShowMore', function() {
          $('#notif-dropdown ul')
            .css('margin-bottom', '')
            .css('max-height', '190px');

        });


        this.receive('myNotificationsComponent/disableShowMore', function() {
          $('#notif-dropdown p').remove();
          $('#notif-dropdown ul').css({
            'margin-bottom': '0px',
            'max-height': ''
          });
          $('#notif-dropdown').css('padding-bottom', '0px');

        });


        setTimeout(function() {
          $('.profile-greeting').fadeOut(400);
          $('.profile-notif').fadeIn(400);
          $('#notif-counter').css('visibility', 'visible');
          this.model.lens('profileLoaded').set(true);
        }.bind(this), 4000);
      };


      /**
       * Show modal popup.
       * @param url
       * @param name
       */
      this.showModalPopup = function(url, name) {
        var popup = $('.modal-popup'),
          popupHeight = popup.height(),
          popupWidth = popup.width(),
          minWidth = this.getAccountsMessage('POPUP_WIDTH')[name];
        //this.$('.popup-title').html(name);
        this.$('#modal-content').html('<iframe style="display:none;" id="modal-iframe" src="' + url + '" width="100%" height="' + popupHeight + '"></iframe>');
        this.showOverlay();;


        setTimeout(function() {

          $('#modal-iframe').load(function() {
            $('#modal-iframe').css({
              'min-width': minWidth,
              'max-width': popupWidth + 'px',
              'display': 'block'
            });
            $("#pre-loader").hide();
          });
        }, 1000);
      };


      /** Show overlay. */
      this.showOverlay = function() {
        $('.overlay, .modal-popup, #pre-loader').fadeIn(300);
      };


      /** Hide overlay. */
      this.hideOverlay = function() {
        $('.modal-popup, .overlay, #pre-loader').fadeOut(300);
        $('#modal-content').empty();
      };


      /** Pre loader. */
      this.preLoader = function() {

        $(document).ajaxStart(function() {
          $('.overlay, #pre-loader').show();
        });


        $(document).ajaxStop(function() {
          $('.overlay, #pre-loader').fadeOut(400);
          $(document).scrollTop(0);
        });
      };


      /** Change style. */
      this.changeStyle = function() {
        $("#style1").attr("href", settings.smartAdminStyle1);
        $("#style2").attr("href", settings.smartAdminStyle2);
      };

      /** On data change. */
      this.onDataChange = function() {
        this.rerender();
      };

    };
    return IndexView;
  });