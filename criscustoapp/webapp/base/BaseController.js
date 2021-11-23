/*global history */
sap.ui.define(
    [
      "sap/m/MessageBox",
      "sap/ui/core/mvc/Controller",
      "sap/ui/core/routing/History",
      "sap/ui/model/json/JSONModel",
      "com/criscusto/criscustoapp/utils/formatter"
    ],
    function (MessageBox, Controller, History, JSONModel, formatter) {
      "use strict";
  
      /**
       * Base object from which all other controllerss inherit
       * @exports com/criscusto/criscustoapp/base/BaseController
       */
      return Controller.extend(
        "com.criscusto.criscustoapp.base.BaseController",
        {
          /**
           * Shared app formatter
           * @type {com.criscusto.criscustoapp.utils.formatter}
           */
          formatter: formatter,
  
          /* =========================================================== */
          /* public methods					                                     */
          /* =========================================================== */
  
          /**
           * Convenience method for accessing the router in every controller of the application.
           * @public
           * @returns {sap.ui.core.routing.Router} the router for this component
           */
          getRouter: function () {
            return this.getOwnerComponent().getRouter();
          },
  
          /**
           * Convenience method for accessing elements on the view by Id.
           * @public
           * @param {String} Id of the element
           * @returns {Object} the element matching the Id
           */
          byId: function (sId) {
            return this.getView().byId(sId);
          },
  
          /**
           * Convenience method for getting the view model by name in every controller of the application.
           * @public
           * @param {string} sName the model name
           * @returns {sap.ui.model.Model} the model instance
           */
          getModel: function (sName) {
            return this.getView().getModel(sName);
          },
  
          /**
           * Convenience method for setting the view model in every controller of the application.
           * @public
           * @param {sap.ui.model.Model} oModel the model instance
           * @param {string} sName the model name
           * @returns {sap.ui.mvc.View} the view instance
           */
          setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
          },
  
          /**
           * Convenience method for getting the resource bundle.
           * @public
           * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
           */
          getResourceBundle: function () {
            return this.getOwnerComponent()
              .getModel("i18n")
              .getResourceBundle();
          },
  
          /**
           * Convenience method for getting a resource bundle text.
           * @public
           * @param {String} id of text to retrieve
           * @param {Array} Optional array of values to insert on the text
           * @returns {String} the required text
           */
          getResourceBundleText: function (sId, aValue) {
            return this.getOwnerComponent()
              .getModel("i18n")
              .getResourceBundle().getText(sId, aValue);
          },
  
          /**
           * Formatter instance
           * @public
           * @return {com.criscusto.criscustoapp.utils.formatter} App formatter
           */
          getFormatter: function () {
            return this.formatter;
          },
  
          /**
           * Do a hardcoded navigation, no parameters needed.
           * @public
           * @param  {string} sRouteName Route name defined in 'manifest.json'
           * @param  {object} oParams It depends how route is defined in 'manifest.json' file
           * @return {undefined}
           */
          doNavTo: function (sRouteName, oParams) {
            if (oParams) {
              this.getRouter().navTo(sRouteName, oParams);
            } else {
              this.getRouter().navTo(sRouteName);
            }
          },
  
          /**
           * Display the selected target without changing the hash
           * @public
           * @param  {string} sTargetNameFrom From target name
           * @param  {string} sTargetNameTo Destination target name
           * @param  {object} oParams     Additional data to pass
           * @return {undefined}
           */
          doNavToBasedOnTarget: function (
            sTargetNameFrom,
            sTargetNameTo,
            oParams
          ) {
            var oDataNavigations = {
              from: sTargetNameFrom,
              data: oParams
            };
  
            this.getRouter()
              .getTargets()
              .display(sTargetNameTo, oDataNavigations);
          },
  
          /**
           * Switch on busy indicator in app screens
           * @public
           * @return {undefined}
           */
          switchOnBusy: function () {
            var oAppViewModel = this.getOwnerComponent().getModel("appView");
            oAppViewModel.setProperty("/busy", true);
          },
  
          /**
           * Switch off busy indicator in app screens
           * @public
           * @return {undefined}
           */
          switchOffBusy: function () {
            var oAppViewModel = this.getOwnerComponent().getModel("appView");
            oAppViewModel.setProperty("/busy", false);
          },
  
          /**
           * Method to show messages to users.
           * Next, values considered to "sType":
           * 	- "S" -> Success
           * 	- "W" -> Warning
           * 	- "E" -> Error
           *
           * @public
           * @param  {object|string} i18nText Text&parameters key
           * @param  {string} sType Type of alert to be shown.
           * @param  {function} fnCloseHandler Close handler
           * @return {undefined}
           */
          alert: function (i18nText, sType, fnCloseHandler) {
            var bCompact = Boolean(
              this.getView()
                .$()
                .closest(".sapUiSizeCompact").length
            ),
              sStyleClass = bCompact ? "sapUiSizeCompact" : "";
  
            var sText = "";
            if (typeof i18nText === "string") {
              sText = this.getResourceBundle().getText(i18nText);
            } else {
              var sPattern = this.getResourceBundle().getText(i18nText.pattern);
              sText = jQuery.sap.formatMessage(sPattern, i18nText.params);
            }
  
            fnCloseHandler = fnCloseHandler || function () { };
  
            switch (sType) {
              case "S":
                MessageBox.success(sText, {
                  styleClass: sStyleClass,
                  onClose: fnCloseHandler.bind(this)
                });
                break;
              case "W":
                MessageBox.warning(sText, {
                  styleClass: sStyleClass,
                  onClose: fnCloseHandler.bind(this)
                });
                break;
              case "E":
                MessageBox.error(sText, {
                  styleClass: sStyleClass,
                  onClose: fnCloseHandler.bind(this)
                });
                break;
              default:
                MessageBox.warning(sText, {
                  styleClass: sStyleClass,
                  onClose: fnCloseHandler.bind(this)
                });
            }
          },
  
          /**
           * Helper function for paginating tables
           * @public
           * @param  {string}            sModelName The model name
           * @param  {integer|string}    isRelIndex  Relative index from the current position to move to
           * @return {undefined}
           */
          tablePagePass: function (sModelName, isRelIndex) {
            var oData = this.getModel(sModelName).getData();
  
            // We save any possible changes into the data property
            var iMaxOverwrite = Math.min(
              oData.currentIndex + oData.growingThreshold,
              oData.data.length
            );
            oData.data = Array.prototype.concat(
              oData.data.slice(0, oData.currentIndex),
              oData.currentData,
              oData.data.slice(iMaxOverwrite, oData.data.length)
            );
  
            if (typeof isRelIndex === "string") {
              switch (isRelIndex) {
                case "pageUp":
                  isRelIndex = -Math.min(
                    this.getModel(sModelName).getProperty("/growingThreshold"),
                    this.getModel(sModelName).getProperty("/currentIndex")
                  );
                  break;
                case "begin":
                  isRelIndex = -this.getModel(sModelName).getProperty(
                    "/currentIndex"
                  );
                  break;
                case "pageDown":
                  isRelIndex = Math.min(
                    this.getModel(sModelName).getProperty("/growingThreshold"),
                    this.getModel(sModelName).getProperty("/data/length") -
                    this.getModel(sModelName).getProperty("/currentIndex") -
                    this.getModel(sModelName).getProperty("/growingThreshold")
                  );
                  break;
                case "end":
                  isRelIndex =
                    this.getModel(sModelName).getProperty("/data/length") -
                    this.getModel(sModelName).getProperty("/currentIndex") -
                    this.getModel(sModelName).getProperty("/growingThreshold");
                  break;
                default:
                  isRelIndex = 0;
              }
            }
  
            oData.currentIndex += isRelIndex;
  
            oData.currentData = oData.data.slice(
              oData.currentIndex,
              oData.currentIndex + oData.growingThreshold
            );
  
            this.getModel(sModelName).setData(oData);
          },
  
          /**
           * Helper function for changing the row number manually
           * @public
           * @param  {sap.ui.base.Event} oEvent The change event
           * @param  {string}            sModelName The table model name
           * @return {undefined}
           */
          onTypeTableCurrentIndex: function (oEvent, sModelName) {
            var sValue = oEvent.getParameter("value");
            var sFormerValue =
              this.getModel(sModelName).getProperty("/currentIndex") + 1;
            if (!sValue.match(/\D/g)) {
              var iValue = Number(sValue);
              if (iValue < 1) {
                iValue = 1;
              } else if (
                iValue >
                1 +
                this.getModel(sModelName).getProperty("/data/length") -
                this.getModel(sModelName).getProperty("/growingThreshold")
              ) {
                iValue =
                  1 +
                  this.getModel(sModelName).getProperty("/data/length") -
                  this.getModel(sModelName).getProperty("/growingThreshold");
              }
              oEvent.getSource().setValue(iValue);
              this.tablePagePass(
                sModelName,
                iValue -
                1 -
                this.getModel(sModelName).getProperty("/currentIndex")
              );
              this.getModel(sModelName).setProperty("/currentIndex", iValue - 1);
            } else {
              oEvent.getSource().setValue(sFormerValue);
            }
          },
  
          /**
           * Helper function for retrieving fragments
           * @public
           * @param  {string} sProperty     The property in which the control will be stored and retrieved
           * @param  {string} sFragmentName The fragment name (optional after the first call)
           * @return {sap.ui.core.Control}  The control insided the fragment
           */
          getFragment: function (sProperty, sFragmentName) {
            if (!this[sProperty]) {
              this[sProperty] = sap.ui.xmlfragment(sFragmentName, this);
              this.getView().addDependent(this[sProperty]);
            }
  
            return this[sProperty];
          },
  
          /* =========================================================== */
          /* event handlers                                              */
          /* =========================================================== */
  
          /**
           * Event handler for navigating back.
           * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
           * If not, it will replace the current entry of the browser history with the master route.
           * @public
           * @return {undefined}
           */
          onNavBack: function () {
            var oHistory = History.getInstance(),
              sPreviousHash = oHistory.getPreviousHash();
  
            if (sPreviousHash !== undefined) {
              history.go(-1);
            } else {
              this.doNavTo("main");
            }
          },
  
          /**
           * Event handler for navigating back.
           * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
           * If not, it will replace the current entry of the browser history with the master route.
           * @public
           * @return {undefined}
           */
          onNavBackTarget: function () {
            if (this._sFromTargetName) {
              this.doNavToBasedOnTarget(null, this._sFromTargetName);
            } else {
              this.doNavTo("main");
            }
          },
  
          /**
           * Check if parameter is a valid phone number
           * @param  {string} sPhoneNumber User phone number
           * @return {boolean} true, if it is valid. false, in any other case.
           */
          isValidPhoneNumber: function (sPhoneNumber) {
            var sPhoneNumberNorm = sPhoneNumber
              .replace("+", "")
              .replace(/\s/g, "");
            return /^[0-9()-]+$/.test(sPhoneNumberNorm);
          },
          /**
           * Standard function to display ajax call error
           * @param  {object} oReject Object with error description
           * @return {undefined}      Nothing to return
           */
          standardAjaxErrorDisplay: function (oReject) {
            //Check if there are any message with the error
            if (
              oReject &&
              oReject.error &&
              oReject.error.responseJSON &&
              oReject.error.responseJSON.message
            ) {
              this.alert(oReject.error.responseJSON.message, "E");
            } else {
              this.alert("serverError", "E");
            }
          }
        }
      );
    }
  );
  