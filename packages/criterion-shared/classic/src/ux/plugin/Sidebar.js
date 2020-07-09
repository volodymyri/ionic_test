/**
 * Plugin which makes sidebar from any component.
 */
Ext.define('criterion.ux.plugin.Sidebar', function() {

    return {
        extend : 'Ext.plugin.Abstract',

        alias : 'plugin.criterion_sidebar',

        pluginId : 'criterionSidebar',

        /**
         * @cfg modal
         */
        modal : !criterion.detectDirtyForms,

        side : 'center',

        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,

        height : '100%',

        _connectedView : null,

        handleWindowResize : function() {
            let cmp = this.cmp,
                position,
                size;

            if (cmp && cmp.rendered && this._connectedView) {
                position = this._connectedView.getPosition();
                size = this._connectedView.getSize();
                cmp.setPosition(position[0], position[1]);
                cmp.setSize(size.width, size.height);
                cmp.updateLayout();
            } else if (cmp && cmp.rendered && this.height !== 'auto') {
                cmp.setHeight(this.height);
                this.reCenter();
                cmp.updateLayout();
            }
        },

        changeWidth(width) {
            let cmp = this.cmp;

            if (cmp && cmp.rendered) {
                cmp.setWidth(width);
                this.reCenter();
                cmp.updateLayout();
            }
        },

        changeHeight(height) {
            let cmp = this.cmp;

            if (cmp && cmp.rendered) {
                cmp.setHeight(height);
                this.reCenter();
                cmp.updateLayout();
            }
        },

        reCenter : function() {
            this.side === 'center' && this.cmp.center();
        },

        handleBeforeRender : function(view) {
            if (view._connectedView) {
                view.addCls('criterion-connected-panel');
                this._connectedView = view._connectedView;
                this._connectedView.on('resize', this.handleWindowResize, this);
            } else {
                Ext.on('resize', this.handleWindowResize, this);
            }
        },

        handleAfterRender : function() {
            if (this.modal) {
                var body = Ext.getBody();

                if (!body.isMasked()) {
                    Ext.getBody().mask();
                }
                this.cmp.unmask();
            }
            this.handleWindowResize();
            this.cmp.toFront();
            this.cmp.focus();
        },

        init : function(view) {
            this.callParent(arguments);

            view.on('beforerender', this.handleBeforeRender, this);
            view.on('afterrender', this.handleAfterRender, this);
            view.on('show', this.handleAfterRender, this);

            view.floating = true;
            if (this.height !== 'auto') {
                view.height = this.height;
            }
            view.width = this.width;

            if (this.side === 'left') {
                view.defaultAlign = 'tl-tl';
            } else if (this.side === 'right') {
                view.defaultAlign = 'tr-tr';
            } else {
                view.defaultAlign = 'c-c';
            }
            if (this.modal) {
                view.addCls('criterion-modal');
            }
        },

        destroy : function() {
            if (this.modal) {
                Ext.getBody().unmask();
            }

            if (this._connectedView) {
                this._connectedView.un('resize', this.handleWindowResize, this);
            } else {
                Ext.un('resize', this.handleWindowResize, this);
            }

            this.cmp.un('beforerender', this.handleAfterRender, this);
            this.cmp.un('afterrender', this.handleAfterRender, this);
        }
    };

});
