import cron from 'node-cron';
import { RotatingProxy } from '../models/RotatingProxy';

class UpdateProxyListCron {
  private updateProxyListCron: any;

  constructor() {
    const instance = this.constructor['instance'];
    if (instance) return instance;
    this.updateProxyListCron = cron.schedule('*/5 * * * *', this.updateProxyList);
    this.constructor['instance'] = this;
  }

  private updateProxyList() {
    console.log(
      `\nUpdating proxy list at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`
    );
    const rotatingProxy = new RotatingProxy();
    rotatingProxy.updateProxyList().then(() => {
      console.log(rotatingProxy.toString());
    });
  }

  public start() {
    this.updateProxyList();
    this.updateProxyListCron.start();
  }
}

const updateProxyListCron = new UpdateProxyListCron();

export default updateProxyListCron;
