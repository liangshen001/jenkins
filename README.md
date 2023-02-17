# @liangshen/jenkins

远程调用Jenkins服务器API

## 安装
```
npm i @liangshen/jenkins
```

## 使用

```typescript
import Jenkins from "@liangshen/jenkins";
export const jenkins = new Jenkins({
    port: 6086,
    host: 'jenkins.longtu.xyz',
    username: 'wangliang',
    password: 'xxxxxxxxxxxxxxxxxxxxxxxx',
    protocol: 'http'
});
// 获取Jenkins API信息
const info = await jenkins.getInfo('jobs[name,color,description,inQueue,builds[number,building,executor[*]]{0}]');
console.log(info);

// 构建某个任务
await jenkins.buildJob('job_name');

// 获取某个任务的信息
const job = await jenkins.getJob('job_name')
console.log(job);

// 停止构建某个任务
await jenkins.stopJob('job_name')


```

