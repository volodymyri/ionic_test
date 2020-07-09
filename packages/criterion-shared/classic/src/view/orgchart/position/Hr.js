/**
 * @deprecated
 */
Ext.define('criterion.view.orgchart.position.Hr', function() {

    return {
        alias : 'widget.criterion_orgchart_position_hr',
        extend : 'criterion.view.orgchart.position.Base',

        menuRenderer : function() {
            var items = [];

            items.push({
                    text : i18n.gettext('Modify position'),
                    action : 'modify-position',
                    positionId : this.data.positionId,
                    glyph : 0xf2bf
                },
                {
                    text : i18n.gettext('Delete position'),
                    action : 'delete-position',
                    positionId : this.data.positionId,
                    glyph : 0xf2bb
                },
                {
                    text : i18n.gettext('Create new position like this'),
                    action : 'clone-position',
                    positionId : this.data.positionId,
                    glyph : 0xf182
                });

            if (this.data.personId) {
                items.push({
                    text : i18n.gettext('Unassign position'),
                    action : 'unassign-position',
                    positionId : this.data.positionId,
                    glyph : 0xf1ec
                });
            }

            new Ext.Button({
                glyph : 0xf20e,
                renderTo : this.getMenuHolderCmp(),
                arrowCls : '',   // hide arrow even there is menu
                cls : 'criterion-btn-light',
                itemId : this.parentItemId + '_personMenu',
                padding : 0,
                disabled : this.data.type === 'empty',

                menu : {
                    shadow : false,
                    items : items
                }
            });
        }
    }

});
