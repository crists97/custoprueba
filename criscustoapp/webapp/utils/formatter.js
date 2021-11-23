sap.ui.define([], function() {
    "use strict";
  
    /**
     * Module for formatting the data from the models to the UI
     * @exports com/criscusto/criscustoapp/app/utils/formatter
     */
    return {
      /**
       * Get number state by amount
       * @param  {int} iDays number of days worked
       * @return {string} color status
       */
      formatDays: function(iDays) {
        var sState = "None";
        if (iDays > 200 && iDays < 301) {
          sState = "Warning";
        } else if (iDays > 300) {
          sState = "Error";
        }
        return sState;
      },
  
      /**
       * Get status color code
       * @param  {string} sStatusId Status ID
       * @return {string} color code
       */
      formatStatus: function(sStatusId) {
        var sColor = "";
        if (sStatusId === "OFD") {
          sColor = "#d90000";
        } else if (sStatusId === "REI") {
          sColor = "#ffc900";
        } else if (sStatusId === "OTE") {
          sColor = "#8319a8";
        } else if (sStatusId === "EXC") {
          sColor = "#c0c0c0";
        } else if (sStatusId === "BAJ") {
          sColor = "#0081ff";
        } else {
          sColor = "#0bb233";
        }
        return sColor;
      }
    };
  });
  