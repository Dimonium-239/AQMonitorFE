## Air Quality Monitor - Warsaw
This is front end app for fetching and showing data of air quality in Warsaw 
(sensor near main building of Warsaw University of Technology ).

Application is SPA (Single Page Application)

### Content
1. Title
2. City name
3. Start - End time pickers to choos timeframe for filtering
4. `Show series` with list of available series of air quality measurements
5. Chart drawing series of different air quality measurements
   (as all series have same unit µg/m³ it is safe to draw all plots in one chart)
   1. X-axis - timestamps of measurement
   2. Y-axis - µg/m³ of each series (using pow scale to make it more user-friendly)
   3. On the bottom of chart is legend for each line color.
6. Refresh button - re fetch data from server and write it to the DB and show on the chart and table
7. Add new measurement form. 
   1. City is currently unchangeable but may be on future realises
   2. Parameter is chosen from the drop-down list (protection from data-inconsistency and SQL injection)
   3. Value field accepts only numerical values (protection from SQL injection)
   4. Unit will be set automatically when parameter is chosen 
(as it is strictly related with parameter we can automatize selection for user)
   5. Time will be assigned on backend side.
   6. Add button add new measurement only if every field is filled
8. Measurements table
   1. It has columns: City, Parameters, Value, Units, Timestamp, Edit and Delete
   2. Each column can be sorted by clicking on column header name
   3. Table is paginated, and pagination is handled on FE side because for table and chart used same data.
9. Application is RWD so if page is in phone size (<= 600px) Add new measurement from line become column

### How to install
```bash
git clone https://github.com/Dimonium-239/AQMonitorFE.git
cd AQMonitorFE/
npm install
npm run dev
```

### Environments
[LOCAL] http://localhost:5173/

[DEV]   https://aq-monitor-fe.vercel.app/