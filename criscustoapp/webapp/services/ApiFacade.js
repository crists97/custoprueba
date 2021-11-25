sap.ui.define(
    [
      "sap/ui/model/json/JSONModel",
      "com/criscusto/criscustoapp/services/ConfigHelper",
      "com/criscusto/criscustoapp/services/AjaxCaller",
      "com/criscusto/criscustoapp/utils/formatter",
      "com/criscusto/criscustoapp/base/BaseObject"
    ],
    function (JSONModel, ConfigHelper, AjaxCaller, formatter, BaseObject) {
      "use strict";
  
      var oInstance;
      /**
       * Module for managing the calls of the controllers to the backend server
       * (input/output mapping, methods...)
       * @exports com/criscusto/criscustoapp/services/ApiFacade
       */
      var classSingleton = BaseObject.extend(
        "com.criscusto.criscustoapp.services.ApiFacade",
        {
          /**
           * Shared app formatter
           * @type {com.criscusto.criscustoapp.utils.formatter}
           */
          formatter: formatter,
  
          constructor: function () {
            //Call super constructor
            BaseObject.call(this);
          },
  
          /**
           * Method to obtain the product data from its serial number
           * @public
           * @param  {string}  sProductId The product id
           * @return {Promise}            The call promise
           */
          getProductData: function (sProductId) {
            var oUserDataInfo = ConfigHelper.getInstance().getCallData("productData", "GetProductData", sProductId);
            return AjaxCaller.getInstance()
              .requestAjax(oUserDataInfo.method, oUserDataInfo.url)
              .then(function (oData) {
                return oData;
              });
          },

          getDataCusto: function (sProductId) {
            var oUserDataInfo = ConfigHelper.getInstance().getCallData("custopruebaData", "GetcustopruebaData", sProductId);
            return AjaxCaller.getInstance()
              .requestAjax(oUserDataInfo.method, oUserDataInfo.url)
              .then(function (oData) {
                return oData.value;
              });
          },

          getUserInfo: function () {
            var oUserDataInfo = ConfigHelper.getInstance().getCallData("UserInfo", "getUserInfo");
            return AjaxCaller.getInstance()
              .requestAjax(oUserDataInfo.method, oUserDataInfo.url)
              .then(function (oData) {
                return oData;
              });
          }
        }
      );
  
      return {
        /**
         * Method to retrieve single instance for class
         * @public
         * @return {com.criscusto.criscustoapp.services.ApiFacade} The APIFacade instance
         */
        getInstance: function () {
          if (!oInstance) {
            oInstance = new classSingleton();
          }
          return oInstance;
        }
      };
    }
  );
  