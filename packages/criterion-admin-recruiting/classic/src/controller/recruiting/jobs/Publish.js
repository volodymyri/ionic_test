Ext.define('criterion.controller.recruiting.jobs.Publish', function() {

    var Share = {
        go : function(a, type, url, title, img, text) {
            type = type || 'facebook';
            img = img || '';
            text = text || '';

            var urlSet = this[type](url, title, img, text);
            var isOpened = this.popup(urlSet);
            if (null === isOpened) {
                a.href = urlSet;
                return true;
            }
            return false;
        },

        facebook : function(purl, ptitle, pimg, text) {
            return 'http://www.facebook.com/sharer.php?s=100'
                + '&p[title]=' + encodeURIComponent(ptitle)
                + '&p[summary]=' + encodeURIComponent(text)
                + '&p[url]=' + encodeURIComponent(purl)
                + '&p[images][0]=' + encodeURIComponent(pimg);
        },
        twitter : function(purl, ptitle) {
            return 'http://twitter.com/share?'
                + 'text=' + encodeURIComponent(ptitle)
                + '&url=' + encodeURIComponent(purl)
                + '&counturl=' + encodeURIComponent(purl)
        },
        ggplus : function(purl) {
            return 'https://plus.google.com/share?url=' + encodeURIComponent(purl);
        },
        li : function(purl, ptitle, pimg, text) {
            return 'http://www.linkedin.com/shareArticle?mini=true'
                + '&url=' + encodeURIComponent(purl)
                + '&title=' + encodeURIComponent(ptitle)
                + '&summary=' + encodeURIComponent(text);
        },

        popup : function(url) {
            return window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
        }
    };

    return {

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.view.recruiting.jobs.PublishDetails'
        ],

        alias : 'controller.criterion_recruiting_jobs_publish',

        listen : {
            controller : {
                '*' : {
                    jobPostingSet : 'handleJobPostingSet'
                }
            }
        },

        load : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                me = this,
                jobPosting = vm.get('jobPosting');

            if (!jobPosting) {
                return;
            }

            vm.getStore('publishSiteJobPosting').load({
                callback : function() {
                    view.getStore().load({
                        callback : me.prepareStore,
                        scope : me
                    });
                }
            })
        },

        loadSocialCounts : function() {
            var vm = this.getViewModel(),
                url = vm.get('jobPosting.jobPortalUrl');

            if (!url) {
                return;
            }

            // Twitter
            Ext.Ajax.request({
                url : criterion.API_ROOT + '/proxy-api-twitter', // https://cdn.api.twitter.com/1/urls/count.json
                method : 'GET',
                params : {
                    url : url
                },
                scope : this,
                useDefaultXhrHeader : false,
                cors : true,
                callback : function(options, success, response) {
                    var res = Ext.JSON.decode(response.responseText, true);
                    res ? vm.set('twitterCount', res.count) : null;
                }
            });

            // LinkedIn
            Ext.Ajax.request({
                url : criterion.API_ROOT + '/proxy-api-linkedin', // 'https://www.linkedin.com/countserv/count/share'
                method : 'GET',
                params : {
                    url : url,
                    format : 'json'
                },
                scope : this,
                useDefaultXhrHeader : false,
                cors : true,
                callback : function(options, success, response) {
                    var res = Ext.JSON.decode(response.responseText, true);
                    res ? vm.set('linkedInCount', res.count) : null;
                }
            });

            // FB
            Ext.Ajax.request({
                url : criterion.API_ROOT + '/proxy-api-facebook', // 'https://graph.facebook.com'
                method : 'GET',
                params : {
                    id : url
                },
                scope : this,
                useDefaultXhrHeader : false,
                cors : true,
                callback : function(options, success, response) {
                    var res = Ext.JSON.decode(response.responseText, true);
                    res ? vm.set('facebookCount', res.shares) : null;
                }
            });

            // Google plus
            // GG+ api key AIzaSyCOg1Bpz0i56HstozWOQTewr5o0xkukZr4
            /* NOT WORKING!
             // show error : "Access Not Configured. The API (+1 API) is not enabled for your project. Please use the Google Developers Console to update your configuration."
             Ext.Ajax.request({
             url : criterion.API_ROOT + '/proxy-api-googleplus', // https://clients6.google.com/rpc
             method : 'POST',
             params : {
             key : 'AIzaSyCOg1Bpz0i56HstozWOQTewr5o0xkukZr4'
             },
             jsonData : [{
             "method" : "pos.plusones.get",
             "id" : "p",
             "params" : {
             "nolog" : true,
             "id" : url,
             "source" : "widget",
             "userId" : "@viewer",
             "groupId" : "@self"
             },
             "jsonrpc" : "2.0",
             "key" : "p",
             "apiVersion" : "v1"
             }],
             scope : this,
             useDefaultXhrHeader : false,
             cors : true,
             callback : function(options, success, response) {
             var res = Ext.JSON.decode(response.responseText, true);
             //res ? vm.set('googlePlusCount', res.shares) : null;
             }
             });
             */
        },

        prepareStore : function() {
            var vm = this.getViewModel(),
                me = this,
                view = this.getView(),
                store = view.getStore(),
                jobPostingId = vm.get('jobPosting.id'),
                publishSiteJobPosting = vm.getStore('publishSiteJobPosting'),
                hasPublish = false;

            store.each(function(rec) {
                var index = publishSiteJobPosting.findBy(function(record) {
                    return record.get('jobPostingId') === jobPostingId && record.get('publishSiteId') === rec.id;
                });

                rec.set('actionName', index === -1 ? i18n.gettext('Add') : i18n.gettext('Remove'));
                if (index !== -1) {
                    rec.set('publishDate', publishSiteJobPosting.getAt(index).get('publishDate'));
                    hasPublish = true;
                }
            });

            vm.set('showSocial', hasPublish);
            hasPublish && me.loadSocialCounts();
        },

        handleJobPostingSet : function() {
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        handleDetailsButton : function(btn) {
            var vm = this.getViewModel(),
                jobPostingId = vm.get('jobPosting').getId(),
                tenantId = criterion.Api.getTenantId(),
                publishSite = btn.getWidgetRecord(),
                publishSiteId = publishSite.getId(),
                jobPortalUrl = publishSite.get('jobPortalUrl') + '/jobs', // TODO refactor D2-10221 and D2-10222
                baseUrl = Ext.String.format('{0}/{1}/{2}', jobPortalUrl, tenantId, publishSiteId);

            var window = Ext.create('criterion.view.recruiting.jobs.PublishDetails', {
                viewModel : {
                    data : {
                        jobPostingUrl : Ext.String.format('{0}/{1}', baseUrl, jobPostingId),
                        jobApplyUrl : Ext.String.format('{0}/{1}/apply', baseUrl, jobPostingId)
                    }
                }
            });

            window.show();
        },

        handleActionButton : function(btn) {
            var me = this,
                vm = this.getViewModel(),
                publishSiteJobPosting = vm.getStore('publishSiteJobPosting'),
                index,
                rec = btn.getWidgetRecord(),
                jobPostingId = vm.get('jobPosting.id'),
                publishSiteId = rec.getId();

            if (rec.get('publishDate')) {
                // remove
                index = publishSiteJobPosting.findBy(function(record) {
                    return record.get('jobPostingId') === jobPostingId && record.get('publishSiteId') === publishSiteId;
                });
                publishSiteJobPosting.removeAt(index);
            } else {
                // add
                publishSiteJobPosting.add({
                    jobPostingId : jobPostingId,
                    publishSiteId : publishSiteId,
                    publishDate : new Date()
                });
            }

            //Workaround for CRITERION-5393
            btn.blur();

            publishSiteJobPosting.sync({
                success : function() {
                    me.load();
                }
            })
        },

        handleTextChange : function(button, oldText, newText) {
            if (newText == i18n.gettext('Remove')) {
                button.removeCls('criterion-btn-primary');
                button.addCls('criterion-btn-remove');
            } else {
                button.removeCls('criterion-btn-remove');
                button.addCls('criterion-btn-primary');
            }
        },

        handleShareLinkedIn : function() {
            Share.go(document.location, 'li', this.getViewModel().get('jobPosting.jobPortalUrl'), '', '', '');
        },

        handleShareTwitter : function() {
            Share.go(document.location, 'twitter', this.getViewModel().get('jobPosting.jobPortalUrl'), '', '', '');
        },

        handleShareFacebook : function() {
            Share.go(document.location, 'facebook', this.getViewModel().get('jobPosting.jobPortalUrl'), '', '', '');
        },

        handleShareGoogle : function() {
            Share.go(document.location, 'ggplus', this.getViewModel().get('jobPosting.jobPortalUrl'), '', '', '');
        }
    };
});
