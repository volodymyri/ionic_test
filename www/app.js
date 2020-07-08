Ext.require([
    'criterion.Consts',
    'criterion.Api',
    'criterion.locale.Common',
    'criterion.consts.Packages'
], function() {
    var Api = criterion.Api,
        preloadPackage = Ext.Array.findBy(
            Ext.Object.getValues(criterion.consts.Packages.SELF_SERVICE),
            function(pkg) {
                return Ext.String.startsWith(location.hash, '#' + pkg.ROUTE);
            });

    if (preloadPackage && !Ext.isModern) {
        Ext.Package.load(preloadPackage.NAME);
    }

    criterion.Api.isAuthenticated(function(isAuth, result) {
        if (!isAuth) {
            var response = Ext.decode(result && result.responseText, true);

            return criterion.DIRECT_AUTH ? Api.logout(result) : Api.showAccessDeniedMessage(response && response.message);
        } else if (!Api.getEmployerId()) {
            return Api.showAccessDeniedMessage();
        }

        Ext.require([
            'criterion.CodeDataManager',
            'ess.Application'
        ], function() {
            if (result.codeTables) {
                criterion.CodeDataManager.loadCodeTablesFromData(result.codeTables);
            } else {
                criterion.CodeDataManager.loadCodeTables();
            }

            if (result.securityEssFunctions)
                criterion.CodeDataManager.getStore(criterion.consts.Dict.SECURITY_ESS_FUNCTION).loadData(result.securityEssFunctions);

            Ext.get('criterion-loader').remove();

            Ext.application('ess.Application');
        });
    });

    Ext.Ajax.on('beforerequest', function(conn, options) {
        if (!options._noAuth) {
            criterion.Api.setAuthorizationHeader(options);
        }
    });

    Ext.Ajax.on('requestcomplete', function(conn, response) {
        if (!response.request._noAuth) {
            criterion.Api.ajaxRequestCompleteHandler(response);
        }
    });
});
