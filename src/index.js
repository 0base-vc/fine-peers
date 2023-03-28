const ping = require('ping');
const axios = require('axios');

const getIP = (peer) => {
    if (peer) {
        return peer.split(':')[0].split('@')[1];
    }
}

const getPeers = async (chain) => {
    return axios.get(`https://polkachu.com/api/v1/chains/${chain}/live_peers`).then(
        (response) => {
            return response.data.live_peers;
        }
    ).catch(
        (error) => {
            console.log(error.response.data.message);
            return [];
        }
    );
};

(async () => {
    if (!process.argv[2]) {
        console.log("Please provide chain name as argument");
        return;
    }

    const goodPeers = []
    const chain = process.argv[2];
    const peers = await getPeers(chain);

    for (const peer of peers) {
        const ip = getIP(peer);
        const result = await ping.promise.probe(ip);
        if (result.alive) console.log(result.host, result.time);

        if (result.time < 100) {
            goodPeers.push(peer);
        }
    }

    console.log(goodPeers.join(','));

})();
