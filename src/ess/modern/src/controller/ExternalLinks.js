Ext.define('ess.controller.ExternalLinks', function() {

    const SAML2TYPE = 2;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_external_links',

        load : function() {
            var vm = this.getViewModel();

            vm.getStore('links').loadWithPromise({
                params : {
                    employerId : vm.get('employerId')
                }
            });
        },

        onLinkTap : function(list, index, item, record) {
            let isSAML = record.get('type') === SAML2TYPE,
                url = isSAML ? criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYER_ESS_LINK_GET_SAML2_FORM + '?id=' + record.getId() + '&_dc=' + (+Date.now())) : record.get('url');

            window.open(url, '_system');
        }
    };
});
