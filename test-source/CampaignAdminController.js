/**
 * @module CampaignAdminController
 * @requires services/CampaignService
 * @description :: Server-side logic for campaign administration.
 * @help :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var CampaignService = require('services/CampaignService');
module.exports = {
  /**
   * Get all non-expired campaigns where state is “CREATED” or “IN_PROGRESS”.
   * @param req  
   * @param res  
   * @param next
   */
  getCampaigns : function(req, res, next) {
    CampaignService.getCampaigns().then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Get campaign.
   * @param req  
   * @param res  
   * @param next
   */
  getCampaign : function(req, res, next) {
    var campaignId = req.param('campaignId');
    CampaignService.getCampaign(campaignId).then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Get roles.
   * @param req  
   * @param res  
   * @param next
   */
  getRoles : function(req, res, next) {
    CampaignService.getRoles().then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Upload image.
   * @param req  
   * @param res  
   * @param next
   */
  uploadImage : function(req, res, next) {
    CampaignService.uploadImage().then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Create campaign. Response: An empty campaign structure.
   * @param req  
   * @param res  
   * @param next
   */
  createCampaign : function(req, res, next) {
    CampaignService.createCampaign().then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Get sites.
   * @param req  
   * @param res  
   * @param next
   */
  getSites : function(req, res, next) {
    var role = req.param('role');
    CampaignService.getSites(role).then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Get teams by site.
   * @param req  
   * @param res  
   * @param next
   */
  getTeamsBySite : function(req, res, next) {
    var site = req.param('site');
    CampaignService.getTeamsBySite(site).then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Get team members.
   * @param req  
   * @param res  
   * @param next
   */
  getTeamMembers : function(req, res, next) {
    var team = req.param('team');
    CampaignService.getTeamMembers(team).then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Edit campaign participants.
   * @param req  
   * @param res  
   * @param next
   */
  editCampaignParticipants : function(req, res, next) {
    var role = role.param('role');
    var team = req.param('team');
    var blackList = req.param('blackList');
    CampaignService.editCampaignParticipants(role, team, blackList).then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Get campaign types. Could be hard-coded to return the 2 types.
   * @param req  
   * @param res  
   * @param next
   */
  getCampaignTypes : function(req, res, next) {
    var userId = req.param('userId');
    CampaignService.getCampaignTypes(userId).then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Get metrics. Response: list all KINDS of metrics for menu.
   * @param req  
   * @param res  
   * @param next
   */
  getMetrics : function(req, res, next) {
    CampaignService.getMetrics().then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Set goal.
   * @param req  
   * @param res  
   * @param next
   */
  setGoal : function(req, res, next) {
    var metric = role.param('metric');
    var value = req.param('value');
    CampaignService.setGoal(metric, value).then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Set ticket to play.
   * @param req  
   * @param res  
   * @param next
   */
  setTicketToPlay : function(req, res, next) {
    var metric = role.param('metric');
    var value = req.param('value');
    CampaignService.setTicketToPlay(metric, value).then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  },
  /**
   * Update campaign.
   * @param req  
   * @param res  
   * @param next
   */
  updateCampaign : function(req, res, next) {
    var campaignID = role.param('campaignID');
    var campaignData = req.param('campaignData');
    CampaignService.updateCampaign(campaignID, campaignData).then(function(result) {
      res.json(result);
    }, function(reason) {
      res.serverError({
        msg : reason
      });
    });
  }
};