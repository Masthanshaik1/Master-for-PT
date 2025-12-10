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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.938030303030303, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "03_flights-74"], "isController": false}, {"data": [1.0, 500, 1500, "07_logout-84"], "isController": false}, {"data": [0.9935897435897436, 500, 1500, "01_launch-67"], "isController": false}, {"data": [0.8685897435897436, 500, 1500, "01_launch"], "isController": true}, {"data": [1.0, 500, 1500, "01_launch-68"], "isController": false}, {"data": [1.0, 500, 1500, "03_flights-75"], "isController": false}, {"data": [0.9868421052631579, 500, 1500, "04_find_flights"], "isController": true}, {"data": [0.9935897435897436, 500, 1500, "01_launch-69"], "isController": false}, {"data": [0.9967320261437909, 500, 1500, "03_flights-76"], "isController": false}, {"data": [1.0, 500, 1500, "05_select_flights-81"], "isController": false}, {"data": [1.0, 500, 1500, "05_select_flights"], "isController": true}, {"data": [1.0, 500, 1500, "01_launch-70"], "isController": false}, {"data": [0.9931972789115646, 500, 1500, "06_payment"], "isController": true}, {"data": [1.0, 500, 1500, "07_logout-85"], "isController": false}, {"data": [1.0, 500, 1500, "06_payment-82"], "isController": false}, {"data": [0.4934640522875817, 500, 1500, "03_flights"], "isController": true}, {"data": [1.0, 500, 1500, "02_login-72"], "isController": false}, {"data": [0.9864864864864865, 500, 1500, "04_find_flights-80"], "isController": false}, {"data": [1.0, 500, 1500, "02_login-73"], "isController": false}, {"data": [1.0, 500, 1500, "02_login-71"], "isController": false}, {"data": [0.5128205128205128, 500, 1500, "02_login"], "isController": true}, {"data": [0.8345323741007195, 500, 1500, "07_logout"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2269, 0, 0.0, 308.0577346848833, 0, 69657, 212.0, 343.0, 368.0, 416.2000000000007, 7.5609894266110835, 13.004617657067975, 4.531830809532378], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_flights-74", 153, 0, 0.0, 211.32026143790847, 108, 346, 221.0, 285.2, 302.29999999999995, 331.4200000000002, 0.528572267575028, 0.4351429898103013, 0.3129356186886571], "isController": false}, {"data": ["07_logout-84", 136, 0, 0.0, 214.76470588235293, 113, 331, 215.0, 297.6, 307.3, 330.63, 0.5160037030853987, 0.5165076129516929, 0.31003054523758933], "isController": false}, {"data": ["01_launch-67", 156, 0, 0.0, 451.9294871794872, 6, 68268, 11.0, 23.30000000000001, 27.0, 29405.970000000467, 0.5224730390515104, 0.33879111125996386, 0.1946060310469556], "isController": false}, {"data": ["01_launch", 156, 0, 0.0, 881.3910256410251, 306, 68860, 408.0, 575.0, 620.15, 30810.220000000456, 0.5214147720815814, 2.26617492964243, 0.8876428459219349], "isController": true}, {"data": ["01_launch-68", 156, 0, 0.0, 7.051282051282052, 3, 64, 5.0, 11.0, 13.150000000000006, 41.770000000000266, 0.5226183177720379, 0.513945308704945, 0.22222009350177724], "isController": false}, {"data": ["03_flights-75", 153, 0, 0.0, 248.88235294117644, 158, 386, 222.0, 341.0, 354.59999999999997, 375.7400000000001, 0.5285448779510422, 0.9027587807972391, 0.3144678742736826], "isController": false}, {"data": ["04_find_flights", 152, 0, 0.0, 1169.184210526316, 0, 69657, 258.0, 375.0, 387.7, 69205.44, 0.5321700283240495, 1.368181762979522, 0.4783163963073702], "isController": true}, {"data": ["01_launch-69", 156, 0, 0.0, 181.7179487179487, 102, 1643, 150.0, 282.90000000000003, 295.3, 890.0300000000091, 0.5223768145060024, 0.5228869481139183, 0.23793154687159912], "isController": false}, {"data": ["03_flights-76", 153, 0, 0.0, 299.7973856209151, 207, 1131, 261.0, 413.6, 434.0, 769.7400000000054, 0.5283970230180794, 2.3323774844157414, 0.314895917873979], "isController": false}, {"data": ["05_select_flights-81", 147, 0, 0.0, 267.60544217687067, 146, 409, 251.0, 381.40000000000003, 395.79999999999995, 406.12000000000006, 0.530860318732869, 1.5545001358749626, 0.43507989650932255], "isController": false}, {"data": ["05_select_flights", 148, 0, 0.0, 265.79729729729723, 0, 409, 250.0, 381.2, 395.65, 406.05999999999995, 0.5229681978798586, 1.5210426788869258, 0.42571568573321555], "isController": true}, {"data": ["01_launch-70", 156, 0, 0.0, 240.69230769230765, 163, 390, 212.0, 335.3, 349.75, 383.7300000000001, 0.5249485146649078, 0.8994389980802363, 0.23581671557212655], "isController": false}, {"data": ["06_payment", 147, 0, 0.0, 362.54421768707493, 0, 15951, 244.0, 384.6, 395.0, 8496.120000000159, 0.5262743357129048, 1.4185577040118573, 0.4979097544679617], "isController": true}, {"data": ["07_logout-85", 136, 0, 0.0, 240.09558823529403, 159, 381, 212.5, 337.6, 354.0, 379.89, 0.5157766990291263, 0.883657955428929, 0.2316965640169903], "isController": false}, {"data": ["06_payment-82", 140, 0, 0.0, 269.3928571428571, 151, 420, 246.5, 383.70000000000005, 394.95, 416.31000000000006, 0.52131042546378, 1.4754365043901787, 0.5178740530303031], "isController": false}, {"data": ["03_flights", 153, 0, 0.0, 767.8496732026141, 504, 2147, 754.0, 950.4, 1015.0999999999999, 1922.3600000000033, 0.525128965495938, 3.6471847681710066, 0.9362808931568487], "isController": true}, {"data": ["02_login-72", 153, 0, 0.0, 243.11111111111106, 162, 366, 217.0, 344.6, 352.59999999999997, 365.46000000000004, 0.5285540075103033, 0.9027743741557818, 0.3056984836890997], "isController": false}, {"data": ["04_find_flights-80", 148, 0, 0.0, 1200.7837837837837, 158, 69657, 265.0, 375.1, 388.09999999999997, 69239.51999999999, 0.522383055023172, 1.379317794864057, 0.48220955347720046], "isController": false}, {"data": ["02_login-73", 153, 0, 0.0, 252.88888888888877, 163, 378, 235.0, 353.0, 368.59999999999997, 376.38, 0.5284444736105882, 0.5986285052619945, 0.30305483755513263], "isController": false}, {"data": ["02_login-71", 153, 0, 0.0, 226.07843137254906, 133, 472, 219.0, 315.6, 323.29999999999995, 408.82000000000096, 0.5282054822895809, 0.45199139724159354, 0.3577301566923289], "isController": false}, {"data": ["02_login", 156, 0, 0.0, 708.1923076923076, 0, 1097, 716.0, 893.4000000000001, 927.5000000000002, 1055.3900000000006, 0.5255090869279614, 1.9052040084805713, 0.9427279837799598], "isController": true}, {"data": ["07_logout", 139, 0, 0.0, 445.04316546762584, 0, 687, 428.0, 603.0, 653.0, 676.1999999999998, 0.5217384776496995, 1.385556260251786, 0.5360267573953614], "isController": true}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2269, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
