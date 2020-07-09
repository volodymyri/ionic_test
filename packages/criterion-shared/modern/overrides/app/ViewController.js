Ext.define('criterion.overrides.app.ModernViewController', {

    override : 'criterion.app.ViewController',

    /**
     * Compatibility with modern
     *
     * @returns {*|Ext.Component|Ext.view.Table|Ext.Base|boolean|Boolean}
     */
    checkViewIsActive : function() {
        var view = this.getView();

        return view && view.el && view.rendered && view.el.isVisible(true);
    }
});

