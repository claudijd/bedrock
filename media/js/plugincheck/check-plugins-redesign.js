/* global PluginCheck, Mustache, featuredPluginsTmpl, otherPluginsTmpl, unknownPluginsTmpl */

$(function() {
    'use strict';

    var client = window.Mozilla.Client;
    var wrapper = $('#wrapper');

    // Plugin containers
    var $loader = $('.plugincheck-loader');
    var $pluginsStatusContainer = $('#plugins-status-container');
    var $pluginsContainer = $('#plugins-container');
    var $outOfDateContainer = $('#out-of-date-container');
    var $notSupportedContainer = $('#not-supported-container');
    var $noPluginsContainer = $('#no-plugins-container');

    // Plugin button text and status strings
    var _updateNowButtonText = window.trans('buttonUpdateNow');
    var _learnMoreButtonText = window.trans('buttonLearnMore');
    var _iconAltText = window.trans('iconAltTxt');
    var _pluginStatusUpToDate = window.trans('upToDate');
    var _pluginStatusVulnerable = window.trans('vulnerable');
    var _pluginStatusOutdated = window.trans('outdated');
    var _pluginStatusUnknown = window.trans('unknown');

    // Plugin icons
    var mediaURL = window.trans('mediaUrl') + 'img/plugincheck/app-icons/';
    var readerRegEx = /Adobe \b(Reader|Acrobat)\b.*/;
    var iconFor = function (pluginName) {
        if (pluginName.indexOf('Flash') >= 0) {
            return 'icon-flash.png';
        } else if (pluginName.indexOf('Java') >= 0) {
            return 'icon-java.png';
        } else if (pluginName.indexOf('QuickTime') >= 0) {
            return 'icon-quicktime.png';
        } else if (pluginName.indexOf('DivX') >= 0) {
            return 'icon-divx.png';
        } else if (pluginName.indexOf('Totem') >= 0) {
            return 'icon-totem.png';
        } else if (pluginName.indexOf('Flip4Mac') >= 0) {
            return 'icon-flip4mac.png';
        } else if (pluginName.indexOf('WindowsMediaPlayer') >= 0) {
            return 'icon-wmp.png';
        } else if (pluginName.indexOf('VLC') >= 0) {
            return 'icon-vlc.png';
        } else if (pluginName.indexOf('Silverlight') >= 0) {
            return 'icon-silverlight.png';
        } else if (pluginName.indexOf('Shockwave') >= 0) {
            return 'icon-shockwave.png';
        } else if (pluginName.indexOf('RealPlayer') >= 0) {
            return 'icon-real.png';
        } else if (readerRegEx.test(pluginName)) {
            return 'icon-acrobat.png';
        } else if (pluginName.indexOf('Office Live') >= 0) {
            return 'icon-officelive.png';
        } else if (pluginName.indexOf('iPhoto') >= 0) {
            return 'icon-iphoto.png';
        } else {
            return 'default.png';
        }
    };

    /**
     * Handles click events triggered from various plugin status buttons. Once the
     * click event is received, it sends the relevant data about the interaction to GA.
     */
    function handleButtonInteractions() {
        $pluginsContainer.on('click', 'a.action-link', function(event) {
            window.dataLayer.push({
                'event': 'plugincheck-interactions',
                'interaction': 'button click',
                'plugin-action': event.target.dataset['status'],
                'plugin-name': event.target.dataset['name']
            });
        });
    }

    function showPlugin(plugin) {
        var featuredPluginsSection = $('#sec-plugin-featured');
        var featuredPluginsBody = $('#plugin-featured');
        var featuredPluginsHtml = '';
        var outdatedPluginsSection = $('#sec-plugin-outdated');
        var outdatedPluginsBody = $('#plugin-outdated');
        var outdatedPluginsHtml = '';
        var unknownPluginsSection = $('#sec-plugin-unknown');
        var unknownPluginsBody = $('#plugin-unknown');
        var unknownPluginsHtml = '';
        var upToDatePluginsSection = $('#sec-plugin-uptodate');
        var upToDatePluginsBody = $('#plugin-uptodate');
        var upToDatePluginsHtml = '';

        // If the latest response from the service was a vulnerable plugin,
        // pass the object here.
        if (plugin.featured) {
            featuredPluginsHtml = Mustache.to_html(featuredPluginsTmpl, plugin);
            featuredPluginsBody.append(featuredPluginsHtml);

            featuredPluginsSection.show();
            return;
        }

        // If the latest response from the service was a vulnerable or outdated plugin,
        // pass the object here.
        if (plugin.status === 'vulnerable' || plugin.status === 'outdated') {
            outdatedPluginsHtml = Mustache.to_html(otherPluginsTmpl, plugin);
            outdatedPluginsBody.append(outdatedPluginsHtml);

            outdatedPluginsSection.show();
            return;
        }

        // If the latest response from the service was an unknown plugin,
        // pass the object here.
        if (plugin.status === 'unknown') {
            unknownPluginsHtml = Mustache.to_html(unknownPluginsTmpl, plugin);
            unknownPluginsBody.append(unknownPluginsHtml);

            unknownPluginsSection.show();
            return;
        }

        // If the latest response from the service was an up to date plugin,
        // pass the object here.
        if (plugin.status === 'latest' || plugin.status === 'newer') {
            upToDatePluginsHtml = Mustache.to_html(otherPluginsTmpl, plugin);
            upToDatePluginsBody.append(upToDatePluginsHtml);

            upToDatePluginsSection.show();
            return;
        }
    }

    function getPluginButtonText(status) {
        if (status === 'vulnerable' || status === 'outdated') {
            return _updateNowButtonText;
        } else {
            return _learnMoreButtonText;
        }
    }

    function getPluginStatusText(status) {
        var text;

        switch(status) {
        case 'latest':
        case 'newer':
            text = _pluginStatusUpToDate;
            break;
        case 'vulnerable':
            text = _pluginStatusVulnerable;
            break;
        case 'outdated':
            text = _pluginStatusOutdated;
            break;
        default:
            text = _pluginStatusUnknown;
            break;
        }
        return text;
    }

    function getPluginUrl(plugin) {
        if (plugin.status === 'unknown') {
            return 'https://duckduckgo.com/?q=' + plugin.name;
        } else {
            return plugin.url;
        }
    }

    function isFeaturedPlugin(pluginName) {
        return pluginName.indexOf('Flash') >= 0 || pluginName.indexOf('Silverlight') >= 0;
    }

    function isOutdatedPlugin(status) {
        return status === 'vulnerable' || status === 'outdated';
    }

    function displayPlugins(pluginList) {
        pluginList.forEach(function(plugin) {
            var currentPlugin = {
                'icon': mediaURL + iconFor(plugin.name),
                'plugin_name': plugin.name,
                'plugin_detail': plugin.description,
                'plugin_status': getPluginStatusText(plugin.status),
                'plugin_version': plugin.version,
                'button_txt': getPluginButtonText(plugin.status),
                'img_alt_txt': _iconAltText,
                'url': getPluginUrl(plugin),
                'status': plugin.status,
                'featured': isFeaturedPlugin(plugin.name),
                'outdated': isOutdatedPlugin(plugin.status)
            };

            if (plugin.status === 'vulnerable' && plugin.vulnerability_url) {
                currentPlugin['vulnerability_url'] = plugin.vulnerability_url;
                currentPlugin['vulnerability_link_txt'] = _learnMoreButtonText;
            }

            showPlugin(currentPlugin);
        });
    }

    /**
     * Counts the total number of plugins per category i.e vulnerable, outdated,
     * combines latest and newer as up to date, and lastly unknown.
     * @param {array} plugins - The array of plugins returned from the plugin service.
     * @returns pluginTotals - Object containing the totals for the various types of plugins.
     */
    function pluginCounter(plugins) {
        var pluginTotals = {
            vulnerableCount: 0,
            outdatedCount: 0,
            upToDateCount: 0,
            unknownCount: 0
        };

        // loop through all plugins and total up the plugin counts per category.
        plugins.forEach(function(plugin) {
            if (plugin.status === 'vulnerable') {
                pluginTotals.vulnerableCount += 1;
            } else if (plugin.status === 'outdated') {
                pluginTotals.outdatedCount += 1;
            } else if (plugin.status === 'latest' || plugin === 'newer') {
                pluginTotals.upToDateCount += 1;
            } else if (plugin.status === 'unknown') {
                pluginTotals.unknownCount += 1;
            }
        });

        return pluginTotals;
    }

    // show main download button to non Fx traffic
    if(!client.isFirefox && !client.isLikeFirefox || client.isFirefoxiOS) {
        $pluginsStatusContainer.addClass('hidden');
        $notSupportedContainer.removeClass('hidden');
    } else {
        wrapper.addClass('firefox-out-of-date');
        $outOfDateContainer.removeClass('hidden');
    }

    // show for outdated Fx versions
    // if (client.isFirefoxDesktop || client.isFirefoxAndroid) {
    //     client.getFirefoxDetails(function(data) {
    //         if (!data.isUpToDate && !data.isESR) {
    //             wrapper.addClass('firefox-out-of-date');
    //             $outOfDateContainer.removeClass('hidden');
    //         }
    //     });
    // }

    // only execute the plugincheck code if this is Firefox
    if (client.isFirefoxDesktop || client.isFirefoxAndroid || client.isLikeFirefox) {

        $loader.removeClass('hidden');

        PluginCheck.getPluginsStatus('https://plugins.mozilla.org/en-us/plugins_list.json',
            function(response) {

                $loader.addClass('hidden');

                if (response.length > 0) {
                    // filter out any undefined entries in the array that could be
                    // caused by data problems on the database side.
                    // https://bugzilla.mozilla.org/show_bug.cgi?id=1249892
                    response = response.filter(function(index) {
                        return typeof index !== 'undefined';
                    });

                    var pluginTotals = pluginCounter(response);

                    // ping GA with plugin totals
                    window.dataLayer.push({
                        'event': 'plugincheck-load',
                        'interaction': 'page load',
                        'total-plugins': response.length,
                        'plugin-vulnerable-count': pluginTotals.vulnerableCount,
                        'plugin-outdated-count': pluginTotals.outdatedCount,
                        'plugin-up-to-date-count': pluginTotals.upToDateCount,
                        'plugin-unknown-count': pluginTotals.unknownCount
                    });

                    displayPlugins(response);
                    handleButtonInteractions();
                    $pluginsContainer.removeClass('hidden');
                } else {
                    $noPluginsContainer.removeClass('hidden');
                }
            }
        );
    }
});
