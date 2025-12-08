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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9971411068000817, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9965940054495913, 500, 1500, "AB_AS_T06_CLICK_ON_LOGOUT"], "isController": true}, {"data": [0.9960106382978723, 500, 1500, "AB_AS_T03_CLICK_ON_LOGIN-68"], "isController": false}, {"data": [0.9980670103092784, 500, 1500, "AB_AS_T01_LAUNCH_APP"], "isController": true}, {"data": [0.9961139896373057, 500, 1500, "AB_AS_T03_CLICK_ON_LOGIN"], "isController": true}, {"data": [0.9965564738292011, 500, 1500, "AB_AS_T06_CLICK_ON_LOGOUT-85"], "isController": false}, {"data": [0.9966622162883845, 500, 1500, "AB_AS_T05_CLICK_ON_SUMMARY"], "isController": true}, {"data": [0.9966755319148937, 500, 1500, "AB_AS_T04_CLICK_ON_ACCOUNTS"], "isController": true}, {"data": [0.9965940054495913, 500, 1500, "AB_AS_T05_CLICK_ON_SUMMARY-80"], "isController": false}, {"data": [0.9974093264248705, 500, 1500, "AB_AS_T02_CLICK_ON_PERSONAL-56"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.9966622162883845, 500, 1500, "AB_AS_T04_CLICK_ON_ACCOUNTS-76"], "isController": false}, {"data": [0.9980670103092784, 500, 1500, "AB_AS_T01_LAUNCH_APP-51"], "isController": false}, {"data": [0.9974226804123711, 500, 1500, "AB_AS_T02_CLICK_ON_PERSONAL"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5270, 0, 0.0, 43.61385199240978, 0, 3057, 26.0, 86.0, 138.0, 346.5799999999999, 17.578913309605692, 51.615740867179134, 7.7947662913496405], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AB_AS_T06_CLICK_ON_LOGOUT", 734, 0, 0.0, 35.96049046321526, 0, 819, 16.0, 62.0, 135.5, 306.8499999999998, 2.618426732210573, 5.437753169580588, 1.2797688854919895], "isController": true}, {"data": ["AB_AS_T03_CLICK_ON_LOGIN-68", 752, 0, 0.0, 67.84308510638301, 22, 693, 48.0, 109.70000000000005, 170.50000000000023, 473.0400000000009, 2.5912091850095793, 7.7460783248539, 1.8295353913690682], "isController": false}, {"data": ["AB_AS_T01_LAUNCH_APP", 776, 0, 0.0, 48.41881443298967, 10, 3057, 31.0, 86.0, 109.0, 233.6800000000003, 2.5911147469823197, 7.054714760338581, 1.0897157307544618], "isController": true}, {"data": ["AB_AS_T03_CLICK_ON_LOGIN", 772, 0, 0.0, 66.0854922279793, 0, 693, 46.0, 108.70000000000005, 164.39999999999964, 466.6399999999994, 2.6032182791783005, 7.580372283185976, 1.7903975134544572], "isController": true}, {"data": ["AB_AS_T06_CLICK_ON_LOGOUT-85", 726, 0, 0.0, 36.35674931129476, 6, 819, 16.0, 63.0, 137.89999999999986, 307.57000000000016, 2.6207115628970774, 5.502470566629606, 1.2950000496346887], "isController": false}, {"data": ["AB_AS_T05_CLICK_ON_SUMMARY", 749, 0, 0.0, 65.21228304405882, 0, 951, 47.0, 108.0, 181.5, 442.5, 2.602266647210467, 15.669677600355769, 1.3018526166850806], "isController": true}, {"data": ["AB_AS_T04_CLICK_ON_ACCOUNTS", 752, 0, 0.0, 47.73404255319151, 0, 679, 21.0, 100.40000000000009, 226.05000000000007, 414.45000000000095, 2.5918522092782794, 9.307828090533881, 1.3058822357310265], "isController": true}, {"data": ["AB_AS_T05_CLICK_ON_SUMMARY-80", 734, 0, 0.0, 66.5422343324251, 20, 951, 47.0, 109.5, 182.0, 450.14999999999884, 2.5936304111999604, 15.936836353935146, 1.324048435341218], "isController": false}, {"data": ["AB_AS_T02_CLICK_ON_PERSONAL-56", 772, 0, 0.0, 38.59974093264242, 5, 564, 19.0, 75.40000000000009, 146.1999999999989, 378.2399999999998, 2.6029549607870903, 6.860718202308942, 1.237928775296204], "isController": false}, {"data": ["Debug Sampler", 726, 0, 0.0, 0.44352617079889783, 0, 16, 0.0, 1.0, 1.0, 8.0, 2.6223776223776225, 1.2401216382726261, 0.0], "isController": false}, {"data": ["AB_AS_T04_CLICK_ON_ACCOUNTS-76", 749, 0, 0.0, 47.92523364485984, 6, 679, 21.0, 101.0, 226.5, 415.5, 2.602149118083373, 9.382235354442935, 1.3163215265304562], "isController": false}, {"data": ["AB_AS_T01_LAUNCH_APP-51", 776, 0, 0.0, 48.41881443298967, 10, 3057, 31.0, 86.0, 109.0, 233.6800000000003, 2.593166871624873, 7.060301990322408, 1.0905787695322944], "isController": false}, {"data": ["AB_AS_T02_CLICK_ON_PERSONAL", 776, 0, 0.0, 38.40077319587621, 0, 564, 19.0, 74.60000000000014, 143.79999999999973, 377.7600000000002, 2.5949011529921617, 6.8042353359661325, 1.2277371651039297], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5270, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
