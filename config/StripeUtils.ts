import { Stripe } from 'stripe'
import { StripePrivateKey } from './EnvironmentVariables'
// import { HttpProxyAgent } from 'http-proxy-agent'

export const StripeClient = new Stripe(StripePrivateKey, {
    apiVersion: '2020-08-27', // Current npm package version
    // Uncomment this to target local devbox
    // host: process.env.USER + '-api-mydev.dev.stripe.me',
    // protocol: 'http',
    // port: undefined,
    // httpAgent: new HttpProxyAgent('http://localhost:2375')
})
