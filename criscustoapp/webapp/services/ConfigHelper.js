sap.ui.define(
    [
        "sap/ui/model/json/JSONModel",
        "com/criscusto/criscustoapp/base/BaseObject"
    ],
    function (JSONModel, BaseObject) {
        "use strict";

        var oInstance;
        /**
         * Module for extracting configuration values from the config.json file
         * @exports com/criscusto/criscustoapp/services/ConfigHelper
         */
        var oClassInstance = BaseObject.extend(
            "com.criscusto.criscustoapp.services.ConfigHelper", {
            /* =========================================================== */
            /* begin: public methods                                       */
            /* =========================================================== */

            /**
             * Method executed on the initialization of the class
             */
            init: function () {
                //Load config from manifest
                this._oConfigData = this.getOwnerComponent()
                    .getMetadata()
                    .getConfig();
            },

            /**
             * Get specific url path and mehod call
             * @public
             * @param {string} sApiPath The API path
             * @param {string} sApiMethod The HTTP Method
             * @param {Array}  aParams Array of parameters to add to the URL
             * @return {object} Get API Method specific context path and http method
             */
            getCallData: function (sApiPath, sApiMethod, aParams) {
                var sCommonPath = "";
                if (!this._oConfigData)
                    this.init()
                sCommonPath = this._oConfigData.urls.path;

                var sContextPath = "";
                sContextPath = this._oConfigData.urls[sApiPath].path;
                if (aParams && aParams.length > 0) {
                    aParams.forEach(function (sParam) {
                        sContextPath = sContextPath.replace("$", sParam);
                    });
                }

                var sMethod = "";
                sMethod = this._oConfigData.urls[sApiPath][sApiMethod].method;
                return {
                    method: sMethod,
                    url: sCommonPath + sContextPath
                };
            },

            /**
             * Get template file base64 string
             * @public
             * @param {string} sTemplateId The template identifier
             * @return {string} The base 64 string
             */
            getTemplateFile: function (sTemplateId) {
                return this._oConfigData.templates[sTemplateId];
            },

            /**
             * Return semantic timeout: short, medium & long
             * @public
             * @param {string} sTimeoutDuration Timeout duration: "short", "medium" & "long"
             * @return {number} semantic timeout: short, medium & long
             */
            getTimeout: function (sTimeoutDuration) {
                return this._oConfigData.timeout[sTimeoutDuration];
            },

            /* =========================================================== */
            /* begin: internal methods                                     */
            /* =========================================================== */

            /**
             * Get common url path and local auth for app
             * @private
             * @return {object} Get common context path and local auth
             */
            _getCommonPath: function () {
                return this._oConfigData.urls.path;
            }
        }
        );

        return {
            /**
             * Method to retrieve single instance for class
             * @public
             * @return {com.xpr.test.app.app.services.ConfigHelper} ConfigHelp singleton instance
             */
            getInstance: function () {
                if (!oInstance) {
                    oInstance = new oClassInstance();
                }
                return oInstance;
            }
        };
    }
);