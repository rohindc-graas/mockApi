const fs = require('fs');

module.exports = {
  getGoogleAdsData: async function (req, res) {
    try {
      const data = await new Promise((resolve, reject) => {

        const fromClauseRegex = /FROM\s+([\w\s.,]+)\s+(?:WHERE|$)/i;
        const query = req.body.query;
        let adType = query.match(fromClauseRegex)[1];
        console.log("adType: " + adType)
        fs.readFile(`src/json/${adType}.json`, 'utf8', (err, data) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }
          resolve(data);
        });
      });

      res.setHeader('Content-Type', req.headers['content-type'])

      let paginatedData = getPaginatedData(data, req)

      return paginatedData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
  function getPaginatedData (data, req){
    let startIndex = 0;
    let pageLimit = req.body.pageSize
    const jsonData = JSON.parse(data);
    console.log("Total length: " + jsonData.results.length);
    if(req.body.hasOwnProperty("pageToken")){
      startIndex = Number(req.body.pageToken)
    }
    const hasMoreItems = (startIndex + pageLimit) < jsonData.results.length;
    const currentPageItems = {
      results: jsonData.results.slice(startIndex, startIndex + pageLimit)
    }

    if (hasMoreItems) {
      currentPageItems.nextPageToken = startIndex + pageLimit;
    }
    console.log("Final length: " + currentPageItems.results.length)
    return currentPageItems;
  }
