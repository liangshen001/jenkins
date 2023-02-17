'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class Jenkins {
    constructor(option) {
        const debugTransformFunction = (message) => {
            return (data) => {
                option.debug && console.debug(message, data);
                return data;
            };
        };
        this.axiosInstance = axios.create({
            baseURL: `${option.protocol}://${option.host}:${option.port}`,
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${option.username}:${option.password}`).toString('base64')
            }
        });
        this.axiosInstance.interceptors.response.use(debugTransformFunction('response data:'));
        this.axiosInstance.interceptors.request.use(debugTransformFunction('request data:'));
        this.url = `${option.protocol}://${option.host}:${option.port}`;
    }
    getInfo(tree) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.axiosInstance.get('api/json', { params: { tree } });
            if (res.status === 200) {
                return res.data;
            }
            return Promise.reject(new JenkinsError('1', 'getInfo response Error', res));
        });
    }
    /**
     * @param jobName
     * @param tree 'jobs[name,color,description,inQueue,builds[number,building,executor[*]]{0}]'
     */
    getJob(jobName, tree) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.axiosInstance.get(`job/${jobName}/api/json`, { params: { tree } });
            if (res.status === 200) {
                return res.data;
            }
            return Promise.reject(new JenkinsError('2', 'getJob response Error', res));
        });
    }
    buildJob(jobName) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.axiosInstance.post(`job/${jobName}/build`);
            if (res.status === 201) {
                return res;
            }
            return Promise.reject(new JenkinsError('3', 'buildJob response Error', res));
        });
    }
    stopJob(jobName, buildNumber) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!buildNumber) {
                const job = yield this.getJob(jobName, 'lastBuild[building,number]');
                if (!((_a = job.lastBuild) === null || _a === void 0 ? void 0 : _a.building)) {
                    return Promise.reject(new JenkinsError('4', 'stopJob not found starting job'));
                }
                buildNumber = job.lastBuild.number;
            }
            const res = yield this.axiosInstance.post(`job/${jobName}/${buildNumber}/stop`);
            if (res.status === 200) {
                return buildNumber;
            }
            return Promise.reject(new JenkinsError('5', 'stopJob response Error', res));
        });
    }
}
class JenkinsError extends Error {
    constructor(code, message, response) {
        super(message); // (1)
        this.code = code;
        this.response = response;
        this.name = "JenkinsError"; // (2)
    }
}
// const jenkins = new Jenkins({
//     username: 'wangliang',
//     password: '11a80c78335a99c57def933dd1db506683',
//     protocol: 'http',
//     port: 6086,
//     host: 'jenkins.longtu.xyz',
//     // debug: true
// });
//
// // await jenkins.getInfo();
// await jenkins.buildJob('platform_manage_gsc_sandbox_page_118.31.122.16')
// await jenkins.cancelQueueItem('platform_manage_gsc_sandbox_page_118.31.122.16')
// await jenkins.buildJob('platform_manage_gsc_sandbox_page_118.31.122.16')
// try {
//
//     const job = await jenkins.stopJob('platform_manage_gsc_sandbox_page_118.31.122.162')
//     console.log(job);
// } catch (e) {
//     console.log(e);
// }
// try {
//
//     await jenkins.stopJob2('sdk3.0_chinaComm_sandbox')
// } catch (e: any) {
//     console.log(await e.text());
//
// }

exports.JenkinsError = JenkinsError;
exports.default = Jenkins;
