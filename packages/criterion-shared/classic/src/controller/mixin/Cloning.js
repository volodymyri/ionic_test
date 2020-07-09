Ext.define('criterion.controller.mixin.Cloning', function() {

    return {

        extend : 'Ext.Mixin',

        mixinId : 'criterion_cloning',

        getParamsForCloning(data, item) {
            return {}
        },

        getFullCloneUrl(url, data, item) {
            return Ext.String.format(url, item.id);
        },

        actCloneItems(title, url, data, employerId, cloneItems) {
            let me = this,
                employerSelector = me.lookup('employerSelector'),
                view = this.getView(),
                progress, seq = [],
                len = cloneItems.length,
                errInfo;

            progress = criterion.Msg.progress(title, i18n.gettext('Cloning in progress'), i18n.gettext('Processing...'));

            view.setLoading(true);

            Ext.Array.each(cloneItems, (item, index) => {
                let value = (index + 1) * 100 / len;

                seq.push(() => {
                    let dfd = Ext.create('Ext.promise.Deferred');

                    progress.updateProgress(value / 100, i18n.gettext('please wait...'), i18n.gettext('Cloning') + ' ' + item.name);

                    criterion.Api.requestWithPromise({
                        url : me.getFullCloneUrl(url, data, item),
                        jsonData : me.getParamsForCloning(data, item),
                        method : 'POST',
                        silent : true
                    }).then(() => {
                        dfd.resolve();
                    }, response => {
                        let data = response && (Ext.decode(response.responseText, true) || response.responseText),
                            errorInfo = criterion.consts.Error.getErrorInfo(data);

                        if (errorInfo) {
                            if (!errInfo) {
                                errInfo = Ext.clone(errorInfo);
                            } else {
                                errInfo.description += '<br>' + errorInfo.description;
                            }
                        }

                        dfd.resolve();
                    });

                    return dfd.promise;
                })
            });

            Ext.Deferred.sequence(seq).always(() => {
                view.getSelectionModel().deselectAll();

                progress.progressBar.isVisible() && progress.close();

                view.setLoading(false);

                if (errInfo) {
                    criterion.consts.Error.showMessageBox(errInfo.description, errInfo.level, errInfo.code);
                }

                if (!employerId || data.employerId === employerId) {
                    me.load();
                } else {
                    employerSelector && employerSelector.setEmployerValue(data.employerId);
                }
            });
        }
    }

});
