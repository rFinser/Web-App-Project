const apiKey = '0bd48b02abbb472fb708488fafdf7c3d';

async function getLatLng(req,res) {
    const address = req.body.address;
    try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&pretty=1`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const { lat, lng } = result.geometry;
            const country = result.components.country;

          //The address is valid and in Israel.
          if (country == 'ישראל') {
            res.json({lat, lng, address:result.formatted})
          } 
          //The address does not exist or is not in Israel.
          else {
            res.status(400).json({msg:'invalid address'});
          }
        } 
        //No results found in the api for the given address.
        else {
          res.status(400).json({msg:'invalid address'});
        }
      }
      //api error 
      catch (error) {
        console.error('Error fetching data:', error);
        res.status(400).json({msg:'invalid address'});
      }
}
module.exports ={
    getLatLng,
}