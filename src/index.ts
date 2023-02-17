import axios, {AxiosInstance, AxiosResponse} from "axios";


export default class Jenkins {

    axiosInstance: AxiosInstance

    url: string;

    constructor(option: {
        username: string;
        password: string;
        host: string;
        protocol: 'http' | 'https';
        port: number;
        debug?: boolean;
    }) {
        const debugTransformFunction = (message: string) => {
            return (data: any) => {
                option.debug && console.debug(message, data);
                return data;
            }
        }
        this.axiosInstance = axios.create({
            baseURL: `${option.protocol}://${option.host}:${option.port}`,
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${option.username}:${option.password}`).toString('base64')
            }
        });
        this.axiosInstance.interceptors.response.use(debugTransformFunction('response data:'))
        this.axiosInstance.interceptors.request.use(debugTransformFunction('request data:'))
        this.url = `${option.protocol}://${option.host}:${option.port}`
    }

    async getInfo(tree?: string): Promise<Info> {
        const res = await this.axiosInstance.get('api/json', {params: {tree}});
        if (res.status === 200) {
            return res.data;
        }
        return Promise.reject(new JenkinsError('1', 'getInfo response Error', res));
    }

    /**
     * @param jobName
     * @param tree 'jobs[name,color,description,inQueue,builds[number,building,executor[*]]{0}]'
     */
    async getJob(jobName: string, tree?: string): Promise<Job> {
        const res = await this.axiosInstance.get(`job/${jobName}/api/json`, {params: {tree}});
        if (res.status === 200) {
            return res.data;
        }
        return Promise.reject(new JenkinsError('2', 'getJob response Error', res));
    }

    async buildJob(jobName: string) {
        const res = await this.axiosInstance.post(`job/${jobName}/build`);
        if (res.status === 201) {
            return res;
        }
        return Promise.reject(new JenkinsError('3', 'buildJob response Error', res));
    }

    async stopJob(jobName: string, buildNumber?: number) {
        if (!buildNumber) {
            const job = await this.getJob(jobName, 'lastBuild[building,number]')
            if (!job.lastBuild?.building) {
                return Promise.reject(new JenkinsError('4', 'stopJob not found starting job'));
            }
            buildNumber = job.lastBuild!.number;
        }
        const res = await this.axiosInstance.post(`job/${jobName}/${buildNumber}/stop`);
        if (res.status === 200) {
            return buildNumber!;
        }
        return Promise.reject(new JenkinsError('5', 'stopJob response Error', res));
    }

    // async cancelQueueItem(jobName: string): Promise<any>
    // async cancelQueueItem(queueItemId: number): Promise<any>
    // async cancelQueueItem(param: string | number, stopJob?: boolean) {
    //     if (typeof param === 'string') {
    //         const job = await this.getJob(param, 'inQueue,queueItem[*]')//'name,queueItem[*],inQueue,lastBuild[building,number]'
    //         if (job.inQueue) {
    //             console.log(job);
    //             return this.cancelQueueItem(job!.queueItem!.id)
    //         }
    //         if (job.lastBuild!.building && stopJob) {
    //             return this.stopJob(job.name!, job.lastBuild!.number)
    //         }
    //         return Promise.reject(new JenkinsError('6', 'cancelQueueItem queueItem not found'));
    //     }
    //     const res = await this.axiosInstance.post(`queue/cancelItem`, {}, {params: {id: param}});
    //     if (res.status === 204) {
    //         return res!;
    //     }
    //     return Promise.reject(new JenkinsError('7', 'cancelQueueItem response Error', res));
    // }

}

export interface Info {
    jobs?: Job[];
    mode?: string;
    nodeDescription?: string;
    nodeName?: string;
    description?: string;
    numExecutors?: number;
    primaryView?: View;
    url?: string;
    useCrumbs?: boolean;
    useSecurity?: boolean;
    views?: View[];
    slaveAgentPort?: number;
}

export interface View {
    name?: string;
    url?: string;
}

export interface Job {
    color?: JobColor;
    description?: string;
    displayName?: string;
    fullDisplayName?: string;
    fullName?: string;
    name?: string;
    url?: string;
    nextBuildNumber?: number;
    buildable?: boolean;
    builds?: JobBuild[];
    inQueue?: boolean;
    upstreamProjects?: Job[]
    downstreamProjects?: Job[]
    lastUnsuccessfulBuild?: JobBuild
    lastUnstableBuild?: JobBuild
    lastSuccessfulBuild?: JobBuild
    lastStableBuild?: JobBuild
    lastFailedBuild?: JobBuild
    lastCompletedBuild?: JobBuild
    lastBuild?: JobBuild
    queueItem?: JobQueueItem
}

export interface JobQueueItem {
    id: number;
    inQueueSince: number;
    params: string;
    stuck: boolean;
    url: string;
    why: string;
    buildableStartMilliseconds: string;
}

export interface JobBuild {
    number?: number;
    url?: string;

    building?: boolean;
    executor?: JobBuildExecutor;
}

export interface JobBuildExecutor {
    idle?: boolean;
    likelyStuck?: boolean;
    number?: number;
    progress?: number;
}

export type JobColor = 'blue' | 'notbuilt' | 'red' | 'aborted'

export class JenkinsError extends Error {
    constructor(public code: string,
                message: string,
                public response?: AxiosResponse) {
        super(message); // (1)
        this.name = "JenkinsError"; // (2)
    }
}
