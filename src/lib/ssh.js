import fs from "fs/promises";
import net from "net"
import { NodeSSH } from "node-ssh";
import { toFilePath, sshConfiguration, logger } from "../utils.js";

export class SSH {
    constructor(config = {}) {
        this.logger = logger(config.verbose);
        this.nodeSSH = new NodeSSH();
        this.config = config
        this.connected = false;
    }

    async connect() {
        this.config = await sshConfiguration(this.config);
        this.logger("connect", this.config);
        let { privateKeyPath, port, host, username, password, passphrase } = this.config;
        let privateKey;
        if (privateKeyPath) {
            privateKey = await fs.readFile(toFilePath(privateKeyPath), "ascii");
        }
        await this.nodeSSH.connect({
            port,
            host,
            username,
            privateKey,
            password,
            passphrase,
        });
        this.logger("ssh connected");
        this.connected = true;
    }

    forwardOut({ remotePort, localPort, host }) {
        const conn = this.nodeSSH.getConnection();
        net.createServer(function (sock) {
            conn.forwardOut(host, localPort, '127.0.0.1', remotePort, function (err, stream) {
                if (err) throw err;
                console.log(`Listening for connections on port 127.0.0.1:${remotePort}`)
                sock.on('data', function (data) {
                    if (stream.write(data) === false) {
                        sock.pause();
                    }
                });
                stream.on('drain', function () {
                    sock.resume();
                });
                stream.on('data', function (data) {
                    sock.write(data);
                });
            });
        }).listen(localPort);
    }

    forwardIn({ remotePort, localPort, host }) {
        const conn = this.nodeSSH.getConnection();

        conn.forwardIn('127.0.0.1', remotePort, (err) => {
            if (err) throw err;
            console.log(`Listening for connections on server on port 127.0.0.1:${remotePort}`);
        });

        conn.on('tcp connection', (info, accept, reject) => {
            console.log('TCP :: INCOMING CONNECTION:', info.destPort);
            accept().on('close', () => {
                console.log('TCP :: CLOSED');
            }).on('data', (data) => {
                console.log('TCP :: DATA: ' + data);
            }).end([
                'HTTP/1.1 404 Not Found',
                'Date: Thu, 15 Nov 2012 02:07:58 GMT',
                'Server: ForwardedConnection',
                'Content-Length: 0',
                'Connection: close',
                '',
                ''
            ].join('\r\n'));
        })
    }
}

export default SSH;
