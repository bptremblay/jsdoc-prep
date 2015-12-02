/**
 * @module CampaignService
 */
'use strict';
//USE_STATIC_DATA if true do not use a rethinkdb connection, just simulate.
var USE_STATIC_DATA = false;
var CampaignUtilities = require('./CampaignUtilities');
var metricConf = require('../../config/metric.js');
var moment = require('moment');
var promise = require('bluebird');
var rolesConf = CampaignUtilities.roles;
var sitesConf = CampaignUtilities.sites;
var teamsConf = CampaignUtilities.teams;
var campaignTypesConf = CampaignUtilities.campaignTypes;
/**
 * @constructor
 */
var CampaignService = {
    /**
     * @type {Object} The authoring states of a campaign.
     * Can only be assigned by campaign administrators.
     */
    campaignState: {
        CREATED: 'CREATED',
        PUBLISHED: 'PUBLISHED',
        DELETED: 'DELETED'
    },
    /**
     * @type {Object} The visibility states of a campaign to the dashboard user.
     * These are computed based on dates.
     */
    campaignAvailability: {
        USER_DESELECTED: 'USER_DESELECTED',
        UPCOMING: 'UPCOMING',
        ACTIVE: 'ACTIVE',
        RECENTLY_ENDED: 'RECENTLY_ENDED',
        INACTIVE: 'INACTIVE',
        EXPIRED: 'EXPIRED'
    },
    /**
     * Computes the campaign availability based on dates.
     * @param {campaign} currentCampaign
     * 		NOTE: currentCampaign is modified by this function!!!
     * @return {String} the campaignAvailability state
     */
    getCampaignAvailability: function (currentCampaign) {
        var campaignAvailability = currentCampaign.availability;
        // Determine the state of the campaign.
        if (currentCampaign.start == null || currentCampaign.end == null) {
            return CampaignService.campaignAvailability.INACTIVE;
        }
        var state = currentCampaign.state;
        var start = new Date(moment(new Date(currentCampaign.start)).startOf('day')).getTime();
        var end = new Date(moment(new Date(currentCampaign.end)).endOf('day')).getTime();
        // WARNING: Modifies the input campaign!!!!
        currentCampaign.start = start;
        currentCampaign.end = end;
        // Phase 1 C - Performance Hub / US-473 | US-460
        var now = new Date(moment().startOf('day')).getTime();
        // 1) Display the campaign banner for the entire duration of all running campaigns (including start date and end date)
        //and 7 days before a campaign begins
        var oneWeekFromNow = new Date(moment(now).add(7, 'days')).getTime();
        //and a month after it ends to all eligible managers as per campaign hierarchy.
        var oneMonthAgo = new Date(moment(now).subtract(1, 'month')).getTime();
        // 2) Indicate the no. of days left for the campaign to begin and after it begins the no. of days left to finish.
        // campaignState: ['CREATED', 'PUBLISHED', 'ACTIVE', 'USER_DESELECTED', 'RECENTLY_ENDED', 'UPCOMING'],
        // Is the campaign yet to happen, and far off in the future?
        if (state !== CampaignService.campaignState.PUBLISHED || start > oneWeekFromNow) {
            campaignAvailability = CampaignService.campaignAvailability.INACTIVE;
        }
        // Is campaign happening right now?
        else if (start <= now && end > now) {
            campaignAvailability = CampaignService.campaignAvailability.ACTIVE;
        }
        // about to start? Up to week from from now.
        else if (start > now && start <= oneWeekFromNow) {
            campaignAvailability = CampaignService.campaignAvailability.UPCOMING;
        }
        // recently ended? If it was up to one month ago, it's recent.
        else if (end < now && end >= oneMonthAgo) {
            campaignAvailability = CampaignService.campaignAvailability.RECENTLY_ENDED;
        } else if (end < oneMonthAgo) {
            campaignAvailability = CampaignService.campaignAvailability.EXPIRED;
        }
        // WARNING: Modifies the input campaign!!!!
        currentCampaign.availability = campaignAvailability;
        return campaignAvailability;
    },
    /**
     * Get campaigns.
     *
     * @return {Promise} Contains Array of Campaign objects.
     */
    getCampaigns: function () {
        if (USE_STATIC_DATA) {
            return promise.resolve(CampaignUtilities.getCampaigns());
        } else {
            var resultPromise = new Promise(function (resolve, reject) {
                var result = [];
                campaign.run().then(function (campaigns) {
                    var availability = CampaignService.campaignAvailability;
                    for (var index = 0; index < campaigns.length; index += 1) {
                        var currentCampaign = campaigns[index];
                        currentCampaign.availability = CampaignService.getCampaignAvailability(currentCampaign);
                        //console.log(index, ': ', currentCampaign.state);
                        // This IF statement removes campaigns which have RECENTLY_ENDED/EXPIRED, or marked DELETED (not implemented at this time).
                        // getCampaignAvailability defines RECENTLY_ENDED as a campaign that has ended within the last month.
                        // getCampaignAvailability defines EXPIRED as a campaign that has ended over a month ago.
                        // The purpose of this is to prevent an ENDED campaign from being "re-used" with the same campaign id.
                        //console.log(currentCampaign.availability);
                        if (currentCampaign.availability !== availability.RECENTLY_ENDED && currentCampaign.availability !== availability.EXPIRED && currentCampaign.availability !== CampaignService.campaignState.DELETED) {
                            var summaryCampaign = {};
                            //console.log('summaryCampaign: ', summaryCampaign);
                            summaryCampaign.id = currentCampaign.id;
                            summaryCampaign.title = currentCampaign.title;
                            summaryCampaign.start = currentCampaign.start;
                            summaryCampaign.end = currentCampaign.end;
                            summaryCampaign.created = currentCampaign.created;
                            summaryCampaign.modified = currentCampaign.modified;
                            summaryCampaign.state = currentCampaign.state;
                            summaryCampaign.availability = currentCampaign.availability;
                            //summaryCampaign.associate = currentCampaign.associate;
                            //summaryCampaign.manager = currentCampaign.manager;
                            result.push(summaryCampaign);
                        }
                    }
                    resolve(result);
                });
            });
            return resultPromise;
        }
    },
    /**
     * Get campaign.
     *
     * @param campaignId
     * @return {Promise} Contains Campaign object.
     */
    getCampaign: function (campaignId) {
        if (USE_STATIC_DATA) {
            return promise.resolve(CampaignUtilities.getCurrentCampaign());
        } else {
            return campaign.get(campaignId);
        }
    },
    /**
     * Get roles.
     *
     * @return {Promise} Contains Array of Role object.
     */
    getRoles: function () {
        if (USE_STATIC_DATA) {
            return promise.resolve(rolesConf);
        } else {
            var resultPromise = new Promise(function (resolve, reject) {
                var result = [];
                //r.db("MyPath1CDemo").table('associate').pluck('role').distinct()
                //console.log('get distinct roles');
                associate.pluck('role').distinct().run().then(function (roles) {
                    //console.log('roles', roles);
                    try {
                        for (var index = 0; index < roles.length; index += 1) {
                            var role = roles[index];
                            var newRole = {
                                role: role.role,
                                name: role.role
                            };
                            if (role.active) {
                                result.push(newRole);
                            }

                        }
                    } catch (err) {
                        console.log(err);
                    }

                    resolve(result);
                }).error(function (reason) {
                    console.log(reason);
                });
            });
            return resultPromise;
        }
    },
    /**
     * Upload image.
     *
     * @param {Object}
     *          fileData The dataURL including all binary.
     * @param {Object}
     *          fileProperties Metadata about the file.
     * @param {String}
     *          category
     * @return {Promise} If successful contains the image metadata, without binary payload.
     */
    uploadImage: function (req) {
        // console.log('uploadImage 0');
        // {'fileData': data, 'fileProperties': fileObject}
        var fileData = req.param('fileData');
        var fileProperties = req.param('fileProperties');
        var category = req.param('category');
        // console.log('uploadImage 1');
        var resultPromise = new Promise(function (resolve, reject) {
            CampaignUtilities.imageImport(fileProperties.name, fileData, category, fileProperties.type).then(function (result) {
                // console.log('uploadImage 3', fileProperties);
                // data:image/png;base64,
                // do not send the bytes back! too big and not necessary
                delete result.file;
                resolve({
                    name: fileProperties.name,
                    size: fileProperties.size,
                    type: fileProperties.type,
                    saved: result
                });
            });
        });
        // console.log('uploadImage 2');
        // {
        // "name": "me.png",
        // "size": 343375,
        // "type": "image/png",
        // "saved": {
        // "fileName": "me.png",
        // "category": "CAMPAIGN_LOGO",
        // "hash": "me_457858",
        // "id": "a31906ec-dc09-4559-8e93-567ab98d25f6"
        // }
        // }
        return resultPromise;
    },
    /**
     * Get image. Reads dataUrl and obtains the correct response headers, converts bytes to buffer with correct
     * encoding.
     *
     * @param {String}
     *          imageId
     * @param {String}
     *          format Optional. If "json" we return metadata rather than the raw image.
     * @return {Promise} Contains image data. Either as direct image/* response or as JSON with dataURL.
     */
    getImage: function (req) {
        // console.log('getImage 0');
        // {'fileData': data, 'fileProperties': fileObject}
        var imageId = req.param('imageId');
        var format = req.param('format');
        // console.log('getImage 1 ', imageId);
        var imageData = null;
        var resultPromise = new Promise(function (resolve, reject) {
            imagestore.get(imageId).then(function (result) {
                if (format && format.trim().toLowerCase() === 'json') {
                    // console.log('getImage 3 - JSON - DONE');
                    resolve(result);
                } else {
                    if (result.file.indexOf('data:') === 0) {
                        // console.log('getImage 3 - image/* - CONVERT');
                        // data:image/png;base64,
                        var dataUrlPrefix = result.file.split(',')[0];
                        // console.log('stripped header: ', dataUrlPrefix);
                        dataUrlPrefix = dataUrlPrefix.split(':')[1];
                        // console.log('stripped header: ', dataUrlPrefix);
                        dataUrlPrefix = dataUrlPrefix.split(';');
                        var type = dataUrlPrefix[0];
                        var encoding = dataUrlPrefix[1];
                        var responseBuffer = new Buffer(result.file.replace('data:' + type + ';' + encoding + ',', ''), encoding);
                        result.bytes = responseBuffer;
                        result.type = type;
                        result.encoding = encoding;
                        delete result.file;
                        // console.log('getImage 3 - image/* - DONE');
                        resolve(result);
                    } else {
                        throw (new Error('CampaignService.getImage: this image is in an unsupported format.'));
                    }
                }
            }).error(function (reason) {
                // console.log('getImage error', reason);
                reject(reason);
            });
        });
        // console.log('getImage 2');
        return resultPromise;
    },
    uploadImageFromForm: function (req) {
        var params = req.params;
        var fileRef = req.file('uploadFile');
        // // console.log(fileRef);
        var dirName = sails.config.appPath + '/assets/uploads';
        var resultPromise = new Promise(function (resolve, reject) {
            // console.log('uploadImage: upload the file to ' + dirName);
            fileRef.upload({
                dirname: dirName,
                // don't allow the total upload size to exceed ~10MB
                maxBytes: 10000000
            }, function (err, uploadedFiles) {
                if (err) {
                    console.warn('uploadImage: ', err);
                    reject(err);
                } else if (err || uploadedFiles.length === 0) {
                    console.warn('uploadImage: No file was uploaded. Why?\n', fileRef);
                    reject('No file was uploaded.');
                } else {
                    // console.log('uploadImage:  fileRef.upload succeeded... now copying');
                    var fileResult = uploadedFiles[0];
                    var fileName = fileResult.fd.split('/').pop();
                    var result = {
                        fileName: fileName,
                        originalName: fileResult.filename,
                        size: fileResult.size
                    };
                    CampaignUtilities.copyFile(fileResult.fd, sails.config.appPath + '/.tmp/public/uploads/' + fileName).then(function () {
                        // console.log('uploadImage:  copied the file');
                        resolve(result);
                    }, function (err) {
                        reject(err);
                    });
                }
            });
        });
        return resultPromise;
    },
    /**
     * Create campaign.
     *
     * @param properties
     * @return {Promise} Contains Campaign object.
     */
    createCampaign: function (properties) {
        if (USE_STATIC_DATA) {
            return promise.resolve(CampaignUtilities.getCurrentCampaign());
        } else {
            // TODO: add validation!!!
            return campaign.save(properties);
        }
    },
    /**
     * Get sites.
     *
     * @param {String}
     *          [forRole] If not passed in, get all the sites.
     * @return {Promise} Contains Array of Site objects.
     */
    getSites: function (forRole) {
        //console.log('getSites("', role, '")');
        if (USE_STATIC_DATA) {
            return promise.resolve(sitesConf);
        } else {
            var data = [];
            var resultPromise = new Promise(function (resolve, reject) {
                var r = thinky.r;
                //site.run().then(function(foundSites) {
                r.table('site').filter({
                    active: true
                }).without('metric', 'goal').run().then(function (sites) {
                    if (forRole == null || typeof forRole !== 'string') {
                        //console.log('getSites() >> All sites.');
                        resolve(sites);
                    } else {
                        //console.log('getSites("', role, '") >> ');
                        var data = [];
                        for (var index = 0; index < sites.length; index += 1) {
                            var site = sites[index];
                            //console.log(site);
                            // active: true,
                            // id: 'Salt Lake City-SVC Core Trader',
                            // name: 'Salt Lake City',
                            // parentid: 'FIDELITY-SVC Core Trader',
                            // role: 'SVC Core Trader',
                            if (site.role.toLowerCase().trim() === forRole.toLowerCase().trim()) {
                                //console.log('FOUND MATCHING SITE');
                                data.push(site);
                            }
                        }
                        //console.log("RESOLVING NOW!!!");
                        resolve(data);
                    }
                });
            });
            return resultPromise;
        }
    },
    /**
     * Get teams by site.
     *
     * @param site
     * @return {Promise} Contains Array of Team/Manager objects.
     */
    getTeamsBySite: function (site, role) {
        if (USE_STATIC_DATA) {
            return promise.resolve(teamsConf);
        } else {
            console.log('getTeamsBySite?site=' + site);
            // console.log('getTeamsBySite("', site, '") >>> ');
            // r.db("MyPath1CDemo").table('manager').filter(function(mgr){
            // return mgr('active').and(mgr('parentid').match('Salt Lake City'));
            // }).without('metric', 'goal', 'active','id')
            //
            var data = [];
            var resultPromise = new Promise(function (resolve, reject) {
                var r = thinky.r;
                r.table('manager').filter({
                    active: true
                }).without('metric', 'goal', 'active', 'id').run().then(function (teams) {
                    for (var index = 0; index < teams.length; index += 1) {
                        var team = teams[index];
                        //console.log(team);
                        // {"corpid":"A022859","name":"HORROCKS, K.","site":"Salt Lake City"}
                        // // console.log('getTeamsBySite team>>>' + team.site.toLowerCase().trim() + '?' + site.toLowerCase().trim());
                        if (team.parentid.toLowerCase().trim().indexOf(site.toLowerCase().trim()) !== -1) {
                            var newTeam = {};
                            newTeam.corpid = team.corpid;
                            newTeam.name = team.name;
                            newTeam.role = team.role;
                            if (role && role !== '') {
                                if (team.role === role) {
                                    data.push(newTeam);
                                }
                            } else {
                                data.push(newTeam);
                            }
                        }
                    }
                    resolve(data);
                });
            });
            // // console.log('getTeamsBySite("' + site + '") >>> ', data);
            return resultPromise;
        }
    },
    /**
     * Get team members.
     *
     * @param team
     * @return {Promise} Contains Array of Associate objects.
     */
    getTeamMembers: function (team, role) {
        if (USE_STATIC_DATA) {
            return promise.resolve(CampaignUtilities.getTeamMembers());
        } else {
            var resultPromise = new Promise(function (resolve, reject) {
                // Do _NOT_ run all associates. It takes way too long.
                associate.filter(function (assoc) {
                    return assoc("parentid").match(team + '-');
                }).distinct().without('goal', 'metric', 'campaignMetricsData').run().then(function (result) {
                    var output = [];
                    for (var index = 0; index < result.length; index += 1) {
                        var record = result[index];
                        var parentid = record.parentid;
                        var subset = {};
                        subset.id = record.id;
                        subset.name = record.name;
                        subset.role = record.role;
                        if (role && role !== '') {
                            if (record.role === role) {
                                output.push(subset);
                            }
                        } else {
                            output.push(subset);
                        }
                        //if (parentid.indexOf(team) !== -1) {
                        //}
                    }
                    resolve(output);
                }).error(function (err) {
                    // process error
                    console.error(err);
                    reject(err);
                });
            });
            return resultPromise;
        }
    },
    /**
     * Get campaign types.
     *
     * @param userId
     * @return {Promise} Contains Array of Strings, naming the (2) campaign types.
     */
    getCampaignTypes: function (userId) {
        var data = campaignTypesConf;
        return promise.resolve(data);
    },
    /**
     * Get metrics.
     *
     * @return {Promise} Contains Array of Strings representing each metric symbol.
     */
    getMetrics: function () {
        //CampaignService.fixCampaignMetricNames();
        var data = Object.keys(CampaignUtilities.metrics.metric);
        return promise.resolve(data);
    },
    /**
     * Update campaign.
     *
     * @param campaignId
     * @param campaignData
     * @return {Promise} will have a rethink result.
     */
    updateCampaign: function (campaignId, campaignData) {
        campaignData = CampaignService.fixCampaignMetricNames(campaignData);
        if (USE_STATIC_DATA) {
            return promise.resolve({});
        } else {
            console.warn('Update campaign: ' + campaignId);
            campaignData.modified = thinky.r.now();
            var resultPromise = new Promise(function (resolve, reject) {
                if (!campaignId || campaignId === '') {
                    reject(new Error('bad request'));
                } else {
                    campaign.get(campaignId).then(function (getResult) {
                        campaign.get(campaignId).update(campaignData).execute().then(function (updated) {
                            resolve(updated);
                        }).error(function (err) {
                            // process error
                            err.status = 500;
                            console.error(err);
                            reject(err);
                        });
                    }).error(function (err) {
                        console.warn('Update campaign: not found?');
                        // process error
                        err.status = 404;
                        console.error(err);
                        reject(err);
                    });
                }
            });
            return resultPromise;
        }
        // return campaign.get(campaignId).update(campaignData).run();
    },
    /**
     * Delete campaign.
     *
     * @param campaignId
     * @return {Promise} ?
     */
    deleteCampaign: function (campaignId) {
        if (USE_STATIC_DATA) {
            return promise.resolve({});
        } else {
            console.warn('Delete campaign: ' + campaignId);
            var resultPromise = new Promise(function (resolve, reject) {
                if (!campaignId || campaignId === '') {
                    reject(new Error('bad request'));
                } else {
                    campaign.get(campaignId).then(function (getResult) {
                        campaign.get(campaignId).delete().execute().then(function (deleted) {
                            resolve(deleted);
                        }).error(function (err) {
                            // process error
                            console.error(err);
                            reject(err);
                        });
                    }).error(function (err) {
                        console.warn('Delete campaign: not found?');
                        // process error
                        console.error(err);
                        reject(err);
                    });
                }
            });
            return resultPromise;
        }
    },
    /**
     * Get my campaign. This should give the correct campaign based on which campaigns are "running", whether this
     * associate is deselected, and if this campaign includes this associate's role.
     *
     * The campaign returned may be currently running, or it may have recently ended, or it may be about to start.
     *
     * @TODO apply blacklist logic
     * @param userData
     * @return {Promise} Contains a DASHBOARD Campaign object, simplified for the current user.
     */
    getMyCampaign: function (userData, dontGetScores) {
        ////////////////////////////////// HACK //////////////////////////////////////
        // userData.campaignId = '36913db9-e190-4532-b03d-021d9d647c70';
        // userData.userId = 'A435540';
        // userData.role = 'HNW Service Associate Tier 2';
        // userData.persona = 'associate';
        // userData.team = '<mgr's corpid>';
        // userData.teamMembers = []
        ////////////////////////////////// END HACK //////////////////////////////////////
        var campaignId = userData.campaignId;
        var userId = userData.userId;
        var persona = userData.persona;
        var teamMembers = userData.teamMembers;
        dontGetScores = !(!dontGetScores);
        if (!userId) {
            return promise.reject(new Error('getMyCampaign: userData.userId can\'t be empty!'));
        }
        //console.log('getMyCampaign(', userData, ')');
        if (USE_STATIC_DATA) {
            return promise.resolve(CampaignUtilities.getCurrentCampaign());
        } else {
            var handleMyCampaign = function (campaignFromTable, campaignFromTableRole, whichNodeName, resolve, reject) {
                // console.log('getMyCampaign.handleMyCampaign', campaignFromTableRole);
                // use === for null check here; we define it internally
                if (campaignFromTable === null) {
                    //console.log('getMyCampaign could not find a campaign.');
                    reject(new Error('getMyCampaign: query did not find a campaign!!!'));
                    return resultPromise;
                }
                var associateOrManagerPortion = {};
                associateOrManagerPortion.refid = campaignFromTable.id;
                associateOrManagerPortion.start = campaignFromTable.start;
                associateOrManagerPortion.end = campaignFromTable.end;
                associateOrManagerPortion.title = campaignFromTable.title;
                associateOrManagerPortion.availability = campaignFromTable.availability;
                associateOrManagerPortion.state = campaignFromTable.state;
                if (!campaignFromTableRole.blacklist) {
                    campaignFromTableRole.blacklist = [];
                }
                var blackList = campaignFromTableRole.blacklist;
                // UNCOMMENT NEXT LINE ONLY FOR DEBUG.
                // blackList.push(userId);
                if (blackList.indexOf(userId) !== -1) {
                    console.log('getMyCampaign() found a campaign but this user has been de-selected from the campaign.');
                    associateOrManagerPortion.availability = CampaignService.campaignAvailability.USER_DESELECTED;
                    //associateOrManagerPortion.msg = 'getMyCampaign() found a campaign but this user has been de-selected from the campaign';
                    //console.log(associateOrManagerPortion);
                    reject(new Error('getMyCampaign: query did not find a campaign!!!'));
                    return resultPromise;
                }
                associateOrManagerPortion.outline = campaignFromTable.outline;
                //associateOrManagerPortion.state = 'ACTIVE';
                // whichNode is either the associate or the manager portion of the campaign object.
                var whichNode = campaignFromTable[whichNodeName];
                if (whichNode.logo) {
                    associateOrManagerPortion.logo = whichNode.logo;
                }
                for (var p in campaignFromTableRole) {
                    if (p === 'title' || p === 'name') {
                        continue;
                    }
                    if (campaignFromTableRole.hasOwnProperty(p)) {
                        associateOrManagerPortion[p] = campaignFromTableRole[p];
                    }
                }
                if (associateOrManagerPortion.goals) {
                    for (var g = 0; g < associateOrManagerPortion.goals.length; g += 1) {
                        var goal = associateOrManagerPortion.goals[g];
                        var metricName = goal.metric.toLowerCase();
                        var metricUnit = CommonService.getMetricUnit(metricName) || '';
                        var goalValue = -1;
                        var thresholds = goal.thresholds;
                        if (thresholds.length === 1) {
                            //console.log("THRESHOLDS SIMPLE (sharedpool): ", thresholds);
                            goalValue = thresholds[0].condition[0].amount;
                        } else if (thresholds.length > 1) {
                            // it's a stack rank?
                            var sortByPoints = function (a, b) {
                                a.points = a.points != null ? a.points : 0;
                                b.points = b.points != null ? b.points : 0;
                                if (a.points > b.points) {
                                    return 1;
                                } else if (a.points < b.points) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            };
                            thresholds = thresholds.sort(sortByPoints);
                            //console.log("THRESHOLDS SORTED: ", thresholds);
                            // THRESHOLDS SORTED:  [ { condition: [ [Object] ], points: 0 },
                            // { condition: [ [Object] ], points: 0 },
                            // { condition: [ [Object], [Object] ], points: 50 },
                            // { condition: [ [Object], [Object] ], points: 80 },
                            // { condition: [ [Object] ], points: 100 } ]
                            // sorted from lowest to highest
                            // now, get the first non-zero threshold
                            for (var t = 0; t < thresholds.length; t += 1) {
                                var threshold = thresholds[t];
                                if (threshold.points > 0) {
                                    var conditions = threshold.condition;
                                    goalValue = conditions[0].amount;
                                    //console.log('Using this number for metric goal "' + metricName + '": ', goalValue);
                                    break;
                                    // for (var c = 0; c < conditions.length; c++) {
                                    // var theCondition = conditions[c];
                                    //
                                    // }
                                }
                            }
                        } else {
                            console.log('>>>>>>>>>>>>>>>>>>>>>>>>> I cannot get the goal for ', JSON.stringify(thresholds, null, 2));
                        }
                        var clientGoal = {
                            metric: metricName,
                            value: -1,
                            goal: goalValue,
                            unitOfMeasure: goal.unitOfMeasure,
                            metricUnit: metricUnit
                        };
                        //console.log(clientGoal);
                        associateOrManagerPortion.goals[g] = clientGoal;
                    }
                }
                if (associateOrManagerPortion.ticketToPlay && (!associateOrManagerPortion.ticketToPlay.value)) {
                    associateOrManagerPortion.ticketToPlay.value = -1;
                }
                if (!dontGetScores) {
                    console.log('getMyCampaignScoreCard() getting scores');
                    CampaignService.addMetricsValuesToScoreCard(userId, persona, associateOrManagerPortion, teamMembers).then(function (associateOrManagerPortion) {
                        // based on persona, get role
                        // based on role, get the rest of the campaign metadata
                        //// console.log('RESULT OF addMetricsValuesToScoreCard: ', associateOrManagerPortion);
                        resolve(associateOrManagerPortion);
                    }).catch(function (err) {
                        console.error(err);
                        reject(err);
                    });
                } else {
                    //// console.log('getMyCampaign() DO NOT get scores');
                    resolve(associateOrManagerPortion);
                }
            };
            // get the campaign for my team/role
            // reduce it to simpler form
            var handlePersonaData = function (myAssociateData, resolve, reject) {
                //// console.log('getMyCampaign.handlePersonaData');
                // Do NOT use === undefined!!!! BAD! Ignore jsLint on this issue.
                var roleName = myAssociateData.role;
                var persona = myAssociateData.persona;
                var whichNodeName = myAssociateData.persona === 'associate' ? 'associate' : 'teamOrManager';
                // Get CURRENT campaigns.
                // Get campaign with my role.
                // Am I on the blacklist?
                // TODO: replace getCurrentCampaign with a real implementation
                var campaignFromTable = null;
                var campaignFromTableRole = null;
                // var now = new Date();
                // // console.log('The time is now: ', thinky.r.now());
                // thinky.r.now().run().then(function (value) {
                // // console.log('The time is now: ', value);
                // });
                if (campaignId != null && campaignId !== '') {
                    // console.log('getMyCampaign has campaignId: ', campaignId);
                    var before = new Date().getTime();
                    campaign.get(campaignId).then(function (campaignFromTable) {
                        // console.log('campaign.get() took ' + (new Date().getTime() - before) + ' ms.');
                        var whichNode = campaignFromTable[whichNodeName];
                        for (var r = 0; r < whichNode.roles.length; r += 1) {
                            var role = whichNode.roles[r];
                            // // console.log(role.title, '=', roleName, '?');
                            // // console.log(role);
                            if (role.title === roleName) {
                                campaignFromTableRole = role;
                                // // console.log('Campaign Start/End: ', campaignFromTable.start, campaignFromTable.end);
                                // // console.log('Found a running campaign with my role!!');
                                break;
                            }
                        }
                        CampaignService.getCampaignAvailability(campaignFromTable);
                        handleMyCampaign(campaignFromTable, campaignFromTableRole, whichNodeName, resolve, reject);
                    }).error(function (err) {
                        // console.error(err);
                        reject(err);
                    });
                } else {
                    // console.log('getMyCampaign does not have campaignId, search for my campaign: ');
                    var r = thinky.r;
                    // GET ALL PUBLISHED CAMPAIGNS. Discard others.
                    campaign.filter(function (aCampaign) {
                        return aCampaign('state').eq('PUBLISHED');
                        // return
                        // aCampaign('start').and(aCampaign('start').le(r.now())).and(aCampaign('end').and(aCampaign('end').ge(r.now())));
                    }).run().then(function (currentCampaigns) {
                        // // console.log('Current Campaigns: ', JSON.stringify(currentCampaigns, null, 2));
                        if (currentCampaigns.length === 0) {
                            // console.log('REJECT');
                            reject(new Error('query did not find'));
                        } else {
                            // console.log('Find a campaign that matches my role ("' + roleName + '"). Should only ever be one.');
                            // console.log('Searching in ' + whichNodeName);
                            var campaignsWithMyRole = [];
                            console.log('Search for a campaign with my role.');
                            for (var index = 0; index < currentCampaigns.length; index += 1) {
                                var currentCampaign = currentCampaigns[index];
                                // // console.log('Campaign: ', JSON.stringify(Campaign, null, 2));
                                // Manager or Associate Campaign?
                                if (currentCampaign.start == null || currentCampaign.end == null) {
                                    // console.log('skipping this campaign; it does not have valid dates');
                                    continue;
                                }
                                var whichNode = currentCampaign[whichNodeName];
                                // does it have my role?
                                for (var r = 0; r < whichNode.roles.length; r += 1) {
                                    var role = whichNode.roles[r];
                                    // // console.log(role.title, '=', roleName, '?');
                                    // // console.log(role);
                                    if (role.title === roleName) {
                                        //campaignFromTable = currentCampaign;
                                        //campaignFromTableRole = role;
                                        // // console.log('Campaign Start/End: ', currentCampaign.start, currentCampaign.end);
                                        console.log('Found a campaign with my role. Is it within my time ranges?');
                                        campaignsWithMyRole.push({
                                            campaign: currentCampaign,
                                            role: role
                                        });
                                        break;
                                    }
                                }
                            }
                            if (campaignsWithMyRole.length === 0) {
                                // console.log('REJECT');
                                reject(new Error('query did not find'));
                                return;
                            }
                            console.log('Search for a campaign with my role and my time ranges.');
                            var activeCampaign = null;
                            var upcomingCampaign = null;
                            var recentCampaign = null;
                            // we have zero or more campaigns with my role
                            for (var index = 0; index < campaignsWithMyRole.length; index += 1) {
                                var campaignObject = campaignsWithMyRole[index];
                                currentCampaign = campaignObject.campaign;
                                //campaignFromTable = campaignObject.campaign;
                                //campaignFromTableRole = campaignObject.role;
                                // get availability
                                var availability = CampaignService.getCampaignAvailability(currentCampaign);
                                // Now, this is tricky. There might be an UPCOMING, or RECENTLY_ENDED campaign that matches my role.
                                // But, if there's an ACTIVE campaign that matches my role, it must take precedence.....
                                if (availability === CampaignService.campaignAvailability.ACTIVE) {
                                    // No-brainer, it's active.
                                    console.log('Found an ACTIVE campaign.');
                                    activeCampaign = campaignObject;
                                    campaignFromTable = campaignObject.campaign;
                                    campaignFromTableRole = campaignObject.role;
                                    break;
                                } else if (availability === CampaignService.campaignAvailability.UPCOMING) {
                                    // If a new campaign is about to start, tell me.
                                    //console.log('Found an UPCOMING campaign.');
                                    upcomingCampaign = campaignObject;
                                } else if (availability === CampaignService.campaignAvailability.RECENTLY_ENDED) {
                                    // If I recently finished a campaign, and a new one is not about to start, remind me of my scores.
                                    //console.log('Found an RECENTLY_ENDED campaign.');
                                    recentCampaign = campaignObject;
                                } else {
                                    // not within my time ranges
                                    console.log('Could not find a campaign within my time ranges.');
                                }
                            }
                            if (activeCampaign === null) {
                                if (upcomingCampaign) {
                                    console.log('No active campaign, but here\'s a campaign about to start!');
                                    campaignFromTable = upcomingCampaign.campaign;
                                    campaignFromTableRole = upcomingCampaign.role;
                                } else if (recentCampaign) {
                                    console.log('No active campaign, but here\'s your recent campaign!');
                                    campaignFromTable = recentCampaign.campaign;
                                    campaignFromTableRole = recentCampaign.role;
                                }
                            }
                            if (campaignFromTable === null) {
                                // console.log('REJECT');
                                reject(new Error('query did not find'));
                                return;
                            }
                            //console.log('getMyCampaign: ', campaignFromTableRole);
                            handleMyCampaign(campaignFromTable, campaignFromTableRole, whichNodeName, resolve, reject);
                        }
                    }).error(function (reason) {
                        console.error(reason);
                        reject(reason);
                    });
                }
            };
            // get the campaign for my team/role
            // reduce it to simpler form
            var resultPromise = new Promise(function (resolve, reject) {
                var beforeRole = new Date().getTime();
                var myAssociateData = {};
                if (userData.persona) {
                    // console.log('getMyCampaign.resultPromise: we have a persona');
                    myAssociateData = userData;
                    // console.log(myAssociateData);
                    handlePersonaData(myAssociateData, resolve, reject);
                } else {
                    // console.log('getMyCampaign.resultPromise: no persona, have to call getUserRole... snore');
                    UserService.getUserRole(userId).then(function (result) {
                        if (result == null || result.length == 0) {
                            reject('getUserRole("' + userId + '") >> not found');
                        } else {
                            // associate.filter({id: userId}).run().then(function (result) {
                            var afterRole = new Date().getTime();
                            // console.log('It took ', (afterRole - beforeRole), ' ms to get this role data. Too long??');
                            // select distict from campaign where role is my role and I am not on the blacklist
                            myAssociateData.userId = userId;
                            myAssociateData.persona = result.persona;
                            var myAssociateDataRoleKey = Object.keys(result.data)[0];
                            myAssociateData.role = myAssociateDataRoleKey;
                            // console.log(myAssociateData);
                            handlePersonaData(myAssociateData, resolve, reject);
                        }
                    }, function (reason) {
                        reject(reason);
                    });
                }
            });
            return resultPromise;
        }
    },
    /**
     * Get my campaign banner.
     *
     * @TODO apply blacklist logic
     * @param userData
     * @return {Promise} Contains a BANNER Campaign object, simplified for the current user.
     */
    getMyCampaignBanner: function (userData) {
        // console.log('getMyCampaignBanner(', userData, ')');
        var userId = userData.userId;
        if (USE_STATIC_DATA) {
            var campaignFromTable = CampaignUtilities.getCurrentCampaign();
            var clientCampaignBanner = {};
            clientCampaignBanner.refid = 'a8f47e05-a276-427f-8b93-25a0fd3ee826';
            clientCampaignBanner.start = '2015-07-31T13:40:43.652Z';
            clientCampaignBanner.end = '2015-12-31T13:40:43.652Z';
            clientCampaignBanner.title = 'This is your campaign!';
            clientCampaignBanner.state = 'PUBLISHED';
            clientCampaignBanner.availability = 'ACTIVE';
            clientCampaignBanner.logo = 'logo.gif';
            return promise.resolve(clientCampaignBanner);
        } else {
            if (!userId) {
                return promise.reject(new Error('getMyCampaignBanner: userData.userId can\'t be empty!'));
            }
            // do something real
            var resultPromise = new Promise(function (resolve, reject) {
                var clientCampaignBanner = {};
                // FIXME: we are not handling or catching errors for getMyCampaign() here
                CampaignService.getMyCampaign(userData, true).then(function (myCampaign) {
                    //console.log('getMyCampaignBanner called getMyCampaign and it returned ', myCampaign);
                    if (myCampaign) {
                        clientCampaignBanner.refid = myCampaign.refid;
                        clientCampaignBanner.start = myCampaign.start;
                        clientCampaignBanner.end = myCampaign.end;
                        clientCampaignBanner.title = myCampaign.title;
                        clientCampaignBanner.state = myCampaign.state;
                        clientCampaignBanner.logo = myCampaign.logo;
                        clientCampaignBanner.availability = myCampaign.availability;
                    } else {
                        clientCampaignBanner = null;
                    }
                    // console.log('getMyCampaignBanner RESOlVE');
                    resolve(clientCampaignBanner);
                }).catch(function (err) {
                    // console.error(err);
                    reject(err);
                });
            });
            return resultPromise;
        }
    },
    /**
     * Get my leaderboard.
     *
     * @param userData
     */
    getMyCampaignLeaderBoard: function (userData) {
        ////////////////////////////////// HACK //////////////////////////////////////
        // userData.campaignId = '36913db9-e190-4532-b03d-021d9d647c70';
        // userData.userId = 'A201174';
        // userData.role = 'HNW Service Associate Tier 2';
        // userData.persona = 'associate';
        ////////////////////////////////// END HACK //////////////////////////////////////
        var userId = userData.userId;
        // am I a manager? it matters
        var persona = userData.persona;
        var role = userData.role;
        var whichNodeName = (persona === 'associate' ? 'associate' : 'teamOrManager');
        var team = userData.team;
        var MANAGER_MODE = (whichNodeName === 'teamOrManager');
        if (MANAGER_MODE) {
            console.log('Manager mode.');
        }
        var FILTER_BY_TEAM = false;
        // always display dummy
        if (USE_STATIC_DATA) {
            var staticLeaderboardData = CampaignUtilities.staticLeaderboardData;
            return promise.resolve(staticLeaderboardData);
        } else {
            if (!userId) {
                return promise.reject(new Error('getMyCampaignLeaderBoard: userData.userId can\'t be empty!'));
            }
            // collection of teams used in MANAGER_MODE
            var teams = {};
            //to round up to two decimal places
            var roundToHundredth = function (num) {
                return Math.ceil(num * 100) / 100;
            };
            var resultPromise = new Promise(function (resolve, reject) {
                CampaignService.getMyCampaign(userData, true).then(function (myCampaign) {
                    // // console.log('getMyCampaignBanner called getMyCampaign and it returned ', myCampaign);
                    if (myCampaign) {
                        buildLeaderboard(myCampaign);
                    } else {
                        reject(new Error('getMyCampaignLeaderBoard: query did not find a campaign!!!'));
                    }
                }).catch(function (err) {
                    // console.error(err);
                    reject(err);
                });
                /**
                 * Top-level method for building the leaderboard for this campaign, this role, etc.
                 */
                var buildLeaderboard = function (myCampaign) {
                    //console.log('buildLeaderboard');
                    var leaderBoardModel = {
                        listOfMetrics: [],
                        participants: []
                    };
                    var goals = myCampaign.goals;
                    for (var index = 0; index < goals.length; index += 1) {
                        var goal = goals[index];
                        leaderBoardModel.listOfMetrics.push(goal.metric.toLowerCase());
                    }
                    var participants = leaderBoardModel.participants;
                    // r.db("MyPath1CDataAggregationDev").table('leaderboard').filter(function(board){
                    // return (board("campaign_id").eq('82ac4e51-a860-4f6c-9095-222710074e01').and(board('role').eq('HNW Service
                    // Associate Tier 2')).and(board('participant_entity').eq('associate'))) ;
                    // });
                    // console.log('querying the leaderboard table....');
                    var beforeLeaderboadQuery = new Date().getTime();
                    // leaderboard.filter(function(board) {
                    // return (board("campaign_id").eq(myCampaign.refid).and(board('role').eq(userData.role)).and(board('participant_entity').eq(userData.persona)));
                    // })
                    // leaderboard.getAll(myCampaign.refid, {
                    // index: 'campaign_id'
                    // }).run().
                    // leaderboard.filter(function(board) {
                    // return (board("campaign_id").eq(myCampaign.refid).and(board('role').eq(userData.role)));
                    // })
                    // Super-fast!
                    // console.log('search for ', myLevelId);
                    // r.table('leaderboard').getAll(myLevelId, {
                    // index : 'level_id'
                    // })
                    // r.table('leaderboard').getAll(myCampaign.refid, {
                    // index : 'campaign_id'
                    // })
                    var r = thinky.r;
                    //"id":  "campaign_associate_A022859-HNW Service Associate Tier 2_A044756" ,
                    // "level_id":  "A022859-HNW Service Associate Tier 2" ,
                    //r.db("MyPath1CDemo").table('leaderboard').getAll("SVC Core Trader", {index: '≈'})
                    var myLevelId = team + '-' + role;
                    //console.log('search for ', myLevelId);
                    r.table('leaderboard').getAll(myCampaign.refid, {
                        index: 'campaign_id'
                    }).without('id').run().then(function (campaignLeaderBoardRecords) {
                        var blacklist = myCampaign.blacklist;
                        var totalParticipants = campaignLeaderBoardRecords.length;
                        var participantCount = 0;
                        console.log('getMyCampaignLeaderboard: Search for campaign leaderboard data: ', totalParticipants, ' records, took ', new Date().getTime() - beforeLeaderboadQuery, ' ms.');
                        var beforeLeaderboadPostProcess = new Date().getTime();
                        /**
                         * Called when leaderboard is built.
                         */
                        var finalizeLeaderboardResult = function () {
                            // console.log('getMyCampaignLeaderboard: finalizeLeaderboardResult');
                            var listOfMetrics = leaderBoardModel.listOfMetrics;
                            if (MANAGER_MODE) {
                                // participants is empty, now we must collate and score each team
                                for (var t in teams) {
                                    if (teams.hasOwnProperty(t)) {
                                        var team = teams[t];
                                        var teamMembers = team.participants;
                                        var myScore = 0;
                                        var myCumulativeScore = 0;
                                        var myMetrics = {};
                                        for (var tmm = 0; tmm < listOfMetrics.length; tmm += 1) {
                                            var metricName = listOfMetrics[tmm];
                                            myMetrics[metricName] = {
                                                metricValue: 0,
                                                metricUnit: ''
                                            };
                                        }
                                        for (var tp = 0; tp < teamMembers.length; tp += 1) {
                                            var tm = teamMembers[tp];
                                            var tscore = tm.score;
                                            var tcumulative = tm.cumulativeScore;
                                            myScore += tscore;
                                            myCumulativeScore += tcumulative;
                                            for (var tmm = 0; tmm < listOfMetrics.length; tmm += 1) {
                                                var metricName = listOfMetrics[tmm];
                                                //console.log(tm.metrics);
                                                //glead: { metricValue: 0, metricUnit: '' },
                                                var tmmMetric = tm.metrics[metricName];
                                                myMetrics[metricName].metricValue += tmmMetric.metricValue;
                                            }
                                        }
                                        myScore = myScore / teamMembers.length;
                                        myCumulativeScore = myCumulativeScore / teamMembers.length;
                                        for (var tmm = 0; tmm < listOfMetrics.length; tmm += 1) {
                                            var metricName = listOfMetrics[tmm];
                                            myMetrics[metricName].metricValue = myMetrics[metricName].metricValue / teamMembers.length;
                                        }
                                        var participantModel = {
                                            "id": t,
                                            "name": team.name,
                                            "img": team.img,
                                            "rank": 0,
                                            "score": myScore,
                                            "cumulativeScore": myCumulativeScore,
                                            "metrics": myMetrics
                                        };
                                        participants.push(participantModel);
                                    }
                                }
                            }
                            console.log('Cull/populate campaign leaderboard data: ', participants.length, ' records, took ', new Date().getTime() - beforeLeaderboadPostProcess, ' ms.');
                            var beforeSort = new Date().getTime();
                            var pLen = participants.length;
                            var sortByScore = function (b, a) {
                                var aName = a.name;
                                var bName = b.name;
                                a = a.cumulativeScore;
                                b = b.cumulativeScore;
                                if (a > b) {
                                    return 1;
                                } else if (b > a) {
                                    return -1;
                                } else {
                                    if (aName > bName) {
                                        return 1;
                                    } else if (bName > aName) {
                                        return -1;
                                    } else {
                                        return 0;
                                    }
                                }
                            };
                            participants = participants.sort(sortByScore);
                            for (var p = 0; p < pLen; p += 1) {
                                participants[p].rank = (p + 1);
                            }
                            // console.log('Sorting took ', (new Date().getTime() - beforeSort), ' ms.');
                            resolve(leaderBoardModel);
                        };
                        // console.log('getMyCampaignLeaderboard 1', totalParticipants);
                        if (totalParticipants === 0) {
                            // console.log('getMyCampaignLeaderboard: no records found, returning....');
                            finalizeLeaderboardResult();
                            return resultPromise;
                        }
                        // console.log('getMyCampaignLeaderboard 2');
                        // Loop through all the leaderboard data, building the records as we go.
                        for (var index = 0; index < campaignLeaderBoardRecords.length; index += 1) {
                            var campaignLeaderBoardRecord = campaignLeaderBoardRecords[index];
                            // "level_id":  "A022859-HNW Service Associate Tier 2" ,
                            var levelId = campaignLeaderBoardRecord.level_id.split('-');
                            var teamId = levelId[0];
                            var role = levelId[1];
                            if (campaignLeaderBoardRecord.campaign_id !== myCampaign.refid) {
                                //console.log('participant is not on my team, dropping', team, campaignLeaderBoardRecord.level_id);
                                participantCount += 1;
                                if (participantCount === totalParticipants) {
                                    // console.log('ALL DONE BUILDING LEADERBOARD');
                                    finalizeLeaderboardResult();
                                    break;
                                }
                                continue;
                            }
                            if (blacklist.indexOf(campaignLeaderBoardRecord.participant_id) !== -1) {
                                // console.log('getMyCampaignLeaderboard: dropping deselected participant "' + campaignLeaderBoardRecord.participant_id + '".');
                                participantCount += 1;
                                if (participantCount === totalParticipants) {
                                    // console.log('ALL DONE BUILDING LEADERBOARD');
                                    finalizeLeaderboardResult();
                                    break;
                                }
                                continue;
                            } else if ((campaignLeaderBoardRecord.score === 0 || campaignLeaderBoardRecord.role !== userData.role)) {
                                participantCount += 1;
                                if (participantCount === totalParticipants) {
                                    // console.log('ALL DONE BUILDING LEADERBOARD');
                                    finalizeLeaderboardResult();
                                    break;
                                }
                                continue;
                            }
                            if (MANAGER_MODE) {
                                // only include the scores of associates
                                if (campaignLeaderBoardRecord.participant_entity !== 'associate') {
                                    console.log('participant is not my persona type, dropping', campaignLeaderBoardRecord.participant_entity);
                                    participantCount += 1;
                                    if (participantCount === totalParticipants) {
                                        // console.log('ALL DONE BUILDING LEADERBOARD');
                                        finalizeLeaderboardResult();
                                        break;
                                    }
                                    continue;
                                }
                            } else {
                                // NOTE: this is THE SAME, for now, as above... may be different soon?
                                //campaignLeaderBoardRecord.participant_entity !== userData.persona
                                if (campaignLeaderBoardRecord.participant_entity !== userData.persona) {
                                    console.log('participant is not my persona type, dropping', campaignLeaderBoardRecord.participant_entity);
                                    participantCount += 1;
                                    if (participantCount === totalParticipants) {
                                        // console.log('ALL DONE BUILDING LEADERBOARD');
                                        finalizeLeaderboardResult();
                                        break;
                                    }
                                    continue;
                                }
                            }
                            if (FILTER_BY_TEAM) {
                                if (campaignLeaderBoardRecord.level_id.indexOf(team) === -1) {
                                    console.log('participant is not on my team, dropping', team, campaignLeaderBoardRecord.level_id);
                                    participantCount += 1;
                                    if (participantCount === totalParticipants) {
                                        // console.log('ALL DONE BUILDING LEADERBOARD');
                                        finalizeLeaderboardResult();
                                        break;
                                    }
                                    continue;
                                }
                            }
                            /**
                             * Called after we attempt to get the participant's image.
                             * Builds the proper leaderboard record and applies some scoring rules.
                             */
                            var populateLeaderboard = function (campaignLeaderBoardRecord, img) {
                                // console.log('getMyCampaignLeaderboard populateLeaderboard');
                                var levelId = campaignLeaderBoardRecord.level_id.split('-');
                                var teamId = levelId[0];
                                var role = levelId[1];
                                var participantModel = {
                                    "id": campaignLeaderBoardRecord.participant_id,
                                    "name": campaignLeaderBoardRecord.name,
                                    "img": (img != 0 && img) ? (img[0].id + '_' + img[0].hash) : '',
                                    "rank": 0,
                                    "score": campaignLeaderBoardRecord.score,
                                    "metrics": {}
                                    //levelId: levelId,
                                    //participant_entity: campaignLeaderBoardRecord.participant_entity
                                };
                                var score = 0;
                                for (var metricIndex = 0; metricIndex < goals.length; metricIndex += 1) {
                                    var metricName = leaderBoardModel.listOfMetrics[metricIndex];
                                    var metricValue = campaignLeaderBoardRecord.metrics[metricName];
                                    metricValue = metricValue != null ? metricValue : 0;
                                    var metricUnit = CommonService.getMetricUnit(metricName) || '';
                                    if (metricValue > 0) {
                                        if (metricUnit === '%') {
                                            metricValue = roundToHundredth(metricValue * 100);
                                        } else {
                                            metricValue = roundToHundredth(metricValue);
                                        }
                                    }
                                    //// console.log(metricName, metricValue);
                                    participantModel.metrics[metricName] = {
                                        metricValue: metricValue,
                                        metricUnit: metricUnit
                                    };
                                    // if (scoreVal > 0 && scoreVal < 1) {
                                    // scoreVal = Math.round(scoreVal * 100);
                                    // // console.log('Adjusting score value! ', scoreVal);
                                    // participantModel.metrics[metricName].metricValue = scoreVal;
                                    // }
                                    score += metricValue;
                                }
                                score = roundToHundredth(score);
                                participantModel.cumulativeScore = score;
                                // if (participantModel.score === 0 && score > 0) {
                                // participantModel.score = score;
                                // // console.log('Applying score value! ', score);
                                // }
                                if (MANAGER_MODE) {
                                    teams[teamId].participants.push(participantModel);
                                } else {
                                    participants.push(participantModel);
                                }
                                participantCount += 1;
                                //console.log(participantCount, totalParticipants);
                                if (participantCount === totalParticipants) {
                                    // console.log('ALL DONE BUILDING LEADERBOARD');
                                    finalizeLeaderboardResult();
                                }
                            };
                            if (MANAGER_MODE) {
                                // build the manager team data structure?
                                /**
                                 * @function
                                 * Closure for the getUserImage async call.
                                 */
                                (function (campaignLeaderBoardRecord, teamId) {
                                    if (!teams[teamId]) {
                                        //console.log('creating team ', teamId);
                                        teams[teamId] = {
                                            name: '',
                                            img: '',
                                            participants: []
                                        };
                                        //.filter({corpid:teamId}).pluck('name')
                                        // console.log('getMyCampaignLeaderboard getUserImage 0');
                                        manager.filter({
                                            corpid: teamId
                                        }).pluck('name').then(function (managerInfo) {
                                            //console.log('MANAGER NAME: ' + managerInfo[0].name);
                                            teams[teamId].name = managerInfo[0].name;
                                            // FIXME: no error handling here... what happens?
                                            var beforeGetUserImage = new Date().getTime();
                                            // console.log('getMyCampaignLeaderboard getUserImage 1');
                                            UserService.getUserImage(teamId).then(function (img) {
                                                //console.log('getUserImage took ', new Date().getTime() - beforeGetUserImage, ' ms.');
                                                teams[teamId].img = img;
                                                populateLeaderboard(campaignLeaderBoardRecord, '');
                                            });
                                        });
                                    } else {
                                        populateLeaderboard(campaignLeaderBoardRecord, '');
                                    }
                                    // // FIXME: no error handling here... what happens?
                                    // var beforeGetUserImage = new Date().getTime();
                                    // UserService.getUserImage(campaignLeaderBoardRecord.participant_id).then(function(img) {
                                    // //console.log('getUserImage took ', new Date().getTime() - beforeGetUserImage, ' ms.');
                                    // populateLeaderboard(campaignLeaderBoardRecord, img);
                                    // });
                                })(campaignLeaderBoardRecord, teamId);
                            } else {
                                /**
                                 * @function
                                 * Closure for the getUserImage async call.
                                 */
                                (function (campaignLeaderBoardRecord) {
                                    // console.log('getMyCampaignLeaderboard getUserImage 2');
                                    // FIXME: no error handling here... what happens?
                                    var beforeGetUserImage = new Date().getTime();
                                    UserService.getUserImage(campaignLeaderBoardRecord.participant_id).then(function (img) {
                                        //console.log('getUserImage took ', new Date().getTime() - beforeGetUserImage, ' ms.');
                                        populateLeaderboard(campaignLeaderBoardRecord, img);
                                    });
                                })(campaignLeaderBoardRecord);
                            }
                        }
                    });
                };
            });
            return resultPromise;
        }
    },
    buildScoreCardResult: function (myCampaign, myMetricsScores, resolve, reject) {
        //console.log('buildScoreCardResult: myMetricsScores with ', JSON.stringify(myMetricsScores, null, 2));
        var goals = myCampaign.goals;
        var scoreCardModel = {
            "refid": myCampaign.refid,
            "ticketToPlay": myCampaign.ticketToPlay,
            "metrics": [],
            "score": -1
        };
        //console.log('buildScoreCardResult: starting with ', JSON.stringify(scoreCardModel, null, 2));
        //to round up to two decimal places
        var roundToHundredth = function (num) {
            return Math.ceil(num * 100) / 100;
        };
        scoreCardModel.ticketToPlay.value = 0;
        var ttp = scoreCardModel.ticketToPlay;
        for (var g = 0; g < goals.length; g += 1) {
            var goal = goals[g];
            var metricData = null;
            goal.metric = goal.metric.toLowerCase();
            // console.log(goal);
            if (myMetricsScores !== null && myMetricsScores.metrics[goal.metric] != null) {
                //console.log('Match between my campaign and my metric! ', goal.metric);
                metricData = myMetricsScores.metrics[goal.metric];
                //console.log('Match between my campaign and my metric! ', metricData);
            } else if (myMetricsScores !== null && myMetricsScores.metrics[ttp] != null) {
                //console.log('Match between my campaign and my ttp metric! ', goal.metric);
                metricData = myMetricsScores.metrics[goal.metric];
                //console.log('Match between my campaign and my ttp metric! ', metricData);
            } else {
                // skip over, there is no data!!!
                continue;
            }
            var metricModel = {};
            metricModel.name = goal.metric;
            metricModel.count = metricData !== null ? metricData.count : 0;
            metricModel.value = (metricData !== null ? metricData.total : 0);
            // TODO: how to derive target from campaign?
            metricModel.target = goal.goal;
            // metricModel.target = goal.target;
            metricModel.unitOfMeasure = goal.unitOfMeasure;
            // TODO: how to show the correct unit for each metric????
            metricModel.metricUnit = CommonService.getMetricUnit(goal.metric) || '';
            // apply scaling for units
            if (metricModel.metricUnit === '%') {
                if (metricModel.value > 0) {
                    metricModel.value = roundToHundredth((metricModel.value / metricModel.count) * 100);
                }
            } else {
                if (metricModel.value > 0) {
                    metricModel.value = roundToHundredth(metricModel.value / metricModel.count);
                }
            }
            if (ttp.metric === goal.metric) {
                console.log('Scorecard: copy metric ', goal.metric, ' to TTP:', metricModel.value);
                scoreCardModel.ticketToPlay.value = metricModel.value;
                scoreCardModel.ticketToPlay.metricUnit = metricModel.metricUnit;
                scoreCardModel.ticketToPlay.unitOfMeasure = metricModel.unitOfMeasure;
            }
            if (metricData.isToBePopulatedOnLeaderboard) {
                scoreCardModel.metrics.push(metricModel);
            }
        }
        scoreCardModel.score = myMetricsScores !== null ? myMetricsScores.score : 0;
        scoreCardModel.ticketToPlay.enabled = false;
        scoreCardModel.ticketToPlay.playing = false;
        // can't be playing if not enabled
        if (scoreCardModel.ticketToPlay.metric != null && scoreCardModel.ticketToPlay.metric.trim() !== '' && scoreCardModel.ticketToPlay.value != null) {
            scoreCardModel.ticketToPlay.enabled = true;
            if (scoreCardModel.ticketToPlay.value >= scoreCardModel.ticketToPlay.threshold) {
                scoreCardModel.ticketToPlay.playing = true;
                //scoreCardModel.ticketToPlay.caption = "GREAT JOB! You are successfully hitting your ticket to play.";
            }
        }
        //console.log('buildScoreCardResult: ending with ', JSON.stringify(scoreCardModel, null, 2));
        resolve(scoreCardModel);
    },
    addMetricsValuesToScoreCard: function (userId, persona, myCampaign, teamMembers) {
        // if (teamMembers){
        // console.log('>>>>>>>>>> teamMembers: ', teamMembers);
        // }
        var resultPromise = new Promise(function (resolve, reject) {
            var myMetricsScores = null;
            if (persona === 'associate') {
                //console.log('>>>>>>>>>>>>>>>>> addMetricsValuesToScoreCard get campaignMetricsData for ', userId);
                associate.get(userId).then(function (myData) {
                    var campaignMetricsData = myData.campaignMetricsData;
                    //console.log('>>>>>>>>>>>>>>>>> addMetricsValuesToScoreCard GOT campaignMetricsData for ', userId);
                    if (campaignMetricsData == null || campaignMetricsData === {}) {
                        console.warn('NO SCORE INFO IN MY ASSOCIATE RECORD');
                        //reject(new Error('query did not find campaign metrics for this associate'));
                        resolve({
                            msg: 'query did not find campaign metrics for this associate'
                        });
                    } else {
                        // console.log('Got my raw scores in associate.campaignMetricsData: ', JSON.stringify(campaignMetricsData, null, 2));
                        // console.log('But does it have this campaign?');
                        if (campaignMetricsData[myCampaign.refid]) {
                            // console.log('YES!');
                            myMetricsScores = campaignMetricsData[myCampaign.refid];
                            // console.log(myMetricsScores);
                        }
                        CampaignService.buildScoreCardResult(myCampaign, myMetricsScores, resolve, reject);
                    }
                }).error(function (err) {
                    console.warn('NO SCORE INFO IN MY ASSOCIATE RECORD', err);
                    reject(err);
                });
            } else {
                if (teamMembers) {
                    console.log('addMetricsValuesToScoreCard for manager with teamMembers');
                    try {

                        myMetricsScores = {
                            "metrics": {},
                            "score": 0
                        };
                        var campaignMetrics = {};
                        var goals = myCampaign.goals;
                        for (var g = 0; g < goals.length; g += 1) {
                            var goal = goals[g];
                            campaignMetrics[goal.metric] = 0;
                        }
                        var includedParticipants = 0;
                        for (var t = 0; t < teamMembers.length; t += 1) {
                            var teamMember = teamMembers[t];
                            //console.log(JSON.stringify(teamcMember, null, 2));
                            var metrics = teamMember.campaignMetrics;
                            var score = teamMember.score;
                            // Using the metrics defined in the campaign, get the values from this team member's metrics.
                            for (var m in campaignMetrics) {
                                if (campaignMetrics.hasOwnProperty(m)) {
                                    if (myMetricsScores.metrics[m] == null) {
                                        //console.log('Ensure scorecard has metric "' + m + '".');
                                        myMetricsScores.metrics[m] = {
                                            "count": 0,
                                            "isToBePopulatedOnLeaderboard": true,
                                            "lastUpdatedDate": "",
                                            "total": 0
                                        };
                                    }
                                    // Don't try to copy a metric from a team member if it does not exist.
                                    if (metrics.hasOwnProperty(m)) {
                                        var metric = metrics[m];
                                        // ADD ALL TOTAL, ADD ALL COUNT
                                        // Get the existing copy.
                                        var managerMetric = myMetricsScores.metrics[m];
                                        // Do not include count or total if the score is zero.
                                        if (score > 0) {
                                            console.log('score for associate ' + teamMember.id + ' was obove zero');
                                            // Bump the total.
                                            managerMetric.total += metric.total;
                                            // Bump the count.
                                            managerMetric.count += metric.count;
                                            includedParticipants += 1;
                                        }
                                        // Assuming isToBePopulatedOnLeaderboard logic is same for each team member.
                                        managerMetric.isToBePopulatedOnLeaderboard = metric.isToBePopulatedOnLeaderboard;
                                        // This is not a very important field, but copying it to include general info.
                                        managerMetric.lastUpdatedDate = metric.lastUpdatedDate;
                                        // Copy it back explicitly.
                                        myMetricsScores.metrics[m] = managerMetric;
                                    }
                                }
                            }
                            // ADD SCORES TOGETHER
                            myMetricsScores.score += score;
                            console.log('Cumulative score for the team: ' + myMetricsScores.score);
                        }
                        if (myMetricsScores.score > 0) {
                            myMetricsScores.score = myMetricsScores.score / includedParticipants;
                        }
                        //console.log(myMetricsScores);
                        CampaignService.buildScoreCardResult(myCampaign, myMetricsScores, resolve, reject);
                    } catch (theError) {
                        console.log('addMetricsValuesToScoreCard', theError);
                        reject(theError);
                    }
                } else {
                    console.log('ERROR: addMetricsValuesToScoreCard No team metrics for this manager scoreCard in userData.');
                    reject(new Error('Bad request. No team metrics for this manager scoreCard in userData.'));
                }
            }

        });
        return resultPromise;
    },
    getMyCampaignScoreCard: function (userData) {
        ////////////////////////////////// HACK //////////////////////////////////////
        // userData.campaignId = '36913db9-e190-4532-b03d-021d9d647c70';
        // userData.userId = 'A201174';
        // userData.role = 'HNW Service Associate Tier 2';
        // userData.persona = 'associate';
        ////////////////////////////////// END HACK //////////////////////////////////////
        var data = {};
        if (USE_STATIC_DATA) {
            data = {
                "ticketToPlay": {
                    "metric": "IOE",
                    "threshold": 60,
                    "value": 65,
                    "unitOfMeasure": "ABSOLUTE"
                },
                "metrics": [{
                    "name": "AHT",
                    "value": 183,
                    "unitOfMeasure": "s"
				}, {
                    "name": "IOE",
                    "value": 65,
                    "unitOfMeasure": "%"
				}]
            };
            return promise.resolve(data);
        } else {
            return CampaignService.getMyCampaign(userData, false);
        }
    },
    /**
     * @param {String}
     *          campaignId
     * @param {String}
     *          longRoleName Optional. If longRoleName is provided, filter by this role, otherwise incude all roles.
     * @return {Promise} object containing roles in the campaign with team members in under each role
     */
    getCampaignParticipants: function (campaignId, roleName) {
        // console.log('getCampaignParticipants(', campaignId, roleName, ')');
        if (USE_STATIC_DATA) {
            var participants = {
                'HNW Service Associate Tier 1': [{
                    id: 'A022859',
                    name: 'Bob Associate',
                    team: 'A529176'
				}]
            };
            return promise.resolve(participants);
        } else {
            var r = thinky.r;
            var resultPromise = new Promise(function (resolve, reject) {
                var participants = {};
                // 1) Get campaign.
                // 2) Get roles.
                // 3) Get blacklist.
                // 4) Query associates under this role.
                // r.db("pia_mypath_test").table('associate').filter({'role': 'SVC Core Trader'}).count()
                // 5) Apply blacklist.
                // 1) Get campaign.
                // console.log('Get the campaign.');
                campaign.get(campaignId).then(function (theCampaign) {
                    // console.log('Got the campaign: ', theCampaign);
                    var associateOrManagerPortion = theCampaign.associate;
                    var roles = associateOrManagerPortion.roles;
                    var participants = {};
                    var roleCount = roles.length;
                    var completionCount = 0;
                    // console.log('Found roles: ' + roleCount);
                    for (var index = 0; index < roles.length; index += 1) {
                        var role = roles[index];
                        var blackList = role.blacklist;
                        // console.log('Found a role: "' + role.title + '".');
                        // // console.log('Applying blacklist: "' + JSON.stringify(blackList) + '".');
                        participants[role.title] = [];
                        // Only associates, not managers, etc.
                        // r.db("pia_mypath_test").table('associate').filter({'role': 'SVC Core Trader', 'active':
                        // true}).pluck('id')
                        // console.log('Getting all associates with this role: "' + role.title + '".');
                        var lookByRole = function (roleName, onlyThisOne) {
                            // function(participant) {
                            // // {
                            // // 'role' : roleName,
                            // // 'active' : true
                            // // }
                            // return participant('role').eq(roleName).and(participant('active')).and(participant('campaignMetricsData').ne({}));
                            // }
                            associate.filter({
                                'role': roleName,
                                'active': true
                            }).without('goal', 'metric').run().then(function (participantsForRole) {
                                var userList = [];
                                // console.log('Got all associates with this role: "' + roleName + '": ' + participantsForRole.length);
                                // // console.log(participantsForRole);
                                for (var a = 0; a < participantsForRole.length; a += 1) {
                                    var partic = participantsForRole[a];
                                    if (partic.campaignMetricsData[theCampaign.id]) {
                                        if (blackList.indexOf(partic.id) === -1) {
                                            userList.push(partic.id);
                                        }
                                    }
                                }
                                participants[roleName] = userList;
                                completionCount += 1;
                                if (completionCount === roleCount || onlyThisOne) {
                                    // console.log('getCampaignParticipants - done');
                                    resolve(participants);
                                }
                            });
                        };
                        var theLongRoleName = role.title;
                        // console.log('Convert short name ', role.title, ' to long name ', theLongRoleName);
                        if (roleName != null && roleName !== '') {
                            if (roleName === theLongRoleName) {
                                lookByRole(theLongRoleName, true);
                            }
                        } else {
                            lookByRole(theLongRoleName);
                        }
                    }
                    if (roleCount === 0) {
                        resolve(participants);
                    }
                }).error(function (err) {
                    // console.error(err);
                    reject(err);
                });
            });
            return resultPromise;
        }
    },
    fixCampaignMetricNames: function (theCampaign, writeNow) {
        // console.log('Fixing metric names.');
        try {
            if (theCampaign.associate) {
                var node = theCampaign.associate;
                for (var r = 0; r < node.roles.length; r += 1) {
                    var role = node.roles[r];
                    var goals = role.goals;
                    if (goals) {
                        for (var g = 0; g < goals.length; g += 1) {
                            var goal = goals[g];
                            goals[g].metric = goal.metric.toLowerCase();
                        }
                    }
                    if (role.ticketToPlay) {
                        role.ticketToPlay.metric = role.ticketToPlay.metric.toLowerCase();
                    }
                }
            }
            if (theCampaign.teamOrManager) {
                var node = theCampaign.teamOrManager;
                for (var r = 0; r < node.roles.length; r += 1) {
                    var role = node.roles[r];
                    var goals = role.goals;
                    if (goals) {
                        for (var g = 0; g < goals.length; g += 1) {
                            var goal = goals[g];
                            goals[g].metric = goal.metric.toLowerCase();
                        }
                    }
                    if (role.ticketToPlay) {
                        role.ticketToPlay.metric = role.ticketToPlay.metric.toLowerCase();
                    }
                }
            }
            var fixCamp = function (theCampaign) {
                campaign.get(theCampaign.id).update(theCampaign).execute().then(function (updated) {
                    // console.log('Updated campaign ', theCampaign.id);
                }).error(function (err) {
                    // process error
                    console.error(err);
                });
            };
            if (writeNow === true) {
                fixCamp(theCampaign);
            }
        } catch (e) {
            console.error(e);
        }
        return theCampaign;
    },
    utils: CampaignUtilities
};
module.exports = CampaignService;