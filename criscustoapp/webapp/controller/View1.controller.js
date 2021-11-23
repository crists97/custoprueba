sap.ui.define([
	"com/criscusto/criscustoapp/base/BaseController",
	"com/criscusto/criscustoapp/services/ApiFacade",'sap/m/MessageToast'
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController,ApiFacade,MessageToast) {
		"use strict";

		return BaseController.extend("com.criscusto.criscustoapp.controller.View1", {
			onInit: function () {
                ApiFacade.getInstance().getDataCusto()
                .then(function (oData) {
                    MessageToast.show("THERE ARE ->  " +
                        oData.length + " <- CUSTOMER");
                });
			}
		});
	});
