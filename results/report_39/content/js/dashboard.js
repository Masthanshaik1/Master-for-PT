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

    var data = {"OkPercent": 97.54923413566739, "KoPercent": 2.450765864332604};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9666265784726398, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9802631578947368, 500, 1500, "03_flights-74"], "isController": false}, {"data": [0.9710144927536232, 500, 1500, "07_logout-84"], "isController": false}, {"data": [0.9683544303797469, 500, 1500, "01_launch-67"], "isController": false}, {"data": [0.9556962025316456, 500, 1500, "01_launch"], "isController": true}, {"data": [0.9683544303797469, 500, 1500, "01_launch-68"], "isController": false}, {"data": [0.9802631578947368, 500, 1500, "03_flights-75"], "isController": false}, {"data": [0.9802631578947368, 500, 1500, "04_find_flights"], "isController": true}, {"data": [0.9683544303797469, 500, 1500, "01_launch-69"], "isController": false}, {"data": [0.9802631578947368, 500, 1500, "03_flights-76"], "isController": false}, {"data": [0.9931972789115646, 500, 1500, "05_select_flights-81"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "05_select_flights"], "isController": true}, {"data": [0.9620253164556962, 500, 1500, "01_launch-70"], "isController": false}, {"data": [0.9591836734693877, 500, 1500, "06_payment"], "isController": true}, {"data": [0.9637681159420289, 500, 1500, "07_logout-85"], "isController": false}, {"data": [0.9577464788732394, 500, 1500, "06_payment-82"], "isController": false}, {"data": [0.9383116883116883, 500, 1500, "03_flights"], "isController": true}, {"data": [0.974025974025974, 500, 1500, "02_login-72"], "isController": false}, {"data": [0.98, 500, 1500, "04_find_flights-80"], "isController": false}, {"data": [0.974025974025974, 500, 1500, "02_login-73"], "isController": false}, {"data": [0.948051948051948, 500, 1500, "02_login-71"], "isController": false}, {"data": [0.9082278481012658, 500, 1500, "02_login"], "isController": true}, {"data": [0.9647887323943662, 500, 1500, "07_logout"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2285, 56, 2.450765864332604, 270.45426695842394, 0, 68785, 108.0, 173.0, 197.0, 272.25999999999885, 7.622586875806877, 13.247662064411694, 4.444728113835079], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_flights-74", 152, 3, 1.9736842105263157, 86.34868421052632, 2, 337, 77.5, 137.70000000000002, 147.35, 244.2499999999998, 0.5285724718065703, 0.4535457986747436, 0.30544851830182185], "isController": false}, {"data": ["07_logout-84", 138, 4, 2.898550724637681, 86.8405797101449, 0, 213, 81.0, 126.0, 152.19999999999993, 202.4699999999996, 0.5163105495714247, 0.5363218216502482, 0.3008303994672274], "isController": false}, {"data": ["01_launch-67", 158, 5, 3.1645569620253164, 7.018987341772152, 2, 35, 5.0, 11.099999999999994, 20.0, 33.22999999999999, 0.5284015852047556, 0.37504977279567914, 0.19055077190943598], "isController": false}, {"data": ["01_launch", 158, 6, 3.7974683544303796, 213.54430379746833, 9, 656, 197.5, 292.29999999999995, 319.7999999999997, 616.4699999999998, 0.527642805857503, 2.394309028995308, 0.8682142693148992], "isController": true}, {"data": ["01_launch-68", 158, 5, 3.1645569620253164, 3.259493670886074, 1, 21, 3.0, 5.099999999999994, 8.0, 18.049999999999983, 0.5284563722473443, 0.5464992482875338, 0.21755645264462314], "isController": false}, {"data": ["03_flights-75", 152, 3, 1.9736842105263157, 141.0, 2, 256, 131.5, 190.0, 202.7, 237.44999999999996, 0.5283281195689954, 0.9115533759124088, 0.30682460027806746], "isController": false}, {"data": ["04_find_flights", 152, 1, 0.6578947368421053, 798.4407894736842, 0, 68785, 100.0, 172.10000000000005, 216.74999999999997, 51269.02999999996, 0.528616589518785, 1.3772634386422204, 0.47565236438550057], "isController": true}, {"data": ["01_launch-69", 158, 5, 3.1645569620253164, 67.98101265822785, 2, 417, 60.0, 90.29999999999998, 124.04999999999998, 316.6999999999994, 0.5282425903946775, 0.5552698362615135, 0.232954094297989], "isController": false}, {"data": ["03_flights-76", 152, 3, 1.9736842105263157, 159.5723684210527, 2, 343, 151.5, 214.70000000000002, 237.39999999999998, 324.44999999999993, 0.5280601432710547, 2.3118474972294214, 0.3071744797999625], "isController": false}, {"data": ["05_select_flights-81", 147, 1, 0.6802721088435374, 109.88435374149657, 1, 430, 95.0, 163.00000000000009, 200.59999999999994, 363.7600000000014, 0.5240342796845813, 1.5296900678125311, 0.4242565207956052], "isController": false}, {"data": ["05_select_flights", 150, 1, 0.6666666666666666, 107.68666666666664, 0, 430, 94.0, 161.8, 198.94999999999987, 359.62000000000126, 0.5261865506717648, 1.5052532327586208, 0.4174790128301821], "isController": true}, {"data": ["01_launch-70", 158, 6, 3.7974683544303796, 135.28481012658227, 2, 454, 129.0, 186.2, 203.34999999999988, 324.7899999999993, 0.528652638411633, 0.9212603472043309, 0.2284624238388881], "isController": false}, {"data": ["06_payment", 147, 3, 2.0408163265306123, 624.0136054421771, 0, 35716, 96.0, 178.80000000000007, 214.59999999999997, 35654.56, 0.5242735067121275, 1.430042644032555, 0.4915412415117623], "isController": true}, {"data": ["07_logout-85", 138, 5, 3.6231884057971016, 138.95652173913047, 2, 269, 129.5, 197.3, 205.44999999999985, 255.7399999999995, 0.5161097294163847, 0.898418508190437, 0.22344594405071339], "isController": false}, {"data": ["06_payment-82", 142, 3, 2.112676056338028, 645.985915492958, 2, 35716, 99.0, 180.80000000000007, 216.09999999999997, 35660.96, 0.5253188907632662, 1.483348119487851, 0.5098636598634171], "isController": false}, {"data": ["03_flights", 154, 3, 1.948051948051948, 381.8961038961039, 0, 740, 367.0, 495.5, 525.0, 689.399999999999, 0.5259850265041806, 3.6140457320926007, 0.9034964235579813], "isController": true}, {"data": ["02_login-72", 154, 4, 2.5974025974025974, 138.9805194805195, 2, 222, 133.5, 195.0, 203.5, 222.0, 0.5257282531142572, 0.9099563415117077, 0.2953254191744018], "isController": false}, {"data": ["04_find_flights-80", 150, 1, 0.6666666666666666, 809.0866666666668, 2, 68785, 101.0, 172.70000000000002, 217.24999999999994, 51930.0100000003, 0.5259282633848743, 1.3885293676150907, 0.47954317104063676], "isController": false}, {"data": ["02_login-73", 154, 4, 2.5974025974025974, 139.6298701298702, 2, 224, 134.5, 186.0, 202.25, 219.0499999999999, 0.525613414746528, 0.615233275083535, 0.2927610991037268], "isController": false}, {"data": ["02_login-71", 154, 4, 2.5974025974025974, 1442.3636363636363, 2, 68320, 90.5, 144.0, 162.5, 68311.2, 0.5257785106811563, 0.4767535054745834, 0.34766277155265124], "isController": false}, {"data": ["02_login", 158, 4, 2.5316455696202533, 1677.4050632911394, 0, 68517, 359.5, 506.5, 543.0999999999999, 68515.82, 0.5289924702274333, 1.9634634233513348, 0.9177524997405259], "isController": true}, {"data": ["07_logout", 142, 5, 3.5211267605633805, 219.43661971830983, 0, 442, 215.0, 312.1, 341.7, 431.67999999999984, 0.5254724626525997, 1.4194131198817317, 0.518635191667931], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 51, 91.07142857142857, 2.2319474835886215], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 10.124.81.122:1080 failed to respond", 5, 8.928571428571429, 0.2188183807439825], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2285, 56, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 51, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 10.124.81.122:1080 failed to respond", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03_flights-74", 152, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["07_logout-84", 138, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 10.124.81.122:1080 failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["01_launch-67", 158, 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["01_launch-68", 158, 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["03_flights-75", 152, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["01_launch-69", 158, 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["03_flights-76", 152, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["05_select_flights-81", 147, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 10.124.81.122:1080 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["01_launch-70", 158, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 10.124.81.122:1080 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["07_logout-85", 138, 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 10.124.81.122:1080 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["06_payment-82", 142, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["02_login-72", 154, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04_find_flights-80", 150, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_login-73", 154, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_login-71", 154, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to 10.124.81.122:1080 [/10.124.81.122] failed: Connection refused (Connection refused)", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
