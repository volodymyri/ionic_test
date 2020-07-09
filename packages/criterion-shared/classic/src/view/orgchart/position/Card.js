Ext.define('criterion.view.orgchart.position.Card', function() {

    var infoTpl = Ext.create('Ext.XTemplate',
        '<div class="{[values.isOpen ? "open" : ""]}">' +
            '<span class="triggerHolder"></span>' +
            '<p class="title"><span>{title:htmlEncode}</span></p>' +
            '<p class="position"><span>{positionTitle:htmlEncode}</span></p>' +
            '<tpl if="employerName && !isEmployerNameHidden">' +
                '<p class="employer"><span>{employerName}</span></p>' +
            '</tpl>' +
            '<tpl if="this.showFTE(values)">' +
            '<p class="icons">' +
                    '<span class="fte" title="Full Time Equivalency">' +
                        '<span class="fteLabel">{[this.getFTText()]}</span>' +
                            '<span class="fteCount">{fullTimeEquivalency:round(2)}</span>' +
                    '</span>' +
                    '<tpl if="subordinatesCount">',
                        '<span title="Managing">' +
                            '<span class="subIcon"></span><span class="subCount">' +
                                '{subordinatesCount}' +
                            '</span>' +
                        '</span>' +
                    '</tpl>' +
            '</p>' +
            '</tpl>' +
        '</div>',
        {
            getFTText : function() {
                return i18n.gettext('FT');
            },
            showFTE : function(values) {
                return values.isOpen ? false : Ext.isNumber(values.fullTimeEquivalency);
            },
            compiled : true
        }
        ),
        photoTpl = Ext.create('Ext.XTemplate',
            '<tpl if="havePerson">',
                '<div class="circular" style="background-image: url({url})"></div>',
            '</tpl>',
            {
                compiled : true
            });

    return {
        alias : 'widget.criterion_orgchart_position_card',

        extend : 'criterion.ux.form.Panel',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        bodyPadding : '0 0 16',

        config : {
            record : null,
            goToProfile : true,
            isEmployerNameHidden : true
        },

        listeners : {
            scope : 'this',
            afterrender : 'updateInnerComponents',
            beforerender : function(){
                this.setVisible(false);
            },
            destroy: 'cleanupButtons',
            el : {
                scope : 'this',
                delegate : '.circular',
                click : 'onZoom'
            }
        },

        layout : 'hbox',

        items : [
            {
                xtype : 'component',
                cls : 'photo',
                itemId : 'photo',
                tpl : photoTpl
            },
            {
                xtype : 'component',
                itemId : 'info',
                cls : 'info',
                tpl : infoTpl,
                flex : 1
            }
        ],

        /**
         * @protected
         */
        getProfileUrl : function() {
            return 'HR/employee/' + this.record.get('personId')
        },

        /**
         * protected
         * @returns {string}
         */
        getProfilePicUrl : function() {
            var personId = this.record.get('personId');

            return personId ? criterion.Utils.makePersonPhotoUrl(personId, criterion.Consts.USER_PHOTO_SIZE.ORG_CHART_ICON_WIDTH, criterion.Consts.USER_PHOTO_SIZE.ORG_CHART_ICON_HEIGHT) :
                criterion.consts.Api.API.EMPLOYEE_NO_PHOTO;
        },

        /**
         * @private
         */
        _personBtn: null,

        onZoom: function() {
            this.fireEvent('zoom', this.record);
        },

        cleanupButtons: function() {
            Ext.destroy(this._personBtn);
        },

        renderInlineComponents : function() {
            var me = this,
                record = this.record,
                menuItems = [],
                inaccessible = record.get('inaccessible');

            if (!record) {
                this.setVisible(true);
                return;
            }

            this.cleanupButtons();

            if (this.el && record.getId()) { // if id === 0 then we have virtual node
                this.goToProfile && record.get('employeeId') && menuItems.push({
                    text : i18n.gettext('Go to Profile'),
                    listeners : {
                        click : function() {
                            me.fireEvent('gotoProfile', record);
                        }
                    }
                });

                if (menuItems.length && !inaccessible) {
                    this._personBtn = new Ext.Button({
                        renderTo : this.el.down('.triggerHolder'),
                        cls : 'criterion-position-card-trigger',
                        padding: '0 5 0 0',
                        width: '100%',
                        menuAlign: 'tr-br',
                        menu : {
                            shadow : false,
                            plain: true,
                            items : menuItems
                        }
                    });
                }

                if (!inaccessible) {
                    if (!record.get('title')) {
                        !this.hasCls('criterion-position-card-open') && this.addCls('criterion-position-card-open');
                    } else {
                        this.hasCls('criterion-position-card-open') && this.removeCls('criterion-position-card-open');
                    }
                }
            }
        },

        updateRecord : function(record, oldRecord) {
            this.record = record;

            if (record && this.rendered) {
                this.updateInnerComponents();
            }
        },

        updateInnerComponents : function() {
            var record = this.record;

            if (record) {
                this.down('#info').update(Ext.apply(record.getData(), {
                    title : record.get('title') || i18n.gettext('Open'),
                    isOpen : !record.get('title'),
                    positionName : record.get('desc'),
                    isEmployerNameHidden : this.getIsEmployerNameHidden(),
                    profileUrl : this.getProfileUrl()
                }));

                this.down('#photo').update({
                    havePerson : !!record.get('title'),
                    url : record.get('title') ? this.getProfilePicUrl() : ''
                });

                this.renderInlineComponents();
                this.setVisible(true);
            }
        }
    };

});
