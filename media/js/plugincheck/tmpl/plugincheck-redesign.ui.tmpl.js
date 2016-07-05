/* exported featuredPluginsTmpl, otherPluginsTmpl, unknownPluginsTmpl */

var featuredPluginsTmpl = '<li class="featured-plugin">' +
                        '<img class="icon" width="60" height="60" src="{{icon}}" alt="" />' +
                        '<div class="plugin-detail">' +
                        '<h4>{{plugin_name}}</h4>' +
                        '<small>{{{ plugin_detail }}}</small>' +
                        '<p class="plugin-meta">' +
                        '<span class="version">v. {{ plugin_version }}</span> <span class="meta-status {{status}}">{{plugin_status}}</span>' +
                        '</p>' +
                        '<p class="plugin-actions">' +
                        '<a href="{{ url }}" class="action-link {{#outdated}}button{{/outdated}}" target="_blank" rel="noopener" data-name="{{plugin_name}}" data-status="{{status}}">{{button_txt}}</a>' +
                        '{{#vulnerability_url}}' +
                        '<a class="vulnerability-link-txt more" href="{{ vulnerability_url }}" target="_blank" rel="noopener">{{ vulnerability_link_txt }}</a></td>' +
                        '{{/vulnerability_url}}' +
                        '</p>' +
                        '</div>' +
                        '</li>';

var otherPluginsTmpl = '<tr><th scope="row">' +
                    '{{#icon}}' +
                    '<img class="icon" width="60" height="60" src="{{icon}}" alt="" />' +
                    '{{/icon}}' +
                    '{{plugin_name}}' +
                    '<small>{{{ plugin_detail }}}</small>' +
                    '</th>' +
                    '<td><div class="meta-status {{status}}">{{plugin_status}}</div><div class="plugin_version">v. {{ plugin_version }}</div></td>' +
                    '<td class="action"><a href="{{ url }}" class="action-link {{#outdated}}button{{/outdated}}" target="_blank" rel="noopener" data-name="{{plugin_name}}" data-status="{{status}}">{{button_txt}}</a></td>' +
                    '{{#vulnerability_url}}' +
                    '<a class="vulnerability-link-txt more" href="{{ vulnerability_url }}" target="_blank" rel="noopener">{{ vulnerability_link_txt }}</a></td>' +
                    '{{/vulnerability_url}}' +
                    '</tr>';

var unknownPluginsTmpl = '<tr><th scope="row">' +
                        '{{plugin_name}} (v. {{ plugin_version }})' +
                        '<small>{{{ plugin_detail }}}</small>' +
                        '</th>' +
                        '<td class="action"><a class="action-link" href="{{ url }}" target="_blank" rel="noopener" data-name="{{plugin_name}}" data-status="{{status}}">{{button_txt}}</a></td>' +
                        '</tr>';
