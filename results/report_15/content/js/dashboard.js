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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.985, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "-152 /LoanIQ/login.jsp"], "isController": false}, {"data": [1.0, 500, 1500, "AB_AST_T02_CLICK_ON_PERSONAL-29"], "isController": false}, {"data": [1.0, 500, 1500, "AB_DDREQUEST_T01_LAUNCH_APP"], "isController": true}, {"data": [0.9, 500, 1500, "AB_CA_T01_LAUNCH_APP-4"], "isController": false}, {"data": [1.0, 500, 1500, "AB_DDREQUEST_T02_PERSONAL"], "isController": true}, {"data": [1.0, 500, 1500, "AB_CCA_T02_CLICK_ON_PERSONAL"], "isController": true}, {"data": [0.95, 500, 1500, "AB_AS_T01_LAUNCH_APP"], "isController": true}, {"data": [1.0, 500, 1500, "AB_CA_T02_CLICK_ON_PERSONAL-10"], "isController": false}, {"data": [1.0, 500, 1500, "AB_LoanApply_T02_SelectPersonalBanking"], "isController": true}, {"data": [1.0, 500, 1500, "AB_AST_T01_LAUNCH_APP"], "isController": true}, {"data": [0.95, 500, 1500, "AB_FT_T01_LAUNCH_APP-51"], "isController": false}, {"data": [1.0, 500, 1500, "AB_AST_T02_CLICK_ON_PERSONAL"], "isController": true}, {"data": [0.9, 500, 1500, "AB_CCA_T01_LAUNCH_APP"], "isController": true}, {"data": [1.0, 500, 1500, "-143 /LoanIQ/"], "isController": false}, {"data": [1.0, 500, 1500, "AB_AS_T02_CLICK_ON_PERSONAL-56"], "isController": false}, {"data": [1.0, 500, 1500, "AB_AST_T01_LAUNCH_APP-19"], "isController": false}, {"data": [1.0, 500, 1500, "AB_FT_T02_CLICK_ON_PERSONAL-56"], "isController": false}, {"data": [1.0, 500, 1500, "AB_LoanApply_T01_Launch"], "isController": true}, {"data": [0.95, 500, 1500, "AB_AS_T01_LAUNCH_APP-51"], "isController": false}, {"data": [1.0, 500, 1500, "AB_DDREQUEST_T01_LAUNCH_APP-17"], "isController": false}, {"data": [1.0, 500, 1500, "AB_AS_T02_CLICK_ON_PERSONAL"], "isController": true}, {"data": [1.0, 500, 1500, "AB_DDREQUEST_T02_PERSONAL-21"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 100, 0, 0.0, 43.36000000000004, 5, 1072, 11.0, 16.900000000000006, 18.94999999999999, 1072.0, 4.1895345427123045, 11.228689016087813, 1.7253190592400185], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["-152 /LoanIQ/login.jsp", 5, 0, 0.0, 8.6, 6, 11, 8.0, 11.0, 11.0, 11.0, 0.6397134083930399, 1.6867443385363357, 0.312360062691914], "isController": false}, {"data": ["AB_AST_T02_CLICK_ON_PERSONAL-29", 10, 0, 0.0, 8.0, 6, 10, 7.5, 10.0, 10.0, 10.0, 0.5554938340184424, 1.464681007665815, 0.264727530274414], "isController": false}, {"data": ["AB_DDREQUEST_T01_LAUNCH_APP", 10, 0, 0.0, 14.6, 11, 18, 15.0, 17.9, 18.0, 18.0, 0.5560189046427578, 1.514391333055324, 0.19167448568251322], "isController": true}, {"data": ["AB_CA_T01_LAUNCH_APP-4", 5, 0, 0.0, 224.2, 9, 1072, 12.0, 1072.0, 1072.0, 1072.0, 0.6327512022272843, 1.7233819365350544, 0.21812614686155404], "isController": false}, {"data": ["AB_DDREQUEST_T02_PERSONAL", 10, 0, 0.0, 9.200000000000001, 6, 13, 9.0, 12.8, 13.0, 13.0, 0.556266340323747, 1.4667178895255049, 0.26509567781053567], "isController": true}, {"data": ["AB_CCA_T02_CLICK_ON_PERSONAL", 5, 0, 0.0, 8.2, 5, 12, 8.0, 12.0, 12.0, 12.0, 0.7313149041977476, 1.9282717200526547, 0.3485172590317391], "isController": true}, {"data": ["AB_AS_T01_LAUNCH_APP", 20, 0, 0.0, 119.80000000000001, 11, 1072, 14.5, 963.1000000000022, 1071.8, 1072.0, 1.108524553818867, 3.0192138482429884, 0.38213785888482427], "isController": true}, {"data": ["AB_CA_T02_CLICK_ON_PERSONAL-10", 5, 0, 0.0, 8.2, 5, 12, 8.0, 12.0, 12.0, 12.0, 0.731528895391368, 1.9288359546452085, 0.3486192392099488], "isController": false}, {"data": ["AB_LoanApply_T02_SelectPersonalBanking", 5, 0, 0.0, 8.6, 6, 11, 8.0, 11.0, 11.0, 11.0, 0.6396315722144046, 1.6865285595496993, 0.3123201036203147], "isController": true}, {"data": ["AB_AST_T01_LAUNCH_APP", 10, 0, 0.0, 11.5, 9, 14, 11.5, 14.0, 14.0, 14.0, 0.555216256731997, 1.5122052148686915, 0.19139779162733886], "isController": true}, {"data": ["AB_FT_T01_LAUNCH_APP-51", 10, 0, 0.0, 118.80000000000001, 11, 1072, 13.5, 966.3000000000004, 1072.0, 1072.0, 0.5606952621250351, 1.5271280137370338, 0.19328655032239977], "isController": false}, {"data": ["AB_AST_T02_CLICK_ON_PERSONAL", 10, 0, 0.0, 8.0, 6, 10, 7.5, 10.0, 10.0, 10.0, 0.5554629783924901, 1.4645996500583236, 0.26471282564017107], "isController": true}, {"data": ["AB_CCA_T01_LAUNCH_APP", 5, 0, 0.0, 224.2, 9, 1072, 12.0, 1072.0, 1072.0, 1072.0, 0.625, 1.7022705078125, 0.2154541015625], "isController": true}, {"data": ["-143 /LoanIQ/", 5, 0, 0.0, 25.8, 10, 76, 15.0, 76.0, 76.0, 76.0, 0.6333924499619965, 1.725128459906258, 0.22576976976184443], "isController": false}, {"data": ["AB_AS_T02_CLICK_ON_PERSONAL-56", 10, 0, 0.0, 9.6, 7, 13, 9.5, 12.8, 13.0, 13.0, 0.598838253787652, 1.5789680519791602, 0.28538385532067784], "isController": false}, {"data": ["AB_AST_T01_LAUNCH_APP-19", 10, 0, 0.0, 11.5, 9, 14, 11.5, 14.0, 14.0, 14.0, 0.5553704320781961, 1.5126251319004775, 0.19145093996445628], "isController": false}, {"data": ["AB_FT_T02_CLICK_ON_PERSONAL-56", 10, 0, 0.0, 7.699999999999999, 6, 11, 7.5, 10.9, 11.0, 11.0, 0.5963384817222256, 1.5723768561035245, 0.28419255769574814], "isController": false}, {"data": ["AB_LoanApply_T01_Launch", 5, 0, 0.0, 25.8, 10, 76, 15.0, 76.0, 76.0, 76.0, 0.6257039169065198, 1.704187718996371, 0.2230292281942185], "isController": true}, {"data": ["AB_AS_T01_LAUNCH_APP-51", 10, 0, 0.0, 120.8, 12, 1068, 15.5, 963.1000000000004, 1068.0, 1068.0, 0.5629362756136005, 1.533231711607746, 0.1940590871988291], "isController": false}, {"data": ["AB_DDREQUEST_T01_LAUNCH_APP-17", 10, 0, 0.0, 14.6, 11, 18, 15.0, 17.9, 18.0, 18.0, 0.5561425949613481, 1.5147282200656247, 0.19171712502085533], "isController": false}, {"data": ["AB_AS_T02_CLICK_ON_PERSONAL", 20, 0, 0.0, 8.65, 6, 13, 8.5, 11.0, 12.899999999999999, 13.0, 1.192321449862883, 3.1438163228806486, 0.5682156909502801], "isController": true}, {"data": ["AB_DDREQUEST_T02_PERSONAL-21", 10, 0, 0.0, 9.200000000000001, 6, 13, 9.0, 12.8, 13.0, 13.0, 0.5562972852692478, 1.4667994826435247, 0.26511042501112597], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 100, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
