define(function(require) {
	var Bridge = require('blue/bridge'),
		payeeEnterWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/payeeEnter'),
		payeeListVerifyWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/payeeListVerify'),
		payeeVerifyAddressWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/payeeVerifyAddress'),
		payeeConfirmWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/payeeConfirm'),
		payeeManualAddWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/payeeManualAdd'),
		payeeManualVerifyWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/payeeManualVerify'),
		payeeManualConfirmWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/payeeManualConfirm'),
		singlePaymentEnterWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/singlePaymentEnter'),
		singlePaymentVerifyWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/singlePaymentVerify'),
		singlePaymentConfirmWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/singlePaymentConfirm'),
		singlePaymentEnterFundAccountWebSpec = require('dashboard/view/webspec/payments/merchantBillPay/singlePaymentEnterFundAccount');

	return {
		payeeEnterBridge: Bridge.create(payeeEnterWebSpec),
		payeeListVerifyBridge: Bridge.create(payeeListVerifyWebSpec),
		payeeVerifyAddressBridge: Bridge.create(payeeVerifyAddressWebSpec),
		payeeConfirmBridge: Bridge.create(payeeConfirmWebSpec),
		payeeManualAddBridge: Bridge.create(payeeManualAddWebSpec),
		payeeManualVerifyBridge: Bridge.create(payeeManualVerifyWebSpec),
		payeeManualConfirmBridge: Bridge.create(payeeManualConfirmWebSpec),
		singlePaymentEnterBridge: Bridge.create(singlePaymentEnterWebSpec),
		singlePaymentVerifyBridge: Bridge.create(singlePaymentVerifyWebSpec),
		singlePaymentConfirmBridge: Bridge.create(singlePaymentConfirmWebSpec),
		singlePaymentEnterFundAccountBridge: Bridge.create(singlePaymentEnterFundAccountWebSpec)
	};
});
