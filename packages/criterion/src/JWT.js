Ext.define('criterion.JWT', function() {

    var tokenStorageName = 'Authorization',
        sessionCookieName = 'session',
        secInMonth = 60 * 60 * 24 * 30;

    return {
        singleton : true,

        getToken : function() {
            return criterion.Utils.getCookie(tokenStorageName);
        },

        setToken : function(value) {
            if (value) {
                criterion.Utils.setCookie(tokenStorageName, value, !!criterion.Utils.getCookie(sessionCookieName) ? {
                    expires : secInMonth,
                    'max-age' : secInMonth
                } : {});
            } else {
                this.clearToken();
            }
        },

        clearToken : function() {
            criterion.Utils.removeCookie(tokenStorageName);
        },

        getTokenPayload : function() {
            var token = this.getToken(),
                base64 = token && token.split('.').length > 1 && token.split('.')[1].replace('-', '+').replace('_', '/');

            return base64 && JSON.parse(atob(base64));
        },

        getTenantId : function() {
            var payload = this.getTokenPayload();

            return payload && payload['tenantId'];
        }
    };
});
