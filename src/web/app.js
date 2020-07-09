Ext.require([
    'criterion.Consts',
    'criterion.Api',
    'criterion.locale.Common',
    'Ext.state.CookieProvider',
    'Ext.state.LocalStorageProvider',
    'criterion.consts.Packages'
], function() {
    var Api = criterion.Api,
        preloadPackage = Ext.Array.findBy(
            Ext.Object.getValues(criterion.consts.Packages.ADMIN),
            function(pkg) {
                return Ext.String.startsWith(location.hash, '#' + pkg.ROUTE);
            });

    Ext.state.Manager.setProvider(Ext.create(
        Ext.util.LocalStorage.supported ? 'Ext.state.LocalStorageProvider' : 'Ext.state.CookieProvider'
    ));

    criterion.Api.isAuthenticated(function(isAuth, result) {
        if (!isAuth) {
            var response = Ext.decode(result && result.responseText, true);

            return Api.showAccessDeniedMessage(response && response.message);
        } else if (result['isTerminated']) {
            window.location = criterion.consts.Route.getDirect(criterion.consts.Route.SELF_SERVICE.MAIN);
        } else if (!Api.getEmployerId()) {
            return Api.showAccessDeniedMessage();
        }

        Ext.require([
            'criterion.CodeDataManager',
            'web.Application'
        ], function() {
            if (result.codeTables) {
                criterion.CodeDataManager.loadCodeTablesFromData(result.codeTables);
            } else {
                criterion.CodeDataManager.loadCodeTables();
            }

            if (result.securityEssFunctions)
                criterion.CodeDataManager.getStore(criterion.consts.Dict.SECURITY_ESS_FUNCTION).loadData(result.securityEssFunctions);

            if (preloadPackage) {
                Ext.Package.load(preloadPackage.NAME).then(function() {
                    Ext.get('criterion-loader').remove();
                    Ext.application('web.Application');
                });
            } else {
                Ext.get('criterion-loader').remove();
                Ext.application('web.Application');
            }
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
