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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9988773219024291, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9993197278911564, 500, 1500, "AB_AS_T06_CLICK_ON_LOGOUT"], "isController": true}, {"data": [0.99800796812749, 500, 1500, "AB_AS_T03_CLICK_ON_LOGIN-68"], "isController": false}, {"data": [0.9974293059125964, 500, 1500, "AB_AS_T01_LAUNCH_APP"], "isController": true}, {"data": [0.9980494148244473, 500, 1500, "AB_AS_T03_CLICK_ON_LOGIN"], "isController": true}, {"data": [0.9993131868131868, 500, 1500, "AB_AS_T06_CLICK_ON_LOGOUT-85"], "isController": false}, {"data": [0.9979919678714859, 500, 1500, "AB_AS_T05_CLICK_ON_SUMMARY"], "isController": true}, {"data": [1.0, 500, 1500, "AB_AS_T04_CLICK_ON_ACCOUNTS"], "isController": true}, {"data": [0.9979591836734694, 500, 1500, "AB_AS_T05_CLICK_ON_SUMMARY-80"], "isController": false}, {"data": [1.0, 500, 1500, "AB_AS_T02_CLICK_ON_PERSONAL-56"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "AB_AS_T04_CLICK_ON_ACCOUNTS-76"], "isController": false}, {"data": [0.9974293059125964, 500, 1500, "AB_AS_T01_LAUNCH_APP-51"], "isController": false}, {"data": [1.0, 500, 1500, "AB_AS_T02_CLICK_ON_PERSONAL"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5276, 0, 0.0, 41.65163002274445, 0, 1112, 30.0, 79.0, 111.0, 290.22999999999956, 17.595347037872017, 51.62696344259002, 7.795238880347639], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AB_AS_T06_CLICK_ON_LOGOUT", 735, 0, 0.0, 33.78911564625849, 0, 681, 19.0, 57.0, 105.19999999999993, 266.1199999999999, 2.6132775834115543, 5.434606283954832, 1.279028269619137], "isController": true}, {"data": ["AB_AS_T03_CLICK_ON_LOGIN-68", 753, 0, 0.0, 69.32934926958836, 24, 819, 52.0, 103.60000000000002, 164.89999999999986, 421.28000000000065, 2.5833942300764727, 7.725195459247214, 1.8240176058059472], "isController": false}, {"data": ["AB_AS_T01_LAUNCH_APP", 778, 0, 0.0, 53.65681233933162, 14, 1112, 37.5, 82.10000000000002, 117.04999999999995, 405.5100000000011, 2.5929962438216365, 7.059837429467503, 1.0905418233129693], "isController": true}, {"data": ["AB_AS_T03_CLICK_ON_LOGIN", 769, 0, 0.0, 67.886866059818, 0, 819, 51.0, 103.0, 163.0, 418.3999999999992, 2.593425716395914, 7.593836472114772, 1.7930020662672543], "isController": true}, {"data": ["AB_AS_T06_CLICK_ON_LOGOUT-85", 728, 0, 0.0, 34.11401098901099, 5, 681, 19.0, 57.0, 105.54999999999995, 266.6800000000003, 2.6169164959200546, 5.494502408425896, 1.2931247528667458], "isController": false}, {"data": ["AB_AS_T05_CLICK_ON_SUMMARY", 747, 0, 0.0, 60.74297188755021, 0, 814, 46.0, 96.0, 131.20000000000005, 339.5199999999995, 2.5901256228263922, 15.662118470074859, 1.3010155819287592], "isController": true}, {"data": ["AB_AS_T04_CLICK_ON_ACCOUNTS", 753, 0, 0.0, 40.20584329349276, 0, 435, 24.0, 79.0, 119.89999999999986, 309.1200000000008, 2.5872465580687387, 9.256666164879416, 1.2983543776177402], "isController": true}, {"data": ["AB_AS_T05_CLICK_ON_SUMMARY-80", 735, 0, 0.0, 61.733333333333356, 22, 814, 46.0, 96.39999999999998, 132.0, 342.63999999999965, 2.5909932140653917, 15.92315837886666, 1.32269955715167], "isController": false}, {"data": ["AB_AS_T02_CLICK_ON_PERSONAL-56", 769, 0, 0.0, 32.422626788036396, 6, 388, 20.0, 61.0, 103.5, 231.6999999999996, 2.5931371226631414, 6.834840912175604, 1.2332595495478027], "isController": false}, {"data": ["Debug Sampler", 728, 0, 0.0, 0.5315934065934075, 0, 19, 0.0, 1.0, 1.0, 5.130000000000109, 2.6173210568512335, 1.2368052572021269, 0.0], "isController": false}, {"data": ["AB_AS_T04_CLICK_ON_ACCOUNTS-76", 747, 0, 0.0, 40.5287817938421, 7, 435, 24.0, 79.0, 120.80000000000007, 310.4399999999996, 2.589604833929023, 9.339522121274626, 1.3099758827883146], "isController": false}, {"data": ["AB_AS_T01_LAUNCH_APP-51", 778, 0, 0.0, 53.65681233933162, 14, 1112, 37.5, 82.10000000000002, 117.04999999999995, 405.5100000000011, 2.594691221739377, 7.06445227168885, 1.0912546837011368], "isController": false}, {"data": ["AB_AS_T02_CLICK_ON_PERSONAL", 778, 0, 0.0, 32.04755784061693, 0, 388, 20.0, 60.10000000000002, 103.04999999999995, 230.89000000000033, 2.596024545445445, 6.763297091943648, 1.220350383022066], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5276, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
