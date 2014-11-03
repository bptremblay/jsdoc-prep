define(function() {
	var	serviceNameMap = {
			'ACCOUNT_TYPE_MAPPER': {
				'BAC': {
					'detailSvc': 'accounts.card.detail.svc',
					'activitySvc': 'accounts.card.activity.svc'
				},
				'OLC': {
					'detailSvc': 'accounts.card.detail.svc',
					'activitySvc': 'accounts.card.activity.svc'
				},
				'PAC': {
					'detailSvc': 'accounts.card.detail.svc',
					'activitySvc': 'accounts.card.activity.svc'
				},
				'CHK': {
					'detailSvc': 'accounts.dda.detail.svc',
					'activitySvc': 'accounts.dda.activity.svc'
				},
				'SAV': {
					'detailSvc': 'accounts.dda.detail.svc',
					'activitySvc': 'accounts.dda.activity.svc'
				},
				'MMA': {
					'detailSvc': 'accounts.dda.detail.svc',
					'activitySvc': 'accounts.dda.activity.svc'
				},
				'AMA': {
					'detailSvc': 'accounts.dda.detail.svc',
					'activitySvc': 'accounts.dda.activity.svc'
				},
				'CDA': {
					'detailSvc': 'accounts.dda.detail.svc',
					'activitySvc': 'accounts.dda.activity.svc'
				},
				'IRA': {
					'detailSvc': 'accounts.dda.detail.svc',
					'activitySvc': 'accounts.dda.activity.svc'
				},
				'PPA': {
					'detailSvc': 'accounts.dda.detail.svc',
					'activitySvc': 'accounts.dda.activity.svc'
				},
				'PPX': {
					'detailSvc': 'accounts.dda.detail.svc',
					'activitySvc': 'accounts.dda.activity.svc'
				},
				'HMG': {
					'detailSvc': 'accounts.mortgage.detail.svc',
					'activitySvc': 'accounts.mortgage.activity.svc'
				},
				'ALS': {
					'detailSvc': 'accounts.auto.detail.svc',
					'activitySvc': 'accounts.auto.activity.svc'
				},
				'ALA': {
					'detailSvc': 'accounts.auto.detail.svc',
					'activitySvc': 'accounts.auto.activity.svc'
				},
				'HEO': {
					'detailSvc': 'accounts.loan.detail.svc',
					'activitySvc': 'accounts.loan.activity.svc'
				},
				'HEL': {
					'detailSvc': 'accounts.loan.detail.svc',
					'activitySvc': 'accounts.loan.activity.svc',
					'expandedSvc': 'accounts.loan.expanded.svc'
				},
				'RCA': {
					'detailSvc': 'accounts.loan.detail.svc',
					'activitySvc': 'accounts.loan.activity.svc',
					'expandedSvc': 'accounts.rca.expanded.svc'
				},
				'ILA': {
					'detailSvc': 'accounts.loan.detail.svc',
					'activitySvc': 'accounts.loan.activity.svc'
				},
				'BRC': {
					'detailSvc': 'accounts.loan.detail.svc',
					'activitySvc': 'accounts.loan.activity.svc'
				},
				'BRK': {
					'detailSvc': 'accounts.nfs.detail.svc',
					'activitySvc': 'accounts.nfs.activity.svc'
				},
				'JPF': {
					'detailSvc': 'accounts.nfs.detail.svc',
					'activitySvc': 'accounts.nfs.activity.svc'
				},
				'ANU': {
					'detailSvc': 'accounts.nfs.detail.svc',
					'activitySvc': 'accounts.nfs.activity.svc'
				},
				'BR2': {
					'detailSvc': 'accounts.nfs.detail.svc',
					'activitySvc': 'accounts.nfs.activity.svc'
				},
				'DDA': {
					'detailSvc': 'accounts.dda.detail.svc',
					'activitySvc': 'accounts.dda.activity.svc',
					'onHoldSvc': 'accounts.dda.onHold.svc',
					'prepaidOwnerSvc': 'accounts.dda.prepaid.owner.svc'
				},
				'CARD': {
					'detailSvc': 'accounts.card.detail.svc',
					'rewardSvc': 'accounts.rewards.card.svc',
					'activitySvc': 'accounts.card.activity.svc',
					'activityDetailSvc': 'accounts.card.activity.detail.svc'
				},
				'AUTOLOAN': {
					'detailSvc': 'accounts.auto.detail.svc',
					'activitySvc': 'accounts.auto.activity.svc'
				},
				'AUTOLEASE': {
					'detailSvc': 'accounts.auto.detail.svc',
					'activitySvc': 'accounts.auto.activity.svc'
				},
				'LOAN': {
					'detailSvc': 'accounts.loan.detail.svc',
					'activitySvc': 'accounts.loan.activity.svc',
                    'expandedSvc': 'accounts.loan.expanded.svc'
				},
				'MORTGAGE': {
					'detailSvc': 'accounts.mortgage.detail.svc',
					'activitySvc': 'accounts.mortgage.activity.svc',
					'expandedSvc': 'accounts.mortgage.expanded.svc'
				},
				'INVESTMENT': {
					'detailSvc': 'accounts.nfs.detail.svc',
					'activitySvc': 'accounts.nfs.activity.svc'
				},
				'DEFAULT': {
					'detailSvc': 'accounts.dda.detail.svc',
					'activitySvc': 'accounts.dda.activity.svc'
				}
			}
		};

	return {
		getServiceNames: function( name ){
			if (name && serviceNameMap[name]) {
				return serviceNameMap[name];
			}
			return '';
		}
	};
});
