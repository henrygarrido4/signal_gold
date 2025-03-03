class TableauService {
    constructor() {
        this.viz = null;
        this.isScriptLoaded = false;
        this.isVizReady = false;
    }

    async loadTableauScript() {
        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector('script[src*="tableau.embedding"]');
            if (existingScript) {
                // console.log("✅ Tableau script already exists");
                this.isScriptLoaded = true;
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.type = "module";
            script.src = "https://us-west-2b.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js";
            script.async = true;

            script.addEventListener('load', () => {
                // console.log("✅ Tableau script loaded successfully");
                this.isScriptLoaded = true;
                resolve(true);
            });

            script.addEventListener('error', (error) => {
                console.error("❌ Failed to load Tableau script:", error);
                reject(error);
            });

            document.head.appendChild(script);
        });
    }

    handleVizInit(vizElement) {
        if (!vizElement) {
            console.warn("⚠ No viz element provided");
            return false;
        }

        this.viz = vizElement;
        
        if (this.viz?.workbook) {
            this.isVizReady = true;
            // console.log("✅ Tableau viz initialized successfully");
            return true;
        }

        console.warn("⚠ Tableau workbook not ready yet");
        return false;
    }

    applyFilter(fieldName, value) {
        if (!this.isVizReady || !this.viz?.workbook) {
            console.warn('⚠ Tableau is not fully initialized yet. Skipping filter application.');
            return false;
        }
        
        try {
            const sheet = this.viz.workbook.activeSheet;
            const worksheet = sheet.worksheets?.find(ws => ws.name === 'updated Email metrics');
            
            if (Array.isArray(value)) {
                if (fieldName === 'Campaign Name') {
                    sheet.applyFilterAsync(fieldName, value.filter(Boolean), 'replace');
                } else if (fieldName === 'Date') {
                    if (worksheet && value[0] instanceof Date && value[1] instanceof Date) {
                        // Apply a single date range filter
                        worksheet.applyRangeFilterAsync(
                            'Date',  // Use base field name
                            {
                                min: value[0],
                                max: value[1]
                            }
                        );
                    }
                } else {
                    sheet.applyFilterAsync(fieldName, value, 'replace');
                }
            } else if (value === null) {
                this.clearFilter(fieldName);
            } else if (value === 'All') {
                sheet.applyFilterAsync(fieldName, [], 'all');
            } else {
                sheet.applyFilterAsync(fieldName, [value], 'replace');
            }
            
            // console.log(`✅ Applied filter: ${fieldName} =`, value);
            return true;
        } catch (error) {
            console.error(`❌ Error applying filter ${fieldName}:`, error);
            return false;
        }
    }

    clearFilter(fieldName) {
        if (!this.isVizReady || !this.viz?.workbook) {
            console.warn('⚠ Tableau not fully initialized yet. Cannot clear filter.');
            return false;
        }

        try {
            const sheet = this.viz.workbook.activeSheet;
            const worksheet = sheet.worksheets?.find(ws => ws.name === 'updated Email metrics');
            
            if (fieldName === 'Date') {
                if (worksheet) {
                    // Clear the date filter
                    worksheet.clearFilterAsync('Date');
                }
            } else {
                sheet.applyFilterAsync(fieldName, [], 'all');
            }
            
            // console.log(`✅ Cleared filter: ${fieldName}`);
            return true;
        } catch (error) {
            console.error(`❌ Error clearing filter ${fieldName}:`, error);
            return false;
        }
    }

    clearAllFilters(filterNames) {
        if (!Array.isArray(filterNames)) {
            console.warn('⚠ filterNames must be an array');
            return false;
        }

        return filterNames.every(filterName => this.clearFilter(filterName));
    }

    isTableauReady() {
        return this.isVizReady && 
               this.viz && 
               this.viz.workbook;
    }

    async getCampaignNames() {
        if (!this.isVizReady || !this.viz?.workbook) {
            console.warn("⚠ Tableau is not fully initialized yet.");
            return [];
        }

        try {
            const dashboard = this.viz.workbook.activeSheet;
            // console.log("📊 Dashboard:", dashboard.name);

            const sheets = dashboard.worksheets || [];
            // console.log("📑 Available sheets:", sheets.map(s => s.name));

            for (const sheet of sheets) {
                try {
                    // console.log(`\n🔍 Checking sheet: ${sheet.name}`);

                    const data = await sheet.getSummaryDataAsync({
                        ignoreSelection: true,
                        includeAllColumns: true
                    });

                    let columns = [];
                    if (typeof data.getColumns === 'function') {
                        columns = data.getColumns();
                    } else if (data.columns) {
                        columns = data.columns;
                    }

                    // Log all column information
                    // console.log("📊 Column Headers:", columns.map(col => ({
                    //     name: col.fieldName || col._fieldName,
                    //     index: col._index || col.index,
                    //     dataType: col.dataType || col._dataType,
                    //     id: col.fieldId || col._fieldId
                    // })));

                    const rows = data.getData?.() || data.data || [];
                    // console.log(`📊 Found ${rows.length} rows`);

                    // Log sample row data with headers
                    if (rows.length > 0) {
                        const sampleRow = rows[0];
                        const rowWithHeaders = columns.reduce((acc, col, index) => {
                            const cellValue = sampleRow[index]?.value || sampleRow[index];
                            acc[col.fieldName || col._fieldName] = cellValue;
                            return acc;
                        }, {});
                        // console.log("📊 Sample Row with Headers:", rowWithHeaders);
                    }

                    const campaignColumn = columns.find(col => {
                        const fieldName = col._fieldName || col.fieldName || '';
                        return fieldName === 'Campaign Name';
                    });

                    if (campaignColumn) {
                        // console.log("✅ Found campaign column:", campaignColumn._fieldName || campaignColumn.fieldName);
                        
                        const campaignNames = new Set();
                        const columnIndex = campaignColumn._index || campaignColumn.index;

                        rows.forEach(row => {
                            const cell = row[columnIndex];
                            const value = cell?.formattedValue || cell?.value || cell;
                            
                            if (value && typeof value === 'string') {
                                const cleaned = value.trim();
                                if (cleaned) {
                                    campaignNames.add(cleaned);
                                }
                            }
                        });

                        if (campaignNames.size > 0) {
                            const sortedCampaigns = Array.from(campaignNames)
                                .filter(Boolean)
                                .sort((a, b) => a.localeCompare(b));

                            // console.log("✅ Found campaigns:", sortedCampaigns);
                            return sortedCampaigns;
                        }
                    }
                } catch (sheetError) {
                    console.warn(`⚠ Error processing sheet ${sheet.name}:`, sheetError);
                    continue;
                }
            }

            console.error("❌ No campaign data found in any sheet");
            return [];

        } catch (error) {
            console.error("❌ Error retrieving campaign names:", error);
            console.error("Debug info:", {
                dashboardName: this.viz?.workbook?.activeSheet?.name,
                sheetCount: this.viz?.workbook?.activeSheet?.worksheets?.length,
                error: error.toString()
            });
            return [];
        }
    }

    async getAvailableFields() {
        if (!this.isVizReady || !this.viz?.workbook) {
            return [];
        }

        try {
            const dashboard = this.viz.workbook.activeSheet;
            const sheets = dashboard.worksheets || [];
            
            // console.log("📊 Checking fields in all sheets:");
            
            for (const worksheet of sheets) {
                try {
                    // console.log(`\n🔍 Sheet: ${worksheet.name}`);
                    
                    const data = await worksheet.getSummaryDataAsync({
                        ignoreSelection: true,
                        includeAllColumns: true
                    });
                    
                    let columns = [];
                    if (data.data && data.columns) {
                        columns = data.columns;
                    } else if (typeof data.getColumns === 'function') {
                        columns = data.getColumns();
                    }
                    
                    // console.log('Fields:', columns.map(col => ({
                    //     name: col.fieldName || col._fieldName,
                    //     id: col.fieldId || col._fieldId,
                    //     dataType: col.dataType || col._dataType
                    // })));
                } catch (error) {
                    console.warn(`⚠ Error getting fields from ${worksheet.name}:`, error);
                }
            }
            
            // Return fields from first worksheet for backward compatibility
            const worksheet = sheets[0];
            if (worksheet) {
                const data = await worksheet.getSummaryDataAsync({
                    ignoreSelection: true,
                    includeAllColumns: true
                });
                
                let columns = [];
                if (data.data && data.columns) {
                    columns = data.columns;
                } else if (typeof data.getColumns === 'function') {
                    columns = data.getColumns();
                }
                
                return columns;
            }
        } catch (error) {
            console.error('Error getting fields:', error);
            return [];
        }
    }

    async getCampaignMetrics(campaignNames) {
        if (!this.isVizReady || !this.viz?.workbook) {
            console.warn("⚠ Tableau is not fully initialized yet.");
            return null;
        }

        try {
            const worksheet = this.viz.workbook.activeSheet.worksheets?.find(ws => ws.name === 'updated Email metrics');
            if (!worksheet) {
                console.warn("⚠ Could not find 'updated Email metrics' worksheet");
                return null;
            }

            const data = await worksheet.getSummaryDataAsync({
                ignoreSelection: true,
                includeAllColumns: true
            });

            // Get columns using the correct method based on data structure
            let columns = [];
            if (data.data && data.columns) {
                columns = data.columns;
            } else if (typeof data.getColumns === 'function') {
                columns = data.getColumns();
            }

            // Get rows using the correct method based on data structure
            const rows = data.getData?.() || data.data || [];

            // Map column indices for the pivot format
            const columnMap = {
                campaignName: columns.findIndex(col => (col.fieldName || col._fieldName) === 'Campaign Name'),
                monthDate: columns.findIndex(col => (col.fieldName || col._fieldName) === 'MONTH(Date)'),
                dayDate: columns.findIndex(col => (col.fieldName || col._fieldName) === 'DAY(Date)'),
                measureName: columns.findIndex(col => (col.fieldName || col._fieldName) === 'Measure Names'),
                measureValue: columns.findIndex(col => (col.fieldName || col._fieldName) === 'Measure Values')
            };

            // Debug: Log unique measure names we're seeing
            const uniqueMeasureNames = new Set();
            rows.forEach(row => {
                const measureName = row[columnMap.measureName]?.value || row[columnMap.measureName];
                if (measureName) uniqueMeasureNames.add(measureName);
            });
            // console.log('Available Measures:', Array.from(uniqueMeasureNames));

            // Create a map of measure names to their normalized keys
            const measureMap = {
                // Total Sends
                '[sqlproxy.1vwal861d5yr5z1czsxwq1r00p81].[sum:iterable_total_sends:qk]': 'totalSends',
                
                // Delivered
                '[sqlproxy.1vwal861d5yr5z1czsxwq1r00p81].[sum:iterable_total_delivered:qk]': 'totalDelivered',
                
                // Delivery Rate
                '[sqlproxy.1vwal861d5yr5z1czsxwq1r00p81].[usr:Calculation_5980217412463558656:qk]': 'deliveryRate',
                
                // Unique Opens
                '[sqlproxy.1vwal861d5yr5z1czsxwq1r00p81].[sum:iterable_unique_open_clicks:qk]': 'uniqueOpenClicks',
                
                // Open Rate
                '[sqlproxy.1vwal861d5yr5z1czsxwq1r00p81].[usr:Calculation_5980217412465033217:qk]': 'openRate',
                
                // Total Clicks
                '[sqlproxy.1vwal861d5yr5z1czsxwq1r00p81].[sum:iterable_total_clicks:qk]': 'totalClicks',
                
                // Click to Open Rate
                '[sqlproxy.1vwal861d5yr5z1czsxwq1r00p81].[usr:Calculation_5980217412465561603:qk]': 'clickToOpenRate',
                
                // Click Through Rate
                '[sqlproxy.1vwal861d5yr5z1czsxwq1r00p81].[usr:Calculation_6445988101634551831:qk]': 'clickThruRate',
                
                // Unsubscribes
                '[sqlproxy.1vwal861d5yr5z1czsxwq1r00p81].[sum:iterable_unique_unsubscribers:qk]': 'uniqueUnsubscribers',
                
                // Unsubscribe Rate
                '[sqlproxy.1vwal861d5yr5z1czsxwq1r00p81].[usr:Calculation_5980217412465774596:qk]': 'unsubscribeRate',
                
                // Entries
                '[sqlproxy.09i8w5x0dt0zvw12du3qz01vxoid].[sum:entries:qk]': 'entries',
                
                // Total Leads
                '[sqlproxy.09i8w5x0dt0zvw12du3qz01vxoid].[sum:Calculation_1905304177753239555:qk]': 'totalLeads',
                
                // Dealer Leads
                '[sqlproxy.09i8w5x0dt0zvw12du3qz01vxoid].[sum:c. total leads (copy)_1905304177754034180:qk]': 'dealerLeads',
                
                // Conversion Rate
                '[sqlproxy.09i8w5x0dt0zvw12du3qz01vxoid].[usr:Calculation_1362620364465704960:qk]': 'conversion'
            };

            // Group the data by campaign and date
            const groupedData = rows.reduce((acc, row) => {
                const campaignValue = row[columnMap.campaignName]?.value || row[columnMap.campaignName];
                const monthDate = Number(row[columnMap.monthDate]?.value || row[columnMap.monthDate]) || 0;
                const dayDate = Number(row[columnMap.dayDate]?.value || row[columnMap.dayDate]) || 0;
                const measureName = row[columnMap.measureName]?.value || row[columnMap.measureName];
                const measureValue = Number(row[columnMap.measureValue]?.value || row[columnMap.measureValue]) || 0;

                if (!campaignNames.includes(campaignValue)) return acc;

                // Store daily metrics separately
                if (!acc[campaignValue]) {
                    acc[campaignValue] = {
                        dailyMetrics: {},
                        totals: {
                            emails_delivered: 0,
                            entries: 0,
                            leads: 0
                        },
                        rates: { conversion_rate: 0 },
                        trends: {
                            delivery_rate: 0,
                            entry_rate: 0,
                            lead_rate: 0,
                            conversion_trend: 0
                        }
                    };
                }

                const dateKey = `${monthDate}-${dayDate}`;
                if (!acc[campaignValue].dailyMetrics[dateKey]) {
                    acc[campaignValue].dailyMetrics[dateKey] = {
                        monthDate,
                        dayDate,
                        metrics: {}
                    };
                }

                // Map the measure name to our normalized key and store the value
                const normalizedKey = measureMap[measureName];
                if (normalizedKey) {
                    acc[campaignValue].dailyMetrics[dateKey].metrics[normalizedKey] = measureValue;
                    
                    // Update totals based on the measure
                    switch(normalizedKey) {
                        case 'totalDelivered':
                            acc[campaignValue].totals.emails_delivered += measureValue;
                            break;
                        case 'entries':
                            acc[campaignValue].totals.entries += measureValue;
                            break;
                        case 'totalLeads':
                            acc[campaignValue].totals.leads += measureValue;
                            break;
                    }
                } else if (measureName) {
                    // Debug: Log when we can't map a measure name
                    // console.log(`⚠️ No mapping for measure: ${measureName}`);
                }

                return acc;
            }, {});

            // Calculate conversion rates after all totals are summed
            Object.keys(groupedData).forEach(campaignValue => {
                const campaign = groupedData[campaignValue];
                // Calculate conversion rate as (leads / entries) * 100
                campaign.rates.conversion_rate = campaign.totals.entries > 0 
                    ? (campaign.totals.leads / campaign.totals.entries) * 100 
                    : 0;
            });

            // console.log('Processed Campaign Metrics:', groupedData);
            return groupedData;

        } catch (error) {
            console.error('❌ Error getting campaign metrics:', error);
            return null;
        }
    }
}

// Helper function to calculate trend percentage
function calculateTrend(rows, metricKey) {
    if (rows.length < 2) return 0;
    
    const currentValue = rows[rows.length - 1].metrics[metricKey] || 0;
    const previousValue = rows[rows.length - 2].metrics[metricKey] || 0;
    
    if (previousValue === 0) return 0;
    
    return ((currentValue - previousValue) / previousValue) * 100;
}

export default new TableauService();