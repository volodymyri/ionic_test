Ext.define('criterion.controller.mixin.ControlMaskZIndex', {

    mixinId : 'controlmaskzindex',

    getAffectedView : function() {
        return this.getView();
    },

    getNearestZIndex : function(affectedView) {
        var affectedElement = affectedView.getEl();

        while (affectedElement && !affectedElement.getZIndex()) {
            affectedElement = affectedElement.up();
        }

        return affectedElement ? affectedElement.getZIndex() : null;
    },

    setCorrectMaskZIndex : function(isSet, view) {
        var bodyData = Ext.getBody().getData(),
            maskEl = bodyData.maskEl && bodyData.maskEl.el,
            affectedView = this.getAffectedView(),
            viewZIndex;

        if (!maskEl) {
            return;
        }

        if (isSet) {
            if (view) {
                // works with components created at low hierarchy level
                view.el && maskEl.setZIndex(view.el.getZIndex() - 1);
                return;
            }

            this._storedMaskzIndex = maskEl.getZIndex();
            viewZIndex = affectedView && this.getNearestZIndex(affectedView);
            viewZIndex && maskEl.setZIndex(viewZIndex + 1);
        } else {
            maskEl.setZIndex(this._storedMaskzIndex);
        }
    }
});
