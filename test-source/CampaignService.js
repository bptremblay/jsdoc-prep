/**
 * @module CampaignService
 * @exports CampaignService
 */
'use strict';
/**
 * @constructor
 */
var CampaignService = {
  /**
   * Get campaigns.
   */
  getCampaigns: function () {},
  /**
   * Get campaign.
   * @param campaignId
   */
  getCampaign: function (campaignId) {},
  /**
   * Get roles.
   */
  getRoles: function () {},
  /**
   * Upload image.
   */
  uploadImage: function () {},
  /**
   * Create campaign.
   * @param req
   * @param res
   * @param next
   */
  createCampaign: function (req, res, next) {},
  /**
   * Get sites.
   * @param role
   */
  getSites: function (role) {},
  /**
   * Get teams by site.
   * @param site
   */
  getTeamsBySite: function (site) {},
  /**
   * Get team members.
   * @param team
   */
  getTeamMembers: function (team) {},
  /**
   * Edit campaign participants.
   * @param role
   * @param team
   * @param blackList
   */
  editCampaignParticipants: function (role, team, blackList) {},
  /**
   * Get campaign types.
   * @param userId
   */
  getCampaignTypes: function (userId) {},
  /**
   * Get metrics.
   */
  getMetrics: function () {},
  /**
   * Set goal.
   * @param metric
   * @param value
   */
  setGoal: function (metric, value) {},
  /**
   * Set ticket to play.
   * @param metric
   * @param value
   */
  setTicketToPlay: function (metric, value) {},
  /**
   * Update campaign.
   * @param campaignID
   * @param campaignData
   */
  updateCampaign: function (campaignID, campaignData) {},
  /**
   * Get my campaign.
   * @param userId
   */
  getMyCampaign: function (userId) {},
  /**
   * Get my leaderboard.
   * @param userId
   */
  getMyLeaderboard: function (userId) {},
  /**
   * Get my campaign banner.
   * @param userId
   */
  getMyCampaignBanner: function (userId) {}
};
module.exports = CampaignService;