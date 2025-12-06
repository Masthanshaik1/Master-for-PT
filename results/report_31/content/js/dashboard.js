/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 1.5873015873015872, "KoPercent": 98.41269841269842};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.012195121951219513, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "03_flights-74"], "isController": false}, {"data": [0.0, 500, 1500, "01_launch-67"], "isController": false}, {"data": [0.0, 500, 1500, "01_launch"], "isController": true}, {"data": [0.0, 500, 1500, "01_launch-68"], "isController": false}, {"data": [0.0, 500, 1500, "03_flights-75"], "isController": false}, {"data": [0.058823529411764705, 500, 1500, "04_find_flights"], "isController": true}, {"data": [0.0, 500, 1500, "01_launch-69"], "isController": false}, {"data": [0.0, 500, 1500, "03_flights-76"], "isController": false}, {"data": [0.0, 500, 1500, "05_select_flights-81"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "05_select_flights"], "isController": true}, {"data": [0.0, 500, 1500, "01_launch-70"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "06_payment"], "isController": false}, {"data": [0.0, 500, 1500, "06_payment-82"], "isController": false}, {"data": [0.0, 500, 1500, "03_flights"], "isController": true}, {"data": [0.0, 500, 1500, "02_login-72"], "isController": false}, {"data": [0.0, 500, 1500, "04_find_flights-80"], "isController": false}, {"data": [0.0, 500, 1500, "02_login-73"], "isController": false}, {"data": [0.0, 500, 1500, "02_login-71"], "isController": false}, {"data": [0.0, 500, 1500, "02_login"], "isController": true}, {"data": [1.0, 500, 1500, "07_logout"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 252, 248, 98.41269841269842, 21555.11111111111, 0, 64516, 21046.5, 21070.4, 24570.449999999997, 64363.4, 0.7867280231273064, 2.0513501497749083, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_flights-74", 20, 20, 100.0, 21050.050000000003, 21033, 21063, 21053.5, 21062.8, 21063.0, 21063.0, 0.17388582656627657, 0.44982769001373696, 0.0], "isController": false}, {"data": ["01_launch-67", 20, 20, 100.0, 21056.4, 21032, 21104, 21055.5, 21075.8, 21102.6, 21104.0, 0.17280409200089858, 0.4470293356546683, 0.0], "isController": false}, {"data": ["01_launch", 20, 20, 100.0, 84195.79999999999, 84136, 84268, 84198.0, 84246.3, 84267.05, 84268.0, 0.11166260028697288, 1.155446203750747, 0.0], "isController": true}, {"data": ["01_launch-68", 20, 20, 100.0, 21047.749999999996, 21035, 21071, 21046.0, 21065.8, 21070.8, 21071.0, 0.17294754500959858, 0.4474004362601823, 0.0], "isController": false}, {"data": ["03_flights-75", 20, 20, 100.0, 21048.850000000002, 21027, 21063, 21053.0, 21061.9, 21062.95, 21063.0, 0.1738843147653866, 0.4498237791147549, 0.0], "isController": false}, {"data": ["04_find_flights", 17, 16, 94.11764705882354, 21987.470588235297, 0, 33726, 21046.0, 32698.8, 33726.0, 33726.0, 0.16560000779294154, 0.4031934013267483, 0.0], "isController": true}, {"data": ["01_launch-69", 20, 20, 100.0, 21046.549999999996, 21028, 21065, 21045.0, 21062.0, 21064.85, 21065.0, 0.172952031753993, 0.4474120430823511, 0.0], "isController": false}, {"data": ["03_flights-76", 20, 20, 100.0, 21041.8, 21027, 21067, 21038.5, 21054.8, 21066.4, 21067.0, 0.17386768669042857, 0.44978076371381376, 0.0], "isController": false}, {"data": ["05_select_flights-81", 11, 11, 100.0, 21039.81818181818, 21026, 21056, 21036.0, 21056.0, 21056.0, 21056.0, 0.16115091050264435, 0.4168835565639696, 0.0], "isController": false}, {"data": ["05_select_flights", 12, 11, 91.66666666666667, 20636.916666666668, 0, 24718, 21056.0, 24649.9, 24718.0, 24718.0, 0.1647062053062849, 0.39057406546385387, 0.0], "isController": true}, {"data": ["01_launch-70", 20, 20, 100.0, 21045.1, 21029, 21072, 21042.5, 21064.9, 21071.65, 21072.0, 0.17293558149589278, 0.4473694876783398, 0.0], "isController": false}, {"data": ["06_payment", 6, 5, 83.33333333333333, 22355.166666666668, 0, 29237, 27355.5, 29237.0, 29237.0, 29237.0, 0.1257650708476566, 0.2711195252892597, 0.0], "isController": false}, {"data": ["06_payment-82", 5, 5, 100.0, 21043.0, 21027, 21058, 21042.0, 21058.0, 21058.0, 21058.0, 0.11544677903486493, 0.29865089615562224, 0.0], "isController": false}, {"data": ["03_flights", 20, 20, 100.0, 63331.5, 63094, 64516, 63151.0, 64415.0, 64511.55, 64516.0, 0.12613521695257315, 0.9789028995332997, 0.0], "isController": true}, {"data": ["02_login-72", 20, 20, 100.0, 21045.35, 21024, 21072, 21046.0, 21062.8, 21071.55, 21072.0, 0.17351320869301176, 0.44886375959744934, 0.0], "isController": false}, {"data": ["04_find_flights-80", 16, 16, 100.0, 21045.625, 21020, 21071, 21045.5, 21065.4, 21071.0, 21071.0, 0.16797547558056525, 0.4345381199344896, 0.0], "isController": false}, {"data": ["02_login-73", 20, 20, 100.0, 21046.3, 21029, 21068, 21049.0, 21061.7, 21067.7, 21068.0, 0.17346806019341687, 0.4487469643089466, 0.0], "isController": false}, {"data": ["02_login-71", 20, 20, 100.0, 21049.000000000004, 21027, 21085, 21047.0, 21081.2, 21084.9, 21085.0, 0.17344549475327378, 0.4486885894545139, 0.0], "isController": false}, {"data": ["02_login", 20, 20, 100.0, 63140.65, 63091, 63199, 63140.0, 63169.6, 63197.55, 63199.0, 0.12680619575072438, 0.9841101929990299, 0.0], "isController": true}, {"data": ["07_logout", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 16, 6.451612903225806, 6.349206349206349], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 232, 93.54838709677419, 92.06349206349206], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 252, 248, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 232, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 16, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03_flights-74", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01_launch-67", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["01_launch-68", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["03_flights-75", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04_find_flights", 5, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01_launch-69", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["03_flights-76", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["05_select_flights-81", 11, 11, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["05_select_flights", 6, 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["01_launch-70", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["06_payment", 5, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["06_payment-82", 5, 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["03_flights", 3, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_login-72", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04_find_flights-80", 16, 16, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_login-73", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_login-71", 20, 20, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.67.125.122:1080 [/10.67.125.122] failed: Connection refused (Connection refused)", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
