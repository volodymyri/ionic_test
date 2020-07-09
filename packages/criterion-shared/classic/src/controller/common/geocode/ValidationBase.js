Ext.define('criterion.controller.common.geocode.ValidationBase', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_common_geocode_validation_base',

        load() {
            let view = this.getView(),
                dfd = Ext.create('Ext.Deferred'),
                vm = this.getViewModel();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : view.fixesURL,
                method : 'GET'
            }).then((result) => {
                vm.getStore('autoFixes').loadRawData(Ext.clone(result['autoFix']));
                vm.getStore('fixes').loadRawData(Ext.clone(result['manualFix']));

                dfd.resolve();
            }).always(_ => {
                view.setLoading(false);
            });

            return dfd.promise;
        },

        handleEditManualFix(rowEdit, cfg) {
            let view = this.getView(),
                rec = cfg.record;

            rec.set({
                newgeoCode : null,
                geocode : null,
                schdist : null
            });

            view.setLoading(true);

            rec.reloadGeoCodes().always(_ => {
                view.setLoading(false);
            });
        },

        handleReloadGeoCodes(cmp, tr, e) {
            let view = this.getView(),
                rec = cmp.$widgetRecord;

            rec.set({
                newgeoCode : null,
                geocode : null,
                schdist : null
            });

            view.setLoading(true);
            rec.reloadGeoCodes().always(_ => {
                view.setLoading(false);
            });
        },

        handleUpdate() {
            let vm = this.getViewModel(),
                view = this.getView(),
                dfd = Ext.create('Ext.Deferred'),
                autoFixes = vm.getStore('autoFixes'),
                fixes = vm.getStore('fixes'),
                data = [];

            // add auto fixes
            autoFixes.each(afix => {
                data.push({
                    id : afix.getId(),
                    geocode : afix.get('geocode'),
                    schdist : afix.get('schdist')
                })
            });

            // add manual fixes
            fixes.each(fix => {
                let dataEl = {
                        id : fix.getId()
                    },
                    hasModified = false;

                Ext.each(Ext.Object.getKeys(fix.modified), modified => {
                    dataEl[modified] = fix.get(modified);
                    hasModified = true;
                });

                if (hasModified) {
                    data.push(dataEl);
                }
            });

            if (data.length) {
                criterion.Api.requestWithPromise({
                    url : view.fixesURL,
                    method : 'PUT',
                    jsonData : {
                        data
                    }
                }).then(_ => {
                    dfd.resolve();
                }, _ => {
                    dfd.reject();
                })
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        }

    };
});
