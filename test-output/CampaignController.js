/**
 * @module CampaignController
 * @requires services/CampaignService
 * @description :: Server-side logic for associate/manager campaign data.
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var CampaignService = require('services/CampaignService');
module.exports = {
  /**
   * Get my campaign.
   * @param req  
   * @param res  
   * @param next
   */
  getMyCampaign: function (req, res, next) {
    var userId = req.param('userId');
    CampaignService.getMyCampaign(userId).then(function (result) {
      res.json(result);
    }, function (reason) {
      res.serverError({
        msg: reason
      });
    });
  },
  /**
   * Get my leaderboard.
   * @param req  
   * @param res  
   * @param next
   */
  getMyLeaderboard: function (req, res, next) {
    var userId = req.param('userId');
    CampaignService.getMyLeaderboard(userId).then(function (result) {
      res.json(result);
    }, function (reason) {
      res.serverError({
        msg: reason
      });
    });
  },
  /**
   * Get my campaign banner.
   * @param req  
   * @param res  
   * @param next
   */
  getMyCampaignBanner: function (req, res, next) {
    var userId = req.param('userId');
    CampaignService.getMyCampaignBanner(userId).then(function (result) {
      res.json(result);
    }, function (reason) {
      res.serverError({
        msg: reason
      });
    });
  }
};