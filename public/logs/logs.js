getData();
async function getData(){
        const response = await  fetch('/api');
        const data = await response.json();
        console.log(data);

        for (item of data){
            const root = document.createElement('div');
            const pledge= document.createElement('div');
            const geo= document.createElement('div');
            const date= document.createElement('div');
            

            pledge.textContent = `pledge: ${item.pledge}`;
            geo.textContent = `geo: ${item.lat}°, ${item.lon}°`;
            const dateString = new Date (item.timestamp).toLocaleString();
            date.textContent = dateString;
            

            root.append(pledge, geo, date);
            document.body.append (root);

        }
        console.log (data)
}