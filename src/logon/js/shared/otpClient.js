/**
 * @module otpClient
 *
 * Submits login form without using alogin.jsp / auth parameter randomization (APR)
 * Delete or replace in November after APR OTP goes live or is cancelled.
 * Use verify a one time password (otp)
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
            submitOtp: function() {
                var password = this.password, /* serviceData = [{

                 }], */
                loginForm = document.getElementById('login');

				loginForm.siteId.value = this.siteId;
                loginForm.userId.value = this.userId ? this.userId.toLowerCase() : null;
                loginForm.passwd.value = password ? password.toLowerCase() : null;
                loginForm.passwd_org.value = password || null;
                loginForm.tokencode.value = null;
                loginForm.LOB.value = this.lob;
                loginForm.auth_externalData.value = 'LOB=' + this.lob;
                // loginForm.parentWindowLocation.value = document.location;
                loginForm.otp.value = this.otp;
				loginForm.otpreason.value = this.otpreason;
				loginForm.otpprefix.value = this.otpprefix;

				loginForm.submit();
            }
        };
});


