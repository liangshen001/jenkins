import { AxiosInstance, AxiosResponse } from "axios";
export default class Jenkins {
    axiosInstance: AxiosInstance;
    url: string;
    constructor(option: {
        username: string;
        password: string;
        host: string;
        protocol: 'http' | 'https';
        port: number;
        debug?: boolean;
    });
    getInfo(tree?: string): Promise<Info>;
    /**
     * @param jobName
     * @param tree 'jobs[name,color,description,inQueue,builds[number,building,executor[*]]{0}]'
     */
    getJob(jobName: string, tree?: string): Promise<Job>;
    buildJob(jobName: string): Promise<AxiosResponse<any, any>>;
    stopJob(jobName: string, buildNumber?: number): Promise<number>;
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
    upstreamProjects?: Job[];
    downstreamProjects?: Job[];
    lastUnsuccessfulBuild?: JobBuild;
    lastUnstableBuild?: JobBuild;
    lastSuccessfulBuild?: JobBuild;
    lastStableBuild?: JobBuild;
    lastFailedBuild?: JobBuild;
    lastCompletedBuild?: JobBuild;
    lastBuild?: JobBuild;
    queueItem?: JobQueueItem;
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
export declare type JobColor = 'blue' | 'notbuilt' | 'red' | 'aborted';
export declare class JenkinsError extends Error {
    code: string;
    response?: AxiosResponse<any, any> | undefined;
    constructor(code: string, message: string, response?: AxiosResponse<any, any> | undefined);
}
