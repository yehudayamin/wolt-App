/*
 * viewsClient.js - TCP client for communicating with the C++ Ex2 server
*/

const net = require('net'); //to use tcp...
const HOST = process.env.CPP_SERVER_HOST || '127.0.0.1'; //cpp server ip
const PORT = process.env.CPP_SERVER_PORT || 5555; //tcp server port

function registerView(userId, productId){
    return new Promise((resolve, reject)=> {
        let hasRetried = false
        //create connection to cpp server. lambda function is to ensure the connection exists before sending data
        const client = net.createConnection({ port: PORT, host: HOST }, () => {
            //send the message to the cpp server, try with patch
            client.write('PATCH '+userId+' '+productId+'\n')
        });
        //when you recieve something from the server:
        client.on('data', (data) => {
            //read the data
            const response = data.toString();
            if (response.includes('404') && !hasRetried) {//meaning the user doesnt exist, so we need post
                hasRetried = true
                client.write('POST '+userId+' '+productId+'\n')
                return
            }
            //close the connection
            client.destroy();
            
            //send back the answer and return the promise
            resolve(response);
        });
        client.on('error', (err) => { //catch an error from the cpp server
            console.error("TCP Error: ", err.message);
            resolve("Error: " + err.message);
        });
    })
}
function deleteView(userId, productId) {
    return new Promise((resolve) => {
        const client = net.createConnection({ port: PORT, host: HOST }, () => {
            client.write('DELETE ' + userId + ' ' + productId + '\n');
        });
        client.on('data', (data) => {
            client.destroy();
            resolve(data.toString());
        });
        client.on('error', (err) => {
            console.error("TCP Error: ", err.message);
            resolve("Error: " + err.message);
        });
    });
}

module.exports = { registerView, deleteView }; //so other files can import this file...