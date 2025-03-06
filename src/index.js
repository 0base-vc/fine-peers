const ping = require('ping');
const axios = require('axios');

const getIP = (peer) => {
    //peer could be enode://0c5a4a3c0e81fce2974e4d317d88df783731183d534325e32e0fdf8f4b119d7889fa254d3a38890606ec300d744e2aa9c87099a4a032f5c94efe53f3fcdfecfe@34.64.176.79:30303 and 2784663b1c3fa2984b18cba3cffcd9af6c6ecef5@35.203.60.135:26656, parse IP
    if (peer) {
        return peer.split('@')[1].split(':')[0];
    }

    // if (peer) {
    //     return peer.split(':')[0].split('@')[1];
    // }
}

const getPeers = async (chain) => {
    return axios.get(`https://polkachu.com/api/v2/chains/${chain}/live_peers`).then(
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
        console.log("Please provide chain name or peers as argument");
        return;
    }

    let timeout = 99;
    if(process.argv[3]) {
        timeout = parseInt(process.argv[3]);
        console.log(`Timeout: ${timeout}`);
    }

    const finePeers = []
    if (process.argv[2].includes(',')) {
        const peers = process.argv[2].split(',');

        for (const peer of peers) {
            const ip = getIP(peer);
            const result = await ping.promise.probe(ip);
            if (result.alive) console.log(result.host, result.time);
            if (result.time < timeout) {
                finePeers.push(peer);
            }
        }

        console.log(finePeers.join(','));
        process.exit(0);

    } else {
        const chain = process.argv[2];

        setInterval(async () => {
            const peers = await getPeers(chain);

            for (const peer of peers) {
                const ip = getIP(peer);
                const result = await ping.promise.probe(ip);
                // if (result.alive) console.log(result.host, result.time);
                if (result.time < timeout) {
                    finePeers.push(peer);
                }
            }

            if (finePeers.length > 10) {
                console.log(finePeers.join(','));
                process.exit(0);
            }
        }, 5000);
    }
})();
