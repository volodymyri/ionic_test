Ext.define('criterion.controller.Help', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_help',

        onShow : function() {
            var allLabelsCfg = criterion.consts.Help.HELP_CENTER_ROUTE_LABELS,
                hash = Ext.History.getToken(),
                view = this.getView(),
                vm = this.getViewModel(),
                matchedLabels = [],
                reportComponents = Ext.Array.filter(Ext.ComponentQuery.query('criterion_reports'), view => view.checkIsActive());

            view.getControllButtons().getComponent('helpButtons').setValue(0);
            view.setActiveItem(0);

            Ext.Array.each(allLabelsCfg, (labelCfg) => {
                let hashRegExp = labelCfg[0],
                    searchLabelCfg = labelCfg[1],
                    isPrimary = labelCfg[2];

                if (hashRegExp.test(hash)) {
                    let searchLabel = '',
                        formIdent = criterion.Application.getCurrentFormIdent();

                    if (Ext.isString(searchLabelCfg)) {
                        searchLabel = searchLabelCfg;
                    } else if (Ext.isObject(searchLabelCfg) && formIdent) {
                        searchLabel = searchLabelCfg[formIdent];
                    }

                    if (isPrimary) {
                        matchedLabels.unshift(searchLabel);
                    } else {
                        matchedLabels.push(searchLabel);
                    }
                }
            });

            if (!matchedLabels.length) {
                matchedLabels.push(criterion.consts.Help.HELP_CENTER_DEFAULT_LABEL);
            }

            if (reportComponents && reportComponents.length) {
                let reportComponentVm = reportComponents[0].getViewModel(),
                    optionsRecord = reportComponentVm && reportComponentVm.get('optionsRecord'),
                    helpLabel = optionsRecord && optionsRecord.get('helpLabel');

                if (helpLabel) {
                    matchedLabels.push(helpLabel)
                }
            }

            view.down('criterion_help_articles').queryRelated(matchedLabels);

            Ext.promise.Promise.all([
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.ZENDESK_GET_PARTNER,
                    method : 'GET'
                }),
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.ZENDESK_RELEASE_NOTES,
                    method : 'GET'
                })
            ]).then(function(response) {
                var partner = response[0],
                    releaseNotes = response[1],
                    releaseNotesStore = vm.getStore('releaseNotes');

                vm.set({
                    helpCenterEmail : partner && partner['email'] || criterion.consts.Help.HELP_CENTER_EMAIL,
                    helpCenterPhone : partner && partner['phone'] || criterion.consts.Help.HELP_CENTER_PHONE,
                    showCreateTicket : partner ? partner['isEnableTicket'] : true
                });

                releaseNotesStore.removeAll();
                releaseNotesStore.loadData(releaseNotes);
            });
        },

        onAfterRender : function() {
            this.getView().updateSize();
        },

        onToolbarHide : function() {
            var view = this.getView();

            !view.inAnimation && view.hide();
        },

        onTabToggle : function(cmp, btn) {
            if (Ext.isNumber(btn.cardIdx)) {
                this.getView().setActiveItem(btn.cardIdx);
            } else if (btn.gotoUrl) {
                window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.ZENDESK_GO_TO_EXTERNAL_URL + '?' + Ext.Object.toQueryString({url : btn.gotoUrl})), '_blank');
                this.onToolbarHide();
            }
        }

    }
});
