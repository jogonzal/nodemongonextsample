import type { NextApiRequest, NextApiResponse } from 'next'
import { hostUrl } from '../../config/EnvironmentVariables';
import { StripeClient } from '../../config/StripeUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const searchParams = new URLSearchParams(req.url!.split('?')[1])
    const connectedAccountId: string = searchParams.get("connectedAccountId")!
    const productName: string = searchParams.get("productName")!
    const amount: number = parseInt(searchParams.get("amount")!)
    const applicationFee: number = parseInt(searchParams.get("applicationFee")!)
    const currency = 'usd'
    const quantity = 1

    console.log('Params are', connectedAccountId, productName, amount, applicationFee)

    console.log('Id is ', connectedAccountId)
    const redirectUrl = `${hostUrl}?accountId=${encodeURIComponent(connectedAccountId)}`

    console.log('Redirect url is ', redirectUrl)

    const session = await StripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            name: productName,
            amount: amount,
            currency: currency,
            quantity: quantity,
        }],
        payment_intent_data: {
            application_fee_amount: applicationFee,
        },
        mode: 'payment',
        success_url: redirectUrl,
        cancel_url: redirectUrl,
      }, {
        stripeAccount: connectedAccountId,
    });
 
    console.log('Created link!', session)

    if (!session.url) {
        throw new Error('Session did not contain url!')
    }

    res.redirect(303, session.url)
  } catch (error) {
    const errorAsAny = error as any
    const errorMessage = (errorAsAny && errorAsAny.message) ? errorAsAny.message : 'unknown'
    console.log('Error while creating', error)
    res.status(500).json({ error: errorMessage })
  }
}
