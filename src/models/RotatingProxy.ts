import cheerio from 'cheerio';
import got from 'got';
import validator from 'validator';

export class RotatingProxy {
  private lastUpdated: number;
  private proxies: string[];

  constructor() {
    const instance = this.constructor['instance'];
    if (instance) return instance;
    this.constructor['instance'] = this;
  }

  private getRandomIndex(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getValidatedProxies(ipAddresses: string[], portNumbers: string[]): string[] {
    let proxies = [];
    for (let i = 0; i < ipAddresses.length; i++) {
      if (validator.isIP(ipAddresses[i]) && validator.isPort(portNumbers[i])) {
        proxies.push(`http://${ipAddresses[i]}:${portNumbers[i]}`);
      }
    }
    return proxies;
  }

  public async updateProxyList(): Promise<string> {
    try {
      const { statusCode, body: html } = await got('https://sslproxies.org/');

      if (statusCode == 200) {
        const $ = cheerio.load(html);
        let ipAddresses = [],
          portNumbers = [];
        $('td:nth-child(1)').each(function (index: number) {
          ipAddresses[index] = $(this).text();
        });
        $('td:nth-child(2)').each(function (index: number) {
          portNumbers[index] = $(this).text();
        });

        this.lastUpdated = Date.now();
        this.proxies = this.getValidatedProxies(ipAddresses, portNumbers);
        return 'Updated proxy list';
      } else {
        console.log('Unable to reach sslproxies!');
        return 'Unable to reach sslproxis';
      }
    } catch (e) {
      throw e;
    }
  }

  public getRotatingProxy(): string {
    const idx: number = this.getRandomIndex(0, this.proxies.length - 1);
    return this.proxies[idx];
  }

  public toString(): string {
    return `Rotating Proxy info :
    lastUpdated : ${this.lastUpdated}
    proxies : ${this.proxies.slice(0, 5)}`;
  }
}
