/**
 * clipboard_class.js
 *
 * @author Mike Ng <mng@wayfair.com>
 * @copyright 2013 Wayfair, LLC - All rights reserved
 */
define(
  'clipboard_class', ['wayfair', 'jquery', 'logger'],
  /**
   * Clipboard class handles all the clipboard logic.
   *
   * @exports clipboard_class
   * @author Mike Ng <mng@wayfair.com>
   * @copyright 2013 Wayfair, LLC - All rights reserved
   * @requires wayfair
   * @requires jquery
   * @requires logger
   */

  function(wf, $, Logger) {
    'use strict';
    Logger.fine('Loaded Module \'clipboard_class\'.');
    var ajaxRoot = '/session/public/ajax/clipbar/',
      createBoardUrl = ajaxRoot + 'create_board.php',
      addBoardProductUrl = ajaxRoot + 'add_prod_to_board.php',
      deleteBoardProductUrl = ajaxRoot + 'remove_prod_from_board.php',
      getBoardProductsUrl = ajaxRoot + 'get_board.php',
      actOnBoardUrl = ajaxRoot + 'act_on_board.php',
      editBoardUrl = ajaxRoot + 'edit_board.php',
      batchAddBoardProductUrl = ajaxRoot + 'batch_add_prod_to_board.php';
    /**
     * Constructor for the Clipboard class.
     *
     * @constructor
     * @alias module:clipboard_class~Clipboard
     * @param boardData data containing the boardId, boardName and optionally
     */

    function Clipboard(boardData) {
      Logger.fine('Clipboard constructor.');
      this.id = boardData.boardId;
      this.name = boardData.boardName;
      this.description = boardData.boardDescription;
      this.configuration_order_id = boardData.configurationOrderId;
      if (boardData.eventId) {
        this.eventId = boardData.eventId;
      }
      // this is an associative array of products using their boardProductIds
      // as keys it is by default uninitialized because we use this for
      // the hasProducts() check
      this.products = null;
      // this is just an array of all the products. We use this to preserve
      // the order in which products are added
      this.orderedProducts = [];
    }
    /**
     * Load the products from the back end.
     *
     * @param successCallback
     * @param errorCallback
     */
    Clipboard.prototype.loadProducts = function(successCallback, errorCallback) {
      Logger.trace('Clipboard.loadProducts()');
      var self = this;
      $.ajax({
        type: 'GET',
        url: getBoardProductsUrl,
        dataType: 'json',
        data: {
          'boardId': self.id
        },
        success: function(result) {
          if (result.success) {
            // add products to the product list
            var products = result.board.products;
            self.products = mapProductsToDictionary(products);
            self.orderedProducts = products;
            // pass the products to the callback
            if (successCallback) {
              successCallback(result);
            }
          } else {
            if (errorCallback) {
              errorCallback(result);
            }
          }
        },
        error: function() {
          Logger.info('Clipboard.loadProducts() AJAX error');
        }
      });
    };

    /**
     * Setter for the products property.
     *
     * @param products the products to store in this board.
     */
    Clipboard.prototype.setProducts = function(products) {

      if (window.JSON != null) {
        Logger.trace('Clipboard.setProducts(' + window.JSON.stringify(products) + ')');
      }
      this.products = mapProductsToDictionary(products);
      this.orderedProducts = products;
    };

    /** Add the given product to the product list */
    Clipboard.prototype.addProduct = function(product, successCallback,
      errorCallback) {

      if (window.JSON != null) {
        Logger.trace('Clipboard.addProduct(' + window.JSON.stringify(product) + ')');
      }
      var self = this,
        result = {};
      if (product) {
        // have to pass the id of the board to the product
        product.boardId = this.id;

        // make AJAX call to add to backend
        $.ajax({
          type: 'POST',
          url: addBoardProductUrl,
          data: product,
          dataType: 'json',
          success: function(result) {
            if (result.success) {
              var boardProduct = result.boardProduct;

              // make sure the product list is initialize
              if (!self.hasProducts()) {
                // if not then initialize it
                self.products = [];
              }

              // add the product the this board's list
              self.products[boardProduct.id] = boardProduct;

              // add to the orderedProducts list as well
              self.orderedProducts.push(boardProduct);

              // execute callback
              if (successCallback) {
                successCallback(result);
              }

              // don't bother with success or error callbacks, just ignore if it fails
              self.saveProductConfiguration(boardProduct);

            } else {
              if (errorCallback) {
                errorCallback(result);
              }
            }
          },
          error: function(msg) {
            var result = {
              'msg': msg
            };
            if (errorCallback) {
              errorCallback(result);
            }
          }
        });
      } else {
        result.msg = wf.translate('InvalidProduct', 'Not a valid product.');
        if (errorCallback) {
          errorCallback(result);
        }
      }
    };

    /**
     * Saves the product configuration by calling add_item.php with the form
     * data If the save fails, it just ignores it. This isn't ideal, but
     * saves duplicating add-to-cart logic. Once we get a better
     * representation for configured skus, this should be updated.
     *
     * @param {Object} boardProduct The product that was added to teh board,
     *          must have an id field
     * @param {Function} successCallback Function to call if ajax call to
     *          save sku is successful
     * @param {Function} errorCallback Function to call if ajax call to save
     *          sku fails
     */
    Clipboard.prototype.saveProductConfiguration = function(boardProduct, successCallback, errorCallback) {

      if (window.JSON != null) {
        Logger.trace('Clipboard.saveProductConfiguration(' + window.JSON.stringify(boardProduct) + ')');
      }
      var form = null;
      if ($('#PopupAddToCartForm').length > 0) {
        // if a quickview form is showing, use it
        form = $('#PopupAddToCartForm');
      } else if ($('#AddToCartForm').length > 0) {
        // otherwise use the add to cart form
        form = $('#AddToCartForm');
      }

      // form won't be defined if added from superbrowse

      if (form != null && form.length > 0) {
        var formData = [];
        // Add add-to-cart type, and board product ID
        formData.push({
          name: 'atc_type',
          value: 'board_configuration'
        }, {
          name: 'board_product_id',
          value: boardProduct.id
        });
        // We need to create an array for options, i.e. form element with name
        // = PiID.
        // Ideally they would already have name PiID[] instead of PiID. Then
        // we wouldn't have to do this iteration, oh well...
        $.each(form.serializeArray(), function(index, element) {
          if (element.name === 'PiID') {
            formData.push({
              name: 'PiID[]',
              value: element.value
            });
          } else {
            formData.push(element);
          }
        });
        $.ajax({
          type: 'POST',
          url: wf.constants.STORE_URL + '/session/public/add_item.php',
          data: formData,
          dataType: 'json'
        }).done(function(result) {
          if (successCallback) {
            successCallback(result);
          }
        }).fail(function(msg) {
          var result = {
            'msg': msg
          };
          if (errorCallback) {
            errorCallback(result);
          }
        });
      }
    };
    /**
     * Batch add products to product list.
     *
     * @param products Products to add to the list.
     * @param successCallback Invoked if call was successful.
     * @param errorCallback Invoked if call was not successful.
     */
    Clipboard.prototype.batchAddProducts = function(products, successCallback, errorCallback) {

      if (window.JSON != null) {
        Logger.trace('Clipboard.batchAddProducts(' + window.JSON.stringify(products) + ')');
      }
      if (products) {
        // have to pass the id of the board to the product
        products.board_id = this.id;

        $.ajax({
          type: 'POST',
          url: batchAddBoardProductUrl,
          data: products,
          dataType: 'json'
        }).done(function(result) {
          if (result.success) {
            // execute callback
            if (successCallback) {
              successCallback(result);
            }
          } else {
            if (errorCallback) {
              errorCallback(result);
            }
          }
        }).fail(function(msg) {
          var result = {
            'msg': msg
          };

          if (errorCallback) {
            errorCallback(result);
          }
        });
      } else {
        var result = {};
        result.msg = wf.translate('InvalidProduct', 'Not a valid product.');

        if (errorCallback) {
          errorCallback(result);
        }
      }
    };

    /**
     * Delete the product with the given sku from the product list.
     *
     * @param product the product to remove.
     * @param successCallback
     * @param errorCallback
     */
    Clipboard.prototype.removeProduct = function(product, successCallback, errorCallback) {

      if (product.boardProductId == null || product.boardProductId === '') {
        // get boardproductid
        product.boardProductId = this.getBoardProductIdOfSku(product.sku);
        Logger
          .trace('Clipboard.removeProduct needed to find the boardProductId.');
      }

      if (window.JSON != null) {
        Logger.trace('Clipboard.removeProduct(' + window.JSON.stringify(product) + ')');
      }
      var self = this;
      if (product) {
        // have to pass the id of the board to the product
        product.boardId = this.id;
        $.ajax({
          type: 'POST',
          url: deleteBoardProductUrl,
          data: product,
          dataType: 'json',
          success: function(result) {
            if (result.success) {
              Logger.trace('Clipboard.removeProduct() SUCCESS');
              // remove from the board
              var boardProductId = result.boardProductId;
              var products = self.orderedProducts;
              var numProducts = self.getNumProducts();
              delete self.products[boardProductId];
              // remove from the orderedProducts list as well
              var tempProducts = [];
              for (var i = 0; i < numProducts; i++) {
                var tempProduct = products[i];
                if (parseInt(tempProduct.id, 10) !== parseInt(boardProductId,
                  10)) {
                  tempProducts.push(tempProduct);
                } else {
                  Logger.trace('Clipboard.removeProduct() deleted product ' + boardProductId + '.');
                }
              }
              self.orderedProducts = tempProducts;
              // once last product is deleted off clipbar, hide the "see
              // all" button
              if (numProducts === 1) {
                $('#see_all_btn').addClass('hidden-node');
              }
              // pass the result to the callback
              if (successCallback) {
                successCallback(result, product);
              }
            } else {
              if (errorCallback) {
                errorCallback(result, product);
              }
            }
          },
          error: function(msg) {
            if (errorCallback) {
              errorCallback(msg, product);
            }
          }
        });
      }
    };
    /**
     * Returns true if this clipboard has the given product sku.
     *
     * @param {String} productSku The sku of the product to check for.
     * @return {Boolean}
     */
    Clipboard.prototype.hasProduct = function(productSku) {
      var match = false;
      var numProducts = this.orderedProducts.length;
      for (var i = 0; i < numProducts; i++) {
        var product = this.orderedProducts[i];
        if (product.sku === productSku) {
          return true;
        }
      }
      return match;
    };
    /**
     * Returns true if products have been loaded
     *
     * @return {Boolean}
     */
    Clipboard.prototype.hasProducts = function() {
      return this.products !== undefined && this.products !== null;
    };
    /**
     * Returns the number of products in this board
     *
     * @return {Number}
     */
    Clipboard.prototype.getNumProducts = function() {
      return this.orderedProducts.length;
    };
    /**
     * Returns the board product id of the given sku
     *
     * @param sku Sku to find matching board product id
     * @return {Number}
     */
    Clipboard.prototype.getBoardProductIdOfSku = function(sku) {
      var numProducts = this.orderedProducts.length;
      for (var i = 0; i < numProducts; i++) {
        var product = this.orderedProducts[i];
        if (product.sku === sku) {
          return product.id;
        }
      }
      Logger.trace('Clipboard.getBoardProductIdOfSku(' + sku + ') failed to find an id.');
      return null;
    };
    /**
     * Create/edit the board with the new properties.
     *
     * @param successCallback
     * @param errorCallback
     */
    Clipboard.prototype.saveChanges = function(successCallback, errorCallback) {
      Logger.trace('Clipboard.saveChanges().');
      var self = this,
        postData = {
          'boardId': self.id,
          'boardName': self.name,
          'boardDescription': self.description
        };
      // check if there is a event id assigned to the board
      if (self.eventId) {
        postData.eventId = self.eventId;
      }
      // check whether we are creating a new board or saving an existing one
      if (!this.id) {
        $.ajax({
          type: 'POST',
          url: createBoardUrl,
          data: postData,
          dataType: 'json',
          success: function(result) {
            if (result && result.success) {
              // save the new id
              self.id = result.board.id;
              // execute callback
              successCallback(result);
            } else {
              errorCallback(result);
            }
          },
          error: function(msg) {
            errorCallback(msg);
          }
        });
      } else {
        $.ajax({
          type: 'POST',
          url: editBoardUrl,
          data: postData,
          dataType: 'json',
          success: function(result) {
            if (result && result.success) {
              successCallback(result);
            } else {
              errorCallback(result);
            }
          },
          error: function(msg) {
            errorCallback(msg);
          }
        });
      }
    };
    /**
     * Act on the board.
     *
     * @param actionData
     * @param successCallback(result).
     * @param errorCallback(result, msg).
     */
    Clipboard.prototype.takeAction = function(actionData, successCallback, errorCallback) {
      Logger.trace('Clipboard.takeAction().');
      var postData = {
        'board_name': actionData.board_name,
        'board_product_ids': actionData.board_product_ids,
        'action': actionData.action,
        'board_id': actionData.board_id,
        'event_id': actionData.event_id
      };
      $.ajax({
        type: 'POST',
        url: actOnBoardUrl,
        data: postData,
        dataType: 'json',
        success: function(result) {
          if (result && result.success) {
            if (successCallback) {
              successCallback(result);
            }
          } else {
            if (errorCallback) {
              errorCallback(result);
            }
          }
        },
        error: function(msg) {
          if (errorCallback) {
            errorCallback('', msg);
          }
        }
      });
    };
    // ////////////////////////////////////////
    // //////// UTILITY FUNCTIONS /////////////
    // ////////////////////////////////////////
    /**
     * Map the give list of products to a dictionary for easier retrieval.
     *
     * @param products the list of products to map.
     */

    function mapProductsToDictionary(products) {
      Logger.trace('Clipboard.mapProductsToDictionary().');
      var productsDictionary = {};
      if (products) {
        var numProducts = products.length;
        // loop through product list and map each one using the id as key
        for (var i = 0; i < numProducts; i++) {
          var product = products[i];
          productsDictionary[product.id] = product;
        }
      }
      return productsDictionary;
    }
    $.Clipboard = Clipboard;
    return Clipboard;
  });
