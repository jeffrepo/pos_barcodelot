odoo.define('pos_barcodelot.ProductScreen', function(require) {
    'use strict';


    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');
    const { useState, useContext } = owl.hooks;
    const models = require('point_of_sale.models');
    const pos_db = require('point_of_sale.DB');
    const rpc = require('web.rpc');


    const PosBarcodelotProductScreen = ProductScreen =>
        class extends ProductScreen {

          async _barcodeProductAction(code) {
              console.log('hola inherit')
              console.log(code)
              var lote  = String(code.base_code).substring(11, 18)
              code.base_code = String(code.base_code).substring(0, 11);
              let product = this.env.pos.db.get_product_by_barcode(code.base_code);

              if (!product) {
                  // find the barcode in the backend
                  let foundProductIds = [];
                  try {
                      foundProductIds = await this.rpc({
                          model: 'product.product',
                          method: 'search',
                          args: [[['barcode', '=', code.base_code]]],
                          context: this.env.session.user_context,
                      });
                  } catch (error) {
                      if (isConnectionError(error)) {
                          return this.showPopup('OfflineErrorPopup', {
                              title: this.env._t('Network Error'),
                              body: this.env._t("Product is not loaded. Tried loading the product from the server but there is a network error."),
                          });
                      } else {
                          throw error;
                      }
                  }
                  if (foundProductIds.length) {
                      await this.env.pos._addProducts(foundProductIds);
                      // assume that the result is unique.
                      product = this.env.pos.db.get_product_by_id(foundProductIds[0]);
                  } else {
                      console.log('error')
                      return this._barcodeErrorAction(code);
                  }
              }
              const options = {'quantity':1,'draftPackLotLines':   {'newPackLotLines': [{'lot_name': lote}]}}

              // const options = await this._getAddProductOptions(product, code);
              // Do not proceed on adding the product when no options is returned.
              // This is consistent with _clickProduct.
              if (!options) return;

              // update the options depending on the type of the scanned code
              if (code.type === 'price') {
                  Object.assign(options, {
                      price: code.value,
                      extras: {
                          price_manually_set: true,
                      },
                  });
              } else if (code.type === 'weight') {
                  Object.assign(options, {
                      quantity: code.value,
                      merge: false,
                  });
              } else if (code.type === 'discount') {
                  Object.assign(options, {
                      discount: code.value,
                      merge: false,
                  });
              }
              this.currentOrder.add_product(product,  options)
          }

        };

    Registries.Component.extend(ProductScreen, PosBarcodelotProductScreen);

    return PosBarcodelotProductScreen;


});
