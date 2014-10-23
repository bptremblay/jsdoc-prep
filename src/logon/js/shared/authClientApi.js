/**
 * @module authClientApi
 *
 * login bridge using alogin.jsp which implements auth parameter randomization (APR)
 * Can both login and verify a one time password (otp)
 */
define(function() {
    return {
            /**
             * Might be ignored, always 'RBGLogon'
             */
            lob: 'RBGLogon',

            /**
             * Id of site user is logging in from
             */
            siteId: null,

            /**
             * User's id/login name
             */
            userId: null,

            /**
             * User's password
             */
            password: null,

            /**
             * Reason for one time password (otp)
             */
            otpreason: null,

            /**
             * Prefix for one time password (otp)
             * Returned as reason from Authentication-v1-OTP-Send
             */
            otpprefix: null,

            /**
             * The one time password sent to the user
             */
            otp: null,

            /**
             * Calls auth login
             * @returns {undefined}
             */
            authenticate: function() {
                var serviceData = [{
                     siteId: this.siteId,
                     userId: this.userId ? this.userId.toLowerCase(): null,
                     password: this.password ? this.password.toLowerCase() : null,
                     password_org: this.password || null,
                     token: null,
                     lob: this.lob,
                     auth_externalData: 'LOB=' + this.lob,
                     parentWindowLocation: document.location
                 }],
                 loginframe = document.getElementById('loginframe').contentWindow;

                 if (this.otp !== null) {
                     serviceData.otp = this.otp;
                     serviceData.otpreason = this.otpreason;
                     serviceData.otpprefix = this.otpprefix;
                 }

                loginframe.postMessage(JSON.stringify(serviceData), '*'); // TODO set domain
            },
            mask: function(id) {

			 if (id.length > 0) {
			 	return id.substring(0,2) + id.substring(2, id.length-2).replace(/./g,'*') + id.substring(id.length-2);
			 }

            }
        };
});


