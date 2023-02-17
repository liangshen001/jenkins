import Jenkins from "../src";

describe("Test", () => {
    test("index", async () => {
        const jenkins = new Jenkins({
            username: 'wangliang',
            password: '11a80c78335a99c57def933dd1db506683',
            protocol: 'http',
            port: 6086,
            host: 'jenkins.longtu.xyz',
            // debug: true
        });
        const info = await jenkins.getInfo()

        await jenkins.buildJob('platform_manage_gsc_sandbox_page_118.31.122.16')
        // await jenkins.cancelQueueItem('platform_manage_gsc_sandbox_page_118.31.122.16')


        await jenkins.buildJob('platform_manage_gsc_sandbox_page_118.31.122.16')
        try {

            const job = await jenkins.stopJob('platform_manage_gsc_sandbox_page_118.31.122.162')
            console.log(job);
        } catch (e) {
            console.log(e);
        }
        // try {
        //
        //     await jenkins.stopJob2('sdk3.0_chinaComm_sandbox')
        // } catch (e: any) {
        //     console.log(await e.text());
        //
        // }
    });
});