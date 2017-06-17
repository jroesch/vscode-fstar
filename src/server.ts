// type Message = {
//     query_id
// }

import * as child from 'child_process';
import * as carrier from 'carrier';

type Message = { "query-id" : number, query : string, args: {}}

type ResolveFn = (value : ({} | PromiseLike<{}>)) => void;

export class Server {
    queryId : number;
    responseMap : Map<number, ResolveFn>;
    initialized : boolean;

    constructor(initalFile : string) {
        let process = child.spawn("/Users/jroesch/Git/everest/FStar/bin/fstar-any.sh", ["--ide", initalFile]);
        carrier.carry(process.stdout, (line) => {
            if (!this.initialized) {
                console.log(line);
                this.initialized = true;
            } else {
                let json = JSON.parse(line) as Message;
                let query_id = json["query-id"];
                this.responseMap[json["query-id"]];
            }
        });
    }

    send(msg : Message) : Promise<string> {
        let query_id = msg["query-id"];
        return new Promise((resolve, reject) => {
            this.responseMap[query_id] = resolve;
            process.stdin.write(JSON.stringify(msg));
        });
    }
}
